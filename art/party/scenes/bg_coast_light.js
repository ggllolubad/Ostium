// World VI, the Stormwrack Coast: THE FALSE LIGHT (round 2, group g2). Room key 'coast_light'.
// Contract as the nave: 1480 x 480 (shown at 2x); coast_light_far.svg (opaque), _mid.svg, _fore.svg (transparent); the battle
// camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounter: The Lighthouse (the keeper tends the false light: wrecker, lighthouse_keeper).
// The place (bible VI: "He keeps the light burning in the wrong place"): the top of the wreckers' lighthouse at night. The
// company stands on the stone gallery that rings the lantern room. Behind them the lantern burns: its stone base with the
// keeper's door, the glazing in diagonal iron astragals, inside it the great lamp in its drum lens of prism bands, blazing
// lamp yellow; the copper dome over it gone green, a conductor rod on the ventilator fused into a black knob with a burn
// running down the dome. The beams go out into the rain. The gallery's iron rail curves round behind the fighters and
// close past the camera; beyond it, far below, the sea, the reef, and a ship coming in to the false light.
// Courses: LIGHTNING (the fused conductor, burns down the dome and across the gallery slabs, the rail's iron fused at a
// joint, rain); WATER (everything streaming wet, the sea far below, spray flung up the tower).
// Light: night; the lamp's warm yellow is the only light (the warm side of the palette), a black-slate key everywhere else.
// Shapes: radial and curved: glazing bars, the round gallery and rail, the dome.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VI');
const W = 1480, H = 480, ROOM = 'coast_light';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2826, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#0c1014' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S);
const MURK = '#080a0e', AIR = '#141a20';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 8, airD: 30, airMax: 0.5 });
const { line, polyS } = BK;
const { ell } = require('../engine');
const LAMPY = '#e8c860', LAMPW = '#fff0b8', SLATE = '#3a4248', WET = '#c8d0d4', VERD = '#4f7d6c', SURF = '#e8ecea', IRON = '#2a2e32';
const CZ = 12, RL = 2.5, YB = 2.4, YG = 5.0, RG = 8.4;     // lantern centre Z, its radius, glazing base and top, gallery rail radius
const LC = P(0, 3.7, CZ - RL);
const LT = G.lightTint([{ p: [0, 3.7, CZ], col: '#d8b050', r: 9, k: 0.55 }]);

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the night sky: low cloud barely seen, lit where the beams cross it; rain everywhere
raw(G.skyGrad(0, 320, [[0, '#06080c'], [0.5, '#10161c'], [1, '#1c242a']]));
for (const [x, y, w, h] of [[260, 60, 520, 70], [1160, 40, 560, 80], [720, 150, 380, 40]]) raw(G.softMass(x, y, w, h, '#1a2228', { lit: '#5a5a48', dark: '#06080a', op: 0.85, litOp: 0.35 }));
// ---- plane 3: far below and away: the sea under the beam, the reef breaking white, and a ship standing in for the light
{
  raw(G.sea(-200, 200, 60, 900, '#141c22', { y: -42, lit: '#5a6a70', foam: 0.06, amp: 0.4, step: 0.05 }));
  // the beam laid on the water to the left, a pale wedge of the sea lit lamp yellow
  raw(`<path d="M${f1(LC[0])} 302 L120 306 L-20 330 L-20 340 L${f1(LC[0])} 304 Z" fill="${LAMPY}" opacity="0.12"/>`);
  for (let i = 0; i < 40; i++) { const u = R(), x = LC[0] - u * 760, y = 303 + u * 30 + (R() - 0.5) * 6; raw(`<path d="M${f1(x)} ${f1(y)} l${f1(-6 - u * 20)} 0" stroke="${LAMPY}" stroke-width="${f1(0.6 + u)}" opacity="${f1(0.2 + R() * 0.3)}"/>`); }
  // the reef and its breakers, and a ship coming in under sail toward them, her stern lantern lit
  for (const [x, w] of [[300, 60], [420, 34], [520, 50]]) raw(`<path d="M${x - w / 2} 316 q${w / 4} -5 ${w / 2} -6 q${w / 4} 1 ${w / 2} 6 Z" fill="#0a0e12"/>` + line([[x - w / 2 - 8, 316], [x + w / 2 + 6, 315]], 1.4, SURF, 0.6));
  { const sx = 230, sy = 312; raw(`<path d="M${sx - 18} ${sy} L${sx + 16} ${sy} L${sx + 12} ${sy + 4} L${sx - 14} ${sy + 4} Z" fill="#0a0c0e"/>` + `<path d="M${sx - 6} ${sy} L${sx - 6} ${sy - 26} L${sx + 6} ${sy - 4} Z M${sx + 6} ${sy} L${sx + 6} ${sy - 20} L${sx + 14} ${sy - 3} Z" fill="#3a4044" stroke="#0a0c0e" stroke-width="0.6"/>` + EM(`<circle cx="${sx + 15}" cy="${sy - 2}" r="1.2" fill="${LAMPY}"/>`) + glow(sx + 15, sy - 2, 8, 6, LAMPY, 0.5)); }
  raw(G.veil(296, 340, 0.3, AIR, { amp: 2 }));
}
// ---- the beams: two broad wedges of lamp light thrown from the lens through the rain, stepped, with the rain lit in them
{
  const beam = (x1, y1a, y1b, op) => { const g = S.id('bm'); S.DEFS.push(`<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="${f1(LC[0])}" y1="0" x2="${f1(x1)}" y2="0"><stop offset="0" stop-color="${LAMPW}" stop-opacity="${op * 3}"/><stop offset="0.5" stop-color="${LAMPY}" stop-opacity="${op * 1.2}"/><stop offset="1" stop-color="${LAMPY}" stop-opacity="0"/></linearGradient>`); for (const w of [1, 0.6]) { const ym = (y1a + y1b) / 2, h = (y1b - y1a) / 2 * w; raw(`<path d="M${f1(LC[0])} ${f1(LC[1] - 8 * w)} L${f1(x1)} ${f1(ym - h)} L${f1(x1)} ${f1(ym + h)} L${f1(LC[0])} ${f1(LC[1] + 8 * w)} Z" fill="url(#${g})" filter="url(#${G.blurId(6)})"/>`); } };
  beam(-40, 40, 230, 0.06); beam(W + 40, 20, 150, 0.05);
  raw(BK.rain(500, { x0: 0, x1: W, y0: 0, y1: 300, slant: 0.18, len: 16, col: LAMPW, op: 0.45, dens: (x, y) => { const u = (x - LC[0]) / (x < LC[0] ? -LC[0] : W - LC[0]), ya = x < LC[0] ? LC[1] + (135 - LC[1]) * u : LC[1] + (85 - LC[1]) * u, hh = (x < LC[0] ? 95 : 65) * u + 10; return Math.abs(y - ya) < hh ? 0.9 : 0.06; } }));
}
// ---- plane 1: the gallery's far rail curving round behind the lantern (seen either side of it), wet iron
{
  const rail = (Y, w, col, op = 1) => { const pts = []; for (let a = 0.15; a <= Math.PI - 0.15; a += 0.04) pts.push(P(Math.cos(a) * RG, Y, CZ + Math.sin(a) * RG * 0.9)); return line(pts, w, col, op); };
  raw(rail(1.05, 2.4, INK) + rail(1.05, 1.0, '#5a6268', 0.7) + rail(0.55, 1.6, INK));
  for (let a = 0.2; a < Math.PI - 0.15; a += 0.09) { const A = P(Math.cos(a) * RG, 0, CZ + Math.sin(a) * RG * 0.9), B = P(Math.cos(a) * RG, 1.05, CZ + Math.sin(a) * RG * 0.9); raw(line([A, B], 1.2, INK, 1)); }
}
// ---- the lantern room: stone base with the keeper's door, the glazing in diagonal astragals, the lamp and its drum lens,
// the copper dome gone green, the ventilator ball, the conductor fused black with a burn down the dome
{
  const cyl = (a, Y) => P(Math.sin(a) * RL, Y, CZ - Math.cos(a) * RL);
  const side = (Y0, Y1, a0, a1) => { const o = []; for (let a = a0; a <= a1 + 0.001; a += 0.05) o.push(cyl(a, Y0)); for (let a = a1; a >= a0 - 0.001; a -= 0.05) o.push(cyl(a, Y1)); return o; };
  // the base: dressed stone courses curving round, wet, lit warm above the door
  raw(cel(side(0, YB, -1.45, 1.45), { Z: CZ - RL, fill: '#2e3236', tex: 'url(#mottle)', texOp: 0.5, band: 18 }));
  for (let Y = 0.35; Y < YB; Y += 0.38) { const pts = []; for (let a = -1.45; a <= 1.45; a += 0.05) pts.push(cyl(a, Y)); raw(line(pts, 0.9, INK, 0.7)); }
  for (let a = -1.4; a < 1.4; a += 0.32) { const Y0 = Math.floor(R() * 5) * 0.38; raw(line([cyl(a, Y0), cyl(a, Y0 + 0.38)], 0.8, INK, 0.6)); }
  raw(`<path d="${p2(side(0, YB, -1.45, 1.45))}" fill="${S.hatchB(12)}" opacity="0.35"/>`);
  { const d = [cyl(-0.18, 0), cyl(0.18, 0), cyl(0.18, 1.9), cyl(0, 2.05), cyl(-0.18, 1.9)]; raw(`<path d="${p2(d)}" fill="#0a0806" stroke="${INK}" stroke-width="1.4"/>` + EM(`<path d="M${f1(d[0][0] + 3)} ${f1(d[0][1])} L${f1(d[1][0] - 3)} ${f1(d[1][1])} L${f1(d[1][0] - 3)} ${f1(d[1][1] - 6)} L${f1(d[0][0] + 3)} ${f1(d[0][1] - 6)} Z" fill="${LAMPY}" opacity="0.4"/>`)); }
  // the glazing: glass blazing with the lamp, the drum lens inside: a tall barrel of horizontal prism bands round the flame
  const gl = side(YB, YG, -1.45, 1.45);
  raw(`<path d="${p2(gl)}" fill="#c8a040"/>`);
  const cid = S.id('gl'); raw(`<clipPath id="${cid}"><path d="${p2(gl)}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(glow(LC[0], LC[1], 200, 160, LAMPW, 0.8));
  { const lc = P(0, 3.7, CZ), k = K(CZ), lw = k * 0.9, lh = k * 1.9;
    for (let j = 0; j < 13; j++) { const u = j / 12, y = lc[1] - lh / 2 + u * lh, w = lw * (0.75 + 0.25 * Math.sin(u * Math.PI)); raw(`<path d="M${f1(lc[0] - w)} ${f1(y)} Q${f1(lc[0])} ${f1(y + 3)} ${f1(lc[0] + w)} ${f1(y)}" stroke="${j === 6 ? LAMPW : '#a87828'}" stroke-width="${f1(j === 6 ? 4 : 1.6)}" fill="none" opacity="0.9"/>`); }
    raw(EM(`<path d="M${f1(lc[0] - lw * 0.25)} ${f1(lc[1] - 10)} L${f1(lc[0] + lw * 0.25)} ${f1(lc[1] - 10)} L${f1(lc[0] + lw * 0.2)} ${f1(lc[1] + 10)} L${f1(lc[0] - lw * 0.2)} ${f1(lc[1] + 10)} Z" fill="${LAMPW}"/>`));
    raw(line([[lc[0] - lw, lc[1] - lh / 2], [lc[0] - lw, lc[1] + lh / 2]], 2, '#6a4a18', 0.9) + line([[lc[0] + lw, lc[1] - lh / 2], [lc[0] + lw, lc[1] + lh / 2]], 2, '#6a4a18', 0.9)); }
  // the far side's astragals seen through the glass, thin and dim; the cylinder's shadow side darker
  for (let a0 = -3; a0 < 3; a0 += 0.42) { const pts = []; for (let Y = YB; Y <= YG; Y += 0.1) { const a = Math.PI - (a0 + (Y - YB) * 0.32); const q = P(Math.sin(a) * RL, Y, CZ - Math.cos(a) * RL); pts.push(q); } raw(line(pts, 1.2, '#8a6a28', 0.55)); }
  raw(`<path d="${p2(side(YB, YG, 0.55, 1.45))}" fill="#6a4a18" opacity="0.35"/><path d="${p2(side(YB, YG, 0.9, 1.45))}" fill="${S.hatchA(12)}" opacity="0.3"/><path d="${p2(side(YB, YG, -1.45, -1.05))}" fill="#fff4d0" opacity="0.18"/>`);
  // soot dulling the glass near the top; rain running down the panes
  raw(`<rect x="0" y="${f1(P(0, YG - 0.4, CZ - RL)[1])}" width="${W}" height="30" fill="#3a2a10" opacity="0.4"/>`);
  for (let i = 0; i < 40; i++) { const x = gl[0][0] + R() * (gl[Math.floor(gl.length / 2) - 1][0] - gl[0][0]), y = P(0, YG, CZ - RL)[1] + R() * 60; raw(`<path d="M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * 2)} ${f1(8 + R() * 30)}" stroke="#fff4d0" stroke-width="0.8" opacity="0.4"/>`); }
  // the astragals: diagonal iron bars crossing round the glazing, and the horizontal sill and head rings
  for (let a0 = -3; a0 < 3; a0 += 0.42) { const pts = [], pts2 = []; for (let Y = YB; Y <= YG; Y += 0.1) { const a = a0 + (Y - YB) * 0.32, b = a0 - (Y - YB) * 0.32; if (Math.abs(a) < 1.45) pts.push(cyl(a, Y)); if (Math.abs(b) < 1.45) pts2.push(cyl(b, Y)); } if (pts.length > 1) raw(line(pts, 2.4, IRON, 1)); if (pts2.length > 1) raw(line(pts2, 2.4, IRON, 1)); }
  raw('</g>');
  for (const Y of [YB, YG]) { const pts = []; for (let a = -1.45; a <= 1.45; a += 0.05) pts.push(cyl(a, Y)); raw(line(pts, 5, INK, 1) + line(pts, 3, IRON, 1)); }
  raw(`<path d="${p2(gl)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  // the dome: a copper cap gone green, ribbed, the ventilator ball on top with its cowl, the conductor rod fused black
  const dome = []; for (let a = -1.5; a <= 1.5; a += 0.05) dome.push(P(Math.sin(a) * (RL + 0.15), YG, CZ - Math.cos(a) * (RL + 0.15)));
  const apex = P(0, YG + 1.4, CZ); const dpts = [...dome, [apex[0] + 6, apex[1]], [apex[0] - 6, apex[1]]];
  raw(cel([...dome.slice().reverse().slice(0, 1), ...dome, apex].length ? [dome[0], ...dome.slice(1), [dome[dome.length - 1][0] - 30, apex[1] + 30], [apex[0] + 8, apex[1]], [apex[0] - 8, apex[1]], [dome[0][0] + 30, apex[1] + 30]] : dpts, { Z: CZ, fill: '#2e4a42', tex: 'url(#mottle)', texOp: 0.5, band: 10 }));
  for (const a of [-1.2, -0.7, -0.25, 0.25, 0.7, 1.2]) raw(line([P(Math.sin(a) * (RL + 0.15), YG, CZ - Math.cos(a) * (RL + 0.15)), apex], 1.2, INK, 0.7));
  raw(line(dome, 1.4, '#e8c860', 0.5));
  raw(cel(ell([apex[0], apex[1] - 10], 12, 11, 0, 14), { Z: CZ, fill: '#2a3c36', band: 3 }) + line([[apex[0], apex[1] - 21], [apex[0] + 1, apex[1] - 70]], 3, INK, 1) + cel(ell([apex[0] + 1, apex[1] - 72], 4, 4, 0, 8), { Z: CZ, fill: '#0a0a0a', band: 1 }));
  { const cid = S.id('dm'); raw(`<clipPath id="${cid}"><path d="${p2([...dome, [dome[dome.length - 1][0], -20], [dome[0][0], -20]])}"/></clipPath><g clip-path="url(#${cid})">` + BK.scorch((s2, t) => [-0.6 + s2, YG + t, CZ - RL - 0.1], 0, 1.4, 1.4, -Math.PI / 2 - 0.3, { w: 0.03, depth: 3, col: '#0a0a0a', halo: '#8a9a90', haloOp: 0.25 }) + '</g>'); }
  raw(glow(LC[0], LC[1], 520, 260, LAMPY, 0.28));
}
raw(G.frameDark(LC[0], LC[1] + 10, 700, 290, [[1.0, 0.28], [0.8, 0.22], [0.6, 0.16]]));
raw(BK.quiet(MURK, 244, 352, { steps: [0.14, 0.16, 0.2, 0.24], hop: 0.18 }));
// ---- the gallery: stone slabs laid round the tower (radial joints, ring joints), streaming wet, the lamp's light lying in
// the water on them, a burn ferned across two slabs, the drain holes at the rail
{
  const at = (s, t) => [-RG + s, 0, CZ - RG * 0.9 + t], Lz = RG * 0.9 * 2;
  raw(`<path d="${pp([at(0, 0), at(RG * 2, 0), at(RG * 2, Lz), at(0, Lz)])}" fill="#2a3034"/><path d="${pp([at(0, 0), at(RG * 2, 0), at(RG * 2, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.5"/>`);
  for (let r = RL + 0.6; r < RG + 2; r += 1.1 + R() * 0.3) { const pts = []; for (let a = -Math.PI; a <= 0.01; a += 0.03) { const Z = CZ + Math.sin(a) * r * 0.9; if (Z > 3.7) pts.push(P(Math.cos(a) * r, 0.003, Z)); } raw(line(pts, 1, INK, 0.7) + line(pts.map(([x, y]) => [x, y - 0.8]), 0.6, '#7a8488', 0.35)); }
  for (let a = -Math.PI + 0.1; a < 0; a += 0.16 + R() * 0.06) { const r0 = RL + 0.6, r1 = RG + 2, pts = []; for (let r = r0; r < r1; r += 0.2) { const Z = CZ + Math.sin(a) * r * 0.9; if (Z > 3.7) pts.push(P(Math.cos(a) * r, 0.003, Z)); } if (pts.length > 1) raw(line(pts, 0.9, INK, 0.6)); }
  for (const [X, Z, w] of [[-1.4, 7.6, 2.2], [2.2, 6.4, 1.8], [0.4, 9.4, 1.4], [-3.8, 8.6, 1.2]]) raw(G.puddle(at, X + RG, Z - (CZ - RG * 0.9), w, w * 0.4, { col: '#141a1e', refl: [LAMPY, LAMPW], ringCol: '#e8e0c0' }));
  raw(BK.splashes(at, RG - 7, RG + 7, 2, 8, 120, '#d8d0b8'));
  raw(BK.scorch((s2, t) => [s2, 0.01, t], 3.2, 8.2, 2.2, 2.6, { w: 0.05, depth: 4, col: '#0a0a0a', halo: '#8a9a9a', haloOp: 0.22 }));
  raw(glow(LC[0], P(0, 0, 9)[1], 380, 40, LAMPY, 0.2));
}

// ======================================================================== MID: the keeper's things, low and dark
layer('mid');
{
  const Z = 9.4, k = K(Z);
  { const c = P(-2.6, 0, Z); raw(cel([[c[0] - k * 0.18, c[1]], [c[0] + k * 0.18, c[1]], [c[0] + k * 0.16, c[1] - k * 0.42], [c[0] - k * 0.16, c[1] - k * 0.42]], { Z, fill: '#3a3a30', band: 1.5 }) + line([[c[0] + k * 0.1, c[1] - k * 0.38], [c[0] + k * 0.35, c[1] - k * 0.5]], 1.4, INK, 1)); }
  { const c = P(2.8, 0, Z + 0.2); for (let j = 0; j < 4; j++) raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - j * 2)}" rx="${f1(k * (0.35 - j * 0.04))}" ry="${f1(k * 0.08)}" fill="none" stroke="#4a4030" stroke-width="2.4"/>`); }
}

// ======================================================================== FORE: the near rail across the bottom, curving past the camera, its
// iron fused at one joint; a hoist rope and block hanging at the top left; rain lit lamp yellow
layer('fore');
{
  const near = (Y, d) => { const pts = []; for (let x = -30; x <= W + 30; x += 20) { const u = (x - 740) / 900; pts.push([x, Y + u * u * d]); } return pts; };
  raw(line(near(446, -70), 7, INK, 1) + line(near(446, -70), 4, IRON, 1) + line(near(444, -70), 1.2, LAMPY, 0.45));
  raw(line(near(468, -60), 5, INK, 1) + line(near(468, -60), 3, IRON, 1));
  for (let x = -10; x < W + 20; x += 74 + R() * 10) { const u = (x - 740) / 900, y0 = 446 - u * u * 70; raw(line([[x, y0], [x + 2, H + 10]], 5, INK, 1) + line([[x, y0], [x + 2, H + 10]], 2.6, IRON, 1)); }
  { const x = 1060, y = 446 - Math.pow((x - 740) / 900, 2) * 70; raw(cel([[x - 10, y - 6], [x + 12, y - 7], [x + 14, y + 8], [x - 9, y + 10]], { Z: 3, fill: '#0e0e0e', band: 2 })); }
  raw(BK.rope([[130, -10], [134, 120], [132, 200]], 2.4, '#5a4a30') + cel([[118, 196], [148, 196], [146, 226], [120, 226]], { Z: 3, fill: '#2a2620', band: 3 }) + `<circle cx="133" cy="211" r="8" fill="none" stroke="${INK}" stroke-width="2"/>`);
  raw(BK.rain(220, { x0: -20, x1: W, y0: -10, y1: H, slant: 0.18, len: 30, w: 1.0, col: LAMPW, op: 0.22 }));
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
