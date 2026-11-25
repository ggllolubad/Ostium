// Keeper kit: living people of the abbey, facing LEFT (toward the door the player came in by).
// Canvas 560 x 860, ground line y 830, about 7.5 heads tall: head ~ 96 px. Every part goes through the shading engine,
// every part carries wear, and nothing is a plain tube: sleeves fold, hems sag, hands have knuckles.
const { G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const f = n => +(+n).toFixed(1);

module.exports = (a) => {
  a.useGrain();
  const R = a.R, K = {};
  const pt = (x, y) => `${f(x)} ${f(y)}`;
  const path = (pts, close = false) => 'M' + pts.map(p => pt(...p)).join(' L') + (close ? ' Z' : '');
  const curve = (pts) => smooth(pts, false, 0.6);

  // ------------------------------------------------------------------ face, 3/4 to the left
  // o: { x, y (centre of the head), k (head height / 100), skin, age (0 young .. 1 old), nose: 'straight'|'hook'|'round'|'snub',
  //      brow: 0..1 heaviness, mouth: 'set'|'smile'|'thin'|'frown'|'open', eye: 'open'|'narrow'|'bound'|'closed', cheek (ruddy 0..1),
  //      jaw: width 0.9..1.2, stubble, beard, scars: [] }
  K.face = (o) => {
    const k = (o.k || 1), x = o.x, y = o.y, jw = o.jaw || 1, age = o.age || 0.4;
    const p = (dx, dy) => [x + dx * k, y + dy * k];
    const sk = o.skin || '#c8a07a';
    const out = [p(4, -50), p(-14, -47), p(-27, -37), p(-31, -22), p(-32, -14), p(-34, -6),
      o.nose === 'hook' ? p(-43, 4) : o.nose === 'round' ? p(-40, 6) : o.nose === 'snub' ? p(-38, 4) : p(-41, 5),
      p(-35, 11), p(-33, 16), p(-31, 24), p(-28, 31), p(-26 * jw, 40), p(-18 * jw, 49), p(-6, 52), p(8 * jw, 46), p(18 * jw, 36),
      p(26, 24), p(31, 6), p(34, -14), p(30, -34), p(18, -46)];
    let dec = '';
    // cheek warmth, age shadows, beard stubble
    if (o.cheek) dec += a.stain(...p(-18, 16), 14 * k, '#b85a4a', 0.35 * o.cheek);
    dec += a.stain(...p(-10, 30), 12 * k, dark(sk, 0.4), 0.25 + age * 0.2);
    if (o.stubble) dec += `<path d="${path([p(-30, 26), p(-26, 40), p(-16, 50), p(-4, 52), p(8, 46), p(18, 36), p(22, 26)])}" stroke="${o.stubble}" stroke-width="${f(9 * k)}" fill="none" opacity="0.35" stroke-linecap="round"/>` +
      Array.from({ length: 40 }, () => { const q = p(-26 + R() * 46, 26 + R() * 24); return `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(0.6 * k)}" fill="${o.stubble}" opacity="0.7"/>`; }).join('');
    const L = [];
    // brow ridge and the eye socket shadow
    const bw = 1 + (o.brow || 0.4);
    L.push({ d: curve([p(-32, -16), p(-24, -20 - bw * 1.5), p(-12, -20), p(-4, -16)]), w: 1.6 * bw * k, col: o.browCol || dark(sk, 0.6) });
    dec += a.stain(...p(-17, -9), 9 * k, dark(sk, 0.5), 0.45);
    // the eye
    const ex = p(-18, -8);
    if (o.eye === 'bound') { /* drawn by the headwear */ }
    else if (o.eye === 'closed') L.push({ d: curve([p(-24, -8), p(-18, -6), p(-12, -8)]), w: 1.4 * k });
    else {
      const h = o.eye === 'narrow' ? 2.2 : 3.6;
      dec += `<path d="M${pt(...p(-25, -8))} Q${pt(...p(-18, -8 - h))} ${pt(...p(-11, -8))} Q${pt(...p(-18, -8 + h * 0.7))} ${pt(...p(-25, -8))} Z" fill="#e8dcc4" stroke="${INK}" stroke-width="${f(1.1 * k)}"/>` +
        `<circle cx="${f(ex[0] - 2.5 * k)}" cy="${f(ex[1] - 0.2 * k)}" r="${f((o.eye === 'narrow' ? 1.6 : 2.2) * k)}" fill="${o.iris || '#3a2a1e'}"/><circle cx="${f(ex[0] - 3 * k)}" cy="${f(ex[1] - 1 * k)}" r="${f(0.6 * k)}" fill="#fff8e8"/>`;
      L.push({ d: curve([p(-26, -9), p(-18, -9 - h - 1), p(-10, -8)]), w: 1.8 * k });
      if (age > 0.3) L.push({ d: curve([p(-24, -2), p(-18, 0), p(-12, -3)]), w: 0.8 * k, op: 0.7 });
      if (age > 0.5) for (let i = 0; i < 3; i++) L.push({ d: curve([p(-8, -12 + i * 4), p(-3, -11 + i * 5)]), w: 0.7 * k, op: 0.6 });
    }
    // nose
    const nt = out[6];
    L.push({ d: curve([p(-31, -12), p(-34, -2), [nt[0], nt[1]], p(-36, 10)]), w: 1.2 * k });
    L.push({ d: curve([p(-34, 10), p(-30, 12), p(-28, 9)]), w: 1.3 * k });
    // nasolabial fold and mouth
    L.push({ d: curve([p(-26, 6), p(-24, 16), p(-22, 26)]), w: (0.8 + age) * k, op: 0.75 });
    const m = o.mouth || 'set';
    if (m === 'smile') L.push({ d: curve([p(-31, 27), p(-24, 31), p(-14, 29), p(-10, 25)]), w: 1.6 * k });
    else if (m === 'thin') L.push({ d: curve([p(-31, 28), p(-20, 28.5), p(-11, 27)]), w: 1.4 * k });
    else if (m === 'frown') L.push({ d: curve([p(-31, 30), p(-22, 27.5), p(-12, 30)]), w: 1.7 * k });
    else if (m === 'open') { dec += `<path d="M${pt(...p(-31, 27))} Q${pt(...p(-21, 25))} ${pt(...p(-12, 27))} Q${pt(...p(-22, 35))} ${pt(...p(-31, 27))} Z" fill="#2a1410"/>`; }
    else L.push({ d: curve([p(-31, 28), p(-22, 29), p(-12, 28)]), w: 1.6 * k });
    L.push({ d: curve([p(-29, 33), p(-22, 35), p(-16, 34)]), w: 0.8 * k, op: 0.6 });   // lower lip shadow
    // ear and jaw hinge
    L.push({ d: curve([p(10, -10), p(18, -14), p(22, -2), p(18, 10), p(11, 9)]), w: 1.2 * k });
    L.push({ d: curve([p(14, -6), p(17, 0), p(14, 5)]), w: 0.8 * k });
    for (const sc of (o.scars || [])) L.push({ d: curve(sc.map(([u, v]) => p(u, v))), w: 1.2 * k, col: '#7a3a2a' });
    if (o.plain) { L.length = 0; dec = ''; dec += `<circle cx="${f(ex[0] - 2 * k)}" cy="${f(ex[1])}" r="${f(1.8 * k)}" fill="${INK}"/>`; L.push({ d: curve([p(-30, 27), p(-22, 30), p(-14, 28)]), w: 1.4 * k }); L.push({ d: curve([p(10, -10), p(18, -14), p(22, -2), p(18, 10), p(11, 9)]), w: 1.1 * k }); }
    a.shape({ d: smooth(out, true, 0.5), fill: sk, depth: 16 * k, mottle: o.plain ? 0.15 : 0.45, fine: true, hatch: 120, hlOp: 0.14, lines: L, decals: dec, ink: 1.8 });
    if (o.beard) a.shape({ d: smooth([p(-31, 24), p(-28, 40), p(-20, 56), p(-6, 64), p(10, 54), p(20, 38), p(22, 26), p(8, 34), p(-10, 38), p(-22, 34)], true, 0.5), fill: o.beard, depth: 6 * k, ink: 1.4, hatch: 120,
      lines: Array.from({ length: 9 }, (_, i) => { const q0 = p(-26 + i * 5, 34 + (i % 2) * 3), q1 = p(-24 + i * 5, 50 + (i % 3) * 4); return { d: `M${pt(...q0)} L${pt(...q1)}`, w: 0.8, op: 0.7 }; }) });
    return { p, eye: ex, crown: p(4, -50), chin: p(-6, 52), neck: [p(-8, 46), p(18, 34)] };
  };

  // ------------------------------------------------------------------ hair and headwear
  K.hair = (F, kind, col, k = 1) => {
    const p = F.p;
    if (kind === 'tonsure') {      // a ring of hair round a bare crown
      a.shape({ d: smooth([p(-28, -30), p(-20, -44), p(-6, -50), p(-12, -40), p(-22, -28)], true, 0.5), fill: col, depth: 4, ink: 1.2, hatch: 60 });
      a.shape({ d: smooth([p(6, -50), p(24, -42), p(34, -24), p(36, 0), p(30, 20), p(24, 8), p(26, -18), p(18, -36)], true, 0.5), fill: col, depth: 6, ink: 1.3, hatch: 60,
        lines: [0, 1, 2, 3].map(i => ({ d: `M${pt(...p(10 + i * 6, -44 + i * 6))} L${pt(...p(20 + i * 4, -10 + i * 6))}`, w: 0.8, op: 0.6 })) });
    } else if (kind === 'crop') {
      a.shape({ d: smooth([p(-29, -26), p(-24, -42), p(-6, -54), p(14, -54), p(30, -42), p(36, -18), p(34, 2), p(28, -12), p(20, -34), p(0, -44), p(-18, -38)], true, 0.5), fill: col, depth: 6, ink: 1.3, hatch: 60,
        lines: Array.from({ length: 10 }, (_, i) => ({ d: `M${pt(...p(-20 + i * 5, -46 - (i % 3)))} l${f(2 * k)} ${f(6 * k)}`, w: 0.7, op: 0.7 })) });
    } else if (kind === 'static') {     // Hild: cropped grey hair standing out in a wiry, frizzed halo
      const c = p(8, -6), pts = [], n = 90;
      for (let i = 0; i <= n; i++) { const t = Math.PI * (0.92 + 1.12 * i / n), r = (58 + Math.sin(i * 0.9) * 5 + Math.sin(i * 2.3) * 3 + (R() < 0.12 ? 8 + R() * 10 : R() * 3)) * k; pts.push([c[0] + Math.cos(t) * r * 1.02, c[1] + Math.sin(t) * r * 0.98]); }
      pts.push(p(36, 18), p(30, 2), p(26, -18), p(12, -36), p(-10, -40), p(-26, -30));
      let strands = '';
      for (let i = 0; i < 34; i++) { const t = Math.PI * (0.95 + 1.05 * R()), r0 = 30 * k, r1 = (52 + R() * 24) * k, bend = (R() - 0.5) * 14 * k;
        const q0 = [c[0] + Math.cos(t) * r0, c[1] + Math.sin(t) * r0], q1 = [c[0] + Math.cos(t) * r1, c[1] + Math.sin(t) * r1];
        strands += `<path d="M${pt(...q0)} Q${pt((q0[0] + q1[0]) / 2 + bend, (q0[1] + q1[1]) / 2 - bend * 0.5)} ${pt(...q1)}" stroke="${i % 3 ? INK : '#e8e4da'}" stroke-width="${f((i % 3 ? 0.8 : 1.1) * k)}" fill="none" opacity="${i % 3 ? 0.55 : 0.8}"/>`; }
      a.shape({ d: smooth(pts, true, 0.5), fill: col, depth: 10, ink: 1.3, hatch: 60, mottle: 0.35, fine: true, hlOp: 0.25, decals: strands });
      let fly = '';
      for (let i = 0; i < 26; i++) { const t = Math.PI * (0.95 + 1.05 * R()), r0 = (56 + R() * 10) * k, r1 = r0 + (6 + R() * 14) * k, b = (R() - 0.5) * 10;
        fly += `<path d="M${pt(c[0] + Math.cos(t) * r0, c[1] + Math.sin(t) * r0)} q${f(Math.cos(t) * (r1 - r0) * 0.5 + b)} ${f(Math.sin(t) * (r1 - r0) * 0.5 - b)} ${f(Math.cos(t) * (r1 - r0))} ${f(Math.sin(t) * (r1 - r0))}" stroke="${INK}" stroke-width="${f(0.9 * k)}" fill="none" stroke-linecap="round" opacity="0.8"/>`; }
      a.raw(fly);
    } else if (kind === 'combed') {
      a.shape({ d: smooth([p(-30, -24), p(-26, -44), p(-8, -56), p(16, -56), p(32, -44), p(36, -20), p(34, 8), p(26, -6), p(18, -30), p(-4, -40), p(-22, -30)], true, 0.5), fill: col, depth: 5, ink: 1.3, hatch: 60,
        lines: [0, 1, 2, 3, 4, 5].map(i => ({ d: curve([p(-24 + i * 9, -42 - i), p(-10 + i * 8, -50), p(10 + i * 4, -36 + i * 4)]), w: 0.8, op: 0.6 })) });
    } else if (kind === 'cap') {      // Godric's knitted cap, pulled to the brows
      a.shape({ d: smooth([p(-32, -14), p(-30, -40), p(-10, -60), p(18, -62), p(38, -44), p(40, -10), p(30, -4), p(-4, -10), p(-24, -12)], true, 0.5), fill: col, depth: 8, ink: 1.5, hatch: 60, tex: 'url(#weave)', texOp: 0.6,
        lines: [p(-30, -18), p(-6, -14), p(36, -12)].length ? [{ d: curve([p(-32, -20), p(0, -16), p(38, -16)]), w: 1.4 }, { d: curve([p(-31, -26), p(0, -22), p(38, -22)]), w: 0.9, op: 0.6 }] : [] });
      a.raw(`<path d="${blob(...p(14, -62), 7 * k, R, 7, 0.35)}" fill="${dark(col, 0.1)}" stroke="${INK}" stroke-width="1.2"/>`);
    }
  };
  // hood or cowl lying back on the shoulders
  K.cowl = (cx, cy, w, col) => a.shape({ d: smooth([[cx - w * 0.6, cy + 6], [cx - w * 0.5, cy - 14], [cx - w * 0.1, cy - 22], [cx + w * 0.5, cy - 18], [cx + w * 0.62, cy + 4], [cx + w * 0.3, cy + 26], [cx - w * 0.2, cy + 24]], true, 0.5), fill: col, depth: 12, ink: 1.6, hatch: 60, mottle: 0.4, grime: 0.5,
    lines: [{ d: curve([[cx - w * 0.4, cy - 4], [cx, cy + 6], [cx + w * 0.4, cy - 2]]), w: 1.1, op: 0.7 }] });
  // wimple and veil for the sisters; band = cloth over the eyes
  K.wimple = (F, col, veil, k = 1, o = {}) => {
    const p = F.p;
    if (veil) a.shape({ d: smooth([p(-28, -40), p(-6, -62), p(28, -58), p(46, -30), p(54, 20), p(60, 90), p(62, 150), p(36, 150), p(30, 80), p(24, 30), p(18, -20), p(-4, -40)], true, 0.5), fill: veil, depth: 14, ink: 1.6, hatch: 60, mottle: 0.4, grime: 0.4,
      lines: [{ d: curve([p(34, -20), p(42, 40), p(46, 130)]), w: 1, op: 0.6 }, { d: curve([p(20, 0), p(30, 60), p(40, 140)]), w: 1, op: 0.5 }] });
    a.shape({ d: smooth([p(-30, -34), p(-18, -50), p(8, -54), p(26, -44), p(32, -20), p(30, 20), p(20, 50), p(4, 64), p(-24, 66), p(-36, 56), p(-30, 50), p(-14, 54), p(4, 44), p(14, 20), p(18, -12), p(8, -36), p(-12, -40), p(-26, -28)], true, 0.5),
      fill: col, depth: 8, ink: 1.5, hatch: 60, mottle: 0.3, grime: 0.35, lines: [{ d: curve([p(-24, 60), p(-4, 58), p(14, 46)]), w: 0.9, op: 0.6 }] });
    if (o.band) a.shape({ d: smooth([p(-33, -16), p(-10, -18), p(18, -14), p(20, -2), p(-8, -2), p(-34, -2)], true, 0.4), fill: o.band, depth: 3, ink: 1.4, hatch: 20,
      lines: [{ d: curve([p(-30, -10), p(-4, -11), p(18, -8)]), w: 0.8, op: 0.6 }], decals: a.stain(...p(-18, -9), 6 * k, '#8a8070', 0.4) });
  };

  // ------------------------------------------------------------------ the habit
  // o: { cx, sh (shoulder y), sw (shoulder half width), waist, hem, flare, col, folds, kilt (y where skirts are tucked up), dirt }
  K.habit = (o) => {
    const { cx, sh, sw, hem } = o, fl = o.flare || 1.15, wy = o.waist || sh + 200;
    const hemPts = [];
    const x0 = cx + sw * fl, x1 = cx - sw * fl, n = 14;
    for (let i = 0; i <= n; i++) { const t = i / n; hemPts.push([x0 + (x1 - x0) * t + (R() - 0.5) * 6, hem + Math.sin(t * Math.PI) * 6 + (i % 2 ? 7 + R() * 9 : R() * 4)]); }
    const body = [[cx - sw * 0.82, sh + 4], [cx - sw * 0.35, sh - 10], [cx + sw * 0.4, sh - 8], [cx + sw * 0.86, sh + 6], [cx + sw * 0.9, sh + 60], [cx + sw * 0.82, wy], [cx + sw * fl * 0.98, (wy + hem) / 2 + 40], ...hemPts, [cx - sw * fl * 0.98, (wy + hem) / 2 + 40], [cx - sw * 0.8, wy], [cx - sw * 0.92, sh + 60]];
    let dec = '';
    for (const [u, du] of o.folds || [[-0.55, -0.05], [-0.15, 0.04], [0.25, -0.03], [0.62, 0.05]]) dec += a.fold(cx + sw * u, wy + 14, cx + sw * (u * fl + du), hem - 6, 9);
    dec += a.stain(cx, hem - 30, sw * 0.9, '#2a2016', 0.55 + (o.dirt || 0)) + a.stain(cx - sw * 0.4, hem - 70, sw * 0.4, '#3a2c1e', 0.4);
    if (o.decals) dec += o.decals;
    a.shape({ d: smooth(body, true, 0.45), fill: o.col, depth: 34, mottle: o.clean ? 0.12 : 0.45, fine: true, hatch: 70, grime: o.clean ? 0.05 : 0.45, tex: 'url(#weave)', texOp: o.clean ? 0.12 : 0.25, decals: o.clean ? dec.replace(/opacity="[0-9.]+"/g, 'opacity="0.08"') : dec, ink: 2.2,
      lines: [{ d: curve([[cx - sw * 0.25, sh + 20], [cx - sw * 0.2, wy - 40], [cx - sw * 0.24, wy]]), w: 1.2, op: 0.6 }] });
    return { body, wy };
  };
  // the scapular: a straight panel down the front, over the habit
  K.scapular = (cx, top, bottom, w, col, clean) => a.shape({ d: smooth([[cx - w, top], [cx + w, top + 2], [cx + w * 1.05, bottom], [cx + w * 0.3, bottom + 8], [cx - w * 0.4, bottom + 4], [cx - w * 1.05, bottom - 2]], true, 0.3), fill: col, depth: 12, ink: 1.6, hatch: 70, mottle: clean ? 0.08 : 0.4, grime: clean ? 0 : 0.5, tex: 'url(#weave)', texOp: 0.3,
    decals: a.fold(cx - w * 0.3, top + 30, cx - w * 0.4, bottom - 20, 6) + (clean ? '' : a.stain(cx, bottom - 40, w, '#1a140e', 0.4)) });
  // rope belt with a knotted hanging end
  K.rope = (x0, x1, y, col = '#8a7a5a', drop = 90) => {
    const d = curve([[x0, y + 4], [(x0 + x1) / 2, y + 10], [x1, y + 2]]);
    let o = `<path d="${d}" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${INK}" stroke-width="6" fill="none" stroke-dasharray="1.2 5" opacity="0.6"/>`;
    const hx = x0 + (x1 - x0) * 0.35, hang = curve([[hx, y + 8], [hx - 6, y + drop * 0.5], [hx - 2, y + drop]]);
    o += `<path d="${hang}" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="${hang}" stroke="${col}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`;
    for (const t of [0.45, 0.95]) o += `<circle cx="${f(hx - 4 + t * 2)}" cy="${f(y + drop * t)}" r="5" fill="${col}" stroke="${INK}" stroke-width="1.6"/>`;
    a.raw(o);
  };
  // the order's iron key ring and lead ostium badge
  K.keys = (x, y, s = 1, n = 5) => {
    let o = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(12 * s)}" ry="${f(14 * s)}" fill="none" stroke="${INK}" stroke-width="${f(4.6 * s)}"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(12 * s)}" ry="${f(14 * s)}" fill="none" stroke="#4a4640" stroke-width="${f(2.6 * s)}"/>`;
    for (let i = 0; i < n; i++) { const t = -0.9 + i * 0.45, kx = x + Math.sin(t) * 14 * s, ky = y + 12 * s, l = (30 + R() * 16) * s, ex = kx + Math.sin(t) * l * 0.4, ey = ky + l;
      o += `<path d="M${pt(kx, ky)} L${pt(ex, ey)}" stroke="${INK}" stroke-width="${f(4.4 * s)}" stroke-linecap="round"/><path d="M${pt(kx, ky)} L${pt(ex, ey)}" stroke="#5a5650" stroke-width="${f(2.4 * s)}"/>` +
        `<path d="M${pt(ex, ey - 6 * s)} l${f(5 * s)} 0 l0 ${f(4 * s)} l${f(-3 * s)} 0" stroke="${INK}" stroke-width="${f(2 * s)}" fill="none"/>` + `<circle cx="${f(kx + Math.sin(t) * 3 * s)}" cy="${f(ky + 5 * s)}" r="${f(4 * s)}" fill="none" stroke="${INK}" stroke-width="${f(2.2 * s)}"/>`; }
    a.raw(o);
  };
  K.badge = (x, y, s = 1) => a.raw(`<path d="M${pt(x, y - 22 * s)} L${pt(x, y - 8 * s)}" stroke="${INK}" stroke-width="1.4"/><path d="M${pt(x - 7 * s, y - 8 * s)} L${pt(x + 7 * s, y - 8 * s)} L${pt(x + 7 * s, y + 4 * s)} Q${pt(x, y + 14 * s)} ${pt(x - 7 * s, y + 4 * s)} Z" fill="#8a8a86" stroke="${INK}" stroke-width="1.6"/><path d="M${pt(x - 3 * s, y + 6 * s)} L${pt(x - 3 * s, y - 3 * s)} Q${pt(x, y - 7 * s)} ${pt(x + 3 * s, y - 3 * s)} L${pt(x + 3 * s, y + 6 * s)}" stroke="${INK}" stroke-width="1.2" fill="none"/>`);

  // ------------------------------------------------------------------ arms: a sleeve that folds at the elbow, a hand with knuckles
  // o: { sh, el, wr, col (sleeve), w (sleeve width), skin, rolled (sleeve ends at elbow: forearm bare), hand: 'open'|'fist'|'grip'|'rest', dir, decals, foreDecals }
  K.arm = (o) => {
    const { sh, el, wr } = o, w = o.w || 1, sk = o.skin || '#c8a07a';
    const upEnd = o.rolled ? el : null;
    a.limb([sh, [(sh[0] + el[0]) / 2, (sh[1] + el[1]) / 2 + 3], el], [56 * w, 50 * w, 44 * w], { fill: o.col, depth: 14, mottle: 0.45, fine: true, hatch: o.hatch || 60, grime: 0.4, decals: (o.decals || '') + a.fold(sh[0], sh[1] + 10, el[0], el[1] - 6, 6), ink: 1.8 });
    if (o.rolled) {
      // bare forearm with the rolled cuff over the elbow
      a.limb([el, [(el[0] + wr[0]) / 2, (el[1] + wr[1]) / 2], wr], [34 * w, 32 * w, 24 * w], { fill: sk, depth: 9, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.foreDecals || '', ink: 1.7,
        lines: [{ d: curve([[el[0] + (wr[0] - el[0]) * 0.3, el[1] + (wr[1] - el[1]) * 0.3 - 6], [el[0] + (wr[0] - el[0]) * 0.6, el[1] + (wr[1] - el[1]) * 0.6 - 5]]), w: 0.8, op: 0.6 }] });
      const dx = wr[0] - el[0], dy = wr[1] - el[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, c = [el[0] + dx * 0.08, el[1] + dy * 0.08];
      const cuff = [];
      for (let i = 0; i <= 10; i++) { const th = Math.PI * i / 10, rr = (25 + R() * 5) * w; cuff.push([c[0] + nx * Math.cos(th) * rr + dx / l * (Math.sin(th) * 6 - 4), c[1] + ny * Math.cos(th) * rr + dy / l * (Math.sin(th) * 6 - 4)]); }
      for (let i = 10; i >= 0; i--) { const th = Math.PI * i / 10, rr = (23 + R() * 4) * w; cuff.push([c[0] + nx * Math.cos(th) * rr + dx / l * (16 + R() * 4 - Math.sin(th) * 3), c[1] + ny * Math.cos(th) * rr + dy / l * (16 + R() * 4 - Math.sin(th) * 3)]); }
      let fl = '';
      for (let i = 0; i < 4; i++) { const s0 = -0.8 + i * 0.5, q = [c[0] + nx * s0 * 24 * w, c[1] + ny * s0 * 24 * w]; fl += `<path d="M${pt(q[0] - dx / l * 3, q[1] - dy / l * 3)} q${f(dx / l * 8 + nx * 4)} ${f(dy / l * 8 + ny * 4)} ${f(dx / l * 16)} ${f(dy / l * 16)}" stroke="${INK}" stroke-width="0.9" fill="none" opacity="0.6"/>`; }
      a.shape({ d: smooth(cuff, true, 0.5), fill: dark(o.col, 0.05), depth: 7, ink: 1.6, hatch: 60, mottle: 0.4, grime: 0.4, decals: fl });
    } else {
      // a wide sleeve hanging from the forearm, the hand showing from the cuff
      const dx = wr[0] - el[0], dy = wr[1] - el[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux, cw = 34 * w * (o.wide || 1);
      const cuff = [wr[0] - ux * 6, wr[1] - uy * 6];
      a.shape({ d: smooth([[el[0] + nx * 24 * w, el[1] + ny * 24 * w], [cuff[0] + nx * cw, cuff[1] + ny * cw + 10], [cuff[0] + nx * cw * 0.6 + ux * 4, cuff[1] + ny * cw * 0.6 + uy * 4 + 18], [cuff[0] - nx * cw * 0.7, cuff[1] - ny * cw * 0.7 + 4], [el[0] - nx * 24 * w, el[1] - ny * 24 * w]], true, 0.45), fill: o.col, depth: 12, ink: 1.8, hatch: o.hatch || 60, mottle: 0.4, grime: 0.45,
        decals: a.fold(el[0], el[1] + 6, cuff[0] + nx * cw * 0.5, cuff[1] + ny * cw * 0.5 + 6, 6) });
      a.raw(`<path d="M${pt(cuff[0] + nx * cw * 0.95, cuff[1] + ny * cw + 8)} Q${pt(cuff[0] + ux * 10, cuff[1] + uy * 10 + 14)} ${pt(cuff[0] - nx * cw * 0.7, cuff[1] - ny * cw * 0.7 + 4)}" stroke="${INK}" stroke-width="2" fill="none"/>`);
    }
    if (o.hand !== false) K.hand(wr, sk, o.dir || [-0.8, 0.6], w * (o.handScale || 1.25), o.hand || 'open', o.handDecals);
  };
  // a hand: palm block, four fingers with knuckle breaks, a thumb; grip curls the fingers round an object
  K.hand = (wr, col, dir, s = 1, pose = 'open', dec = '') => {
    const [x, y] = wr, [dx, dy] = dir, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
    const q = (u, v) => [x + (ux * u + nx * v) * s, y + (uy * u + ny * v) * s];
    a.shape({ d: smooth([q(0, -11), q(12, -13), q(24, -11), q(28, -2), q(26, 9), q(14, 12), q(2, 10)], true, 0.5), fill: col, depth: 6, ink: 1.6, mottle: 0.45, fine: true, hatch: 60, decals: dec,
      lines: [{ d: curve([q(22, -9), q(24, -2), q(22, 6)]), w: 0.8, op: 0.6 }] });
    let o = '';
    const finger = (v, len, bend) => {
      const curled = pose === 'fist' || pose === 'grip', a0 = q(24, v), a1 = curled ? q(24 + len * 0.5, v + 1) : q(24 + len * 0.55, v + bend * 0.4), a2 = curled ? q(24 + len * 0.22, v + 6) : q(24 + len, v + bend);
      const d = `M${pt(...a0)} L${pt(...a1)} L${pt(...a2)}`;
      o += `<path d="${d}" stroke="${INK}" stroke-width="${f(7.2 * s)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${col}" stroke-width="${f(4.8 * s)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<path d="M${pt(a1[0] - nx * 2 * s, a1[1] - ny * 2 * s)} L${pt(a1[0] + nx * 2 * s, a1[1] + ny * 2 * s)}" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`;
    };
    const curl = pose === 'fist' || pose === 'grip' ? 7 : pose === 'rest' ? 3 : 1;
    finger(-8, 16, curl); finger(-3, 19, curl); finger(2, 18, curl); finger(7, 14, curl);
    const t0 = q(8, -11), t1 = q(16, -20), t2 = pose === 'grip' || pose === 'fist' ? q(24, -14) : q(26, -22);
    o += `<path d="M${pt(...t0)} L${pt(...t1)} L${pt(...t2)}" stroke="${INK}" stroke-width="${f(8 * s)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${pt(...t0)} L${pt(...t1)} L${pt(...t2)}" stroke="${col}" stroke-width="${f(5.4 * s)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    a.raw(o);
    return { tip: q(32, 0), palm: q(16, 0) };
  };
  K.ground = (cx, w = 150) => a.raw(a.ground(cx, 830, w, 12));
  return K;
};
