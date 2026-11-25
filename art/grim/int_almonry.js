// The Almonry: Brother Fenn's store. A low, crammed room of boards and plaster, the back wall shelved floor to beams with
// what the dead left and the living will pay for: belt flasks in coloured glass, helms, boots, packs, rope, lanterns.
// Fenn leans over his counter on the open ledger (the panel), a balance and stacked coin at his elbow; the dole hatch in
// the right wall stands open on the lit garth; an iron-bound strongbox squats in the back left. Door in the left wall.
const I = require('./interior')('almonry', { width: 8.4, depth: 6.6, height: 3.4, wall: '#4e463a', wall2: '#544a3e', floorCol: '#4a3a2a', floor: 'boards', ceilCol: '#2e2218', render: 2, renderCol: '#5a5448', seed: 4471, panel: 'ledger', beamGap: 1.2 });
const { a, R, P, K, pp, f, G, INK, mix, dark, light, smooth, blob, PLW, EM, addLight, stones, shade, planks, through, hot, outline, HOT, HW, D1, HT, prop, face, box, rod, seg3, candles, lantern, smoke, barrel, sack } = I;
const DETAIL = process.env.PASS !== 'base';
const Pr = require('./props')(I);
const WOOD = '#4a3624', WOODL = '#6a5034';
const KEEPER = { X: 1.45, Z: 4.35, h: 1.68, sprite: 'fenn', label: 'Brother Fenn', cutY: 0.86, cutZ: 3.85, figure: [200, 830] };
const CTR = { x0: -0.45, x1: 2.3, z0: 3.75, z1: 4.15, top: 0.86 };
const LEDGER = { X: 0.7, Z: 3.95 };

I.shell();
I.door(5.35, 6.1, { side: 1, square: true, ts: 1.85 });   // the almonry's garth door faces east

// ------------------------------------------------------------------ the back wall: shelves to the beams, crammed
{
  const z = D1 - 0.34, rows = [0.0, 1.0, 1.6, 2.2, 2.8];
  prop(z, () => {
    for (const Y of rows.slice(1)) {
      I.wood([[-2.95, Y, z], [HW, Y, z], [HW, Y, D1], [-2.95, Y, D1]], mix(WOODL, '#3a2a1a', R() * 0.3), { bw: 0.12, knots: 0.3 });
      I.wood([[-2.95, Y - 0.06, z], [HW, Y - 0.06, z], [HW, Y, z], [-2.95, Y, z]], WOOD, { boards: 1 });
    }
    const pick = arr => arr[Math.floor(R() * arr.length)], rr = (lo, hi) => lo + R() * (hi - lo);
    // helms: kettle hats with brims, round caps, conical nasal helms, one stove in; each its own steel, rust and tag
    const helm = (X, Y, Z) => { const [x, y] = P(X, Y, Z), s = K(Z) * (0.85 + R() * 0.35), kind = pick(['kettle', 'cap', 'nasal', 'kettle', 'cap']), col = pick([G.steelD, '#5a5450', '#4a3a2a', '#3a3a3e', '#6a4a30', '#2a2622']), tilt = (R() - 0.5) * 24;
      a.raw(`<g transform="rotate(${f(tilt)} ${f(x)} ${f(y)})">`);
      const dome = kind === 'nasal' ? [[x - s * 0.13, y - s * 0.03], [x - s * 0.1, y - s * 0.16], [x, y - s * 0.28], [x + s * 0.1, y - s * 0.16], [x + s * 0.13, y - s * 0.03]] : [[x - s * 0.13, y - s * 0.03], [x - s * 0.12, y - s * 0.14], [x, y - s * 0.2], [x + s * 0.12, y - s * 0.14], [x + s * 0.13, y - s * 0.03]];
      if (kind === 'kettle') a.raw(`<ellipse cx="${f(x)}" cy="${f(y - s * 0.03)}" rx="${f(s * 0.22)}" ry="${f(s * 0.05)}" fill="${I.metal(col)}" stroke="${INK}" stroke-width="1.4"/>`);
      a.shape({ d: smooth(dome, true, 0.5), fill: I.metal(col), depth: 5, ink: 1.4, hatch: 60, specOp: 0.3, spec: [`M${f(x - s * 0.07)} ${f(y - s * 0.14)} Q${f(x - s * 0.02)} ${f(y - s * 0.19)} ${f(x + s * 0.04)} ${f(y - s * 0.17)}`],
        lines: kind === 'nasal' ? [{ d: `M${f(x)} ${f(y - s * 0.27)} L${f(x)} ${f(y - s * 0.02)}`, w: 1.2 }] : kind === 'cap' ? [{ d: `M${f(x - s * 0.13)} ${f(y - s * 0.06)} L${f(x + s * 0.13)} ${f(y - s * 0.06)}`, w: 2.2, col: '#3a3836' }] : [],
        decals: I.rust(x + s * (R() - 0.5) * 0.15, y - s * 0.08, s * 0.05) + (R() < 0.35 ? `<path d="M${f(x - s * 0.04)} ${f(y - s * 0.18)} l${f(s * 0.03)} ${f(s * 0.06)} l${f(-s * 0.02)} ${f(s * 0.05)}" stroke="#0a0806" stroke-width="2" fill="none"/>` : '') });
      if (kind === 'nasal') a.raw(`<rect x="${f(x - s * 0.015)}" y="${f(y - s * 0.07)}" width="${f(s * 0.03)}" height="${f(s * 0.08)}" fill="${I.metal(col)}" stroke="${INK}" stroke-width="1"/>`);
      if (R() < 0.6) a.raw(`<rect x="${f(x + s * 0.08)}" y="${f(y - s * 0.07)}" width="${f(s * 0.06)}" height="${f(s * 0.04)}" fill="#c8b890" stroke="${INK}" stroke-width="0.6"/>`);
      a.raw('</g>'); return 0.3 + (kind === 'kettle' ? 0.12 : 0); };
    // boots: tall riding boots, short shoes, a single boot on its side; leathers of different cure
    const boots = (X, Y, Z) => { const [x, y] = P(X, Y, Z), s = K(Z), tall = R() < 0.5, ht = tall ? rr(0.26, 0.34) : rr(0.12, 0.17), col = pick([G.leatherD, '#3a2a1e', '#5a3a22', '#2a2018', '#6a4a2a']);
      if (R() < 0.2) { a.shape({ d: smooth([[x - s * 0.15, y], [x - s * 0.15, y - s * 0.09], [x + s * 0.12, y - s * 0.1], [x + s * 0.2, y - s * 0.04], [x + s * 0.18, y]], true, 0.4), fill: col, depth: 4, ink: 1.3, hatch: 60, grime: 0.4, lines: [{ d: `M${f(x - s * 0.05)} ${f(y - s * 0.09)} L${f(x - s * 0.05)} ${f(y)}`, w: 1 }] }); return 0.38; }
      for (const dx of [-0.055, 0.06]) { const bx = x + s * dx; a.shape({ d: smooth([[bx - s * 0.05, y - s * ht], [bx + s * 0.05, y - s * ht], [bx + s * 0.05, y - s * 0.06], [bx + s * 0.11, y - s * 0.01], [bx + s * 0.1, y], [bx - s * 0.06, y], [bx - s * 0.06, y - s * 0.1]], true, 0.4), fill: mix(col, '#140c06', R() * 0.2), depth: 4, ink: 1.3, hatch: 60, grime: 0.4,
        lines: [{ d: `M${f(bx - s * 0.05)} ${f(y - s * ht * 0.85)} L${f(bx + s * 0.05)} ${f(y - s * ht * 0.85)}`, w: 1, op: 0.6 }, { d: `M${f(bx - s * 0.06)} ${f(y - s * 0.015)} L${f(bx + s * 0.1)} ${f(y - s * 0.015)}`, w: 1.6, col: '#1a120a' }],
        spec: [`M${f(bx - s * 0.03)} ${f(y - s * ht * 0.7)} L${f(bx - s * 0.03)} ${f(y - s * 0.12)}`], specOp: 0.18 }); }
      return 0.32; };
    const pack = (X, Y, Z) => { const [x, y] = P(X, Y, Z), s = K(Z) * rr(0.8, 1.15), col = pick(['#5a4a32', '#4a4a36', '#6a5038', '#3a3a2e']); a.shape({ d: smooth([[x - s * 0.16, y], [x - s * 0.18, y - s * 0.2], [x - s * 0.08, y - s * 0.32], [x + s * 0.1, y - s * 0.3], [x + s * 0.17, y - s * 0.15], [x + s * 0.15, y]], true, 0.5), fill: col, depth: 6, ink: 1.4, hatch: 60, grime: 0.5, tex: 'url(#weave)', texOp: 0.4,
      lines: [{ d: `M${f(x - s * 0.1)} ${f(y - s * 0.28)} Q${f(x)} ${f(y - s * 0.1)} ${f(x + s * 0.12)} ${f(y - s * 0.26)}`, w: 2.2, col: G.leatherD }, { d: `M${f(x - s * 0.06)} ${f(y - s * 0.18)} l${f(s * 0.12)} 0 l0 ${f(s * 0.1)} l${f(-s * 0.12)} 0 Z`, w: 1, op: 0.7 }], decals: R() < 0.4 ? a.stain(x, y - s * 0.1, s * 0.08, G.blood, 0.4) : '' });
      a.raw(`<circle cx="${f(x)}" cy="${f(y - s * 0.12)}" r="${f(Math.max(1.5, s * 0.012))}" fill="${G.gold}" stroke="${INK}" stroke-width="0.6"/>`); return 0.36; };
    const rope = (X, Y, Z) => { const [x, y] = P(X, Y, Z), s = K(Z), rw = s * rr(0.1, 0.15), col = pick(['#8a7a5a', '#6a5a3a', '#9a8a62']); for (let k = 0; k < 3 + Math.floor(R() * 4); k++) a.raw(`<ellipse cx="${f(x + (R() - 0.5) * 2)}" cy="${f(y - s * 0.06 - k * 2.2)}" rx="${f(rw)}" ry="${f(rw * 0.5)}" fill="none" stroke="${INK}" stroke-width="4"/><ellipse cx="${f(x + (R() - 0.5) * 2)}" cy="${f(y - s * 0.06 - k * 2.2)}" rx="${f(rw)}" ry="${f(rw * 0.5)}" fill="none" stroke="${col}" stroke-width="2.2" stroke-dasharray="3 1"/>`); return 0.34; };
    const mail = (X, Y, Z) => { const [x, y] = P(X, Y, Z), s = K(Z); a.shape({ d: smooth([[x - s * 0.2, y], [x - s * 0.16, y - s * 0.1], [x - s * 0.02, y - s * 0.15], [x + s * 0.15, y - s * 0.09], [x + s * 0.2, y]], true, 0.5), fill: I.metal('#5a5a58'), depth: 5, ink: 1.4, hatch: 60, tex: 'url(#weave)', texOp: 0.9, decals: I.rust(x, y - s * 0.05, s * 0.07) }); return 0.44; };
    const bowls = (X, Y, Z) => { const [x, y] = P(X, Y, Z), s = K(Z); for (let k = 0; k < 2 + Math.floor(R() * 4); k++) a.raw(`<path d="M${f(x - s * 0.09)} ${f(y - k * s * 0.025)} Q${f(x)} ${f(y - k * s * 0.025 + s * 0.04)} ${f(x + s * 0.09)} ${f(y - k * s * 0.025)} L${f(x + s * 0.1)} ${f(y - k * s * 0.025 - s * 0.03)} L${f(x - s * 0.1)} ${f(y - k * s * 0.025 - s * 0.03)} Z" fill="${mix('#6a5038', '#8a7a6a', R())}" stroke="${INK}" stroke-width="1"/>`); return 0.25; };
    const flasks = (X, Y, Z) => { const n = 2 + Math.floor(R() * 6); let w = 0; for (let k = 0; k < n; k++) { Pr.bottle(X + w, Y, Z - R() * 0.08); w += 0.07 + R() * 0.06; } return w + 0.05; };
    const lamp = (X, Y, Z) => { const [x, y] = P(X, Y, Z), s = K(Z) * 0.1; a.raw(lantern(x, y - s * 1.2, s)); return 0.25; };
    const folds = (X, Y, Z) => { Pr.folded(X + 0.12, Y, Z, 2 + Math.floor(R() * 3)); return 0.5; };
    const zz = D1 - 0.17;
    const stock = (Y, list) => { for (let X = -2.75; X < HW - 0.3;) { if (R() < 0.12) { X += 0.2 + R() * 0.3; continue; } const fn = list[Math.floor(R() * list.length)]; X += fn(X, Y, zz) * (0.95 + R() * 0.3); } };
    stock(rows[2], [flasks, flasks, flasks, (X, Y, Z) => { Pr.food(X, Y, Z, 'crock'); return 0.16; }, bowls]);   // eye level: glass catching the light
    stock(rows[3], [helm, helm, helm, mail, bowls]);
    stock(rows[4], [pack, rope, folds, bowls]);
    stock(rows[1], [boots, boots, pack, mail, folds]);
    stock(rows[0], [pack, rope, boots, folds]);
    for (const X of [-2.95, -0.3, 2.2, HW - 0.05]) I.woodBox(X - 0.05, X + 0.05, 0, HT, z - 0.04, D1, dark(WOOD, 0.1), { boards: 1, knots: 0.5 });
    // a price slate hooked to a post: rows of chalk tallies
    if (DETAIL) { const [x, y] = P(-0.28, 1.5, z - 0.05), s = K(z); a.shape({ d: `M${f(x - s * 0.14)} ${f(y - s * 0.2)} L${f(x + s * 0.14)} ${f(y - s * 0.2)} L${f(x + s * 0.14)} ${f(y + s * 0.18)} L${f(x - s * 0.14)} ${f(y + s * 0.18)} Z`, fill: '#2a2a2c', depth: 3, ink: 1.6, hatch: 0, core: false,
      lines: Array.from({ length: 5 }, (_, r) => ({ d: `M${f(x - s * 0.1)} ${f(y - s * 0.14 + r * s * 0.065)} l${f(s * 0.08)} 0 m${f(s * 0.03)} 0 ${Array.from({ length: 1 + r % 3 }, () => `l0 ${f(s * 0.03)} m${f(s * 0.02)} ${f(-s * 0.03)}`).join(' ')}`, w: 1, col: '#c8c0b0', op: 0.7 })) }); }
  });
}
// hung from the beams: cloaks for sale, a string of boots, a pair of crutches
prop(5.6, () => {
  const Z = 5.6, s = K(Z);
  for (const [X, col, L] of [[-2.4, '#3a3a34', 1.1], [-1.75, '#5a3a2a', 0.85], [-1.2, '#2a3036', 1.0]]) { const [x, y] = P(X, HT - 0.3, Z); a.raw(`<path d="M${f(x)} ${f(y)} l0 ${f(s * 0.12)}" stroke="${INK}" stroke-width="1.6"/>`);
    a.shape({ d: smooth([[x - s * 0.08, y + s * 0.12], [x + s * 0.08, y + s * 0.12], [x + s * 0.22, y + s * 0.6 * L], [x + s * 0.2, y + s * 1.05 * L], [x + s * 0.02, y + s * 1.0 * L], [x - s * 0.18, y + s * 1.1 * L], [x - s * 0.22, y + s * 0.55 * L]], true, 0.4), fill: col, depth: 10, ink: 1.6, hatch: 70, grime: 0.5, tex: 'url(#weave)', texOp: 0.35, decals: R() < 0.7 ? a.stain(x, y + s * 0.8 * L, s * 0.15, '#140c06', 0.5) : '',
      lines: [{ d: `M${f(x)} ${f(y + s * 0.2)} L${f(x - s * 0.04)} ${f(y + s * 1.0)}`, w: 1, op: 0.6 }, { d: `M${f(x + s * 0.1)} ${f(y + s * 0.3)} L${f(x + s * 0.1)} ${f(y + s * 1.0)}`, w: 0.8, op: 0.5 }] }); }
});
// the strongbox: iron-bound, padlocked, a dog-chain from it to a ring in the wall
prop(5.5, () => {
  const x0 = -2.75, x1 = -1.75, z0 = 5.5, z1 = 6.0, h = 0.62, s = K(z0);
  I.woodBox(x0, x1, 0, h, z0, z1, '#3e2e1e', { bw: 0.15 });
  for (const t of [0.12, 0.5, 0.88]) a.raw(seg3([x0 + (x1 - x0) * t, 0, z0 - 0.01], [x0 + (x1 - x0) * t, h, z0 - 0.01], '#2a2826', 5) + seg3([x0 + (x1 - x0) * t, h + 0.005, z0], [x0 + (x1 - x0) * t, h + 0.005, z1], '#2a2826', 4));
  for (let i = 0; i < 10; i++) { const [x, y] = P(x0 + (x1 - x0) * ((i % 5) / 4) * 0.76 + 0.12, i < 5 ? 0.08 : h - 0.06, z0 - 0.01); a.raw(a.rivet(x, y, 2.2)); }
  const [lx, ly] = P((x0 + x1) / 2, h - 0.12, z0 - 0.02);
  a.raw(`<path d="M${f(lx - 7)} ${f(ly)} a7 7 0 0 1 14 0" stroke="${INK}" stroke-width="3.4" fill="none"/><rect x="${f(lx - 10)}" y="${f(ly)}" width="20" height="18" rx="3" fill="${G.iron}" stroke="${INK}" stroke-width="2"/><circle cx="${f(lx)}" cy="${f(ly + 8)}" r="2" fill="${INK}"/>`);
});
// the dole hatch in the right wall: shutters thrown open on the garth, where the queue waits in the brazier light
{
  const atR = (s, t) => [HW, t, s], z0 = 4.72, z1 = 5.15, y0 = 0.95, y1 = 2.05;
  const hole = [atR(z0, y0), atR(z1, y0), atR(z1, y1), atR(z0, y1)];
  through(hole, () => {
    const gid = a.id('hg');
    a.raw(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3430"/><stop offset="0.6" stop-color="#7a5232"/><stop offset="1" stop-color="#c8843e"/></linearGradient>`);
    a.raw(PLW([[HW + 3, 0, 4], [HW + 3, 1, 4], [HW + 3, 0, 5]], EM(`<path d="${pp([[HW + 0.1, y0 - 0.5, z0 - 0.5], [HW + 0.1, y0 - 0.5, z1 + 0.6], [HW + 0.1, y1 + 0.5, z1 + 0.6], [HW + 0.1, y1 + 0.5, z0 - 0.5]])}" fill="url(#${gid})"/>`)));
    a.raw(EM(`<path d="${blob(...P(HW + 2.5, 0.9, (z0 + z1) / 2 + 1.2), K(6.5) * 0.25, R, 9, 0.5)}" fill="#ffb050"/><path d="${blob(...P(HW + 2.5, 0.8, (z0 + z1) / 2 + 1.2), K(6.5) * 0.15, R, 7, 0.4)}" fill="#fff0b0"/>`));
    // a hooded head in the queue outside, and a reaching hand with a bowl
    const [hx, hy] = P(HW + 0.6, 1.75, (z0 + z1) / 2), s = K(5.2);
    a.raw(`<path d="${blob(hx, hy, s * 0.18, R, 8, 0.15)}" fill="#1a1612"/><path d="M${f(hx - s * 0.3)} ${f(hy + s * 0.15)} Q${f(hx)} ${f(hy + s * 0.05)} ${f(hx + s * 0.3)} ${f(hy + s * 0.2)} L${f(hx + s * 0.35)} ${f(hy + s * 0.6)} L${f(hx - s * 0.35)} ${f(hy + s * 0.6)} Z" fill="#1a1612"/>`);
    face([[HW, y0, z0], [HW + 0.5, y0, z0], [HW + 0.5, y0, z1], [HW, y0, z1]], '#5a4a36', 1.4);
  });
  // the sill, the shutters folded back into the room, a bowl on the sill
  a.raw(planks((s, t) => [HW - s * 0.7, y0 + 0.03 + t, z0 - s * 0.2], 0.55, y1 - y0 - 0.06, '#4a3826', { board: 0.14, nails: 4 }));
  face([[HW, y0 - 0.06, z0 - 0.1], [HW - 0.25, y0 - 0.06, z0 - 0.1], [HW - 0.25, y0, z1 + 0.1], [HW, y0, z1 + 0.1]], '#6a5440', 1.4);
  addLight(HW - 0.35, 1.45, (z0 + z1) / 2, 0.9, 4.5, [1.0, 0.62, 0.32]);
  prop(5.0, () => { const [bx, by] = P(HW - 0.12, y0, 5.1), bs = K(5.1); a.raw(`<path d="M${f(bx - bs * 0.1)} ${f(by)} Q${f(bx)} ${f(by + bs * 0.06)} ${f(bx + bs * 0.1)} ${f(by)} Z" fill="#6a5440" stroke="${INK}" stroke-width="1.4"/>`); });
}
// a lantern on a hook over the counter
prop(4.9, () => { const [lx, ly] = P(-0.3, 2.25, 4.4), [tx, ty] = P(-0.3, HT - 0.3, 4.4), s = K(4.4) * 0.13; a.raw(`<path d="M${f(tx)} ${f(ty)} L${f(lx)} ${f(ly - s * 1.6)}" stroke="${INK}" stroke-width="3"/>` + lantern(lx, ly, s, [-0.3, 2.2, 4.35, 1.1, 4.5])); });

// ================================================================== MID: the counter, the ledger, the balance, the coin
a.layer('mid');
prop(CTR.z0, () => {
  const { x0, x1, z0, z1, top } = CTR, s = K(z0);
  // a heavy boarded counter, the front scarred where coin is slapped down
  a.raw(planks((u, t) => [x0 + u, t, z0], x1 - x0, top - 0.06, '#4a3624', { board: 0.2, nails: 10 }));
  shade([[x0, 0, z0], [x1, 0, z0], [x1, top - 0.06, z0], [x0, top - 0.06, z0]], { depth: 12, mottle: 0.5, grime: 0.6, ink: 2, wash: 0.35 });
  face([[x0 - 0.06, top - 0.06, z0 - 0.06], [x1 + 0.06, top - 0.06, z0 - 0.06], [x1 + 0.06, top, z0 - 0.06], [x0 - 0.06, top, z0 - 0.06]], dark(WOODL, 0.15), 1.8);
  face([[x0 - 0.06, top, z0 - 0.06], [x1 + 0.06, top, z0 - 0.06], [x1 + 0.06, top, z1], [x0 - 0.06, top, z1]], WOODL, 1.8, `<path d="${pp([[x0 - 0.06, top, z0 - 0.06], [x1 + 0.06, top, z0 - 0.06], [x1 + 0.06, top, z1], [x0 - 0.06, top, z1]])}" fill="url(#grain)" opacity="0.5"/>`);
  if (DETAIL) { const nt = [[0.9, 0.35, z0 - 0.012], [1.35, 0.35, z0 - 0.012], [1.35, 0.68, z0 - 0.012], [0.9, 0.68, z0 - 0.012]]; face(nt, '#b8aa88', 1.2);
    for (let r = 0; r < 6; r++) a.raw(`<path d="${pp([[0.95, 0.62 - r * 0.045, z0 - 0.015], [1.3 - R() * 0.1, 0.62 - r * 0.045, z0 - 0.015]]).replace(' Z', '')}" stroke="#3a3028" stroke-width="1" opacity="0.7"/>`);
    for (const [X, Y] of [[0.93, 0.66], [1.32, 0.66]]) { const [nx, ny] = P(X, Y, z0 - 0.02); a.raw(`<circle cx="${f(nx)}" cy="${f(ny)}" r="2" fill="${INK}"/>`); }
    for (let k = 0; k < 8; k++) { const X = x0 + 0.1 + R() * (x1 - x0 - 0.2), Y = 0.1 + R() * 0.6, [gx, gy] = P(X, Y, z0 - 0.01); a.raw(`<path d="M${f(gx)} ${f(gy)} l${f(6 + R() * 16)} ${f((R() - 0.5) * 8)}" stroke="#1a120a" stroke-width="2.4" opacity="0.8"/><path d="M${f(gx)} ${f(gy + 1.5)} l${f(6 + R() * 12)} ${f((R() - 0.5) * 6)}" stroke="#8a6a4a" stroke-width="0.8" opacity="0.6"/>`); } }
  if (DETAIL) for (let k = 0; k < 14; k++) { const [x, y] = P(x0 + R() * (x1 - x0), 0.2 + R() * 0.6, z0 - 0.01); a.raw(`<path d="M${f(x)} ${f(y)} l${f((R() - 0.5) * 14)} ${f((R() - 0.5) * 4)}" stroke="${INK}" stroke-width="0.9" opacity="0.6"/>`); }
  // the ledger: a great book open on the counter, red rubric and black columns
  const { X, Z } = LEDGER, w = 0.42, d = 0.3, t = top + 0.04;
  const L = [[X - w, t, Z - d / 2], [X, t + 0.02, Z - d / 2], [X, t + 0.02, Z + d / 2], [X - w, t, Z + d / 2]], Rr = [[X, t + 0.02, Z - d / 2], [X + w, t, Z - d / 2], [X + w, t, Z + d / 2], [X, t + 0.02, Z + d / 2]];
  face([[X - w - 0.02, top + 0.005, Z - d / 2 - 0.02], [X + w + 0.02, top + 0.005, Z - d / 2 - 0.02], [X + w + 0.02, top + 0.005, Z + d / 2 + 0.02], [X - w - 0.02, top + 0.005, Z + d / 2 + 0.02]], '#5a1e14', 1.6);
  face([[X - w - 0.02, top, Z - d / 2 - 0.02], [X + w + 0.02, top, Z - d / 2 - 0.02], [X + w + 0.02, t, Z - d / 2 - 0.02], [X - w - 0.02, t, Z - d / 2 - 0.02]], '#d8ccb0', 1.4);
  for (const pg of [L, Rr]) {
    face(pg, '#d4c6a4', 1.6);
    a.raw(`<path d="${pp([[pg[0][0], t, pg[0][2]], [pg[1][0], t, pg[1][2]]]).replace(' Z', '')}" stroke="#8a7a5a" stroke-width="3" opacity="0.5"/>`);
    let lines = '';
    for (let r = 0; r < 7; r++) { const zz = Z - d / 2 + 0.03 + r * 0.03, xa = pg[0][0] + 0.03, xb = pg[1][0] - 0.03; lines += `<path d="${pp([[xa, t + 0.01, zz], [xb, t + 0.01, zz]]).replace(' Z', '')}" stroke="${r === 0 ? '#9a2a1a' : '#4a4038'}" stroke-width="${r === 0 ? 1.8 : 0.8}" opacity="0.7"/>`; }
    a.raw(`<path d="${pp([[pg[0][0] + 0.02, t + 0.01, Z - d / 2 + 0.02], [pg[0][0] + 0.02, t + 0.01, Z + d / 2 - 0.02]]).replace(' Z', '')}" stroke="#9a2a1a" stroke-width="1.2" opacity="0.7"/>`);
    a.raw(lines);
  }
  // his purse and counting board set out on the counter by the book
  { const [px, py] = P(1.55, top, 3.9), ps = K(3.9);
    a.shape({ d: smooth([[px - ps * 0.12, py], [px - ps * 0.13, py - ps * 0.1], [px - ps * 0.05, py - ps * 0.16], [px + ps * 0.08, py - ps * 0.15], [px + ps * 0.13, py - ps * 0.06], [px + ps * 0.11, py]], true, 0.5), fill: '#6a4a2a', depth: 6, ink: 1.8, hatch: 60, mottle: 0.5, spec: [`M${f(px - ps * 0.06)} ${f(py - ps * 0.12)} Q${f(px)} ${f(py - ps * 0.15)} ${f(px + ps * 0.06)} ${f(py - ps * 0.12)}`], specOp: 0.35 });
    const bb = [[-0.05, top + 0.005, 3.82], [0.32, top + 0.005, 3.82], [0.32, top + 0.005, 4.02], [-0.05, top + 0.005, 4.02]]; face(bb, '#5a3e26', 1.4);
    for (let r = 0; r < 4; r++) { const zz = 3.85 + r * 0.045; a.raw(`<path d="${pp([[-0.02, top + 0.01, zz], [0.29, top + 0.01, zz]]).replace(' Z', '')}" stroke="${INK}" stroke-width="0.9"/>`); for (let k = 0; k < 5; k++) { const [bx2, by2] = P(0.0 + (k + (r % 2) * 2) * 0.035 + (k > 2 ? 0.05 : 0), top + 0.015, zz); a.raw(`<circle cx="${f(bx2)}" cy="${f(by2)}" r="2.6" fill="${r % 2 ? '#8a2a1a' : '#c8b890'}" stroke="${INK}" stroke-width="0.7"/>`); } } }
  // inkhorn and quill, a balance, stacked coin, a candle
  { const [ix, iy] = P(X + w + 0.12, top, Z - 0.05), is = K(Z); a.raw(`<path d="M${f(ix - is * 0.03)} ${f(iy)} L${f(ix - is * 0.04)} ${f(iy - is * 0.07)} L${f(ix + is * 0.04)} ${f(iy - is * 0.07)} L${f(ix + is * 0.03)} ${f(iy)} Z" fill="#2a1e14" stroke="${INK}" stroke-width="1.4"/><path d="M${f(ix)} ${f(iy - is * 0.07)} Q${f(ix + is * 0.08)} ${f(iy - is * 0.22)} ${f(ix + is * 0.2)} ${f(iy - is * 0.3)}" stroke="#e8e0d0" stroke-width="2.4" fill="none"/>`); }
  { const bx = -0.15, bz = 3.98, [x, y] = P(bx, top, bz), s2 = K(bz), [tx, ty] = P(bx, top + 0.38, bz);
    a.raw(`<path d="M${f(x - s2 * 0.08)} ${f(y)} L${f(x + s2 * 0.08)} ${f(y)} L${f(x + s2 * 0.03)} ${f(y - s2 * 0.04)} L${f(x - s2 * 0.03)} ${f(y - s2 * 0.04)} Z" fill="${G.goldL}" stroke="${INK}" stroke-width="1.4"/><path d="M${f(x)} ${f(y - s2 * 0.04)} L${f(tx)} ${f(ty)}" stroke="${INK}" stroke-width="3.4"/><path d="M${f(x)} ${f(y - s2 * 0.04)} L${f(tx)} ${f(ty)}" stroke="${G.gold}" stroke-width="1.8"/>`);
    const bm = [[tx - s2 * 0.2, ty + s2 * 0.02], [tx + s2 * 0.2, ty - s2 * 0.02]];
    a.raw(`<path d="M${f(bm[0][0])} ${f(bm[0][1])} L${f(bm[1][0])} ${f(bm[1][1])}" stroke="${INK}" stroke-width="3.4"/><path d="M${f(bm[0][0])} ${f(bm[0][1])} L${f(bm[1][0])} ${f(bm[1][1])}" stroke="${G.gold}" stroke-width="1.8"/>`);
    for (const [px, py, dy] of [[bm[0][0], bm[0][1], 0.2], [bm[1][0], bm[1][1], 0.16]]) a.raw(`<path d="M${f(px)} ${f(py)} L${f(px - s2 * 0.05)} ${f(py + s2 * dy)} M${f(px)} ${f(py)} L${f(px + s2 * 0.05)} ${f(py + s2 * dy)}" stroke="${INK}" stroke-width="0.9"/><path d="M${f(px - s2 * 0.07)} ${f(py + s2 * dy)} Q${f(px)} ${f(py + s2 * (dy + 0.04))} ${f(px + s2 * 0.07)} ${f(py + s2 * dy)} Z" fill="${G.gold}" stroke="${INK}" stroke-width="1.2"/>`); }
  for (let k = 0; k < 4; k++) { const [x, y] = P(0.1 + k * 0.08, top, 3.88 + (k % 2) * 0.06), s2 = K(4.0), n = 2 + Math.floor(R() * 5);
    for (let c = 0; c < n; c++) a.raw(`<ellipse cx="${f(x)}" cy="${f(y - c * s2 * 0.012)}" rx="${f(s2 * 0.025)}" ry="${f(s2 * 0.008)}" fill="${k % 3 ? '#a8a49a' : G.goldL}" stroke="${INK}" stroke-width="0.7"/>`); }
  a.raw(candles(2.0, 4.05, 2, top, 0.18));
  addLight(1.8, 1.25, 3.95, 0.45, 2.6, [1.0, 0.72, 0.42]);
});
{
  const { X, Z } = LEDGER, w = 0.44, d = 0.32, t = CTR.top + 0.06;
  hot('ledger', 'The ledger', [P(X - w, t, Z - d / 2), P(X + w, t, Z - d / 2), P(X + w, t, Z + d / 2), P(X - w, t, Z + d / 2)].map(q => [q[0], q[1] + 6]).concat([P(X + w, t, Z - d / 2)].map(q => [q[0], q[1] - 10])).slice(0, 4));
  HOT.ledger.poly = [P(X - w - 0.05, t, Z - d / 2 - 0.05), P(X + w + 0.05, t, Z - d / 2 - 0.05), P(X + w + 0.05, t, Z + d / 2 + 0.05), P(X - w - 0.05, t, Z + d / 2 + 0.05)].map(q => q.map(f));
  outline('ledger', [[[[X - w - 0.03, t, Z - d / 2 - 0.03], [X + w + 0.03, t, Z - d / 2 - 0.03], [X + w + 0.03, t, Z + d / 2 + 0.03], [X - w - 0.03, t, Z + d / 2 + 0.03]], true]]);
}

// ================================================================== FG
a.layer('fg');
// near left: a crate of salvage, a cracked shield and a bundle of spears leaned on it; near right: a sack of boots
prop(3.1, () => {
  const Z = 3.1, s = K(Z), [x, y] = P(-2.3, 0, Z), w = s * 0.55;
  a.raw(rod([-2.75, 0, 3.25], [-2.35, 1.4, 3.45], WOOD, 5) + rod([-2.6, 0, 3.25], [-2.1, 1.45, 3.5], WOOD, 5) + rod([-2.5, 0, 3.2], [-2.45, 1.55, 3.5], WOOD, 4));
  for (const [X2, Y2] of [[-2.35, 1.4], [-2.1, 1.45], [-2.45, 1.55]]) { const [tx, ty] = P(X2, Y2, 3.48); a.raw(`<path d="M${f(tx - 5)} ${f(ty + 10)} L${f(tx)} ${f(ty - 14)} L${f(tx + 5)} ${f(ty + 10)} Z" fill="${G.steelD}" stroke="${INK}" stroke-width="1.6"/>`); }
  I.woodBox(-2.6, -2.0, 0, 0.45, 3.1, 3.5, '#5a4430', { bw: 0.11 });
  const [sx, sy] = P(-1.9, 0.35, 2.95), ss = K(2.95);
  { const sd = smooth([[sx - ss * 0.3, sy - ss * 0.3], [sx + ss * 0.3, sy - ss * 0.3], [sx + ss * 0.28, sy + ss * 0.05], [sx, sy + ss * 0.35], [sx - ss * 0.28, sy + ss * 0.05]], true, 0.3);
    a.shape({ d: sd, fill: I.grad('#7a3020', '#3a140c'), depth: 10, ink: 2.4, hatch: 60, grime: 0.5,
      decals: `<path d="M${f(sx - ss * 0.3)} ${f(sy - ss * 0.05)} L${f(sx)} ${f(sy - ss * 0.22)} L${f(sx + ss * 0.3)} ${f(sy - ss * 0.05)} L${f(sx + ss * 0.3)} ${f(sy + ss * 0.06)} L${f(sx)} ${f(sy - ss * 0.11)} L${f(sx - ss * 0.3)} ${f(sy + ss * 0.06)} Z" fill="#b8a070" opacity="0.7"/>` +
        `<path d="${sd}" fill="none" stroke="#5a4430" stroke-width="${f(ss * 0.035)}"/>` + Array.from({ length: 9 }, () => { const gx = sx + (R() - 0.5) * ss * 0.5, gy = sy + (R() - 0.6) * ss * 0.5; return `<path d="M${f(gx)} ${f(gy)} l${f((R() - 0.5) * ss * 0.12)} ${f((R() - 0.3) * ss * 0.06)}" stroke="#d8c8a8" stroke-width="1.2" opacity="0.5"/>`; }).join('') + a.stain(sx + ss * 0.05, sy + ss * 0.08, ss * 0.12, '#1a0e08', 0.6) + a.stain(sx - ss * 0.15, sy - ss * 0.15, ss * 0.06, '#140c06', 0.5),
      lines: [{ d: `M${f(sx - ss * 0.05)} ${f(sy - ss * 0.3)} L${f(sx + ss * 0.08)} ${f(sy + ss * 0.1)} L${f(sx - ss * 0.02)} ${f(sy + ss * 0.3)}`, w: 2.4 }] });
    for (const [rx, ry] of [[-0.24, -0.24], [0.24, -0.24], [-0.22, 0.02], [0.22, 0.02]]) a.raw(a.rivet(sx + ss * rx, sy + ss * ry, 2.6)); }
});
if (DETAIL) prop(3.5, () => { let o = ''; for (let k = 0; k < 40; k++) { const [x, y] = P(-2 + R() * 4.5, 0, 2.8 + R() * 0.9); o += `<path d="M${f(x)} ${f(y)} l${f((R() - 0.5) * 16)} ${f((R() - 0.5) * 4)}" stroke="#a8904a" stroke-width="1.4" opacity="0.7"/>`; } for (let k = 0; k < 4; k++) { const [x, y] = P(0.3 + R() * 1.6, 0, 3.0 + R() * 0.6); o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="4.5" ry="1.8" fill="${G.goldL}" stroke="${INK}" stroke-width="0.8"/>`; } a.raw(o); });
for (const [X, Z, k] of [[-1.0, 4.6, 0], [0.9, 5.3, 1], [2.5, 4.9, 2]]) prop(Z, () => { const top = HT - 0.3, [x, y] = P(X, top - 0.45, Z), s = K(Z); a.raw(seg3([X, top, Z], [X, top - 0.3, Z], INK, 1.4));
  if (k === 0) a.shape({ d: smooth([[x - s * 0.2, y - s * 0.12], [x + s * 0.2, y - s * 0.12], [x + s * 0.16, y + s * 0.14], [x - s * 0.16, y + s * 0.14]], true, 0.3), fill: '#6a5a3a', tex: 'url(#weave)', texOp: 0.8, depth: 6, ink: 1.6, hatch: 60 });
  else if (k === 1) for (let i = 0; i < 3; i++) a.shape({ d: smooth([[x - s * 0.12 + i * s * 0.1, y - s * 0.1], [x - s * 0.06 + i * s * 0.1, y - s * 0.1], [x - s * 0.05 + i * s * 0.1, y + s * 0.2], [x - s * 0.13 + i * s * 0.1, y + s * 0.2]], true, 0.4), fill: i % 2 ? G.leatherD : '#3a2a1e', depth: 4, ink: 1.4, hatch: 60 });
  else a.raw(lantern(x, y, s * 0.1)); });
prop(3.3, () => { Pr.sack(-1.05, 0, 3.3, { open: true, contents: '#3a2a1e' }); const [x, y] = P(-1.05, 0.5, 3.3), s = K(3.3); for (const dx of [-0.08, 0.06]) a.shape({ d: smooth([[x + s * dx - s * 0.04, y - s * 0.22], [x + s * dx + s * 0.04, y - s * 0.22], [x + s * dx + s * 0.05, y], [x + s * dx - s * 0.05, y]], true, 0.4), fill: G.leatherD, depth: 4, ink: 1.6, hatch: 60 }); });

// a lantern hung on the left shelf post, so the spears and the strongbox are not lost in the dark
prop(6.2, () => { const [lx, ly] = P(-2.95, 1.9, 6.15), ls = K(6.15) * 0.1; a.raw(I.seg3([-2.95, 2.2, 6.15], [-2.95, 1.98, 6.15], INK, 1.4) + lantern(lx, ly, ls)); addLight(-2.95, 1.8, 5.9, 0.65, 4.5, [1.0, 0.72, 0.42]); });
I.write(KEEPER);
