// The Chapter House: Prior Aldric's hall, the one clean room in the abbey. A tall vault, a stone bench round the walls
// where the chapter sits, the Prior's seat against the back wall under the order's red banners, abbots' tomb slabs set in
// the floor, tall iron candle stands. The charter (the panel) lies on a lectern before the seat; Aldric stands beside it.
// The door out is in the back wall at the far left.
const I = require('./interior')('chapter', { width: 11, depth: 9.5, height: 5.6, vault: true, spring: 3.6, wall: '#56504a', wall2: '#5e5850', vaultCol: '#4e4842', floorCol: '#46423c', seed: 7307, panel: 'charter', ribs: [7.6, 5.2] });
const { a, R, P, K, pp, f, G, INK, mix, dark, light, smooth, blob, PLW, EM, addLight, stones, shade, planks, through, hot, outline, HOT, HW, D1, HT, prop, face, box, rod, seg3, candles, lantern } = I;
const DETAIL = process.env.PASS !== 'base';
const Pr = require('./props')(I);
const WOOD = '#3a2a1e', STONE = '#6a6458', RED = '#6a1612';
const KEEPER = { X: 1.05, Z: 4.75, h: 1.85, sprite: 'aldric', label: 'Prior Aldric', figure: [110, 830] };
const LECT = { X: -0.75, Z: 4.35 };

I.shell();
I.door(6.8, 7.8, { side: -1, ts: 2.1 });   // the chapter house's garth door faces west
// tomb slabs in the floor: incised effigies, names worn off
for (const [X, Z] of [[-1.1, 5.9], [1.1, 5.9], [-1.1, 7.5], [1.1, 7.5]]) {
  const q = [[X - 0.45, 0.005, Z], [X + 0.45, 0.005, Z], [X + 0.45, 0.005, Z + 1.0], [X - 0.45, 0.005, Z + 1.0]];
  face(q, '#56524a', 1.6);
  const fig = [[X - 0.12, 0.006, Z + 0.15], [X + 0.12, 0.006, Z + 0.15], [X + 0.16, 0.006, Z + 0.7], [X, 0.006, Z + 0.86], [X - 0.16, 0.006, Z + 0.7]];
  let lt = ''; for (let k = 0; k < 9; k++) { const z2 = Z + 0.06 + k * 0.1; lt += `<path d="${pp([[X - 0.41, 0.006, z2], [X - 0.41, 0.006, z2 + 0.06]]).replace(' Z', '')}" stroke="#2a2620" stroke-width="1.2"/>`; }
  a.raw(PLW([q[0], q[1], q[3]], lt + `<path d="${pp(fig)}" fill="#4a463e" stroke="#2a2620" stroke-width="1.4"/><path d="${pp([[X + 0.1, 0.006, Z + 0.2], [X + 0.3, 0.006, Z + 0.5], [X + 0.2, 0.006, Z + 0.8]]).replace(' Z', '')}" stroke="#1e1c18" stroke-width="1.2" fill="none"/>` + a.stain(...P(X - 0.2, 0, Z + 0.3), K(Z) * 0.06, '#2a2620', 0.5)));
  a.raw(PLW([q[0], q[1], q[3]], `<path d="${pp(fig)}" fill="none" stroke="#2a2620" stroke-width="1.4"/><path d="${pp([[X - 0.38, 0.006, Z + 0.06], [X + 0.38, 0.006, Z + 0.06], [X + 0.38, 0.006, Z + 0.94], [X - 0.38, 0.006, Z + 0.94]])}" fill="none" stroke="#2a2620" stroke-width="1" stroke-dasharray="6 3"/>`));
}
// a worn runner of red wool from the lectern to the seat, frayed and patched, its border pattern trodden grey down the middle
{ const x0 = -0.42, x1 = 0.42, z0 = 4.75, z1 = D1 - 1.0, q = [[x0, 0.007, z0], [x1, 0.007, z0], [x1, 0.007, z1], [x0, 0.007, z1]];
  let o = `<path d="${pp(q)}" fill="${I.grad('#5a1a14', '#3a100c')}" stroke="${INK}" stroke-width="1.4"/><path d="${pp(q)}" fill="url(#weave)" opacity="0.5"/>`;
  for (const X of [x0 + 0.06, x1 - 0.06]) o += `<path d="${pp([[X, 0.008, z0 + 0.05], [X, 0.008, z1 - 0.05]]).replace(' Z', '')}" stroke="${G.gold}" stroke-width="2" opacity="0.55" stroke-dasharray="6 3"/>`;
  for (let z = z0 + 0.25; z < z1 - 0.1; z += 0.45) o += `<path d="${pp([[-0.12, 0.008, z], [0, 0.008, z + 0.12], [0.12, 0.008, z], [0, 0.008, z - 0.12]])}" fill="none" stroke="${G.gold}" stroke-width="1.6" opacity="0.4"/>`;
  o += `<path d="${pp([[-0.2, 0.008, z0], [0.2, 0.008, z0], [0.16, 0.008, z1], [-0.16, 0.008, z1]])}" fill="#2a2420" opacity="0.4"/>`;
  o += `<path d="${pp([[0.15, 0.008, 6.1], [0.35, 0.008, 6.1], [0.35, 0.008, 6.5], [0.15, 0.008, 6.5]])}" fill="#4a3a2a" stroke="${INK}" stroke-width="1" stroke-dasharray="3 2"/>`;
  let fr = ''; for (let X = x0; X <= x1; X += 0.035) { const [fx, fy] = P(X, 0.008, z0), s = K(z0); fr += `M${f(fx)} ${f(fy)} l${f((R() - 0.5) * 3)} ${f(s * 0.03)} `; }
  a.raw(PLW([q[0], q[1], q[3]], o) + `<path d="${fr}" stroke="#6a2a1a" stroke-width="1.2"/>`); }
// the stone bench round the back and side walls
box(-HW, HW, 0, 0.48, D1 - 0.5, D1 - 0.01, STONE, { depth: 8 });
box(HW - 0.5, HW, 0, 0.48, 4.5, D1 - 0.5, STONE, { depth: 8 });
for (const [z0, z1] of [[4.5, 6.55], [8.05, D1 - 0.5]]) box(-HW, -HW + 0.5, 0, 0.48, z0, z1, STONE, { depth: 8 });
// what the chapter left on the bench: cushions worn flat, a cloak, a psalter, a cup, a rolled brief, a guttered stub
{ const bz = D1 - 0.25, by = 0.48;
  for (const [X, col] of [[-4.6, '#4a1a14'], [-3.1, '#3a3a30'], [2.7, '#5a3a2a'], [4.3, '#4a1a14']]) prop(bz, () => { const [x, y] = P(X, by, bz), s = K(bz), w = s * (0.22 + R() * 0.08); a.shape({ d: smooth([[x - w, y], [x - w * 1.02, y - s * 0.05], [x - w * 0.7, y - s * 0.08], [x + w * 0.7, y - s * 0.075], [x + w, y - s * 0.04], [x + w * 0.98, y]], true, 0.5), fill: I.grad(light(col, 0.15), dark(col, 0.3)), depth: 3, ink: 1.4, hatch: 70, tex: 'url(#weave)', texOp: 0.4, lines: [{ d: `M${f(x - w * 0.7)} ${f(y - s * 0.04)} Q${f(x)} ${f(y - s * 0.02)} ${f(x + w * 0.7)} ${f(y - s * 0.04)}`, w: 0.9, op: 0.5 }] }); for (const dx of [-w, w]) a.raw(`<path d="M${f(x + dx)} ${f(y - s * 0.03)} l${f(Math.sign(dx) * 4)} ${f(s * 0.02)}" stroke="${G.gold}" stroke-width="2"/>`); });
  prop(bz, () => { Pr.folded(-2.2, by, bz - 0.05, 2, ['#2a2a30', '#3a3a34']); });
  prop(bz, () => { const [x, y] = P(3.4, by, bz - 0.1), s = K(bz); a.raw(`<rect x="${f(x - s * 0.12)}" y="${f(y - s * 0.05)}" width="${f(s * 0.24)}" height="${f(s * 0.05)}" fill="#3a1a14" stroke="${INK}" stroke-width="1.2"/><rect x="${f(x - s * 0.115)}" y="${f(y - s * 0.04)}" width="${f(s * 0.23)}" height="${f(s * 0.03)}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.6"/><rect x="${f(x - s * 0.12)}" y="${f(y - s * 0.055)}" width="${f(s * 0.24)}" height="${f(s * 0.015)}" fill="#3a1a14" stroke="${INK}" stroke-width="0.8"/>`); Pr.food(3.85, by, bz - 0.1, 'crock'); });
  prop(bz, () => { const [x, y] = P(-3.8, by, bz - 0.1), s = K(bz); a.raw(`<path d="M${f(x - s * 0.15)} ${f(y - s * 0.03)} L${f(x + s * 0.15)} ${f(y - s * 0.035)}" stroke="${INK}" stroke-width="${f(s * 0.06 + 2)}" stroke-linecap="round"/><path d="M${f(x - s * 0.15)} ${f(y - s * 0.03)} L${f(x + s * 0.15)} ${f(y - s * 0.035)}" stroke="#d8ccb0" stroke-width="${f(s * 0.06)}" stroke-linecap="round"/><path d="M${f(x)} ${f(y - s * 0.06)} l0 ${f(s * 0.08)}" stroke="#8a1a14" stroke-width="2"/><circle cx="${f(x)}" cy="${f(y + s * 0.03)}" r="${f(s * 0.02)}" fill="#6a120e" stroke="${INK}" stroke-width="0.8"/>`); a.raw(candles(-1.6, bz - 0.1, 1, by, 0.05)); });
}
// memorial boards on the back wall: the names of the brothers dead in the Grey, painted and painted over
for (const [X, Y, w, h, n] of [[-3.6, 1.2, 0.9, 1.3, 14]]) prop(D1 - 0.03, () => {
  const z = D1 - 0.03, q = [[X - w / 2, Y, z], [X + w / 2, Y, z], [X + w / 2, Y + h, z], [X - w / 2, Y + h, z]];
  I.wood(q, '#2e2018', { bw: h / 3, knots: 0.2 });
  const inner = [[X - w / 2 + 0.06, Y + 0.06, z - 0.003], [X + w / 2 - 0.06, Y + 0.06, z - 0.003], [X + w / 2 - 0.06, Y + h - 0.16, z - 0.003], [X - w / 2 + 0.06, Y + h - 0.16, z - 0.003]];
  face(inner, '#1a1410', 1, '', { plain: true });
  let t = `<path d="${pp([[X - w / 2 + 0.1, Y + h - 0.1, z - 0.004], [X + w / 2 - 0.1, Y + h - 0.1, z - 0.004]]).replace(' Z', '')}" stroke="${G.gold}" stroke-width="2.2"/>`;
  for (let r = 0; r < n; r++) { const yy = Y + h - 0.22 - r * (h - 0.32) / n, len = (w - 0.2) * (0.4 + R() * 0.55), struck = R() < 0.15; t += `<path d="${pp([[X - w / 2 + 0.1, yy, z - 0.004], [X - w / 2 + 0.1 + len, yy, z - 0.004]]).replace(' Z', '')}" stroke="${r > n - 4 ? '#e8e0d0' : '#c8b890'}" stroke-width="1.1" opacity="${r > n - 4 ? 0.9 : 0.6}" stroke-dasharray="${f(2 + R() * 3)} 1.2"/>`; if (struck) t += `<path d="${pp([[X - w / 2 + 0.09, yy + 0.005, z - 0.005], [X - w / 2 + 0.12 + len, yy - 0.005, z - 0.005]]).replace(' Z', '')}" stroke="#8a1a14" stroke-width="1.2"/>`; }
  a.raw(t);
});
// the right side of the back wall: the armarium, a deep cupboard in the wall, one door open on rolled charters and a seal box
prop(D1 - 0.05, () => {
  const x0 = 2.9, x1 = 4.0, y0 = 0.9, y1 = 2.4, z = D1 - 0.02, hole = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
  through(hole, () => { face(hole, '#140e0a', 1.2); for (const Y of [1.4, 1.9]) face([[x0, Y, z], [x1, Y, z], [x1, Y, z + 0.4], [x0, Y, z + 0.4]], '#3a2a1c', 1);
    for (const [Y, n] of [[y0, 6], [1.4, 4], [1.9, 3]]) for (let k = 0; k < n; k++) { const X = x0 + 0.12 + k * 0.16 + (R() - 0.5) * 0.04, [rx, ry] = P(X, Y + 0.06, z + 0.2), rs = K(z); a.raw(`<ellipse cx="${f(rx)}" cy="${f(ry)}" rx="${f(rs * 0.05)}" ry="${f(rs * 0.05)}" fill="${mix('#d8ccb0', '#8a7a5a', R() * 0.6)}" stroke="${INK}" stroke-width="1"/><circle cx="${f(rx)}" cy="${f(ry)}" r="${f(rs * 0.015)}" fill="none" stroke="#6a5a40" stroke-width="0.8"/>` + (R() < 0.4 ? `<path d="M${f(rx)} ${f(ry + rs * 0.05)} l0 ${f(rs * 0.08)}" stroke="#c8b890" stroke-width="1"/><circle cx="${f(rx)}" cy="${f(ry + rs * 0.14)}" r="${f(rs * 0.02)}" fill="#6a120e" stroke="${INK}" stroke-width="0.6"/>` : '')); } });
  for (const [p, q] of [[[x0 - 0.1, y0 - 0.1], [x0, y1 + 0.1]], [[x1, y0 - 0.1], [x1 + 0.1, y1 + 0.1]], [[x0 - 0.1, y1], [x1 + 0.1, y1 + 0.12]], [[x0 - 0.1, y0 - 0.12], [x1 + 0.1, y0]]]) I.wood([[p[0], p[1], z - 0.01], [q[0], p[1], z - 0.01], [q[0], q[1], z - 0.01], [p[0], q[1], z - 0.01]], '#2e2018', { boards: 1, knots: 0.3 });
  I.wood([[x0, y0, z - 0.02], [x0 - 0.12, y0, z - 0.5], [x0 - 0.12, y1, z - 0.5], [x0, y1, z - 0.02]], '#3a2a1c', { bw: 0.18 });
  { const [kx, ky] = P(x0 - 0.1, 1.6, z - 0.45), ks = K(z); a.raw(`<circle cx="${f(kx)}" cy="${f(ky)}" r="${f(ks * 0.03)}" fill="none" stroke="#2a2826" stroke-width="3"/>`); }
});
// the floor: a stool knocked over, a coffer of charters at the lectern's foot, rushes scattered thin
prop(5.6, () => {
  Pr.rushes(-2.5, 2.8, 4.2, 7.8, 70, ['#5a5030', '#6a6038', '#4a4228']);
  I.woodBox(-2.05, -1.45, 0, 0.35, 5.05, 5.45, '#3a2a1c', { bw: 0.1 });
  { const [x, y] = P(-1.75, 0.35, 5.05), s = K(5.05); a.raw(`<path d="M${f(x - s * 0.18)} ${f(y - 2)} l${f(s * 0.36)} 0" stroke="#2a2826" stroke-width="4"/>`); for (let k = 0; k < 3; k++) { const [sx, sy] = P(-1.95 + k * 0.18, 0.35, 5.2); a.raw(`<path d="M${f(sx)} ${f(sy)} q${f(s * 0.04)} ${f(-s * 0.06)} ${f(s * 0.08)} 0" stroke="#d8ccb0" stroke-width="${f(s * 0.04)}" fill="none"/>`); } }
  const [x, y] = P(2.3, 0, 5.6), s = K(5.6);
  a.raw(`<g transform="rotate(-78 ${f(x)} ${f(y)})"><rect x="${f(x - s * 0.18)}" y="${f(y - s * 0.05)}" width="${f(s * 0.36)}" height="${f(s * 0.05)}" fill="#4a3624" stroke="${INK}" stroke-width="1.4"/>` + [-0.14, 0, 0.14].map(d => `<path d="M${f(x + s * d)} ${f(y)} l${f(d * s * 0.3)} ${f(s * 0.4)}" stroke="${INK}" stroke-width="${f(s * 0.025 + 2)}"/><path d="M${f(x + s * d)} ${f(y)} l${f(d * s * 0.3)} ${f(s * 0.4)}" stroke="#4a3624" stroke-width="${f(s * 0.025)}"/>`).join('') + `</g>`);
});
// the Prior's seat: a tall canopied chair of black oak on a step, flanked by the order's banners
prop(D1 - 0.6, () => {
  const z = D1 - 0.6;
  box(-1.0, 1.0, 0, 0.25, z - 0.4, D1 - 0.02, STONE, { depth: 8 });
  I.woodBox(-0.6, 0.6, 0.25, 0.75, z - 0.1, D1 - 0.1, WOOD, { bw: 0.12 });
  for (const X of [-0.66, 0.54]) I.woodBox(X, X + 0.12, 0.75, 1.15, z - 0.1, D1 - 0.12, WOOD, { bw: 0.06 });
  face([[-0.55, 0.76, z - 0.08], [0.55, 0.76, z - 0.08], [0.55, 0.76, D1 - 0.12], [-0.55, 0.76, D1 - 0.12]], '#6a1a14', 1.4);
  a.shape({ d: smooth([P(-0.52, 0.76, z - 0.07), P(0.52, 0.76, z - 0.07), P(0.5, 0.86, z - 0.04), P(-0.5, 0.86, z - 0.04)], true, 0.5), fill: I.grad('#8a2a1e', '#4a0e0a'), depth: 3, ink: 1.4, hatch: 70, tex: 'url(#weave)', texOp: 0.4 });
  const back = [[-0.62, 0.75, D1 - 0.1], [0.62, 0.75, D1 - 0.1], [0.62, 3.2, D1 - 0.1], [0, 3.6, D1 - 0.1], [-0.62, 3.2, D1 - 0.1]];
  I.wood([back[0], back[1], back[2], [-0.62, 3.2, D1 - 0.1]], WOOD, { bw: 0.2, knots: 0.2 });
  face([[-0.62, 3.2, D1 - 0.1], [0.62, 3.2, D1 - 0.1], [0, 3.6, D1 - 0.1]], WOOD, 2);
  shade(back, { depth: 12, grime: 0.3, ink: 0, wash: 0.3 });
  // blind tracery carved across the back: a row of pointed arches under the canopy, crockets up the gable, finials
  { let tr = ''; for (let k = 0; k < 4; k++) { const xa = -0.52 + k * 0.27, xb = xa + 0.22; tr += `<path d="${pp([[xa, 2.75, D1 - 0.105], [xa, 3.0, D1 - 0.105], [xa + 0.11, 3.12, D1 - 0.105], [xb, 3.0, D1 - 0.105], [xb, 2.75, D1 - 0.105]])}" fill="#1a120c" stroke="${INK}" stroke-width="1.2" opacity="0.8"/>`; }
    for (let k = 1; k < 6; k++) { const t = k / 6; for (const sd of [-1, 1]) { const [qx, qy] = P(sd * 0.62 * (1 - t), 3.2 + 0.4 * t, D1 - 0.1); tr += `<path d="M${f(qx)} ${f(qy)} q${f(sd * 3)} -6 ${f(sd * 7)} -4" stroke="${INK}" stroke-width="2.4" fill="none"/>`; } }
    a.raw(tr); for (const X of [-0.66, 0.66]) { const [fx, fy] = P(X, 3.2, D1 - 0.1), s = K(D1); a.raw(`<path d="M${f(fx - s * 0.03)} ${f(fy)} L${f(fx)} ${f(fy - s * 0.2)} L${f(fx + s * 0.03)} ${f(fy)} Z" fill="${WOOD}" stroke="${INK}" stroke-width="1.4"/>`); } }
  // a carved door with a key in the chair's back
  const [cx, cy] = P(0, 2.2, D1 - 0.11), s = K(D1);
  a.raw(`<path d="M${f(cx - s * 0.2)} ${f(cy + s * 0.4)} L${f(cx - s * 0.2)} ${f(cy - s * 0.1)} Q${f(cx)} ${f(cy - s * 0.35)} ${f(cx + s * 0.2)} ${f(cy - s * 0.1)} L${f(cx + s * 0.2)} ${f(cy + s * 0.4)}" stroke="${G.gold}" stroke-width="2.4" fill="none"/><circle cx="${f(cx)}" cy="${f(cy + s * 0.12)}" r="${f(s * 0.04)}" fill="${G.gold}"/>`);
  for (const X of [-0.6, 0.6]) a.raw(rod([X, 0.75, D1 - 0.2], [X, 1.4, D1 - 0.2], WOOD, 6));
  // the banners: long red cloths hung from iron rods, the door sigil in faded gold, frayed at the foot
  for (const [X, bot, w, dev] of [[-1.7, 1.6, 0.42, 'door'], [1.75, 2.0, 0.38, 'keys']]) {
    const top = 4.4;
    a.raw(seg3([X - w - 0.1, top, D1 - 0.05], [X + w + 0.1, top, D1 - 0.05], INK, 5) + seg3([X - w - 0.1, top, D1 - 0.05], [X + w + 0.1, top, D1 - 0.05], G.iron, 3));
    const pts = [P(X - w, top, D1 - 0.06), P(X + w, top, D1 - 0.06)];
    for (let k = 6; k >= 0; k--) { const t = k / 6; pts.push(P(X - w + 2 * w * t, bot + (k % 2 ? 0.15 : 0) + R() * 0.05, D1 - 0.06)); }
    a.shape({ d: poly(pts), fill: I.grad(dev === 'door' ? '#7a1a14' : '#5a1410', dev === 'door' ? '#3a0a08' : '#2a0606', false), depth: 10, ink: 1.8, hatch: 70, grime: 0.4, tex: 'url(#weave)', texOp: 0.3,
      decals: (() => { const [bx, by] = P(X, 3.1, D1 - 0.06), s2 = K(D1); if (dev === 'keys') return [-1, 1].map(sd => `<g transform="rotate(${sd * 35} ${f(bx)} ${f(by)})"><path d="M${f(bx)} ${f(by - s2 * 0.4)} L${f(bx)} ${f(by + s2 * 0.3)} l${f(s2 * 0.08)} 0 m${f(-s2 * 0.08)} ${f(-s2 * 0.08)} l${f(s2 * 0.06)} 0" stroke="${G.gold}" stroke-width="3" fill="none"/><circle cx="${f(bx)}" cy="${f(by - s2 * 0.46)}" r="${f(s2 * 0.07)}" fill="none" stroke="${G.gold}" stroke-width="3"/></g>`).join('') + a.stain(bx + s2 * 0.1, by + s2 * 0.5, s2 * 0.2, '#1a0604', 0.5) + `<path d="M${f(bx - s2 * 0.25)} ${f(by + s2 * 0.75)} l${f(s2 * 0.06)} ${f(-s2 * 0.04)} l${f(s2 * 0.05)} ${f(s2 * 0.07)} l${f(-s2 * 0.08)} ${f(s2 * 0.03)} Z" fill="#0a0606" stroke="${INK}" stroke-width="1"/>`; return `<path d="M${f(bx - s2 * 0.18)} ${f(by + s2 * 0.4)} L${f(bx - s2 * 0.18)} ${f(by - s2 * 0.1)} Q${f(bx)} ${f(by - s2 * 0.38)} ${f(bx + s2 * 0.18)} ${f(by - s2 * 0.1)} L${f(bx + s2 * 0.18)} ${f(by + s2 * 0.4)}" stroke="${G.gold}" stroke-width="3" fill="none" opacity="0.7"/>` + a.stain(bx - s2 * 0.1, by + s2 * 0.7, s2 * 0.15, '#1a0604', 0.4); })(),
      lines: [-0.5, -0.1, 0.35, 0.7].map(t => ({ d: `M${f(P(X + w * t, top, D1)[0])} ${f(P(X, top, D1)[1])} Q${f(P(X + w * t * 1.1, (top + bot) / 2, D1)[0] + 3)} ${f(P(X, (top + bot) / 2, D1)[1])} ${f(P(X + w * t * 1.05, bot + 0.1, D1)[0])} ${f(P(X, bot + 0.1, D1)[1])}`, w: 1.6, col: '#1a0404', op: 0.5 })),
      spec: [-0.3, 0.15, 0.55].map(t => `M${f(P(X + w * t, top - 0.1, D1)[0] + 4)} ${f(P(X, top - 0.1, D1)[1])} L${f(P(X + w * t, bot + 0.2, D1)[0] + 5)} ${f(P(X, bot + 0.2, D1)[1])}`), specOp: 0.12, specW: 4 });
    { let fr = ''; for (let k = 0; k <= 12; k++) { const [fx, fy] = P(X - w + 2 * w * k / 12, top - 0.04, D1 - 0.065); fr += `M${f(fx)} ${f(fy)} l0 5 `; } a.raw(`<path d="${fr}" stroke="${G.gold}" stroke-width="1.4" opacity="0.7"/>`); }
  }
});
function poly(pts) { return 'M' + pts.map(p => `${f(p[0])} ${f(p[1])}`).join(' L') + ' Z'; }
// tall iron candle stands: a three-branched one burning, and one with a single fat candle guttered into a beard of wax
for (const [X, kind, Z] of [[-3.0, 'three', 6.5], [3.7, 'fat', 7.6]]) prop(Z, () => {
  const s = K(Z);
  a.raw(rod([X, 0, Z], [X, 1.45, Z], '#2a2826', 5));
  for (const d of [-0.2, 0, 0.2]) a.raw(rod([X, 0.12, Z], [X + d, 0, Z + (d === 0 ? 0.18 : -0.03)], '#2a2826', 4));
  a.raw(rod([X - 0.05, 0.75, Z], [X + 0.05, 0.75, Z], '#2a2826', 7));
  if (kind === 'three') { for (const d of [-0.22, 0.22]) a.raw(rod([X, 1.3, Z], [X + d, 1.38, Z], '#2a2826', 3) + rod([X + d, 1.38, Z], [X + d, 1.45, Z], '#2a2826', 3)); a.raw(candles(X - 0.22, Z, 1, 1.46, 0.05) + candles(X + 0.22, Z, 1, 1.46, 0.05) + candles(X, Z, 1, 1.47, 0.05)); }
  else { const [x, y] = P(X, 1.45, Z); a.raw(`<path d="M${f(x - s * 0.1)} ${f(y)} L${f(x + s * 0.1)} ${f(y)}" stroke="${INK}" stroke-width="4"/><rect x="${f(x - s * 0.045)}" y="${f(y - s * 0.22)}" width="${f(s * 0.09)}" height="${f(s * 0.22)}" fill="#d8ccb0" stroke="${INK}" stroke-width="1.2"/>` + Array.from({ length: 7 }, () => { const dx = (R() - 0.5) * s * 0.1, l = s * (0.05 + R() * 0.2); return `<path d="M${f(x + dx)} ${f(y - s * 0.02)} q2 ${f(l * 0.5)} 0 ${f(l)}" stroke="${INK}" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="M${f(x + dx)} ${f(y - s * 0.02)} q2 ${f(l * 0.5)} 0 ${f(l)}" stroke="#e0d4b8" stroke-width="2.6" fill="none" stroke-linecap="round"/>`; }).join('')); a.raw(candles(X, Z, 1, 1.66, 0.02)); }
  addLight(X, 1.7, Z - 0.15, kind === 'three' ? 1.05 : 0.8, 4.5, [1.0, 0.72, 0.42]);
});
// a tall lancet window high in the back wall over the seat
I.backWindow(-0.35, 0.35, 3.9, 5.2, { I: 0.75, range: 8, sky: '#5e5e5a', bars: 1 });
addLight(0, 3.2, D1 - 1.2, 0.5, 4, [1.0, 0.7, 0.4]);   // a lamp burning before the seat, lighting the banners

// ================================================================== FG: the lectern and the charter, a pair of benches
a.layer('fg');
prop(LECT.Z, () => {
  const { X, Z } = LECT, s = K(Z);
  a.raw('<g class="panel">');
  a.raw(rod([X, 0, Z + 0.1], [X, 1.1, Z + 0.1], WOOD, 14));
  box(X - 0.3, X + 0.3, 0, 0.12, Z - 0.05, Z + 0.3, STONE, { shade: false });
  // the eagle lectern's slope, the charter on it: a long sheet of parchment, seals hanging on cords
  const tp = [[X - 0.4, 1.12, Z - 0.1], [X + 0.4, 1.12, Z - 0.1], [X + 0.4, 1.32, Z + 0.25], [X - 0.4, 1.32, Z + 0.25]];
  face(tp, WOOD, 2, `<path d="${pp(tp)}" fill="url(#grain)" opacity="0.5"/>`);
  const ch = [[X - 0.3, 1.14, Z - 0.06], [X + 0.3, 1.14, Z - 0.06], [X + 0.3, 1.33, Z + 0.22], [X - 0.3, 1.33, Z + 0.22]];
  face(ch, '#d8cca8', 1.4);
  let t = ''; for (let r = 0; r < 8; r++) { const zz = Z - 0.03 + r * 0.03, yy = 1.15 + (zz - Z + 0.06) / 0.28 * 0.19 + 0.005; t += `<path d="${pp([[X - 0.25, yy, zz], [X + 0.25 - R() * 0.08, yy, zz]]).replace(' Z', '')}" stroke="#2a201a" stroke-width="1" opacity="0.75" stroke-dasharray="4 1.5 7 1.5"/>`; }
  a.raw(t);
  // seals: wax discs on cords hanging over the front edge
  for (const [dx, col, dy] of [[-0.2, '#4a120e', 0.85], [-0.06, '#3a1a10', 0.92], [0.1, '#4a120e', 0.88], [0.22, '#2a2a1a', 0.95]]) { const [sx, sy] = P(X + dx, 1.13, Z - 0.07), [ex, ey] = P(X + dx, dy, Z - 0.08); a.raw(`<path d="M${f(sx)} ${f(sy)} L${f(ex)} ${f(ey)}" stroke="#c8b890" stroke-width="1.2"/><path d="${blob(ex, ey + 5, s * 0.03, R, 8, 0.25)}" fill="${col}" stroke="${INK}" stroke-width="1.3"/><circle cx="${f(ex)}" cy="${f(ey + 5)}" r="${f(s * 0.012)}" fill="none" stroke="#1a0806" stroke-width="0.8"/>`); }
  a.raw('</g>');
  hot('charter', 'The charter', [P(X - 0.4, 0.8, Z - 0.1), P(X + 0.4, 0.8, Z - 0.1), P(X + 0.4, 1.32, Z + 0.25), P(X - 0.4, 1.32, Z + 0.25)]);
  addLight(X - 0.6, 1.5, Z - 0.2, 0.35, 2.5, [1.0, 0.72, 0.42]);
  a.raw(candles(X - 0.6, Z - 0.05, 1, 1.12, 0.05));
  a.raw(rod([X - 0.6, 0, Z - 0.05], [X - 0.6, 1.1, Z - 0.05], '#2a2826', 3));
  for (const d of [-0.12, 0.12]) a.raw(rod([X - 0.6, 0.08, Z - 0.05], [X - 0.6 + d, 0, Z - 0.05 + (d > 0 ? 0.06 : -0.02)], '#2a2826', 3));
});
{ const X = 0.3, Z = 2.65, q = [[X - 0.55, 0.005, Z], [X + 0.55, 0.005, Z], [X + 0.55, 0.005, Z + 1.1], [X - 0.55, 0.005, Z + 1.1]];
  face(q, '#5a564e', 2);
  const fig = [[X - 0.15, 0.006, Z + 0.15], [X + 0.15, 0.006, Z + 0.15], [X + 0.2, 0.006, Z + 0.75], [X, 0.006, Z + 0.95], [X - 0.2, 0.006, Z + 0.75]];
  a.raw(PLW([q[0], q[1], q[3]], `<path d="${pp(fig)}" fill="#4e4a42" stroke="#24221c" stroke-width="2"/><path d="${pp([[X - 0.12, 0.006, Z + 0.55], [X + 0.12, 0.006, Z + 0.55]]).replace(' Z', '')}" stroke="#24221c" stroke-width="1.6"/><path d="${pp([[X - 0.48, 0.006, Z + 0.08], [X + 0.48, 0.006, Z + 0.08], [X + 0.48, 0.006, Z + 1.02], [X - 0.48, 0.006, Z + 1.02]])}" fill="none" stroke="#24221c" stroke-width="1.4" stroke-dasharray="10 3 2 3"/>` + a.stain(...P(X + 0.3, 0, Z + 0.4), K(Z) * 0.08, '#2a2620', 0.5))); }
for (const X of [-3.2, 3.2]) prop(3.4, () => {
  for (const d of [-0.75, 0.75]) I.woodBox(X + d - 0.05, X + d + 0.05, 0, 0.4, 3.25, 3.5, dark(WOOD, 0.1), { boards: 1 });
  I.woodBox(X - 0.9, X + 0.9, 0.4, 0.48, 3.2, 3.55, WOOD, { bw: 0.12 });
  if (X > 0) { const [x, y] = P(X - 0.72, 0.48, 3.25), s = K(3.25); a.shape({ d: smooth([[x - s * 0.35, y - s * 0.03], [x + s * 0.2, y - s * 0.05], [x + s * 0.28, y + s * 0.02], [x + s * 0.22, y + s * 0.38], [x - s * 0.05, y + s * 0.42], [x - s * 0.1, y + s * 0.12], [x - s * 0.38, y + s * 0.05]], true, 0.4), fill: I.grad('#3a3a40', '#1a1a1e'), depth: 8, ink: 1.8, hatch: 70, tex: 'url(#weave)', texOp: 0.35, grime: 0.4, lines: [{ d: `M${f(x)} ${f(y)} Q${f(x + s * 0.05)} ${f(y + s * 0.2)} ${f(x + s * 0.02)} ${f(y + s * 0.38)}`, w: 1.4, op: 0.5 }, { d: `M${f(x + s * 0.12)} ${f(y)} Q${f(x + s * 0.18)} ${f(y + s * 0.2)} ${f(x + s * 0.15)} ${f(y + s * 0.38)}`, w: 1.2, op: 0.4 }] }); }
});

I.write(KEEPER);
