// Living Ink props shared by the remaining hub interiors (Almonry, Cellarium, Chapter House, Infirmarium), 2026-11-24.
// Builders are figure-engine props (drawn at figure scale, placed with sc(Z) through S.figProp) plus a few scene helpers that
// also register their light with the exact position and strength grim used, so the light lists stay identical.
// Usage: const H = require('./props_hub')(S)   (S: the interior I from int_shell.js)
'use strict';
const E = require('../engine');
const KK = require('../worlds/kit_keepers');
const PR = require('./props_li');
const { ell, mix, add, lerp } = E;
const T = PR.T;
const IRON = '#3a3a3c', STEEL = '#5a5e62', BRONZE = '#7a5a32', BRONZEG = '#4f6a4a', LEAD = '#74777b';

module.exports = S => {
  const { P, K, f1, INK, raw, layer, figProp, glow, addLight, R, curLayer } = S;
  const H = {};
  const fx = s => { const l = curLayer(); layer('fx'); raw(s); layer(l); };

  // ---- a lantern hung on a chain from (X, Ytop) to its ring at Y, at depth Z. light: [X, Y, Z, I, range, col] (grim's values)
  H.lantern = (X, Ytop, Y, Z, o = {}) => {
    const [tx, ty] = P(X, Ytop, Z), [lx, ly] = P(X, Y, Z);
    raw(`<path d="M${f1(tx)} ${f1(ty)} L${f1(lx)} ${f1(ly)}" stroke="${INK}" stroke-width="${f1(Math.max(2, K(Z) * 0.012))}" stroke-dasharray="4 2"/><path d="M${f1(tx)} ${f1(ty)} L${f1(lx)} ${f1(ly)}" stroke="#4a4644" stroke-width="${f1(Math.max(1, K(Z) * 0.005))}" stroke-dasharray="4 2"/>`);
    figProp(X, Y, Z, (f, u) => {
      const s = (o.size || 1) * u;
      f.line([[0, 0], [0, 0.03 * s]], 1.6, '#1a1816');
      f.part([[-0.09 * s, 0.07 * s], [0, 0.015 * s, 1], [0.09 * s, 0.07 * s]], { fill: '#2a2622', shade: 0.35, inkW: 1.2, cast: false });
      f.part([[-0.07 * s, 0.07 * s], [0.07 * s, 0.07 * s], [0.065 * s, 0.25 * s], [-0.065 * s, 0.25 * s]], { fill: '#2a2826', shade: 0.4, inkW: 1.4 });
      if (o.lit !== false) { f.raw('<g class="em">'); f.flat([[-0.05 * s, 0.09 * s], [0.05 * s, 0.09 * s], [0.045 * s, 0.23 * s], [-0.045 * s, 0.23 * s]], '#ffd486'); f.flat(ell([0, 0.17 * s], 0.015 * s, 0.03 * s, 0, 8), '#fff4d0'); f.raw('</g>'); }
      else f.flat([[-0.05 * s, 0.09 * s], [0.05 * s, 0.09 * s], [0.045 * s, 0.23 * s], [-0.045 * s, 0.23 * s]], '#4a4436', { op: 0.9 });
      for (const x of [-0.022, 0.022]) f.line([[x * s, 0.09 * s], [x * s, 0.23 * s]], 1.6, '#1a1816');
      f.line([[-0.05 * s, 0.16 * s], [0.05 * s, 0.16 * s]], 1.2, '#1a1816', { op: 0.8 });
      f.part([[-0.08 * s, 0.25 * s], [0.08 * s, 0.25 * s], [0.06 * s, 0.29 * s], [-0.06 * s, 0.29 * s]], { fill: '#2a2622', shade: 0.3, inkW: 1.1, cast: false });
      f.flat(ell([0.05 * s, 0.2 * s], 0.012 * s, 0.02 * s, 0, 6), '#5a2a14', { op: 0.6 });
    }, { tag: false });
    if (o.light) addLight(...o.light);
    if (o.lit !== false) fx(glow(...P(X, Y - 0.15 * (o.size || 1), Z), K(Z) * (o.glow || 1.0), K(Z) * (o.glow || 1.0) * 0.9, '#ffb060', 0.4));
  };
  // ---- n candles standing on a surface at height top, centred at X, depth Z, spread over `spread` m (grim's candles()):
  // each its own height and drips, lit; one light at (X, top + 0.3, Z - 0.15), I 0.17 for one and 0.24 for two or more
  H.candles = (X, Z, n, top, spread, o = {}) => {
    for (let k = 0; k < n; k++) {
      const x = X + (n > 1 ? (k / (n - 1) - 0.5) * spread : 0), h = (o.h || 0.14) * (0.6 + R() * 0.7);
      figProp(x, top, Z + (R() - 0.5) * 0.04, (f, u) => { PR.candleStub(f, 0, h * u, 0.028 * u); }, { tag: false });
    }
    if (o.light !== false) addLight(X, top + 0.3, Z - 0.15, n > 1 ? 0.24 : 0.17, 2.4, [1.0, 0.74, 0.44]);
    fx(glow(...P(X, top + 0.18, Z), K(Z) * 0.45 * (n > 1 ? 1.3 : 1), K(Z) * 0.4, '#ffb060', 0.35));
  };
  // ---- shop and store goods, drawn standing on a surface at the anchor (y = 0 is the surface); every one its own
  H.helm = (f, u, kind, col) => {
    const s = u * (0.85 + f.r() * 0.3);
    if (kind === 'kettle') f.part(ell([0, -0.03 * s], 0.2 * s, 0.045 * s, 0, 18), { fill: col, light: mix(col, '#c8ccd0', 0.4), shade: 0.4, inkW: 1.3 });
    const dome = kind === 'nasal' ? [[-0.12 * s, -0.03 * s], [-0.1 * s, -0.15 * s], [0, -0.27 * s, 1], [0.1 * s, -0.15 * s], [0.12 * s, -0.03 * s]] : [[-0.12 * s, -0.03 * s], [-0.11 * s, -0.13 * s], [-0.04 * s, -0.19 * s], [0.05 * s, -0.19 * s], [0.11 * s, -0.13 * s], [0.12 * s, -0.03 * s]];
    f.part(dome, { fill: col, light: mix(col, '#c8ccd0', 0.45), shade: 0.45, inkW: 1.4, tex: T(f, 'mottle'), texOp: 0.4 });
    if (kind === 'nasal') { f.line([[0, -0.26 * s], [0, -0.01 * s]], 1.4, INK); f.part([[-0.014 * s, -0.06 * s], [0.014 * s, -0.06 * s], [0.012 * s, 0.03 * s], [-0.012 * s, 0.03 * s]], { fill: col, shade: 0.3, inkW: 1, cast: false }); }
    if (kind === 'cap') f.line([[-0.12 * s, -0.06 * s], [0.12 * s, -0.06 * s]], 2.4, '#2a2826');
    f.line([[-0.07 * s, -0.14 * s], [-0.02 * s, -0.18 * s], [0.03 * s, -0.17 * s]], 1.4, '#d8dce0', { op: 0.55 });
    f.flat(ell([(f.r() - 0.5) * 0.12 * s, -0.08 * s], 0.035 * s, 0.022 * s, 0, 8), '#5a2a14', { op: 0.55 });
    if (f.r() < 0.4) f.line([[-0.04 * s, -0.17 * s], [-0.015 * s, -0.12 * s], [-0.03 * s, -0.08 * s]], 1.6, '#0a0806');
    if (f.r() < 0.6) { f.line([[0.07 * s, -0.08 * s], [0.1 * s, -0.05 * s]], 0.7, '#8a7a5a'); f.part([[0.09 * s, -0.06 * s], [0.14 * s, -0.06 * s], [0.14 * s, -0.025 * s], [0.09 * s, -0.025 * s]].map(p => [p[0], p[1], 1]), { fill: '#c8b890', shade: 0.2, inkW: 0.7, cast: false, hatch: false }); }
  };
  H.bootPair = (f, u, col) => {
    const tall = f.r() < 0.5, s = u, ht = tall ? 0.26 + f.r() * 0.08 : 0.13 + f.r() * 0.04;
    if (f.r() < 0.25) { // one boot fallen on its side
      f.part([[-0.15 * s, 0], [-0.15 * s, -0.09 * s], [0.1 * s, -0.1 * s], [0.19 * s, -0.045 * s], [0.18 * s, 0]], { fill: col, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.5 });
      f.flat(ell([-0.15 * s, -0.045 * s], 0.012 * s, 0.04 * s, 0, 8), '#0e0a08'); return;
    }
    for (const dx of [-0.055, 0.065]) { const b = dx * s, c = mix(col, '#140c06', f.r() * 0.25);
      f.part([[b - 0.05 * s, -ht * s], [b + 0.05 * s, -ht * s], [b + 0.05 * s, -0.06 * s], [b + 0.11 * s, -0.012 * s], [b + 0.1 * s, 0], [b - 0.06 * s, 0], [b - 0.06 * s, -0.1 * s]], { fill: c, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.5 });
      f.line([[b - 0.05 * s, -ht * 0.86 * s], [b + 0.05 * s, -ht * 0.86 * s]], 1, '#0e0a08', { op: 0.6 });
      f.line([[b - 0.06 * s, -0.012 * s], [b + 0.1 * s, -0.012 * s]], 2, '#0e0a08');
      f.line([[b - 0.03 * s, -ht * 0.7 * s], [b - 0.03 * s, -0.12 * s]], 1.2, mix(c, '#fff', 0.3), { op: 0.4 }); }
  };
  H.pack = (f, u, col) => {
    const s = u * (0.8 + f.r() * 0.3);
    f.part([[-0.16 * s, 0], [-0.18 * s, -0.2 * s], [-0.08 * s, -0.32 * s], [0.1 * s, -0.3 * s], [0.17 * s, -0.15 * s], [0.15 * s, 0]], { fill: col, tex: T(f, 'weave'), texOp: 0.5, shade: 0.45 });
    f.part([[-0.1 * s, -0.27 * s], [0.12 * s, -0.25 * s], [0.1 * s, -0.16 * s], [-0.08 * s, -0.17 * s]], { fill: mix(col, '#000', 0.2), shade: 0.35, inkW: 1.1, cast: false, tex: T(f, 'weave'), texOp: 0.4 });
    f.line([[-0.1 * s, -0.28 * s], [0, -0.1 * s], [0.12 * s, -0.26 * s]], 2.2, '#3a2618');
    f.part(ell([0.01 * s, -0.17 * s], 0.012 * s, 0.012 * s, 0, 8), { fill: '#5a5650', shade: 0.3, inkW: 0.8, cast: false, hatch: false });
    if (f.r() < 0.4) f.flat(ell([0.04 * s, -0.08 * s], 0.05 * s, 0.03 * s, 0.3, 8), '#4a1410', { op: 0.45 });
    f.stitches([[-0.14 * s, -0.05 * s], [0.12 * s, -0.04 * s]], '#c8b890', 0.8);
  };
  H.ropeCoil = (f, u) => {
    const rw = u * (0.1 + f.r() * 0.05), col = ['#8a7a5a', '#6a5a3a', '#9a8a62'][Math.floor(f.r() * 3)];
    for (let k = 0; k < 3 + Math.floor(f.r() * 3); k++) { const pts = ell([(f.r() - 0.5) * 2, -0.05 * u - k * 2.4], rw, rw * 0.45, 0, 18); f.line(pts.concat([pts[0]]), 4.2, '#1a120c'); f.line(pts.concat([pts[0]]), 2.4, col, { dash: '3 1' }); }
    f.line([[rw * 0.8, -0.05 * u], [rw * 1.1, 0]], 2.4, col);
  };
  H.mail = (f, u) => {
    const s = u;
    f.part([[-0.2 * s, 0], [-0.17 * s, -0.08 * s], [-0.06 * s, -0.14 * s], [0.08 * s, -0.13 * s], [0.18 * s, -0.07 * s], [0.21 * s, 0]], { fill: '#5a5a58', light: '#8a8a88', shade: 0.45, tex: T(f, 'weave'), texOp: 0.9 });
    for (let k = 0; k < 4; k++) f.line([[-0.16 * s + k * 0.08 * s, -0.11 * s], [-0.13 * s + k * 0.08 * s, -0.01 * s]], 1.1, '#1a1816', { op: 0.6 });
    f.flat(ell([0.04 * s, -0.06 * s], 0.06 * s, 0.03 * s, 0, 8), '#5a2a14', { op: 0.5 });
  };
  H.bowls = (f, u) => {
    for (let k = 0; k < 2 + Math.floor(f.r() * 4); k++) { const y = -k * 0.022 * u, c = mix('#6a5038', '#8a7a6a', f.r()); f.part([[-0.09 * u, y - 0.03 * u], [0.09 * u, y - 0.03 * u], [0.07 * u, y], [-0.07 * u, y]], { fill: c, shade: 0.4, inkW: 1, cast: false }); }
  };
  H.folded = (f, u, n, cols) => {
    let y = 0;
    for (let k = 0; k < n; k++) { const c = cols ? cols[k % cols.length] : ['#6a6050', '#4a3a2a', '#8a8068', '#3a3a34', '#5a4a3a'][Math.floor(f.r() * 5)], w = (0.18 + f.r() * 0.06) * u, h = (0.04 + f.r() * 0.025) * u, dx = (f.r() - 0.5) * 6;
      f.part([[-w + dx, y], [w + dx, y], [w * 0.97 + dx, y - h], [-w * 0.96 + dx, y - h]], { fill: c, tex: T(f, 'weave'), texOp: 0.5, shade: 0.4, inkW: 1.1 });
      f.line([[-w * 0.6 + dx, y - h * 0.5], [w * 0.3 + dx, y - h * 0.45]], 0.9, '#140c06', { op: 0.5 }); y -= h; }
    return y;
  };
  H.bottle = (f, u, col) => PR.bottle(f, 0, (0.14 + f.r() * 0.12) * u, col || ['#3a5a2a', '#6a2a1a', '#2a3a5a', '#5a4a2a', '#4a5a5a', '#7a6a42', '#3a2a3a'][Math.floor(f.r() * 7)]);
  H.crock = (f, u, col) => PR.crock(f, 0, (0.12 + f.r() * 0.1) * u, col);
  // a pile of lead ostia (the abbey's badges, not coin): little arched doorways cast in lead, stacked crooked
  H.ostia = (f, u, n) => {
    for (let k = 0; k < n; k++) { const x = (f.r() - 0.5) * 0.04 * u, y = -k * 0.006 * u, r = 0.018 * u;
      f.part([[x - r, y], [x - r, y - r * 0.8], [x, y - r * 1.3, 1], [x + r, y - r * 0.8], [x + r, y]], { fill: mix(LEAD, '#4a4c50', f.r()), shade: 0.35, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false });
      f.flat([[x - r * 0.35, y], [x - r * 0.35, y - r * 0.6], [x, y - r * 0.85], [x + r * 0.35, y - r * 0.6], [x + r * 0.35, y]], '#1a1818', { op: 0.85 }); }
  };
  // a balance in bronze (not gold: gold is for holy things only): a post, a beam, two pans on cords
  H.balance = (f, u) => {
    const s = u, top = -0.4 * s;
    f.part([[-0.07 * s, 0], [0.07 * s, 0], [0.03 * s, -0.035 * s], [-0.03 * s, -0.035 * s]], { fill: BRONZE, light: '#a8824a', shade: 0.4, inkW: 1.2, cast: false });
    f.line([[0, -0.035 * s], [0, top]], 4.2, INK); f.line([[0, -0.035 * s], [0, top]], 2.4, BRONZE);
    const L = [-0.19 * s, top + 0.015 * s], Rr = [0.19 * s, top - 0.02 * s];
    f.line([L, Rr], 4, INK); f.line([L, Rr], 2.2, BRONZE); f.flat(ell([0, top], 3, 3, 0, 8), '#a8824a');
    for (const [p, dy] of [[L, 0.2], [Rr, 0.16]]) { f.line([p, [p[0] - 0.05 * s, p[1] + dy * s]], 0.9, '#2a2420'); f.line([p, [p[0] + 0.05 * s, p[1] + dy * s]], 0.9, '#2a2420');
      f.part([[p[0] - 0.07 * s, p[1] + dy * s], [p[0] + 0.07 * s, p[1] + dy * s], [p[0] + 0.04 * s, p[1] + (dy + 0.03) * s], [p[0] - 0.04 * s, p[1] + (dy + 0.03) * s]], { fill: BRONZE, light: '#a8824a', shade: 0.4, inkW: 1.1, cast: false });
      f.flat(ell([p[0] + 0.03 * s, p[1] + (dy + 0.02) * s], 3, 1.5, 0, 6), BRONZEG, { op: 0.6 }); }
  };
  H.IRON = IRON; H.STEEL = STEEL; H.BRONZE = BRONZE; H.LEAD = LEAD;
  return H;
};
