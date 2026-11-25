// The sky over the abbey for the title screen, in Living Ink. Same contract as grim/title_sky.js: one 1600x1400 SVG whose
// bottom edge meets the top of the cloister garth (title_sky.svg); the same drowned sun at (1120, 760), the same banks of
// cumulus, stratus, low fog, the forge smoke out of the smithy stack (its top at 292,1250 in sky space) and crows over the
// bell tower. Living Ink with smooth fills where Cole allowed them (2026-11-24: skies, fog and glows): the sky is one smooth
// gradient; every billow is shaded by a soft radial gradient whose light side faces the sun, inked once round the cloud's
// silhouette with a hair of ink where a billow's lit edge meets the one behind it; the sun's bloom, the wisps and the fog
// banks are soft gradients; smoke is puffs with an inked lee side.
// Changes from grim, both for the seam with the garth: the bottom band is the garth's own top sky tone (grim's ended much
// darker than the garth began), and the two things that rise above the garth's top edge are drawn here in the garth's own
// camera, shifted down 1400: the smithy stack and the tip of the empty bell-frame's roof (the belfry itself, empty, is in
// the garth just below the seam).
// Usage: node scenes/title_sky_li.js [outDir]   (default out/scenes/hub/title)
'use strict';
const fs = require('fs');
const path = require('path');
const { mix, rng, smooth } = require('../engine');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'title');
fs.mkdirSync(OUT, { recursive: true });
const INK = '#16110d';
const f = n => +(+n).toFixed(1);
const W = 1600, H = 1400, SUN = [1120, 760];
const R = rng(1400), Rs = rng(77), rr = (lo, hi) => lo + R() * (hi - lo);
const defs = [], body = [];
let gid = 0;
for (const g of [3.2, 4, 5, 6.5]) defs.push(`<pattern id="h${g * 10}" patternUnits="userSpaceOnUse" width="${g}" height="${g + 0.5}" patternTransform="rotate(-38)"><line x1="0.5" y1="0" x2="0.5" y2="${g + 0.5}" stroke="${INK}" stroke-width="${f(Math.max(0.7, 1.4 * g / 6.5))}"/></pattern>`);
defs.push(`<filter id="wob" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="2" seed="11" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.4" xChannelSelector="R" yChannelSelector="G"/></filter>`);
defs.push(`<filter id="grit" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence type="fractalNoise" baseFrequency="1.0" numOctaves="3" seed="7" result="n"/><feColorMatrix in="n" values="0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 -0.75 0.42" result="g"/><feComposite in="g" in2="SourceAlpha" operator="in" result="gi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>`);
const raw = s => body.push(s);
defs.push(`<filter id="wsoft" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="3 2"/></filter>`);
let TOPS_BODY = '', SMOKE = '';

// ---- the sky: one smooth gradient from near-black overhead down to the garth's top tone at the seam
{
  const stops = [[0, '#0d0e11'], [0.16, '#15161b'], [0.3, '#1e1f24'], [0.44, '#29292e'], [0.56, '#343438'], [0.68, '#424240'], [0.78, '#56554f'], [0.87, '#6c6b65'], [0.94, '#7f7d78'], [1, '#8c8a85']];
  defs.push(`<linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`);
  raw(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#skyg)"/>`);
  for (let i = 1; i < stops.length - 1; i++) for (let x = R() * 6; x < W; x += 5 + R() * 4) { R(); R(); }   // (the old band edges' draws, kept so the clouds stay where they were)
}
// stars where the Grey thins at the top
for (let k = 0; k < 220; k++) { const y = 8 + Math.pow(R(), 1.6) * 512; raw(`<circle cx="${f(R() * W)}" cy="${f(y)}" r="${f(rr(0.4, 1.3))}" fill="#d8d4c8" opacity="${f((1 - y / 520) * rr(0.15, 0.7))}"/>`); }
// the drowned sun: a soft bloom, faint rays up through the gaps, the disc with an inked rim
defs.push(`<radialGradient id="sunb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#efe6cf" stop-opacity="0.62"/><stop offset="0.18" stop-color="#d8cfb8" stop-opacity="0.28"/><stop offset="0.5" stop-color="#9a958a" stop-opacity="0.09"/><stop offset="1" stop-color="#8a867c" stop-opacity="0"/></radialGradient>`);
raw(`<circle cx="${SUN[0]}" cy="${SUN[1]}" r="520" fill="url(#sunb)"/>`);
for (let k = 0; k < 9; k++) {
  const ang = -Math.PI * rr(0.55, 1.45) + (R() < 0.5 ? 0 : Math.PI * 0.08), len = rr(500, 900), wd = rr(0.03, 0.07);
  raw(`<path d="M${SUN[0]} ${SUN[1]} L${f(SUN[0] + Math.cos(ang - wd) * len)} ${f(SUN[1] + Math.sin(ang - wd) * len)} L${f(SUN[0] + Math.cos(ang + wd) * len)} ${f(SUN[1] + Math.sin(ang + wd) * len)} Z" fill="#e8e0cc" opacity="${f(rr(0.025, 0.05))}"/>`);
}
raw(`<circle cx="${SUN[0]}" cy="${SUN[1]}" r="50" fill="#e6dcc2" opacity="0.85"/><circle cx="${SUN[0] - 6}" cy="${SUN[1] - 6}" r="36" fill="#f6f0de" opacity="0.8"/><circle cx="${SUN[0]}" cy="${SUN[1]}" r="50" fill="none" stroke="${INK}" stroke-width="1.6" opacity="0.4"/>`);

// ---- one night cumulus / stratocumulus. Lobes of very different sizes (a few big swelling heads, many small knuckles along
// the top, flattened ellipses, never a row of equal circles) merged into one silhouette, cut flat along a ragged base; torn
// fragments and wisps shred off its edges. Shading: one soft mass gradient (dark on the side away from the moon, lighter
// toward it), a darker flat base, and a moonlit rim only on the edges that face the moon (the silhouette's own copy pushed
// away from the moon, softened, laid over the lit edge in the shade tone). Ink only on the outer silhouette, broken, and
// on two or three key folds.
function cloud(cx, cy, w, h, tone, lip, scale) {
  const id = ++gid, lobes = [];
  // big heads first, then the knuckles: sizes drawn from a long-tailed spread
  const heads = 1 + Math.floor(R() * 3);
  for (let i = 0; i < heads; i++) { const t = rr(0.2, 0.8), r = h * rr(0.38, 0.58); lobes.push([cx - w / 2 + w * t, cy - r * rr(0.45, 0.75), r * rr(1.0, 1.5), r * rr(0.75, 1.0), rr(-0.3, 0.3)]); }
  const n = Math.round(w / (26 * scale)) + 4;
  for (let i = 0; i < n; i++) {
    const t = rr(0.02, 0.98), bell = Math.sin(Math.PI * t), r = h * (0.08 + 0.4 * Math.pow(R(), 2.2)) * (0.45 + 0.75 * bell);
    const topY = cy - h * (0.12 + 0.6 * bell) * rr(0.6, 1.05);
    lobes.push([cx - w / 2 + w * t, topY + r * 0.35, r * rr(1.0, 1.9), r * rr(0.6, 1.0), rr(-0.35, 0.35)]);
  }
  // torn fragments shredding off the ends: small flat lobes, some detached, part of the same mass (same shading and ink)
  for (let i = 0; i < 2 + Math.floor(R() * 4); i++) { const side = R() < 0.5 ? -1 : 1, r = h * rr(0.05, 0.12); lobes.push([cx + side * w * rr(0.42, 0.66), cy - h * rr(0.0, 0.22), r * rr(1.8, 3.2), r * rr(0.45, 0.7), rr(-0.15, 0.15)]); }
  const lobeD = ([x, y, rx, ry, a]) => { const c = Math.cos(a), s2 = Math.sin(a); const pts = Array.from({ length: 14 }, (_, k) => { const t = k / 14 * Math.PI * 2, m = 1 + (R() - 0.5) * 0.14; const ex = Math.cos(t) * rx * m, ey = Math.sin(t) * ry * m; return [x + ex * c - ey * s2, y + ex * s2 + ey * c]; }); return smooth(pts, true, 1); };
  const shapes = lobes.map(l => `<path d="${lobeD(l)}"/>`).join('');
  // the ragged flat base: everything below it is cut away
  const by = cy + h * 0.14, base = [[cx - w * 0.75, cy - h * 3]]; for (let k = 0; k <= 18; k++) { const u = k / 18; base.push([cx - w * 0.62 + w * 1.24 * u, by + Math.sin(u * 9 + id) * h * 0.025 + (R() - 0.5) * h * 0.04 - Math.pow(Math.abs(u - 0.5) * 2, 3) * h * 0.18]); } base.push([cx + w * 0.75, cy - h * 3]);
  const near = Math.max(0, 1 - Math.hypot(cx - SUN[0], cy - SUN[1]) / 760);
  const shade = mix(tone, '#07070a', 0.2), lit = mix(mix(tone, lip, 0.55 + near * 0.3), '#e8e0cc', near * 0.4), mid = mix(lit, shade, 0.6);
  const dx = SUN[0] - cx, dy = SUN[1] - cy, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  defs.push(`<clipPath id="u${id}">${shapes}</clipPath><clipPath id="ub${id}"><path d="M${base.map(p => f(p[0]) + ' ' + f(p[1])).join(' L')} Z"/></clipPath>`,
    `<linearGradient id="cm${id}" gradientUnits="userSpaceOnUse" x1="${f(cx - ux * w * 0.6)}" y1="${f(cy - uy * h * 1.2)}" x2="${f(cx + ux * w * 0.6)}" y2="${f(cy + uy * h * 1.2)}"><stop offset="0" stop-color="${shade}"/><stop offset="0.7" stop-color="${mix(shade, mid, 0.7)}"/><stop offset="1" stop-color="${mid}"/></linearGradient>`,
    `<linearGradient id="cb${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(cy - h * 0.25)}" x2="0" y2="${f(by)}"><stop offset="0" stop-color="${shade}" stop-opacity="0"/><stop offset="1" stop-color="${mix(shade, '#07070a', 0.3)}" stop-opacity="0.85"/></linearGradient>`,
    `<filter id="cs${id}" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="${f(Math.max(1.5, h * 0.03))}"/></filter>`);
  const off = Math.max(3, h * 0.09), pad = Math.max(4, h * 0.1);
  let out = `<g clip-path="url(#ub${id})">`;
  // the ink silhouette, broken: a stroke under the fill, with gaps where the moonlit rim burns the edge away
  out += `<g fill="none" stroke="${INK}" stroke-width="${f(2.2 * scale)}" stroke-opacity="0.6" stroke-dasharray="${f(60 * scale)} ${f(9 * scale)} ${f(24 * scale)} ${f(5 * scale)}">${shapes}</g>`;
  out += `<g clip-path="url(#u${id})"><rect x="${f(cx - w)}" y="${f(cy - h * 3)}" width="${f(w * 2)}" height="${f(h * 4)}" fill="${lit}"/>`;
  // everything but a rim on the moon side goes to the mass tone: the silhouette pushed away from the moon, softened
  out += `<g transform="translate(${f(-ux * off)} ${f(-uy * off)})" filter="url(#cs${id})"><g fill="url(#cm${id})" stroke="url(#cm${id})" stroke-width="${f(pad)}">${shapes}</g></g>`;
  // inner swells: a few big lobes catch a faint lift on their moon side
  for (const [x, y, rx, ry] of lobes.slice(0, heads)) { const gl = `cl${id}_${f(x)}`.replace(/\./g, 'd'); defs.push(`<radialGradient id="${gl}"><stop offset="0" stop-color="${lit}" stop-opacity="0.22"/><stop offset="1" stop-color="${lit}" stop-opacity="0"/></radialGradient>`); out += `<ellipse cx="${f(x + ux * rx * 0.35)}" cy="${f(y + uy * ry * 0.35)}" rx="${f(rx * 0.8)}" ry="${f(ry * 0.7)}" fill="url(#${gl})"/>`; }
  out += `<rect x="${f(cx - w)}" y="${f(cy - h)}" width="${f(w * 2)}" height="${f(h * 2)}" fill="url(#cb${id})"/>`;
  // one key fold on the biggest head only: a short soft ink stroke where it swells in front of the mass
  { const [x, y, rx, ry] = lobes[0], a0 = Math.atan2(-uy, -ux) - 0.3; out += `<path d="M${f(x + Math.cos(a0) * rx * 0.96)} ${f(y + Math.sin(a0) * ry * 0.96)} A${f(rx)} ${f(ry)} 0 0 1 ${f(x + Math.cos(a0 + 0.55) * rx * 0.96)} ${f(y + Math.sin(a0 + 0.55) * ry * 0.96)}" stroke="${INK}" stroke-width="${f(1.2 * scale)}" fill="none" opacity="0.25" stroke-linecap="round"/>`; }
  out += `</g></g>`;
  return out;
}
// stratus: a flat sliver, inked along its underside
function wisp(x, y, w, h, op, col) {
  let d = `M${f(x - w / 2)} ${f(y)}`;
  for (let k = 1; k <= 6; k++) d += ` Q${f(x - w / 2 + w * (k - 0.5) / 6)} ${f(y - h * rr(0.4, 1))} ${f(x - w / 2 + w * k / 6)} ${f(y + rr(-2, 2))}`;
  let u = ''; for (let k = 5; k >= 0; k--) u += ` Q${f(x - w / 2 + w * (k + 0.5) / 6)} ${f(y + h * rr(0.2, 0.6))} ${f(x - w / 2 + w * k / 6)} ${f(y + rr(-2, 2))}`;
  const wid = `w${++gid}`; defs.push(`<linearGradient id="${wid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset="0.5" stop-color="${col}" stop-opacity="1"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient>`);
  return `<path d="${d}${u} Z" fill="url(#${wid})" opacity="${f(op)}" filter="url(#wsoft)"/>`;   // soft, no ink: a stratus layer, not a ruled line
}
function bank(y0, tone, lip, scale, gaps = 0.25) {
  let s = '', x = -160;
  while (x < W + 160) { const w = rr(200, 700) * scale, h = rr(50, 170) * scale; if (R() > gaps) s += cloud(x + w / 2, y0 + rr(-60, 60), w, h * (w > 500 * scale ? 0.8 : 1), tone, lip, scale); x += w * rr(0.55, 1.0); }
  return s;
}
const layers = [];
layers.push(bank(230, '#18191e', '#4a4a50', 1.35, 0.1));
layers.push(Array.from({ length: 6 }, () => wisp(rr(0, W), rr(330, 420), rr(400, 900), rr(10, 22), 0.35, '#5a5852')).join(''));
layers.push(bank(420, '#222328', '#56565a', 1.15, 0.2));
layers.push(bank(610, '#2c2c30', '#666462', 1.0, 0.3));
layers.push(Array.from({ length: 7 }, () => wisp(rr(0, W), rr(700, 800), rr(500, 1000), rr(8, 18), 0.4, '#6a6862')).join(''));
layers.push(bank(830, '#3e3e40', '#7c7a74', 0.82, 0.35));
layers.push(bank(1020, '#545350', '#8e8c84', 0.66, 0.35));
// thin stratus: long, very thin layers, darker underside, lit faintly at their moon-side end
for (const [y, op, col] of [[505, 0.5, '#3a3a3c'], [690, 0.45, '#4a4a48'], [955, 0.5, '#5a5956'], [1190, 0.45, '#7a7872']]) layers.push(wisp(rr(300, 1300), y, rr(900, 1500), rr(4, 8), op, col) + wisp(rr(200, 1400), y + rr(8, 20), rr(500, 900), rr(3, 6), op * 0.8, col));
layers.push(Array.from({ length: 6 }, () => wisp(rr(0, W), rr(1060, 1160), rr(600, 1200), rr(10, 20), 0.45, '#8a8882')).join(''));
for (const l of layers.reverse()) raw(l);
// fog banks low over the abbey: flat ragged shelves, paler than the sky behind
defs.push(`<linearGradient id="fogg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a9890" stop-opacity="0"/><stop offset="0.5" stop-color="#9a9890" stop-opacity="0.2"/><stop offset="1" stop-color="#9a9890" stop-opacity="0"/></linearGradient>`);
for (const y of [1100, 1200, 1290]) { for (let k = 0; k <= 20; k++) { R(); R(); } raw(`<rect x="0" y="${y - 70}" width="${W}" height="160" fill="url(#fogg)"/>`); }

// ---- the abbey rising above the garth's top edge: the garth's own geometry that runs past its frame (the near ends of the
// ranges with their roofs, the huts' roofs, the smithy stack, the empty bell-frame), exported by scenes/garth_li.js as
// garth__tops.svg in the garth's camera with y from -1400, set here 1400 down and clipped at the seam: every roof, wall
// and chimney that the garth frame cuts is completed in the sky above it.
{
  const TOPS = path.join(__dirname, '..', 'out', 'scenes', 'hub', 'garth', 'garth__tops.svg');
  let t = fs.readFileSync(TOPS, 'utf8');
  t = t.replace(/id="([^"]+)"/g, 'id="gt_$1"').replace(/url\(#([^)]+)\)/g, 'url(#gt_$1)').replace(/href="#([^"]+)"/g, 'href="#gt_$1"');
  const tdefs = (t.match(/<defs>([\s\S]*?)<\/defs>/) || [, ''])[1], tbody = t.replace(/^[\s\S]*?<\/defs>/, '').replace(/<\/svg>\s*$/, '');
  defs.push(tdefs, `<clipPath id="seam"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>`);
  TOPS_BODY = `<g clip-path="url(#seam)"><g transform="translate(0 ${H})">${tbody}</g></g>`;
}
raw('@@TOPS@@');
// forge smoke out of the stack: a soft column that rises, leans with the wind, widens and thins, and breaks up into drifting
// rags at its top; its moon side catches a faint light. Blurred puffs (Cole allowed soft fills for smoke-like glow), no bands.
{
  defs.push(`<filter id="smk1" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5"/></filter><filter id="smk2" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="10"/></filter>`,
    `<filter id="smkt" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="6"/></filter>`);
  let core = '', lightSide = '', rags = '';
  const path = []; { let x = 292, y = 1250; for (let k = 0; k < 44; k++) { path.push([x, y]); const t = k / 44; x += 5 + t * 18 + Math.sin(k * 0.45) * 3; y -= 18 - t * 9; } }
  path.forEach(([x, y], k) => {
    const t = k / (path.length - 1), r = 12 + t * 95, op = 0.6 * Math.pow(1 - t, 1.3) + 0.04;
    if (t < 0.72 || R() < 0.55) core += `<ellipse cx="${f(x + rr(-6, 6) * t * 3)}" cy="${f(y)}" rx="${f(r * rr(0.9, 1.25))}" ry="${f(r * rr(0.55, 0.8))}" fill="#1c1a1a" opacity="${f(op)}"/>`;
    // the moon side (toward the lower right, where the moon stands): a thin pale lift on the column's flank
    const dx = SUN[0] - x, dy = SUN[1] - y, L = Math.hypot(dx, dy) || 1;
    if (k % 2 === 0 && t > 0.08) lightSide += `<ellipse cx="${f(x + dx / L * r * 0.55)}" cy="${f(y + dy / L * r * 0.3)}" rx="${f(r * 0.45)}" ry="${f(r * 0.25)}" fill="#8a8a8c" opacity="${f(0.13 * (1 - t) + 0.03)}"/>`;
    // at the top the column tears into separate rags that drift off downwind
    if (t > 0.6 && R() < 0.5) rags += `<ellipse cx="${f(x + rr(20, 120))}" cy="${f(y + rr(-60, 30))}" rx="${f(r * rr(0.35, 0.7))}" ry="${f(r * rr(0.15, 0.3))}" fill="#26242a" opacity="${f(rr(0.08, 0.2))}"/>`;
  });
  SMOKE += `<g filter="url(#smk2)">${rags}</g><g filter="url(#smkt)">${core}</g><g filter="url(#smk2)" opacity="0.7">${lightSide}</g>`;   // outside the paper grit (it fringed the soft edges)
  // the dense dark knot at the stack mouth, sparks
  SMOKE += `<g filter="url(#smk1)"><ellipse cx="295" cy="1240" rx="14" ry="10" fill="#141212" opacity="0.8"/></g>`;
  for (let k = 0; k < 18; k++) { const ex = 292 + rr(-10, 60), ey = 1240 - rr(0, 110); raw(`<circle cx="${f(ex)}" cy="${f(ey)}" r="${f(rr(1, 2.2))}" fill="#ff9a40" opacity="${f(rr(0.4, 0.9) * (1 - (1240 - ey) / 130))}"/>`); }
}
// crows wheeling over the empty bell tower
for (let k = 0; k < 16; k++) { const cx = rr(700, 1250), cy = rr(860, 1200), s = rr(5, 11); raw(`<path d="M${f(cx - s)} ${f(cy)} Q${f(cx - s * 0.4)} ${f(cy - s * 0.7)} ${f(cx)} ${f(cy)} Q${f(cx + s * 0.4)} ${f(cy - s * 0.7)} ${f(cx + s)} ${f(cy)}" stroke="#0a0a0c" stroke-width="${f(s * 0.3)}" fill="none" stroke-linecap="round"/>`); }
const iTop = body.findIndex(x => x === '@@TOPS@@');
const skyPart = body.slice(0, iTop).join('\n'), afterPart = body.slice(iTop + 1).join('\n');
fs.writeFileSync(path.join(OUT, 'title_sky.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join('')}</defs><g filter="url(#wob)"><g filter="url(#grit)">${skyPart}</g></g>${TOPS_BODY}${SMOKE}<g filter="url(#wob)"><g filter="url(#grit)">${afterPart}</g></g></svg>`);
console.log('title sky', W, H);
