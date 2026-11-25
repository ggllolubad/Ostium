// World VIII, the Sundered Rime: THE BREACH (battle room, Living Ink). The hold's deepest working, a hall dug into the
// glacier, where the miners broke into fire coming up. Same contract as the nave: 1480 x 480, far (opaque) / mid / fore
// (transparent), battle camera horizon 300, eye 1.2 m, focal 652, cx 740, fighters at 6 m with feet on y 430.
// Lore (bible/world_VIII_sundered_rime.md): a northern hold of miners and shieldmaidens built on a glacier; the miners dug
// down and met fire coming up; everything half frozen and half burning, and the strain shows as cracks. Palette: white
// ice split by orange seams, black obsidian (plus timber, iron, bone, grey).
// What is placed:
//   - the glacier's ice face, faceted in broad planes, banded with the dirty yearly strata of the ice (its "courses")
//   - the split: the left of the hall still frozen (rime, icicles, the timbered headframe over the old shaft), the right
//     of it burning (an obsidian flow that poured out of an upper gallery and froze mid-fall, glowing seams in its black)
//   - the great crack across the ice face between them: glowing at its root by the flow, white at its tips, steaming
//   - upper galleries (adits) cut by the miners, timber-framed, charred inside and frosted outside, molten within
//   - the headframe: two rimed timber legs, the pulley wheel, the hoist chain going down into the shaft, its ore bucket
//   - miners' tally marks cut beside an adit, a lashed-pole ladder to the upper galleries, iron spikes in the ice
//   - ore-cart rails across the floor to the shaft; a tipped ore cart, ore lumps glowing under frost, a dropped pick
//   - fore: a rimed pit prop hung with icicles (frost side), an obsidian mass with a glowing seam and steam (fire side)
// Lightning is not this world's course and nothing of it is drawn. No eyes (not a void world). Red not used.
// Usage: node scenes/bg_rime_breach.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VIII');
const W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 8101, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1c2a38' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, glow, smooth, GLOW, EM, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#0c1217' });
const { fog, line, pline, fillP, fillS, inkP, blob, jag, lump, box, post, beam, icicles, rime, seam, seamTree, ash, char, chain, steam, quiet } = B;

const ICE = '#e2edf3', ICE2 = '#b9cdda', ICE3 = '#86a4b8', ICED = '#567286', DEEP = '#22323e', OBS = '#16131a', OBS2 = '#2a2630', OR = '#ff8a2a', HOT = '#ffd98a', TIM = '#4a3624', IRON = '#3a3838', MURK = B.MURK;
const ZW = 17, YT = 9;                       // the ice face; its top meets the ice roof
const atW = (s, t) => [-22 + s, t, ZW];
const SPLIT = 1.4;                           // the X where frozen meets burning across the face

// ---- the faceted ice face: a jittered lattice split into triangles, each facet its own tone (facing the light or not),
// glacier strata (dirty yearly bands) sweeping across the facets, blue fracture lines, rime on the facets' upper edges.
function iceFace(x0, x1, y0, y1, Z, o = {}) {
  // Voronoi plates of ice, each a low faceted boss: split into triangles from an off-centre apex, every facet toned by the
  // way it faces (toward the upper-left key light: pale; away: blue-grey and hatched), so the face reads lit and carved
  const cells = B.voronoi(B.seedsIn(x0, x1, y0, y1, o.cw || 3.2, o.rh || 2.0, 0.9), x0, x1, y0, y1);
  let s = '';
  for (const { seed, poly } of cells) {
    const ap = [seed[0] + (R() - 0.5) * 0.6, seed[1] + (R() - 0.5) * 0.4], lo = seed[1] < 3.0;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], mx = (a[0] + b[0]) / 2 - ap[0], my = (a[1] + b[1]) / 2 - ap[1], ml = Math.hypot(mx, my) || 1;
      const face = (-mx * 0.62 + my * 0.78) / ml;       // facet leaning toward the upper left faces the key light
      let col = face > 0.35 ? ICE : face > -0.1 ? ICE2 : face > -0.55 ? ICE3 : mix(ICE3, ICED, 0.55);
      if (o.burn && seed[0] > SPLIT + 2) col = mix(col, '#4a3e42', Math.min(0.6, (seed[0] - SPLIT - 2) * 0.09));
      col = fog(col, Z, 0.55);
      if (lo) col = mix(col, MURK, seed[1] < 1.6 ? 0.62 : 0.45);
      const ps = [ap, a, b].map(([X, Y]) => P(X, Y, Z));
      s += `<path d="${p2(ps)}" fill="${col}"/>`;
      if (face < -0.1) s += `<path d="${p2(ps)}" fill="${S.hatchA(Z)}" opacity="${lo ? 0.5 : face < -0.55 ? 0.45 : 0.25}"/>`;
      if (face < -0.55) s += `<path d="${p2(ps)}" fill="${S.hatchB(Z)}" opacity="0.25"/>`;
      if (face > 0.35 && !lo) s += pline([ps[1], ps[2]], 0.9, '#f8fcfe', 0.55);
    }
    s += `<path d="${p2(poly.map(([X, Y]) => P(X, Y, Z)))}" fill="url(#mottle)" opacity="0.2"/>`;
    // the plate's edge: heavy ink on the sides turned from the light, thin elsewhere
    const pps = poly.map(([X, Y]) => P(X, Y, Z));
    s += `<path d="${p2(pps)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.5, inkW(Z) * 0.5))}" opacity="${lo ? 0.35 : 0.6}"/>`;
    // miners' pick scars: the hall was dug by hand
    if (!lo && R() < 0.75) { const c = P(seed[0] + (R() - 0.5), seed[1] + (R() - 0.5) * 0.6, Z); s += B.pickScars(c[0], c[1], K(Z) * (0.18 + R() * 0.12), 3 + Math.floor(R() * 4), 0.9 + (R() - 0.5) * 0.6, { w: 0.9, op: 0.55 }); }
  }
  // strata: dirty yearly bands sweeping across, bent by the ice's flow
  for (let k = 0; k < (o.strata || 9); k++) {
    const yb = y0 + 1.2 + (y1 - y0 - 1.2) * (k + R() * 0.6) / (o.strata || 9), pts = [];
    for (let i = 0; i <= 24; i++) { const X = x0 + (x1 - x0) * i / 24; pts.push(P(X, yb + Math.sin(i * 0.35 + k) * 0.35 + (X > SPLIT ? -(X - SPLIT) * 0.06 : 0), Z)); }
    const lo = yb < 3.0;
    s += line(pts, Math.max(0.8, K(Z) * (0.02 + R() * 0.03)), lo ? mix(DEEP, MURK, 0.6) : '#3c4a52', lo ? 0.3 : 0.45) + line(pts.map(([px, py]) => [px, py + 2]), 0.6, '#eef6fa', lo ? 0.1 : 0.3);
  }
  // fractures: thin white-lipped lines in the ice, branching (smooth, never zigzag)
  for (let k = 0; k < (o.fract || 10); k++) { const X = x0 + R() * (x1 - x0), Y = 3.6 + R() * (y1 - 4); s += S.crack(atW, X + 22, Y, 0.8 + R() * 1.2, Math.PI * (R() < 0.5 ? 0.15 : 0.85) + (R() - 0.5) * 0.5, { w: 0.6, lip: '#f2fbff', op: 0.5, branch: 1 }); }
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the ice roof overhead: the glacier's underside, crosshatched dark, with the miners' pick scars and the roof's own icicles
{
  const roof = [[-30, YT, ZW], [30, YT, ZW], [30, YT, 4], [-30, YT, 4]];
  raw(`<path d="${pp(roof)}" fill="${mix(DEEP, ICED, 0.25)}"/>` + hatch3((s, t) => [-30 + s, YT, 4 + t], 0, 60, 0, ZW - 4, 0.6, { op: 0.5 }) + hatch3((s, t) => [-30 + s, YT, 4 + t], 0, 60, 0, ZW - 4, -0.7, { op: 0.4 }));
  for (let k = 0; k < 40; k++) { const X = -26 + R() * 52, Z = 6 + R() * 10, a = P(X, YT, Z), l = K(Z) * (0.3 + R() * 0.4); raw(pline([[a[0], a[1]], [a[0] + l, a[1] + l * 0.1]], Math.max(0.5, K(Z) * 0.01), '#7a92a2', 0.4)); }
}
// ---- the ice face
raw(iceFace(-22, 22, 0, YT, ZW, { burn: true }));
// the roof's edge where it meets the face: rime and icicles along it
{ const e = []; for (let i = 0; i <= 30; i++) e.push(P(-22 + 44 * i / 30, YT - 0.05, ZW)); raw(icicles(e, ZW, { len: 30, dens: 0.9, col: mix(ICE, MURK, 0.1) })); }

// ---- upper galleries (adits) cut into the face: timber-framed, charred inside and frosted outside, molten within
function adit(X, Y, w, h, o = {}) {
  const Z = ZW - 0.05, dep = 3.5, f = [[X - w / 2, Y], [X + w / 2, Y], [X + w / 2 + 0.05, Y + h], [X - w / 2 - 0.05, Y + h]];
  const F = f.map(([x, y]) => P(x, y, Z)), Bk = f.map(([x, y]) => P(x * 0.97, y + (Y + h / 2 - y) * 0.25, Z + dep));
  // the gallery going back, seen through the opening (clipped to it): walls, roof and floor in stepped molten tones, the far end hottest
  const ca = S.id('ad'); raw(`<clipPath id="${ca}"><path d="${p2(F)}"/></clipPath><g clip-path="url(#${ca})">`);
  raw(fillP(F, '#3a160a'));
  raw(EM(fillP([F[0], F[1], Bk[1], Bk[0]], '#c24e14', 0.9) + fillP([F[3], F[2], Bk[2], Bk[3]], '#5a2410') + fillP(Bk, o.dead ? '#5a2410' : OR) + (o.dead ? '' : fillP(Bk.map(([x, y]) => [x + (Bk[0][0] + Bk[2][0]) / 2 * 0 + ((Bk[0][0] + Bk[2][0]) / 2 - x) * 0.4, y + ((Bk[0][1] + Bk[2][1]) / 2 - y) * 0.4]), HOT, 0.85))));
  raw(`<path d="${p2([F[3], F[2], Bk[2], Bk[3]])}" fill="${S.hatchA(Z)}" opacity="0.55"/>` + `<path d="${p2([F[0], F[3], Bk[3], Bk[0]])}" fill="#2a0e06" opacity="0.6"/><path d="${p2([F[1], F[2], Bk[2], Bk[1]])}" fill="#7a3010" opacity="0.6"/>`);
  raw('</g>');
  if (!o.dead) raw(GLOW(`<ellipse cx="${f1((F[0][0] + F[2][0]) / 2)}" cy="${f1((F[0][1] + F[2][1]) / 2)}" rx="${f1(K(Z) * w * 1.2)}" ry="${f1(K(Z) * h * 0.9)}" fill="${OR}" opacity="0.12" filter="url(#soft)"/>`));
  // timber set: two posts and a lintel; charred on their inner faces, rimed on their outer
  const pw = 0.22;
  for (const sx of [-1, 1]) { const xx = X + sx * (w / 2 + pw / 2), q = [P(xx - pw / 2, Y - 0.05, Z - 0.1), P(xx + pw / 2, Y - 0.05, Z - 0.1), P(xx + pw / 2, Y + h + 0.1, Z - 0.1), P(xx - pw / 2, Y + h + 0.1, Z - 0.1)];
    raw(cel(q, { Z, fill: fog(TIM, Z, 0.8), tex: 'url(#mottle)', texOp: 0.4 }));
    const inner = sx < 0 ? [q[1], q[2]] : [q[0], q[3]]; raw(line(inner, K(Z) * 0.07, '#120a06', 0.9) + seam(jag(inner[0], inner[1], 5, 1), 0.8, { glowW: 4, glowOp: 0.1 }));
    const outer = sx < 0 ? [q[3], q[0]] : [q[2], q[1]]; raw(rime(jag(outer[0], outer[1], 5, 0.8), Z, { th: 2.2 })); }
  const L = [P(X - w / 2 - pw - 0.1, Y + h, Z - 0.12), P(X + w / 2 + pw + 0.1, Y + h, Z - 0.12), P(X + w / 2 + pw + 0.1, Y + h + 0.28, Z - 0.12), P(X - w / 2 - pw - 0.1, Y + h + 0.28, Z - 0.12)];
  raw(cel(chip(L, 0.3), { Z, fill: fog(mix(TIM, '#000', 0.15), Z, 0.8), tex: 'url(#mottle)', texOp: 0.4 }) + line([L[0], L[1]], K(Z) * 0.04, '#120a06', 0.8));
  raw(rime(jag(L[3], L[2], 8, 0.6), Z, { th: 3 }) + icicles(jag(L[0], L[1], 6, 0.4), Z, { len: K(Z) * 0.35, dens: 0.8, ph: X }));
}
adit(-13.2, 4.6, 1.4, 1.8, { dead: true });
adit(-4.4, 5.0, 1.3, 1.7);
adit(4.0, 5.6, 1.2, 1.6);
// miners' tally marks cut into the ice beside the left-centre adit: groups of four struck through
{ let tl = ''; for (let g = 0; g < 5; g++) { const X0 = -6.1 - g * 0.45, Y0 = 5.2 + (g % 2) * 0.05; for (let k = 0; k < 4; k++) { const A = P(X0 + k * 0.07, Y0, ZW - 0.05), Bp = P(X0 + k * 0.07 + 0.01, Y0 + 0.4, ZW - 0.05); tl += `M${f1(A[0])} ${f1(A[1])} L${f1(Bp[0])} ${f1(Bp[1])} `; } if (g < 4) { const A = P(X0 - 0.05, Y0 + 0.05, ZW - 0.05), Bp = P(X0 + 0.3, Y0 + 0.35, ZW - 0.05); tl += `M${f1(A[0])} ${f1(A[1])} L${f1(Bp[0])} ${f1(Bp[1])} `; } }
  raw(`<path d="${tl}" stroke="${INK}" stroke-width="1" opacity="0.85"/><path d="${tl}" transform="translate(0.8,0.8)" stroke="#eef6fa" stroke-width="0.6" opacity="0.5"/>`); }
// iron spikes driven into the face, with a hanging rope, and the lashed-pole ladder up to the left adit
for (const [X, Y] of [[-9.5, 6.4], [-8.2, 7.1], [-15.4, 6.9], [7.5, 7.4]]) { const a = P(X, Y, ZW - 0.05); raw(pline([[a[0], a[1]], [a[0] + 4, a[1] + 1.5]], 2.2, INK) + pline([[a[0], a[1]], [a[0] + 4, a[1] + 1.5]], 1.1, IRON)); }
{ const r0 = P(-9.5, 6.4, ZW - 0.1); raw(line([[r0[0] + 3, r0[1] + 1], [r0[0] + 5, r0[1] + 18], [r0[0] + 3, r0[1] + 34]], 2.2, INK) + line([[r0[0] + 3, r0[1] + 1], [r0[0] + 5, r0[1] + 18], [r0[0] + 3, r0[1] + 34]], 1.2, '#7a6a4e')); }
{
  const Z = ZW - 0.4, xa = -14.3, xb = -13.6;
  for (const X of [xa, xb]) { const A = P(X - 0.2, 0, Z), Bp = P(X + 0.25, 4.6, Z); raw(line([A, Bp], 3.2, INK) + line([A, Bp], 1.9, fog(TIM, Z))); }
  for (let k = 1; k < 12; k++) { const t = k / 12, A = P(xa - 0.2 + 0.45 * t, 4.6 * t, Z), Bp = P(xb - 0.2 + 0.45 * t, 4.6 * t + 0.03, Z); if (t * 4.6 < 3.0) continue; raw(pline([A, Bp], 2.4, INK) + pline([A, Bp], 1.2, fog('#6a543a', Z))); const m = P(xa - 0.2 + 0.45 * t, 4.6 * t, Z); raw(`<circle cx="${f1(m[0])}" cy="${f1(m[1])}" r="1.2" fill="#8a7a5a" stroke="${INK}" stroke-width="0.4"/>`); }
  for (let k = 1; k < 7; k++) { const t = k / 12, A = P(xa - 0.2 + 0.45 * t, 4.6 * t, Z), Bp = P(xb - 0.2 + 0.45 * t, 4.6 * t + 0.03, Z); raw(pline([A, Bp], 2, INK, 0.8) + pline([A, Bp], 1, mix(TIM, MURK, 0.6))); }
}

// ---- the burning side: an obsidian flow that broke out of an upper gallery and froze mid-fall, pouring down the face
// to the floor as a cascade of stacked lobes (each lobe a tongue of black glass bulging over the one below). Glowing
// seams where the lobes overlap in the upper body; rimed on the windward (left) flanks; icicles off the lobe lips.
{
  const Z = ZW - 0.6, sx = 8.4;
  // soot and heat stain on the ice above and round the flow; meltwater runs refrozen down the face beside it
  raw(S.soot(atW, 27.5, 34.0, 7.6, 9.0, { op: 0.08 }));
  for (let k = 0; k < 4; k++) { const X = 11 + R() * 4, Y = 5.5 + R() * 2.5, a = P(X, Y, ZW), b = P(X + (R() - 0.5) * 0.2, Y - 0.8 - R() * 1.2, ZW); raw(line([a, b], 3 + R() * 2, '#d8e6ee', 0.18) + icicles([[b[0] - 4, b[1]], [b[0] + 4, b[1]]], ZW, { len: 8, dens: 3 })); }
  // the flow: one tall tongue of black glass from the breached gallery to a fan on the floor, its outline lumpy where it
  // slumped. Its skin is a crust of plates (Voronoi), each faceted and taking the key light like black glass; in the upper
  // body the plates have parted and the cracks between them glow; low down (the fighters' band) the cracks are dull.
  const outl = [];
  for (let k = 0; k <= 14; k++) { const t = k / 14, Y = 7.15 - t * 7.15, wv = 1.05 + t * t * 2.4 + Math.sin(t * 13) * 0.18 + (R() - 0.5) * 0.12; outl.push([sx - wv - t * 0.6 + Math.sin(t * 4) * 0.3, Y]); }
  const outr = []; for (let k = 14; k >= 0; k--) { const t = k / 14, Y = 7.15 - t * 7.15, wv = 1.15 + t * t * 2.0 + Math.sin(t * 11 + 2) * 0.2 + (R() - 0.5) * 0.12; outr.push([sx + wv - t * 0.3 + Math.sin(t * 4) * 0.3, Y]); }
  const outline = [...outl, ...outr], ops = outline.map(([X, Y]) => P(X, Y, Z)), cf = S.id('fl');
  // the breach in the gallery wall above it: a ragged dark opening, the molten pool showing low inside
  const mo = [[6.8, 7.2], [7.6, 6.9], [8.6, 7.0], [9.6, 6.9], [10.2, 7.3], [10.1, 8.0], [9.3, 8.45], [8.3, 8.3], [7.4, 8.4], [6.9, 7.9]].map(([x, y]) => P(x, y, ZW - 0.05));
  { const c = mo.reduce((a, p) => [a[0] + p[0] / mo.length, a[1] + p[1] / mo.length], [0, 0]), cm = S.id('mo');
    raw(`<clipPath id="${cm}"><path d="${p2(mo)}"/></clipPath><g clip-path="url(#${cm})">` + fillP(mo, '#140806') + EM(fillS(blob(c[0], c[1] + 14, 70, 14, 11, 0.4), '#a8400f') + fillS(blob(c[0] + 4, c[1] + 17, 46, 8, 10, 0.4), OR) + fillS(blob(c[0] + 6, c[1] + 19, 20, 4, 9, 0.4), HOT)) + `<path d="${p2(mo)}" fill="${S.hatchA(ZW)}" opacity="0.45"/></g>` + inkP(mo, 1.6) + rime(mo.slice(5).reverse(), ZW, { th: 2.6 }));
    raw(GLOW(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1] + 30)}" rx="120" ry="90" fill="${OR}" opacity="0.13" filter="url(#soft)"/>`)); }
  raw(`<clipPath id="${cf}"><path d="${smooth(ops, true, 0.35)}"/></clipPath>` + `<path d="${smooth(ops, true, 0.35)}" fill="${INK}"/>`);
  raw(`<g clip-path="url(#${cf})">`);
  const sd = []; for (let k = 0; k < 150; k++) sd.push([sx - 4.6 + R() * 9.2, Math.pow(R(), 0.8) * 7.4]); const cells = B.voronoi(sd, sx - 5, sx + 5, 0, 7.8);
  for (const { seed, poly } of cells) {
    const lo = seed[1] < 3.0, hot = seed[1] > 3.4, kk = hot ? 0.68 + R() * 0.24 : 0.86 + R() * 0.08, sh = poly.map(([X, Y]) => [seed[0] + (X - seed[0]) * kk, seed[1] + (Y - seed[1]) * kk]);
    const ap = [seed[0] - 0.08, seed[1] + 0.06];
    // the gap round the plate: molten where it has parted (upper body), dull ember low down
    if (hot) raw(EM(fillP(poly.map(([X, Y]) => P(X, Y, Z)), seed[1] > 5 ? OR : '#c24e14')) + fillP(poly.map(([X, Y]) => P(X, Y, Z)), '#000', 0.15));
    else raw(fillP(poly.map(([X, Y]) => P(X, Y, Z)), lo ? '#2a1208' : '#5a2210'));
    for (let i = 0; i < sh.length; i++) { const a = sh[i], b2 = sh[(i + 1) % sh.length], mx = (a[0] + b2[0]) / 2 - ap[0], my = (a[1] + b2[1]) / 2 - ap[1], face = (-mx * 0.62 + my * 0.78) / (Math.hypot(mx, my) || 1);
      let col = face > 0.4 ? '#4a4a56' : face > 0 ? OBS2 : OBS; if (lo) col = mix(col, MURK, 0.25);
      const ps = [ap, a, b2].map(([X, Y]) => P(X, Y, Z)); raw(fillP(ps, col)); if (face < 0) raw(`<path d="${p2(ps)}" fill="${S.hatchA(Z)}" opacity="0.4"/>`); if (face > 0.4) raw(pline([ps[1], ps[2]], 0.9, lo ? '#4a5660' : '#a8b6c0', 0.7)); }
    raw(inkP(sh.map(([X, Y]) => P(X, Y, Z)), 0.9, 0.9));
    if (hot && R() < 0.3) raw(steam(...P(seed[0], seed[1], Z), 26, { n: 1, op: 0.2 }));
  }
  raw('</g>');
  raw(`<path d="${smooth(ops, true, 0.35)}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  if (true) { raw(GLOW(`<path d="${smooth(ops.filter(p => p[1] < P(0, 3.6, Z)[1]), false, 0.35)}" stroke="${OR}" stroke-width="16" opacity="0.1" fill="none" filter="url(#soft)"/>`)); }
  // frost stilled it: rime on the windward (left) flank, icicles off its slumps
  raw(rime(outl.slice(1, 9).map(([X, Y]) => P(X, Y, Z)).reverse(), Z, { th: 4 }));
  for (const k of [3, 6]) { const [X, Y] = outl[k]; raw(icicles([P(X - 0.1, Y, Z), P(X + 0.6, Y - 0.05, Z)], Z, { len: 14, dens: 1.6 })); }
  raw(steam(...P(sx + 2.6, 5.2, Z), 80, { n: 3, op: 0.24 }) + steam(...P(sx - 1.8, 4.4, Z), 60, { n: 2, op: 0.2 }));
}

// ---- the great crack across the face: a split opening out of the flow's flank and running left over the galleries,
// wide and glowing at its root, narrowing to a white frosted fracture at its tips, steam off its hot length.
{
  const pts = [[6.4, 5.0], [5.0, 5.35], [3.6, 4.95], [2.0, 5.35], [0.5, 4.85], [-1.1, 5.5], [-2.2, 6.2], [-2.9, 6.9], [-3.3, 7.5]];
  const n = pts.length, top = [], bot = [];
  for (let i = 0; i < n; i++) { const w = 0.12 * Math.pow(1 - i / (n - 1), 1.2) + 0.01, a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; top.push(P(pts[i][0] + nx * w * (0.7 + R() * 0.6), pts[i][1] + ny * w * (0.7 + R() * 0.6), ZW - 0.05)); bot.push(P(pts[i][0] - nx * w * (0.7 + R() * 0.6), pts[i][1] - ny * w * (0.7 + R() * 0.6), ZW - 0.05)); }
  const wedge = [...top, ...bot.reverse()];
  raw(fillP(wedge, '#0e0604') + inkP(wedge, 1.4));
  const mid = pts.map(([x, y]) => P(x, y, ZW - 0.05));
  raw(seam(mid.slice(0, 6), 1.5, { glowW: 7, glowOp: 0.22 }));
  raw(line(top.slice(0, n).map(([a, b]) => [a - 0.6, b - 1]), 1, '#f2fbff', 0.7));
  for (let k = 0; k < 4; k++) { const a = mid[k]; raw(seamTree(a[0], a[1], (R() < 0.5 ? -1 : 1) * Math.PI / 2 + (R() - 0.5), 18 + R() * 14, 1.0, { glowOp: 0.08 }, 1)); }
  for (let k = 5; k < 8; k++) raw(S.crack(atW, pts[k][0] + 22, pts[k][1], 0.9, (R() < 0.5 ? 0 : Math.PI) + (R() - 0.5), { w: 0.8, lip: '#f2fbff' }));
  raw(rime(top.slice(5, n), ZW, { th: 2.5 }));
  raw(steam(mid[2][0], mid[2][1] - 2, 60, { n: 3, op: 0.22 }) + steam(mid[4][0], mid[4][1], 46, { n: 2, op: 0.18 }));
}

// ---- the headframe over the old shaft (frozen side): two raking timber legs and a crossbeam, the pulley wheel, the hoist
// chain going down into the shaft mouth on the floor, the ore bucket hanging from it. Rimed on its windward faces.
{
  const Zs = 12.5, X = -7.0, top = 6.7;
  // shaft mouth: a timber collar on the floor round a black opening; far down, a dull ember line (kept dim: fighters' band)
  const rim = [[-1.4, -0.9], [1.4, -0.9], [1.4, 0.9], [-1.4, 0.9]].map(([dx, dz]) => P(X + dx, 0.02, Zs + dz));
  raw(fillP(rim, '#050608'));
  { const inner = rim.map(([x, y]) => [x + (rim[0][0] + rim[2][0]) / 2 * 0 , y]); raw(EM(fillS(blob((rim[0][0] + rim[2][0]) / 2, rim[0][1] - 3, 26, 2.2, 10, 0.4), '#7a2c0c', 0.8))); }
  for (const [a, b] of [[0, 1], [1, 2], [2, 3], [3, 0]]) { const A = rim[a], Bq = rim[b]; raw(line([A, Bq], K(Zs) * 0.16, INK) + line([A, Bq], K(Zs) * 0.11, mix(fog(TIM, Zs), MURK, 0.35))); }
  // legs
  const legs = [[X - 2.0, Zs - 0.9, X - 0.25, Zs], [X + 2.0, Zs - 0.9, X + 0.25, Zs], [X - 1.6, Zs + 1.4, X - 0.2, Zs + 0.1]];
  for (const [xa, za, xb, zb] of legs) raw(beam([xa, 0, za], [xb, top, zb], 0.26, fog(TIM, Zs, 0.9), { chip: true }));
  // cross braces
  raw(beam([X - 1.5, 2.6, Zs - 0.7], [X + 1.5, 2.6, Zs - 0.7], 0.18, mix(fog(TIM, Zs), MURK, 0.4)) + beam([X - 1.0, 4.4, Zs - 0.45], [X + 1.0, 4.4, Zs - 0.45], 0.18, fog(TIM, Zs, 0.9)));
  raw(beam([X - 0.9, top - 0.1, Zs - 0.2], [X + 0.9, top - 0.1, Zs - 0.2], 0.28, fog(TIM, Zs, 0.9)));
  // the pulley wheel: an iron-tyred timber wheel with spokes, rimed
  const c = P(X, top + 0.35, Zs - 0.25), r = K(Zs) * 0.62;
  raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="none" stroke="${INK}" stroke-width="${f1(r * 0.24)}"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="none" stroke="${fog(IRON, Zs)}" stroke-width="${f1(r * 0.15)}"/>`);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.2; raw(pline([c, [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]], r * 0.12, INK) + pline([c, [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]], r * 0.06, fog(TIM, Zs))); }
  raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.2)}" fill="${fog(IRON, Zs)}" stroke="${INK}" stroke-width="1"/>` + rime(Array.from({ length: 9 }, (_, k) => { const a = Math.PI + k / 8 * Math.PI * 0.75; return [c[0] + Math.cos(a) * r * 1.08, c[1] + Math.sin(a) * r * 1.08]; }), Zs, { th: 2.5 }));
  // the hoist chain down into the shaft, the ore bucket hanging from it, rimed and hung with icicles
  const ch0 = [c[0] + r, c[1]], ch1 = P(X + 0.62 * 0.9, 2.6, Zs - 0.25);
  raw(B.chain([ch0, ch1], 2.0, fog(IRON, Zs)) + B.chain([[c[0] - r, c[1]], P(X - 0.55, 0.3, Zs - 0.25)], 2.0, mix(fog(IRON, Zs), MURK, 0.5)));
  { const bx = ch1[0], by = ch1[1], bw = K(Zs) * 0.35, bh = K(Zs) * 0.45; const bq = [[bx - bw, by + 3], [bx + bw, by + 3], [bx + bw * 0.8, by + 3 + bh], [bx - bw * 0.8, by + 3 + bh]];
    raw(pline([[bx - bw, by + 3], [bx, by - 2], [bx + bw, by + 3]], 1.6, INK) + cel(bq, { Z: Zs, fill: fog('#4a4644', Zs), tex: 'url(#mottle)', texOp: 0.5 }) + fillS(blob(bx, by + 3, bw * 0.9, 3, 8, 0.5), '#1a1418') + EM(fillS(blob(bx + 2, by + 3, 4, 1.5, 7, 0.4), '#c24e14', 0.9)) + rime([[bx - bw, by + 3], [bx, by + 2], [bx + bw, by + 3]], Zs, { th: 2 }) + icicles([[bx - bw * 0.8, by + 3 + bh], [bx + bw * 0.8, by + 3 + bh]], Zs, { len: 8, dens: 2 })); }
  // rime on the legs' windward (left) edges, icicles off the crossbeam
  raw(icicles([P(X - 0.9, top - 0.24, Zs - 0.2), P(X + 0.9, top - 0.24, Zs - 0.2)], Zs, { len: 14, dens: 1.4 }) + icicles([P(X - 1.0, 4.31, Zs - 0.45), P(X + 1.0, 4.31, Zs - 0.45)], Zs, { len: 10, dens: 1.2, ph: 2 }));
  for (const [xa, za, xb, zb] of legs.slice(0, 2)) { const pts = []; for (let k = 4; k <= 10; k++) { const t = k / 10; pts.push(P(xa + (xb - xa) * t - 0.12, top * t, za + (zb - za) * t)); } raw(rime(pts.reverse(), Zs, { th: 2.4 })); }
  raw(steam(...P(X, 0.2, Zs), 110, { n: 3, op: 0.22, w: 30 }));
}

// ---- the floor: ice, scarred by cart wheels and boots, spattered with obsidian; the rails running to the shaft
{
  const Z0 = 4, Z1 = ZW;
  raw(`<path d="${pp([[-40, 0, Z0], [40, 0, Z0], [40, 0, Z1], [-40, 0, Z1]])}" fill="${mix(ICED, MURK, 0.5)}"/>`);
  // broad floor facets: big flat ice plates with pressure ridges between them
  let z = Z0; while (z < Z1) { const d = 1.4 + R() * 2.2; let X = -30 - R() * 3; while (X < 30) { const w = 2 + R() * 4, q = [[X, 0, z + d], [X + w, 0, z + d + (R() - 0.5) * 0.4], [X + w, 0, z], [X, 0, z + (R() - 0.5) * 0.4]].map(p => P(...p));
      if (q[1][0] > -20 && q[0][0] < W + 20) { let col = fog(mix(ICE2, ICED, 0.3 + R() * 0.4), z, 1.0); if (X > SPLIT + 1) col = mix(col, OBS2, Math.min(0.55, (X - SPLIT) * 0.08)); raw(cel(chip(q, 0.3), { Z: z, fill: mix(col, MURK, 0.38), band: Math.max(0.6, K(z) * 0.015), tex: 'url(#mottle)', texOp: 0.3, inkW: 0.5, heavy: 0.8, hi: false })); }
      X += w; } z += d; }
  // scratches and cart ruts in the ice
  for (let k = 0; k < 40; k++) { const X = -20 + R() * 40, Z = 4.5 + R() * 11, A = P(X, 0, Z), Bp = P(X + 0.6 + R(), 0, Z + (R() - 0.5) * 0.3); raw(pline([A, Bp], 0.6, '#c8d6de', 0.25)); }
  // the rails: two iron lines on timber sleepers from the front left to the shaft
  { const r = t => [-17 + t * 10.5, 0.03, 5.2 + t * 7.0]; for (let k = 0; k <= 22; k++) { const t = k / 22, [x, , zz] = r(t), A = P(x - 0.55, 0.02, zz + 0.4), Bp = P(x + 0.55, 0.02, zz - 0.4); raw(pline([A, Bp], K(zz) * 0.08, INK, 0.9) + pline([A, Bp], K(zz) * 0.05, mix(fog(TIM, zz), MURK, 0.45))); }
    for (const off of [-0.35, 0.35]) { const pts = []; for (let k = 0; k <= 20; k++) { const t = k / 20, [x, , zz] = r(t); pts.push(P(x + off * 0.8, 0.05, zz - off * 0.6)); } raw(line(pts, 2.4, INK, 0.9) + line(pts.map(([px, py]) => [px - 0.4, py - 0.6]), 0.8, '#7a8a96', 0.5)); } }
  // obsidian spatter and flows on the burning side; rime drifts banked against the face on the frozen side
  for (let k = 0; k < 14; k++) { const X = SPLIT + 1 + R() * 14, Z = 9 + R() * 7, c = P(X, 0, Z), rx = K(Z) * (0.3 + R() * 0.9); raw(lump(blob(c[0], c[1], rx, rx * 0.22, 10, 0.5), Z, mix(OBS, MURK, 0.2), { band: 1.2 })); if (R() < 0.35) raw(seam(jag([c[0] - rx * 0.6, c[1]], [c[0] + rx * 0.5, c[1] + 1], 4, 1), 0.5, { core: '#8a3410', hot: '#b2541a', glowOp: 0.04 })); }
  for (let k = 0; k < 9; k++) { const X = -20 + k * 2.4 + R(), Z = ZW - 0.4 - R() * 1.2, pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(P(X + 2.6 * t, Math.sin(t * Math.PI) * (0.3 + R() * 0.15), Z)); } raw(fillS([P(X, 0, Z), ...pts, P(X + 2.6, 0, Z)], mix(ICE2, MURK, 0.55), 0.8) + line(pts, 0.8, INK, 0.5)); }
  // the front of the floor (below the feet): stepped darker, ragged hatch
  raw(hatch3((s, t) => [-40 + s, 0, 4 + t], 0, 80, 0, 1.4, 0.25, { op: 0.35, ragged: 0.3 }));
}
// ---- the quiet zone: the face and floor stepped down toward the murk where the fighters stand
raw(quiet([[236, 0.14], [268, 0.14], [300, 0.12], [340, 0.12]], { col: MURK, hop: 0.16 }));
// embers and ash drifting up on the burning side; frost motes on the frozen side
raw(ash(50, 760, 1480, 20, 260, { r: 1.8, op: 0.45 }));
{ let m = ''; for (let k = 0; k < 90; k++) m += `<circle cx="${f1(R() * 720)}" cy="${f1(R() * 260)}" r="${f1(0.5 + R() * 0.9)}" fill="#eaf4fa" opacity="${f1(0.15 + R() * 0.35)}"/>`; raw(m); }
{ let m = ''; for (let k = 0; k < 40; k++) m += `<circle cx="${f1(800 + R() * 680)}" cy="${f1(R() * 230)}" r="${f1(0.6 + R() * 0.8)}" fill="${HOT}" opacity="${f1(0.3 + R() * 0.5)}"/>`; raw(EM(m)); }

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
// the tipped ore cart beside the rails (frozen side): its box on its side, the ore spilled, glowing dull under frost
{
  const Z = 10.2, X = -11.6;
  raw(box(X - 0.7, X + 0.7, 0.18, 0.78, Z - 0.45, Z + 0.45, { col: mix(fog('#4a3a2a', Z), MURK, 0.4), shadeOp: 0.5 }));
  for (const dx of [-0.45, 0.45]) { const c = P(X + dx, 0.18, Z - 0.46), r = K(Z) * 0.18; raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${mix(fog(IRON, Z), MURK, 0.3)}" stroke="${INK}" stroke-width="1.2"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.3)}" fill="${INK}"/>`); }
  for (let k = 0; k < 9; k++) { const c = P(X + 0.9 + R() * 1.5, 0.08, Z - 0.6 + R() * 0.9), r = K(Z) * (0.07 + R() * 0.08); raw(lump(blob(c[0], c[1], r, r * 0.7, 7, 0.4), Z, mix(OBS2, MURK, 0.2), { band: 1 })); if (R() < 0.5) raw(EM(fillS(blob(c[0] + 1, c[1] + 1, r * 0.35, r * 0.2, 6, 0.4), '#7a2c0c', 0.9))); }
  raw(rime([P(X - 0.7, 0.78, Z - 0.45), P(X, 0.8, Z - 0.45), P(X + 0.7, 0.78, Z - 0.45)], Z, { th: 2, op: 0.6 }));
}
// a dropped pick and frozen ore sledge runners (low, dark)
{ const Z = 8.8, a = P(-3.2, 0.05, Z), b = P(-2.1, 0.08, Z - 0.2); raw(line([a, b], 3, INK) + line([a, b], 1.6, mix('#5a4630', MURK, 0.4))); raw(pline([[b[0] - 3, b[1] - 5], [b[0] + 1, b[1]], [b[0] + 5, b[1] + 2]], 3.4, INK) + pline([[b[0] - 3, b[1] - 5], [b[0] + 1, b[1]], [b[0] + 5, b[1] + 2]], 1.8, mix(IRON, MURK, 0.3))); }
// obsidian boulders on the burning side, low and dark with only a dull seam
for (const [X, Z, r] of [[9.5, 10.5, 0.55], [12.0, 9.2, 0.4], [6.6, 11.8, 0.45]]) { const c = P(X, r * 0.6, Z), rr = K(Z) * r; raw(lump(blob(c[0], c[1], rr, rr * 0.75, 10, 0.35), Z, mix(OBS, MURK, 0.15), { band: rr * 0.3 })); raw(seam(jag([c[0] - rr * 0.4, c[1] - rr * 0.2], [c[0] + rr * 0.3, c[1] + rr * 0.4], 4, 1.2), 0.6, { core: '#7a2c0c', hot: '#a8481a', glowOp: 0.04 })); raw(rime([[c[0] - rr, c[1]], [c[0] - rr * 0.5, c[1] - rr * 0.7], [c[0], c[1] - rr * 0.75]], Z, { th: 1.6, op: 0.55 })); }

// ======================================================================== FORE: framing at the edges, over the fighters
layer('fore');
{
  // left: a rimed pit prop and its cap timber, hung with icicles; snow banked at its foot
  const Z = 4.3, X = -6.2;
  raw(post(X, Z, 0.24, -1, 7, mix(TIM, '#0a0806', 0.45), { shadeOp: 0.55 }));
  raw(beam([X - 2.5, 4.45, Z], [X + 0.6, 4.6, Z], 0.4, mix(TIM, '#0a0806', 0.5)));
  { const pts = []; for (let k = 0; k <= 12; k++) pts.push(P(X - 0.24, 0.2 + k * 0.4, Z - 0.24)); raw(rime(pts.reverse(), Z, { th: 4 })); }
  raw(icicles([P(X - 2.5, 4.25, Z), P(X + 0.6, 4.4, Z)], Z, { len: 60, dens: 0.9, wmul: 1.2 }));
  raw(rime([P(X - 2.5, 4.65, Z), P(X + 0.6, 4.8, Z)], Z, { th: 6 }));
  const bank = []; for (let k = 0; k <= 10; k++) bank.push([k * 26 - 10, H - 26 - Math.sin(k / 10 * Math.PI) * 26 - R() * 6]);
  raw(cel([[-10, H + 4], ...bank, [260, H + 4]], { Z: 3.6, fill: mix(ICE2, '#1a2630', 0.55), band: 4 }) + rime(bank, 3.6, { th: 4 }));
}
{
  // right: an obsidian mass breaking the floor, a glowing seam down it, steam rising, charred timber jammed under it
  const pts = [[W + 10, H + 5], [W - 210, H + 5], [W - 190, H - 40], [W - 150, H - 78], [W - 120, H - 92], [W - 70, H - 150], [W - 30, H - 170], [W + 10, H - 175]];
  raw(cel(pts, { Z: 3.6, fill: OBS, band: 8 }) + `<path d="${p2(pts)}" fill="url(#mottle)" opacity="0.35"/>` + `<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.35"/>`);
  for (let k = 0; k < 7; k++) { const x = W - 180 + R() * 170, y = H - 20 - R() * 120, r = 10 + R() * 14; const arc = `M${f1(x - r)} ${f1(y)} Q${f1(x - r * 0.2)} ${f1(y - r * 0.9)} ${f1(x + r)} ${f1(y - r * 0.2)}`; raw(`<path d="${arc}" stroke="${INK}" stroke-width="1.4" fill="none"/><path d="${arc}" transform="translate(-1.2,-1.2)" stroke="#6a7a86" stroke-width="1" fill="none" opacity="0.6"/>`); }
  raw(seamTree(W - 60, H - 150, 1.9, 120, 2.6, { glowOp: 0.14 }, 2));
  raw(beam([W - 260, 0.0, 4.0].map((v, i) => i === 0 ? 3.2 : v), [6.2, 0.55, 4.2], 0.3, mix(TIM, '#000', 0.55)));
  raw(char(P(4.6, 0.3, 4.1)[0], P(4.6, 0.3, 4.1)[1], 26, 9, { Z: 4 }));
  raw(steam(W - 90, H - 160, 140, { n: 3, op: 0.22, w: 20 }) + ash(18, W - 260, W, 120, 360, { r: 2.4, op: 0.5 }));
}
// the ice roof's lip across the top of the frame, hung with long icicles (frozen side) thinning over the burning side
{ const e = []; for (let k = 0; k <= 30; k++) e.push([k * W / 30, 6 + Math.sin(k * 0.7) * 4 + R() * 3]); raw(cel([[-5, -5], [W + 5, -5], ...e.slice().reverse()], { Z: 3.5, fill: mix(DEEP, ICED, 0.2), band: 4 }) + `<path d="${p2([[-5, -5], [W + 5, -5], ...e.slice().reverse()])}" fill="${S.hatchA(4)}" opacity="0.5"/>`);
  raw(icicles(e.slice(0, 16), 3.5, { len: 70, dens: 0.6, wmul: 1.1 }) + icicles(e.slice(15), 3.5, { len: 22, dens: 0.35, ph: 3 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `rime_breach_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, 'rime_breach.camera.json'), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log('rime_breach layers written');
