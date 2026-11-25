// The Sacristy: Sister Ide's cold stone lean-to against the church. A low barrel vault rimed with frost, a vestment press
// against the back wall, an altar shelf where the Teeth lie in their gilt casket (she says they are warm, and the only
// warm light in the room comes from them), a slit of a window, and before it all the relic case (the panel): a
// glass-fronted cabinet on a stand, its relics lit cold from inside. Ide stands with her bare hand flat on its glass.
const I = require('./interior')('sacristy', { width: 8, depth: 6.8, height: 3.6, vault: true, spring: 2.5, wall: '#504a44', wall2: '#58524a', vaultCol: '#4a4640', floorCol: '#3c3834', seed: 6619, panel: 'reliquary', ribs: [5.0] });
const { a, R, P, K, pp, f, G, INK, mix, dark, light, smooth, blob, PLW, EM, addLight, stones, shade, planks, through, hot, outline, HOT, HW, D1, HT, prop, face, box, rod, seg3, candles, lantern } = I;
const DETAIL = process.env.PASS !== 'base';
const Pr = require('./props')(I);
const WOOD = '#3e2e20', WOODL = '#5a4632', FROST = '#b8d4e8';
const KEEPER = { X: 1.2, Z: 4.0, h: 1.62, sprite: 'ide', label: 'Sister Ide', figure: [175, 830] };
const CASE = { x0: -0.75, x1: 0.75, z0: 4.05, z1: 4.5, y0: 0.85, y1: 1.85 };

I.shell();
I.door(5.0, 5.8, { side: -1, ts: 1.85 });   // seen facing west: the sacristy's south door, onto the garth, is on the left
I.backWindow(-0.3, 0.3, 2.5, 3.3, { I: 0.85, range: 7, sky: '#5a6064', bars: 2 });

// ------------------------------------------------------------------ frost: rime along the wall foot and the vault joints, icicles on the ribs
if (DETAIL) {
  let fr = '';
  for (let i = 0; i < 90; i++) { const X = -HW + R() * 2 * HW, [x, y] = P(X, R() * 0.12, D1 - 0.01); fr += `<path d="M${f(x)} ${f(y)} l${f((R() - 0.5) * 6)} ${f(-3 - R() * 8)}" stroke="${FROST}" stroke-width="1.2" opacity="0.6"/>`; }
  a.raw(PLW([[0, 0, D1], [1, 0, D1], [0, 1, D1]], fr));
  let ic = '';
  for (let i = 0; i < 7; i++) { const X = -HW + 0.3 + R() * (2 * HW - 0.6), z = 5.0, [x, y] = P(X, I.Yv(X) - 0.24 * (0.5 + 0.5 * Math.sqrt(Math.max(0, 1 - (X / HW) ** 2))), z), l = 6 + R() * 22; ic += `<path d="M${f(x - 2.4)} ${f(y)} L${f(x)} ${f(y + l)} L${f(x + 2.4)} ${f(y)} Z" fill="#c8dcec" stroke="${INK}" stroke-width="0.7" opacity="0.85"/>`; }
  a.raw(ic);
}
// ------------------------------------------------------------------ the vestment press: a tall cupboard, one door ajar on copes and chasubles
prop(D1 - 0.55, () => {
  const x0 = -2.7, x1 = -1.0, z = D1 - 0.55, ht = 2.3;
  I.woodBox(x0, x1, 0, ht, z, D1 - 0.02, WOOD, { bw: 0.2 });
  const op = [[x0 + 0.85, 0.12, z - 0.01], [x1 - 0.06, 0.12, z - 0.01], [x1 - 0.06, ht - 0.12, z - 0.01], [x0 + 0.85, ht - 0.12, z - 0.01]];
  through(op, () => {
    face(op, '#140e0a', 1.2);
    for (const [col, dx, bot, wd] of [['#4a1410', 0, 0.35, 1], ['#2a3428', 0.22, 0.75, 0.8], ['#6a5a34', 0.44, 0.2, 1.15], ['#9a948a', 0.66, 1.1, 0.7]]) { const X = x0 + 0.92 + dx, [tx, ty] = P(X, ht - 0.25, z + 0.25), [bx0, by] = P(X + 0.03, bot, z + 0.25), s = K(z) * wd, bx = bx0;
      a.raw(`<path d="M${f(tx - s * 0.12)} ${f(ty + 2)} Q${f(tx)} ${f(ty - s * 0.05)} ${f(tx + s * 0.12)} ${f(ty + 2)}" stroke="${INK}" stroke-width="2.4" fill="none"/>`);
      const vd = smooth([[tx - s * 0.03, ty - s * 0.02], [tx + s * 0.03, ty - s * 0.02], [tx + s * 0.13, ty + s * 0.06], [tx + s * 0.11, ty + s * 0.3], [bx + s * 0.16, by], [bx - s * 0.14, by + 4], [tx - s * 0.11, ty + s * 0.3], [tx - s * 0.13, ty + s * 0.06]], true, 0.3);
      a.shape({ d: vd, fill: I.grad(light(col, 0.15), dark(col, 0.35)), depth: 6, ink: 1.4, hatch: 70, grime: 0.3, tex: 'url(#weave)', texOp: 0.3,
        lines: [[-0.07, 0.6], [0.08, 0.5], [-0.1, 0.4]].map(([dx, op]) => ({ d: `M${f(tx + s * dx)} ${f(ty + s * 0.1)} Q${f(tx + s * dx * 1.4)} ${f((ty + by) / 2)} ${f(bx + s * dx * 1.3)} ${f(by - 4)}`, w: 1.4, col: dark(col, 0.5), op })),
        decals: `<path d="M${f(tx - s * 0.025)} ${f(ty + 6)} L${f(tx + s * 0.025)} ${f(ty + 6)} L${f(bx + s * 0.03)} ${f(by - 2)} L${f(bx - s * 0.03)} ${f(by - 2)} Z" fill="${G.gold}" stroke="${INK}" stroke-width="0.8"/>` + Array.from({ length: 6 }, (_, k) => { const t = (k + 0.5) / 6, ox = tx + (bx - tx) * t, oy = ty + 6 + (by - ty - 8) * t; return `<path d="M${f(ox - s * 0.015)} ${f(oy)} l${f(s * 0.03)} 0 M${f(ox)} ${f(oy - s * 0.015)} l0 ${f(s * 0.03)}" stroke="${dark(col, 0.3)}" stroke-width="1.4"/>`; }).join('') + (R() < 0.6 ? a.stain(bx, by - s * 0.15, s * 0.08, '#140c06', 0.4) : '') }); }
  });
  a.raw(planks((s, t) => [x0 + 0.06 + s, 0.12 + t, z - 0.02], 0.78, ht - 0.24, '#4a3624', { board: 0.13, nails: 6 }));
  a.raw(planks((s, t) => [x1 - 0.06 + s * 0.35, 0.12 + t, z - 0.02 - s * 0.9], 0.78, ht - 0.24, '#4a3624', { board: 0.13, nails: 4 }));
  for (const t of [0.4, 1.8]) a.raw(seg3([x0 + 0.06, t, z - 0.03], [x0 + 0.84, t, z - 0.03], '#2a2826', 4));
});
// ------------------------------------------------------------------ the altar shelf with the Teeth in their gilt casket, the one warm light
prop(D1 - 0.5, () => {
  const x0 = 1.0, x1 = 3.5, z0 = D1 - 0.5, top = 1.0;
  box(x0, x1, 0, top, z0, D1 - 0.02, '#5a544a', { depth: 10 });
  a.raw(stones((s2, t) => [x0 + s2, t, z0 - 0.002], x1 - x0, top, '#5a544a', { course: 0.33, len: 0.5 }));
  for (let k = 0; k < 4; k++) { const xa = x0 + 0.2 + k * 0.6, xb = xa + 0.4; a.raw(PLW([[0, 0, z0], [1, 0, z0], [0, 1, z0]], `<path d="${pp([[xa, 0.12, z0 - 0.005], [xa, 0.5, z0 - 0.005], [xa + 0.2, 0.66, z0 - 0.005], [xb, 0.5, z0 - 0.005], [xb, 0.12, z0 - 0.005]])}" fill="#2a2622" stroke="${INK}" stroke-width="1.4" opacity="0.7"/>`)); }
  face([[x0 - 0.05, top, z0 - 0.06], [x1 + 0.05, top, z0 - 0.06], [x1 + 0.05, top, D1], [x0 - 0.05, top, D1]], '#c8c0b0', 1.4);    // the altar cloth
  { const fr = [P(x0 - 0.05, top, z0 - 0.06), P(x1 + 0.05, top, z0 - 0.06), P(x1 + 0.03, top - 0.35, z0 - 0.07), P((x0 + x1) / 2, top - 0.32, z0 - 0.07), P(x0 - 0.03, top - 0.36, z0 - 0.07)], s = K(z0);
    a.shape({ d: smooth(fr, true, 0.3), fill: I.grad('#7a1a14', '#3a0a08'), depth: 6, ink: 1.6, hatch: 70, grime: 0.35, tex: 'url(#weave)', texOp: 0.3,
      decals: Array.from({ length: 9 }, (_, k) => { const [ox, oy] = P(x0 + 0.15 + k * 0.28, top - 0.16, z0 - 0.07); return `<path d="M${f(ox)} ${f(oy - s * 0.06)} l${f(s * 0.05)} ${f(s * 0.06)} l${f(-s * 0.05)} ${f(s * 0.06)} l${f(-s * 0.05)} ${f(-s * 0.06)} Z" fill="none" stroke="${G.gold}" stroke-width="1.4" opacity="0.8"/><circle cx="${f(ox)}" cy="${f(oy)}" r="1.6" fill="${G.goldL}"/>`; }).join('') + `<path d="M${f(fr[0][0])} ${f(fr[0][1] + s * 0.05)} L${f(fr[1][0])} ${f(fr[1][1] + s * 0.05)}" stroke="${G.gold}" stroke-width="3"/>` + a.stain(...P(1.6, top - 0.2, z0), s * 0.15, '#140806', 0.5),
      lines: [1.4, 2.0, 2.8, 3.2].map(X => ({ d: `M${f(P(X, top, z0 - 0.07)[0])} ${f(P(X, top, z0 - 0.07)[1])} l2 ${f(s * 0.3)}`, w: 1.4, col: '#1a0404', op: 0.6 })) });
    let fringe = ''; for (let X = x0; X < x1; X += 0.04) { const [fx, fy] = P(X, top - 0.33 - Math.sin(X * 3) * 0.02, z0 - 0.07); fringe += `M${f(fx)} ${f(fy)} l0 ${f(s * 0.03)} `; } a.raw(`<path d="${fringe}" stroke="${G.gold}" stroke-width="1.2" opacity="0.8"/>`); }
  // a missal open on a cushion at the left end
  { const [mx, my] = P(1.45, top, D1 - 0.35), s = K(D1 - 0.35); a.raw(`<path d="M${f(mx - s * 0.18)} ${f(my)} Q${f(mx)} ${f(my - s * 0.08)} ${f(mx + s * 0.18)} ${f(my)} L${f(mx + s * 0.16)} ${f(my - s * 0.05)} L${f(mx - s * 0.16)} ${f(my - s * 0.05)} Z" fill="#5a2a3a" stroke="${INK}" stroke-width="1.2"/><path d="M${f(mx - s * 0.15)} ${f(my - s * 0.05)} L${f(mx)} ${f(my - s * 0.08)} L${f(mx + s * 0.15)} ${f(my - s * 0.05)} L${f(mx + s * 0.14)} ${f(my - s * 0.12)} L${f(mx)} ${f(my - s * 0.14)} L${f(mx - s * 0.14)} ${f(my - s * 0.12)} Z" fill="#d8ccb0" stroke="${INK}" stroke-width="1"/>` + [0, 1, 2, 3].map(k => `<path d="M${f(mx - s * 0.12)} ${f(my - s * (0.12 - k * 0.012))} l${f(s * 0.09)} 0 M${f(mx + s * 0.03)} ${f(my - s * (0.12 - k * 0.012))} l${f(s * 0.09)} 0" stroke="${k === 0 ? '#8a1a14' : '#3a3026'}" stroke-width="0.9"/>`).join('')); }
  // the casket: gilt, pitched lid, rock crystal windows, the Teeth glowing amber inside
  const cx = 2.3, cz = D1 - 0.28, w = 0.38, h = 0.32, [bx, by] = P(cx, top, cz), s = K(cz);
  a.raw(a.glow(bx, by - s * h * 0.6, s * 0.9, '#ffb050', 0.45));
  a.shape({ d: `M${f(bx - s * w)} ${f(by)} L${f(bx + s * w)} ${f(by)} L${f(bx + s * w)} ${f(by - s * h)} L${f(bx - s * w)} ${f(by - s * h)} Z`, fill: G.gold, depth: 6, ink: 2, hatch: 30, mottle: 0.4, spec: [`M${f(bx - s * w * 0.8)} ${f(by - s * h * 0.9)} L${f(bx + s * w * 0.8)} ${f(by - s * h * 0.9)}`], specOp: 0.5 });
  a.raw(`<path d="M${f(bx - s * w * 1.08)} ${f(by - s * h)} L${f(bx)} ${f(by - s * h * 1.7)} L${f(bx + s * w * 1.08)} ${f(by - s * h)} Z" fill="${G.goldL}" stroke="${INK}" stroke-width="2"/>`);
  for (let k = 0; k < 3; k++) { const wx = bx - s * w * 0.66 + k * s * w * 0.66; a.raw(EM(`<rect x="${f(wx - s * 0.07)}" y="${f(by - s * h * 0.8)}" width="${f(s * 0.14)}" height="${f(s * h * 0.55)}" rx="3" fill="#ffb860" stroke="${INK}" stroke-width="1.4"/><path d="M${f(wx - s * 0.03)} ${f(by - s * h * 0.35)} l${f(s * 0.02)} ${f(-s * 0.08)} l${f(s * 0.02)} ${f(s * 0.08)}" fill="#fff4d8" stroke="${INK}" stroke-width="0.8"/>`)); }
  addLight(cx, top + 0.2, cz - 0.35, 0.65, 4.0, [1.0, 0.64, 0.3]);
  // snuffed candles: she keeps no flame near the Teeth
  for (const [X, sh] of [[1.15, 0.22], [3.05, 0.3], [3.35, 0.18]]) { const [cx2, cy2] = P(X, top, D1 - 0.3), cs = K(D1), sh2 = cs * sh, h = cs * (0.08 + R() * 0.1);
    a.raw(`<path d="M${f(cx2 - cs * 0.05)} ${f(cy2)} Q${f(cx2)} ${f(cy2 - cs * 0.04)} ${f(cx2 + cs * 0.05)} ${f(cy2)} Z" fill="${I.metal('#8a6a2a')}" stroke="${INK}" stroke-width="1"/><rect x="${f(cx2 - 2)}" y="${f(cy2 - sh2)}" width="4" height="${f(sh2)}" fill="${I.metal('#8a6a2a')}" stroke="${INK}" stroke-width="0.8"/><ellipse cx="${f(cx2)}" cy="${f(cy2 - sh2 * 0.5)}" rx="4" ry="2" fill="#a8842a" stroke="${INK}" stroke-width="0.7"/><ellipse cx="${f(cx2)}" cy="${f(cy2 - sh2)}" rx="${f(cs * 0.03)}" ry="${f(cs * 0.008)}" fill="#a8842a" stroke="${INK}" stroke-width="0.8"/>` +
      `<rect x="${f(cx2 - 2.5)}" y="${f(cy2 - sh2 - h)}" width="5" height="${f(h)}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.8"/><path d="M${f(cx2)} ${f(cy2 - sh2 - h)} l0 -4" stroke="${INK}" stroke-width="1.2"/><path d="M${f(cx2 + 2.5)} ${f(cy2 - sh2 - h + 2)} q2 ${f(h * 0.3)} 0 ${f(h * 0.5)}" stroke="#e8dcc0" stroke-width="1.6" fill="none"/>`); }
});
// a sanctuary lamp on chains from the rib, its red glass dark
prop(4.9, () => { const [lx, ly] = P(-1.9, 2.0, 4.9), s = K(4.9); a.raw(seg3([-1.9, I.Yv(-1.9) - 0.2, 4.9], [-1.9, 2.1, 4.9], INK, 1.4) + `<path d="M${f(lx - s * 0.08)} ${f(ly)} Q${f(lx)} ${f(ly + s * 0.14)} ${f(lx + s * 0.08)} ${f(ly)} Z" fill="#4a1a14" stroke="${INK}" stroke-width="1.8"/><path d="M${f(lx - s * 0.08)} ${f(ly)} L${f(lx)} ${f(ly - s * 0.1)} L${f(lx + s * 0.08)} ${f(ly)}" stroke="${G.gold}" stroke-width="1.4" fill="none"/>`); });

// ================================================================== FG: the relic case, a kneeler, the holy water stoup
prop(CASE.z0, () => I.panel(() => {
  const { x0, x1, z0, z1, y0, y1 } = CASE, s = K(z0);
  // the stand: four turned legs, a stretcher
  for (const [X, Z] of [[x0 + 0.06, z1 - 0.05], [x1 - 0.06, z1 - 0.05], [x0 + 0.06, z0 + 0.05], [x1 - 0.06, z0 + 0.05]]) a.raw(rod([X, 0, Z], [X, y0, Z], WOOD, Z < 4.2 ? 7 : 5));
  a.raw(rod([x0 + 0.06, 0.2, z0 + 0.05], [x1 - 0.06, 0.2, z0 + 0.05], WOOD, 4));
  // the cabinet: dark wood frame, glass front and sides, shelves of relics lit cold from within
  box(x0, x1, y0 - 0.06, y0, z0, z1, WOODL, { shade: false });
  const front = [[x0 + 0.04, y0, z0], [x1 - 0.04, y0, z0], [x1 - 0.04, y1 - 0.04, z0], [x0 + 0.04, y1 - 0.04, z0]];
  through(front, () => {
    const gid = a.id('cg');
    a.raw(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3e3a36"/><stop offset="1" stop-color="#1e1c1a"/></linearGradient>`);
    face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], `url(#${gid})`, 1);
    for (let t = 0.12; t < 1; t += 0.2) a.raw(seg3([x0, y0 + (y1 - y0) * t, z1], [x1, y0 + (y1 - y0) * t, z1], '#14120f', 1.2));
    face([[x0, (y0 + y1) / 2, z0], [x1, (y0 + y1) / 2, z0], [x1, (y0 + y1) / 2, z1], [x0, (y0 + y1) / 2, z1]], '#3a2e22', 1.2);
    // relics: a skull on a cushion, a reliquary arm in silver, finger bones in a dish, a mitre's lappet, rings on a thread
    const rel = (X, Y, kind) => { const [x, y] = P(X, Y, (z0 + z1) / 2), r = K(z0);
      if (kind === 'skull') { a.raw(`<path d="M${f(x - r * 0.13)} ${f(y)} Q${f(x)} ${f(y + r * 0.03)} ${f(x + r * 0.13)} ${f(y)} Z" fill="#6a1a14" stroke="${INK}" stroke-width="1"/>`); a.shape({ d: smooth([[x - r * 0.05, y - r * 0.01], [x - r * 0.1, y - r * 0.08], [x - r * 0.09, y - r * 0.17], [x, y - r * 0.21], [x + r * 0.08, y - r * 0.17], [x + r * 0.08, y - r * 0.08], [x + r * 0.03, y - r * 0.05], [x + r * 0.03, y - r * 0.01]], true, 0.5), fill: '#b8ae94', depth: 4, ink: 1.4, hatch: 60, after: `<ellipse cx="${f(x - r * 0.05)}" cy="${f(y - r * 0.1)}" rx="${f(r * 0.025)}" ry="${f(r * 0.022)}" fill="${INK}"/><path d="M${f(x - r * 0.085)} ${f(y - r * 0.06)} l${f(r * 0.012)} ${f(r * 0.025)} l${f(r * 0.012)} ${f(-r * 0.025)}" fill="${INK}"/>` + Array.from({ length: 4 }, (_, k) => `<path d="M${f(x - r * 0.07 + k * r * 0.025)} ${f(y - r * 0.035)} l0 ${f(r * 0.02)}" stroke="${INK}" stroke-width="0.8"/>`).join('') }); }
      if (kind === 'arm') a.shape({ d: smooth([[x - r * 0.05, y], [x + r * 0.05, y], [x + r * 0.04, y - r * 0.28], [x + r * 0.07, y - r * 0.34], [x - r * 0.05, y - r * 0.36], [x - r * 0.04, y - r * 0.28]], true, 0.4), fill: '#a8b0b4', depth: 4, ink: 1.4, hatch: 30, spec: [`M${f(x - r * 0.02)} ${f(y - r * 0.05)} L${f(x - r * 0.02)} ${f(y - r * 0.3)}`], specOp: 0.6 });
      if (kind === 'bones') { a.raw(`<ellipse cx="${f(x)}" cy="${f(y - 2)}" rx="${f(r * 0.1)}" ry="${f(r * 0.025)}" fill="#8a7a4a" stroke="${INK}" stroke-width="1"/>` + Array.from({ length: 5 }, (_, k) => `<path d="M${f(x - r * 0.06 + k * r * 0.03)} ${f(y - 4)} l${f(r * 0.02)} ${f(-r * 0.03)}" stroke="#d8ccb0" stroke-width="2.6" stroke-linecap="round"/>`).join('')); }
      if (kind === 'rings') a.raw(`<path d="M${f(x - r * 0.1)} ${f(y - r * 0.2)} Q${f(x)} ${f(y - r * 0.12)} ${f(x + r * 0.1)} ${f(y - r * 0.2)}" stroke="#8a8a8a" stroke-width="0.8" fill="none"/>` + [0, 1, 2].map(k => `<circle cx="${f(x - r * 0.05 + k * r * 0.05)}" cy="${f(y - r * 0.15)}" r="${f(r * 0.016)}" fill="none" stroke="${G.goldL}" stroke-width="2"/>`).join(''));
    };
    const zm = (z0 + z1) / 2, ym = (y0 + y1) / 2 + 0.02;
    const tag = (X, Y) => { const [x, y] = P(X, Y, zm), r = K(z0); a.raw(`<path d="M${f(x)} ${f(y - r * 0.02)} q${f(r * 0.03)} ${f(r * 0.03)} ${f(r * 0.05)} ${f(r * 0.04)}" stroke="#8a7a5a" stroke-width="0.7" fill="none"/><rect x="${f(x + r * 0.05)}" y="${f(y + r * 0.01)}" width="${f(r * 0.06)}" height="${f(r * 0.035)}" fill="#c8b890" stroke="${INK}" stroke-width="0.5" transform="rotate(${f((R() - 0.5) * 30)} ${f(x + r * 0.08)} ${f(y + r * 0.03)})"/><path d="M${f(x + r * 0.06)} ${f(y + r * 0.025)} l${f(r * 0.04)} 0" stroke="#5a1a10" stroke-width="0.6"/>`); };
    rel(-0.42, y0 + 0.02, 'skull'); tag(-0.32, y0 + 0.08); rel(0.02, y0 + 0.02, 'arm'); rel(0.45, y0 + 0.02, 'bones'); tag(0.52, y0 + 0.05);
    rel(-0.45, ym, 'rings');
    // the upper shelf: a phial of dark blood, a jawbone on linen, a tiny gilt casket, a scrap of shroud
    Pr.bottle(-0.12, ym, zm, '#4a0806'); Pr.bottle(-0.02, ym, zm + 0.04, '#6a4a2a');
    { const [x, y] = P(0.25, ym, zm), r = K(z0); a.raw(`<path d="M${f(x - r * 0.1)} ${f(y)} L${f(x + r * 0.1)} ${f(y)} L${f(x + r * 0.08)} ${f(y - r * 0.015)} L${f(x - r * 0.08)} ${f(y - r * 0.015)} Z" fill="#c8c0b0" stroke="${INK}" stroke-width="0.7"/><path d="M${f(x - r * 0.07)} ${f(y - r * 0.02)} Q${f(x - r * 0.07)} ${f(y - r * 0.07)} ${f(x)} ${f(y - r * 0.07)} Q${f(x + r * 0.07)} ${f(y - r * 0.07)} ${f(x + r * 0.07)} ${f(y - r * 0.02)} L${f(x + r * 0.05)} ${f(y - r * 0.02)} Q${f(x + r * 0.05)} ${f(y - r * 0.05)} ${f(x)} ${f(y - r * 0.05)} Q${f(x - r * 0.05)} ${f(y - r * 0.05)} ${f(x - r * 0.05)} ${f(y - r * 0.02)} Z" fill="#d8ccb0" stroke="${INK}" stroke-width="1"/>` + [-0.04, -0.02, 0, 0.02, 0.04].map(dx => `<rect x="${f(x + r * dx - 1)}" y="${f(y - r * 0.068)}" width="2" height="${f(r * 0.015)}" fill="#e8e0d0" stroke="${INK}" stroke-width="0.4"/>`).join('')); tag(0.32, ym + 0.03); }
    { const [x, y] = P(0.5, ym, zm), r = K(z0); a.raw(`<rect x="${f(x - r * 0.05)}" y="${f(y - r * 0.06)}" width="${f(r * 0.1)}" height="${f(r * 0.06)}" fill="${I.metal('#b8902a')}" stroke="${INK}" stroke-width="1"/><path d="M${f(x - r * 0.055)} ${f(y - r * 0.06)} L${f(x)} ${f(y - r * 0.095)} L${f(x + r * 0.055)} ${f(y - r * 0.06)} Z" fill="#c8a03a" stroke="${INK}" stroke-width="1"/><circle cx="${f(x)}" cy="${f(y - r * 0.03)}" r="${f(r * 0.012)}" fill="#6a1a3a"/>`); }
    a.raw(EM(`<path d="${pp(front)}" fill="#7aa8d0" opacity="0.05"/>`));
  });
  // the glass: reflections, frost creeping in from the corners, a handprint melted in it where she touches it
  a.raw(`<path d="${pp(front)}" fill="#c8dcec" opacity="0.08"/>`);
  for (const t of [0.15, 0.3]) { const p0 = P(x0 + 0.1 + t, y1 - 0.06, z0), p1 = P(x0 + t, y0 + 0.1, z0); a.raw(`<path d="M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}" stroke="#e8f4ff" stroke-width="2" opacity="0.35"/>`); }
  if (DETAIL) { let fr = ''; for (let i = 0; i < 60; i++) { const corner = i % 4, X = corner % 2 ? x1 - 0.04 - R() * 0.25 : x0 + 0.04 + R() * 0.25, Y = corner < 2 ? y0 + R() * 0.25 : y1 - 0.04 - R() * 0.2, [x, y] = P(X, Y, z0); fr += `<path d="M${f(x)} ${f(y)} l${f((R() - 0.5) * 10)} ${f((R() - 0.5) * 10)}" stroke="#e0eef8" stroke-width="1" opacity="0.55"/>`; } a.raw(fr); }
  // the frame: mullions, the cresting, a lock plate
  for (const X of [x0, 0, x1]) a.raw(seg3([X, y0, z0], [X, y1, z0], INK, 5) + seg3([X, y0, z0], [X, y1, z0], WOODL, 2.6));
  a.raw(seg3([x0, (y0 + y1) / 2, z0], [x1, (y0 + y1) / 2, z0], INK, 4) + seg3([x0, (y0 + y1) / 2, z0], [x1, (y0 + y1) / 2, z0], WOODL, 2));
  box(x0 - 0.04, x1 + 0.04, y1, y1 + 0.08, z0 - 0.02, z1, WOODL, { shade: false });
  for (let k = 0; k < 7; k++) { const X = x0 + 0.05 + k * (x1 - x0 - 0.1) / 6, [x, y] = P(X, y1 + 0.08, z0); a.raw(`<path d="M${f(x - 5)} ${f(y)} L${f(x)} ${f(y - 12 - (k % 2) * 6)} L${f(x + 5)} ${f(y)} Z" fill="${WOODL}" stroke="${INK}" stroke-width="1.2"/>`); }
  addLight(0, 1.35, z0 - 0.25, 0.5, 3.2, [0.55, 0.72, 0.9]);
  hot('reliquary', 'The relic case', [P(x0, y0, z0), P(x1, y0, z0), P(x1, y1 + 0.1, z0), P(x0, y1 + 0.1, z0)]);
}));
a.layer('fg');
// the back-right corner: processional cross and staves leaned on the wall, a box of new candles, wrapped bundles of plate
prop(D1 - 0.6, () => {
  const zc = D1 - 0.25;
  a.raw(rod([3.55, 0, zc - 0.3], [3.8, 2.45, zc], '#5a4430', 4) + rod([3.25, 0, zc - 0.35], [3.65, 2.2, zc], '#4a3624', 3.5) + rod([3.4, 0, zc - 0.32], [3.72, 2.0, zc], '#6a5038', 3));
  { const [cx, cy] = P(3.8, 2.45, zc), s = K(zc); a.raw(`<path d="M${f(cx - 2)} ${f(cy - s * 0.22)} l4 0 l0 ${f(s * 0.08)} l${f(s * 0.08)} 0 l0 4 l${f(-s * 0.08)} 0 l0 ${f(s * 0.12)} l-4 0 l0 ${f(-s * 0.12)} l${f(-s * 0.08)} 0 l0 -4 l${f(s * 0.08)} 0 Z" fill="${I.metal('#a8842a')}" stroke="${INK}" stroke-width="1.4"/>`); }
  { const [cx, cy] = P(3.65, 2.2, zc), s = K(zc); a.raw(`<path d="M${f(cx)} ${f(cy)} q${f(s * 0.08)} ${f(-s * 0.04)} ${f(s * 0.06)} ${f(-s * 0.12)} q${f(-s * 0.03)} ${f(-s * 0.06)} ${f(-s * 0.08)} ${f(-s * 0.02)}" stroke="${INK}" stroke-width="5" fill="none"/><path d="M${f(cx)} ${f(cy)} q${f(s * 0.08)} ${f(-s * 0.04)} ${f(s * 0.06)} ${f(-s * 0.12)} q${f(-s * 0.03)} ${f(-s * 0.06)} ${f(-s * 0.08)} ${f(-s * 0.02)}" stroke="#a8842a" stroke-width="3" fill="none"/>`); }
  I.woodBox(2.55, 3.15, 0, 0.32, zc - 0.55, zc - 0.15, '#4a3624', { bw: 0.1 });
  Pr.candleBundle(2.7, 0.32, zc - 0.35, { n: 6 }); Pr.candleBundle(2.98, 0.32, zc - 0.3, { lay: true });
  Pr.folded(2.2, 0, zc - 0.5, 3, ['#6a6050', '#4a1a14', '#8a8068']);
});
// a thurible hung from the vault on its chains, cold
prop(5.2, () => { const X = 2.1, Z = 5.2, s = K(Z), top = I.Yv(X) - 0.05, [x, y] = P(X, 1.9, Z); for (const dx of [-0.05, 0, 0.05]) a.raw(seg3([X, top, Z], [X + dx, 1.98, Z], '#3a3026', 1.1));
  a.shape({ d: `M${f(x - s * 0.06)} ${f(y - s * 0.06)} Q${f(x - s * 0.07)} ${f(y + s * 0.05)} ${f(x)} ${f(y + s * 0.07)} Q${f(x + s * 0.07)} ${f(y + s * 0.05)} ${f(x + s * 0.06)} ${f(y - s * 0.06)} Q${f(x)} ${f(y - s * 0.14)} ${f(x - s * 0.06)} ${f(y - s * 0.06)} Z`, fill: I.metal('#8a6a2a'), depth: 4, ink: 1.4, hatch: 60, lines: [{ d: `M${f(x - s * 0.06)} ${f(y - s * 0.04)} L${f(x + s * 0.06)} ${f(y - s * 0.04)}`, w: 1.2 }], decals: Array.from({ length: 5 }, (_, k) => `<circle cx="${f(x - s * 0.04 + k * s * 0.02)}" cy="${f(y - s * 0.08)}" r="1.2" fill="${INK}"/>`).join('') });
});
// the floor: an iron-bound coffer of plate, a cold brazier, a bucket of sand for the candles
prop(4.6, () => {
  I.woodBox(-3.3, -2.5, 0, 0.45, 5.9, 6.35, '#3a2a1c', { bw: 0.11 });
  for (const t of [0.2, 0.8]) { const X = -3.3 + 0.8 * t; a.raw(I.seg3([X, 0, 5.89], [X, 0.45, 5.89], '#2a2826', 4)); }
  { const [hx, hy] = P(-2.9, 0.3, 5.89), s = K(5.9); a.raw(`<rect x="${f(hx - s * 0.04)}" y="${f(hy - s * 0.04)}" width="${f(s * 0.08)}" height="${f(s * 0.08)}" fill="${I.metal('#4a4644')}" stroke="${INK}" stroke-width="1.2"/>`); }
  const [bx, by] = P(2.9, 0, 4.6), s = K(4.6);
  a.raw(rod([2.75, 0, 4.6], [2.82, 0.7, 4.6], '#2a2826', 3) + rod([3.05, 0, 4.6], [2.98, 0.7, 4.6], '#2a2826', 3) + rod([2.9, 0, 4.75], [2.9, 0.7, 4.6], '#2a2826', 3));
  { const [px, py] = P(2.9, 0.7, 4.6); a.shape({ d: `M${f(px - s * 0.2)} ${f(py)} Q${f(px)} ${f(py + s * 0.12)} ${f(px + s * 0.2)} ${f(py)} Z`, fill: I.metal('#3a3836'), depth: 4, ink: 1.6, hatch: 60 }); a.raw(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="${f(s * 0.2)}" ry="${f(s * 0.04)}" fill="#1a1816" stroke="${INK}" stroke-width="1.2"/>` + Array.from({ length: 6 }, () => `<circle cx="${f(px + (R() - 0.5) * s * 0.3)}" cy="${f(py - 1)}" r="${f(1.5 + R() * 2)}" fill="#4a4644"/>`).join('')); }
  { const [qx, qy] = P(-0.3, 0, 5.4), qs = K(5.4); a.shape({ d: `M${f(qx - qs * 0.1)} ${f(qy - qs * 0.22)} L${f(qx + qs * 0.1)} ${f(qy - qs * 0.22)} L${f(qx + qs * 0.085)} ${f(qy)} L${f(qx - qs * 0.085)} ${f(qy)} Z`, fill: I.grad('#5a4430', '#2a1e14', false), depth: 4, ink: 1.4, hatch: 60, lines: [0.25, 0.75].map(t => ({ d: `M${f(qx - qs * 0.1)} ${f(qy - qs * 0.22 * t)} l${f(qs * 0.2)} 0`, w: 1.8, col: '#2a2826' })) }); a.raw(`<ellipse cx="${f(qx)}" cy="${f(qy - qs * 0.22)}" rx="${f(qs * 0.1)}" ry="${f(qs * 0.025)}" fill="#8a7a5a" stroke="${INK}" stroke-width="1"/>`); }
});
// near: a prie-dieu kneeler, a stone holy-water stoup with a skin of ice
prop(3.2, () => {
  // the prie-dieu: two posts behind, a kneeling step with its red cushion in front, a sloped book rest on top
  const xa = -1.75, xb = -1.15, zk = 3.3, zb = 3.65;
  for (const X of [xa + 0.04, xb - 0.04]) a.raw(rod([X, 0, zb], [X, 0.9, zb], WOODL, 9));
  a.raw(rod([xa + 0.04, 0.45, zb], [xb - 0.04, 0.45, zb], WOODL, 6));
  I.wood([[xa - 0.04, 0.86, zb - 0.18], [xb + 0.04, 0.86, zb - 0.18], [xb + 0.04, 0.97, zb + 0.02], [xa - 0.04, 0.97, zb + 0.02]], mix(WOODL, '#8a6a4a', 0.3), { bw: 0.08 });
  face([[xa - 0.04, 0.8, zb - 0.18], [xb + 0.04, 0.8, zb - 0.18], [xb + 0.04, 0.86, zb - 0.18], [xa - 0.04, 0.86, zb - 0.18]], WOODL, 1.6);
  I.woodBox(xa, xb, 0, 0.14, zk, zk + 0.28, WOODL, { boards: 1 });
  a.shape({ d: smooth([P(xa + 0.03, 0.14, zk + 0.03), P(xb - 0.03, 0.14, zk + 0.03), P(xb - 0.03, 0.22, zk + 0.08), P(xa + 0.03, 0.22, zk + 0.08)], true, 0.5), fill: I.grad('#8a2a1e', '#4a0e0a'), depth: 4, ink: 1.6, hatch: 70, tex: 'url(#weave)', texOp: 0.4, spec: [`M${f(P(xa + 0.1, 0.21, zk + 0.07)[0])} ${f(P(xa + 0.1, 0.21, zk + 0.07)[1])} L${f(P(xb - 0.15, 0.21, zk + 0.07)[0])} ${f(P(xb - 0.15, 0.21, zk + 0.07)[1])}`], specOp: 0.25 });
});
if (DETAIL) prop(3.8, () => {
  // spilled wax in pools and drips, a dropped linen corporal, dust and frost on the flags
  let o = '';
  for (let k = 0; k < 5; k++) { const [x, y] = P(-1.5 + R() * 4, 0, 3.0 + R() * 2.5); o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(3 + R() * 6)}" ry="${f(1.5 + R() * 2)}" fill="#8a826c" stroke="${INK}" stroke-width="0.6" opacity="0.9"/>`; }
  for (let k = 0; k < 60; k++) { const [x, y] = P(-3 + R() * 6, 0, 2.8 + R() * 3); o += `<path d="M${f(x)} ${f(y)} l${f((R() - 0.5) * 8)} ${f(-1 - R() * 3)}" stroke="${FROST}" stroke-width="1" opacity="0.5"/>`; }
  const lq = [P(0.2, 0.004, 3.4), P(0.75, 0.004, 3.35), P(0.85, 0.004, 3.7), P(0.25, 0.004, 3.75)];
  o += `<path d="${smooth(lq, true, 0.3)}" fill="#c8c0b0" stroke="${INK}" stroke-width="1.4"/><path d="M${f(lq[0][0] + 10)} ${f(lq[0][1] - 2)} l${f(30)} ${f(-6)}" stroke="#8a1a14" stroke-width="1.6"/>`;
  a.raw(o);
});
prop(3.5, () => {
  const X = 2.4, Z = 3.5, s = K(Z), [x, y] = P(X, 0, Z), [tx, ty] = P(X, 0.95, Z);
  a.shape({ d: `M${f(x - s * 0.1)} ${f(y)} L${f(x + s * 0.1)} ${f(y)} L${f(tx + s * 0.06)} ${f(ty + s * 0.12)} L${f(tx - s * 0.06)} ${f(ty + s * 0.12)} Z`, fill: I.grad('#7a746a', '#3a3630', false), depth: 6, ink: 2, hatch: 80, grime: 0.5, lines: [0.15, 0.5, 0.85].map(t => ({ d: `M${f(x - s * 0.1 + (tx - x) * t - s * 0.02)} ${f(y + (ty + s * 0.12 - y) * t)} l${f(s * 0.2 - s * 0.08 * t)} 0`, w: 1.6, op: 0.7 })), decals: a.stain(x, y - s * 0.3, s * 0.08, '#2a3a24', 0.5) });
  a.shape({ d: `M${f(tx - s * 0.24)} ${f(ty)} Q${f(tx)} ${f(ty + s * 0.22)} ${f(tx + s * 0.24)} ${f(ty)} Z`, fill: I.grad('#8a8478', '#4a463e'), depth: 6, ink: 2, hatch: 80, grime: 0.4, lines: [{ d: `M${f(tx - s * 0.2)} ${f(ty + s * 0.05)} Q${f(tx)} ${f(ty + s * 0.18)} ${f(tx + s * 0.2)} ${f(ty + s * 0.05)}`, w: 1.4, op: 0.6 }] });
  a.raw(`<ellipse cx="${f(tx)}" cy="${f(ty)}" rx="${f(s * 0.24)}" ry="${f(s * 0.06)}" fill="#a8c0d0" stroke="${INK}" stroke-width="1.8"/><path d="M${f(tx - s * 0.12)} ${f(ty - 2)} l${f(s * 0.08)} ${f(s * 0.02)} l${f(s * 0.06)} ${f(-s * 0.02)}" stroke="#e8f4ff" stroke-width="1.2" fill="none"/>`);
});

I.write(KEEPER);
