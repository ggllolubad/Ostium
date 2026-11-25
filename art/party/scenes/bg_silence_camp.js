// World XII, the White Silence: THE SILENT CAMP (battle room, Living Ink). The herders' winter camp on the tundra, under
// the black star that took all the warmth and all the sound. Same contract as the nave (exterior).
// Lore (bible/world_XII_white_silence.md): a tundra of herders and hunters; a black star rose and took all the warmth and
// all the sound. Frost whitens everything; void takes pieces away: faces, shadows, sound. Near-white on near-white,
// defined almost entirely by ink line. Eyes may appear (void world). Palette: almost pure white, a black sun, and nothing
// else (plus ink, bone, grey).
// What is placed:
//   - THE COLD STAR: the black disc, very close, hung in the white sky with its thin white corona and the rings of frost
//     that form round it (the bible's own description: a perfect black disc; it is a star, not a hole)
//   - the camp: hide tents on crossed poles, near-white, inked; NO smoke from any smoke-hole; the void has taken pieces
//     of them: torn, clean-rimmed absences through the hides with black behind, the edges thinning into nothing
//   - THE HEARTH THAT IS GONE: where the camp fire burned, an irregular black absence in the snow, ringed by its hearth
//     stones, the cooking pot frozen to its tripod over nothing
//   - the Grandmother's work: a cord strung between two tent poles hung with sewn hide masks, no two alike, slit mouths
//     and eye holes (void world)
//   - a carved post of the camp whose face the void has taken (a clean-rimmed absence where the face was cut)
//   - a ring of offering stones half buried; drying racks of frozen fish; a sledge; a line of footprints that stops
//   - nothing casts a shadow: no object in this room has a cast shadow (only the forms' own ink and hatch)
//   - fore: a hide stretched on its drying frame, rimed, icicles; a sledge's bone-shod prow and an offering bundle; drifts
// The quiet zone steps toward a pale grey (this world's murk is white): low contrast, ink-light.
// Usage: node scenes/bg_silence_camp.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XII');
const W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 12101, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#6a7078', keyTint: '#ffffff' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#b8bcc4' });
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, lump, box, beam, icicles, rime, tornVoid, eye, quiet } = B;

const SNOW = '#eef0f2', SNOW2 = '#dcdfe4', SNOW3 = '#c2c7cf', HIDE = '#e2dccf', HIDE2 = '#cfc6b4', POLE = '#8a8478', VOID = '#050407', GREY = '#9aa0a8';
const fogW = (col, Z) => mix(col, '#e6e8ec', Math.min(0.7, Math.max(0, (Z - 8) / 40)));

// a hide tent: poles crossed at the top, a cone of sewn hides, a door flap; returns its outline and a plane mapper
function tent(X, Z, r, h, o = {}) {
  const apex = [X, h, Z], base = []; const n = 12;
  for (let k = 0; k <= n; k++) { const a = Math.PI * k / n; base.push([X - r * Math.cos(a), 0, Z - r * Math.sin(a) * 0.5]); }
  const ps = base.map(p => P(...p)), ap = P(...apex), col = fogW(HIDE, Z);
  const outline = [...ps, ap];
  // the cone: lit on the left, shading to hatch on the right (shadow side of the cone)
  let s = '';
  for (let k = 0; k < n; k++) { const q = [ps[k], ps[k + 1], ap], u = k / n; let c = mix(col, k < n * 0.45 ? '#ffffff' : HIDE2, k < n * 0.45 ? 0.3 : (u - 0.45) * 1.1); s += fillP(q, c); if (u > 0.6) s += `<path d="${p2(q)}" fill="${S.hatchA(Z)}" opacity="${f1((u - 0.6) * 1.2)}"/>`; }
  s += `<path d="${p2([...ps, ap])}" fill="url(#mottle)" opacity="0.3"/>`;
  // hide seams: sewn panels running from the base toward the apex, with stitch ticks; a horizontal band of panels
  for (let k = 1; k < 6; k++) { const b = ps[Math.round(k / 6 * n)]; s += pline([b, [b[0] + (ap[0] - b[0]) * 0.92, b[1] + (ap[1] - b[1]) * 0.92]], 0.8, INK, 0.7); for (let j = 1; j < 8; j++) { const t = j / 9, x = b[0] + (ap[0] - b[0]) * t, y = b[1] + (ap[1] - b[1]) * t; s += pline([[x - 1.5, y], [x + 1.5, y + 0.5]], 0.5, INK, 0.6); } }
  for (const t of [0.35, 0.68]) { const pts = ps.map(([x, y]) => [x + (ap[0] - x) * t, y + (ap[1] - y) * t]); s += line(pts, 0.8, INK, 0.6); }
  // the door flap: a lapped hide panel, tied back with a thong
  const d0 = ps[Math.round(n * 0.42)], d1 = ps[Math.round(n * 0.58)], dt = [d0[0] + (ap[0] - d0[0]) * 0.45, d0[1] + (ap[1] - d0[1]) * 0.45];
  s += fillP([d0, d1, dt], mix(col, '#8a8478', 0.5)) + `<path d="${p2([d0, d1, dt])}" fill="${S.hatchA(Z)}" opacity="0.5"/>` + inkP([d0, d1, dt], 1);
  // the poles crossing above the smoke-hole: no smoke rises
  for (let k = 0; k < 5; k++) { const dx = (k - 2) * r * 0.06; s += pline([[ap[0] + (k - 2) * 2, ap[1] + 6], [ap[0] - dx * K(Z) * 0.3 + (k - 2) * 6, ap[1] - K(Z) * (0.5 + R() * 0.4)]], Math.max(1.6, K(Z) * 0.05), INK) + pline([[ap[0] + (k - 2) * 2, ap[1] + 6], [ap[0] - dx * K(Z) * 0.3 + (k - 2) * 6, ap[1] - K(Z) * (0.5 + R() * 0.4)]], Math.max(0.8, K(Z) * 0.03), fogW(POLE, Z)); }
  s += inkP(outline, Math.max(1, inkW(Z) * 1.1));
  // snow banked round its foot
  const bank = ps.map(([x, y], i) => [x, y - K(Z) * (0.12 + 0.06 * Math.sin(i * 1.7))]); s += fillS([...ps.slice().reverse(), ...bank], SNOW, 1, 0.4) + line(bank, 0.8, INK, 0.6);
  s += rime(ps.slice(0, Math.round(n * 0.4)).map(([x, y]) => [x + (ap[0] - x) * 0.15, y + (ap[1] - y) * 0.15]).reverse(), Z, { th: 2.4, col: '#ffffff', under: '#9aa4b0' });
  return { svg: s, ps, ap, at: (u, t) => { const k = Math.min(n - 1, Math.floor(u * n)), b = ps[k]; return [b[0] + (ap[0] - b[0]) * t, b[1] + (ap[1] - b[1]) * t]; } };
}

// wind-carved texture on a near drift: sastrugi strokes, a blue-grey hollow along the lee, hatch in it
function drift(bank) { let o = ''; for (let k = 0; k < 14; k++) { const i = 1 + Math.floor(R() * (bank.length - 2)), [x, y] = bank[i], d = 8 + R() * 30, l = 20 + R() * 40; o += line([[x - l * 0.5, y + d], [x, y + d - 3], [x + l * 0.5, y + d + 1]], 1, INK, 0.5) + line([[x - l * 0.4, y + d + 2], [x + l * 0.4, y + d + 3]], 2, '#c2c7cf', 0.6); }
  const lee = bank.map(([x, y]) => [x, y + 6]).concat(bank.slice().reverse().map(([x, y]) => [x, y + 22])); return o + fillS(lee, '#c8cdd5', 0.5) + `<path d="${smooth(lee, true, 0.4)}" fill="${S.hatchA(4)}" opacity="0.25"/>`; }

// ======================================================================== FAR
layer('far');
raw(B.skyBands(['#f4f5f7', '#eceef1', '#e4e7eb', '#dde0e5', '#d6dae0'], [70, 140, 200, 255], { wav: 4 }));
raw(`<rect width="${W}" height="110" fill="${S.hatchA(30)}" opacity="0.12"/>`);
// ---- the Cold Star: the black disc, very close, its thin white corona, rings of frost forming round it
{
  const cx = 1010, cy = 92, r = 54;
  for (const [k, op] of [[2.6, 0.25], [2.1, 0.32], [1.7, 0.4]]) { let d = ''; const N = 90; for (let i = 0; i < N; i++) { if (R() < 0.18) continue; const a0 = i / N * 6.283, a1 = (i + 0.7) / N * 6.283, rr = r * k * (1 + (R() - 0.5) * 0.02); d += `M${f1(cx + Math.cos(a0) * rr)} ${f1(cy + Math.sin(a0) * rr)} A${f1(rr)} ${f1(rr)} 0 0 1 ${f1(cx + Math.cos(a1) * rr)} ${f1(cy + Math.sin(a1) * rr)} `; } raw(`<path d="${d}" stroke="#a8b0bc" stroke-width="1.2" fill="none" opacity="${op}"/>`); }
  // frost crystals hanging still in the rings
  { let m = ''; for (let k = 0; k < 90; k++) { const a = R() * 6.283, d = r * (1.4 + R() * 1.4), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, l = 1.5 + R() * 2.5; m += `M${f1(x - l)} ${f1(y)} L${f1(x + l)} ${f1(y)} M${f1(x)} ${f1(y - l)} L${f1(x)} ${f1(y + l)} `; } raw(`<path d="${m}" stroke="#8a929e" stroke-width="0.6" opacity="0.6"/>`); }
  raw(`<circle cx="${cx}" cy="${cy}" r="${f1(r * 1.12)}" fill="none" stroke="#ffffff" stroke-width="5" opacity="0.9"/><circle cx="${cx}" cy="${cy}" r="${f1(r * 1.06)}" fill="none" stroke="${INK}" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${VOID}"/>`);
}
// ---- the tundra to the horizon: low white rises, stepped tones, wind-carved sastrugi inked in the snow
{
  for (const [y0, col] of [[268, '#e2e5ea'], [282, '#d9dde3'], [296, '#e6e8ec']]) { const pts = [[-5, H + 5]]; for (let k = 0; k <= 30; k++) pts.push([k * W / 30, y0 + Math.sin(k * 0.6 + y0) * 6 + Math.sin(k * 1.9) * 3]); pts.push([W + 5, H + 5]); raw(fillP(pts, col) + line(pts.slice(1, -1), 0.9, INK, 0.5)); }
  raw(`<path d="${pp([[-60, 0, 4], [60, 0, 4], [60, 0, 60], [-60, 0, 60]])}" fill="${SNOW}"/>`);
  for (let k = 0; k < 70; k++) { const X = -30 + R() * 60, Z = 4.5 + Math.pow(R(), 1.6) * 40, A = P(X, 0, Z), l = K(Z) * (0.6 + R() * 1.4), pts = [A, [A[0] + l * 0.5, A[1] - l * 0.02], [A[0] + l, A[1] + l * 0.01]]; raw(line(pts, Math.max(0.5, K(Z) * 0.012), INK, 0.5) + line(pts.map(([x, y]) => [x, y + Math.max(1, K(Z) * 0.02)]), Math.max(0.6, K(Z) * 0.03), SNOW3, 0.5)); }
}
// ---- the camp's tents, back to front; the void has torn pieces out of two of them
const tents = [[-15.5, 26, 2.4, 4.0], [-7.5, 19, 2.6, 4.4], [6.8, 21, 2.8, 4.6], [15.5, 17, 2.5, 4.2], [-19, 15, 2.2, 3.8]];
const T = {};
for (const [X, Z, r, h] of tents) { const t = tent(X, Z, r, h); T[X] = t; raw(t.svg); }
{ // torn absences through the hides: irregular, clean-rimmed, the hide thinning into nothing at the rim
  for (const [X, u, tt, w, hh] of [[-7.5, 0.3, 0.42, 1.5, 1.8], [6.8, 0.66, 0.5, 1.6, 1.3], [15.5, 0.4, 0.32, 1.1, 1.0]]) {
    const t = T[X], c = t.at(u, tt), Zt = tents.find(q => q[0] === X)[1];
    const tv = tornVoid((s2, t2) => [X + (c[0] - P(X, 0, Zt)[0]) / K(Zt) + s2, (P(X, 0, Zt)[1] - c[1]) / K(Zt) + t2, Zt - 1], 0, 0, w, hh, { depth: 0, mat: HIDE, slivers: 4, flecks: 4, tears: 4, teeth: 3, halo: false, edge: '#8a8478', edgeOp: 0.5, eyes: X === 6.8 ? [[0.1, 0.05, 0.22]] : [], eyeO: { white: '#cfcac0', iris: '#6a6a70', open: 0.4 } });
    const ct = S.id('tc'); raw(`<clipPath id="${ct}"><path d="${p2([...t.ps, t.ap])}"/></clipPath><g clip-path="url(#${ct})">${tv.svg}</g>`);
  }
}
// ---- the Grandmother's masks strung on a cord between two poles: sewn hide faces, no two alike
{
  const Z = 13.5, a = P(-4.4, 2.5, Z), b = P(1.2, 2.5, Z);
  for (const p of [[-4.4, Z], [1.2, Z]]) { const A = P(p[0], 0, p[1]), Bq = P(p[0] + 0.05, 2.9, p[1]); raw(line([A, Bq], 3.4, INK) + line([A, Bq], 2, POLE)); }
  const cord = []; for (let k = 0; k <= 20; k++) { const t = k / 20; cord.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * 18]); }
  raw(line(cord, 1.2, INK));
  for (let k = 0; k < 8; k++) { const t = (k + 0.7) / 9, p = cord[Math.round(t * 20)], mw = K(Z) * (0.13 + R() * 0.04), mh = mw * (1.35 + R() * 0.3), cx = p[0], cy = p[1] + 3 + mh;
    raw(pline([[cx, p[1]], [cx, cy - mh]], 0.8, INK));
    raw(cel(blob(cx, cy, mw, mh, 14, 0.12), { Z, fill: k % 3 === 0 ? '#f2eee4' : k % 3 === 1 ? HIDE : '#d8d0c0', band: 1.5 }));
    const ey = cy - mh * 0.2, ex = mw * 0.42, kind = k % 4;
    // eye holes and the slit mouth, each mask its own: almond holes, slits, one with one eye only
    if (kind !== 3) raw(eye(cx - ex, ey, mw * 0.24, { white: '#1a1a1e', iris: VOID, open: kind === 1 ? 0.25 : 0.4, lid: false, look: [0, 0] }));
    raw(eye(cx + ex, ey, mw * 0.24, { white: '#1a1a1e', iris: VOID, open: kind === 1 ? 0.25 : 0.4, lid: false, look: [0, 0] }));
    raw(pline([[cx - mw * 0.35, cy + mh * 0.45], [cx + mw * 0.32, cy + mh * 0.42]], 1.4, INK));
    let st = ''; for (let j = 0; j < 8; j++) { const a2 = j / 8 * 6.28; st += `M${f1(cx + Math.cos(a2) * mw * 0.92)} ${f1(cy + Math.sin(a2) * mh * 0.92)} l${f1(Math.cos(a2) * 2)} ${f1(Math.sin(a2) * 2)} `; } raw(`<path d="${st}" stroke="${INK}" stroke-width="0.6"/>`); }
}
// ---- the carved camp post whose face the void has taken
{
  const Z = 12.5, X = 4.2, A = P(X, 0, Z), Bt = P(X, 3.1, Z), w = K(Z) * 0.2;
  raw(cel([[A[0] - w, A[1]], [A[0] + w, A[1]], [Bt[0] + w * 0.9, Bt[1] + w], [Bt[0], Bt[1]], [Bt[0] - w * 0.9, Bt[1] + w]], { Z, fill: '#d6d0c4', band: w * 0.5 }));
  for (const y of [0.6, 1.2, 1.7]) { const p = P(X, y, Z); raw(`<path d="M${f1(p[0] - w)} ${f1(p[1])} q${f1(w)} ${f1(-w * 0.5)} ${f1(w * 2)} 0" stroke="${INK}" stroke-width="0.9" fill="none"/>`); }
  // the face that was carved at its top: gone, a clean-rimmed absence where the brow, eyes and mouth were cut
  const tv = tornVoid((s2, t2) => [X + s2, 2.45 + t2, Z - 0.05], 0, 0, 0.32, 0.5, { depth: 0.15, cut: '#c8c2b4', mat: '#d6d0c4', slivers: 4, flecks: 6, tears: 2, teeth: 1, halo: false });
  raw(tv.svg + rime([[Bt[0] - w * 0.9, Bt[1] + w], [Bt[0], Bt[1] - 1], [Bt[0] + w * 0.9, Bt[1] + w]], Z, { th: 3, col: '#ffffff', under: '#9aa4b0' }));
}
// ---- drying racks of frozen fish, a sledge, the ring of offering stones, footprints that stop
{
  const Z = 15.5, x0 = 9.6, x1 = 12.8;
  for (const X of [x0, x1]) { const a = P(X, 0, Z), b = P(X, 2.1, Z); raw(line([a, b], 2.6, INK) + line([a, b], 1.4, POLE)); }
  const ra = P(x0, 1.95, Z), rb = P(x1, 1.95, Z); raw(pline([ra, rb], 2.6, INK) + pline([ra, rb], 1.4, POLE));
  for (let k = 0; k < 11; k++) { const t = (k + 0.5) / 11, x = ra[0] + (rb[0] - ra[0]) * t, y = ra[1] + 1, l = K(Z) * (0.35 + R() * 0.15); raw(cel([[x - 2, y], [x + 2, y], [x + 3, y + l * 0.7], [x, y + l], [x - 3, y + l * 0.7]], { Z, fill: '#c8ccd2', band: 1.2 }) + pline([[x - 3, y + l * 0.7], [x + 3, y + l * 0.72]], 0.6, INK, 0.6)); }
  raw(icicles([ra, rb], Z, { len: 8, dens: 1, col: '#ffffff', shadow: '#9aa4b0' }));
}
// the ring of offering stones, half buried, in the snow left of centre (behind the heroes, low: kept faint)
for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283, X = -10.5 + Math.cos(a) * 1.6, Z = 16 + Math.sin(a) * 0.9, c = P(X, 0.1, Z), r = K(Z) * (0.15 + R() * 0.08); raw(cel(blob(c[0], c[1] - r * 0.5, r, r * 0.6, 8, 0.35), { Z, fill: '#c8ccd2', band: 1.5 }) + rime([[c[0] - r, c[1] - r * 0.6], [c[0], c[1] - r * 1.1], [c[0] + r * 0.8, c[1] - r * 0.7]], Z, { th: 1.6, col: '#ffffff', under: '#9aa4b0' })); }
// a line of footprints coming from the right, that stops in the open snow
for (let k = 0; k < 14; k++) { const X = 13 - k * 0.55, Z = 9.8 + (k % 2) * 0.28, c = P(X, 0, Z), rx = K(Z) * 0.08; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(rx * 0.22)}" fill="${SNOW3}" stroke="${INK}" stroke-width="0.5" opacity="0.8"/>`); }
// ---- THE HEARTH THAT IS GONE: an irregular absence in the snow ringed by its hearth stones; the pot frozen over nothing
{
  const Z = 10.4, X = 0.4;
  const tv = tornVoid((s2, t2) => [X + s2, 0.005, Z + t2], 0, 0, 2.2, 3.0, { depth: 0, mat: SNOW, slivers: 5, flecks: 5, tears: 3, teeth: 2, halo: false, edge: '#8a8e96', edgeOp: 0.6 });
  raw(tv.svg);
  for (let k = 0; k < 11; k++) { const a = k / 11 * 6.283, c = P(X + Math.cos(a) * 1.0, 0.08, Z + Math.sin(a) * 0.75), r = K(Z) * (0.13 + R() * 0.05); raw(cel(blob(c[0], c[1] - r * 0.4, r, r * 0.55, 8, 0.35), { Z, fill: '#b8bec6', band: 1.5 }) + rime([[c[0] - r, c[1] - r * 0.5], [c[0], c[1] - r * 0.95], [c[0] + r, c[1] - r * 0.5]], Z, { th: 1.4, col: '#ffffff', under: '#9aa4b0' })); }
  for (const [dx, dz] of [[-1.0, -0.5], [1.05, -0.4], [0.05, 1.2]]) raw(line([P(X + dx, 0, Z + dz), P(X, 1.35, Z)], 2.4, INK) + line([P(X + dx, 0, Z + dz), P(X, 1.35, Z)], 1.2, POLE));
  const pc = P(X, 0.85, Z), pr = K(Z) * 0.32; raw(pline([P(X, 1.35, Z), [pc[0], pc[1] - pr * 0.7]], 1, INK) + cel(blob(pc[0], pc[1], pr, pr * 0.7, 14, 0.05), { Z, fill: '#5a5e64', band: 3 }) + `<ellipse cx="${f1(pc[0])}" cy="${f1(pc[1] - pr * 0.6)}" rx="${f1(pr * 0.9)}" ry="${f1(pr * 0.13)}" fill="#ffffff" stroke="${INK}" stroke-width="0.9"/>` + icicles([[pc[0] - pr * 0.8, pc[1] + pr * 0.3], [pc[0] + pr * 0.8, pc[1] + pr * 0.35]], Z, { len: 10, dens: 1.6, col: '#ffffff', shadow: '#9aa4b0' }));
}
// the quiet zone, stepped toward pale grey (low contrast), and the front of the snow a little greyed
raw(quiet([[240, 0.1], [275, 0.1], [310, 0.08], [350, 0.08]], { col: '#a8aeb8', hop: 0.08 }));
// snow hanging still in the air: no wind, no sound
{ let m = ''; for (let k = 0; k < 200; k++) { const x = R() * W, y = R() * 420, r = 0.6 + R() * 1.4; m += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#ffffff" stroke="${GREY}" stroke-width="0.4" opacity="${f1(0.5 + R() * 0.4)}"/>`; } raw(m); }

// ======================================================================== MID: low things behind the fighters
layer('mid');
// a sledge left standing, its load lashed under hide, frozen; a broken spear shaft (low, light, low contrast)
{ const Z = 9.6, X = -7.8; raw(box(X - 1.1, X + 1.0, 0.18, 0.5, Z - 0.35, Z + 0.35, { col: '#cfc8ba', shadeOp: 0.3 })); const r0 = P(X - 1.3, 0.05, Z - 0.35), r1 = P(X + 1.1, 0.05, Z - 0.35); raw(line([[r0[0], r0[1] - 8], [r0[0] + 4, r0[1]], r1], 2.4, INK) + line([[r0[0], r0[1] - 8], [r0[0] + 4, r0[1]], r1], 1.2, '#e8e2d4'));
  const ld = P(X, 0.5, Z - 0.2); raw(cel(blob(ld[0], ld[1] - 6, K(Z) * 0.85, 9, 12, 0.25), { Z, fill: HIDE, band: 2 }) + pline([[ld[0] - 20, ld[1] - 12], [ld[0] - 10, ld[1]]], 1, INK) + pline([[ld[0] + 12, ld[1] - 12], [ld[0] + 22, ld[1]]], 1, INK) + rime([[ld[0] - 40, ld[1] - 8], [ld[0], ld[1] - 15], [ld[0] + 30, ld[1] - 10]], Z, { th: 2.4, col: '#ffffff', under: '#9aa4b0' })); }
{ const Z = 8.6, a = P(5.4, 0.02, Z), b = P(6.6, 0.06, Z + 0.4); raw(line([a, b], 2.2, INK) + line([a, b], 1.1, POLE) + pline([[b[0], b[1]], [b[0] + 5, b[1] - 1.5], [b[0] + 9, b[1]]], 1.6, INK)); }

// ======================================================================== FORE: framing at the edges
layer('fore');
{
  // left: a hide stretched on its drying frame, rimed on the windward side, icicles off the frame; drift at its foot
  const Z = 4.2, x0 = -6.4, x1 = -4.9;
  for (const X of [x0, x1]) { const a = P(X, -0.5, Z), b = P(X + 0.05, 3.4, Z); raw(line([a, b], 7, INK) + line([a, b], 4.4, '#8a8478')); }
  const fr = [P(x0, 3.0, Z), P(x1, 3.0, Z), P(x1, 0.8, Z), P(x0, 0.8, Z)];
  raw(pline([fr[0], fr[1]], 6, INK) + pline([fr[0], fr[1]], 3.6, '#8a8478') + pline([fr[3], fr[2]], 6, INK) + pline([fr[3], fr[2]], 3.6, '#8a8478'));
  const hd = [[fr[0][0] + 10, fr[0][1] + 10], [fr[1][0] - 12, fr[1][1] + 14], [fr[2][0] - 14, fr[2][1] - 12], [fr[3][0] + 12, fr[3][1] - 10]];
  raw(cel(hd, { Z, fill: HIDE, band: 8 }) + `<path d="${p2(hd)}" fill="url(#mottle)" opacity="0.35"/>`);
  for (let k = 0; k < 10; k++) { const t = k / 9, a = [hd[0][0] + (hd[1][0] - hd[0][0]) * t, hd[0][1] + (hd[1][1] - hd[0][1]) * t]; raw(pline([a, [a[0], fr[0][1]]], 0.8, INK)); const b = [hd[3][0] + (hd[2][0] - hd[3][0]) * t, hd[3][1] + (hd[2][1] - hd[3][1]) * t]; raw(pline([b, [b[0], fr[3][1]]], 0.8, INK)); }
  raw(rime([fr[0], fr[1]], Z, { th: 6, col: '#ffffff', under: '#9aa4b0' }) + icicles([fr[3], fr[2]], Z, { len: 34, dens: 1.2, col: '#ffffff', shadow: '#9aa4b0' }));
  const bank = []; for (let k = 0; k <= 10; k++) bank.push([k * 30 - 20, H - 30 - Math.sin(k / 10 * Math.PI) * 30 - R() * 6]); raw(cel([[-20, H + 4], ...bank, [290, H + 4]], { Z: 3.6, fill: SNOW, band: 4 }) + line(bank, 1.4, INK) + drift(bank));
}
{
  // right: the bone-shod prow of a sledge with an offering bundle tied to it; a drift
  const pts = [[W + 10, H - 120], [W - 60, H - 118], [W - 120, H - 140], [W - 140, H - 170], [W - 128, H - 176], [W - 104, H - 150], [W - 50, H - 135], [W + 10, H - 136]];
  raw(cel(pts, { Z: 3.8, fill: '#e8e2d4', band: 4 }));
  for (let k = 0; k < 4; k++) { const x = W - 40 - k * 30; raw(line([[x, H - 125], [x - 6, H - 20]], 5, INK) + line([[x, H - 125], [x - 6, H - 20]], 3, '#8a8478')); }
  raw(cel(blob(W - 70, H - 160, 26, 18, 12, 0.3), { Z: 3.8, fill: HIDE2, band: 4 }) + pline([[W - 96, H - 166], [W - 44, H - 156]], 1.4, INK) + pline([[W - 74, H - 178], [W - 66, H - 142]], 1.4, INK) + rime([[W - 96, H - 168], [W - 70, H - 178], [W - 44, H - 170]], 3.8, { th: 4, col: '#ffffff', under: '#9aa4b0' }));
  const bank = []; for (let k = 0; k <= 10; k++) bank.push([W - 300 + k * 32, H - 22 - Math.sin(k / 10 * Math.PI) * 24 - R() * 5]); raw(cel([[W - 300, H + 4], ...bank, [W + 20, H + 4]], { Z: 3.6, fill: SNOW, band: 4 }) + line(bank, 1.4, INK) + drift(bank));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `silence_camp_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, 'silence_camp.camera.json'), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log('silence_camp layers written');
