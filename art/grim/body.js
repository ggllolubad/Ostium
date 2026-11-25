// Humanoid parts with realistic proportions for the bestiary (figures face LEFT, toward the heroes).
// Head height ~78px on a 700px canvas (about 7.5 heads). Every part goes through the shading engine.
const { G, INK, smooth, limb, poly, blob } = require('../gr');
const f = n => +n.toFixed(1);
module.exports = (a) => {
  const R = a.R, B = {};
  const P = require('./parts')(a);
  // ---------------------------------------------------------------- head, facing left (3/4 profile)
  // o: {x, y (centre), k (scale), skin, style: 'gaunt'|'bloated'|'skull'|'drowned', jaw (0..1 open), eye: 'milky'|'glint'|'socket'|'none', hair}
  B.head = (o) => {
    const { x, y } = o, k = o.k || 1, sk = o.skin || G.corpse, jaw = o.jaw || 0, bl = o.style === 'bloated' ? 1.18 : 1;
    const p = (dx, dy) => [x + dx * k * bl, y + dy * k];
    const back = [p(30, -22), p(32, 2), p(22, 22)], jawPts = [p(8, 36 + jaw * 16), p(-22, 34 + jaw * 20), p(-28, 26 + jaw * 18)];
    const outline = [p(4, -42), p(-16, -36), p(-26, -22), p(-30, -10), p(-31, -3), p(-40, 7), p(-33, 12), p(-33, 18), p(-30, 23), ...jawPts, p(18, 24), ...back.slice().reverse().slice(0, 2), p(26, -30)];
    const style = o.style || 'gaunt';
    const fill = style === 'skull' ? G.bone : sk;
    let dec = '';
    // brow shadow and deep socket
    dec += `<path d="M${f(p(-30, -16)[0])} ${f(p(-30, -16)[1])} C${f(p(-20, -20)[0])} ${f(p(-20, -20)[1])} ${f(p(-6, -18)[0])} ${f(p(-6, -18)[1])} ${f(p(2, -12)[0])} ${f(p(2, -12)[1])} L${f(p(-2, 0)[0])} ${f(p(-2, 0)[1])} C${f(p(-12, 2)[0])} ${f(p(-12, 2)[1])} ${f(p(-24, 0)[0])} ${f(p(-24, 0)[1])} ${f(p(-30, -6)[0])} ${f(p(-30, -6)[1])} Z" fill="${G.black}" opacity="${style === 'skull' ? 0.9 : 0.42}"/>`;
    const ex = p(-17, -8);
    if (o.eye === 'milky') dec += P.eye(f(ex[0]), f(ex[1]), 4.2 * k, '#000', true);
    else if (o.eye === 'socket' || style === 'skull') dec += P.socket(f(ex[0]), f(ex[1]), 5.2 * k);
    else if (o.eye !== 'none') dec += `<ellipse cx="${f(ex[0])}" cy="${f(ex[1])}" rx="${f(3.4 * k)}" ry="${f(1.8 * k)}" fill="#d8ccb0"/><circle cx="${f(ex[0] - k)}" cy="${f(ex[1])}" r="${f(1.3 * k)}" fill="${G.black}"/><circle cx="${f(ex[0] - 1.6 * k)}" cy="${f(ex[1] - 0.6 * k)}" r="${f(0.45 * k)}" fill="#fff"/>`;
    // cheek hollow, nasolabial and jaw lines
    const lines = [
      `M${f(p(-12, 4)[0])} ${f(p(-12, 4)[1])} C${f(p(-6, 14)[0])} ${f(p(-6, 14)[1])} ${f(p(-6, 24)[0])} ${f(p(-6, 24)[1])} ${f(p(-12, 32)[0])} ${f(p(-12, 32)[1])}`,
      `M${f(p(-30, 12)[0])} ${f(p(-30, 12)[1])} C${f(p(-24, 16)[0])} ${f(p(-24, 16)[1])} ${f(p(-22, 22)[0])} ${f(p(-22, 22)[1])} ${f(p(-24, 26)[0])} ${f(p(-24, 26)[1])}`,
      { d: `M${f(p(6, -4)[0])} ${f(p(6, -4)[1])} C${f(p(14, -8)[0])} ${f(p(14, -8)[1])} ${f(p(16, 6)[0])} ${f(p(16, 6)[1])} ${f(p(8, 10)[0])} ${f(p(8, 10)[1])}`, w: 1 }, // ear
    ];
    if (style === 'skull') {
      dec += `<path d="M${f(p(-34, 6)[0])} ${f(p(-34, 6)[1])} L${f(p(-28, 14)[0])} ${f(p(-28, 14)[1])} L${f(p(-26, 4)[0])} ${f(p(-26, 4)[1])} Z" fill="${G.black}"/>`;
      if (o.flesh !== false) dec += a.stain(p(10, 10)[0], p(10, 10)[1], 12 * k, '#a87a72', 0.8) + a.stain(p(-6, -30)[0], p(-6, -30)[1], 8 * k, '#7a6a5a', 0.7);
    }
    if (style === 'drowned' || style === 'bloated') dec += a.stain(p(10, -18)[0], p(10, -18)[1], 12 * k, G.bruise, 0.5) + `<g stroke="${G.bruise}" stroke-width="0.7" fill="none" opacity="0.8"><path d="M${f(p(4, -30)[0])} ${f(p(4, -30)[1])} C${f(p(10, -20)[0])} ${f(p(10, -20)[1])} ${f(p(4, -12)[0])} ${f(p(4, -12)[1])} ${f(p(10, -4)[0])} ${f(p(10, -4)[1])}"/></g>`;
    // mouth: closed line or open maw with teeth
    let over = '';
    if (jaw > 0.15) {
      const m0 = p(-32, 22), m1 = p(-8, 24 + jaw * 6), m2 = p(-26, 26 + jaw * 16);
      dec += `<path d="M${f(m0[0])} ${f(m0[1])} L${f(m1[0])} ${f(m1[1])} L${f(m2[0])} ${f(m2[1])} Z" fill="${G.black}"/>` + P.teeth(m0[0] + 2, m0[1] + 1, m1[0] - 2, m1[1], 5, 4 * k, 1, style === 'skull' ? G.bone : '#c8bc98') +
        `<path d="M${f(m0[0] + 3)} ${f(m0[1] + 6 * jaw)} L${f(m1[0] - 4)} ${f(m1[1] + 3)}" stroke="#6a2a20" stroke-width="${f(2.4 * k)}"/>`;
      over += P.drool(f(m2[0] + 3), f(m2[1]), 10 + jaw * 14, '#c8c0a8');
    } else {
      lines.push({ d: `M${f(p(-33, 20)[0])} ${f(p(-33, 20)[1])} L${f(p(-18, 22)[0])} ${f(p(-18, 22)[1])}`, w: 1.3 });
    }
    a.shape({ d: smooth(outline, true, 0.55), fill, depth: 18 * k, mottle: 0.5, fine: true, hatch: 120, lines, decals: dec, over });
    if (o.hair) a.raw(o.hair === 'weed' ? P.weed(p(20, -38)[0], p(20, -38)[1], 70 * k, 1) + P.weed(p(28, -26)[0], p(28, -26)[1], 90 * k, 1.2) + P.weed(p(8, -42)[0], p(8, -42)[1], 50 * k, -1)
      : `<path d="${smooth([p(-16, -40), p(10, -46), p(32, -30), p(38, 10), p(36, 50), p(26, 60), p(28, 20), p(22, -14), p(4, -30), p(-14, -32)], true, 0.5)}" fill="${o.hair}" stroke="${INK}" stroke-width="1"/>` +
        `<path d="M${f(p(26, -20)[0])} ${f(p(26, -20)[1])} C${f(p(32, 10)[0])} ${f(p(32, 10)[1])} ${f(p(30, 30)[0])} ${f(p(30, 30)[1])} ${f(p(28, 56)[0])} ${f(p(28, 56)[1])}" stroke="#5a4a3a" stroke-width="0.8" fill="none"/>`);
  };
  // ---------------------------------------------------------------- limbs with joints
  // leg: hip -> knee -> ankle; widths thigh/knee/calf/ankle; clothing via o.fill
  B.leg = (o) => {
    const { hip, knee, ankle } = o, w = o.w || 1, sk = o.fill || G.corpse;
    a.limb([hip, [(hip[0] + knee[0]) / 2, (hip[1] + knee[1]) / 2 - 2], knee], [46 * w, 40 * w, 32 * w], { fill: sk, depth: 14, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.thighDecals || '' });
    a.limb([knee, [(knee[0] + ankle[0]) / 2 + 2, (knee[1] + ankle[1]) / 2], ankle], [32 * w, 33 * w, 22 * w], { fill: o.shin || sk, depth: 11, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.shinDecals || '',
      lines: [{ d: `M${f(knee[0] - 8 * w)} ${f(knee[1] + 6)} C${f(knee[0] - 3)} ${f(knee[1] + 10)} ${f(knee[0] + 4)} ${f(knee[1] + 10)} ${f(knee[0] + 8 * w)} ${f(knee[1] + 6)}`, w: 0.6, op: 0.6 }] });
    if (o.foot !== false) B.foot(ankle, o.footFill || sk, w, o.boot);
  };
  B.foot = (ank, col, w = 1, boot = false) => {
    const [x, y] = ank;
    const d = smooth([[x + 12 * w, y - 8], [x - 8 * w, y - 6], [x - 38 * w, y + 14], [x - 44 * w, y + 22], [x - 40 * w, y + 26], [x + 16 * w, y + 26], [x + 18 * w, y + 8]], true, 0.4);
    a.shape({ d, fill: boot ? G.leatherD : col, depth: 7, mottle: 0.5, fine: true, hatch: 60, lines: boot ? [`M${f(x - 30)} ${f(y + 18)} L${f(x + 14)} ${f(y + 18)}`] : [`M${f(x - 36 * w)} ${f(y + 20)} L${f(x - 34 * w)} ${f(y + 26)}`, `M${f(x - 28 * w)} ${f(y + 18)} L${f(x - 26 * w)} ${f(y + 26)}`, `M${f(x - 20 * w)} ${f(y + 18)} L${f(x - 19 * w)} ${f(y + 26)}`] });
  };
  B.arm = (o) => {
    const { sh, el, wr } = o, w = o.w || 1, sk = o.fill || G.corpse;
    a.limb([sh, [(sh[0] + el[0]) / 2, (sh[1] + el[1]) / 2], el], [30 * w, 26 * w, 21 * w], { fill: sk, depth: 10, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.upperDecals || '' });
    a.limb([el, [(el[0] + wr[0]) / 2, (el[1] + wr[1]) / 2], wr], [21 * w, 20 * w, 14 * w], { fill: o.fore || sk, depth: 8, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.foreDecals || '' });
    if (o.hand !== false) B.hand(wr, o.handFill || (o.fore === undefined ? sk : (o.handSkin || G.corpse)), o.handDir || [-1, 0.4], w, o.claws);
  };
  B.hand = (wr, col, dir, w = 1, claws = false) => {
    const [x, y] = wr, [dx, dy] = dir, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
    const q = (s, t) => [x + ux * s * w + nx * t * w, y + uy * s * w + ny * t * w];
    const pts = [q(0, -8), q(14, -10), q(26, -8), q(30, -3), q(28, 4), q(26, 9), q(14, 10), q(0, 8)];
    let after = '';
    for (const t of [-6, -2, 2, 6]) { const a0 = q(24, t), a1 = q(36 + (claws ? 6 : 0), t * 1.2); after += `<path d="M${f(a0[0])} ${f(a0[1])} L${f(a1[0])} ${f(a1[1])}" stroke="${INK}" stroke-width="${f(4.6 * w)}" stroke-linecap="round"/><path d="M${f(a0[0])} ${f(a0[1])} L${f(a1[0])} ${f(a1[1])}" stroke="${col}" stroke-width="${f(3 * w)}" stroke-linecap="round"/>`; if (claws) { const c2 = q(42, t * 1.3); after += `<path d="M${f(a1[0])} ${f(a1[1])} L${f(c2[0])} ${f(c2[1])}" stroke="${G.bone}" stroke-width="1.6"/>`; } }
    const th0 = q(8, -8), th1 = q(18, -16);
    after += `<path d="M${f(th0[0])} ${f(th0[1])} L${f(th1[0])} ${f(th1[1])}" stroke="${INK}" stroke-width="${f(5 * w)}" stroke-linecap="round"/><path d="M${f(th0[0])} ${f(th0[1])} L${f(th1[0])} ${f(th1[1])}" stroke="${col}" stroke-width="${f(3.2 * w)}" stroke-linecap="round"/>`;
    a.shape({ d: smooth(pts, true, 0.5), fill: col, depth: 5, mottle: 0.5, fine: true, after });
  };
  // torso: shoulders (near/far), waist, hips; o.chest adds rib/sternum hints on bare skin
  B.torso = (o) => {
    const { nsh, fsh, wl, wr, hl, hr } = o;
    const pts = [fsh, [fsh[0] - 4, fsh[1] + 40], wl, hl, hr, wr, [nsh[0] + 4, nsh[1] + 40], nsh, [(nsh[0] + fsh[0]) / 2, Math.min(nsh[1], fsh[1]) - 6]];
    let dec = o.decals || '';
    if (o.bare) dec += `<g stroke="${INK}" stroke-width="0.9" fill="none" opacity="0.75">` + [0, 1, 2, 3].map(i => `<path d="M${f(nsh[0] + 4)} ${f(nsh[1] + 50 + i * 16)} C${f((nsh[0] + fsh[0]) / 2)} ${f(nsh[1] + 58 + i * 16)} ${f(fsh[0] - 10)} ${f(fsh[1] + 56 + i * 16)} ${f(fsh[0] - 4)} ${f(fsh[1] + 46 + i * 16)}"/>`).join('') +
      `<path d="M${f((nsh[0] + fsh[0]) / 2 - 4)} ${f(nsh[1] + 10)} L${f((wl[0] + wr[0]) / 2 - 6)} ${f(wl[1])}"/></g>`;
    a.shape({ d: smooth(pts, true, 0.55), fill: o.fill || G.corpse, depth: o.depth || 28, mottle: o.mottle === undefined ? 0.5 : o.mottle, fine: true, hatch: o.hatch || 100, tex: o.tex, texOp: o.texOp, decals: dec, lines: o.lines, over: o.over });
  };
  // a ragged garment hanging from a top line to a hem
  B.rag = (topL, topR, hemY, col, o = {}) => {
    const hem = P.ragged(topR[0] + (o.flare || 10), topL[0] - (o.flare || 10), hemY, o.n || 10, o.amp || 18);
    a.shape({ d: smooth([topL, topR, [topR[0] + (o.flare || 10) * 0.6, (topR[1] + hemY) / 2], ...hem, [topL[0] - (o.flare || 10) * 0.6, (topL[1] + hemY) / 2]], true, 0.5), fill: col, depth: o.depth || 24, mottle: 0.5, fine: true, hatch: o.hatch || 80,
      decals: (o.decals || '') + a.fold(topL[0] + 14, topL[1] + 10, topL[0] + 6, hemY - 10, 6) + a.fold((topL[0] + topR[0]) / 2, topL[1] + 10, (topL[0] + topR[0]) / 2 + 4, hemY, 6) + a.fold(topR[0] - 12, topR[1] + 10, topR[0] - 4, hemY - 6, 5) });
  };
  B.P = P;
  return B;
};
