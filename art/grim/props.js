// Shared props for the abbey interiors. Every call makes a different object: size, wear, damage, colour, marks and state
// are drawn from the seeded generator, so a row of casks or a pile of sacks never repeats itself. Each prop is built
// from shaded materials (graded fills, grain, rust, folds), never a flat colour.
module.exports = (I) => {
  const { a, R, P, K, pp, f, G, INK, mix, dark, light, smooth, blob } = I;
  const Pr = {};
  const pick = arr => arr[Math.floor(R() * arr.length)];
  const rr = (lo, hi) => lo + R() * (hi - lo);
  const woodCol = () => mix('#5a4028', pick(['#7a5a38', '#3a2a1a', '#6a4a30', '#4a3a28']), R() * 0.6);
  const sh = (d, fill, o = {}) => a.shape(Object.assign({ d, fill, depth: 6, ink: 1.6, hatch: 60, grime: 0.35 }, o));

  // a cask lying in a cradle, its head toward us: staves, hoops, bung, chalk marks; o.small = a keg; o.tap = a spigot
  Pr.caskHead = (X, Y, Z, r, o = {}) => {
    const [cx, cy] = P(X, Y, Z), s = K(Z), R0 = s * r, col = woodCol(), tilt = (R() - 0.5) * 6;
    a.raw(`<g transform="rotate(${f(tilt)} ${f(cx)} ${f(cy)})">`);
    // the bilge seen past the head: a crescent of staves curving away
    a.raw(`<path d="M${f(cx - R0)} ${f(cy)} A${f(R0)} ${f(R0)} 0 0 1 ${f(cx + R0)} ${f(cy)} L${f(cx + R0 * 1.06)} ${f(cy)} A${f(R0 * 1.06)} ${f(R0 * 1.08)} 0 0 0 ${f(cx - R0 * 1.06)} ${f(cy)} Z" fill="${dark(col, 0.35)}" stroke="${INK}" stroke-width="1.4"/>`);
    // the head: boards across, with the croze ring, end grain, a darker heart
    const nb = 4 + Math.floor(R() * 3), lines = [];
    for (let k = 1; k < nb; k++) { const yy = cy - R0 + 2 * R0 * k / nb, hw = Math.sqrt(Math.max(0, R0 * R0 - (yy - cy) ** 2)); lines.push({ d: `M${f(cx - hw)} ${f(yy)} L${f(cx + hw)} ${f(yy)}`, w: 1.1, op: 0.75 }); }
    for (let k = 0; k < 14; k++) { const yy = cy - R0 * 0.9 + R() * R0 * 1.8, hw = Math.sqrt(Math.max(0, (R0 * 0.85) ** 2 - (yy - cy) ** 2)), x0 = cx - hw + R() * hw; lines.push({ d: `M${f(x0)} ${f(yy)} l${f(rr(4, 14))} ${f((R() - 0.5) * 1.5)}`, w: 0.6, col: dark(col, 0.5), op: 0.6 }); }
    const marks = pick(['VII', 'IX', 'XII', 'III', 'tally', 'cross', 'none', 'IV', 'II', 'none', 'tally']);
    let dec = a.stain(cx + (R() - 0.5) * R0, cy + R0 * 0.5, R0 * 0.45, '#140c06', 0.45);
    if (marks === 'tally') for (let k = 0; k < 3 + Math.floor(R() * 5); k++) dec += `<path d="M${f(cx - R0 * 0.3 + k * R0 * 0.1)} ${f(cy - R0 * 0.25)} l${f(R0 * 0.02)} ${f(R0 * 0.3)}" stroke="#d8d0c0" stroke-width="1.6" opacity="0.65"/>`;
    else if (marks === 'cross') dec += `<path d="M${f(cx - R0 * 0.25)} ${f(cy - R0 * 0.25)} l${f(R0 * 0.5)} ${f(R0 * 0.5)} M${f(cx + R0 * 0.25)} ${f(cy - R0 * 0.25)} l${f(-R0 * 0.5)} ${f(R0 * 0.5)}" stroke="#d8d0c0" stroke-width="2" opacity="0.6"/>`;
    else if (marks !== 'none') dec += `<text x="${f(cx - R0 * 0.05)}" y="${f(cy + R0 * 0.1)}" font-family="Georgia, serif" font-size="${f(R0 * 0.42)}" fill="#d8d0c0" opacity="0.55" text-anchor="middle" transform="rotate(${f((R() - 0.5) * 14)} ${f(cx)} ${f(cy)})">${marks}</text>`;
    if (R() < 0.3) dec += a.stain(cx - R0 * 0.3, cy - R0 * 0.2, R0 * 0.3, '#2a3420', 0.5);       // mould
    sh(`M${f(cx - R0)} ${f(cy)} A${f(R0)} ${f(R0)} 0 1 1 ${f(cx + R0)} ${f(cy)} A${f(R0)} ${f(R0)} 0 1 1 ${f(cx - R0)} ${f(cy)} Z`, col, { depth: R0 * 0.3, ink: 2.2, hatch: 90, lines, decals: dec });
    // the chime hoop round the head, iron, rusted in places
    a.raw(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R0 * 0.97)}" fill="none" stroke="${INK}" stroke-width="${f(s * 0.03 + 2)}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R0 * 0.97)}" fill="none" stroke="${mix('#3a3836', '#6a3218', R() * 0.6)}" stroke-width="${f(s * 0.03)}"/>` +
      `<path d="M${f(cx - R0 * 0.7)} ${f(cy - R0 * 0.7)} A${f(R0 * 0.97)} ${f(R0 * 0.97)} 0 0 1 ${f(cx + R0 * 0.2)} ${f(cy - R0 * 0.95)}" stroke="#a8a49a" stroke-width="1.2" fill="none" opacity="0.5"/>`);
    if (R() < 0.5) a.raw(I.rust(cx + R0 * (R() - 0.5) * 1.6, cy + R0 * 0.8, R0 * 0.18));
    // bung, or a spigot with a drip and a cup under it
    const bx = cx + R0 * rr(-0.4, 0.4), by = cy + R0 * rr(0.35, 0.6);
    if (o.tap) { a.raw(`<rect x="${f(bx - s * 0.02)}" y="${f(by - s * 0.02)}" width="${f(s * 0.1)}" height="${f(s * 0.04)}" fill="${G.wood}" stroke="${INK}" stroke-width="1.2"/><path d="M${f(bx + s * 0.08)} ${f(by + s * 0.02)} l0 ${f(s * 0.05)}" stroke="#5a1a10" stroke-width="2.2"/>`); }
    else a.raw(`<circle cx="${f(bx)}" cy="${f(by)}" r="${f(R0 * 0.07)}" fill="#2a1a10" stroke="${INK}" stroke-width="1"/>`);
    a.raw('</g>');
    // a broken stave on some
    if (R() < 0.15) a.raw(`<path d="M${f(cx + R0 * 0.3)} ${f(cy - R0 * 0.9)} l${f(R0 * 0.1)} ${f(R0 * 0.4)} l${f(-R0 * 0.08)} ${f(R0 * 0.15)}" stroke="${INK}" stroke-width="2" fill="none"/>`);
  };
  // a sack: slumped or upright, tied or open, patched or stencilled, never the same twice
  Pr.sack = (X, Y, Z, o = {}) => {
    const s = K(Z), [x, y] = P(X, Y, Z), w = s * rr(0.22, 0.34), h = s * rr(0.35, 0.62), lean = (R() - 0.5) * w * 0.6, slump = R(), col = mix('#8a7a52', pick(['#6a5a3a', '#9a8a62', '#7a6a4a', '#5a5040']), R() * 0.6), open = o.open || R() < 0.2;
    const top = [x + lean, y - h], body = [[x - w, y], [x - w * (1.05 + slump * 0.15), y - h * 0.35], [x - w * 0.8 + lean * 0.5, y - h * 0.8], [top[0] - w * 0.25, top[1] + h * 0.06], [top[0] + w * 0.2, top[1] + h * 0.04], [x + w * 0.85 + lean * 0.5, y - h * 0.75], [x + w * (1.1 + slump * 0.1), y - h * 0.3], [x + w, y]];
    const folds = Array.from({ length: 3 + Math.floor(R() * 3) }, () => { const fx = x + (R() - 0.5) * w * 1.4; return { d: `M${f(fx)} ${f(y - h * rr(0.6, 0.9))} q${f((R() - 0.5) * w * 0.5)} ${f(h * 0.3)} ${f((R() - 0.5) * w * 0.3)} ${f(h * rr(0.35, 0.6))}`, w: 0.9, op: 0.6 }; });
    let dec = a.stain(x + (R() - 0.5) * w, y - h * 0.2, w * 0.5, '#2a2014', 0.4);
    if (R() < 0.35) dec += `<rect x="${f(x - w * 0.3 + (R() - 0.5) * w * 0.4)}" y="${f(y - h * 0.55)}" width="${f(w * 0.5)}" height="${f(h * 0.25)}" fill="${mix(col, '#3a3020', 0.4)}" stroke="${INK}" stroke-width="0.8" stroke-dasharray="2 1.5" transform="rotate(${f((R() - 0.5) * 20)} ${f(x)} ${f(y - h * 0.4)})"/>`;
    { const mk = pick(['none', 'none', 'ring', 'cross', 'bars', 'G', 'none']), mx = x + (R() - 0.5) * w * 0.4, my = y - h * 0.45, ms = w * 0.22, sc = '#2a1e10';
      if (mk === 'ring') dec += `<circle cx="${f(mx)}" cy="${f(my)}" r="${f(ms)}" fill="none" stroke="${sc}" stroke-width="2" opacity="0.55" stroke-dasharray="${f(ms)} 2"/>`;
      if (mk === 'cross') dec += `<path d="M${f(mx - ms)} ${f(my)} l${f(ms * 2)} 0 M${f(mx)} ${f(my - ms)} l0 ${f(ms * 2)}" stroke="${sc}" stroke-width="2.2" opacity="0.5"/>`;
      if (mk === 'bars') dec += [0, 1, 2].map(k => `<path d="M${f(mx - ms + k * ms * 0.7)} ${f(my - ms * 0.8)} l${f(ms * 0.1)} ${f(ms * 1.6)}" stroke="${sc}" stroke-width="2" opacity="0.5"/>`).join('');
      if (mk === 'G') dec += `<text x="${f(mx)}" y="${f(my + ms * 0.5)}" font-family="Georgia, serif" font-size="${f(ms * 1.8)}" fill="${sc}" opacity="0.5" text-anchor="middle">G</text>`; }
    sh(smooth(body, true, 0.45), col, { depth: w * 0.4, ink: 2, hatch: 70, tex: 'url(#weave)', texOp: 0.6, lines: folds, decals: dec });
    if (open) { a.raw(`<ellipse cx="${f(top[0])}" cy="${f(top[1] + h * 0.06)}" rx="${f(w * 0.45)}" ry="${f(h * 0.06)}" fill="${o.contents || '#c8b070'}" stroke="${INK}" stroke-width="1.4"/>`); for (let k = 0; k < 10; k++) a.raw(`<ellipse cx="${f(top[0] + (R() - 0.5) * w * 0.7)}" cy="${f(top[1] + h * 0.06 + (R() - 0.5) * h * 0.06)}" rx="1.8" ry="1" fill="${dark(o.contents || '#c8b070', 0.3)}"/>`); }
    else { const t = pick(['#8a6a3a', '#5a4a3a', '#a88a5a']); a.raw(`<path d="M${f(top[0] - w * 0.18)} ${f(top[1] + h * 0.1)} q${f(w * 0.18)} ${f(h * 0.04)} ${f(w * 0.36)} 0" stroke="${INK}" stroke-width="${f(s * 0.02 + 2)}" fill="none"/><path d="M${f(top[0] - w * 0.18)} ${f(top[1] + h * 0.1)} q${f(w * 0.18)} ${f(h * 0.04)} ${f(w * 0.36)} 0" stroke="${t}" stroke-width="${f(s * 0.02)}" fill="none"/><path d="M${f(top[0])} ${f(top[1] + h * 0.1)} q${f(w * (R() - 0.5) * 0.4)} ${f(-h * 0.12)} ${f(w * (R() - 0.5) * 0.5)} ${f(-h * 0.2)} M${f(top[0])} ${f(top[1] + h * 0.1)} q${f(w * 0.2)} ${f(-h * 0.06)} ${f(w * 0.35)} ${f(-h * 0.05)}" stroke="${dark(col, 0.2)}" stroke-width="${f(s * 0.03)}" fill="none" stroke-linecap="round"/>`); }
  };
  // a bundle of candles tied with twine: n candles of different lengths, some burnt down, a tag on some
  Pr.candleBundle = (X, Y, Z, o = {}) => {
    const s = K(Z), [x, y] = P(X, Y, Z), n = o.n || 3 + Math.floor(R() * 6), lay = o.lay || R() < 0.25, wax = mix('#e0d4b0', pick(['#c8b890', '#e8e0c8', '#b8a880']), R() * 0.6), cw = s * 0.032;
    if (lay) { for (let k = 0; k < n; k++) { const l = s * rr(0.22, 0.32), yy = y - cw * (k % 3) - (k > 2 ? cw : 0), xx = x - l / 2 + (R() - 0.5) * s * 0.03; a.raw(`<rect x="${f(xx)}" y="${f(yy - cw)}" width="${f(l)}" height="${f(cw)}" rx="${f(cw / 2)}" fill="${mix(wax, '#8a7a5a', R() * 0.25)}" stroke="${INK}" stroke-width="0.7"/>`); } a.raw(`<path d="M${f(x - s * 0.02)} ${f(y)} l0 ${f(-cw * 3.5)}" stroke="#7a5a3a" stroke-width="2"/>`); return; }
    for (let k = 0; k < n; k++) { const l = s * rr(0.2, 0.34) * (R() < 0.2 ? 0.55 : 1), xx = x - n * cw / 2 + k * cw + (R() - 0.5) * 1.5, tw = (R() - 0.5) * 6;
      a.raw(`<g transform="rotate(${f(tw)} ${f(xx)} ${f(y)})"><rect x="${f(xx)}" y="${f(y - l)}" width="${f(cw * 0.95)}" height="${f(l)}" fill="${mix(wax, '#8a7a5a', R() * 0.3)}" stroke="${INK}" stroke-width="0.7"/><path d="M${f(xx + cw * 0.25)} ${f(y - l * 0.9)} l0 ${f(l * 0.6)}" stroke="#fff8e8" stroke-width="0.6" opacity="0.5"/><path d="M${f(xx + cw * 0.47)} ${f(y - l)} l0 -3" stroke="${INK}" stroke-width="0.9"/></g>`); }
    a.raw(`<path d="M${f(x - n * cw * 0.55)} ${f(y - s * 0.08)} q${f(n * cw * 0.55)} ${f(s * 0.015)} ${f(n * cw * 1.1)} 0" stroke="${INK}" stroke-width="2.6" fill="none"/><path d="M${f(x - n * cw * 0.55)} ${f(y - s * 0.08)} q${f(n * cw * 0.55)} ${f(s * 0.015)} ${f(n * cw * 1.1)} 0" stroke="#8a6a3a" stroke-width="1.4" fill="none"/>`);
    if (R() < 0.5) a.raw(`<rect x="${f(x + n * cw * 0.4)}" y="${f(y - s * 0.09)}" width="${f(s * 0.04)}" height="${f(s * 0.03)}" fill="#c8b890" stroke="${INK}" stroke-width="0.6" transform="rotate(${f(rr(-20, 20))} ${f(x)} ${f(y)})"/>`);
  };
  // bread, cheese, a crock: food for a shelf or a board
  Pr.food = (X, Y, Z, kind, sz) => {
    const s = K(Z), [x, y] = P(X, Y, Z);
    kind = kind || pick(['round', 'long', 'cut', 'cheese', 'crock', 'round', 'long']);
    if (kind === 'round') { const w = s * rr(0.09, 0.14); sh(smooth([[x - w, y], [x - w * 0.95, y - w * 0.55], [x - w * 0.3, y - w * 0.85], [x + w * 0.4, y - w * 0.8], [x + w, y - w * 0.4], [x + w * 0.98, y]], true, 0.6), mix('#8a6a3e', '#6a4a24', R() * 0.6), { depth: 4, hatch: 60, spec: [`M${f(x - w * 0.5)} ${f(y - w * 0.65)} Q${f(x)} ${f(y - w * 0.82)} ${f(x + w * 0.4)} ${f(y - w * 0.65)}`], specOp: 0.25, lines: [{ d: `M${f(x - w * 0.4)} ${f(y - w * 0.7)} l${f(w * 0.25)} ${f(w * 0.3)} M${f(x + w * 0.05)} ${f(y - w * 0.78)} l${f(w * 0.22)} ${f(w * 0.3)}`, w: 1.2 }] }); }
    else if (kind === 'long') { const w = s * rr(0.14, 0.22), h = w * 0.35; sh(smooth([[x - w, y], [x - w * 0.95, y - h * 0.7], [x - w * 0.6, y - h], [x + w * 0.6, y - h], [x + w * 0.95, y - h * 0.7], [x + w, y]], true, 0.6), mix('#9a7442', '#6a4a24', R() * 0.5), { depth: 4, hatch: 60, lines: [0, 1, 2, 3].map(k => ({ d: `M${f(x - w * 0.6 + k * w * 0.35)} ${f(y - h)} l${f(w * 0.12)} ${f(h * 0.6)}`, w: 1.1 })) }); }
    else if (kind === 'cut') { const w = s * 0.1; sh(smooth([[x - w, y], [x - w * 0.9, y - w * 0.7], [x - w * 0.2, y - w * 0.9], [x + w * 0.1, y - w * 0.8], [x + w * 0.1, y]], true, 0.5), '#7a5a32', { depth: 4, hatch: 60 }); a.raw(`<ellipse cx="${f(x + w * 0.1)}" cy="${f(y - w * 0.42)}" rx="${f(w * 0.12)}" ry="${f(w * 0.42)}" fill="#d8c8a0" stroke="${INK}" stroke-width="1"/>`); }
    else if (kind === 'cheese') { const w = s * (sz || rr(0.1, 0.16)), h = w * 0.45; sh(`M${f(x - w)} ${f(y - h)} L${f(x - w)} ${f(y)} Q${f(x)} ${f(y + h * 0.35)} ${f(x + w)} ${f(y)} L${f(x + w)} ${f(y - h)} Z`, '#a88a3a', { depth: 4, hatch: 60, decals: a.stain(x, y - h * 0.3, w * 0.4, '#5a4a1a', 0.4) }); a.raw(`<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w)}" ry="${f(h * 0.35)}" fill="#c8a84a" stroke="${INK}" stroke-width="1.3"/>`); }
    else { const w = s * rr(0.06, 0.09), h = w * rr(1.3, 2); sh(`M${f(x - w * 0.8)} ${f(y)} Q${f(x - w * 1.3)} ${f(y - h * 0.5)} ${f(x - w * 0.6)} ${f(y - h)} L${f(x + w * 0.6)} ${f(y - h)} Q${f(x + w * 1.3)} ${f(y - h * 0.5)} ${f(x + w * 0.8)} ${f(y)} Z`, I.metal(pick(['#7a6a52', '#5a4a3a', '#8a7a5a'])), { depth: 4, hatch: 30, lines: [{ d: `M${f(x - w * 0.9)} ${f(y - h * 0.7)} L${f(x + w * 0.9)} ${f(y - h * 0.7)}`, w: 1.4 }] }); a.raw(`<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w * 0.6)}" ry="${f(w * 0.15)}" fill="#c8b890" stroke="${INK}" stroke-width="1"/>`); }
  };
  // hanging meat and strings: a ham, a string of onions, a string of garlic, dried fish, sausage links
  Pr.hanging = (X, top, Z, kind) => {
    const s = K(Z); kind = kind || pick(['ham', 'onions', 'garlic', 'fish', 'saus']);
    const len = rr(0.35, 0.7), [x, y] = P(X, top - len, Z);
    a.raw(I.seg3([X, top, Z], [X, top - len + 0.03, Z], INK, 1.3));
    if (kind === 'ham') { const w = s * rr(0.1, 0.16), h = s * rr(0.36, 0.5); sh(smooth([[x - w * 0.3, y], [x + w * 0.3, y], [x + w, y + h * 0.4], [x + w * 0.8, y + h * 0.85], [x, y + h], [x - w * 0.85, y + h * 0.8], [x - w * 0.9, y + h * 0.35]], true, 0.5), mix('#4a2216', '#5e3020', R()), { depth: 8, hatch: 60, decals: a.stain(x, y + h * 0.6, w * 0.6, '#2a1008', 0.4), lines: [{ d: `M${f(x - w * 0.3)} ${f(y + h * 0.1)} l${f(w * 0.6)} 0`, w: 2.4, col: '#c8b890' }, { d: `M${f(x - w * 0.6)} ${f(y + h * 0.7)} q${f(w * 0.6)} ${f(h * 0.08)} ${f(w * 1.2)} 0`, w: 1.2, col: '#3a1408', op: 0.6 }] }); }
    else if (kind === 'fish') { for (let k = 0; k < 3; k++) { const fx = x + (k - 1) * s * 0.06, l = s * rr(0.22, 0.3); sh(smooth([[fx, y], [fx + s * 0.03, y + l * 0.3], [fx + s * 0.02, y + l * 0.8], [fx + s * 0.04, y + l], [fx - s * 0.04, y + l], [fx - s * 0.02, y + l * 0.8], [fx - s * 0.03, y + l * 0.3]], true, 0.4), mix('#8a7a5a', '#5a4a3a', R()), { depth: 3, hatch: 60, lines: [{ d: `M${f(fx)} ${f(y + l * 0.15)} L${f(fx)} ${f(y + l * 0.8)}`, w: 0.7 }] }); } }
    else { const n = 6 + Math.floor(R() * 5), col = kind === 'onions' ? '#8a5a2a' : kind === 'garlic' ? '#d8ccb0' : '#5a2014', rw = s * (kind === 'saus' ? 0.036 : 0.05);
      for (let k = 0; k < n; k++) { const bx = x + (R() - 0.5) * s * 0.05 + (k % 2 ? rw : -rw), by = y + k * rw * 1.5; a.raw(kind === 'saus' ? `<rect x="${f(bx - rw)}" y="${f(by)}" width="${f(rw * 2)}" height="${f(rw * 1.4)}" rx="${f(rw)}" fill="${col}" stroke="${INK}" stroke-width="1"/>` : `<path d="${blob(bx, by, rw, R, 7, 0.15)}" fill="${mix(col, '#2a1a10', R() * 0.3)}" stroke="${INK}" stroke-width="1"/><path d="M${f(bx)} ${f(by - rw)} l0 ${f(-rw * 0.5)}" stroke="${INK}" stroke-width="0.8"/>`); } }
  };
  // a bottle or flask: glass colour, shape, fill level, stopper and label all vary
  Pr.bottle = (X, Y, Z, col) => {
    const s = K(Z), [x, y] = P(X, Y, Z), kind = pick(['flask', 'round', 'tall', 'squat', 'vial']), h = s * (kind === 'tall' ? rr(0.22, 0.3) : kind === 'vial' ? rr(0.08, 0.11) : rr(0.12, 0.18)), w = s * (kind === 'squat' ? rr(0.06, 0.08) : kind === 'vial' ? 0.018 : rr(0.03, 0.05));
    col = col || pick(['#3a6a3a', '#7a1a14', '#a8882a', '#2a4a7a', '#5a3a7a', '#3a6a6a', '#6a4a1a', '#2a2a2a']);
    const neck = w * 0.35, sho = kind === 'round' ? 0.55 : kind === 'flask' ? 0.65 : 0.75;
    const d = `M${f(x - w)} ${f(y)} Q${f(x - w * 1.15)} ${f(y - h * sho * 0.6)} ${f(x - w * (kind === 'round' ? 1.1 : 0.9))} ${f(y - h * sho)} Q${f(x - w * 0.6)} ${f(y - h * (sho + 0.08))} ${f(x - neck)} ${f(y - h * 0.85)} L${f(x - neck)} ${f(y - h)} L${f(x + neck)} ${f(y - h)} L${f(x + neck)} ${f(y - h * 0.85)} Q${f(x + w * 0.6)} ${f(y - h * (sho + 0.08))} ${f(x + w * (kind === 'round' ? 1.1 : 0.9))} ${f(y - h * sho)} Q${f(x + w * 1.15)} ${f(y - h * sho * 0.6)} ${f(x + w)} ${f(y)} Z`;
    const lvl = y - h * rr(0.1, sho), cid = a.id('bt');
    a.raw(`<path d="${d}" fill="${dark(col, 0.35)}" stroke="${INK}" stroke-width="1.2"/><clipPath id="${cid}"><path d="${d}"/></clipPath><rect x="${f(x - w * 1.3)}" y="${f(lvl)}" width="${f(w * 2.6)}" height="${f(y - lvl)}" fill="${col}" clip-path="url(#${cid})"/>` +
      `<path d="M${f(x - w * 0.55)} ${f(y - h * 0.12)} Q${f(x - w * 0.8)} ${f(y - h * 0.4)} ${f(x - w * 0.5)} ${f(y - h * (sho - 0.05))}" stroke="#fff4e0" stroke-width="${f(Math.max(0.8, w * 0.18))}" fill="none" opacity="0.55"/>` +
      `<rect x="${f(x - neck * 1.1)}" y="${f(y - h - s * 0.02)}" width="${f(neck * 2.2)}" height="${f(s * 0.025)}" fill="${pick(['#6a4a2a', '#8a7a5a', '#3a2a1a'])}" stroke="${INK}" stroke-width="0.7"/>` +
      (R() < 0.5 && w > 5 ? `<rect x="${f(x - w * 0.6)}" y="${f(y - h * 0.45)}" width="${f(w * 1.2)}" height="${f(h * 0.2)}" fill="#c8bea4" stroke="${INK}" stroke-width="0.5" opacity="0.85"/>` : '') +
      (R() < 0.3 ? `<path d="M${f(x - neck)} ${f(y - h * 0.92)} l${f(neck * 2)} 0" stroke="${INK}" stroke-width="1.5"/>` : ''));
  };
  // a book on a shelf (spine out) or lying: size, colour, wear, bands vary
  Pr.spine = (X, Y, Z, lean = 0) => {
    const s = K(Z), [x, y] = P(X, Y, Z), h = s * rr(0.22, 0.4), w = s * rr(0.03, 0.07), col = pick(['#5a2a1a', '#3a3a2a', '#6a5a3a', '#2a2a3a', '#7a6a4a', '#4a1a14', '#3a2a1a', '#5a4a2a']);
    a.raw(`<g transform="rotate(${f(lean)} ${f(x)} ${f(y)})"><rect x="${f(x)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" fill="${col}" stroke="${INK}" stroke-width="0.9"/><rect x="${f(x)}" y="${f(y - h)}" width="${f(w * 0.3)}" height="${f(h)}" fill="#fff4e0" opacity="0.08"/>` +
      [0.15, 0.3, 0.75].filter(() => R() < 0.7).map(t => `<path d="M${f(x)} ${f(y - h * (1 - t))} l${f(w)} 0" stroke="${R() < 0.4 ? G.gold : INK}" stroke-width="1.2" opacity="0.8"/>`).join('') +
      (R() < 0.3 ? `<rect x="${f(x + w * 0.15)}" y="${f(y - h * 0.6)}" width="${f(w * 0.7)}" height="${f(h * 0.12)}" fill="#c8bea4" opacity="0.7"/>` : '') + (R() < 0.3 ? a.stain(x + w / 2, y - h * 0.2, w, '#140c06', 0.5) : '') + `</g>`);
    return w + 1;
  };
  // a cask lying on its side, its length across the view: staves with their own tones, a bulge, iron hoops, a head at one end
  Pr.caskSide = (X, Y, Z, r, len) => {
    const s = K(Z), [cx, cy] = P(X, Y + r, Z), R0 = s * r, L = s * len, col = woodCol(), bul = R0 * 0.16;
    const outlineD = `M${f(cx - L / 2)} ${f(cy - R0)} Q${f(cx)} ${f(cy - R0 - bul)} ${f(cx + L / 2)} ${f(cy - R0)} L${f(cx + L / 2)} ${f(cy + R0)} Q${f(cx)} ${f(cy + R0 + bul)} ${f(cx - L / 2)} ${f(cy + R0)} Z`, cid = a.id('cs');
    let o = `<clipPath id="${cid}"><path d="${outlineD}"/></clipPath><path d="${outlineD}" fill="${dark(col, 0.4)}"/><g clip-path="url(#${cid})">`;
    const ns = 9;
    for (let k = 0; k < ns; k++) { const t0 = -1 + 2 * k / ns, t1 = -1 + 2 * (k + 1) / ns, y0 = cy + R0 * Math.sin(t0 * Math.PI / 2) * 1.08, y1 = cy + R0 * Math.sin(t1 * Math.PI / 2) * 1.08, tone = mix(col, R() < 0.5 ? '#b89868' : '#140c06', R() * 0.3), b0 = bul * Math.cos(t0 * Math.PI / 2), b1 = bul * Math.cos(t1 * Math.PI / 2);
      o += `<path d="M${f(cx - L / 2)} ${f(y0)} Q${f(cx)} ${f(y0 + (t0 < 0 ? -b0 : b0))} ${f(cx + L / 2)} ${f(y0)} L${f(cx + L / 2)} ${f(y1)} Q${f(cx)} ${f(y1 + (t1 < 0 ? -b1 : b1))} ${f(cx - L / 2)} ${f(y1)} Z" fill="${tone}" stroke="${INK}" stroke-width="1"/>`;
      for (let g = 0; g < 2; g++) { const yy = y0 + (y1 - y0) * (0.3 + g * 0.4); o += `<path d="M${f(cx - L / 2)} ${f(yy)} Q${f(cx - L / 4)} ${f(yy + (R() - 0.5) * 3)} ${f(cx)} ${f(yy + (R() - 0.5) * 2)} T${f(cx + L / 2)} ${f(yy)}" stroke="${dark(tone, 0.45)}" stroke-width="0.7" fill="none" opacity="0.6"/>`; } }
    o += `<path d="${outlineD}" fill="url(#bshade)"/><path d="${outlineD}" fill="url(#aoshade)" opacity="0.8"/><path d="${outlineD}" fill="url(#grime)" opacity="0.4"/>` + a.stain(cx + L * 0.2, cy + R0 * 0.6, R0 * 0.7, '#120a04', 0.45);
    for (const t of [0.08, 0.27, 0.73, 0.92]) { const hx = cx - L / 2 + L * t, hw = s * 0.035; o += `<path d="M${f(hx - hw / 2)} ${f(cy - R0 - bul)} L${f(hx + hw / 2)} ${f(cy - R0 - bul)} L${f(hx + hw / 2)} ${f(cy + R0 + bul)} L${f(hx - hw / 2)} ${f(cy + R0 + bul)} Z" fill="${I.metal(mix('#4a4644', '#6a3218', R() * 0.5))}" stroke="${INK}" stroke-width="1.2"/>` + (R() < 0.6 ? I.rust(hx, cy + R0 * (R() - 0.3), hw * 1.4) : ''); }
    o += `</g><path d="${outlineD}" fill="none" stroke="${INK}" stroke-width="2.4"/>`;
    // the head at the left end, end grain, and a bung on top
    o += `<ellipse cx="${f(cx - L / 2)}" cy="${f(cy)}" rx="${f(R0 * 0.24)}" ry="${f(R0)}" fill="${dark(col, 0.15)}" stroke="${INK}" stroke-width="2"/><ellipse cx="${f(cx - L / 2)}" cy="${f(cy)}" rx="${f(R0 * 0.17)}" ry="${f(R0 * 0.85)}" fill="none" stroke="${dark(col, 0.5)}" stroke-width="1.2"/>`;
    o += `<ellipse cx="${f(cx + L * 0.05)}" cy="${f(cy - R0 - bul * 0.8)}" rx="${f(s * 0.03)}" ry="${f(s * 0.012)}" fill="#1a0e06" stroke="${INK}" stroke-width="1"/>`;
    a.raw(o);
  };
  // a bunch of herbs hung head-down to dry: leafy sage, lavender sprigs, poppy heads, roots, tansy flowers; each its own
  Pr.herbs = (X, top, Z, kind) => {
    const s = K(Z); kind = kind || pick(['leaf', 'sprig', 'pod', 'root', 'flower', 'leaf']);
    const drop = rr(0.04, 0.16), len = rr(0.4, 0.7), [x, y] = P(X, top, Z), [, ty] = P(X, top - drop, Z), by = ty + s * len, tie = ty;
    a.raw(`<path d="M${f(x)} ${f(y)} L${f(x)} ${f(tie)}" stroke="${INK}" stroke-width="1"/>`);
    const n = 8 + Math.floor(R() * 8), spread = s * rr(0.06, 0.12), stems = [];
    for (let k = 0; k < n; k++) { const t = (k / (n - 1)) - 0.5, ex = x + t * spread * 2 + (R() - 0.5) * spread * 0.4, ey = by - R() * s * len * 0.25; stems.push([ex, ey]); }
    const stemCol = kind === 'root' ? '#6a5038' : mix('#4a5030', '#6a5a38', R());
    let o = stems.map(([ex, ey]) => `<path d="M${f(x)} ${f(tie + 3)} Q${f((x + ex) / 2)} ${f((tie + ey) / 2)} ${f(ex)} ${f(ey)}" stroke="${INK}" stroke-width="2.4" fill="none"/><path d="M${f(x)} ${f(tie + 3)} Q${f((x + ex) / 2)} ${f((tie + ey) / 2)} ${f(ex)} ${f(ey)}" stroke="${stemCol}" stroke-width="1.1" fill="none"/>`).join('');
    const head = kind === 'sprig' ? pick(['#6a5a8a', '#7a6a9a', '#5a4a6a']) : kind === 'flower' ? pick(['#a88a2a', '#c8a03a', '#8a6a2a']) : kind === 'pod' ? '#7a7a5a' : kind === 'root' ? '#7a5a3a' : pick(['#5a6a44', '#6a7048', '#4a5a3a', '#7a7a4a']);
    stems.forEach(([ex, ey], k) => {
      if (kind === 'leaf') for (let j = 0; j < 3; j++) { const t = 0.35 + j * 0.25, lx = x + (ex - x) * t, ly = tie + (ey - tie) * t, ang = (k % 2 ? 1 : -1) * rr(20, 60), L = s * rr(0.045, 0.075); o += `<path d="M${f(lx)} ${f(ly)} q${f(L * 0.4)} ${f(L * 0.3)} 0 ${f(L)} q${f(-L * 0.4)} ${f(-L * 0.3)} 0 ${f(-L)} Z" fill="${mix(head, '#2a2a1a', R() * 0.35)}" stroke="${INK}" stroke-width="0.7" transform="rotate(${f(ang)} ${f(lx)} ${f(ly)})"/>`; }
      else if (kind === 'sprig') o += `<path d="M${f(ex)} ${f(ey - s * 0.05)} L${f(ex)} ${f(ey + 2)}" stroke="${INK}" stroke-width="${f(s * 0.02 + 1.6)}" stroke-linecap="round"/><path d="M${f(ex)} ${f(ey - s * 0.05)} L${f(ex)} ${f(ey + 2)}" stroke="${mix(head, '#2a2030', R() * 0.3)}" stroke-width="${f(s * 0.02)}" stroke-linecap="round" stroke-dasharray="2 1"/>`;
      else if (kind === 'pod') o += `<ellipse cx="${f(ex)}" cy="${f(ey + s * 0.012)}" rx="${f(s * 0.022)}" ry="${f(s * 0.028)}" fill="${mix(head, '#3a3a2a', R() * 0.3)}" stroke="${INK}" stroke-width="0.8"/><path d="M${f(ex - s * 0.012)} ${f(ey + s * 0.03)} l${f(s * 0.024)} 0" stroke="${INK}" stroke-width="1.2"/>`;
      else if (kind === 'flower') o += `<circle cx="${f(ex)}" cy="${f(ey + s * 0.006)}" r="${f(s * 0.018)}" fill="${mix(head, '#5a4a1a', R() * 0.3)}" stroke="${INK}" stroke-width="0.6"/>`;
      else o += `<path d="M${f(ex)} ${f(ey)} q${f((R() - 0.5) * s * 0.04)} ${f(s * 0.03)} ${f((R() - 0.5) * s * 0.02)} ${f(s * 0.06)}" stroke="${INK}" stroke-width="${f(s * 0.016 + 1.4)}" fill="none" stroke-linecap="round"/><path d="M${f(ex)} ${f(ey)} q${f((R() - 0.5) * s * 0.04)} ${f(s * 0.03)} ${f((R() - 0.5) * s * 0.02)} ${f(s * 0.06)}" stroke="${head}" stroke-width="${f(s * 0.016)}" fill="none" stroke-linecap="round"/>`;
    });
    o += `<path d="M${f(x - s * 0.018)} ${f(tie + 4)} l${f(s * 0.036)} 0" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${f(x - s * 0.018)} ${f(tie + 4)} l${f(s * 0.036)} 0" stroke="${pick(['#c8b890', '#8a6a3a', '#7a2a1a'])}" stroke-width="2.2" stroke-linecap="round"/>`;
    a.raw(o);
  };
  // a stack of folded cloth: blankets, habits, linen; each fold its own colour, width and droop
  Pr.folded = (X, Y, Z, n, cols) => {
    const s = K(Z); let yy = 0;
    for (let k = 0; k < n; k++) {
      const w = s * rr(0.22, 0.3), h = s * rr(0.045, 0.08), dx = (R() - 0.5) * s * 0.04, [x, y] = P(X, Y, Z), by = y - yy, col = cols ? cols[k % cols.length] : pick(['#5a5040', '#6a4a36', '#4a4a3e', '#8a8068', '#9a907a', '#3a3a44', '#5a3a2a']);
      a.shape({ d: smooth([[x - w + dx, by], [x - w - 2 + dx, by - h * 0.5], [x - w * 0.9 + dx, by - h], [x + w * 0.9 + dx, by - h * 1.05], [x + w + 3 + dx, by - h * 0.5], [x + w + dx, by]], true, 0.4), fill: col, depth: h * 0.5, ink: 1.5, hatch: 70, grime: 0.3, tex: 'url(#weave)', texOp: 0.4,
        lines: [{ d: `M${f(x - w * 0.85 + dx)} ${f(by - h * 0.45)} Q${f(x + dx)} ${f(by - h * 0.55)} ${f(x + w * 0.85 + dx)} ${f(by - h * 0.4)}`, w: 0.9, op: 0.5 }] });
      if (R() < 0.35) a.raw(`<path d="M${f(x + w * 0.6 + dx)} ${f(by - h * 0.3)} q${f(s * 0.02)} ${f(s * 0.05)} ${f(-s * 0.01)} ${f(s * 0.09)}" stroke="${INK}" stroke-width="${f(h * 0.5 + 2)}" fill="none" stroke-linecap="round"/><path d="M${f(x + w * 0.6 + dx)} ${f(by - h * 0.3)} q${f(s * 0.02)} ${f(s * 0.05)} ${f(-s * 0.01)} ${f(s * 0.09)}" stroke="${col}" stroke-width="${f(h * 0.5)}" fill="none" stroke-linecap="round"/>`);
      yy += h * 0.95;
    }
  };
  // rushes and straw strewn on a floor area, with the odd crumb, feather or bone
  Pr.rushes = (x0, x1, z0, z1, n, cols) => {
    let o = ''; cols = cols || ['#8a7a4a', '#6a6038', '#a8904a', '#5a5030'];
    for (let k = 0; k < n; k++) { const [x, y] = P(x0 + R() * (x1 - x0), 0, z0 + R() * (z1 - z0)), s = K(z0 + 1), l = s * rr(0.05, 0.16), ang = (R() - 0.5) * 0.5; o += `<path d="M${f(x)} ${f(y)} q${f(l * 0.5)} ${f(ang * l * 0.4 - 1)} ${f(l)} ${f(ang * l * 0.3)}" stroke="${pick(cols)}" stroke-width="${f(1 + R() * 1.2)}" fill="none" opacity="0.85"/>`; }
    a.raw(o);
  };
  return Pr;
};
