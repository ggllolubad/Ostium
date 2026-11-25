// World XII, The White Silence, second batch ("b"): local helpers. Requires the first batch's kit (kit_XII) and
// re-exports it unchanged, so this batch matches the first (palette, fx(): rime, icicles, hanks, fringes, void holes,
// snow ground). New helpers here only; the first batch's files are never edited.
//
// New in this batch:
//  - mirrorDraw(): draw something facing left (the far Singer) by building it facing right and mirroring it, with the
//    key light mirrored while it is drawn, so after the flip it is still lit from the same side as everything else.
//  - forkHanks(): fur in forked hanks at uneven heights (the White Bear's reviewed fringe, rebuilt on kit_XII's hank()):
//    a root that parts into two or three locks of different length, never a row of cones.
//  - face(): B.head in cold skin with the warm tints laid back over, plus modelled age (creases with lit lips), frost on
//    brows and lashes, tattoo lines, an open mouth (shout, cry, song: a void or a dark mouth), a cold ear.
//  - braid(), hairMass(): hair in plaits and clumped hanks, never stripes.
//  - furBoot(), clumpEdge(): copied from world_XII.js (they are local there).
//  - beadBand(), cord(), bead strings and the small offerings.
//  - dogPaw(): a weight-bearing paw (heel pad, knuckled toes, claws), from the Plague Wolf's habits.
'use strict';
const X12 = require('./kit_XII');
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, lp, frame } = E;
const { PAL, spline, arcLen, clipDraw, crease, ribbon, tube, softTone } = X12;

// ---- draw facing left: build with draw() as if facing right, then mirror about x = cx. The light is mirrored while
// drawing so the shading lands on the correct side after the flip; joints declared inside are mirrored too.
function mirrorDraw(f, cx, draw) {
  const L0 = f.L; f.L = [-L0[0], L0[1]];
  const before = JSON.stringify(f.joints), i0 = f.out.length;
  const res = draw();
  f.L = L0;
  for (let i = i0; i < f.out.length; i++) f.out[i] = `<g transform="translate(${(2 * cx).toFixed(1)},0) scale(-1,1)">${f.out[i]}</g>`;
  const old = JSON.parse(before);
  for (const [k, j] of Object.entries(f.joints)) if (!old[k] || old[k].pivot[0] !== j.pivot[0] || old[k].pivot[1] !== j.pivot[1]) j.pivot = [Math.round((2 * cx - j.pivot[0]) * 10) / 10, j.pivot[1]];
  return res;
}
const mx = (cx, p) => [2 * cx - p[0], p[1]];

// ---- fur in forked hanks at uneven heights: each tag is a root that parts into 2-3 locks of different length, the
// locks fanning a little apart; short tags behind, long ones in front; roots jittered up and down so it never reads as a row
function forkHanks(f, X, pts, n, l0, l1, w0, w1, x = {}) {
  const R = () => f.r(), C = spline(pts, 3), S = arcLen(C), Lt = S[S.length - 1];
  const at = u => { let i = S.findIndex(v => v >= u); if (i < 0) i = C.length - 1; return C[i]; };
  const tags = [];
  for (let k = 0; k < n; k++) {
    const u = (k + 0.5 + (R() - 0.5) * 0.7) / n * Lt, w = w0 + (w1 - w0) * R(), len = (l0 + (l1 - l0) * Math.pow(R(), 0.8)) * (x.taper ? x.taper(k / Math.max(1, n - 1)) : 1);
    tags.push([add(at(u), [0, (R() - 0.35) * w * (x.jit ?? 1.2) - (x.lift ?? 6)]), len, w]);
  }
  tags.sort((a, b) => a[1] - b[1]);
  const tips = [];
  for (const [p, len, w] of tags) {
    const nl = w > (x.split ?? 20) ? 2 + (R() < 0.55 ? 1 : 0) : 2, main = Math.floor(R() * nl), tone = Math.min(0.6, (x.tone ?? 0) + R() * 0.14);
    const order = [...Array(nl).keys()].sort(() => R() - 0.5);
    for (const j of order) {
      const u = nl > 1 ? j / (nl - 1) - 0.5 : 0, lw = w * (nl === 3 ? 0.5 : 0.62) * (0.85 + R() * 0.3), ll = len * (j === main ? 1 : 0.5 + R() * 0.35);
      const root = add(p, [u * w * 0.42, R() * w * 0.25]);
      tips.push(X.hank(root, ll, lw, { fill: mix(x.fill || PAL.fur, PAL.furS, tone), sway: u * w * (0.5 + R() * 0.5) + (R() - 0.5) * lw * 0.5, ice: x.ice ?? 0.3, tex: x.tex, grime: x.grime, fade: x.fade }));
    }
  }
  return tips;
}

// ---- a knee-high leg-skin boot, fur out (copied from world_XII.js): Kn knee, A ankle, s foot unit; toes to +x
function clumpEdge(f, pts, n, amp) {
  const C = spline(pts, 3), S = arcLen(C), L = S[S.length - 1], out = [];
  for (let i = 0; i <= n * 2; i++) { const u = i / (n * 2) * L; let k = S.findIndex(v => v >= u); if (k < 0) k = C.length - 1; out.push(add(C[k], [0, i % 2 ? amp * (0.6 + f.r() * 0.8) : -amp * 0.2])); }
  return out;
}
function furBoot(f, X, Kn, A, s, tone, furTex, o = {}) {
  const gy = o.gy ?? f.o.groundY, col = mix(PAL.fur, PAL.furS, tone + 0.05), xx = u => A[0] + u * s, k = s / 56;
  const top = lerp(Kn, A, 0.08), d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], hw = (o.w ?? 27) * k;
  const shaft = [add(top, mul(n, -hw)), add(lerp(top, A, 0.5), mul(n, -hw)), [xx(-0.42), A[1] + 4 * k], [xx(-0.46), gy - 18 * k], [xx(-0.4), gy - 5 * k, 1], [xx(1.05), gy - 5 * k, 1], [xx(1.22), gy - 14 * k], [xx(1.16), gy - 30 * k], [xx(0.86), gy - 44 * k], [xx(0.4), A[1] + 4 * k], add(lerp(top, A, 0.6), mul(n, hw * 0.93)), add(top, mul(n, hw * 1.04))];
  const FURL = { fill: col, shadow: PAL.furS, light: PAL.furL, shade: 0.36, tex: furTex, texOp: 0.22 };
  f.part(shaft, FURL);
  clipDraw(f, shaft, () => {
    for (let i = 0; i < 14; i++) { const p = add(lerp(top, A, f.r() * 0.9), mul(n, (f.r() - 0.5) * hw * 1.5)); f.stroke([p, add(p, [k, (12 + f.r() * 10) * k])], 3 * k, PAL.furD, { op: 0.45 }); }
    if (o.beads !== false) {
      const s0 = add(top, mul(n, 6 * k)), s1 = add(A, mul(n, 4 * k));
      f.stroke([s0, lerp(s0, s1, 0.5), s1], 9 * k, '#2e3034'); for (let i = 0; i < 6; i++) f.flat(ell(lerp(s0, s1, (i + 0.5) / 6), 1.8 * k, 1.8 * k, 0, 6), '#f2f2f0');
      f.stroke([[xx(0.55), gy - 30 * k], [xx(0.8), gy - 34 * k], [xx(1.05), gy - 26 * k]], 7 * k, '#2e3034'); for (let i = 0; i < 3; i++) f.flat(ell([xx(0.65 + i * 0.17), gy - 31 * k], 1.6 * k, 1.6 * k, 0, 6), '#f2f2f0');
    }
    for (let i = 0; i < 3; i++) f.stroke([add(A, mul([-24 + i * 4, -18 + i * 10], k)), add(A, mul([0, -12 + i * 10], k)), add(A, mul([20 - i * 2, -16 + i * 10], k))], 2.2 * k, PAL.furD, { op: 0.6 });
    f.flat([[xx(-0.5), gy - 9 * k], [xx(1.3), gy - 9 * k], [xx(1.3), gy + 2], [xx(-0.5), gy + 2]], '#3a3c40', { op: 0.9 });
  });
  f.line([[xx(-0.4), gy - 9 * k], [xx(1.12), gy - 10 * k]], 0.9, '#d8dadc', { op: 0.6, dash: '2 2.5' });
  if (o.thong !== false) {
    const t0 = add(A, mul(n, -hw * 0.9)), t1 = add(A, mul(n, hw * 0.82));
    f.stroke([t0, lerp(t0, t1, 0.5), t1], 4 * k, PAL.greyD);
    f.line([add(t1, [-2, 2]), add(t1, [4 * k, 16 * k]), add(t1, [2 * k, 26 * k])], 2, PAL.greyD); f.line([add(t1, [0, 2]), add(t1, [10 * k, 12 * k])], 2, PAL.greyD);
  }
  if (o.tufts !== false) X.locks([add(top, mul(n, -hw * 1.04)), add(top, mul(n, hw * 1.04))], 4, 12 * k, 20 * k, 12 * k, { cast: false, fill: col });
  X.rime([lp(Kn, A, 0.3, hw), lp(Kn, A, 0.8, hw * 0.9), [xx(0.5), A[1] + 10 * k], [xx(1.0), gy - 40 * k]], 6 * k, -1);
  return shaft;
}

// ---- a beaded band (white and black beads on dark hide) along a polyline, w wide
function beadBand(f, pts, w, o = {}) {
  const C = spline(pts, 3), S = arcLen(C), Lt = S[S.length - 1], n = Math.max(2, Math.round(Lt / (o.step ?? w * 0.55)));
  f.stroke(C, w * 1.15, o.ground || '#2a2c30', { op: 0.95 }); f.line(C, w * 0.9, o.ground || '#2a2c30');
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n * Lt; let k = S.findIndex(v => v >= u); if (k < 0) k = C.length - 1;
    const c = C[k], white = o.pattern ? o.pattern(i) : (i % 3 !== 1);
    f.flat(ell(c, w * 0.26, w * 0.26, 0, 8), white ? '#f2f2f0' : '#0e0e10');
    if (white) f.flat(ell(add(c, [w * 0.06, w * 0.07]), w * 0.12, w * 0.08, 0, 6), PAL.iceS, { op: 0.6 });
  }
}
// a cord of sinew between points, hanging plumb in the middle (sag) or straight, ink edged
function cord(f, pts, w = 1.6, col = PAL.greyD, o = {}) { const C = o.straight ? pts : spline(pts, 4); f.line(C, w + 1.2, INK, { op: 0.8 }); f.line(C, w, col); return C; }
// a string of small round beads (bone or seal teeth) hanging along a curve
function beadString(f, pts, r, n, o = {}) {
  const C = spline(pts, 3), S = arcLen(C), Lt = S[S.length - 1];
  cord(f, C, 1.2, PAL.greyD);
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n * Lt; let k = S.findIndex(v => v >= u); if (k < 0) k = C.length - 1;
    const c = C[k];
    if (o.teeth) { const a = Math.atan2(C[Math.min(C.length - 1, k + 1)][1] - C[Math.max(0, k - 1)][1], C[Math.min(C.length - 1, k + 1)][0] - C[Math.max(0, k - 1)][0]) + Math.PI / 2; const F = frame(c, a, r); f.part(F([[-0.2, -0.5], [0.3, -0.45], [1.8, -0.1], [2.3, 0.1, 1], [1.7, 0.35], [0.3, 0.5], [-0.2, 0.4]]), { fill: PAL.bone, shadow: PAL.boneS, light: '#f6f2e8', shade: 0.4, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false }); }
    else f.part(ell(c, r * (0.9 + f.r() * 0.3), r * (0.8 + f.r() * 0.2), 0, 8), { fill: o.col || PAL.bone, shadow: PAL.boneS, light: '#f8f4ea', shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false });
  }
  return C;
}

// ---- a face: B.head in cold skin with modelled age. c centre, H head height, a angle (facing +x).
// p (B.head options) plus: wrinkles 0..1, frost (rime on brows/lashes), tattoo [[pts in head units]...], mouthOpen
// ({ w, h, void, teeth }), ear ('none' | 'void' | default cold ear), cheek (frost-burn), bite (frostbite spots).
function face(f, X, c, H, a, p = {}) {
  const skin = p.skin || PAL.skin, sS = p.skinS || PAL.skinS, F = frame(c, a, H);
  const opt = Object.assign({ skin, faceHatch: false, faceShade: 0.78, jawShade: 0.45, hairCol: '#c8cacc', browCol: '#eef0f0', eyeWhite: '#e2e4e4', iris: '#16181c', noEar: true, mouth: 'set' }, p, { lips: false });
  // ear first (behind the hair), a cold ear behind the jaw hinge
  if (!p.ear || p.ear === 'skin') {
    const ec = [-0.2, 0.04];
    f.part(F([[ec[0] + 0.03, ec[1] - 0.13], [ec[0] - 0.05, ec[1] - 0.11], [ec[0] - 0.08, ec[1] - 0.02], [ec[0] - 0.06, ec[1] + 0.09], [ec[0] + 0.0, ec[1] + 0.15], [ec[0] + 0.05, ec[1] + 0.12], [ec[0] + 0.04, ec[1] + 0.02]]), { fill: mix(skin, PAL.bite, 0.25), shadow: sS, shade: 0.5, inkW: 1, inkHeavy: 1.6, cast: false });
    f.line(F([[ec[0] + 0.02, ec[1] - 0.08], [ec[0] - 0.04, ec[1] - 0.04], [ec[0] - 0.03, ec[1] + 0.05], [ec[0] + 0.02, ec[1] + 0.07]]), 1, PAL.biteD, { op: 0.8 });
  }
  const FF = B.head(f, c, H, a, opt);
  // lay cold skin back over the warm tints B.head uses for the nose and the lip shadow
  const nz = p.nose ?? 1, hook = p.hook ?? 0, tipX = 0.395 * nz + 0.02 * (1 - nz);
  f.flat(F([[0.30, -0.07], [0.335 + hook * 0.05, -0.01], [tipX - 0.02, 0.09], [tipX + 0.005, 0.12], [tipX - 0.01, 0.155], [0.35, 0.168], [0.31, 0.163], [0.27, 0.15], [0.255, 0.12], [0.27, 0.09], [0.29, 0.02]]), skin, { op: 0.55 });
  f.flat(F([[0.19, 0.3], [0.27, 0.297], [0.29, 0.33], [0.21, 0.335]]), skin, { op: 0.6 });
  const ink = INK, wr = p.wrinkles ?? 0;
  // modelling: soft shade under the cheekbone and down the far side of the face, the lit plane of the brow and cheek
  softTone(f, E.smooth(F([[-0.3, -0.4], [-0.08, -0.52], [0.18, -0.47], [0.36, -0.13], [0.33, 0.21], [0.29, 0.47], [0.13, 0.535], [-0.06, 0.47], [-0.21, 0.27], [-0.37, -0.13]])), [
    [F([[-0.36, -0.2], [-0.1, -0.1], [-0.06, 0.3], [-0.3, 0.3]]), sS, 0.35, H * 0.06],
    [F([[0.04, 0.12], [0.2, 0.2], [0.18, 0.32], [0.04, 0.28]]), sS, 0.3, H * 0.04],
    [F([[0.04, -0.4], [0.24, -0.38], [0.24, -0.22], [0.04, -0.24]]), '#ffffff', 0.35, H * 0.05],
    [F([[0.16, 0.02], [0.3, 0.06], [0.28, 0.14], [0.16, 0.12]]), '#ffffff', 0.25, H * 0.04],
  ]);
  if (wr > 0) {
    const w = Math.max(1.2, H * 0.012);
    // forehead furrows, crow's feet, the nasolabial fold, under-eye bags, cheek creases, a wattle under the jaw
    for (let i = 0; i < 2 + Math.round(wr * 2); i++) crease(f, F([[0.0 + i * 0.01, -0.22 - i * 0.045], [0.1, -0.235 - i * 0.045], [0.22, -0.22 - i * 0.04]]), w * 0.9, { col: sS, op: 0.55 });
    for (let i = 0; i < 3; i++) f.line(F([[0.0, -0.06 + i * 0.03], [-0.05, -0.05 + i * 0.045]]), Math.max(0.9, w * 0.7), ink, { op: 0.45 });
    crease(f, F([[0.27, 0.12], [0.23, 0.2], [0.2, 0.3], [0.2, 0.36]]), w * 1.3, { col: sS, op: 0.7 });
    crease(f, F([[0.05, 0.0], [0.12, 0.03], [0.19, 0.0]]), w, { col: sS, op: 0.55 });
    if (wr > 0.5) { crease(f, F([[0.02, 0.1], [0.06, 0.2], [0.1, 0.3]]), w * 0.9, { col: sS, op: 0.5 }); crease(f, F([[0.14, 0.38], [0.18, 0.46], [0.24, 0.48]]), w * 0.9, { col: sS, op: 0.5 }); crease(f, F([[-0.12, 0.36], [0.0, 0.48], [0.1, 0.54]]), w, { col: sS, op: 0.45 }); }
  }
  if (p.tattoo) for (const t of p.tattoo) f.line(F(t), Math.max(1.4, H * 0.016), '#121214', { op: 0.85 });
  if (p.mouthOpen) {
    const m = p.mouthOpen, cx = m.x ?? 0.25, cy = m.y ?? 0.31, mw = m.w ?? 0.08, mh = m.h ?? 0.06;
    const mo = F([[cx - mw, cy - mh * 0.35], [cx - mw * 0.3, cy - mh * 0.7], [cx + mw * 0.4, cy - mh * 0.65], [cx + mw, cy - mh * 0.2], [cx + mw * 0.85, cy + mh * 0.55], [cx, cy + mh], [cx - mw * 0.8, cy + mh * 0.6]]);
    f.part(F([[cx - mw * 1.25, cy - mh * 0.6], [cx + mw * 1.2, cy - mh * 0.9], [cx + mw * 1.25, cy + mh * 0.9], [cx - mw * 1.1, cy + mh * 1.2]]), { fill: mix(skin, sS, 0.25), shadow: sS, shade: 0.5, inkW: 0, cast: false, hatch: false }); // the lips round the open mouth
    if (m.void) X.voidPatch(mo, { w: 1.6, rim: false });
    else { f.flat(mo, '#141418'); f.line(mo.concat([mo[0]]), 1.6, ink); }
    if (m.teeth) f.flat(F([[cx - mw * 0.7, cy - mh * 0.45], [cx + mw * 0.75, cy - mh * 0.45], [cx + mw * 0.7, cy - mh * 0.2], [cx - mw * 0.6, cy - mh * 0.2]]), PAL.bone, { op: 0.9 });
    if (m.void) f.line(F([[cx - mw * 0.9, cy - mh * 0.45], [cx + mw * 0.8, cy - mh * 0.5]]), 1, '#ffffff', { op: 0.8 }); // the clean rim of the taken sound
    f.line(F([[cx - mw * 0.6, cy + mh * 1.05], [cx + mw * 0.5, cy + mh * 1.0]]), 1.1, '#ffffff', { op: 0.6 }); // the lit lower lip
  }
  if (p.frost !== false) {
    // hoar on brows, lashes and any beard line; frost-burnt cheek
    for (let i = 0; i < 6; i++) f.flat(F(ell([0.02 + i * 0.035, -0.14 - (i % 2) * 0.01], 0.014, 0.01, 0, 6)), '#ffffff', { op: 0.9 });
    f.line(F([[0.06, -0.075], [0.11, -0.085], [0.17, -0.078]]), 1.2, '#ffffff', { op: 0.85 });
    if (p.cheek !== false) X.bite(F([[0.17, 0.12]])[0], H * 0.06, H * 0.04, 3, 0.25);
  }
  return F;
}

// ---- hair as a mass with clumped hanks breaking its edge (never stripes): outline in screen space, hank roots along
// the lower edge; strands follow dir
function hairMass(f, X, outline, edge, o = {}) {
  const col = o.fill || '#d6d8da';
  f.part(outline, { fill: col, shadow: o.shadow || mix(col, '#000', 0.45), light: mix(col, '#ffffff', 0.35), shade: 0.4, tex: X.hairTex(o.ang ?? 100), texOp: 0.35, inkW: o.inkW ?? 1.5 });
  X.furField(outline, o.n ?? 18, o.len ?? 26, { dir: o.dir || (() => [0.2, 1]), w: o.w ?? 3, dark: '#6a6e74' });
  if (edge) X.hanks(edge, o.hn ?? 4, o.l0 ?? 20, o.l1 ?? 40, o.w0 ?? 10, o.w1 ?? 16, { ice: o.ice ?? 0.3, lift: 4 });
}

// ---- a plait hanging along a spline (frozen stiff): alternating lobes, each with its own ink, strand ticks, bone ties
function braid(f, X, pts, w, o = {}) {
  const C = spline(pts, 4), S = arcLen(C), Lt = S[S.length - 1], step = w * 0.62, n = Math.floor(Lt / step);
  const col = o.fill || '#d0d2d4', look = { fill: col, shadow: o.shadow || mix(col, '#000', 0.45), light: mix(col, '#ffffff', 0.3), shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, hatch: false, tex: X.hairTex(100), texOp: 0.25 };
  const at = u => { let i = S.findIndex(v => v >= u); if (i < 0) i = C.length - 1; const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)]; return [C[i], E.norm(sub(b, a))]; };
  // a three-strand plait seen from the side: a chain of plump lobes leaning alternately left and right, each overlapping
  // the one before (chevrons), with a dark parting between them and strand lines running along each lobe
  for (let i = 0; i < n; i++) {
    const [c, d] = at(i * step + step * 0.5), nn = [-d[1], d[0]], sg = i % 2 ? 1 : -1, ww = w * (1 - 0.35 * i / n) * (o.taper ?? 1);
    const a = Math.atan2(d[1], d[0]) + sg * 0.55, cc = add(c, mul(nn, sg * ww * 0.12));
    const lobe = ell(cc, step * 0.95, ww * 0.42, a, 14);
    f.part(lobe, Object.assign({}, look, { fill: mix(col, '#000', i % 2 ? 0.07 : 0) }));
    const ax = [Math.cos(a), Math.sin(a)];
    f.line([add(cc, mul(ax, -step * 0.6)), add(cc, mul(ax, step * 0.55))], 0.9, '#ffffff', { op: 0.75 });
    f.line([add(add(cc, mul(ax, -step * 0.5)), mul([-ax[1], ax[0]], ww * 0.18)), add(add(cc, mul(ax, step * 0.45)), mul([-ax[1], ax[0]], ww * 0.18))], 0.9, PAL.furD, { op: 0.5 });
  }
  for (const t of (o.ties || [])) { const [c, d] = at(t * Lt), nn = [-d[1], d[0]], ww = w * (1 - 0.35 * t) * 0.62; f.part([add(c, mul(nn, -ww)), add(c, mul(nn, ww)), add(add(c, mul(nn, ww)), mul(d, w * 0.4)), add(add(c, mul(nn, -ww)), mul(d, w * 0.4))], { fill: PAL.bone, shadow: PAL.boneS, light: '#f8f4ea', shade: 0.35, inkW: 1.1, cast: false, hatch: false }); }
  const [e] = at(Lt);
  // the end: a frozen tuft and an icicle hanging plumb
  X.hank(add(e, [0, -w * 0.3]), w * 1.6, w * 0.7, { fill: col, ice: 0, fade: false, look: { light: mix(col, '#ffffff', 0.3), shadow: mix(col, '#000', 0.45) } });
  if (o.ice !== false) X.icicle(add(e, [0, w * 1.4]), w * 1.6, Math.max(3, w * 0.3));
  return C;
}

// ---- a weight-bearing dog paw, side on: A the bottom of the pastern, dir +1 toes to the right, s paw length. Heel pad
// behind, three knuckled toes in front (the near ones larger), short dark claws, ice balled between the toes; o.bootie
// covers it in a hide bootie tied at the pastern.
function dogPaw(f, X, A, dir, s, look, o = {}) {
  const gy = o.gy ?? f.o.groundY, x = u => A[0] + dir * u * s, h = gy - A[1];
  const pad = [[x(-0.32), A[1] + h * 0.1], [x(0.1), A[1] - h * 0.05], [x(0.42), A[1] + h * 0.18], [x(0.56), gy - h * 0.3], [x(0.5), gy, 1], [x(-0.24), gy, 1], [x(-0.4), gy - h * 0.35]];
  if (o.bootie) {
    const bt = [[x(-0.38), A[1] - h * 0.2], [x(0.24), A[1] - h * 0.25], [x(0.62), A[1] + h * 0.4], [x(0.98), gy - h * 0.35], [x(1.02), gy - 2, 1], [x(-0.36), gy - 2, 1], [x(-0.46), gy - h * 0.4]];
    f.part(bt, { fill: o.bootCol || PAL.hide, shadow: PAL.hideS, light: '#f2f2ee', shade: 0.38, tex: 'mottle' + f.o.seed, texOp: 0.45, inkW: 1.4 });
    clipDraw(f, bt, () => { for (let i = 0; i < 3; i++) f.stroke([[x(0.1 + i * 0.22), A[1] + h * 0.3], [x(0.2 + i * 0.22), gy - h * 0.3], [x(0.25 + i * 0.22), gy - 2]], 2, PAL.hideD, { op: 0.45 }); f.flat([[x(-0.6), gy - 6], [x(1.2), gy - 6], [x(1.2), gy + 2], [x(-0.6), gy + 2]], '#3a3c40', { op: 0.8 }); });
    f.stroke([[x(-0.44), A[1] - h * 0.08], [x(0.0), A[1] - h * 0.14], [x(0.28), A[1] - h * 0.1]], 4.5, PAL.greyD); // the tie at the pastern
    f.line([[x(-0.42), A[1] - h * 0.06], [x(-0.5), A[1] + h * 0.3]], 2, PAL.greyD);
    f.stitches([[x(-0.34), gy - 8], [x(0.96), gy - 8]], PAL.hideD, 0.9);
    return bt;
  }
  f.part(pad, look);
  // toes: three knuckled lumps on the ground, the far one behind; claws; fur over the knuckles
  for (let i = 2; i >= 0; i--) {
    const tx = 0.52 + i * 0.16, top = gy - h * (0.62 - i * 0.12), sc = 1 - i * 0.12;
    const toe = [[x(tx - 0.16), top + h * 0.06], [x(tx + 0.02), top], [x(tx + 0.18 * sc), top + h * 0.14], [x(tx + 0.24 * sc), gy - h * 0.18], [x(tx + 0.2 * sc), gy, 1], [x(tx - 0.12), gy, 1], [x(tx - 0.2), gy - h * 0.3]];
    f.part(toe, Object.assign({}, look, { fill: mix(look.fill, PAL.furS, (2 - i) * 0.1), inkW: 1.2, inkHeavy: 1.8, cast: false }));
    f.line([[x(tx - 0.08), top + h * 0.12], [x(tx + 0.06), top + h * 0.05]], 1, PAL.furD, { op: 0.6 });
    f.part([[x(tx + 0.17 * sc), gy - h * 0.26], [x(tx + 0.32 * sc), gy - h * 0.12], [x(tx + 0.36 * sc), gy - 1, 1], [x(tx + 0.22 * sc), gy - h * 0.06]], { fill: '#2a2c30', shadow: '#0e0e10', light: '#6a6e74', shade: 0.3, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false });
  }
  // the heel (metacarpal) pad, dark, at the back on the ground; fur tufts between the toes; balled ice
  f.part([[x(-0.28), gy - h * 0.34], [x(-0.06), gy - h * 0.4], [x(0.04), gy - 2, 1], [x(-0.26), gy - 2, 1]], { fill: '#3a3c42', shadow: '#121216', light: '#6a6e74', shade: 0.3, inkW: 1, cast: false, hatch: false });
  if (o.ice !== false) for (let i = 0; i < 3; i++) f.part(ell([x(0.5 + i * 0.16), gy - h * (0.12 + f.r() * 0.08)], s * 0.05, s * 0.04, 0, 8), X.IC({ inkW: 0.9, inkHeavy: 1.1 }));
  return pad;
}

module.exports = Object.assign({}, X12, { X12, mirrorDraw, mx, forkHanks, clumpEdge, furBoot, beadBand, cord, beadString, face, hairMass, braid, dogPaw });
