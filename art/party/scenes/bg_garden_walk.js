// World XIV, the Blighted Garden: THE ROSE WALK (battle room, Living Ink). The fey lady's rose walk: a gravel walk under a
// run of rose arches, before the great yew hedge, round a fountain gone to loam. Same contract as the nave (exterior).
// Lore (bible/world_XIV_blighted_garden.md): a fey garden, once the most beautiful place in the world; it rotted, and the
// rot grew minds. Toxin covers everything in fungus, bloom and spore; void gives the growth eyes and leaves holes where
// things used to be. Everything here is overgrown: armour, deer, gardeners. Eyes in the leaves are expected (void world).
// Palette: sick pastel blooms (pink, lilac, pale yellow) over black loam, with eyes (plus bone, grey, ink).
// What is placed:
//   - the great yew hedge behind the walk, once clipped flat, now shaggy, whole stretches dead black and furred with
//     grey-lilac mould; the void has CLIPPED absences out of it (irregular, clean-rimmed, edges thinning into nothing),
//     and eyes have opened in the foliage, of different sizes, out of time with each other
//   - the rose arches: hoops of woven willow on the walk, grown over with roses gone over (pink and lilac blooms browned
//     at every edge, canes split and mould-furred); bracket fungus shelved on the arch posts
//   - the fountain in the centre: tiered stone, its basin filled with black loam and fruiting caps, its stone nymph
//     furred and shelved with fungus, a pale-yellow puffball cluster smoking spore
//   - a garden statue of a lady on her plinth, her face clipped away by the void
//   - the walk: pale gravel rotted with loam, drifts of fallen petals, a fairy ring of caps, a dropped pair of shears
//   - fore: a stone urn on a plinth bursting with bracket fungus and blooms (an eye open in one bloom); rose canes hanging
//     with thorns, hips and rotting blooms
// No gold. Red not used (the roses are pink and lilac; any dark is loam).
// Usage: node scenes/bg_garden_walk.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIV');
const W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 14101, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#2a2230' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#141016' });
const { fog, line, pline, fillP, fillS, inkP, inkS, blob, jag, lump, box, beam, mould, bracket, caps, pustules, tornVoid, eye, quiet } = B;

const PINK = '#d4a0b2', LILAC = '#b4a0cc', YEL = '#ded68e', LOAM = '#1a1512', YEW = '#22281f', YEWD = '#121612', MOULD = '#8a8098', BONE = '#d4ccb8', STONE = '#9a96a0', MURK = B.MURK;
const ZH = 17;                                       // the hedge's face
// a rose gone over: layered petals, browned at the edges, a dark heart; sometimes an eye open in its heart (void world)
function rose(x, y, r, col, o = {}) {
  let s = '';
  for (let k = 0; k < 3; k++) { const rr = r * (1 - k * 0.28), c = mix(col, k === 0 ? '#5a3a40' : '#ffffff', k === 0 ? 0.25 : k * 0.08); s += cel(blob(x + (R() - 0.5) * r * 0.2, y + (R() - 0.5) * r * 0.2, rr, rr * 0.85, 9, 0.45, R()), { Z: 10, fill: c, band: rr * 0.25, inkW: Math.max(0.4, r * 0.08) }); }
  s += fillS(blob(x - r * 0.1, y + r * 0.6, r * 0.9, r * 0.35, 9, 0.5), '#5a4030', 0.45);                   // brown rot at the lower petals
  if (o.eye) s += eye(x, y, r * 0.5, { white: '#e0d8c8', iris: '#7a6a8a', open: 0.5 }); else s += fillS(blob(x, y, r * 0.22, r * 0.2, 7, 0.4), '#3a2a2e');
  return s;
}
// foliage texture over a region (clip it): small leaf strokes, dark, a few lit tips; dead patches black and furred
function foliage(x0, y0, x1, y1, n, o = {}) { let s = ''; for (let k = 0; k < n; k++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), l = (o.l || 4) * (0.6 + R() * 0.8), a = -0.9 + (R() - 0.5) * 1.4, lit = R() < (o.lit ?? 0.25); s += `<path d="M${f1(x)} ${f1(y)} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}" stroke="${lit ? (o.litCol || '#4a5a3e') : INK}" stroke-width="${f1(o.w || 1)}" stroke-linecap="round" opacity="${lit ? 0.8 : 0.6}"/>`; } return s; }

// ======================================================================== FAR
layer('far');
raw(B.skyBands(['#cfc6d2', '#c6bccb', '#bdb2c2', '#b4a8b8', '#ab9eae'], [60, 120, 170, 215], { wav: 5 }));
// spore hanging in the sky: pale motes, and a haze of fine hatch
{ let m = ''; for (let k = 0; k < 160; k++) m += `<circle cx="${f1(R() * W)}" cy="${f1(R() * 230)}" r="${f1(0.5 + R() * 1.2)}" fill="${R() < 0.5 ? YEL : '#f0e8f0'}" opacity="${f1(0.3 + R() * 0.4)}"/>`; raw(m + `<rect width="${W}" height="80" fill="${S.hatchA(30)}" opacity="0.08"/>`); }
// distant topiary over the hedge: clipped shapes gone shaggy (a ball on a stem, a cone, a peacock lost its tail)
for (const [X, Z, kind] of [[-16, 40, 'ball'], [-6, 45, 'cone'], [9, 42, 'ball'], [17, 38, 'cone'], [26, 44, 'tier']]) { const b = P(X, 0, Z), k = K(Z);
  if (kind === 'ball') raw(line([b, [b[0], b[1] - k * 4]], k * 0.3, mix(YEW, '#8a8090', 0.45)) + cel(blob(b[0], b[1] - k * 5.2, k * 1.6, k * 1.5, 14, 0.25), { Z, fill: mix(YEW, '#9a90a0', 0.45), band: k * 0.4 }));
  if (kind === 'cone') raw(cel([[b[0] - k * 1.6, b[1] - k * 2], [b[0], b[1] - k * 8], [b[0] + k * 1.7, b[1] - k * 2]].concat(blob(b[0], b[1] - k * 2, k * 1.6, k * 0.5, 8, 0.3).slice(1, 4)), { Z, fill: mix(YEW, '#9a90a0', 0.45), band: k * 0.4 }));
  if (kind === 'tier') for (const [dy, r] of [[2.5, 1.5], [5, 1.1], [7, 0.7]]) raw(cel(blob(b[0], b[1] - k * dy, k * r, k * r * 0.6, 12, 0.3), { Z, fill: mix(YEW, '#9a90a0', 0.45), band: k * 0.3 })); }
// ---- over the hedge, the garden beyond: great dead trees hung with bloom and shelved with fungus, and huge pale caps
for (const [X, Z, h, kind] of [[-22, 34, 16, 'tree'], [-9, 44, 22, 'cap'], [2, 38, 18, 'tree'], [14, 46, 26, 'cap'], [24, 36, 15, 'tree'], [-30, 48, 20, 'cap']]) { const b = P(X, 0, Z), k = K(Z), col = mix('#6a6070', '#cfc6d2', 0.35);
  if (kind === 'cap') { const st = [[b[0] - k * 0.8, b[1]], [b[0] + k * 0.8, b[1]], [b[0] + k * 0.5, b[1] - k * h * 0.8], [b[0] - k * 0.5, b[1] - k * h * 0.8]]; raw(cel(st, { Z, fill: mix(BONE, '#cfc6d2', 0.4), band: k * 0.3 }));
    const cw = k * h * 0.3, cy = b[1] - k * h * 0.8, dome = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16, a = Math.PI * t; dome.push([b[0] - cw * Math.cos(a) * (1 + (R() - 0.5) * 0.06), cy - Math.sin(a) * cw * 0.55 * (1 + 0.1 * Math.sin(t * 9))]); }
    const rim = []; for (let i = 16; i >= 0; i--) { const t = i / 16; rim.push([b[0] - cw + 2 * cw * t, cy + cw * 0.08 + Math.sin(t * 23) * cw * 0.04]); }
    raw(cel([...dome, ...rim], { Z, fill: mix(LILAC, '#cfc6d2', 0.35), band: cw * 0.12 }) + `<path d="${smooth([...dome, ...rim], true, 0.4)}" fill="url(#mottle)" opacity="0.4"/>`);
    for (let i = 0; i < 14; i++) { const x = b[0] - cw * 0.9 + i * cw * 0.13; raw(pline([[b[0] + (x - b[0]) * 0.15, cy + cw * 0.1], [x, cy + cw * 0.06]], 0.6, INK, 0.5)); }
    for (let i = 0; i < 8; i++) raw(`<circle cx="${f1(b[0] + (R() - 0.5) * cw * 1.4)}" cy="${f1(cy - cw * 0.35 * R() - 4)}" r="${f1(1 + R() * 2.4)}" fill="${mix(PINK, '#ffffff', 0.3)}" stroke="${INK}" stroke-width="0.4" opacity="0.85"/>`);
    raw(mould(b[0], cy + cw * 0.12, cw * 0.4, cw * 0.06, { col: MOULD, n: 30 })); }
  else { const tr = [[b[0] - k * 0.7, b[1]], [b[0] + k * 0.7, b[1]], [b[0] + k * 0.35, b[1] - k * h * 0.6], [b[0] - k * 0.35, b[1] - k * h * 0.6]]; raw(cel(tr, { Z, fill: col, band: k * 0.3 }));
    const br = (x, y, a, l, w, d) => { const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l; raw(line([[x, y], [ex, ey]], w + 1.2, INK) + line([[x, y], [ex, ey]], w, col)); if (d > 0) { br(ex, ey, a - 0.4 - R() * 0.3, l * 0.7, w * 0.65, d - 1); br(ex, ey, a + 0.35 + R() * 0.3, l * 0.65, w * 0.65, d - 1); } else for (let i = 0; i < 3; i++) raw(fillS(blob(ex + (R() - 0.5) * 8, ey + 4 + R() * 6, 3 + R() * 3, 3, 7, 0.4), R() < 0.5 ? PINK : LILAC, 0.8)); };
    br(b[0], b[1] - k * h * 0.6, -Math.PI / 2 - 0.3, k * h * 0.25, k * 0.5, 3); br(b[0], b[1] - k * h * 0.55, -Math.PI / 2 + 0.4, k * h * 0.22, k * 0.45, 3);
    for (let i = 0; i < 3; i++) raw(bracket(b[0] + k * 0.4, b[1] - k * h * (0.15 + i * 0.15), k * 1.2, Z, { col: mix(YEL, '#cfc6d2', 0.3) })); } }
// ---- the great yew hedge: a long wall of dark foliage, once clipped flat, now shaggy; dead stretches furred with mould
{
  const top = []; for (let k = 0; k <= 60; k++) { const X = -30 + k; top.push(P(X, 4.2 + Math.sin(k * 0.7) * 0.12 + (R() - 0.5) * 0.25 + (k % 9 === 0 ? 0.4 : 0), ZH)); }
  const body = [P(-30, 0, ZH), ...top, P(30, 0, ZH)];
  raw(cel(body, { Z: ZH, fill: YEW, band: 4 }) + `<path d="${smooth(body, true, 0.4)}" fill="url(#mottle)" opacity="0.5"/>`);
  const ch = S.id('hg'); raw(`<clipPath id="${ch}"><path d="${smooth(body, true, 0.4)}"/></clipPath><g clip-path="url(#${ch})">`);
  raw(foliage(0, top[0][1] - 10, W, 330, 2600, { l: 4, lit: 0.22, w: 1 }));
  // dead stretches: black, furred grey-lilac with mould, bracket fungus shelved along them
  for (const [X0, X1] of [[-24, -18], [-5, -1.5], [10, 15]]) { const a = P(X0, 4.4, ZH), b2 = P(X1, 0, ZH); raw(fillS(blob((a[0] + b2[0]) / 2, (a[1] + b2[1]) / 2, (b2[0] - a[0]) / 2, (b2[1] - a[1]) / 2, 16, 0.3), YEWD, 0.95) + mould((a[0] + b2[0]) / 2, a[1] + 40, (b2[0] - a[0]) * 0.45, 30, { col: MOULD, n: 120 }));
    for (let k = 0; k < 4; k++) raw(bracket(a[0] + R() * (b2[0] - a[0]), a[1] + 30 + R() * 50, 14 + R() * 10, ZH, { col: mix(BONE, LILAC, 0.3) })); }
  raw(hatch3((s, t) => [-30 + s, t, ZH], 0, 60, 0, 4.4, 0.8, { op: 0.35, ragged: 0.3 }));
  raw('</g>');
  raw(`<path d="${smooth(top, false, 0.4)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`); { const tf = []; for (let k = 0; k < 400; k++) { const i = Math.floor(R() * (top.length - 1)), u = R(), x = top[i][0] + (top[i + 1][0] - top[i][0]) * u, y = top[i][1] + (top[i + 1][1] - top[i][1]) * u + R() * 6, a = -1.6 + (R() - 0.5) * 1.4, l = 3 + R() * 4; tf.push(`M${f1(x)} ${f1(y)} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}`); } raw(`<path d="${tf.join(' ')}" stroke="${INK}" stroke-width="1.1" stroke-linecap="round" opacity="0.8"/>`); }
  // the void's clipping: irregular absences cut out of the hedge, clean-rimmed, foliage thinning into nothing at the rim
  for (const [X, Y, w, h, ey] of [[-12.5, 2.9, 1.6, 1.3, [[0.1, 0, 0.3]]], [3.4, 3.3, 1.2, 1.0, []], [20.5, 2.6, 1.8, 1.5, [[-0.2, 0.1, 0.28], [0.35, -0.2, 0.18]]]]) {
    raw(tornVoid((s2, t2) => [X + s2, Y + t2, ZH - 0.05], 0, 0, w, h, { depth: 0.8, cut: '#2a3226', mat: YEW, tears: 4, teeth: 3, slivers: 8, flecks: 10, halo: false, eyes: ey, eyeO: { white: '#ddd4c4', iris: '#6a5a7a', open: 0.45 } }).svg);
  }
  // eyes opened in the foliage: of different sizes, some half shut, out of time with each other
  for (const [X, Y, r] of [[-20, 3.4, 0.16], [-15.5, 1.9, 0.1], [-8.5, 3.6, 0.13], [-3.0, 2.6, 0.2], [6.5, 3.7, 0.11], [12, 2.2, 0.14], [16.5, 3.5, 0.12], [24, 3.1, 0.15], [-25, 2.8, 0.12]]) { const c = P(X, Y, ZH - 0.1), r2 = K(ZH) * r; raw(fillS(blob(c[0], c[1], r2 * 1.5, r2 * 1.0, 10, 0.4), YEWD, 0.9) + eye(c[0], c[1], r2, { white: '#d8d0c0', iris: R() < 0.5 ? '#7a6a8a' : '#8a8a6a', open: 0.15 + R() * 0.45 })); }
  // blooms climbing the hedge from the walk: pink and lilac, gone over
  for (let k = 0; k < 40; k++) { const X = -28 + R() * 56, Y = 0.4 + R() * 3.6, c = P(X, Y, ZH - 0.15); raw(rose(c[0], c[1], K(ZH) * (0.08 + R() * 0.06), R() < 0.5 ? PINK : LILAC, { eye: R() < 0.06 })); }
}
// ---- a garden statue of a lady on her plinth (left of centre), her face clipped away by the void, moss and caps on her
{
  const Z = 14.2, X = -6.6, k = K(Z);
  raw(box(X - 0.45, X + 0.45, 0, 1.2, Z - 0.45, Z + 0.45, { col: fog(STONE, Z, 0.5), shadeOp: 0.4 }));
  const b = P(X, 1.2, Z), body = [[b[0] - k * 0.32, b[1]], [b[0] + k * 0.35, b[1]], [b[0] + k * 0.22, b[1] - k * 0.9], [b[0] + k * 0.18, b[1] - k * 1.4], [b[0] + k * 0.08, b[1] - k * 1.55], [b[0] - k * 0.12, b[1] - k * 1.5], [b[0] - k * 0.2, b[1] - k * 1.0]];
  raw(cel(body, { Z, fill: fog('#b8b4bc', Z, 0.4), band: k * 0.1 }) + `<path d="${p2(body)}" fill="url(#mottle)" opacity="0.5"/>`);
  for (let i = 0; i < 4; i++) raw(pline([[b[0] - k * 0.2 + i * k * 0.12, b[1] - k * 0.9], [b[0] - k * 0.26 + i * k * 0.15, b[1]]], 0.8, INK, 0.6));
  const hc = [b[0] - k * 0.02, b[1] - k * 1.72]; raw(cel(blob(hc[0], hc[1], k * 0.12, k * 0.15, 10, 0.1), { Z, fill: fog('#b8b4bc', Z, 0.4), band: 2 }));
  raw(tornVoid((s2, t2) => [X + 0.05 + s2, 2.95 + t2, Z - 0.2], 0, 0, 0.22, 0.24, { depth: 0.1, cut: '#cfcbd2', mat: '#b8b4bc', tears: 2, teeth: 1, slivers: 3, flecks: 4, halo: false }).svg);
  raw(mould(b[0], b[1] - k * 0.4, k * 0.25, k * 0.3, { col: MOULD }) + bracket(b[0] + k * 0.25, b[1] - k * 0.6, k * 0.2, Z, { col: YEL }) + caps(b[0] - k * 0.1, b[1], k * 0.2, Z, { col: mix(PINK, BONE, 0.4) }));
}
// ---- the fountain in the centre: tiered stone, the basin full of black loam and caps, the nymph shelved with fungus
{
  const Z = 12.8, X = 0.2, k = K(Z);
  // basin: a broad low ring, its rim lit, loam heaped in it with fruiting caps
  const c = P(X, 0.55, Z), rx = k * 1.9, ry = k * 0.18;
  raw(cel([[c[0] - rx, c[1]], [c[0] + rx, c[1]], [c[0] + rx * 0.97, P(X, 0, Z)[1]], [c[0] - rx * 0.97, P(X, 0, Z)[1]]], { Z, fill: fog(STONE, Z, 0.5), band: 3, tex: 'url(#mottle)', texOp: 0.5 }) + hatch3((s2, t) => [X - 1.9 + s2, t, Z], 0, 3.8, 0, 0.55, 0.8, { op: 0.4 }));
  raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${LOAM}" stroke="${INK}" stroke-width="1.4"/>` + pline([[c[0] - rx, c[1]], [c[0] - rx * 0.4, c[1] - ry]], 1.2, '#e0dce4', 0.6));
  for (let i = 0; i < 6; i++) raw(caps(c[0] + (R() - 0.5) * rx * 1.6, c[1] + (R() - 0.5) * ry, k * (0.15 + R() * 0.15), Z, { col: [PINK, LILAC, YEL, BONE][i % 4], n: 3 }));
  // the stem and upper bowl
  const s0 = P(X, 0.55, Z), s1 = P(X, 1.6, Z); raw(cel([[s0[0] - k * 0.16, s0[1]], [s0[0] + k * 0.16, s0[1]], [s1[0] + k * 0.12, s1[1]], [s1[0] - k * 0.12, s1[1]]], { Z, fill: fog(STONE, Z, 0.5), band: 2 }));
  const ub = P(X, 1.75, Z); raw(cel([[ub[0] - k * 0.8, ub[1] - 2], [ub[0] + k * 0.8, ub[1] - 2], [ub[0] + k * 0.3, ub[1] + k * 0.18], [ub[0] - k * 0.3, ub[1] + k * 0.18]], { Z, fill: fog(STONE, Z, 0.5), band: 2 }) + `<ellipse cx="${f1(ub[0])}" cy="${f1(ub[1] - 2)}" rx="${f1(k * 0.8)}" ry="${f1(k * 0.07)}" fill="${LOAM}" stroke="${INK}" stroke-width="1"/>`);
  // the nymph pouring from a jug, now pouring nothing; her body shelved with bracket fungus, a puffball cluster at her feet
  const nb = P(X, 1.75, Z), nym = [[nb[0] - k * 0.2, nb[1]], [nb[0] + k * 0.22, nb[1]], [nb[0] + k * 0.18, nb[1] - k * 0.8], [nb[0] + k * 0.3, nb[1] - k * 1.15], [nb[0] + k * 0.1, nb[1] - k * 1.4], [nb[0] - k * 0.12, nb[1] - k * 1.32], [nb[0] - k * 0.16, nb[1] - k * 0.8]];
  raw(cel(nym, { Z, fill: fog('#b8b4bc', Z, 0.4), band: k * 0.08 }) + cel(blob(nb[0] + k * 0.02, nb[1] - k * 1.55, k * 0.11, k * 0.13, 10, 0.1), { Z, fill: fog('#b8b4bc', Z, 0.4), band: 2 }));
  raw(cel([[nb[0] + k * 0.28, nb[1] - k * 1.15], [nb[0] + k * 0.5, nb[1] - k * 1.2], [nb[0] + k * 0.55, nb[1] - k * 1.0], [nb[0] + k * 0.33, nb[1] - k * 0.95]], { Z, fill: fog('#a8a4ac', Z, 0.4), band: 2 }));
  for (let i = 0; i < 4; i++) raw(bracket(nb[0] + (R() - 0.4) * k * 0.3, nb[1] - k * (0.2 + i * 0.3), k * (0.18 + R() * 0.1), Z, { col: i % 2 ? YEL : mix(BONE, LILAC, 0.3) }));
  raw(mould(nb[0], nb[1] - k * 0.9, k * 0.18, k * 0.4, { col: MOULD }) + eye(nb[0] + k * 0.02, nb[1] - k * 1.55, k * 0.05, { white: '#e0d8c8', iris: '#7a6a8a', open: 0.5 }));
  for (let i = 0; i < 5; i++) { const pc = [ub[0] - k * 0.5 + i * k * 0.25, ub[1] - k * 0.1 - R() * 4], pr = k * (0.06 + R() * 0.05); raw(cel(blob(pc[0], pc[1] - pr, pr, pr * 0.9, 10, 0.1), { Z, fill: YEL, band: pr * 0.3 })); }
  // spore smoking up from the puffballs (line wisps, pale yellow)
  raw(B.steam(ub[0], ub[1] - k * 0.2, 60, { n: 3, col: YEL, op: 0.4, w: 30 }));
}
// ---- the rose arches along the walk: willow hoops grown over with roses gone over, brackets on the posts
for (const X of [-8.6, -3.3, 4.2, 9.6]) {
  const Z = 11.2, k = K(Z), w = 1.1, h = 2.7, pts = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16, a = Math.PI * t; pts.push(P(X - w * Math.cos(a), i === 0 || i === 16 ? 0 : h - 0.0 + Math.sin(a) * 0.6 - (1 - Math.sin(a)) * (h - 0.0) * (i < 3 || i > 13 ? 1 : 0), Z)); }
  const L = [P(X - w, 0, Z), P(X - w, h, Z)], Rr = [P(X + w, 0, Z), P(X + w, h, Z)], arc = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; arc.push(P(X - w * Math.cos(a), h + Math.sin(a) * 0.7, Z)); }
  for (const side of [L, Rr]) raw(line(side, k * 0.09, INK) + line(side, k * 0.06, '#4a4034'));
  raw(line(arc, k * 0.09, INK) + line(arc, k * 0.06, '#4a4034'));
  for (let i = 0; i < 6; i++) { const t = R(), y = L[0][1] + (L[1][1] - L[0][1]) * t; raw(pline([[L[0][0] - 3, y], [L[0][0] + 3, y + 4]], 0.8, INK, 0.7) + pline([[Rr[0][0] - 3, y + 2], [Rr[0][0] + 3, y + 6]], 0.8, INK, 0.7)); }
  // the canes wound over it, split and furred; blooms gone over massed on the arch, a few hanging down
  for (let j = 0; j < 3; j++) { const cn = arc.map(([x, y], i) => [x + Math.sin(i * 1.3 + j) * 4, y + Math.cos(i * 0.9 + j) * 3]); raw(line(cn, 1.6, INK) + line(cn, 0.9, '#5a5a3e')); }
  for (let i = 0; i < 18; i++) { const p = arc[Math.floor(R() * arc.length)]; raw(rose(p[0] + (R() - 0.5) * 14, p[1] + (R() - 0.5) * 10, k * (0.1 + R() * 0.07), R() < 0.55 ? PINK : LILAC, { eye: R() < 0.06 })); }
  for (let i = 0; i < 7; i++) { const side = R() < 0.5 ? L : Rr, t = 0.3 + R() * 0.7, p = [side[0][0], side[0][1] + (side[1][1] - side[0][1]) * t]; raw(rose(p[0] + (R() - 0.5) * 8, p[1], k * (0.08 + R() * 0.05), R() < 0.5 ? PINK : LILAC)); }
  raw(mould(L[0][0], L[0][1] - k * 0.6, k * 0.12, k * 0.5, { col: MOULD }) + bracket(Rr[0][0] + 3, Rr[0][1] - k * 1.2, k * 0.22, Z, { col: YEL }));
}
// ---- the walk: pale gravel rotted with black loam, drifts of fallen petals, a fairy ring of caps
{
  raw(`<path d="${pp([[-60, 0, 3.8], [60, 0, 3.8], [60, 0, ZH], [-60, 0, ZH]])}" fill="${mix('#8a8278', MURK, 0.45)}"/>` + `<path d="${pp([[-60, 0, 3.8], [60, 0, 3.8], [60, 0, ZH], [-60, 0, ZH]])}" fill="url(#mottle)" opacity="0.6"/>`);
  for (let k = 0; k < 900; k++) { const X = -20 + R() * 40, Z = 4 + R() * 12.5, c = P(X, 0, Z), r = Math.max(0.5, K(Z) * 0.012 * (0.5 + R())); raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${R() < 0.5 ? '#a8a094' : '#5a544c'}" opacity="0.6"/>`); }
  for (let k = 0; k < 14; k++) { const c = P(-18 + R() * 36, 0, 5 + R() * 11); raw(fillS(blob(c[0], c[1], K(c[1]) * 0.6 + 20, 3 + R() * 4, 12, 0.6), LOAM, 0.5)); }
  for (let k = 0; k < 10; k++) { const c = P(-18 + R() * 36, 0, 8 + R() * 8), w = 20 + R() * 40; let pt = ''; for (let j = 0; j < 30; j++) { const x = c[0] + (R() - 0.5) * w, y = c[1] + (R() - 0.5) * 4, col = R() < 0.5 ? PINK : LILAC; pt += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1 + R() * 1.6)}" ry="${f1(0.5 + R() * 0.6)}" fill="${mix(col, '#5a4040', R() * 0.5)}" opacity="0.75"/>`; } raw(pt); }
  // the box edging along the hedge foot, dead
  for (let X = -28; X < 28; X += 0.5) { const c = P(X, 0.3, ZH - 0.6); raw(fillS(blob(c[0], c[1], K(ZH) * 0.3, K(ZH) * 0.22, 8, 0.4), YEWD, 0.9)); }
  raw(S.occBand((s, t) => [-60 + s, 0, ZH - t], 120, 1.2, { op: 0.4, cross: true }) + hatch3((s, t) => [-60 + s, 0, 3.8 + t], 0, 120, 0, 1.4, 0.25, { op: 0.35, ragged: 0.3 }));
}
raw(quiet([[234, 0.14], [266, 0.14], [300, 0.12], [345, 0.12]], { hop: 0.17 }));

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
// a fairy ring of caps on the walk, a dropped pair of shears, a heap of dead clippings (low, dark)
{ const Z = 9.6, c = P(-5.0, 0, Z); for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283, p = P(-5.0 + Math.cos(a) * 0.9, 0, Z + Math.sin(a) * 0.5); raw(caps(p[0], p[1], K(Z) * (0.08 + R() * 0.06), Z, { col: mix(BONE, MURK, 0.35), n: 2 })); } }
{ const Z = 8.8, a = P(3.2, 0.03, Z), b = P(4.0, 0.03, Z - 0.2); raw(line([a, b], 3, INK) + line([a, b], 1.6, mix('#6a6664', MURK, 0.3)) + line([[a[0] + 4, a[1] - 3], [b[0] + 2, b[1] + 3]], 3, INK) + line([[a[0] + 4, a[1] - 3], [b[0] + 2, b[1] + 3]], 1.6, mix('#6a6664', MURK, 0.3))); }
{ const Z = 10.6, c = P(9.4, 0, Z); raw(cel(blob(c[0], c[1] - 6, K(Z) * 0.8, 9, 14, 0.4), { Z, fill: mix(YEWD, MURK, 0.2), band: 2 }) + foliage(c[0] - K(Z) * 0.7, c[1] - 14, c[0] + K(Z) * 0.7, c[1], 60, { l: 3, lit: 0.1 }) + mould(c[0], c[1] - 8, K(Z) * 0.4, 5, { col: mix(MOULD, MURK, 0.4), n: 20 })); }

// ======================================================================== FORE: framing at the edges
layer('fore');
{
  // left: a stone urn on a plinth bursting with bracket fungus and blooms; an eye open in one bloom
  const Z = 4.3, X = -5.25, k = K(Z);
  raw(box(X - 0.5, X + 0.5, -0.5, 1.0, Z, Z + 0.8, { col: '#4a4650', shadeOp: 0.5, sides: false, top: false }));
  const u = P(X, 1.0, Z), uw = k * 0.55; const urn = [[u[0] - uw * 0.5, u[1]], [u[0] + uw * 0.5, u[1]], [u[0] + uw, u[1] - k * 0.45], [u[0] + uw * 1.05, u[1] - k * 0.6], [u[0] - uw * 1.05, u[1] - k * 0.6], [u[0] - uw, u[1] - k * 0.45]];
  raw(cel(urn, { Z, fill: '#5a5660', band: 8 }) + `<path d="${p2(urn)}" fill="url(#mottle)" opacity="0.5"/>` + mould(u[0], u[1] - k * 0.3, uw * 0.7, k * 0.15, { col: MOULD }));
  for (let i = 0; i < 4; i++) raw(bracket(u[0] + (R() - 0.3) * uw * 1.6, u[1] - k * 0.1 - i * 16, 34 + R() * 20, Z, { col: i % 2 ? YEL : mix(BONE, LILAC, 0.25) }));
  for (let i = 0; i < 9; i++) raw(rose(u[0] - uw + R() * uw * 2, u[1] - k * 0.6 - R() * 40, 12 + R() * 8, R() < 0.5 ? PINK : LILAC, { eye: i === 4 }));
  for (let i = 0; i < 3; i++) { const p0 = [u[0] - uw * 0.6 + i * uw * 0.6, u[1] - k * 0.6], cn = [p0, [p0[0] + 20 - i * 10, p0[1] + 60], [p0[0] + 10 - i * 14, p0[1] + 140]]; raw(line(cn, 2.4, INK) + line(cn, 1.4, '#5a5a3e') + rose(cn[2][0], cn[2][1], 10, LILAC)); }
}
{
  // right: rose canes hanging into the frame from above, thorns, hips and rotting blooms; a bloom with an eye
  for (let j = 0; j < 5; j++) { const x0 = W - 140 + j * 30, pts = [[x0, -5], [x0 + (R() - 0.5) * 40, 120 + j * 20], [x0 + (R() - 0.5) * 60, 220 + j * 30]]; raw(line(pts, 3.2, INK) + line(pts, 1.8, '#4a4a32'));
    for (let t = 0; t < 8; t++) { const p = pts[1][1] * t / 8; raw(pline([[x0 + (pts[1][0] - x0) * t / 8, p], [x0 + (pts[1][0] - x0) * t / 8 + 5, p - 3]], 1.4, INK)); }
    raw(rose(pts[2][0], pts[2][1], 14 + R() * 6, j % 2 ? PINK : LILAC, { eye: j === 2 }) + `<ellipse cx="${f1(pts[1][0] + 6)}" cy="${f1(pts[1][1])}" rx="4" ry="5" fill="#8a6a50" stroke="${INK}" stroke-width="0.8"/>`); }
  raw(mould(W - 40, H - 30, 60, 20, { col: MOULD }) + caps(W - 80, H - 6, 40, 4, { col: YEL, n: 4 }));
}
// petals and spore drifting across the front
{ let m = ''; for (let k = 0; k < 40; k++) { const x = R() * W, y = R() * H, col = [PINK, LILAC, YEL][k % 3]; m += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1.5 + R() * 2)}" ry="${f1(0.8 + R())}" transform="rotate(${f1(R() * 180)} ${f1(x)} ${f1(y)})" fill="${col}" stroke="${INK}" stroke-width="0.4" opacity="0.7"/>`; } raw(m); }

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `garden_walk_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, 'garden_walk.camera.json'), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log('garden_walk layers written');
