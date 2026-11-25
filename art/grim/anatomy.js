// Anatomy kit for the door-world humanoids (figures face LEFT). Built for a 460x700 base frame,
// ~7.5 heads tall. Replaces mannequin tubes with muscled limbs, a sculpted torso, a modelled head,
// gripping fists and layered garments/armour. Every piece goes through the gr.js shading engine.
const { G, INK, smooth, limb, poly, blob } = require('../gr');
const f = n => +n.toFixed(1);
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const dark = (c, t = 0.3) => mix(c, '#140d08', t);
const light = (c, t = 0.3) => mix(c, '#f4ead0', t);
const rot = (p, o, a) => { const c = Math.cos(a), s = Math.sin(a), x = p[0] - o[0], y = p[1] - o[1]; return [o[0] + x * c - y * s, o[1] + x * s + y * c]; };
const path = (pts, close = false) => 'M' + pts.map(p => `${f(p[0])} ${f(p[1])}`).join(' L') + (close ? ' Z' : '');
const curve = pts => smooth(pts, false, 1);

module.exports = (a) => {
  const R = a.R, A = {};

  // ---------------------------------------------------------------- head (3/4 profile facing left)
  // o: {x, y: cranium centre, k, skin, style gaunt|bloated|skull|drowned|brute, jaw 0..1, eye glint|milky|socket|none|glow, glow, hair, hairLen, beard}
  A.head = (o) => {
    const k = (o.k || 1) * 1.1, x = o.x, y = o.y, sk = o.skin || G.corpse, st = o.style || 'gaunt', j = o.jaw || 0;
    const sw = st === 'bloated' ? 1.16 : (st === 'brute' ? 1.1 : 1);
    const P = (dx, dy) => [x + dx * k * sw, y + dy * k];
    const ear = P(12, 8), ja = j * 0.42;
    const J = (dx, dy) => rot(P(dx, dy), ear, -ja);
    const brow = st === 'brute' ? -40 : -37;
    const upper = [P(20, -46), P(2, -52), P(-20, -46), P(-32, -30), P(brow, -14), P(-33, -6), P(-40, 6), P(-45, 15), P(-39, 19), P(-39, 25)];
    const lower = [J(-37, 30), J(-36, 36), J(-35, 43), J(-25, 49), J(-6, 44), J(10, 34)];
    const backPts = [P(20, 22), P(27, 4), P(30, -14), P(28, -32)];
    const outline = [...upper, ...lower, ...backPts];
    const fill = st === 'skull' ? G.bone : sk;
    let dec = '', over = '', lines = [];
    // planes: temple, eye socket shadow, cheek hollow, under-jaw shadow
    dec += `<path d="${smooth([P(-34, -16), P(-22, -22), P(-8, -18), P(-6, -4), P(-16, 4), P(-30, 2)], true, 0.7)}" fill="${G.black}" opacity="${st === 'skull' ? 0.95 : 0.45}"/>`;
    if (st === 'gaunt' || st === 'skull' || st === 'drowned') dec += `<path d="${smooth([P(-28, 14), P(-12, 10), P(4, 14), P(2, 28), P(-16, 30), P(-26, 24)], true, 0.7)}" fill="${G.black}" opacity="0.26"/>`;
    dec += `<path d="${smooth([P(-12, -44), P(4, -36), P(6, -20), P(-4, -26)], true, 0.7)}" fill="${G.black}" opacity="0.15"/>`;
    if (st === 'bloated' || st === 'drowned') dec += a.stain(P(6, -20)[0], P(6, -20)[1], 14 * k, G.bruise, 0.55) + a.stain(P(-14, 30)[0], P(-14, 30)[1], 10 * k, '#6a7a70', 0.5);
    // eye
    const E = P(-23, -4), er = 4.2 * k;
    const eye = o.eye || 'glint';
    if (st === 'skull' || eye === 'socket') dec += `<path d="${blob(E[0], E[1], er * 1.5, R, 8, 0.15)}" fill="#0a0806"/>` + (o.glow ? a.glow(E[0], E[1], er * 4, o.glow, 0.9) + `<circle cx="${f(E[0])}" cy="${f(E[1])}" r="${f(er * 0.45)}" fill="${light(o.glow, 0.5)}"/>` : '');
    else if (eye === 'none') dec += `<path d="M${f(E[0] - er)} ${f(E[1])} Q${f(E[0])} ${f(E[1] + 2)} ${f(E[0] + er)} ${f(E[1])}" stroke="${INK}" stroke-width="1.4" fill="none"/>` + [0, 1, 2, 3].map(i => `<path d="M${f(E[0] - er + i * er * 0.66)} ${f(E[1] - 3)} l1 6" stroke="${INK}" stroke-width="0.9"/>`).join('');
    else {
      const iris = eye === 'milky' ? '#c8ccc0' : (eye === 'glow' ? (o.glow || '#e0c050') : '#3a2a1a');
      dec += `<path d="M${f(E[0] - er)} ${f(E[1])} Q${f(E[0])} ${f(E[1] - er * 0.85)} ${f(E[0] + er * 0.9)} ${f(E[1] + 0.4)} Q${f(E[0])} ${f(E[1] + er * 0.6)} ${f(E[0] - er)} ${f(E[1])} Z" fill="${eye === 'milky' ? '#dcdcd0' : '#d8ccb0'}"/>` +
        `<circle cx="${f(E[0] - er * 0.3)}" cy="${f(E[1] - 0.3)}" r="${f(er * 0.42)}" fill="${iris}"/>` + (eye !== 'milky' ? `<circle cx="${f(E[0] - er * 0.3)}" cy="${f(E[1] - 0.3)}" r="${f(er * 0.2)}" fill="${G.black}"/><circle cx="${f(E[0] - er * 0.45)}" cy="${f(E[1] - er * 0.3)}" r="${f(er * 0.12)}" fill="#fff"/>` : '') +
        `<path d="M${f(E[0] - er * 1.1)} ${f(E[1] - 0.6)} Q${f(E[0])} ${f(E[1] - er * 1.1)} ${f(E[0] + er)} ${f(E[1] - 0.4)}" stroke="${INK}" stroke-width="1.3" fill="none"/>` +
        `<path d="M${f(E[0] - er * 0.6)} ${f(E[1] + er * 0.9)} Q${f(E[0])} ${f(E[1] + er * 1.4)} ${f(E[0] + er * 0.9)} ${f(E[1] + er * 0.7)}" stroke="${INK}" stroke-width="0.6" fill="none" opacity="0.7"/>` +
        (eye === 'glow' ? a.glow(E[0], E[1], er * 4, o.glow || '#e0c050', 0.7) : '');
    }
    // features as engraved lines
    const L = (pts, w = 0.9, op = 1) => lines.push({ d: curve(pts), w, op });
    L([P(brow + 2, -13), P(-24, -17), P(-10, -14)], 1.2);
    L([P(-38, 18), P(-31, 22), P(-28, 30)], 0.9, 0.85);
    L([P(-26, 8), P(-12, 4), P(2, 8)], 0.7, 0.6);
    L([P(10, -2), P(17, -6), P(19, 8), P(12, 16)], 1.1);
    L([P(13, 2), P(15, 6), P(13, 10)], 0.7);
    if (st === 'gaunt' || st === 'drowned') { L([P(-6, -30), P(-2, -40)], 0.6, 0.6); L([P(-30, 30), P(-24, 36)], 0.6, 0.6); }
    if (st === 'brute') { L([P(-34, -22), P(-20, -26), P(-6, -22)], 0.8, 0.8); L([P(-30, 36), P(-14, 40)], 0.7, 0.7); }
    // mouth: closed seam, or an open jaw with gums, teeth, tongue and a string of drool
    if (j >= 0.45) {
      const u0 = P(-38, 25), u1 = P(-14, 26), l0 = J(-37, 29), l1 = J(-14, 30);
      dec += `<path d="${path([u0, u1, l1, l0], true)}" fill="#1a0c08"/><path d="M${f((l0[0] + l1[0]) / 2 - 6)} ${f((l0[1] + l1[1]) / 2 - 3)} q8 -4 14 2" stroke="#7a2a24" stroke-width="${f(3 * k)}" fill="none"/>`;
      const teeth = (p0, p1, dn, n) => { let s = ''; for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, tx = p0[0] + (p1[0] - p0[0]) * t, ty = p0[1] + (p1[1] - p0[1]) * t, w = Math.abs(p1[0] - p0[0]) / n * 0.48, l = (2.5 + R() * 2.5) * k * (st === 'skull' ? 1.4 : 1); s += `<path d="M${f(tx - w)} ${f(ty)} L${f(tx + (R() - 0.5))} ${f(ty + l * dn)} L${f(tx + w)} ${f(ty)} Z" fill="${st === 'skull' ? G.bone : '#c8bc98'}" stroke="${INK}" stroke-width="0.5"/>`; } return s; };
      dec += teeth(u0, u1, 1, 6) + teeth(l0, l1, -1, 5);
      over += a.drip(l0[0] + 6, l0[1] + 3, 10 + j * 18, 1.4, '#c8c0a8');
    } else L([P(-39, 26), P(-30, 27), P(-24, 25)], 1.3);
    if (st === 'skull') {
      dec += `<path d="${path([P(-40, 6), P(-35, 18), P(-31, 6)], true)}" fill="#0a0806"/>` + `<path d="${curve([P(-26, 10), P(-8, 8), P(10, 12)])}" stroke="${INK}" stroke-width="1.2" fill="none"/>` +
        (o.flesh !== false ? a.stain(P(8, 18)[0], P(8, 18)[1], 12 * k, '#8a5a52', 0.85) + a.stain(P(-4, -32)[0], P(-4, -32)[1], 10 * k, '#6a5a4a', 0.75) : '') +
        `<path d="M${f(P(-10, -40)[0])} ${f(P(-10, -40)[1])} l6 10 l-4 8 l7 9" stroke="${INK}" stroke-width="0.8" fill="none"/>`;
    }
    if (o.scar) dec += `<path d="M${f(P(-30, -30)[0])} ${f(P(-30, -30)[1])} L${f(P(-10, 20)[0])} ${f(P(-10, 20)[1])}" stroke="#7a3a2a" stroke-width="2" opacity="0.8"/>` + [0, 1, 2, 3].map(i => { const p = P(-28 + i * 5, -24 + i * 12); return `<path d="M${f(p[0] - 3)} ${f(p[1])} l6 0" stroke="${INK}" stroke-width="0.7"/>`; }).join('');
    a.shape({ d: smooth(outline, true, 0.55), fill, depth: 20 * k, mottle: 0.5, fine: true, hatch: 120, lines, decals: dec + (o.decals || ''), over });
    // hair: long lank strands from the crown, falling behind
    if (o.hair && o.hair !== 'weed') {
      const len = (o.hairLen || 60) * k;
      a.shape({ d: smooth([P(-24, -46), P(0, -56), P(26, -44), P(34, -10), P(36, 10) , [P(34, 20)[0] + 4, P(34, 20)[1] + len * 0.6], [P(22, 20)[0], P(22, 20)[1] + len], P(20, 10), P(22, -20), P(6, -40), P(-16, -40)], true, 0.5), fill: o.hair, depth: 10, mottle: 0.4, hatch: 70,
        lines: Array.from({ length: 9 }, (_, i) => { const s = P(-14 + i * 5, -46 + Math.abs(i - 3) * 2); return { d: curve([s, [s[0] + 18 + i, s[1] + 30], [s[0] + 26 + i * 1.5, s[1] + 40 + len * 0.6]]), w: 0.6, op: 0.7 }; }) });
    }
    if (o.hair === 'weed') for (let i = 0; i < 5; i++) { const s = P(-10 + i * 8, -48 + i * 3); a.raw(`<path d="${curve([s, [s[0] + 14, s[1] + 30], [s[0] + 6, s[1] + 70], [s[0] + 18, s[1] + 100 + R() * 40]])}" stroke="${INK}" stroke-width="3.6" fill="none"/><path d="${curve([s, [s[0] + 14, s[1] + 30], [s[0] + 6, s[1] + 70], [s[0] + 18, s[1] + 100 + R() * 40]])}" stroke="${G.algae}" stroke-width="2" fill="none"/>`); }
    if (o.beard) a.shape({ d: smooth([J(-34, 34), J(-24, 50), J(-30, 76), J(-14, 66), J(-6, 80), J(2, 56), J(10, 34), J(-10, 40)], true, 0.5), fill: o.beard, depth: 8, hatch: 70, lines: Array.from({ length: 7 }, (_, i) => { const s = J(-30 + i * 6, 38); return { d: curve([s, [s[0] - 2, s[1] + 18], [s[0] + 1, s[1] + 34]]), w: 0.6, op: 0.7 }; }) });
    return { eye: E, mouth: P(-36, 30), top: P(0, -52), chin: J(-30, 48), k };
  };

  // ---------------------------------------------------------------- neck: tendons and the pit of the throat
  A.neck = (o) => {
    const { x, y, k = 1, skin, w = 1 } = o;
    a.shape({ d: smooth([[x - 18 * w, y + 34], [x - 24 * w, y + 76], [x + 30 * w, y + 82], [x + 22 * w, y + 16], [x + 6, y + 8]], true, 0.6), fill: skin, depth: 12, mottle: 0.5, fine: true, hatch: 100,
      lines: [{ d: curve([[x + 12, y + 20], [x - 4, y + 52], [x - 14, y + 76]]), w: 0.9, op: 0.8 }, { d: curve([[x - 16, y + 40], [x - 18, y + 60], [x - 14, y + 74]]), w: 0.6, op: 0.6 }] });
  };

  // ---------------------------------------------------------------- torso, 3/4 view leaning toward the heroes
  // o: {cx, w (build), lean (px the shoulders sit forward), fill, bare, tex, decals, sex}
  A.torso = (o) => {
    const cx = o.cx, w = o.w || 1, ln = o.lean || 8, sx = cx - ln;
    const T = (dx, dy) => [sx + dx * w * (dy < 330 ? 1.28 : 1.12) + (dy / 240) * ln, dy];
    const pts = [T(-14, 204), T(-40, 214), T(-54, 236), T(-52, 262), T(-46, 286), T(-48, 310), T(-42, 332), T(-34, 358), T(-36, 388), T(-40, 420), T(-36, 452),
      T(0, 466), T(40, 456), T(44, 420), T(36, 380), T(38, 340), T(48, 300), T(52, 258), T(46, 224), T(20, 204)];
    let dec = o.decals || '', lines = [];
    if (o.bare) {
      const Ln = (p, wd = 0.9, op = 0.85) => lines.push({ d: curve(p), w: wd, op });
      Ln([T(-46, 290), T(-30, 318), T(-6, 320), T(10, 300)], 1.2);
      Ln([T(-12, 222), T(-8, 268), T(-10, 300)], 0.8, 0.6);
      Ln([T(-40, 224), T(-20, 230), T(-2, 222)], 1);
      for (let i = 0; i < 3; i++) Ln([T(-30, 342 + i * 26), T(-16, 346 + i * 26), T(-2, 340 + i * 26)], 0.8, 0.7);
      Ln([T(-14, 330), T(-14, 420)], 0.8, 0.6);
      for (let i = 0; i < 4; i++) Ln([T(10 + i * 3, 296 + i * 16), T(26, 300 + i * 16), T(40, 292 + i * 16)], 0.7, 0.6);
      Ln([T(-36, 432), T(-10, 456)], 1);
      dec += `<path d="${smooth([T(-48, 296), T(-28, 322), T(-2, 324), T(14, 302), T(4, 330), T(-30, 334)], true, 0.6)}" fill="${G.black}" opacity="0.22"/>` + `<path d="${smooth([T(8, 300), T(40, 296), T(40, 360), T(20, 380), T(14, 340)], true, 0.6)}" fill="${G.black}" opacity="0.18"/>` + `<path d="${smooth([T(-40, 430), T(-8, 450), T(30, 440), T(-6, 462)], true, 0.6)}" fill="${G.black}" opacity="0.2"/>`;
      dec += `<circle cx="${f(T(-18, 400)[0])}" cy="${f(T(-18, 400)[1])}" r="2" fill="${INK}" opacity="0.6"/>`;
    } else {
      for (let i = 0; i < 4; i++) dec += a.fold(T(-30 + i * 18, 230)[0], 230 + R() * 10, T(-34 + i * 20, 420)[0], 430 + R() * 20, 5);
    }
    a.shape({ d: smooth(pts, true, 0.5), fill: o.fill, depth: 22 * w, mottle: 0.5, fine: true, hatch: 100, tex: o.tex, texOp: o.texOp || 0.5, decals: dec, lines, spec: o.spec });
    return { fsh: T(-44, 226), nsh: T(40, 226), neck: T(2, 204), waist: T(0, 360), hip: T(0, 450), front: T(-48, 300), T };
  };

  // ---------------------------------------------------------------- arm: deltoid, biceps, forearm swell, wrist
  A.arm = (o) => {
    const { sh, el, wr } = o, w = o.w || 1, sk = o.fill;
    const u1 = [sh[0] + (el[0] - sh[0]) * 0.33, sh[1] + (el[1] - sh[1]) * 0.33], u2 = [sh[0] + (el[0] - sh[0]) * 0.7, sh[1] + (el[1] - sh[1]) * 0.7];
    const f1 = [el[0] + (wr[0] - el[0]) * 0.3, el[1] + (wr[1] - el[1]) * 0.3], f2 = [el[0] + (wr[0] - el[0]) * 0.72, el[1] + (wr[1] - el[1]) * 0.72];
    a.limb([sh, u1, u2, el], [46 * w, 42 * w, 36 * w, 26 * w], { fill: sk, depth: 8, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.upperDecals || '' });
    a.limb([el, f1, f2, wr], [29 * w, 32 * w, 23 * w, 16 * w], { fill: o.fore || sk, depth: 7, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.foreDecals || '',
      lines: [{ d: curve([[el[0] - 4, el[1] - 2], [el[0] + 2, el[1] + 4], [el[0] + 6, el[1] + 2]]), w: 0.8, op: 0.7 }] });
    if (o.bracer) a.limb([f1, f2, wr], [28 * w, 22 * w, 18 * w], { fill: o.bracer, depth: 6, mottle: 0.4, hatch: 70, lines: [{ d: curve([f1, wr]), w: 0.6, op: 0.5 }], after: a.rivet(f2[0], f2[1], 1.8) });
  };
  // a closed fist around a grip, knuckles toward dir
  A.fist = (wr, dir, col, w = 1, gaunt = false) => {
    const l = Math.hypot(dir[0], dir[1]), ux = dir[0] / l, uy = dir[1] / l, nx = -uy, ny = ux;
    const q = (s, t) => [wr[0] + (ux * s + nx * t) * w, wr[1] + (uy * s + ny * t) * w];
    const pts = [q(-4, -10), q(8, -13), q(18, -11), q(22, -4), q(22, 6), q(16, 12), q(4, 12), q(-4, 9)];
    const knuckles = [-8, -3, 2, 7].map(t => `M${f(q(20, t)[0])} ${f(q(20, t)[1])} L${f(q(12, t * 1.1)[0])} ${f(q(12, t * 1.1)[1])}`);
    a.shape({ d: smooth(pts, true, 0.5), fill: col, depth: 6, mottle: 0.4, fine: true, hatch: 80, ink: 1.2, lines: [...knuckles, `M${f(q(2, -12)[0])} ${f(q(2, -12)[1])} Q${f(q(12, -16)[0])} ${f(q(12, -16)[1])} ${f(q(16, -8)[0])} ${f(q(16, -8)[1])}`],
      spec: gaunt ? [`M${f(q(6, -8)[0])} ${f(q(6, -8)[1])} L${f(q(18, -6)[0])} ${f(q(18, -6)[1])}`] : undefined, specOp: 0.5, after: gaunt ? a.rivet(q(10, 0)[0], q(10, 0)[1], 1.6) : '' });
    return q(12, 0);
  };
  // an open hand or a clawed hand, reaching along dir
  A.hand = (wr, dir, col, w = 1, claws = false) => {
    const l = Math.hypot(dir[0], dir[1]), ux = dir[0] / l, uy = dir[1] / l, nx = -uy, ny = ux;
    const q = (s, t) => [wr[0] + (ux * s + nx * t) * w, wr[1] + (uy * s + ny * t) * w];
    a.shape({ d: smooth([q(-2, -9), q(16, -11), q(24, -6), q(24, 6), q(14, 10), q(-2, 8)], true, 0.5), fill: col, depth: 5, mottle: 0.4, fine: true, hatch: 80, lines: [`M${f(q(6, -6)[0])} ${f(q(6, -6)[1])} L${f(q(16, -2)[0])} ${f(q(16, -2)[1])}`] });
    let o = '';
    [[-7, 20], [-2.5, 24], [2, 23], [6.5, 18]].forEach(([t, len], i) => {
      const b0 = q(22, t), b1 = q(22 + len * 0.5, t * 1.15 + 1), b2 = q(22 + len, t * 1.3 + 3 + i);
      const d = curve([b0, b1, b2]);
      o += `<path d="${d}" stroke="${INK}" stroke-width="${f(5.4 * w)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="${f(3.6 * w)}" fill="none" stroke-linecap="round"/>` +
        `<path d="M${f(b1[0] + nx * 1.6)} ${f(b1[1] + ny * 1.6)} l${f(-nx * 3.2)} ${f(-ny * 3.2)}" stroke="${INK}" stroke-width="0.6"/>`;
      if (claws) { const c = q(22 + len + 12, t * 1.4 + 6 + i); o += `<path d="M${f(b2[0])} ${f(b2[1])} Q${f((b2[0] + c[0]) / 2 + nx * 3)} ${f((b2[1] + c[1]) / 2 + ny * 3)} ${f(c[0])} ${f(c[1])}" stroke="${INK}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M${f(b2[0])} ${f(b2[1])} Q${f((b2[0] + c[0]) / 2 + nx * 3)} ${f((b2[1] + c[1]) / 2 + ny * 3)} ${f(c[0])} ${f(c[1])}" stroke="${G.boneD}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`; }
    });
    const t0 = q(6, -9), t1 = q(14, -18), t2 = q(22, -20);
    o += `<path d="${curve([t0, t1, t2])}" stroke="${INK}" stroke-width="${f(5.8 * w)}" fill="none" stroke-linecap="round"/><path d="${curve([t0, t1, t2])}" stroke="${col}" stroke-width="${f(3.8 * w)}" fill="none" stroke-linecap="round"/>`;
    a.raw(o);
  };

  // ---------------------------------------------------------------- a robe sleeve: hangs from the shoulder, bends at the elbow, opens to a bell cuff with a ragged hem
  A.sleeve = (o) => {
    const { sh, el, wr } = o, w = o.w || 1, col = o.fill;
    const d1 = [el[0] - sh[0], el[1] - sh[1]], d2 = [wr[0] - el[0], wr[1] - el[1]];
    const n1 = (v, k) => { const l = Math.hypot(v[0], v[1]); return [-v[1] / l * k, v[0] / l * k]; };
    const a1 = n1(d1, 20 * w), a2 = n1(d2, 17 * w), cuff = n1(d2, (o.bell || 30) * w);
    const hang = o.hang || 18;
    const pts = [[sh[0] + a1[0], sh[1] + a1[1]], [el[0] + a1[0] * 1.1, el[1] + a1[1] * 1.1], [wr[0] + cuff[0], wr[1] + cuff[1] + hang * 0.4],
      [wr[0] + cuff[0] * 0.2, wr[1] + cuff[1] * 0.2 + hang], [wr[0] - cuff[0] * 0.6, wr[1] - cuff[1] * 0.6 + hang * 0.6], [wr[0] - cuff[0], wr[1] - cuff[1]],
      [el[0] - a2[0], el[1] - a2[1]], [sh[0] - a1[0], sh[1] - a1[1]]];
    const folds = [0.35, 0.65].map(t => a.fold(sh[0] + d1[0] * t + a1[0] * 0.5, sh[1] + d1[1] * t + a1[1] * 0.5, el[0] + d2[0] * (t + 0.2), el[1] + d2[1] * (t + 0.2), 5)).join('') + a.fold(el[0], el[1], wr[0] + cuff[0] * 0.3, wr[1] + hang * 0.8, 6);
    a.shape({ d: smooth(pts, true, 0.5), fill: col, depth: 12, mottle: 0.5, fine: true, hatch: o.hatch || 60, tex: o.tex, texOp: o.texOp || 0.4, decals: folds + (o.decals || ''),
      lines: [{ d: `M${f(wr[0] + cuff[0])} ${f(wr[1] + cuff[1] + hang * 0.4)} Q${f(wr[0])} ${f(wr[1] + hang * 1.2)} ${f(wr[0] - cuff[0])} ${f(wr[1] - cuff[1])}`, w: 1.1 }] });
  };
  // ---------------------------------------------------------------- leg: quadriceps, knee, calf, ankle, foot
  A.leg = (o) => {
    const { hip, knee, ankle } = o, w = o.w || 1, sk = o.fill;
    const t1 = [hip[0] + (knee[0] - hip[0]) * 0.35 - 3, hip[1] + (knee[1] - hip[1]) * 0.35], t2 = [hip[0] + (knee[0] - hip[0]) * 0.75, hip[1] + (knee[1] - hip[1]) * 0.75];
    const c1 = [knee[0] + (ankle[0] - knee[0]) * 0.3 + 4, knee[1] + (ankle[1] - knee[1]) * 0.3], c2 = [knee[0] + (ankle[0] - knee[0]) * 0.72, knee[1] + (ankle[1] - knee[1]) * 0.72];
    a.limb([hip, t1, t2, knee], [62 * w, 58 * w, 46 * w, 34 * w], { fill: sk, depth: 10, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.thighDecals || '',
      lines: o.bare ? [{ d: curve([[t1[0] - 14 * w, t1[1]], [t2[0] - 10 * w, t2[1]], [knee[0] - 8, knee[1] - 6]]), w: 0.7, op: 0.6 }] : undefined });
    a.limb([knee, c1, c2, ankle], [34 * w, 40 * w, 26 * w, 19 * w], { fill: o.shin || sk, depth: 8, mottle: 0.5, fine: true, hatch: o.hatch || 60, decals: o.shinDecals || '',
      lines: [{ d: curve([[knee[0] - 10 * w, knee[1] + 4], [knee[0], knee[1] + 10], [knee[0] + 10 * w, knee[1] + 4]]), w: 0.7, op: 0.7 }] });
    if (o.greave) a.shape({ d: smooth([[knee[0] - 18 * w, knee[1] + 4], [knee[0] + 14 * w, knee[1]], [c2[0] + 14 * w, c2[1]], [ankle[0] + 10 * w, ankle[1] - 4], [ankle[0] - 12 * w, ankle[1] - 2], [c2[0] - 16 * w, c2[1]]], true, 0.4), fill: o.greave, depth: 10, mottle: 0.4, hatch: 70, spec: [`M${f(knee[0] - 6)} ${f(knee[1] + 10)} L${f(ankle[0] - 4)} ${f(ankle[1] - 10)}`], specOp: 0.45,
      after: `<path d="${blob(knee[0] - 2, knee[1] - 2, 15 * w, R, 8, 0.1)}" fill="${o.greave}" stroke="${INK}" stroke-width="1.2"/>` + a.rivet(knee[0] - 2, knee[1] - 2, 2) });
    if (o.wraps) a.raw(Array.from({ length: 6 }, (_, i) => { const p = [c1[0] + (ankle[0] - c1[0]) * i / 6, c1[1] + (ankle[1] - c1[1]) * i / 6]; return `<path d="M${f(p[0] - 15 * w)} ${f(p[1] - 3)} L${f(p[0] + 14 * w)} ${f(p[1] + 4)}" stroke="${INK}" stroke-width="1"/>`; }).join(''));
    A.foot(ankle, o.foot || 'boot', o.footFill || G.leatherD, w);
  };
  A.foot = (ank, kind, col, w = 1) => {
    const [x, y] = ank;
    if (kind === 'talon') { for (const t of [-1, 0, 1]) a.raw(`<path d="${curve([[x, y], [x - 16 + t * 12, y + 12], [x - 24 + t * 16, y + 22]])}" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="${curve([[x, y], [x - 16 + t * 12, y + 12], [x - 24 + t * 16, y + 22]])}" stroke="${G.bone}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`); return; }
    const bare = kind === 'bare', sab = kind === 'sabaton';
    const d = smooth([[x + 14 * w, y - 10], [x - 6 * w, y - 8], [x - 26 * w, y + 4], [x - 46 * w, y + 14], [x - 50 * w, y + 22], [x - 44 * w, y + 26], [x + 18 * w, y + 26], [x + 20 * w, y + 8]], true, 0.4);
    a.shape({ d, fill: col, depth: 7, mottle: 0.5, fine: true, hatch: 60, ink: 1.2,
      lines: bare ? [-40, -33, -26, -19].map(dx => `M${f(x + dx * w)} ${f(y + 18)} L${f(x + dx * w + 1)} ${f(y + 26)}`) : (sab ? [-30, -18, -6].map(dx => `M${f(x + dx * w)} ${f(y + 2)} L${f(x + dx * w - 4)} ${f(y + 24)}`) : [`M${f(x - 40 * w)} ${f(y + 20)} L${f(x + 16 * w)} ${f(y + 20)}`, `M${f(x - 4 * w)} ${f(y - 6)} L${f(x - 8 * w)} ${f(y + 18)}`]),
      spec: sab ? [`M${f(x - 30 * w)} ${f(y + 8)} L${f(x + 8)} ${f(y + 2)}`] : undefined, specOp: 0.4 });
  };

  // ---------------------------------------------------------------- armour pieces
  A.pauldron = (sh, col, w = 1, decals = '') => {
    for (let i = 2; i >= 0; i--) a.shape({ d: smooth([[sh[0] - 30 * w, sh[1] - 8 + i * 14], [sh[0] - 4, sh[1] - 26 + i * 14], [sh[0] + 30 * w, sh[1] - 12 + i * 14], [sh[0] + 34 * w, sh[1] + 10 + i * 14], [sh[0] - 28 * w, sh[1] + 14 + i * 12]], true, 0.6), fill: i ? dark(col, 0.08 * i) : col, depth: 10, mottle: 0.4, hatch: 70, ink: 1.2,
      spec: [`M${f(sh[0] - 22 * w)} ${f(sh[1] - 6 + i * 14)} Q${f(sh[0])} ${f(sh[1] - 20 + i * 14)} ${f(sh[0] + 26 * w)} ${f(sh[1] - 6 + i * 14)}`], specOp: 0.4, decals: i ? '' : decals, after: a.rivet(sh[0] + 20 * w, sh[1] - 6 + i * 14, 1.8) });
  };
  A.breastplate = (tor, col, w, decals = '') => {
    const T = tor.T;
    a.shape({ d: smooth([T(-40, 222), T(-6, 212), T(36, 226), T(44, 280), T(34, 344), T(-2, 360), T(-38, 344), T(-50, 300), T(-52, 256)], true, 0.5), fill: col, depth: 22, mottle: 0.4, hatch: 80,
      lines: [{ d: curve([T(-14, 216), T(-22, 280), T(-16, 350)]), w: 1.1 }], spec: [`M${f(T(-36, 250)[0])} ${f(T(-36, 250)[1])} C${f(T(-40, 290)[0])} ${f(T(-40, 290)[1])} ${f(T(-34, 320)[0])} ${f(T(-34, 320)[1])} ${f(T(-26, 340)[0])} ${f(T(-26, 340)[1])}`], specOp: 0.55,
      decals: a.stain(T(10, 300)[0], 300, 22, G.rust, 0.5) + decals, after: [T(-30, 236), T(26, 238), T(-26, 336), T(24, 334)].map(p => a.rivet(p[0], p[1], 2)).join('') });
    for (let i = 0; i < 3; i++) a.shape({ d: smooth([T(-40, 352 + i * 22), T(36, 348 + i * 22), T(38, 372 + i * 22), T(-42, 376 + i * 22)], true, 0.3), fill: dark(col, 0.06 * i), depth: 6, mottle: 0.4, hatch: 80, ink: 1.1, after: a.rivet(T(-30, 362 + i * 22)[0], 362 + i * 22, 1.6) });
  };
  A.gorget = (tor, col) => { const T = tor.T; a.shape({ d: smooth([T(-26, 198), T(20, 196), T(26, 216), T(-30, 222)], true, 0.4), fill: col, depth: 6, hatch: 80, ink: 1.2, spec: [`M${f(T(-20, 204)[0])} 204 L${f(T(16, 202)[0])} 202`], specOp: 0.5 }); };
  A.tassets = (tor, col, w) => { const T = tor.T; for (const [x0, x1] of [[-44, -6], [-4, 38]]) a.shape({ d: smooth([T(x0, 430), T(x1, 428), T(x1 + 4, 500), T(x0 - 4, 504)], true, 0.3), fill: col, depth: 10, mottle: 0.4, hatch: 70, lines: [`M${f(T(x0, 456)[0])} 456 L${f(T(x1, 454)[0])} 454`, `M${f(T(x0, 480)[0])} 480 L${f(T(x1, 478)[0])} 478`], after: a.rivet(T((x0 + x1) / 2, 440)[0], 440, 1.6) }); };

  A.util = { mix, dark, light, rot, curve, path };
  return A;
};
