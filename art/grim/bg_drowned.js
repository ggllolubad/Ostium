// Drowned Kingdom battle rooms. Each room renders three layers at 1480x480 (shown at 2x):
//   far  (opaque): murk, distant architecture, floor
//   mid  (transparent): pillars and room props standing behind the fighters
//   fore (transparent): near-black silhouettes framing the edges, drawn over the fighters
// Usage: node grim/bg_drowned.js <room> ; writes grim/bg/<room>_{far,mid,fore}.svg
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const fs = require('fs');
const W = 1480, H = 480, HORIZON = 300;
const room = process.argv[2] || 'nave';
const ROOMS = {
  stair: { seed: 11, tint: '#2f4a48', light: '#cfe2d8' },
  nave: { seed: 23, tint: '#2c4246', light: '#d8e6dc' },
  belfry: { seed: 37, tint: '#3a3a34', light: '#e6dcc0' },
  ossuary: { seed: 41, tint: '#33302c', light: '#d8ccb0' },
  throne: { seed: 53, tint: '#1f3436', light: '#bcd8d0' },
};
const cfg = ROOMS[room];
fs.mkdirSync('grim/bg', { recursive: true });
const f = n => +n.toFixed(1);

function floor(a, P) {
  // perspective flagstones with puddles
  const vx = W / 2, rows = [HORIZON, 316, 336, 362, 396, 440, 480];
  a.raw(`<rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="#5a5a50"/>`);
  for (let r = 0; r < rows.length - 1; r++) {
    const yA = rows[r], yB = rows[r + 1];
    for (let k = -22; k <= 22; k++) {
      const sA = (yA - 230) / 220, sB = (yB - 230) / 220;
      const xa0 = vx + k * 110 * sA, xa1 = vx + (k + 1) * 110 * sA, xb0 = vx + k * 110 * sB, xb1 = vx + (k + 1) * 110 * sB;
      const tone = ['#6a685c', '#5e5c52', '#726e60', '#64625a'][(k + r * 3 + 40) % 4];
      a.raw(`<path d="M${f(xa0)} ${yA} L${f(xa1)} ${yA} L${f(xb1)} ${yB} L${f(xb0)} ${yB} Z" fill="${tone}" stroke="${INK}" stroke-width="1"/>`);
      if ((k * 7 + r * 5 + cfg.seed) % 5 === 0) a.raw(`<path d="M${f(xa0)} ${yA} L${f(xa1)} ${yA} L${f(xb1)} ${yB} L${f(xb0)} ${yB} Z" fill="${a.hatchPat(40, 2.6, 0.6)}" opacity="0.7"/>`);
      if ((k * 3 + r + cfg.seed) % 7 === 0) a.raw(`<path d="M${f((xa0 + xb0) / 2 + 6)} ${f((yA + yB) / 2)} l14 4 l8 -6" stroke="${INK}" stroke-width="0.8" fill="none"/>`);
    }
  }
  // standing water: reflective pools with ripple lines
  for (let i = 0; i < 6; i++) {
    const cx = 120 + a.R() * (W - 240), cy = 330 + a.R() * 130, rx = 60 + a.R() * 140, ry = rx * 0.12;
    a.raw(`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="#3e5a58" opacity="0.75"/><ellipse cx="${f(cx)}" cy="${f(cy - ry * 0.3)}" rx="${f(rx * 0.7)}" ry="${f(ry * 0.4)}" fill="none" stroke="${cfg.light}" stroke-width="0.8" opacity="0.5"/><path d="M${f(cx - rx * 0.5)} ${f(cy + ry * 0.2)} L${f(cx + rx * 0.3)} ${f(cy + ry * 0.2)}" stroke="${cfg.light}" stroke-width="0.6" opacity="0.4"/>`);
  }
  // silt, weed and scattered bones on the floor
  a.raw(Array.from({ length: 30 }, () => { const x = a.R() * W, y = HORIZON + 10 + a.R() * 170; return P.weed(x, y - 12, 12 + a.R() * 10, 0.5, '#3f4a2c'); }).join(''));
  a.raw(`<rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#mottle)" opacity="0"/>`);
  // darken toward the front edge and the corners
  a.raw(`<linearGradient id="flo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></linearGradient><rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#flo)"/>`);
}

function murk(a) {
  a.raw(`<linearGradient id="mk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cfg.tint}"/><stop offset="1" stop-color="#151e1e"/></linearGradient><rect width="${W}" height="${HORIZON + 2}" fill="url(#mk)"/>`);
}
function shafts(a, n) {
  for (let i = 0; i < n; i++) {
    const x = 100 + a.R() * (W - 200), w = 40 + a.R() * 70, sk = 60 + a.R() * 80;
    a.raw(`<path d="M${f(x)} 0 L${f(x + w)} 0 L${f(x + w + sk)} ${H} L${f(x + sk - w * 0.4)} ${H} Z" fill="${cfg.light}" opacity="${(0.06 + a.R() * 0.06).toFixed(2)}"/>`);
  }
}
function motes(a, n, y0 = 0, y1 = H) {
  return Array.from({ length: n }, () => `<circle cx="${f(a.R() * W)}" cy="${f(y0 + a.R() * (y1 - y0))}" r="${f(0.6 + a.R() * 1.6)}" fill="${cfg.light}" opacity="${(0.25 + a.R() * 0.4).toFixed(2)}"/>`).join('');
}
// a hatched stone wall band with arches
function arcade(a, P, n, top, bottom, opt = {}) {
  a.raw(require('./surfaces').masonry(a, a.R, 0, top, W, bottom, opt.stone || '#5a625a', { course: 26, block: 84, streaks: 14 }));
  a.raw(Array.from({ length: 16 }, () => { const x = a.R() * W; return `<path d="M${f(x)} ${f(bottom - 10)} C${f(x + 10)} ${f(bottom - 60)} ${f(x - 6)} ${f(bottom - 110)} ${f(x + 4)} ${f(top + (bottom - top) * a.R() * 0.5)}" stroke="#2a3a2a" stroke-width="${f(6 + a.R() * 16)}" opacity="0.18" fill="none"/>`; }).join(''));
  const step = W / n;
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5), aw = step * 0.56, ah = (bottom - top) * 0.78, y = bottom;
    const d = `M${f(cx - aw / 2)} ${y} L${f(cx - aw / 2)} ${f(y - ah * 0.6)} C${f(cx - aw / 2)} ${f(y - ah * 1.05)} ${f(cx + aw / 2)} ${f(y - ah * 1.05)} ${f(cx + aw / 2)} ${f(y - ah * 0.6)} L${f(cx + aw / 2)} ${y} Z`;
    a.shape({ d, fill: opt.void || '#1c2626', depth: 20, hatch: 60, hl: false, ink: 1.6, wash: 0.5, decals: (opt.inArch ? opt.inArch(cx, y, aw, ah, i) : '') });
    // voussoirs
    a.raw(`<path d="M${f(cx - aw / 2 - 8)} ${f(y - ah * 0.6)} C${f(cx - aw / 2 - 8)} ${f(y - ah * 1.13)} ${f(cx + aw / 2 + 8)} ${f(y - ah * 1.13)} ${f(cx + aw / 2 + 8)} ${f(y - ah * 0.6)}" stroke="${INK}" stroke-width="1.3" fill="none"/>` +
      Array.from({ length: 9 }, (_, k) => { const t = Math.PI * (k + 1) / 10, x1 = cx - Math.cos(t) * aw / 2, y1 = y - ah * 0.6 - Math.sin(t) * ah * 0.42, x2 = cx - Math.cos(t) * (aw / 2 + 9), y2 = y - ah * 0.6 - Math.sin(t) * (ah * 0.42 + 10); return `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${INK}" stroke-width="1"/>`; }).join(''));
  }
}
function pillar(a, P, x, w, top, base, opt = {}) {
  a.shape({ d: `M${x - w / 2} ${base} L${x - w / 2} ${top} L${x + w / 2} ${top} L${x + w / 2} ${base} Z`, fill: opt.fill || '#6a6a5e', depth: w * 0.45, mottle: 0.8, hatch: 80, hl: true, hlOp: 0.15,
    lines: [`M${x - w * 0.2} ${top} L${x - w * 0.2} ${base}`, `M${x + w * 0.15} ${top} L${x + w * 0.15} ${base}`, ...Array.from({ length: 5 }, (_, i) => `M${x - w / 2} ${f(top + (base - top) * (i + 1) / 6)} L${x + w / 2} ${f(top + (base - top) * (i + 1) / 6 + 2)}`)],
    decals: a.stain(x, base - 40, w * 0.6, G.algae, 0.6) + P.barnacles(x, top + (base - top) * 0.6, 8, w * 0.4) + `<path d="M${x - 4} ${top + 30} l8 20 l-6 14 l10 22" stroke="${INK}" stroke-width="1" fill="none"/>` });
  a.shape({ d: `M${x - w / 2 - 10} ${top} L${x + w / 2 + 10} ${top} L${x + w / 2 + 4} ${top + 14} L${x - w / 2 - 4} ${top + 14} Z`, fill: opt.fill || '#6a6a5e', depth: 6, mottle: 0.6 });
  a.shape({ d: `M${x - w / 2 - 8} ${base - 12} L${x + w / 2 + 8} ${base - 12} L${x + w / 2 + 12} ${base} L${x - w / 2 - 12} ${base} Z`, fill: opt.fill || '#6a6a5e', depth: 6, mottle: 0.6 });
  a.raw(P.weed(x - w * 0.3, top + 10, 60 + a.R() * 60, 1) + P.weed(x + w * 0.2, top + 20, 40 + a.R() * 50, -1));
}
function saint(a, P, cx, base, h) {
  // a worn, faceless saint statue in a niche
  const s = h / 200;
  a.shape({ d: smooth([[cx - 26 * s, base], [cx - 30 * s, base - 120 * s], [cx - 18 * s, base - 160 * s], [cx, base - 168 * s], [cx + 18 * s, base - 160 * s], [cx + 30 * s, base - 120 * s], [cx + 26 * s, base]], true, 0.6), fill: '#7a786a', depth: 20 * s, mottle: 0.8, hatch: 80,
    lines: [`M${cx - 10 * s} ${base - 150 * s} C${cx - 14 * s} ${base - 100 * s} ${cx - 12 * s} ${base - 50 * s} ${cx - 16 * s} ${base}`, `M${cx + 8 * s} ${base - 140 * s} C${cx + 12 * s} ${base - 90 * s} ${cx + 10 * s} ${base - 40 * s} ${cx + 14 * s} ${base}`],
    decals: a.stain(cx, base - 60 * s, 20 * s, G.algae, 0.7) });
  a.shape({ d: smooth([[cx - 14 * s, base - 168 * s], [cx, base - 196 * s], [cx + 14 * s, base - 168 * s], [cx, base - 160 * s]], true, 0.7), fill: '#7a786a', depth: 8 * s, mottle: 0.7, decals: `<path d="M${cx - 6 * s} ${base - 178 * s} L${cx + 6 * s} ${base - 176 * s}" stroke="${INK}" stroke-width="1.4"/>` });
  a.raw(`<path d="M${cx - 4 * s} ${base - 176 * s} C${cx - 5 * s} ${base - 150 * s} ${cx - 3 * s} ${base - 130 * s} ${cx - 5 * s} ${base - 110 * s}" stroke="${G.bloodD}" stroke-width="1.2" fill="none" opacity="0.7"/>`);
}

// ======================================================================== FAR
{
  const a = new Art(W, H, cfg.seed), P = require('./parts')(a);
  murk(a);
  if (room === 'nave' || room === 'throne') {
    // great rose window, shattered, light pouring
    const cx = W / 2, cy = 120, r = 90;
    a.raw(`<circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="#3a443e" stroke="${INK}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${cfg.light}" opacity="0.5"/>` +
      Array.from({ length: 12 }, (_, i) => { const t = i / 12 * Math.PI * 2; return `<path d="M${cx} ${cy} L${f(cx + Math.cos(t) * r)} ${f(cy + Math.sin(t) * r)}" stroke="${INK}" stroke-width="4"/><circle cx="${f(cx + Math.cos(t + 0.26) * r * 0.66)}" cy="${f(cy + Math.sin(t + 0.26) * r * 0.66)}" r="${f(r * 0.2)}" fill="${['#7a2a24', '#2a4a6a', '#6a5a2a'][i % 3]}" opacity="0.55" stroke="${INK}" stroke-width="1.6"/>`; }).join('') +
      `<circle cx="${cx}" cy="${cy}" r="${r * 0.3}" fill="#7a2a24" opacity="0.6" stroke="${INK}" stroke-width="2"/><path d="M${cx + 20} ${cy - 60} l30 40 l-10 30 l24 30" stroke="${G.black}" stroke-width="5" fill="none"/>`);
    shafts(a, 7);
    arcade(a, P, 7, 150, HORIZON, { inArch: (cx, y, aw, ah, i) => i % 3 === 1 ? '' : `<path d="M${f(cx - aw * 0.3)} ${y} L${f(cx - aw * 0.3)} ${f(y - ah * 0.45)} M${f(cx + aw * 0.3)} ${y} L${f(cx + aw * 0.3)} ${f(y - ah * 0.45)}" stroke="#3a4440" stroke-width="10"/>` });
  } else if (room === 'stair') {
    shafts(a, 5);
    // a great stair descending into the dark at the back
    for (let i = 0; i < 14; i++) { const y = 120 + i * 13, w = 300 + i * 40; a.raw(`<path d="M${W / 2 - w / 2} ${y} L${W / 2 + w / 2} ${y} L${W / 2 + w / 2 + 6} ${y + 13} L${W / 2 - w / 2 - 6} ${y + 13} Z" fill="${['#4a524c', '#3e4642'][i % 2]}" stroke="${INK}" stroke-width="1"/>`); }
    a.raw(`<rect x="${W / 2 - 160}" y="40" width="320" height="82" fill="#0e1414"/><path d="M${W / 2 - 160} 40 L${W / 2 + 160} 40" stroke="${INK}" stroke-width="2"/>`);
    arcade(a, P, 4, 60, HORIZON, { inArch: (cx, y, aw, ah) => '' });
    saint(a, P, 260, HORIZON - 4, 190); saint(a, P, W - 260, HORIZON - 4, 190);
  } else if (room === 'belfry') {
    shafts(a, 4);
    a.shape({ d: `M0 40 L${W} 40 L${W} ${HORIZON} L0 ${HORIZON} Z`, fill: '#4a4438', depth: 30, mottle: 0.15, hatch: 80, hl: false, ink: 0, wash: 0.25, tex: 'url(#grain)', texOp: 0.7 });
    for (const x of [200, 520, 900, 1260]) a.raw(`<path d="M${x} 0 L${x} ${HORIZON}" stroke="${INK}" stroke-width="28"/><path d="M${x} 0 L${x} ${HORIZON}" stroke="#5a4a36" stroke-width="22"/>`);
    a.raw(`<path d="M0 60 L${W} 60 M0 180 L${W} 180" stroke="${INK}" stroke-width="20"/><path d="M0 60 L${W} 60 M0 180 L${W} 180" stroke="#5a4a36" stroke-width="15"/>`);
    // distant hanging bells
    for (const [x, s] of [[360, 0.6], [740, 0.9], [1100, 0.7]]) a.raw(`<path d="M${x} 60 L${x} ${f(110 * s + 40)}" stroke="${INK}" stroke-width="2"/><path d="M${f(x - 40 * s)} ${f(200 * s + 40)} C${f(x - 36 * s)} ${f(110 * s + 40)} ${f(x + 36 * s)} ${f(110 * s + 40)} ${f(x + 40 * s)} ${f(200 * s + 40)} Z" fill="#6a5a2a" stroke="${INK}" stroke-width="1.6"/><path d="M${f(x - 40 * s)} ${f(200 * s + 40)} C${f(x - 36 * s)} ${f(110 * s + 40)} ${f(x + 36 * s)} ${f(110 * s + 40)} ${f(x + 40 * s)} ${f(200 * s + 40)} Z" fill="${a.hatchPat(30, 2.6, 0.6)}" opacity="0.5"/>`);
  } else if (room === 'ossuary') {
    // walls of skulls in niches
    a.shape({ d: `M0 30 L${W} 30 L${W} ${HORIZON} L0 ${HORIZON} Z`, fill: '#4a453c', depth: 30, mottle: 0.15, hatch: 80, hl: false, ink: 0, wash: 0.25 });
    for (let row = 0; row < 7; row++) for (let i = 0; i < 40; i++) {
      const x = 20 + i * 37 + (row % 2) * 18, y = 50 + row * 36;
      if ((i + row * 3) % 11 === 0) continue;
      a.raw(`<path d="M${x - 14} ${y + 14} L${x - 14} ${y - 6} C${x - 14} ${y - 18} ${x + 14} ${y - 18} ${x + 14} ${y - 6} L${x + 14} ${y + 14} Z" fill="#141616"/><ellipse cx="${x}" cy="${y + 2}" rx="9" ry="10" fill="#b8ae94" stroke="${INK}" stroke-width="0.8"/><circle cx="${x - 3.5}" cy="${y + 1}" r="2.4" fill="${G.black}"/><circle cx="${x + 3.5}" cy="${y + 1}" r="2.4" fill="${G.black}"/><path d="M${x - 4} ${y + 9} L${x + 4} ${y + 9}" stroke="${INK}" stroke-width="0.8"/>`);
    }
    a.raw(`<rect x="0" y="30" width="${W}" height="${HORIZON - 30}" fill="#1a2020" opacity="0.35"/>`);
    shafts(a, 3);
  }
  if (room === 'throne') {
    // the coral throne heaped with the drowned, far back centre
    a.shape({ d: smooth([[W / 2 - 160, HORIZON], [W / 2 - 140, 180], [W / 2 - 60, 120], [W / 2 + 60, 120], [W / 2 + 140, 180], [W / 2 + 160, HORIZON]], true, 0.6), fill: '#6a3a34', depth: 40, mottle: 0.8, hatch: 70, decals: P.barnacles(W / 2, 200, 30, 120) });
    a.raw([[-120, 1], [-60, 1.2], [0, 1.4], [60, 1.2], [120, 1]].map(([dx, s]) => `<path d="M${W / 2 + dx} 130 C${W / 2 + dx - 10} ${f(100 - 30 * s)} ${W / 2 + dx + 10} ${f(80 - 30 * s)} ${W / 2 + dx} ${f(50 - 30 * s)} M${W / 2 + dx} ${f(100 - 20 * s)} l-14 -10 M${W / 2 + dx} ${f(80 - 26 * s)} l14 -10" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${W / 2 + dx} 130 C${W / 2 + dx - 10} ${f(100 - 30 * s)} ${W / 2 + dx + 10} ${f(80 - 30 * s)} ${W / 2 + dx} ${f(50 - 30 * s)} M${W / 2 + dx} ${f(100 - 20 * s)} l-14 -10 M${W / 2 + dx} ${f(80 - 26 * s)} l14 -10" stroke="#a85a4a" stroke-width="5" fill="none" stroke-linecap="round"/>`).join(''));
    for (let i = 0; i < 18; i++) { const x = W / 2 - 150 + i * 17, y = HORIZON - 10 - (i % 4) * 14; a.raw(`<ellipse cx="${x}" cy="${y}" rx="9" ry="8" fill="#9aa596" stroke="${INK}" stroke-width="0.8"/><circle cx="${x - 3}" cy="${y - 1}" r="2" fill="${G.black}"/><circle cx="${x + 3}" cy="${y - 1}" r="2" fill="${G.black}"/>`); }
  }
  // water surface far overhead: the kingdom is under the sea
  a.raw(`<path d="M0 8 ${Array.from({ length: 30 }, (_, i) => `Q${f(i * 50 + 25)} ${i % 2 ? 2 : 14} ${f((i + 1) * 50)} 8`).join(' ')} L${W} 0 L0 0 Z" fill="${cfg.light}" opacity="0.25"/>`);
  floor(a, P);
  a.raw(motes(a, 120, 0, HORIZON + 60));
  // vignette
  a.raw(`<radialGradient id="vg" cx="0.5" cy="0.55" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient><rect width="${W}" height="${H}" fill="url(#vg)"/>`);
  fs.writeFileSync(`grim/bg/${room}_far.svg`, a.svg());
}
// ======================================================================== MID (behind fighters, on the floor)
{
  const a = new Art(W, H, cfg.seed + 1), P = require('./parts')(a);
  const pillars = { stair: [70, 1410], nave: [40, 420, 1060, 1440], belfry: [60, 1420], ossuary: [90, 1390], throne: [50, 330, 1150, 1430] }[room];
  for (const x of pillars) pillar(a, P, x, 54 + (x % 3) * 6, 20, HORIZON + 26, { fill: room === 'ossuary' ? '#6a6458' : '#66665a' });
  if (room === 'nave') {
    // broken pews, rotted, leaning at the back
    for (const [x, y, r] of [[230, HORIZON + 20, -4], [600, HORIZON + 10, 3], [880, HORIZON + 14, -2], [1240, HORIZON + 22, 5]]) {
      a.shape({ d: poly([[x, y], [x + 150, y - 6], [x + 150, y - 50], [x + 140, y - 52], [x + 140, y - 18], [x, y - 12]]), fill: G.woodD, depth: 10, tex: 'url(#grain)', texOp: 0.6, mottle: 0.6, decals: a.stain(x + 60, y - 10, 16, G.algae, 0.6) });
    }
    a.raw(P.flies(700, 200, 0, 1));
  } else if (room === 'stair') {
    a.shape({ d: smooth([[560, HORIZON + 30], [600, HORIZON - 10], [700, HORIZON - 16], [760, HORIZON + 30]], true, 0.6), fill: '#6a6a5e', depth: 20, mottle: 0.7, decals: P.barnacles(660, HORIZON, 10, 40) });
  } else if (room === 'belfry') {
    // a fallen bell half sunk in the floor, ropes trailing from above
    a.shape({ d: 'M600 330 C610 250 870 250 880 330 L890 344 L590 344 Z', fill: G.gold, depth: 40, mottle: 0.8, hatch: 30, decals: a.stain(740, 300, 40, '#4f7f6a', 0.7) + `<path d="M700 262 L716 300 L704 340" stroke="${G.black}" stroke-width="3" fill="none"/>` });
    for (const x of [300, 470, 1010, 1180]) a.raw(`<path d="M${x} 0 C${x + 6} 100 ${x - 6} 200 ${x + 4} ${HORIZON + 10}" stroke="${INK}" stroke-width="4.4" fill="none"/><path d="M${x} 0 C${x + 6} 100 ${x - 6} 200 ${x + 4} ${HORIZON + 10}" stroke="#a8946a" stroke-width="2.6" fill="none" stroke-dasharray="4 2"/>`);
  } else if (room === 'ossuary') {
    for (const x of [280, 640, 1180]) { for (let i = 0; i < 16; i++) { const bx = x + (a.R() - 0.5) * 120, by = HORIZON + 26 - a.R() * 30; a.raw(i % 3 ? `<path d="M${f(bx - 14)} ${f(by)} L${f(bx + 14)} ${f(by - 4)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${f(bx - 14)} ${f(by)} L${f(bx + 14)} ${f(by - 4)}" stroke="${G.bone}" stroke-width="3.6" stroke-linecap="round"/>` : `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="9" ry="8" fill="${G.bone}" stroke="${INK}" stroke-width="0.8"/><circle cx="${f(bx - 3)}" cy="${f(by - 1)}" r="2" fill="${G.black}"/><circle cx="${f(bx + 3)}" cy="${f(by - 1)}" r="2" fill="${G.black}"/>`); } }
  } else if (room === 'throne') {
    for (const x of [500, 980]) { a.raw(`<path d="M${x} 0 L${x} 160" stroke="${INK}" stroke-width="3"/>`); a.shape({ d: smooth([[x - 18, 160], [x + 18, 160], [x + 22, 210], [x + 8, 250], [x - 8, 250], [x - 22, 210]], true, 0.6), fill: '#8a9488', depth: 10, mottle: 0.6, decals: P.socket(x - 6, 190, 4) + P.socket(x + 6, 188, 4) }); a.raw(a.drip(x, 250, 30, 2.4)); }
  }
  fs.writeFileSync(`grim/bg/${room}_mid.svg`, a.svg());
}
// ======================================================================== FORE (over the fighters; edges only)
{
  const a = new Art(W, H, cfg.seed + 2), P = require('./parts')(a);
  const dark = '#0f1414';
  // left and right framing masses
  a.shape({ d: `M0 0 L${92 + (cfg.seed % 3) * 10} 0 C80 120 110 240 70 ${H} L0 ${H} Z`, fill: dark, depth: 30, hatch: 70, hl: false, wash: 0.2, decals: P.barnacles(40, 220, 14, 30) });
  a.shape({ d: `M${W} 0 L${W - 100} 0 C${W - 70} 140 ${W - 110} 300 ${W - 60} ${H} L${W} ${H} Z`, fill: dark, depth: 30, hatch: 120, hl: false, wash: 0.2, decals: P.barnacles(W - 40, 300, 12, 30) });
  // hanging chains / kelp / ropes from the top
  const hangers = { stair: 'kelp', nave: 'chain', belfry: 'rope', ossuary: 'chain', throne: 'kelp' }[room];
  for (const x of [150, 240, 1230, 1330]) {
    const len = 60 + a.R() * 90;
    if (hangers === 'chain') { let c = ''; for (let i = 0; i < len / 11; i++) c += `<ellipse cx="${x}" cy="${8 + i * 11}" rx="${i % 2 ? 2.4 : 5}" ry="6.5" fill="none" stroke="${dark}" stroke-width="3.4"/>`; a.raw(c + (a.R() < 0.6 ? P.hook(x, len, 1.1) : '')); }
    else if (hangers === 'rope') a.raw(`<path d="M${x} 0 C${x + 8} ${len * 0.4} ${x - 6} ${len * 0.7} ${x + 2} ${len}" stroke="${dark}" stroke-width="5" fill="none"/><path d="M${x - 6} ${len} C${x - 2} ${len + 10} ${x + 8} ${len + 10} ${x + 10} ${len}" stroke="${dark}" stroke-width="5" fill="none"/>`);
    else a.raw(P.weed(x, 0, len + 40, 1.4, '#1f2a1a').replace(/stroke="#1c130c"/g, `stroke="${dark}"`));
  }
  // dark rubble mounds in the bottom corners
  a.shape({ d: smooth([[0, H], [0, 440], [40, 428], [80, 446], [110, H]], true, 0.6), fill: dark, depth: 20, hatch: 70, hl: false });
  a.shape({ d: smooth([[W, H], [W, 436], [W - 40, 426], [W - 80, 446], [W - 110, H]], true, 0.6), fill: dark, depth: 20, hatch: 120, hl: false });
  if (room === 'ossuary' || room === 'throne') a.raw([[40, 444], [W - 50, 440]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="11" fill="#3a3a30" stroke="${dark}" stroke-width="1.4"/><circle cx="${x - 4}" cy="${y - 1}" r="3" fill="${dark}"/><circle cx="${x + 4}" cy="${y - 1}" r="3" fill="${dark}"/>`).join(''));
  a.raw(motes(a, 20, 40, H - 40));
  fs.writeFileSync(`grim/bg/${room}_fore.svg`, a.svg(false));
}
