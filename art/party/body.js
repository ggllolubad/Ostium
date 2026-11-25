// Anatomy builders on top of engine.js: spine/torso, heads with faces, hands, boots.
'use strict';
const E = require('./engine');
const { add, sub, mul, norm, lerp, rot, frame, ell, mix } = E;

// quadratic spine N(neck base) -> C(control) -> P(pelvis)
function spine(N, C, P, H) {
  const B = v => add(add(mul(N, (1 - v) ** 2), mul(C, 2 * v * (1 - v))), mul(P, v * v));
  const T = v => norm(add(mul(sub(C, N), 2 * (1 - v)), mul(sub(P, C), 2 * v)));
  const F = v => { const t = T(v); return [t[1], -t[0]]; }; // facing side
  const at = (u, v) => add(B(v), mul(F(v), u * H));
  // profile: [[v, back, front]] widths in head units
  const shape = prof => { const fr = prof.map(([v, , f]) => at(f, v)); const bk = prof.map(([v, b]) => at(-b, v)).reverse(); return [...fr, ...bk]; };
  return { B, T, F, at, shape, H };
}

// --- heads. local unit = head height, origin centre of head, facing right ---
function head(fig, c, H, ang, p = {}) {
  const F = frame(c, ang, H);
  const skin = p.skin || '#c9a07e', jaw = p.jaw ?? 1, chin = p.chin ?? 0, ink = fig.o.ink;
  const sock = mix(skin, '#2a1712', 0.6);
  // back hair / hood back
  if (p.hairBack) fig.part(F(p.hairBack), { fill: p.hairCol || '#2b2018', hatch: true });
  // face base
  const face = [[-0.30, -0.40], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355 + (p.browOut || 0), -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.32 + chin * 0.5, 0.37], [0.29 + chin, 0.47], [0.13 + chin * 0.5, 0.535 + chin * 0.2], [-0.06 - 0.08 * (jaw - 1), 0.47 + 0.04 * (jaw - 1)], [-0.21 - 0.1 * (jaw - 1), 0.27], [-0.30, 0.08], [-0.37, -0.13]];
  fig.part(F(face), { fill: skin, shade: 0.42, maxShade: H * (fig.o.mode === 'block' ? 0.24 : 0.4) * (p.faceShade ?? 1), tex: 'mottle' + fig.o.seed, texOp: 0.35, hatch: p.faceHatch });
  // under-jaw plane and jaw hinge shadow: gives the skull a floor so it does not read as a cut-out
  fig.flat(F([[-0.24, 0.22], [-0.05, 0.42], [0.14, 0.5], [0.26, 0.47], [0.1, 0.535], [-0.06, 0.48], [-0.21, 0.3]]), sock, { op: p.jawShade ?? 0.45 });
  // ear: narrow, behind the jaw hinge, a third of the head tall, with a helix and a shadowed bowl
  if (!p.noEar) {
    const ec = [-0.2, 0.04];
    fig.part(F([[ec[0] + 0.03, ec[1] - 0.12], [ec[0] - 0.04, ec[1] - 0.1], [ec[0] - 0.07, ec[1] - 0.02], [ec[0] - 0.05, ec[1] + 0.08], [ec[0] + 0.0, ec[1] + 0.14], [ec[0] + 0.05, ec[1] + 0.12], [ec[0] + 0.04, ec[1] + 0.02]]), { fill: mix(skin, '#9a4c3a', 0.18), shade: 0.5, inkW: 1, inkHeavy: 1.6, cast: false });
    fig.line(F([[ec[0] + 0.02, ec[1] - 0.07], [ec[0] - 0.03, ec[1] - 0.04], [ec[0] - 0.02, ec[1] + 0.04], [ec[0] + 0.02, ec[1] + 0.06]]), 1, mix(skin, '#000', 0.55), { op: 0.8 });
  }
  // cheekbone + temple planes (soft dark)
  fig.flat(F([[0.05, 0.02], [0.2, 0.06], [0.24, 0.2], [0.12, 0.26], [0.02, 0.15]]), sock, { op: 0.18 });
  fig.flat(F([[0.0, -0.3], [0.12, -0.22], [0.08, -0.12], [-0.04, -0.17]]), sock, { op: 0.12 });
  // eye sockets
  const sq = p.squint ?? 0.3;
  fig.flat(F(ell([0.11, -0.06], 0.105, 0.065, 0.05, 12)), sock, { op: 0.75 });
  fig.flat(F(ell([0.295, -0.065], 0.05, 0.055, 0, 10)), sock, { op: 0.7 });
  if (!p.blind) {
    const eh = 0.034 * (1 - sq);
    fig.flat(F([[0.06, -0.055], [0.11, -0.055 - eh], [0.165, -0.06], [0.11, -0.05 + eh * 0.6]]), p.eyeWhite || '#d9cdb4');
    fig.flat(F(ell([0.135, -0.056], 0.016, 0.017, 0, 8)), p.iris || '#1a120c');
    fig.flat(F([[0.272, -0.06], [0.295, -0.07 - eh * 0.6], [0.31, -0.063], [0.29, -0.055]]), p.eyeWhite || '#d9cdb4');
    if (p.glint) fig.flat(F(ell([0.13, -0.062], 0.006, 0.006, 0, 6)), '#fff');
    fig.line(F([[0.055, -0.058], [0.11, -0.065 - eh], [0.17, -0.062]]), 1.6, ink);
  }
  // brows
  const bd = p.browDown ?? 0.02;
  fig.stroke(F([[0.0, -0.13], [0.09, -0.15], [0.19, -0.13 + bd]]), H * (p.browW || 0.045), p.browCol || mix(p.hairCol || '#2b2018', '#000', 0.2));
  fig.stroke(F([[0.255, -0.135 + bd], [0.3, -0.15], [0.345, -0.14]]), H * (p.browW || 0.045) * 0.75, p.browCol || mix(p.hairCol || '#2b2018', '#000', 0.2));
  // nose
  const nz = p.nose ?? 1, hook = p.hook ?? 0;
  // nose: bridge, rounded bulb, nostril wing. no sharp triangle tip
  const tipX = 0.395 * nz + 0.02 * (1 - nz);
  const nose = [[0.30, -0.07], [0.335 + hook * 0.05, -0.01], [tipX - 0.02, 0.09], [tipX + 0.005, 0.12], [tipX - 0.01, 0.155], [0.35, 0.168], [0.31, 0.163], [0.27, 0.15], [0.255, 0.12], [0.27, 0.09], [0.29, 0.02]];
  fig.part(F(nose), { fill: mix(skin, '#a3553f', 0.18), shade: 0.5, inkW: 1.3, inkHeavy: 2.2, cast: false });
  fig.line(F([[0.262, 0.1], [0.248, 0.13], [0.27, 0.155]]), 1.2, ink, { op: 0.8 }); // nostril wing
  fig.line(F([[0.30, 0.15], [0.325, 0.158], [0.345, 0.152]]), 1.4, ink);
  // under-brow shadow across the eye line
  fig.flat(F([[0.0, -0.12], [0.2, -0.115], [0.3, -0.1], [0.34, -0.07], [0.2, -0.085], [0.04, -0.09]]), sock, { op: 0.45 });
  // mouth
  const mo = p.mouth || 'grim';
  const ml = { grim: [[0.17, 0.285], [0.24, 0.272], [0.31, 0.283]], smirk: [[0.17, 0.27], [0.24, 0.275], [0.31, 0.262], [0.325, 0.245]], snarl: [[0.17, 0.29], [0.24, 0.27], [0.32, 0.28]], set: [[0.17, 0.28], [0.31, 0.275]] }[mo] || [[0.17, 0.28], [0.31, 0.275]];
  if (p.lips) { fig.flat(F([[0.18, 0.29], [0.24, 0.282], [0.31, 0.288], [0.29, 0.318], [0.22, 0.322]]), mix(skin, '#8a3a2e', 0.45), { op: 0.8 }); fig.line(F([[0.21, 0.3], [0.27, 0.298]]), 0.9, mix(skin, '#fff', 0.4), { op: 0.6 }); }
  if (p.lashes) fig.line(F([[0.06, -0.06], [0.11, -0.072], [0.17, -0.066], [0.185, -0.075]]), 2.2, ink);
  if (mo === 'snarl') fig.flat(F([[0.18, 0.28], [0.25, 0.262], [0.31, 0.27], [0.29, 0.3], [0.22, 0.305]]), '#2a0d0a');
  fig.stroke(F(ml), H * 0.022, ink);
  fig.flat(F([[0.19, 0.3], [0.27, 0.297], [0.29, 0.33], [0.21, 0.335]]), mix(skin, '#6a2a22', 0.3), { op: 0.6 });
  // age and character lines
  fig.line(F([[0.265, 0.12], [0.22, 0.2], [0.19, 0.27]]), 1.2, ink, { op: 0.8 });
  if (p.age) {
    fig.line(F([[0.03, -0.2], [0.18, -0.22]]), 1, ink, { op: 0.5 });
    fig.line(F([[0.04, -0.245], [0.16, -0.26]]), 0.9, ink, { op: 0.45 });
    fig.line(F([[0.0, -0.02], [-0.03, 0.03]]), 1, ink, { op: 0.6 });
    fig.line(F([[0.01, 0.0], [-0.02, 0.06]]), 0.9, ink, { op: 0.5 });
    fig.line(F([[0.07, 0.0], [0.13, 0.02]]), 1, ink, { op: 0.6 });
  }
  if (p.gaunt) { fig.flat(F([[0.06, 0.1], [0.2, 0.17], [0.2, 0.3], [0.08, 0.32], [0.0, 0.2]]), sock, { op: 0.35 }); fig.line(F([[0.04, 0.1], [0.1, 0.25]]), 1, ink, { op: 0.6 }); }
  if (p.scar) {
    // raised pale welt with old stitch ticks, not a drawn line
    fig.line(F(p.scar), 2.6, mix(skin, '#ead2be', 0.45), { op: 0.85 });
    fig.line(F(p.scar), 0.9, mix(skin, '#5a2219', 0.6));
    for (let i = 1; i < 4; i++) { const t = i / 4, n = p.scar.length - 1, k = Math.min(n - 1, Math.floor(t * n)), u = t * n - k, q = E.lerp(p.scar[k], p.scar[k + 1], u); fig.line(F([[q[0] - 0.02, q[1] + 0.02], [q[0] + 0.02, q[1] - 0.02]]), 0.9, mix(skin, '#3a1a12', 0.6), { op: 0.8 }); }
  }
  // stubble / beard
  if (p.beard) {
    const bc = p.beardCol || p.hairCol || '#2b2018';
    if (p.beard === 'stubble') fig.flat(F([[0.0, 0.18], [0.16, 0.22], [0.3, 0.33], [0.3, 0.47], [0.13, 0.53], [-0.06, 0.46], [-0.18, 0.28]]), bc, { op: 0.35 });
    if (p.beard === 'short' || p.beard === 'full') {
      const fl = p.beard === 'full' ? 0.12 : 0;
      fig.part(F([[-0.17, 0.2], [0.0, 0.25], [0.16, 0.31], [0.21, 0.32], [0.33, 0.34], [0.34 + chin, 0.48 + fl], [0.2, 0.6 + fl * 1.5], [0.02, 0.56 + fl], [-0.12, 0.42], [-0.2, 0.3]]), { fill: bc, shade: 0.4, tex: 'hatch' + fig.o.seed, texOp: 0.3 });
    }
    if (p.moustache || p.beard === 'short' || p.beard === 'full') fig.part(F([[0.17, 0.23], [0.25, 0.205], [0.33, 0.215], [0.35, 0.25], [0.31, 0.26], [0.24, 0.255], [0.17, 0.285], [0.14, 0.27]]), { fill: mix(p.beardCol || p.hairCol || '#2b2018', '#000', 0.1), shade: 0.4, inkW: 1 });
  }
  if (p.hair) fig.part(F(p.hair), { fill: p.hairCol || '#2b2018', shade: 0.4, tex: 'hatch' + fig.o.seed, texOp: 0.25 });
  if (p.hairLines) for (const l of p.hairLines) fig.line(F(l), 1, mix(p.hairCol || '#2b2018', '#d8c4a0', 0.35), { op: 0.7 });
  return F;
}

// --- hands ---
// fist gripping something that passes through it along local y; dir = angle of the forearm
// o.plate: gauntlet knuckle plate + finger lames. o.cuff: flared gauntlet cuff toward local -x. o.thumb:false hides the thumb.
// ang: local +x (knuckles, fingers) points along ang, so the back of the hand and the cuff point back along ang + PI,
// which must face the elbow. The thumb sits on local -y, i.e. at screen angle ang - PI/2. o.flip mirrors the hand so the
// thumb sits at ang + PI/2 instead. Never turn the fist round by PI to move the thumb: that points the knuckles back
// into the forearm (the Drowned Thrall error). Prefer grip() below, which works the angle out from the elbow.
function fist(fig, c, ang, s, col, o = {}) {
  s *= o.scale ?? 1.18;
  const F0 = frame(c, ang, s), F = o.flip ? pts => F0(pts.map(p => p.length > 2 ? [p[0], -p[1], p[2]] : [p[0], -p[1]])) : F0;
  const g = col, ink = fig.o.ink, dk = mix(g, '#000', 0.45), lt = mix(g, '#fff', 0.35);
  if (o.cuff) fig.part(F([[-0.55, -0.62], [-1.05, -0.86], [-1.32, -0.3], [-1.3, 0.35], [-1.02, 0.84], [-0.55, 0.6]]), { fill: mix(g, '#000', 0.12), shade: 0.45, tex: o.tex, texOp: o.texOp, shadow: o.shadow });
  // back of the hand: a squared block, wider at the knuckles
  fig.part(F([[-0.7, -0.5], [-0.25, -0.64], [0.32, -0.62], [0.42, -0.2], [0.44, 0.3], [0.3, 0.6], [-0.25, 0.62], [-0.68, 0.46], [-0.8, 0.0]]), { fill: g, shade: 0.4, tex: o.tex, texOp: o.texOp, k: 0.8, shadow: o.shadow });
  // four curled fingers stacked along the grip, index biggest, little finger tucked
  const fy = [[-0.6, 0.31, 0.78], [-0.3, 0.3, 0.8], [0.0, 0.29, 0.76], [0.28, 0.27, 0.66]];
  for (let i = 3; i >= 0; i--) {
    const [y0, hh, x1] = fy[i];
    fig.part(F([[0.22, y0 + 0.02], [x1 - 0.1, y0 - 0.01], [x1 + 0.02, y0 + 0.07], [x1 + 0.04, y0 + hh * 0.6], [x1 - 0.06, y0 + hh + 0.01], [0.22, y0 + hh]]), { fill: g, shade: 0.5, inkW: 1, inkHeavy: 1.6, k: 0.8, cast: false, tex: o.tex, texOp: o.texOp, shadow: o.shadow });
    fig.flat(F([[x1 - 0.3, y0 + hh - 0.05], [x1 - 0.04, y0 + hh - 0.05], [x1 - 0.06, y0 + hh + 0.01], [x1 - 0.3, y0 + hh + 0.01]]), dk, { op: 0.6 });
    fig.flat(F(ell([x1 - 0.12, y0 + 0.08], 0.07, 0.04, 0, 6)), lt, { op: 0.55 });
    if (o.plate) fig.line(F([[x1 - 0.32, y0 + 0.02], [x1 - 0.3, y0 + hh - 0.02]]), 1, ink, { op: 0.7 });
  }
  if (o.plate) {
    fig.part(F([[-0.1, -0.62], [0.3, -0.64], [0.36, 0.0], [0.32, 0.6], [-0.08, 0.58], [-0.02, 0.0]]), { fill: mix(g, '#fff', 0.08), shade: 0.45, inkW: 1.1, inkHeavy: 1.8, cast: false });
    fig.rivet(F([[0.13, -0.3]])[0], Math.max(1.6, s * 0.07)); fig.rivet(F([[0.15, 0.3]])[0], Math.max(1.6, s * 0.07));
    fig.line(F([[-0.4, -0.5], [-0.42, 0.45]]), 1.1, ink, { op: 0.6 });
  } else {
    // tendons and a vein on the back of the hand
    fig.line(F([[-0.55, -0.25], [0.1, -0.35]]), 0.9, dk, { op: 0.6 });
    fig.line(F([[-0.55, 0.1], [0.12, 0.05]]), 0.9, dk, { op: 0.5 });
  }
  // thumb wrapping over the index finger
  if (o.thumb !== false) fig.part(F([[-0.45, -0.52], [-0.05, -0.82], [0.4, -0.84], [0.62, -0.7], [0.5, -0.55], [0.12, -0.5], [-0.3, -0.34]]), { fill: g, shade: 0.5, inkW: 1.1, inkHeavy: 1.8, cast: false, tex: o.tex, texOp: o.texOp, shadow: o.shadow });
  return F;
}

// A fist on a straight object, with its angle worked out from the arm instead of typed in.
// c: fist centre (on the object). elbow: the point the forearm comes from. thumbAng: screen angle of the object's end that
// leaves the fist on the thumb side (a haft's head, a forward blade's point, a pin's head in a stabbing grip, up for a
// hanging chain or flask neck).
// Default ('across', poles, hafts, chains, necks): the object runs along the knuckle row, the back of the hand faces the
// elbow, and the thumb side is chosen by mirroring the hand, never by turning it round. If the forearm meets the object
// more than o.maxBend (default 35 deg) off square, the hand turns only maxBend toward the object and a warning is printed:
// the arm, not the hand, needs moving.
// o.inline (sword grips, tongs): the object continues the line of the forearm through the palm; the fist follows the
// forearm (plus o.bend) and the thumb goes on the side nearer thumbAng.
// gripAngle() does the arithmetic without drawing, so an object can be drawn along `axis` before the fist covers it.
// axis: screen angle of the knuckle row toward the thumb end (the object's line through the fist).
function gripAngle(c, elbow, thumbAng, o = {}) {
  const wrap = a => Math.atan2(Math.sin(a), Math.cos(a)), D = 180 / Math.PI;
  const fa = Math.atan2(c[1] - elbow[1], c[0] - elbow[0]);
  let ang, flip, off = 0;
  if (o.inline) {
    ang = fa + (o.bend || 0);
    flip = Math.abs(wrap(ang + Math.PI / 2 - thumbAng)) < Math.abs(wrap(ang - Math.PI / 2 - thumbAng));
  } else {
    const a1 = thumbAng + Math.PI / 2, a2 = thumbAng - Math.PI / 2, d1 = wrap(a1 - fa), d2 = wrap(a2 - fa);
    flip = Math.abs(d2) < Math.abs(d1);
    const dev = flip ? d2 : d1, mb = (o.maxBend ?? 35) / D;
    ang = fa + Math.max(-mb, Math.min(mb, dev));
    off = Math.abs(dev) - mb;
    if (off > 15 / D && !o.quiet) console.warn(`grip ${o.name || ''}: forearm meets the object ${Math.round(Math.abs(dev) * D)} deg off square; move the elbow`);
  }
  return { ang, flip, off, axis: flip ? ang + Math.PI / 2 : ang - Math.PI / 2 };
}
function grip(fig, c, elbow, thumbAng, s, col, o = {}) {
  const g = gripAngle(c, elbow, thumbAng, o);
  g.F = fist(fig, c, g.ang, s, col, Object.assign({}, o, { flip: g.flip }));
  return g;
}
// open hand, palm facing viewer-ish, fingers along local +x. spread in radians, curl 0..1
function hand(fig, c, ang, s, col, o = {}) {
  s *= o.scale ?? 1.2;
  const F = frame(c, ang, s), spread = o.spread ?? 0.35, curl = o.curl ?? 0.2, ink = fig.o.ink;
  const tips = [];
  const fingers = [[-0.34, 0.8], [-0.11, 0.9], [0.12, 0.84], [0.33, 0.66]];
  const fo = { shadow: o.shadow, shade: 0.5, inkW: 1.1, inkHeavy: 1.8, cast: false, k: 0.9 };
  // fingers: three joints each, knuckle bumps, thick enough to read at game size
  fingers.forEach(([y, l], i) => {
    const a = (i - 1.5) * spread * 0.5, base = [0.42, y];
    const k1 = add(base, rot([l * 0.48, 0], a)), k2 = add(k1, rot([l * 0.3, 0], a + curl * 0.9)), k3 = add(k2, rot([l * 0.24, 0], a + curl * 1.7));
    const fc = o.fingerCols ? o.fingerCols[i] : col, tc = o.tipCols ? o.tipCols[i] : fc;
    fig.part(F(E.limb(base, k1, 0.29, 0.25, { steps: 4, p: [[0.0, 0.12, 0.2]] })), Object.assign({ fill: fc }, fo));
    fig.part(F(E.limb(k1, k2, 0.25, 0.22, { steps: 4 })), Object.assign({ fill: fc }, fo));
    fig.part(F(E.limb(k2, k3, 0.22, 0.18, { steps: 4 })), Object.assign({ fill: tc }, fo));
    fig.line(F([[k1[0] - 0.02, k1[1] - 0.1], [k1[0] + 0.02, k1[1] + 0.1]]), 0.8, ink, { op: 0.5 });
    tips.push(k3);
  });
  fig.part(F([[-0.55, -0.48], [0.0, -0.56], [0.48, -0.46], [0.6, 0.0], [0.52, 0.48], [0.0, 0.54], [-0.55, 0.44], [-0.66, 0.0]]), { fill: col, shade: 0.42, k: 0.9, shadow: o.shadow });
  // knuckle ridge
  fig.line(F([[0.42, -0.42], [0.5, -0.12], [0.5, 0.15], [0.42, 0.42]]), 1, mix(col, '#000', 0.45), { op: 0.6 });
  // thumb: fat base (thenar), two segments
  const tb = [-0.05, -0.42], tk = add(tb, rot([0.48, 0], -1.0 - spread * 0.4)), tt = add(tk, rot([0.36, 0], -0.5 - spread * 0.3 + curl));
  fig.part(F(E.limb(tb, tk, 0.4, 0.27, { steps: 4 })), { fill: col, shade: 0.5, inkW: 1.1, inkHeavy: 1.8, cast: false, shadow: o.shadow });
  fig.part(F(E.limb(tk, tt, 0.27, 0.2, { steps: 4 })), { fill: o.thumbTip || col, shade: 0.5, inkW: 1.1, inkHeavy: 1.8, cast: false, shadow: o.shadow });
  fig.line(F([[-0.2, 0.05], [0.25, 0.15]]), 0.9, ink, { op: 0.5 });
  fig.line(F([[-0.25, -0.15], [0.2, -0.2]]), 0.9, ink, { op: 0.5 });
  return { F, tips: tips.map(t => F([t])[0]) };
}

// --- boots. ankle point, toe direction (+1 right / -1 left), size s (~ head units) ---
// o.knee: [x,y] builds the shaft up to the knee in one shape (tall boot); o.kneeW its width there.
// o.cuff: flared cavalier bucket top at the knee. o.style: 'boot' | 'sabaton' | 'shoe'. o.strap: buckle strap over the instep.
function boot(fig, ankle, dir, s, col, o = {}) {
  const gy = o.groundY ?? fig.o.groundY, ink = fig.o.ink, style = o.style || 'boot';
  const ax = ankle[0], ay = ankle[1], h = Math.max(10, gy - ay);
  const X = u => ax + dir * u * s, toe = o.toe ?? 1.25, heel = 0.42, soleT = Math.max(4, s * 0.11);
  const dark = mix(col, '#000', 0.35), lite = mix(col, '#fff', 0.25);
  let top;
  if (o.knee) {
    const kw = (o.kneeW ?? s * 0.8) / 2, kx = o.knee[0], ky = o.knee[1];
    const bt = [kx - dir * kw, ky + s * 0.05], ft = [kx + dir * kw * 0.95, ky - s * 0.04];
    const calf = add(lerp(bt, [X(-0.34), ay], 0.32), [-dir * s * 0.12, 0]);
    top = { back: [bt, calf], front: [ft, add(lerp(ft, [X(0.34), ay], 0.5), [dir * s * 0.02, 0])] };
  } else {
    const st = o.shaft ?? 0.9;
    top = { back: [[X(-0.36), ay - s * st]], front: [[X(0.31), ay - s * st]] };
  }
  const tipY = style === 'sabaton' ? gy - h * 0.22 : gy - soleT - h * 0.12;
  const P = [
    ...top.front,
    [X(0.34), ay - s * 0.08], [X(0.48), ay + h * 0.18], [X(toe * 0.68), gy - h * 0.56], [X(toe * 0.93), gy - h * 0.38],
    [X(toe * (style === 'sabaton' ? 1.14 : 1.07)), tipY], [X(toe * 1.04), gy - soleT, 1],
    [X(-heel), gy - soleT, 1], [X(-heel * 1.06), gy - h * 0.42], [X(-0.33), ay + h * 0.02], ...top.back.slice().reverse(),
  ];
  // order the polygon consistently (front top first, then back)
  fig.part(P, { fill: col, shade: 0.42, tex: o.tex, texOp: o.texOp ?? 0.4, k: 0.85 });
  // sole with raised arch and stacked heel block
  const sole = [[X(toe * 1.05), gy - soleT - 1], [X(toe * 1.07), gy - 1.5], [X(toe * 0.9), gy, 1], [X(0.3), gy, 1], [X(0.22), gy - soleT * 0.55], [X(0.12), gy - soleT * 0.55], [X(0.1), gy - soleT, 1]];
  fig.part(sole, { fill: mix(col, '#1a120b', 0.6), shade: 0.3, inkW: 1.1, inkHeavy: 1.6, cast: false });
  fig.part([[X(0.12), gy - soleT, 1], [X(0.12), gy, 1], [X(-heel * 1.02), gy, 1], [X(-heel * 1.07), gy - soleT * 1.5, 1], [X(-heel), gy - soleT, 1]], { fill: mix(col, '#1a120b', 0.7), shade: 0.3, inkW: 1.1, inkHeavy: 1.6, cast: false });
  fig.line([[X(0.0), gy - soleT * 0.5], [X(-heel * 0.95), gy - soleT * 0.6]], 0.9, mix(col, '#fff', 0.1), { op: 0.5, straight: true });
  if (style === 'sabaton') {
    // overlapping lames over the instep, toe cap, rivets
    for (let i = 0; i < 4; i++) {
      const u = 0.32 + i * 0.2 * toe;
      const a = [X(u), ay + h * (0.05 + i * 0.16)], b = [X(u + 0.1), gy - soleT - 1];
      fig.line([a, lerp(a, b, 0.5).map((v, j) => j === 0 ? v + dir * 2 : v), b], 1.6, ink, { op: 0.9 });
      fig.line([add(a, [-dir * 2, 1]), add(b, [-dir * 2, 0])], 1, lite, { op: 0.45, straight: true });
      fig.rivet(lerp(a, b, 0.55), Math.max(1.6, s * 0.035));
    }
    fig.line([[X(-0.1), ay + h * 0.1], [X(-0.2), gy - soleT - 2]], 1.2, ink, { op: 0.7 });
  } else {
    // toe cap seam, welt stitching, ankle creases, worn-bright toe
    fig.line([[X(toe * 0.72), gy - h * 0.52], [X(toe * 0.92), gy - h * 0.38], [X(toe * 1.02), gy - h * 0.2]], 1.6, lite, { op: 0.55 });
    fig.line([[X(toe * 0.62), gy - soleT - 1], [X(toe * 0.66), gy - h * 0.38], [X(toe * 0.76), gy - h * 0.6]], 1.1, ink, { op: 0.65 });
    fig.line([[X(toe * 1.0), gy - soleT - 2.5], [X(-heel * 0.9), gy - soleT - 2.5]], 0.9, lite, { op: 0.45, dash: '2 2.5' });
    fig.line([[X(0.33), ay - s * 0.02], [X(0.15), ay + h * 0.12], [X(0.02), ay + h * 0.05]], 1.1, ink, { op: 0.6 });
    fig.line([[X(0.35), ay + h * 0.12], [X(0.2), ay + h * 0.26]], 1, ink, { op: 0.5 });
    fig.flat([[X(-0.3), ay + h * 0.1], [X(-0.18), ay + h * 0.3], [X(-0.3), ay + h * 0.5], [X(-0.4), ay + h * 0.4]].map(q => q), dark, { op: 0.35 });
  }
  if (o.strap) {
    const a = [X(-0.36), ay - s * 0.02], b = [X(0.36), ay - s * 0.12];
    fig.part([add(a, [0, -3]), add(b, [0, -3]), add(b, [0, 4]), add(a, [0, 4])], { fill: mix(col, '#000', 0.3), shade: 0.3, inkW: 1, inkHeavy: 1.4, sharp: true, cast: false });
    const bk = lerp(a, b, 0.62);
    fig.part([add(bk, [-4, -5]), add(bk, [4, -5]), add(bk, [4, 6]), add(bk, [-4, 6])], { fill: '#7c6a48', shade: 0.3, inkW: 1, inkHeavy: 1.2, sharp: true, cast: false });
    fig.line([add(bk, [dir * 4, 1]), add(bk, [dir * 12, 4])], 2, mix(col, '#000', 0.3));
  }
  if (o.knee && o.cuff) {
    // cavalier bucket top: high over the front of the knee, cut low at the back, flared
    const kw = (o.kneeW ?? s * 0.8) / 2, k = o.knee, cs = s * (o.cuffS ?? 1);
    const C = [[k[0] - dir * (kw + cs * 0.05), k[1] + cs * 0.32], [k[0] - dir * (kw + cs * 0.2), k[1] - cs * 0.02],
      [k[0] - dir * kw * 0.3, k[1] - cs * 0.14], [k[0] + dir * kw * 0.5, k[1] - cs * 0.38, 1], [k[0] + dir * (kw + cs * 0.2), k[1] - cs * 0.3],
      [k[0] + dir * (kw + cs * 0.06), k[1] + cs * 0.18], [k[0] + dir * kw * 0.2, k[1] + cs * 0.26], [k[0] - dir * kw * 0.4, k[1] + cs * 0.36]];
    fig.part(C, { fill: mix(col, '#3a2a1c', 0.25), shade: 0.45, tex: o.tex, texOp: 0.4, k: 0.8 });
    fig.flat([[k[0] - dir * kw * 0.2, k[1] - cs * 0.1], [k[0] + dir * kw * 0.5, k[1] - cs * 0.3], [k[0] + dir * (kw + cs * 0.1), k[1] - cs * 0.22], [k[0] + dir * kw * 0.4, k[1] - cs * 0.08]], dark, { op: 0.55 });
    fig.stroke([[k[0] - dir * kw * 0.6, k[1] + cs * 0.3], [k[0] - dir * kw * 0.2, k[1] + cs * 0.05], [k[0], k[1] - cs * 0.08]], 2);
    fig.stroke([[k[0] + dir * kw * 0.5, k[1] + cs * 0.22], [k[0] + dir * kw * 0.7, k[1] + cs * 0.0], [k[0] + dir * kw * 0.9, k[1] - cs * 0.12]], 1.8);
  } else if (o.cuff) {
    const st = o.shaft ?? 0.9;
    fig.part([[X(-0.42), ay - s * st - s * 0.12], [X(0.4), ay - s * st - s * 0.22, 1], [X(0.38), ay - s * st + s * 0.14], [X(-0.4), ay - s * st + s * 0.2]], { fill: mix(col, '#000', 0.15), shade: 0.4, k: 0.7 });
  }
}

// --- bare foot, side-on. ankle point, dir +1 toes right, s ~ foot length in px. ---
// heel, Achilles, ankle bone, arch lifted off the ground, ball of the foot, splayed toes with nails.
// o.swell (0..1) puffs the instep and ankle; o.shadow: explicit shadow colour (skin should not go blue-metal).
function bareFoot(fig, ankle, dir, s, col, o = {}) {
  const gy = o.groundY ?? fig.o.groundY, ink = fig.o.ink, sw = o.swell ?? 0;
  const ax = ankle[0], ay = ankle[1], h = Math.max(14, gy - ay);
  const X = u => ax + dir * u * s, dk = mix(col, '#2a1c22', 0.45), lt = mix(col, '#fff', 0.3);
  const sk = { fill: col, shade: 0.34, tex: o.tex, texOp: o.texOp ?? 0.45, shadow: o.shadow };
  const P = [
    [X(0.22), ay - 4], [X(0.36 + sw * 0.06), ay + h * 0.28], [X(0.62 + sw * 0.04), gy - h * (0.5 + sw * 0.08)], [X(0.92), gy - h * 0.34],
    [X(1.08), gy - h * 0.3], [X(1.2), gy - h * 0.2], [X(1.24), gy - h * 0.07], [X(1.16), gy, 1],
    [X(0.86), gy - 1], [X(0.62), gy - h * 0.1], [X(0.36), gy - h * 0.07], [X(0.06), gy, 1],
    [X(-0.2), gy - 1], [X(-0.33), gy - h * 0.18], [X(-0.33 - sw * 0.04), gy - h * 0.48], [X(-0.24 - sw * 0.06), ay + h * 0.12], [X(-0.2 - sw * 0.04), ay - 4],
  ];
  fig.part(P, Object.assign({}, sk, { k: 0.9 }));
  // smaller toes: rounded pads tucked under and behind the big toe, each with its own ink so they read as toes
  for (let i = 3; i >= 1; i--) { const tx = 1.13 - i * 0.075, ty = gy - h * 0.09; fig.part(E.ell([X(tx), ty], s * 0.065, h * 0.1, 0, 10), Object.assign({}, sk, { inkW: 1, inkHeavy: 1.3, cast: false, shade: 0.45, fill: mix(col, '#3a2a30', 0.1 + i * 0.05) })); }
  // ankle bone, Achilles hollow, instep tendons and creases
  fig.part(E.ell([X(-0.02), ay + h * 0.32], s * 0.1 * (1 + sw * 0.4), h * 0.13, 0, 10), Object.assign({}, sk, { inkW: 0, cast: false, shade: 0.5, fill: mix(col, '#fff', 0.08) }));
  fig.line([[X(-0.02 - 0.1), ay + h * 0.45], [X(-0.02), ay + h * 0.48], [X(0.08), ay + h * 0.4]], 1, ink, { op: 0.45 });
  fig.line([[X(-0.22), ay + h * 0.05], [X(-0.24), gy - h * 0.4]], 1, dk, { op: 0.6 });
  fig.line([[X(0.34), ay + h * 0.32], [X(0.56), gy - h * 0.48], [X(0.82), gy - h * 0.36]], 1, lt, { op: 0.6 });
  fig.line([[X(0.28), ay + h * 0.2], [X(0.36), ay + h * 0.12]], 1, ink, { op: 0.5 });
  // big toe: knuckle, nail, crease under it
  fig.part([[X(0.98), gy - h * 0.33], [X(1.12), gy - h * 0.29], [X(1.22), gy - h * 0.18], [X(1.23), gy - h * 0.08], [X(1.12), gy - h * 0.06], [X(1.02), gy - h * 0.14]], Object.assign({}, sk, { inkW: 1.1, inkHeavy: 1.5, cast: false, shade: 0.4 }));
  fig.flat([[X(1.12), gy - h * 0.25], [X(1.2), gy - h * 0.18], [X(1.21), gy - h * 0.11], [X(1.13), gy - h * 0.15]], o.nail || mix(col, '#e8dcc8', 0.5), { op: 0.9 });
  fig.line([[X(0.9), gy - 2], [X(1.0), gy - h * 0.12]], 1, ink, { op: 0.6 });
  // sole edge darker where it meets the ground, heel pad
  fig.line([[X(-0.18), gy - 2], [X(0.08), gy - 2]], 1.6, dk, { op: 0.6, straight: true });
  if (sw > 0) for (let i = 0; i < 3; i++) fig.line([[X(0.42 + i * 0.12), gy - h * (0.42 - i * 0.04)], [X(0.46 + i * 0.12), gy - h * (0.3 - i * 0.04)]], 0.9, ink, { op: 0.45 }); // water-puckered skin
}

module.exports = { spine, head, fist, grip, gripAngle, hand, boot, bareFoot };
