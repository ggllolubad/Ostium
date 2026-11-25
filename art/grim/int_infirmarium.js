// The Infirmarium: Sister Wenna's long ward. Lime-washed stone flaking off, a beamed ceiling hung with drying herbs,
// a high barred window letting in the Grey, the sick in a row of beds along the back wall behind linen screens.
// Wenna leans on the treatment table (the panel) in the front of the room; a brazier of herbs smokes vinegar-sweet at
// the left; the door to the garth is in the left wall at the back. Writes grim/hub/int/infirmarium*.
const I = require('./interior')('infirmarium', { width: 10, depth: 9, height: 4.6, wall: '#585044', wall2: '#5e564a', floorCol: '#3e382e', ceilCol: '#34281c', render: 2, renderCol: '#5a564c', seed: 3301, panel: 'table', beamGap: 1.5 });
const { a, R, P, K, pp, f, G, INK, mix, dark, light, smooth, blob, PLW, EM, addLight, stones, shade, planks, through, hot, outline, HOT, HW, D1, HT, prop, face, box, rod, seg3, candles, lantern, smoke, fireTongues, D } = I;
const DETAIL = process.env.PASS !== 'base';
const Pr = require('./props')(I);
const LINEN = '#9a907a', WOOL = '#5a5040', WOOD = '#4a3624';
const KEEPER = { X: 1.75, Z: 4.85, h: 1.65, sprite: 'wenna', label: 'Sister Wenna', cutY: 0.82, cutZ: 4.7 };
const TABLE = { x0: -1.0, x1: 1.45, z0: 4.05, z1: 4.7, top: 0.82 };

I.shell();
const WIN = I.backWindow(-0.6, 0.6, 2.5, 4.15, { I: 0.75, range: 7.5, sky: '#5a5854', bars: 5 });
// the shaft of grey light falling from the window across the ward (a painted cue for the unlit preview only)
a.raw(`<g class="glow"><path d="${pp([[-0.6, 4.1, D1], [0.6, 4.1, D1], [1.4, 0, D1 - 3.2], [-0.2, 0, D1 - 3.2]])}" fill="#c8c8c0" opacity="0.07"/></g>`);
// an iron cross of the order over the window, rust running from it
{ const [x, y] = P(-1.0, 2.75, D1 - 0.02), s = K(D1); a.raw(PLW([[0, 0, D1], [1, 0, D1], [0, 1, D1]], `<path d="M${f(x)} ${f(y - s * 0.12)} L${f(x)} ${f(y + s * 0.12)} M${f(x - s * 0.08)} ${f(y - s * 0.04)} L${f(x + s * 0.08)} ${f(y - s * 0.04)}" stroke="${INK}" stroke-width="5"/><path d="M${f(x)} ${f(y - s * 0.12)} L${f(x)} ${f(y + s * 0.12)} M${f(x - s * 0.08)} ${f(y - s * 0.04)} L${f(x + s * 0.08)} ${f(y - s * 0.04)}" stroke="#4a3a30" stroke-width="3"/>` + a.drip(x, y + s * 0.12, s * 0.15, 1.4, '#5a3020'))); }
I.door(6.0, 7.0, { side: -1, ts: 1.95 });   // the infirmarium's garth door faces west

// ------------------------------------------------------------------ the left wall: shelves of jars, bottles and rolled bandage
prop(7.4, () => {
  const z0 = 7.45, z1 = 8.5, X = -HW + 0.38;
  for (const Y of [0.5, 1.15, 1.8, 2.45]) {
    I.wood([[-HW, Y, z0], [-HW, Y, z1], [X, Y, z1], [X, Y, z0]], '#4e3a28', { bw: 0.13, nails: false, knots: 0.3 });
    I.wood([[X, Y - 0.05, z0], [X, Y - 0.05, z1], [X, Y, z1], [X, Y, z0]], '#3a2a1c', { boards: 1 });
    for (let z = z0 + 0.08; z < z1 - 0.05; z += 0.08 + R() * 0.1) {
      const k = R();
      if (k < 0.12) continue;                                   // a gap where something was used
      if (k > 0.9) { const [x, y] = P(X - 0.12, Y, z), s = K(z); a.raw(`<ellipse cx="${f(x)}" cy="${f(y - s * 0.06)}" rx="${f(s * 0.06)}" ry="${f(s * 0.06)}" fill="#d0c8b4" stroke="${INK}" stroke-width="1.2"/><path d="M${f(x - s * 0.04)} ${f(y - s * 0.06)} a${f(s * 0.04)} ${f(s * 0.04)} 0 1 0 ${f(s * 0.08)} 0" stroke="${INK}" stroke-width="0.8" fill="none"/>`); continue; }
      if (k > 0.78) { Pr.food(X - 0.12, Y, z, 'crock'); continue; }
      Pr.bottle(X - 0.12, Y, z);
    }
  }
  for (const z of [z0, z1]) face([[-HW, 0, z], [X + 0.02, 0, z], [X + 0.02, 2.9, z], [-HW, 2.9, z]], '#3e2e20', 1.6);
});

// ------------------------------------------------------------------ the beds along the back wall: the sick, under grey wool
const beds = [-2.05, 2.55, 4.35];
const sick = [{ dead: true }, { sit: true }, { cough: true }];
beds.forEach((X, i) => prop(6.85, () => {
  const z0 = 6.85, z1 = 8.85, x0 = X - 0.5, x1 = X + 0.5, s = K(z0), who = sick[i];
  // headboard against the wall, the frame, the straw mattress, the blanket mound, the head on its bolster
  I.woodBox(x0 - 0.04, x1 + 0.04, 0, [0.95, 1.15, 0.8][i], z1 - 0.06, z1, ['#3e2e20', '#4a3626', '#352a1e'][i], { bw: 0.2 });
  I.woodBox(x0, x1, 0, 0.36, z0, z1 - 0.06, [WOOD, '#5a4430', '#3e3024'][i], { bw: 0.12 });
  const mt = [[x0 + 0.03, 0.36, z0 + 0.02], [x1 - 0.03, 0.36, z0 + 0.02], [x1 - 0.03, 0.36, z1 - 0.1], [x0 + 0.03, 0.36, z1 - 0.1]];
  face(mt, '#8a8068', 1.2);
  // the body under the blanket: a long mound, feet toward us
  const mound = []; for (let k = 0; k <= 12; k++) { const t = k / 12, Z = z0 + 0.08 + t * (z1 - z0 - 0.7), hgt = 0.36 + (who.sit ? 0.2 : 0.17) + Math.sin(t * Math.PI * 1.6) * 0.07 + (t > 0.55 && t < 0.8 ? 0.05 : 0) + (k < 2 ? 0.05 : 0); mound.push(P(X + (R() - 0.5) * 0.03, hgt, Z)); }
  const foot = P(x0 + 0.02, 0.36, z0 + 0.02), foot2 = P(x1 - 0.02, 0.36, z0 + 0.02);
  a.shape({ d: smooth([foot, P(x0 - 0.02, 0.44, z0 + 0.1), ...mound.map(([x, y]) => [x - s * 0.36, y]), ...mound.reverse().map(([x, y]) => [x + s * 0.36, y]), P(x1 + 0.02, 0.44, z0 + 0.1), foot2], true, 0.35), fill: who.dead ? '#4a4438' : ['#5a5040', '#4a4a3e', '#6a4a36'][i], depth: 10, ink: 1.8, hatch: 70, mottle: 0.5, grime: 0.5, tex: 'url(#weave)', texOp: 0.4,
    lines: [{ d: `M${f(P(X - 0.2, 0.52, z0 + 0.3)[0])} ${f(P(X - 0.2, 0.52, z0 + 0.3)[1])} L${f(P(X - 0.15, 0.5, z1 - 0.8)[0])} ${f(P(X - 0.15, 0.5, z1 - 0.8)[1])}`, w: 1, op: 0.6 }],
    decals: who.cough ? a.stain(...P(X, 0.55, z1 - 0.9), s * 0.08, G.blood, 0.6) : '' });
  // the bolster and the head
  const hz = z1 - 0.45, [hx, hy] = P(X, who.sit ? 0.86 : 0.58, hz), hs = K(hz);
  a.raw(`<path d="${smooth([P(x0 + 0.06, 0.46, hz + 0.25), P(x1 - 0.06, 0.46, hz + 0.25), P(x1 - 0.06, 0.62, hz + 0.2), P(x0 + 0.06, 0.62, hz + 0.2)], true, 0.5)}" fill="${LINEN}" stroke="${INK}" stroke-width="1.4"/>`);
  if (who.dead) {           // the dead one: the sheet drawn up over the face
    a.shape({ d: smooth([[hx - hs * 0.16, hy + hs * 0.08], [hx - hs * 0.12, hy - hs * 0.1], [hx + hs * 0.12, hy - hs * 0.1], [hx + hs * 0.16, hy + hs * 0.08]], true, 0.5), fill: LINEN, depth: 4, ink: 1.4, hatch: 60, lines: [{ d: `M${f(hx - hs * 0.05)} ${f(hy - hs * 0.02)} l${f(hs * 0.03)} ${f(-hs * 0.04)}`, w: 1 }] });
  } else {
    a.shape({ d: blob(hx, hy - hs * 0.03, hs * 0.13, R, 8, 0.12), fill: '#a89880', depth: 4, ink: 1.4, hatch: 60, mottle: 0.4 });
    a.raw(`<path d="M${f(hx - hs * 0.06)} ${f(hy - hs * 0.03)} l${f(hs * 0.03)} 0 M${f(hx + hs * 0.02)} ${f(hy - hs * 0.03)} l${f(hs * 0.03)} 0" stroke="${INK}" stroke-width="1.4"/><path d="M${f(hx - hs * 0.11)} ${f(hy - hs * 0.08)} Q${f(hx)} ${f(hy - hs * 0.16)} ${f(hx + hs * 0.11)} ${f(hy - hs * 0.08)}" stroke="#2a2018" stroke-width="${f(hs * 0.05)}" fill="none"/>`);
    if (who.sit) a.shape({ d: smooth([P(X - 0.24, 0.5, hz - 0.1), P(X - 0.2, 0.84, hz), P(X + 0.2, 0.84, hz), P(X + 0.24, 0.5, hz - 0.1)], true, 0.4), fill: LINEN, depth: 6, ink: 1.6, hatch: 60, mottle: 0.4, decals: a.stain(...P(X + 0.1, 0.62, hz), hs * 0.06, G.blood, 0.6) });
  }
  // a stool by the bed with a cup and a candle stub
  if (i === 1) { const sx = X - 0.75; box(sx - 0.17, sx + 0.17, 0.4, 0.45, 7.3, 7.6, WOOD, { shade: false }); for (const lx of [sx - 0.13, sx + 0.13]) a.raw(rod([lx, 0, 7.32], [lx, 0.4, 7.32], WOOD, 2.5)); a.raw(candles(sx, 7.45, 1, 0.45, 0.1)); }
}));
// linen screens on frames between the beds, one drawn half across
for (const [X, Z, wdt] of [[-2.83, 7.0, 0.0], [3.45, 7.0, 0.0]]) prop(Z, () => {
  const z0 = Z, z1 = Z + 1.5;
  a.raw(rod([X, 0, z0], [X, 1.85, z0], WOOD, 3) + rod([X, 0, z1], [X, 1.85, z1], WOOD, 3) + rod([X, 1.85, z0], [X, 1.85, z1], WOOD, 3));
  const cl = []; for (let k = 0; k <= 8; k++) { const z = z0 + (z1 - z0) * k / 8; cl.push(P(X + (k % 2 ? 0.04 : -0.04), 1.82, z)); }
  const bt = []; for (let k = 8; k >= 0; k--) { const z = z0 + (z1 - z0) * k / 8; bt.push(P(X + (k % 2 ? 0.05 : -0.05), 0.28 + R() * 0.06, z)); }
  a.shape({ d: smooth([...cl, ...bt], true, 0.3), fill: mix(LINEN, '#6a6050', R() * 0.5), depth: 10, ink: 1.6, hatch: 60, grime: 0.35, tex: 'url(#weave)', texOp: 0.35, op: 0.95,
    decals: a.stain(...P(X, 0.5, z0 + 0.7), K(Z) * 0.4, '#4a3a20', 0.45) + a.stain(...P(X, 1.2, z0 + 0.3), K(Z) * 0.12, G.blood, 0.35),
    lines: [0.2, 0.4, 0.6, 0.8].map(t => { const p0 = P(X, 1.78, z0 + (z1 - z0) * t), p1 = P(X, 0.34, z0 + (z1 - z0) * t); return { d: `M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}`, w: 1, op: 0.55 }; }) });
});


// ------------------------------------------------------------------ the back wall between the beds: the aumbry of remedies, the pegs of the dead
prop(D1 - 0.45, () => {
  const x0 = -1.42, x1 = -0.52, z = D1 - 0.42, ht = 2.15;
  box(x0, x1, 0, ht, z, D1 - 0.02, '#3e2c1c', { tex: 'url(#grain)', depth: 8 });
  // two doors, one hanging open on a broken hinge, shelves of crocks inside
  const dr = [[x0 + 0.05, 0.1, z - 0.01], [x1 - 0.05, 0.1, z - 0.01], [x1 - 0.05, ht - 0.1, z - 0.01], [x0 + 0.05, ht - 0.1, z - 0.01]];
  through(dr, () => {
    face(dr, '#1a140e', 1.2);
    for (const Y of [0.6, 1.1, 1.6]) { face([[x0 + 0.05, Y, z + 0.3], [x1 - 0.05, Y, z + 0.3], [x1 - 0.05, Y, z - 0.01], [x0 + 0.05, Y, z - 0.01]], '#3a2a1c', 1.2);
      for (let X = x0 + 0.12; X < x1 - 0.1;) { const k = R(); if (k < 0.15) { X += 0.15; continue; } if (k < 0.55) Pr.bottle(X, Y, z + 0.15); else Pr.food(X, Y, z + 0.15, 'crock'); X += 0.12 + R() * 0.1; } }
  });
  a.raw(planks((s2, t) => [x0 + 0.05 + s2, 0.1 + t, z - 0.02], 0.45, ht - 0.2, '#4a3422', { board: 0.15, nails: 4 }));
  a.raw(planks((s2, t) => [x1 - 0.05 + s2 * 0.6, 0.15 + t, z - 0.02 - s2 * 0.8], 0.45, ht - 0.25, '#4a3422', { board: 0.15, nails: 3 }));
});
prop(D1 - 0.1, () => {
  // pegs with the cloaks and habits of the ones who did not leave; a chalked list of names beside them
  for (let k = 0; k < 3; k++) {
    const X = 1.0 + k * 0.38, [x, y] = P(X, 1.75, D1 - 0.06), s2 = K(D1);
    a.raw(`<path d="M${f(x)} ${f(y)} l${f(s2 * 0.06)} ${f(-s2 * 0.02)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`);
    a.shape({ d: smooth([[x - s2 * 0.05, y], [x + s2 * 0.05, y], [x + s2 * 0.16, y + s2 * 0.5], [x + s2 * 0.14, y + s2 * (0.85 + k * 0.1)], [x - s2 * 0.12, y + s2 * (0.88 + k * 0.08)], [x - s2 * 0.15, y + s2 * 0.45]], true, 0.4), fill: ['#3a3430', '#4a3a2a', '#3a3a3e'][k], depth: 8, ink: 1.4, hatch: 70, mottle: 0.5, grime: 0.5,
      lines: [{ d: `M${f(x)} ${f(y + s2 * 0.1)} L${f(x - s2 * 0.02)} ${f(y + s2 * 0.8)}`, w: 1, op: 0.6 }, { d: `M${f(x + s2 * 0.08)} ${f(y + s2 * 0.3)} L${f(x + s2 * 0.1)} ${f(y + s2 * 0.82)}`, w: 0.8, op: 0.5 }] });
    a.shape({ d: smooth([[x - s2 * 0.09, y + s2 * 0.02], [x - s2 * 0.06, y - s2 * 0.1], [x + s2 * 0.06, y - s2 * 0.1], [x + s2 * 0.1, y + s2 * 0.04], [x + s2 * 0.05, y + s2 * 0.22], [x - s2 * 0.07, y + s2 * 0.22]], true, 0.5), fill: dark(['#3a3430', '#4a3a2a', '#3a3a3e'][k], 0.1), depth: 5, ink: 1.4, hatch: 70, mottle: 0.4 });
  }
  const atB = (s2, t) => [s2, t, D1 - 0.01];
  let ch = '';
  for (let r = 0; r < 9; r++) { const [x, y] = P(2.25, 2.4 - r * 0.13, D1 - 0.01), w = K(D1) * (0.35 + R() * 0.25); ch += `<path d="M${f(x)} ${f(y)} ${Array.from({ length: 7 }, () => `l${f(w / 7)} ${f((R() - 0.5) * 3)}`).join(' ')}" stroke="#c8c0b0" stroke-width="1.1" fill="none" opacity="${r < 6 ? 0.45 : 0.25}"/>`; if (r < 6) ch += `<path d="M${f(x - 2)} ${f(y - 1)} l${f(w + 4)} 1" stroke="#c8c0b0" stroke-width="0.9" opacity="0.35"/>`; }
  a.raw(PLW([atB(0, 0), atB(1, 0), atB(0, 1)], ch));
});
// ------------------------------------------------------------------ the herb brazier at the left: an iron bowl on legs, sage and rue smouldering, vinegar steam
const BRZ = [-2.3, 5.7];
prop(BRZ[1], () => {
  const [X, Z] = BRZ, s = K(Z), [x, y] = P(X, 0.78, Z);
  for (const k of [-1, 0, 1]) { const [lx, ly] = P(X + k * 0.25, 0, Z + (k === 0 ? 0.2 : -0.05)); a.raw(`<path d="M${f(x + k * s * 0.12)} ${f(y + s * 0.06)} Q${f(x + k * s * 0.2)} ${f((y + ly) / 2)} ${f(lx)} ${f(ly)}" stroke="${INK}" stroke-width="${f(s * 0.035 + 2)}" fill="none" stroke-linecap="round"/><path d="M${f(x + k * s * 0.12)} ${f(y + s * 0.06)} Q${f(x + k * s * 0.2)} ${f((y + ly) / 2)} ${f(lx)} ${f(ly)}" stroke="#3a3836" stroke-width="${f(s * 0.035)}" fill="none" stroke-linecap="round"/>`); }
  a.shape({ d: `M${f(x - s * 0.3)} ${f(y - s * 0.05)} Q${f(x)} ${f(y + s * 0.3)} ${f(x + s * 0.3)} ${f(y - s * 0.05)} Z`, fill: '#3a3836', depth: 6, ink: 2, hatch: 30, mottle: 0.5, decals: a.stain(x, y + s * 0.08, s * 0.1, G.rust, 0.6) });
  a.raw(EM(`<ellipse cx="${f(x)}" cy="${f(y - s * 0.05)}" rx="${f(s * 0.29)}" ry="${f(s * 0.05)}" fill="#8a2a10" stroke="${INK}" stroke-width="1.6"/>` + Array.from({ length: 14 }, () => `<path d="${blob(x + (R() - 0.5) * s * 0.45, y - s * 0.06 + (R() - 0.5) * s * 0.04, 2 + R() * 3, R, 5, 0.4)}" fill="${R() < 0.4 ? '#ffb050' : '#3a2a1a'}"/>`).join('')));
  // a bundle of sage laid across the bowl, half burnt
  a.raw(`<path d="M${f(x - s * 0.2)} ${f(y - s * 0.1)} L${f(x + s * 0.15)} ${f(y - s * 0.14)}" stroke="${INK}" stroke-width="${f(s * 0.05 + 2)}" stroke-linecap="round"/><path d="M${f(x - s * 0.2)} ${f(y - s * 0.1)} L${f(x + s * 0.15)} ${f(y - s * 0.14)}" stroke="#6a7a52" stroke-width="${f(s * 0.05)}" stroke-linecap="round"/>`);
  a.raw(fireTongues(x, y - s * 0.07, s * 0.09, s * 0.2));
  a.raw(a.glow(x, y - s * 0.15, s * 0.8, '#ff9a4a', 0.45));
  for (let k = 0; k < 2; k++) { const ox = (k - 1.5) * s * 0.08, top = 0.9 + R() * 0.9; a.raw(smoke([[x + ox, y - s * 0.15], [x + ox - s * 0.15, y - s * (0.35 + top * 0.25)], [x + ox + s * 0.2, y - s * (0.4 + top * 0.55)], [x + ox - s * 0.05, y - s * (0.45 + top)]], s * (0.025 + R() * 0.02), 0.16, k % 2 ? '#5e6658' : '#6a6a60')); }
  addLight(X, 1.0, Z - 0.1, 0.7, 4.5, [1.0, 0.6, 0.3]);
});
// herbs hung to dry from the second beam, a lantern over the table on a hook
{ // clustered along the two beams, never in a row: what Wenna gathered, each bunch a different plant at a different stage
  const kinds = ['leaf', 'sprig', 'pod', 'root', 'flower'];
  for (const [Z, xs] of [[D1 - 1.9, [-4.3, -3.95, -3.7, -1.6, -1.35, 1.9, 2.3, 2.45, 4.1]], [D1 - 3.4, [-4.1, -3.8, -2.2, -0.2, 0.15, 3.2, 3.55, 3.75]]])
    xs.forEach((X, i) => prop(Z, () => Pr.herbs(X + (R() - 0.5) * 0.1, HT - 0.3, Z, kinds[Math.floor(R() * 5)])));
}
// a basket of bloody rags and a stretcher leaning on the wall behind Wenna
prop(5.9, () => {
  const [x, y] = P(3.7, 0, 5.9), s = K(5.9);
  a.raw(rod([4.1, 0, 6.3], [4.5, 2.1, 6.9], WOOD, 4) + rod([4.6, 0, 6.3], [5.0, 2.1, 6.9], WOOD, 4));
  a.shape({ d: pp([[4.15, 0.25, 6.38], [4.6, 0.25, 6.38], [4.95, 1.9, 6.85], [4.5, 1.9, 6.85]]), fill: '#7a6a4e', depth: 6, ink: 1.6, hatch: 70, mottle: 0.5, grime: 0.6, decals: a.stain(...P(4.5, 1.0, 6.6), s * 0.2, G.blood, 0.5) + a.stain(...P(4.6, 1.4, 6.7), s * 0.15, '#3a2a1a', 0.5) });
  // a wash basin on a low stand, red water, a stack of bowls beside it
  a.raw(rod([3.55, 0, 5.9], [3.55, 0.5, 5.9], WOOD, 6) + rod([3.85, 0, 5.9], [3.85, 0.5, 5.9], WOOD, 6));
  a.shape({ d: `M${f(x - s * 0.24)} ${f(y - s * 0.5)} Q${f(x)} ${f(y - s * 0.3)} ${f(x + s * 0.24)} ${f(y - s * 0.5)} Z`, fill: I.metal('#7a6a52'), depth: 4, ink: 1.6, hatch: 60 });
  a.raw(`<ellipse cx="${f(x)}" cy="${f(y - s * 0.5)}" rx="${f(s * 0.24)}" ry="${f(s * 0.05)}" fill="#5a1a12" stroke="${INK}" stroke-width="1.4"/><path d="M${f(x - s * 0.12)} ${f(y - s * 0.51)} q${f(s * 0.08)} ${f(-s * 0.01)} ${f(s * 0.16)} 0" stroke="#a84a3a" stroke-width="1.2" fill="none" opacity="0.6"/>`);
  for (let k = 0; k < 4; k++) { const [bx, by] = P(3.15, k * 0.035, 5.75), bs = K(5.75); a.raw(`<path d="M${f(bx - bs * 0.08)} ${f(by)} Q${f(bx)} ${f(by + bs * 0.03)} ${f(bx + bs * 0.08)} ${f(by)} L${f(bx + bs * 0.09)} ${f(by - bs * 0.03)} L${f(bx - bs * 0.09)} ${f(by - bs * 0.03)} Z" fill="${mix('#6a5038', '#8a7a6a', R())}" stroke="${INK}" stroke-width="1"/>`); }
});

// ================================================================== MID: the treatment table (Wenna's hands rest on it)
a.layer('mid');
prop(TABLE.z0, () => {
  const { x0, x1, z0, z1, top } = TABLE, s = K(z0);
  for (const [lx, lz] of [[x0 + 0.1, z1 - 0.08], [x1 - 0.1, z1 - 0.08], [x0 + 0.1, z0 + 0.08], [x1 - 0.1, z0 + 0.08]]) a.raw(rod([lx, 0, lz], [lx, top - 0.06, lz], dark(WOOD, 0.15), lz < 4.8 ? 9 : 7));
  a.raw(rod([x0 + 0.1, 0.18, z0 + 0.08], [x1 - 0.1, 0.18, z0 + 0.08], dark(WOOD, 0.15), 5));
  // the top: a scrubbed board, a stained linen sheet, leather straps hanging
  I.wood([[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]], '#6a5440', { bw: 0.16 });
  const sh = [[x0 + 0.15, top + 0.005, z0 + 0.04], [x1 - 0.5, top + 0.005, z0 + 0.02], [x1 - 0.45, top + 0.005, z1 - 0.05], [x0 + 0.1, top + 0.005, z1 - 0.06]];
  a.shape({ d: pp(sh), fill: LINEN, depth: 4, ink: 1.4, hatch: 0, grime: 0.3, tex: 'url(#weave)', texOp: 0.35, hl: false, decals: a.stain(...P(-0.2, top, 4.4), s * 0.28, '#6a1a10', 0.7) + a.stain(...P(0.3, top, 4.3), s * 0.14, '#4a1008', 0.6) + a.stain(...P(-0.7, top, 4.45), s * 0.12, '#5a3a20', 0.5) });
  I.wood([[x0, top - 0.08, z0], [x1, top - 0.08, z0], [x1, top, z0], [x0, top, z0]], dark(WOOD, 0.1), { boards: 1 });
  // the sheet hangs over the front edge, bloodied at the hem
  a.shape({ d: smooth([P(x0 + 0.15, top, z0), P(x1 - 0.5, top, z0), P(x1 - 0.48, top - 0.28, z0 - 0.02), P(0.3, top - 0.24, z0 - 0.02), P(-0.2, top - 0.32, z0 - 0.02), P(x0 + 0.16, top - 0.26, z0 - 0.02)], true, 0.3), fill: LINEN, depth: 6, ink: 1.6, hatch: 70, grime: 0.3, tex: 'url(#weave)', texOp: 0.35,
    spec: [-0.75, -0.35, 0.15, 0.7].map(X => { const p0 = P(X, top - 0.02, z0 - 0.02); return `M${f(p0[0] + 6)} ${f(p0[1])} q3 ${f(s * 0.12)} -1 ${f(s * 0.22)}`; }), specOp: 0.35, specW: 3,
    decals: a.stain(...P(-0.2, top - 0.22, z0), s * 0.1, '#6a1a10', 0.6) + a.drip(...P(-0.15, top - 0.3, z0), s * 0.1, 2, '#5a1008'), lines: [-0.6, -0.1, 0.5, -0.9, 0.95].map(X => ({ d: `M${f(P(X, top, z0)[0])} ${f(P(X, top, z0)[1])} q${f((R() - 0.5) * 8)} ${f(s * 0.12)} ${f((R() - 0.5) * 4)} ${f(s * 0.24)}`, w: 1.6, col: '#4a4030', op: 0.55 })) });
  for (const X of [x0 + 0.3, x1 - 0.35]) a.raw(`<path d="M${f(P(X, top, z0)[0])} ${f(P(X, top, z0)[1])} q4 ${f(s * 0.2)} -2 ${f(s * 0.34)}" stroke="${INK}" stroke-width="5" fill="none"/><path d="M${f(P(X, top, z0)[0])} ${f(P(X, top, z0)[1])} q4 ${f(s * 0.2)} -2 ${f(s * 0.34)}" stroke="${G.leatherD}" stroke-width="3" fill="none"/>`);
  // on the table: a basin of red water, a tray of instruments, a bone saw, a cup of vinegar, candles
  { const [bx, by] = P(-0.55, top, 4.5), bs = K(4.5); a.shape({ d: `M${f(bx - bs * 0.2)} ${f(by - bs * 0.1)} Q${f(bx)} ${f(by + bs * 0.06)} ${f(bx + bs * 0.2)} ${f(by - bs * 0.1)} Z`, fill: '#7a7468', depth: 4, ink: 1.6, hatch: 30 });
    a.raw(`<ellipse cx="${f(bx)}" cy="${f(by - bs * 0.1)}" rx="${f(bs * 0.2)}" ry="${f(bs * 0.04)}" fill="#5a1610" stroke="${INK}" stroke-width="1.4"/><path d="M${f(bx - bs * 0.1)} ${f(by - bs * 0.11)} l${f(bs * 0.08)} -1" stroke="#c87a6a" stroke-width="1" opacity="0.6"/>`); }
  { const tr = [[0.15, top + 0.01, 4.3], [0.75, top + 0.01, 4.3], [0.75, top + 0.01, 4.55], [0.15, top + 0.01, 4.55]]; face(tr, '#4a4844', 1.4);
    for (let k = 0; k < 6; k++) { const X = 0.22 + k * 0.09; a.raw(`<path d="${pp([[X, top + 0.02, 4.35], [X + 0.03, top + 0.02, 4.51]]).replace(' Z', '')}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="${pp([[X, top + 0.02, 4.35], [X + 0.03, top + 0.02, 4.51]]).replace(' Z', '')}" stroke="${k % 3 ? G.steelL : G.wood}" stroke-width="1.4"/>`); } }
  a.raw(candles(-0.1, 4.62, 2, top, 0.2));
  if (DETAIL) { const [cx, cy] = P(1.0, top, 4.2), cs = K(4.2); a.raw(`<path d="M${f(cx - cs * 0.04)} ${f(cy)} L${f(cx - cs * 0.05)} ${f(cy - cs * 0.1)} L${f(cx + cs * 0.05)} ${f(cy - cs * 0.1)} L${f(cx + cs * 0.04)} ${f(cy)} Z" fill="#5a4a3a" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${f(cx)}" cy="${f(cy - cs * 0.1)}" rx="${f(cs * 0.05)}" ry="${f(cs * 0.012)}" fill="#8a7a3a"/>`); }
});
{
  const { x0, x1, z0, z1, top } = TABLE;
  hot('table', 'The treatment table', [P(x0, 0, z0), P(x1, 0, z0), P(x1, top, z0), P(x1, top, z1), P(x0, top, z1), P(x0, top, z0)]);
  outline('table', [[[[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]], true], [[[x0 + 0.1, 0, z0 + 0.08], [x0 + 0.1, top, z0 + 0.08]], false], [[[x1 - 0.1, 0, z0 + 0.08], [x1 - 0.1, top, z0 + 0.08]], false]]);
}

// ================================================================== FG: things nearer than the table
a.layer('fg');
// a lantern on a chain from the front beam, over the table
prop(4.3, () => { const [lx, ly] = P(0.7, 2.35, 4.4), [tx, ty] = P(0.7, HT - 0.3, 4.4), s = K(4.4) * 0.13; a.raw(`<path d="M${f(tx)} ${f(ty)} L${f(lx)} ${f(ly - s * 1.6)}" stroke="${INK}" stroke-width="3" stroke-dasharray="4 2"/>` + lantern(lx, ly, s, [0.7, 2.3, 4.35, 1.25, 4.8])); });
prop(3.7, () => {
  const [x, y] = P(0.35, 0, 3.7), s = K(3.7), w = s * 0.17, h = s * 0.22;
  a.shape({ d: `M${f(x - w)} ${f(y - h)} L${f(x + w)} ${f(y - h)} L${f(x + w * 0.85)} ${f(y)} L${f(x - w * 0.85)} ${f(y)} Z`, fill: '#6a6460', depth: 6, ink: 2, hatch: 30, mottle: 0.4, lines: [0.15, 0.85].map(t => ({ d: `M${f(x - w)} ${f(y - h * t)} L${f(x + w)} ${f(y - h * t)}`, w: 2.4, col: '#2a2826' })) });
  for (let k = 0; k < 4; k++) a.raw(`<path d="${blob(x + (k - 1.5) * s * 0.07, y - h - s * 0.02, s * 0.06, R, 7, 0.4)}" fill="${k % 2 ? '#7a2a1a' : LINEN}" stroke="${INK}" stroke-width="1.3"/>`);
  const b = [P(0.7, 0.005, 3.85), P(0.95, 0.005, 3.75), P(1.15, 0.005, 3.95), P(1.3, 0.005, 3.85)];
  a.raw(`<path d="${smooth(b, false, 0.5)}" stroke="${INK}" stroke-width="${f(s * 0.05 + 2)}" fill="none" stroke-linecap="round"/><path d="${smooth(b, false, 0.5)}" stroke="${LINEN}" stroke-width="${f(s * 0.05)}" fill="none" stroke-linecap="round"/>` + a.stain(...P(0.95, 0, 3.78), s * 0.04, G.blood, 0.6));
});
// near left: a chest with clean blankets stacked on it, a ewer and basin beside, rushes strewn across the floor
prop(3.6, () => {
  Pr.rushes(-3.5, 3.0, 2.7, 5.6, 140);
  I.woodBox(-3.0, -2.05, 0, 0.5, 3.9, 4.4, '#4a3424', { bw: 0.12 });
  { const [hx, hy] = P(-2.52, 0.36, 3.9), s = K(3.9); a.raw(`<path d="M${f(hx - s * 0.06)} ${f(hy)} l0 ${f(-s * 0.06)} l${f(s * 0.12)} 0 l0 ${f(s * 0.06)}" fill="${I.metal('#3a3836')}" stroke="${INK}" stroke-width="1.3"/>`); }
  Pr.folded(-2.55, 0.5, 4.15, 5);
  Pr.food(-1.8, 0, 3.85, 'crock'); Pr.bottle(-1.62, 0, 4.0, '#6a6a5a');
});
// near right: a bucket of slops and a mop; near left: a low stool with a bowl of leeches
prop(3.3, () => {
  const [x, y] = P(2.35, 0, 3.3), s = K(3.3), w = s * 0.15, h = s * 0.32;
  a.shape({ d: `M${f(x - w)} ${f(y - h)} L${f(x + w)} ${f(y - h)} L${f(x + w * 0.85)} ${f(y)} L${f(x - w * 0.85)} ${f(y)} Z`, fill: '#4a3a28', depth: 6, ink: 2, hatch: 90, tex: 'url(#grain)', texOp: 0.5, mottle: 0.5,
    lines: [0.2, 0.75].map(t => ({ d: `M${f(x - w)} ${f(y - h * t)} L${f(x + w)} ${f(y - h * t)}`, w: 3, col: '#2a2826' })) });
  a.raw(`<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w)}" ry="${f(s * 0.03)}" fill="#2a1a14" stroke="${INK}" stroke-width="2"/>`);
  a.raw(rod([2.42, 0.3, 3.32], [2.75, 1.5, 3.6], WOOD, 5));
});
if (DETAIL) prop(3.2, () => {
  const [x, y] = P(1.45, 0, 3.05), s = K(3.05), st = s * 0.3, sw = s * 0.2;
  for (const k of [-1, 0.2, 1]) a.raw(`<path d="M${f(x + k * sw * 0.6)} ${f(y - st)} L${f(x + k * sw)} ${f(y)}" stroke="${INK}" stroke-width="${f(s * 0.03 + 2)}" stroke-linecap="round"/><path d="M${f(x + k * sw * 0.6)} ${f(y - st)} L${f(x + k * sw)} ${f(y)}" stroke="${WOOD}" stroke-width="${f(s * 0.03)}" stroke-linecap="round"/>`);
  a.shape({ d: `M${f(x - sw * 0.8)} ${f(y - st)} Q${f(x)} ${f(y - st + s * 0.04)} ${f(x + sw * 0.8)} ${f(y - st)} Q${f(x)} ${f(y - st - s * 0.05)} ${f(x - sw * 0.8)} ${f(y - st)} Z`, fill: '#5a4632', depth: 4, ink: 1.8, tex: 'url(#grain)', texOp: 0.5 });
  a.raw(`<path d="M${f(x - s * 0.1)} ${f(y - st - s * 0.01)} Q${f(x)} ${f(y - st + s * 0.07)} ${f(x + s * 0.1)} ${f(y - st - s * 0.01)} Z" fill="#6a665e" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${f(x)}" cy="${f(y - st - s * 0.01)}" rx="${f(s * 0.1)}" ry="${f(s * 0.02)}" fill="#1a1a14" stroke="${INK}" stroke-width="1.2"/>` +
    Array.from({ length: 3 }, (_, k) => `<path d="M${f(x - s * 0.06 + k * s * 0.05)} ${f(y - st - s * 0.01)} q3 -4 6 0" stroke="#2a1a1a" stroke-width="2.6" fill="none"/>`).join(''));
});

I.write(KEEPER);
