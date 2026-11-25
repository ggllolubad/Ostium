// The Guesthouse: where the hired company sleeps between descents. A warm, low room of boards and limewash, the one
// generous fire in the abbey in a deep hearth at the back right, double bunks against the back wall at the left, a long
// table with benches, packs and boots and drying cloaks everywhere. The roster heroes who are not in the party rest here,
// each one clickable (it opens the company screen on that hero). The Hosteller stands by the standing desk with the guest
// book (the panel), lantern held out. The door out is in the back wall between the bunks and the hearth.
const I = require('./interior')('guesthouse', { width: 10, depth: 7.6, height: 3.6, wall: '#584e40', wall2: '#5e5444', floorCol: '#4a3a2a', floor: 'boards', ceilCol: '#33271b', render: 6, renderCol: '#7a7060', seed: 9907, panel: 'guestbook', beamGap: 1.3 });
const { a, R, P, K, pp, f, G, INK, mix, dark, light, smooth, blob, PLW, EM, addLight, stones, shade, planks, through, hot, outline, HOT, HW, D1, HT, prop, face, box, rod, seg3, candles, lantern, smoke, fireTongues, sack, barrel, D } = I;
const DETAIL = process.env.PASS !== 'base';
const Pr = require('./props')(I);
const WOOD = '#4a3624', WOODL = '#6a5034', WOOL = '#5a4e40';
const KEEPER = { X: 2.05, Z: 4.55, h: 1.7, sprite: 'hosteller', label: 'The Hosteller', figure: [170, 830] };
// the roster's rest spots: feet position and depth; the game fills them with whoever is not in the party
const ROSTER = [{ X: -3.75, Z: 6.25, name: 'hexweaver', flip: false }, { X: -1.75, Z: 6.0, name: 'alchemist', flip: false }, { X: 4.3, Z: 6.0, name: 'duelist', flip: false }];

I.shell();
I.door(5.95, 6.85, { side: -1, square: true, ts: 1.9 });   // the guesthouse's garth door faces west

// ------------------------------------------------------------------ the hearth: a deep stone fireplace with a chimney breast to the beams, the one generous fire
{
  const x0 = 1.4, x1 = 4.4, z = D1 - 0.55, ht = 1.5;
  box(x0, x1, 0, HT, z, D1 - 0.01, '#5e564a', { shade: false });
  const atF = (s, t) => [x0 + s, t, z];
  a.raw(stones(atF, x1 - x0, HT, '#5e564a', { course: 0.3, block: 0.55 }));
  shade([atF(0, 0), atF(x1 - x0, 0), atF(x1 - x0, HT), atF(0, HT)], { depth: 16, mottle: 0.5, grime: 0.6, ink: 2, wash: 0.3 });
  const mouth = [[x0 + 0.4, 0.12, z - 0.01], [x1 - 0.4, 0.12, z - 0.01], [x1 - 0.4, ht, z - 0.01], [x0 + 0.4, ht, z - 0.01]];
  through(mouth, () => {
    const gid = a.id('hf');
    a.raw(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e0806"/><stop offset="0.6" stop-color="#3a160a"/><stop offset="1" stop-color="#8a3a12"/></linearGradient>`);
    a.raw(EM(`<path d="${pp(mouth)}" fill="url(#${gid})"/>`));
    // firedogs, logs, the fire
    const [fx, fy] = P((x0 + x1) / 2, 0.2, z + 0.3), fk = K(z);
    for (const d of [-0.5, 0.5]) a.raw(rod([(x0 + x1) / 2 + d, 0.12, z + 0.2], [(x0 + x1) / 2 + d, 0.45, z + 0.2], '#2a2826', 5));
    for (let k = 0; k < 3; k++) a.raw(rod([(x0 + x1) / 2 - 0.7, 0.18 + k * 0.1, z + 0.25 + k * 0.05], [(x0 + x1) / 2 + 0.7, 0.2 + k * 0.08, z + 0.3], '#2a1a10', 16) + rod([(x0 + x1) / 2 - 0.68, 0.18 + k * 0.1, z + 0.24 + k * 0.05], [(x0 + x1) / 2 + 0.2, 0.19 + k * 0.08, z + 0.27], '#ff7a2a', 3) + rod([(x0 + x1) / 2 - 0.7, 0.25 + k * 0.08, z + 0.25 + k * 0.05], [(x0 + x1) / 2 + 0.7, 0.28 + k * 0.06, z + 0.3], '#3a2418', 10));
    // the firebox's back: old brick, glowing red where the fire licks it
    let br = ''; for (let r = 0; r < 7; r++) for (let c = 0; c < 9; c++) { const X = x0 + 0.45 + c * 0.24 + (r % 2) * 0.12, Y = 0.15 + r * 0.19; if (X < x1 - 0.45) br += `<path d="${pp([[X, Y, z + 0.55], [X + 0.22, Y, z + 0.55], [X + 0.22, Y + 0.17, z + 0.55], [X, Y + 0.17, z + 0.55]])}" fill="none" stroke="#1a0a04" stroke-width="1.2" opacity="0.8"/>`; }
    a.raw(br);
    a.raw(fireTongues(fx, fy - fk * 0.05, fk * 0.55, fk * 1.1));
    a.raw(D.embers(fx, fy - fk * 0.4, fk * 1.0, 14));
    // a pot on a crane over the fire
    a.raw(seg3([x0 + 0.5, ht - 0.1, z + 0.1], [(x0 + x1) / 2, ht - 0.1, z + 0.3], '#2a2826', 4) + seg3([(x0 + x1) / 2, ht - 0.1, z + 0.3], [(x0 + x1) / 2, 0.95, z + 0.3], '#2a2826', 2));
    const [px, py] = P((x0 + x1) / 2, 0.95, z + 0.3), ps = K(z);
    a.shape({ d: `M${f(px - ps * 0.2)} ${f(py)} Q${f(px - ps * 0.22)} ${f(py + ps * 0.3)} ${f(px)} ${f(py + ps * 0.32)} Q${f(px + ps * 0.22)} ${f(py + ps * 0.3)} ${f(px + ps * 0.2)} ${f(py)} Z`, fill: '#2a2826', depth: 6, ink: 2, hatch: 30 });
  });
  a.raw(a.glow(...P((x0 + x1) / 2, 0.6, z), K(z) * 2.2, '#ff8a3a', 0.45));
  // the lintel: a great beam, sooted
  face([[x0 + 0.3, ht, z - 0.03], [x1 - 0.3, ht, z - 0.03], [x1 - 0.3, ht + 0.3, z - 0.03], [x0 + 0.3, ht + 0.3, z - 0.03]], '#2e2218', 2, `<path d="${pp([[x0 + 0.3, ht, z - 0.03], [x1 - 0.3, ht, z - 0.03], [x1 - 0.3, ht + 0.3, z - 0.03], [x0 + 0.3, ht + 0.3, z - 0.03]])}" fill="url(#grain)" opacity="0.5"/>`);
  // things on the mantel: a row of tankards, a candle, a hanging cloak drying, boots before the fire
  { const my = ht + 0.3, mz = z - 0.1;
    const tank = (X, col) => { const [tx, ty] = P(X, my, mz), ts = K(z) * (0.85 + R() * 0.3); a.raw(`<path d="M${f(tx - ts * 0.05)} ${f(ty)} L${f(tx - ts * 0.045)} ${f(ty - ts * 0.12)} L${f(tx + ts * 0.045)} ${f(ty - ts * 0.12)} L${f(tx + ts * 0.05)} ${f(ty)} Z" fill="${I.metal(col)}" stroke="${INK}" stroke-width="1.3"/><path d="M${f(tx - ts * 0.05)} ${f(ty - ts * 0.03)} L${f(tx + ts * 0.05)} ${f(ty - ts * 0.03)} M${f(tx - ts * 0.047)} ${f(ty - ts * 0.09)} L${f(tx + ts * 0.047)} ${f(ty - ts * 0.09)}" stroke="${INK}" stroke-width="1"/><path d="M${f(tx + ts * 0.05)} ${f(ty - ts * 0.09)} q${f(ts * 0.04)} ${f(ts * 0.03)} 0 ${f(ts * 0.06)}" stroke="${INK}" stroke-width="1.4" fill="none"/>`); };
    tank(x0 + 0.5, '#6a6460'); Pr.food(x0 + 0.8, my, mz, 'crock'); Pr.bottle(x0 + 1.05, my, mz, '#3a5a2a'); tank(x0 + 1.3, '#5a4430');
    { const [px, py] = P(x0 + 1.75, my, mz + 0.05), ps = K(z); a.raw(`<ellipse cx="${f(px)}" cy="${f(py - ps * 0.12)}" rx="${f(ps * 0.12)}" ry="${f(ps * 0.13)}" fill="${I.metal('#8a8680')}" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${f(px)}" cy="${f(py - ps * 0.12)}" rx="${f(ps * 0.07)}" ry="${f(ps * 0.08)}" fill="none" stroke="#5a5650" stroke-width="1"/>`); }
    a.raw(candles(x0 + 2.15, mz, 1, my, 0.05)); Pr.food(x0 + 2.4, my, mz, 'crock'); tank(x0 + 2.62, '#7a7068');
    a.raw(seg3([x0 + 0.65, my - 0.04, z - 0.04], [x0 + 0.6, my - 0.42, z - 0.04], '#2a2826', 2.4) + seg3([x1 - 0.6, my - 0.04, z - 0.04], [x1 - 0.55, my - 0.5, z - 0.04], '#2a2826', 2.4));
    { const [lx, ly] = P(x0 + 0.6, my - 0.42, z - 0.04), ls = K(z); a.raw(`<ellipse cx="${f(lx)}" cy="${f(ly + ls * 0.02)}" rx="${f(ls * 0.05)}" ry="${f(ls * 0.025)}" fill="${I.metal('#5a5650')}" stroke="${INK}" stroke-width="1.2"/>`); } }
  // a log pile stacked against the chimney breast: ends of different girth, split and whole, bark and cut faces
  { const lz = z - 0.25; let k = 0;
    for (const [row, n] of [[0, 4], [1, 3], [2, 2]]) for (let i = 0; i < n; i++) { const X = x0 - 0.6 + i * 0.2 + row * 0.1 + (R() - 0.5) * 0.03, Y = 0.1 + row * 0.17, r = 0.07 + R() * 0.035, [lx, ly] = P(X, Y, lz), ls = K(lz) * r, split = R() < 0.35;
      a.raw(split ? `<path d="M${f(lx - ls)} ${f(ly + ls * 0.5)} L${f(lx + ls)} ${f(ly + ls * 0.5)} A${f(ls)} ${f(ls)} 0 0 0 ${f(lx - ls)} ${f(ly + ls * 0.5)} Z" fill="#b89868" stroke="${INK}" stroke-width="1.6"/>` : `<circle cx="${f(lx)}" cy="${f(ly)}" r="${f(ls)}" fill="#3a2a1a" stroke="${INK}" stroke-width="1.6"/><circle cx="${f(lx)}" cy="${f(ly)}" r="${f(ls * 0.8)}" fill="${mix('#b89868', '#8a6a3a', R())}"/>` + [0.55, 0.3].map(t => `<circle cx="${f(lx + 1)}" cy="${f(ly)}" r="${f(ls * t)}" fill="none" stroke="#6a4a2a" stroke-width="0.7"/>`).join('') + (R() < 0.5 ? `<path d="M${f(lx)} ${f(ly)} l${f(ls * 0.7)} ${f(-ls * 0.3)}" stroke="#4a3018" stroke-width="0.9"/>` : ''));
      k++; } }
  addLight((x0 + x1) / 2, 0.8, z - 0.5, 1.5, 8.0, [1.0, 0.56, 0.24]);
}
function S_bloom(X, Y, Z) { return I.bloom(...P(X, Y, Z), K(Z) * 0.8, '#0a0806', 0.5, 0.4); }
// ------------------------------------------------------------------ the bunks against the back wall at the left: two double bunks, blankets, packs
for (const [x0, x1] of [[-4.3, -2.55], [-2.4, -0.65]]) prop(D1 - 1.0, () => {
  const z0 = D1 - 1.0, z1 = D1 - 0.03;
  for (const X of [x0, x1]) I.woodBox(X - 0.04, X + 0.04, 0, 2.25, z0 - 0.04, z0 + 0.04, WOOD, { boards: 1, knots: 0.5 });
  for (const Y of [0.35, 1.35]) {
    I.woodBox(x0, x1, Y, Y + 0.12, z0, z1, WOOD, { boards: 1 });
    // the straw mattress and a rumpled blanket, a bolster
    const mt = [[x0 + 0.03, Y + 0.12, z0 + 0.03], [x1 - 0.03, Y + 0.12, z0 + 0.03], [x1 - 0.03, Y + 0.12, z1 - 0.05], [x0 + 0.03, Y + 0.12, z1 - 0.05]];
    face(mt, '#8a7a5a', 1.2);
    const bl = []; for (let k = 0; k <= 10; k++) { const X = x0 + 0.05 + (x1 - x0 - 0.3) * k / 10; bl.push(P(X, Y + 0.18 + Math.sin(k * 1.3) * 0.04 + R() * 0.03, z0 + 0.05)); }
    a.shape({ d: smooth([P(x0 + 0.05, Y + 0.12, z0 + 0.03), ...bl, P(x1 - 0.25, Y + 0.12, z0 + 0.03), P(x1 - 0.2, Y - 0.12, z0 + 0.02), P(x0 + 0.3, Y - 0.08, z0 + 0.02)], true, 0.4), fill: (c0 => I.grad(light(c0, 0.12), dark(c0, 0.35)))(['#5a3a2a', '#3a4a3a', '#4a4a5a', '#6a5a3a', '#5a2a24', '#3a3a30'][Math.floor(R() * 6)]), depth: 8, ink: 1.6, hatch: 70, grime: 0.5, tex: 'url(#weave)', texOp: 0.4, lines: [0.2, 0.45, 0.7].map(t => { const [lx, ly] = P(x0 + 0.1 + (x1 - x0 - 0.4) * t + (R() - 0.5) * 0.1, Y + 0.17, z0 + 0.05); return { d: `M${f(lx)} ${f(ly)} q${f((R() - 0.5) * 8)} ${f(K(z0) * 0.1)} ${f((R() - 0.5) * 6)} ${f(K(z0) * 0.2)}`, w: 1.3, op: 0.45 }; }), decals: R() < 0.5 ? `<rect x="${f(P((x0 + x1) / 2, Y, z0)[0])}" y="${f(P((x0 + x1) / 2, Y + 0.12, z0)[1])}" width="${f(K(z0) * 0.18)}" height="${f(K(z0) * 0.1)}" fill="#3a3026" opacity="0.6" stroke="${INK}" stroke-width="0.7" stroke-dasharray="2 1.5"/>` : '' });
    for (let k = 0; k < 8; k++) { const [sx, sy] = P(x0 + 0.1 + R() * (x1 - x0 - 0.2), Y + 0.1, z0 + 0.03); a.raw(`<path d="M${f(sx)} ${f(sy)} l${f((R() - 0.5) * 10)} ${f(4 + R() * 6)}" stroke="#a8904a" stroke-width="1"/>`); }
    const [bx, by] = P(x1 - 0.18, Y + 0.2, (z0 + z1) / 2), bs = K(z0); a.shape({ d: blob(bx, by, bs * (0.11 + R() * 0.04), R, 9, 0.2).replace(/./, 'M'), fill: I.grad('#c8bea4', '#7a7058'), depth: 4, ink: 1.4, hatch: 60, tex: 'url(#weave)', texOp: 0.4 });
    if (Y > 1 && x0 < -3) Pr.sack(x0 + 0.45, Y + 0.12, z0 + 0.4);
  }
  // a pack and a sword hung on the bunk post
  const [hx, hy] = P(x1 + 0.02, 1.9, z0 - 0.02), hs = K(z0);
  a.raw(`<path d="M${f(hx)} ${f(hy)} l${f(hs * 0.02)} ${f(hs * 0.75)}" stroke="${INK}" stroke-width="${f(hs * 0.04 + 2)}"/><path d="M${f(hx)} ${f(hy)} l${f(hs * 0.02)} ${f(hs * 0.75)}" stroke="#3a2a1a" stroke-width="${f(hs * 0.04)}"/><path d="M${f(hx - hs * 0.08)} ${f(hy + hs * 0.08)} l${f(hs * 0.16)} 0" stroke="${INK}" stroke-width="3"/>`);
});
// cloaks and wet socks on a line before the hearth, boots in a row
prop(5.8, () => {
  const xs = -0.6, xe = 4.6, Y = 2.4, Z = 5.8, pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(P(xs + (xe - xs) * t, Y - Math.sin(t * Math.PI) * 0.25, Z)); }
  a.raw(`<path d="${smooth(pts, false, 0.5)}" stroke="${INK}" stroke-width="1.4" fill="none"/>`);
  for (const [i, kind] of [[2, 'cloak'], [4, 'sock'], [5, 'sock'], [7, 'shirt'], [9, 'sock']]) { const [x, y] = pts[i], s = K(Z);
    const h = kind === 'cloak' ? 0.75 : kind === 'shirt' ? 0.5 : 0.28, w = kind === 'sock' ? 0.06 : 0.22;
    a.shape({ d: smooth([[x - s * w, y], [x + s * w, y], [x + s * w * 1.1, y + s * h * 0.6], [x + s * w * (kind === 'sock' ? 2 : 0.9), y + s * h], [x - s * w, y + s * h * 0.95]], true, 0.4), fill: (c0 => I.grad(light(c0, 0.1), dark(c0, 0.3), false))(kind === 'cloak' ? '#3a3a34' : kind === 'shirt' ? '#8a826e' : ['#6a5a4a', '#5a5a5a', '#7a5a3a'][i % 3]), depth: 5, ink: 1.4, hatch: 70, tex: 'url(#weave)', texOp: 0.4, grime: 0.4, lines: kind === 'sock' ? [{ d: `M${f(x - s * w)} ${f(y + s * 0.05)} l${f(s * w * 2)} 0`, w: 1.6, col: '#c8b890', op: 0.6 }] : [{ d: `M${f(x - s * w * 0.3)} ${f(y + 3)} Q${f(x - s * w * 0.4)} ${f(y + s * h * 0.5)} ${f(x - s * w * 0.2)} ${f(y + s * h * 0.9)}`, w: 1.2, op: 0.5 }], decals: R() < 0.6 ? a.stain(x, y + s * h * 0.7, s * w * 0.6, '#140c06', 0.4) : '' }); }
});
// ------------------------------------------------------------------ the long table is in front of the resting heroes: its own layer, drawn over them
a.layer('mid');
// the long table: bread, a jug, cups, dice, a candle stuck in its own wax
prop(4.9, () => {
  const x0 = -3.6, x1 = -0.6, z0 = 4.9, z1 = 5.6, top = 0.78;
  for (const [X, Z] of [[x0 + 0.15, z1 - 0.1], [x1 - 0.15, z1 - 0.1], [x0 + 0.15, z0 + 0.1], [x1 - 0.15, z0 + 0.1]]) a.raw(rod([X, 0, Z], [X, top, Z], WOOD, 7));
  I.wood([[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]], WOODL, { bw: 0.18 });
  I.wood([[x0, top - 0.07, z0], [x1, top - 0.07, z0], [x1, top, z0], [x0, top, z0]], WOOD, { boards: 1 });
  I.woodBox(x0 + 0.6, x1, 0.4, 0.47, z0 - 0.45, z0 - 0.2, WOOD, { bw: 0.12 });
  for (const X of [x0 + 0.8, x1 - 0.2]) a.raw(rod([X, 0, z0 - 0.33], [X, 0.4, z0 - 0.33], WOOD, 6));
  const it = (X, Z, kind) => { const [x, y] = P(X, top, Z), s = K(Z);
    if (kind === 'jug') a.shape({ d: `M${f(x - s * 0.06)} ${f(y)} Q${f(x - s * 0.1)} ${f(y - s * 0.14)} ${f(x - s * 0.04)} ${f(y - s * 0.22)} L${f(x + s * 0.04)} ${f(y - s * 0.22)} Q${f(x + s * 0.1)} ${f(y - s * 0.14)} ${f(x + s * 0.06)} ${f(y)} Z`, fill: '#7a5a3a', depth: 4, ink: 1.6, hatch: 60 });
    if (kind === 'bread') a.shape({ d: smooth([[x - s * 0.12, y], [x - s * 0.1, y - s * 0.08], [x, y - s * 0.1], [x + s * 0.1, y - s * 0.08], [x + s * 0.12, y]], true, 0.6), fill: '#8a6a3e', depth: 4, ink: 1.4, hatch: 60 });
    if (kind === 'cup') { const h = s * (0.06 + R() * 0.04), w = s * (0.03 + R() * 0.015); a.raw(`<path d="M${f(x - w)} ${f(y)} L${f(x - w * 1.1)} ${f(y - h)} L${f(x + w * 1.1)} ${f(y - h)} L${f(x + w)} ${f(y)} Z" fill="${I.metal(['#6a6460', '#5a4430', '#7a6a52'][Math.floor(R() * 3)])}" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w * 1.1)}" ry="${f(w * 0.3)}" fill="#2a1a10" stroke="${INK}" stroke-width="0.8"/>`); }
    if (kind === 'dice') a.raw(`<rect x="${f(x)}" y="${f(y - 6)}" width="6" height="6" fill="#d8ccb0" stroke="${INK}" stroke-width="0.8"/><rect x="${f(x + 8)}" y="${f(y - 5)}" width="6" height="6" fill="#d8ccb0" stroke="${INK}" stroke-width="0.8"/>`); };
  Pr.food(-3.25, top, 5.2, 'round'); Pr.food(-2.95, top, 5.35, 'cut'); Pr.food(-2.6, top, 5.3, 'crock'); Pr.bottle(-2.35, top, 5.4, '#5a3a1a');
  { const [tx, ty] = P(-2.85, top, 5.05), ts = K(5.05); a.raw(`<ellipse cx="${f(tx)}" cy="${f(ty)}" rx="${f(ts * 0.13)}" ry="${f(ts * 0.035)}" fill="#6a5038" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${f(tx)}" cy="${f(ty - 1)}" rx="${f(ts * 0.09)}" ry="${f(ts * 0.022)}" fill="#4a3220" opacity="0.6"/>` + Array.from({ length: 6 }, () => `<circle cx="${f(tx + (R() - 0.5) * ts * 0.25)}" cy="${f(ty + (R() - 0.3) * ts * 0.03)}" r="1.3" fill="#a8885a"/>`).join('')); }
  it(-2.15, 5.12, 'cup'); it(-1.88, 5.38, 'cup'); it(-1.5, 5.15, 'dice'); Pr.food(-1.2, top, 5.4, 'cheese', 0.09); it(-0.95, 5.2, 'jug');
  { const [kx, ky] = P(-1.65, top, 5.42), ks = K(5.42); a.raw(`<path d="M${f(kx)} ${f(ky - 1)} l${f(ks * 0.12)} ${f(-ks * 0.01)}" stroke="${G.steelL}" stroke-width="2.4"/><path d="M${f(kx - ks * 0.06)} ${f(ky)} l${f(ks * 0.06)} ${f(-ks * 0.005)}" stroke="${G.wood}" stroke-width="3.4"/>`); }
  a.raw(candles(-2.0, 5.2, 1, top, 0.1));
  addLight(-2.0, 1.1, 5.1, 0.35, 3.0, [1.0, 0.72, 0.42]);
});
// ================================================================== FG: the standing desk with the guest book, packs dumped by the door
a.layer('fg');
prop(4.25, () => {
  const X = 0.95, Z = 4.25, s = K(Z), lo = 1.05, hi = 1.2;
  a.raw(rod([X, 0, Z + 0.1], [X, lo, Z + 0.1], WOOD, 12));
  box(X - 0.25, X + 0.25, 0, 0.1, Z - 0.05, Z + 0.3, WOOD, { shade: false });
  const tp = [[X - 0.4, lo, Z - 0.12], [X + 0.4, lo, Z - 0.12], [X + 0.4, hi, Z + 0.25], [X - 0.4, hi, Z + 0.25]];
  face(tp, WOODL, 2);
  a.raw('<g class="panel">');
  // the guest book: thick, open near the end, a column of names in one hand, a quill in the gutter
  const Y = z => lo + (hi - lo) * (z - Z + 0.12) / 0.37 + 0.02;
  const pg = [[X - 0.33, Y(Z - 0.08), Z - 0.08], [X + 0.33, Y(Z - 0.08), Z - 0.08], [X + 0.33, Y(Z + 0.2), Z + 0.2], [X - 0.33, Y(Z + 0.2), Z + 0.2]];
  face([[X - 0.36, Y(Z - 0.1) - 0.02, Z - 0.1], [X + 0.36, Y(Z - 0.1) - 0.02, Z - 0.1], [X + 0.36, Y(Z + 0.22) - 0.02, Z + 0.22], [X - 0.36, Y(Z + 0.22) - 0.02, Z + 0.22]], '#4a2a1c', 1.6);
  face(pg, '#d8ccae', 1.4);
  let t = ''; for (let r = 0; r < 9; r++) { const zz = Z - 0.05 + r * 0.028; t += `<path d="${pp([[X - 0.28, Y(zz) + 0.01, zz], [X - 0.05 - R() * 0.1, Y(zz) + 0.01, zz]]).replace(' Z', '')}" stroke="#2a201a" stroke-width="1" opacity="0.75"/><path d="${pp([[X + 0.05, Y(zz) + 0.01, zz], [X + 0.25 - R() * 0.1, Y(zz) + 0.01, zz]]).replace(' Z', '')}" stroke="#2a201a" stroke-width="1" opacity="${r < 5 ? 0.75 : 0}"/>`; }
  a.raw(t);
  a.raw('</g>');
  hot('guestbook', 'The guest book', [P(X - 0.4, lo, Z - 0.12), P(X + 0.4, lo, Z - 0.12), P(X + 0.4, hi, Z + 0.25), P(X - 0.4, hi, Z + 0.25)]);
});
// the Hosteller's lantern, held out over the desk
addLight(KEEPER.X - 0.45, 1.0, KEEPER.Z - 0.2, 0.7, 3.5, [1.0, 0.72, 0.42]);
addLight(KEEPER.X + 0.4, 1.1, KEEPER.Z + 0.9, 0.7, 3.0, [1.0, 0.56, 0.26]);    // the fire's heat on his back and side
addLight(-1.95, 1.9, 5.8, 0.35, 3.0, [1.0, 0.62, 0.3]);                        // the alchemist's flame
if (DETAIL) prop(3.7, () => {
  // a dropped blanket, mugs on the boards, a bucket of ash by the hearth, ash spilled in a fan
  const bl = [P(-1.2, 0.01, 3.3), P(-0.4, 0.01, 3.2), P(-0.2, 0.08, 3.55), P(-0.6, 0.01, 3.9), P(-1.3, 0.05, 3.7)];
  a.shape({ d: smooth(bl, true, 0.5), fill: I.grad('#6a5a44', '#2e2418'), depth: 6, ink: 1.8, hatch: 70, grime: 0.5, tex: 'url(#weave)', texOp: 0.5, lines: [[-1.0, 3.35, -0.5, 3.75], [-0.8, 3.3, -0.35, 3.5], [-1.15, 3.55, -0.7, 3.8]].map(([xa, za, xb, zb]) => { const p0 = P(xa, 0.03, za), p1 = P(xb, 0.03, zb); return { d: `M${f(p0[0])} ${f(p0[1])} Q${f((p0[0] + p1[0]) / 2 + 6)} ${f((p0[1] + p1[1]) / 2 - 5)} ${f(p1[0])} ${f(p1[1])}`, w: 1.6, col: '#1a1a22', op: 0.6 }; }), decals: [[-1.15, 3.3, -0.35, 3.25, '#7a1a14'], [-1.2, 3.42, -0.3, 3.38, '#c8b890'], [-1.25, 3.62, -0.4, 3.58, '#7a1a14']].map(([xa, za, xb, zb, c]) => { const p0 = P(xa, 0.03, za), p1 = P(xb, 0.04, zb); return `<path d="M${f(p0[0])} ${f(p0[1])} Q${f((p0[0] + p1[0]) / 2)} ${f((p0[1] + p1[1]) / 2 - 4)} ${f(p1[0])} ${f(p1[1])}" stroke="${c}" stroke-width="5" fill="none" opacity="0.7"/>`; }).join('') });
  for (const [X, Z, tip] of [[0.1, 3.0, false], [0.45, 3.3, true], [-2.0, 4.2, false]]) { const [x, y] = P(X, 0, Z), s2 = K(Z); a.raw(tip ? `<path d="M${f(x - s2 * 0.06)} ${f(y)} L${f(x + s2 * 0.06)} ${f(y - s2 * 0.02)} L${f(x + s2 * 0.07)} ${f(y - s2 * 0.08)} L${f(x - s2 * 0.05)} ${f(y - s2 * 0.07)} Z" fill="#6a6460" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${f(x + s2 * 0.12)}" cy="${f(y)}" rx="${f(s2 * 0.08)}" ry="${f(s2 * 0.015)}" fill="#3a1a10" opacity="0.7"/>` : `<path d="M${f(x - s2 * 0.04)} ${f(y)} L${f(x - s2 * 0.045)} ${f(y - s2 * 0.1)} L${f(x + s2 * 0.045)} ${f(y - s2 * 0.1)} L${f(x + s2 * 0.04)} ${f(y)} Z" fill="#6a6460" stroke="${INK}" stroke-width="1.4"/><path d="M${f(x + s2 * 0.045)} ${f(y - s2 * 0.08)} q${f(s2 * 0.04)} ${f(s2 * 0.03)} 0 ${f(s2 * 0.06)}" stroke="${INK}" stroke-width="1.6" fill="none"/>`); }
  let ash = ''; for (let k = 0; k < 50; k++) { const [x, y] = P(2.2 + R() * 1.6, 0, 6.0 + R() * 0.8); ash += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1 + R() * 2)}" fill="${R() < 0.5 ? '#6a6660' : '#2a2826'}" opacity="0.8"/>`; }
  a.raw(ash);
});
prop(3.2, () => { Pr.sack(-2.75, 0, 3.25); Pr.sack(-2.2, 0, 3.4, { open: true, contents: '#3a3a30' }); const [x, y] = P(-1.75, 0, 3.15), s = K(3.15); for (const dx of [-0.06, 0.06]) a.shape({ d: smooth([[x + s * dx - s * 0.05, y - s * 0.32], [x + s * dx + s * 0.05, y - s * 0.32], [x + s * dx + s * 0.05, y - s * 0.06], [x + s * dx + s * 0.12, y], [x + s * dx - s * 0.08, y], [x + s * dx - s * 0.06, y - s * 0.1]], true, 0.4), fill: I.grad('#4a3222', '#1e140c', false), depth: 5, ink: 1.8, hatch: 60, grime: 0.5, lines: [{ d: `M${f(x + s * dx - s * 0.05)} ${f(y - s * 0.27)} l${f(s * 0.1)} 0`, w: 1.4, op: 0.6 }, { d: `M${f(x + s * dx - s * 0.08)} ${f(y - s * 0.01)} l${f(s * 0.2)} 0`, w: 2, col: '#140c06' }], spec: [`M${f(x + s * dx - s * 0.02)} ${f(y - s * 0.28)} L${f(x + s * dx - s * 0.02)} ${f(y - s * 0.1)}`], specOp: 0.2 }); });
prop(3.0, () => { barrel(3.6, 3.1); });

I.write(KEEPER, { roster: ROSTER.map((r, i) => ({ slot: i, name: r.name, flip: r.flip, feet: P(r.X, 0, r.Z).map(f), height_px: f(K(r.Z) * 1.85), z: r.Z })) });
