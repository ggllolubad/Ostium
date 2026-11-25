// Creature kit for the door worlds. One call builds a rigged creature from a compact spec.
// All figures face LEFT (toward the heroes) and are drawn in a 460x700 base frame (feet at y~676),
// then scaled onto the tier canvas (foe 460x700, elite 560x800, boss 700x900).
// Archetypes: humanoid, beast, serpent, crawler, floater, golem, bird, moth, swarm.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const f = n => +n.toFixed(1);
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const dark = (c, t = 0.3) => mix(c, '#140d08', t);
const light = (c, t = 0.3) => mix(c, '#f4ead0', t);
const CANVAS = { foe: [460, 700], elite: [560, 800], boss: [700, 900] };
const EGLOW = { fire: '#ff8a2a', frost: '#bfe6ff', lightning: '#ffe680', water: '#7fb6e0', toxin: '#b4d860', void: '#a47ae0' };

function dressing(a) {
  const R = a.R, D = {};
  // fire as many licking tongues of uneven height: ember-red base, orange body, a pale core, smoke above
  D.flame = (x, y, h, w = h * 0.4, lean = 0) => {
    let o = a.glow(x, y - h * 0.4, h * 0.95, '#ff7a2a', 0.42);
    const tongue = (bx, hh, ww, col, ln, edge) => { const tx = bx + ln * hh + (R() - 0.5) * ww * 0.4; return `<path d="M${f(bx - ww)} ${f(y)} C${f(bx - ww * 1.1)} ${f(y - hh * 0.35)} ${f(bx - ww * 0.3)} ${f(y - hh * 0.5)} ${f(bx - ww * 0.15 + ln * hh * 0.3)} ${f(y - hh * 0.72)} C${f(tx - ww * 0.3)} ${f(y - hh * 0.86)} ${f(tx - ww * 0.1)} ${f(y - hh * 0.95)} ${f(tx)} ${f(y - hh)} C${f(tx + ww * 0.15)} ${f(y - hh * 0.8)} ${f(bx + ww * 0.5 + ln * hh * 0.3)} ${f(y - hh * 0.6)} ${f(bx + ww * 0.55)} ${f(y - hh * 0.4)} C${f(bx + ww * 1.05)} ${f(y - hh * 0.3)} ${f(bx + ww)} ${f(y - hh * 0.1)} ${f(bx + ww)} ${f(y)} Z" fill="${col}"${edge ? ` stroke="${INK}" stroke-width="0.9"` : ''}/>`; };
    const n = 3 + Math.floor(R() * 3);
    const spots = Array.from({ length: n }, (_, i) => [x + (i - (n - 1) / 2) * w * 0.55 + (R() - 0.5) * w * 0.3, h * (0.55 + R() * 0.45) * (i === Math.floor(n / 2) ? 1.15 : 1)]);
    for (const [bx, hh] of spots) o += tongue(bx, hh, w * 0.42, '#8a2a12', lean, true);
    for (const [bx, hh] of spots) o += tongue(bx, hh * 0.8, w * 0.32, '#e0621e', lean, false);
    for (const [bx, hh] of spots) o += tongue(bx, hh * 0.5, w * 0.18, '#ffc860', lean, false);
    for (let i = 0; i < 3; i++) { const sx = x + (R() - 0.5) * w * 0.6; o += `<path d="M${f(sx)} ${f(y - h * 0.95)} C${f(sx - w * 0.4)} ${f(y - h * 1.2)} ${f(sx + w * 0.5)} ${f(y - h * 1.35)} ${f(sx - w * 0.1 + (R() - 0.5) * w)} ${f(y - h * (1.55 + R() * 0.3))}" stroke="#4a4440" stroke-width="${f(1 + R() * 1.5)}" fill="none" opacity="0.35"/>`; }
    return o;
  };
  D.embers = (x, y, sp, n = 10) => Array.from({ length: n }, () => `<circle cx="${f(x + (R() - 0.5) * sp)}" cy="${f(y - R() * sp)}" r="${f(0.8 + R() * 1.8)}" fill="${R() < 0.5 ? '#ffd27a' : '#ff8a3a'}"/>`).join('');
  D.veins = (x0, y0, x1, y1, col = '#ff7a2a', w = 2.4) => { let d = `M${f(x0)} ${f(y0)}`; for (let i = 1; i <= 6; i++) { const t = i / 6; d += ` L${f(x0 + (x1 - x0) * t + (i < 6 ? (R() - 0.5) * 16 : 0))} ${f(y0 + (y1 - y0) * t + (i < 6 ? (R() - 0.5) * 10 : 0))}`; } return `<path d="${d}" stroke="${col}" stroke-width="${w * 2.6}" fill="none" opacity="0.35"/><path d="${d}" stroke="${col}" stroke-width="${w}" fill="none"/><path d="${d}" stroke="#fff2c0" stroke-width="${w * 0.35}" fill="none"/>`; };
  D.barnacles = (x, y, n, spread) => { let o = ''; for (let i = 0; i < n; i++) { const bx = x + (R() - 0.5) * spread * 2, by = y + (R() - 0.5) * spread * 1.4, r = 2.4 + R() * 3.6;
    o += `<path d="M${f(bx - r)} ${f(by + r * 0.6)} L${f(bx - r * 0.5)} ${f(by - r * 0.8)} L${f(bx + r * 0.5)} ${f(by - r * 0.8)} L${f(bx + r)} ${f(by + r * 0.6)} Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.7"/><ellipse cx="${f(bx)}" cy="${f(by - r * 0.7)}" rx="${f(r * 0.45)}" ry="${f(r * 0.22)}" fill="${G.black}"/><path d="M${f(bx - r * 0.3)} ${f(by + r * 0.5)} L${f(bx - r * 0.2)} ${f(by - r * 0.6)}" stroke="${INK}" stroke-width="0.4"/>`; } return o; };
  // a lava fissure: one meandering main crack with short forks; dark lips, orange core, hot white thread
  D.crack = (x0, y0, x1, y1) => {
    const pts = [[x0, y0]]; const n = 7 + Math.floor(R() * 4);
    for (let i = 1; i <= n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t + (R() - 0.5) * 18 * Math.sin(t * 3.14), y0 + (y1 - y0) * t + (R() - 0.5) * 6]); }
    const forks = [];
    for (let i = 2; i < n - 1; i += 2 + Math.floor(R() * 2)) { const p = pts[i], ang = (R() < 0.5 ? -1 : 1) * (0.6 + R() * 0.7) + Math.atan2(y1 - y0, x1 - x0); const l = 8 + R() * 14; forks.push([p, [p[0] + Math.cos(ang) * l * 0.5 + (R() - 0.5) * 4, p[1] + Math.sin(ang) * l * 0.5], [p[0] + Math.cos(ang) * l, p[1] + Math.sin(ang) * l]]); }
    const P = q => 'M' + q.map(p => `${f(p[0])} ${f(p[1])}`).join(' L');
    let o = `<path d="${P(pts)}" stroke="#ff6a1a" stroke-width="7" fill="none" opacity="0.28" stroke-linejoin="round"/>`;
    for (const q of [pts, ...forks]) { const w = q === pts ? 1 : 0.6; o += `<path d="${P(q)}" stroke="${G.black}" stroke-width="${f(3.4 * w)}" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${P(q)}" stroke="#e8642a" stroke-width="${f(2 * w)}" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${P(q)}" stroke="#ffe2a0" stroke-width="${f(0.7 * w)}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`; }
    return o;
  };
  // hoarfrost: a pale blue crust that thins at its edge, set with clustered needle crystals
  D.rime = (cx, cy, r) => {
    let o = `<g opacity="0.75">${a.stain(cx, cy, r * 0.55, '#c8dcea', 0.55)}</g>`;
    for (let i = 0; i < 26; i++) { const ang = R() * 6.28, d = Math.sqrt(R()) * r * 0.5, x = cx + Math.cos(ang) * d, y = cy + Math.sin(ang) * d * 0.7, l = 1.5 + R() * 4, t = -1.57 + (R() - 0.5) * 1.6; o += `<path d="M${f(x)} ${f(y)} l${f(Math.cos(t) * l)} ${f(Math.sin(t) * l)}" stroke="${R() < 0.4 ? '#f2f8fc' : '#9ab8cc'}" stroke-width="${f(0.6 + R() * 0.6)}" stroke-linecap="round"/>`; }
    return o;
  };
  D.icicles = (x0, x1, y, n, len) => { let o = ''; for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i + R() * 0.6) / n, l = len * (0.4 + R()), w = 2.5 + R() * 3; o += `<path d="M${f(x - w)} ${f(y)} L${f(x + w)} ${f(y)} L${f(x + (R() - 0.5) * 2)} ${f(y + l)} Z" fill="#dceef8" stroke="#2a4058" stroke-width="0.8"/><path d="M${f(x - w * 0.3)} ${f(y + 2)} L${f(x)} ${f(y + l * 0.7)}" stroke="#fff" stroke-width="0.7" opacity="0.8"/>`; } return o; };
  D.frost = (cx, cy, r) => `<g opacity="0.55">${a.stain(cx, cy, r * 0.7, '#d8ecf6', 0.7)}</g>` + Array.from({ length: 5 }, () => { const x = cx + (R() - 0.5) * r, y = cy + (R() - 0.5) * r, l = 3 + R() * 5; return `<path d="M${f(x - l)} ${f(y)} L${f(x + l)} ${f(y)} M${f(x)} ${f(y - l)} L${f(x)} ${f(y + l)} M${f(x - l * 0.7)} ${f(y - l * 0.7)} L${f(x + l * 0.7)} ${f(y + l * 0.7)}" stroke="#f4fbff" stroke-width="0.7"/>`; }).join('');
  D.spikes = (x, y, n, len, ang = -Math.PI / 2, spread = 1.2, col = '#cfe6f4') => { let o = ''; for (let i = 0; i < n; i++) { const a2 = ang + (i / Math.max(1, n - 1) - 0.5) * spread + (R() - 0.5) * 0.2, l = len * (0.5 + R() * 0.7), w = 4 + R() * 5; const bx = x + (R() - 0.5) * 18, by = y + (R() - 0.5) * 8; o += `<path d="M${f(bx - Math.sin(a2) * w)} ${f(by + Math.cos(a2) * w)} L${f(bx + Math.cos(a2) * l)} ${f(by + Math.sin(a2) * l)} L${f(bx + Math.sin(a2) * w)} ${f(by - Math.cos(a2) * w)} Z" fill="${col}" stroke="${INK}" stroke-width="1"/><path d="M${f(bx)} ${f(by)} L${f(bx + Math.cos(a2) * l * 0.85)} ${f(by + Math.sin(a2) * l * 0.85)}" stroke="#fff" stroke-width="0.8" opacity="0.7"/>`; } return o; };
  D.arc = (x0, y0, x1, y1, w = 2) => { let d = `M${f(x0)} ${f(y0)}`; for (let i = 1; i <= 7; i++) { const t = i / 7; d += ` L${f(x0 + (x1 - x0) * t + (i < 7 ? (R() - 0.5) * 22 : 0))} ${f(y0 + (y1 - y0) * t + (i < 7 ? (R() - 0.5) * 22 : 0))}`; } return `<path d="${d}" stroke="#ffe680" stroke-width="${w * 3.5}" fill="none" opacity="0.3"/><path d="${d}" stroke="#fffbe0" stroke-width="${w}" fill="none"/>`; };
  D.arcs = (x, y, r, n = 3) => a.glow(x, y, r * 1.3, '#ffe680', 0.5) + Array.from({ length: n }, () => { const a0 = R() * 6.28, a1 = a0 + 1 + R() * 2; return D.arc(x + Math.cos(a0) * r * 0.3, y + Math.sin(a0) * r * 0.3, x + Math.cos(a1) * r, y + Math.sin(a1) * r, 1.6); }).join('');
  D.drips = (x0, x1, y, n, len, col = '#6f9cbc') => { let o = ''; for (let i = 0; i < n; i++) o += a.drip(x0 + (x1 - x0) * R(), y + R() * 6, len * (0.4 + R()), 1.6 + R(), col); return o; };
  D.pustules = (cx, cy, r, n) => Array.from({ length: n }, () => { const x = cx + (R() - 0.5) * r * 2, y = cy + (R() - 0.5) * r * 2, rr = 2 + R() * 4.5; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="#b4c058" stroke="${INK}" stroke-width="0.7"/><circle cx="${f(x - rr * 0.3)}" cy="${f(y - rr * 0.3)}" r="${f(rr * 0.35)}" fill="#f0f4c0"/>`; }).join('');
  D.spores = (cx, cy, r, n = 16) => Array.from({ length: n }, () => `<circle cx="${f(cx + (R() - 0.5) * r * 2)}" cy="${f(cy + (R() - 0.5) * r * 2)}" r="${f(0.8 + R() * 2.2)}" fill="${R() < 0.5 ? '#d8e8a0' : '#9ab858'}" opacity="0.85"/>`).join('');
  D.fungus = (x, y, n, s = 1, col = '#b89a6a') => { let o = ''; for (let i = 0; i < n; i++) { const fx = x + (R() - 0.5) * 30 * s, fy = y + (R() - 0.5) * 20 * s, w = (8 + R() * 10) * s; o += `<path d="M${f(fx - w)} ${f(fy)} C${f(fx - w)} ${f(fy - w * 0.9)} ${f(fx + w)} ${f(fy - w * 0.9)} ${f(fx + w)} ${f(fy)} C${f(fx + w * 0.4)} ${f(fy - w * 0.2)} ${f(fx - w * 0.4)} ${f(fy - w * 0.2)} ${f(fx - w)} ${f(fy)} Z" fill="${col}" stroke="${INK}" stroke-width="1"/><path d="M${f(fx - w * 0.6)} ${f(fy - w * 0.25)} L${f(fx + w * 0.6)} ${f(fy - w * 0.25)}" stroke="${INK}" stroke-width="0.5" opacity="0.6"/>` + `<circle cx="${f(fx - w * 0.3)}" cy="${f(fy - w * 0.55)}" r="${f(w * 0.12)}" fill="#efe4c9" opacity="0.8"/>`; } return o; };
  D.cracks = (cx, cy, r, col = '#a47ae0') => Array.from({ length: 4 }, () => { const a0 = R() * 6.28; let x = cx, y = cy, d = `M${f(x)} ${f(y)}`; for (let i = 0; i < 5; i++) { x += Math.cos(a0 + (R() - 0.5)) * r / 5; y += Math.sin(a0 + (R() - 0.5)) * r / 5; d += ` L${f(x)} ${f(y)}`; } return `<path d="${d}" stroke="${col}" stroke-width="3.6" fill="none" opacity="0.45"/><path d="${d}" stroke="${G.black}" stroke-width="1.6" fill="none"/>`; }).join('');
  D.eyes = (cx, cy, r, n, col = '#d8c060') => Array.from({ length: n }, () => { const x = cx + (R() - 0.5) * r * 2, y = cy + (R() - 0.5) * r * 2, rr = 2.5 + R() * 3.5; return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rr * 1.3)}" ry="${f(rr)}" fill="#e8dcc0" stroke="${INK}" stroke-width="0.8"/><circle cx="${f(x - rr * 0.2)}" cy="${f(y)}" r="${f(rr * 0.55)}" fill="${col}"/><circle cx="${f(x - rr * 0.2)}" cy="${f(y)}" r="${f(rr * 0.25)}" fill="${G.black}"/>`; }).join('');
  D.motes = (cx, cy, r, n = 14, col = '#2a1a3a') => Array.from({ length: n }, () => { const x = cx + (R() - 0.5) * r * 2, y = cy + (R() - 0.5) * r * 2; return `<path d="${blob(x, y, 1.5 + R() * 4, R, 6, 0.5)}" fill="${col}" opacity="${f(0.5 + R() * 0.5)}"/>`; }).join('') + Array.from({ length: n / 2 }, () => `<circle cx="${f(cx + (R() - 0.5) * r * 2)}" cy="${f(cy + (R() - 0.5) * r * 2)}" r="0.9" fill="#e0d0ff"/>`).join('');
  D.weed = (x, y, len) => { let d = `M${x} ${y}`, cx = x, cy = y; for (let i = 1; i <= 5; i++) { const nx = x + Math.sin(i * 1.3 + R()) * 5, ny = y + len * i / 5; d += ` Q${f(cx + 6)} ${f((cy + ny) / 2)} ${f(nx)} ${f(ny)}`; cx = nx; cy = ny; } return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3.2"/><path d="${d}" fill="none" stroke="${G.algae}" stroke-width="1.9"/>`; };
  D.glowEye = (x, y, r, col) => a.glow(x, y, r * 4, col, 0.8) + `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.3)}" ry="${f(r * 0.8)}" fill="${light(col, 0.6)}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.4)}" fill="#fff"/>`;
  D.chain = (x0, y0, x1, y1, n = 12, col = G.iron) => { let o = ''; for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 14; o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${i % 2 ? 2.4 : 4.6}" ry="3.4" fill="none" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${i % 2 ? 2.4 : 4.6}" ry="3.4" fill="none" stroke="${col}" stroke-width="1.2"/>`; } return o; };
  // the elemental signature applied around a point: one call per element
  D.aura = (el, x, y, s = 1) => ({
    fire: () => a.glow(x, y, 50 * s, '#ff6a1a', 0.45) + D.embers(x, y - 10 * s, 70 * s, 14) + `<path d="M${f(x - 6)} ${f(y)} C${f(x - 20 * s)} ${f(y - 30 * s)} ${f(x + 14 * s)} ${f(y - 50 * s)} ${f(x - 4)} ${f(y - 80 * s)}" stroke="#4a4440" stroke-width="${f(10 * s)}" fill="none" opacity="0.18" stroke-linecap="round"/>`,
    frost: () => D.rime(x, y, 40 * s) + D.icicles(x - 24 * s, x + 24 * s, y + 4, 5, 22 * s) + `<path d="M${f(x - 30 * s)} ${f(y - 10)} C${f(x - 10)} ${f(y - 30 * s)} ${f(x + 20 * s)} ${f(y - 24 * s)} ${f(x + 36 * s)} ${f(y - 44 * s)}" stroke="#dceaf4" stroke-width="${f(8 * s)}" fill="none" opacity="0.14" stroke-linecap="round"/>`,
    lightning: () => D.arcs(x, y, 40 * s, 3),
    water: () => D.drips(x - 20 * s, x + 20 * s, y, 4, 22 * s),
    toxin: () => D.pustules(x, y, 14 * s, 6) + D.spores(x, y - 20 * s, 30 * s, 10),
    void: () => D.motes(x, y - 10 * s, 30 * s, 10) + a.glow(x, y, 30 * s, '#2a1a3a', 0.8),
  }[el] || (() => ''))();
  // surface decals clipped into a shape: lava veins, frost, static runes, wet sheen, pustules, cracks
  D.skin = (el, cx, cy, r) => ({
    fire: () => D.crack(cx + (R() - 0.5) * r * 0.6, cy - r * 0.5, cx + (R() - 0.5) * r * 0.6, cy + r * 0.55),
    frost: () => D.rime(cx - r * 0.2, cy - r * 0.35, r * 0.9),
    lightning: () => `<g stroke="#e8d070" stroke-width="1.4" fill="none" opacity="0.9"><path d="M${f(cx - r * 0.4)} ${f(cy - r * 0.3)} l8 10 l-6 8 l10 10 M${f(cx + r * 0.2)} ${f(cy)} l-8 12 l8 6 l-6 12"/></g>`,
    water: () => a.stain(cx, cy + r * 0.3, r * 0.5, G.algae, 0.5) + `<path d="M${f(cx - r * 0.3)} ${f(cy - r * 0.5)} C${f(cx - r * 0.2)} ${f(cy)} ${f(cx - r * 0.3)} ${f(cy + r * 0.4)} ${f(cx - r * 0.2)} ${f(cy + r * 0.7)}" stroke="#d8eef8" stroke-width="1.2" opacity="0.5" fill="none"/>`,
    toxin: () => a.stain(cx, cy, r * 0.6, '#7a8a3a', 0.6) + D.pustules(cx, cy, r * 0.5, 7),
    void: () => D.cracks(cx, cy, r * 0.8) + (r >= 40 ? D.eyes(cx, cy, r * 0.4, 2, '#a47ae0') : ''),
  }[el] || (() => ''))();
  return D;
}

// ------------------------------------------------------------------ weapons and held things (drawn at a wrist, pointing along dir)
function held(a, D, kind, wr, dir, pal, els) {
  const [x, y] = wr, l = Math.hypot(dir[0], dir[1]), ux = dir[0] / l, uy = dir[1] / l, nx = -uy, ny = ux;
  const SC = 1.45, q = (s, t) => [x + (ux * s + nx * t) * SC, y + (uy * s + ny * t) * SC];
  const metal = pal.metal || G.steel, wood = pal.wood || G.woodD, el = els[0];
  const P = pts => smooth(pts, true, 0.4);
  const haft = (len, w = 6) => a.shape({ d: poly([q(-30, -w / 2), q(len, -w / 2), q(len, w / 2), q(-30, w / 2)]), fill: wood, depth: 3, core: false, ink: 1, lines: [`M${f(q(-28, 0)[0])} ${f(q(-28, 0)[1])} L${f(q(len - 4, 0)[0])} ${f(q(len - 4, 0)[1])}`], lineCol: dark(wood, 0.4) });
  switch (kind) {
    case 'sword': case 'greatsword': {
      const L2 = kind === 'greatsword' ? 170 : 120, w = kind === 'greatsword' ? 13 : 9;
      a.shape({ d: poly([q(-24, -3), q(0, -4), q(0, 4), q(-24, 3)]), fill: G.leatherD, depth: 2, core: false, ink: 1 });
      a.shape({ d: poly([q(2, -w * 1.8), q(10, -w * 1.8), q(10, w * 1.8), q(2, w * 1.8)]), fill: metal, depth: 3, core: false, ink: 1 });
      a.shape({ d: poly([q(10, -w / 2), q(L2, -w / 2 + 2), q(L2 + 22, 0), q(L2, w / 2 - 1), q(10, w / 2)]), fill: metal, depth: 4, core: false, ink: 1.2, spec: [`M${f(q(14, -1)[0])} ${f(q(14, -1)[1])} L${f(q(L2, -1)[0])} ${f(q(L2, -1)[1])}`], specOp: 0.6,
        decals: a.stain(q(L2 * 0.6, 0)[0], q(L2 * 0.6, 0)[1], 12, G.blood, 0.6) + a.stain(q(L2 * 0.3, 2)[0], q(L2 * 0.3, 2)[1], 8, G.rust, 0.6) });
      return q(L2, 0);
    }
    case 'axe': case 'pick': case 'hammer': case 'mace': {
      haft(110);
      const h = q(110, 0);
      if (kind === 'axe') a.shape({ d: P([q(92, -4), q(118, -6), q(130, -38), q(108, -46), q(96, -30)]), fill: metal, depth: 5, ink: 1.2, decals: a.stain(q(120, -30)[0], q(120, -30)[1], 9, G.blood, 0.7) });
      if (kind === 'pick') a.shape({ d: P([q(100, -60), q(112, -6), q(110, 8), q(98, 6), q(92, -50)]), fill: metal, depth: 4, ink: 1.1 });
      if (kind === 'hammer') a.shape({ d: poly([q(96, -28), q(128, -28), q(128, 28), q(96, 28)]), fill: metal, depth: 8, ink: 1.3, lines: [`M${f(q(104, -28)[0])} ${f(q(104, -28)[1])} L${f(q(104, 28)[0])} ${f(q(104, 28)[1])}`], decals: a.stain(h[0], h[1], 14, G.rust, 0.6) });
      if (kind === 'mace') { a.shape({ d: blob(h[0], h[1], 20, a.R, 9, 0.15), fill: metal, depth: 8, ink: 1.2 }); a.raw(D.spikes(h[0], h[1], 7, 16, Math.atan2(uy, ux), 4.6, metal)); }
      return h;
    }
    case 'spear': case 'harpoon': case 'trident': {
      haft(190, 5);
      const t = q(190, 0);
      if (kind === 'trident') for (const o of [-14, 0, 14]) a.shape({ d: poly([q(180, o - 3), q(214, o - 2), q(226, o), q(214, o + 2), q(180, o + 3)]), fill: metal, depth: 2, core: false, ink: 1 });
      else a.shape({ d: P([q(186, -6), q(226, -3), q(240, 0), q(226, 3), q(186, 6), q(196, 0)]), fill: metal, depth: 3, core: false, ink: 1.1, after: kind === 'harpoon' ? `<path d="M${f(q(214, 0)[0])} ${f(q(214, 0)[1])} L${f(q(200, -14)[0])} ${f(q(200, -14)[1])} M${f(q(214, 0)[0])} ${f(q(214, 0)[1])} L${f(q(200, 14)[0])} ${f(q(200, 14)[1])}" stroke="${INK}" stroke-width="3"/>` : '' });
      return q(236, 0);
    }
    case 'scythe': {
      haft(150, 6);
      a.shape({ d: P([q(146, 0), q(156, 40), q(140, 110), q(110, 150), q(126, 100), q(136, 40)]), fill: metal, depth: 5, ink: 1.2, decals: a.stain(q(186, 90)[0], q(186, 90)[1], 12, G.blood, 0.6) });
      return q(140, 80);
    }
    case 'staff': {
      const top = [x + 6, y - 190], bot = [x - 6, y + 250];
      a.shape({ d: limb([bot, [x, y], top], [8, 9, 8]), fill: wood, depth: 4, ink: 1, core: false });
      a.shape({ d: blob(top[0], top[1] - 14, 18, a.R, 8, 0.25), fill: pal.accent || G.bone, depth: 6, ink: 1.2, decals: D.skin(el, top[0], top[1] - 14, 18) });
      a.raw(D.aura(el, top[0], top[1] - 24, 0.9));
      return [top[0], top[1] - 24];
    }
    case 'censer': case 'lantern': {
      const v = [x, y + 70];
      a.raw(`<path d="M${f(x)} ${f(y)} L${f(v[0])} ${f(v[1] - 18)}" stroke="${INK}" stroke-width="2.2"/>`);
      a.shape({ d: P([[v[0] - 14, v[1] - 18], [v[0] + 14, v[1] - 18], [v[0] + 18, v[1] + 8], [v[0], v[1] + 22], [v[0] - 18, v[1] + 8]]), fill: pal.metal || G.gold, depth: 6, ink: 1.2, lines: [`M${f(v[0] - 16)} ${f(v[1])} L${f(v[0] + 16)} ${f(v[1])}`] });
      a.raw(a.glow(v[0], v[1], 40, EGLOW[el] || '#ffb050', 0.6) + D.aura(el, v[0], v[1] - 18, 0.6));
      return v;
    }
    case 'torch': {
      a.shape({ d: limb([q(-20, 0), q(70, 0)], [9, 12]), fill: wood, depth: 3, core: false, ink: 1 });
      const t = q(76, 0); a.raw(D.flame(t[0], t[1] + 6, 54, 16, -0.2) + D.embers(t[0], t[1] - 20, 50, 8));
      return t;
    }
    case 'claws': {
      for (const o of [-10, -3, 4, 11]) { const p0 = q(28, o), p1 = q(64, o * 1.6); a.raw(`<path d="M${f(p0[0])} ${f(p0[1])} Q${f(q(50, o * 1.4 - 6)[0])} ${f(q(50, o * 1.4 - 6)[1])} ${f(p1[0])} ${f(p1[1])}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M${f(p0[0])} ${f(p0[1])} Q${f(q(50, o * 1.4 - 6)[0])} ${f(q(50, o * 1.4 - 6)[1])} ${f(p1[0])} ${f(p1[1])}" stroke="${G.bone}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`); }
      return q(60, 0);
    }
    case 'book': {
      a.shape({ d: P([q(4, -26), q(40, -30), q(44, 0), q(40, 30), q(4, 26)]), fill: G.parch, depth: 4, ink: 1.1, lines: [`M${f(q(6, 0)[0])} ${f(q(6, 0)[1])} L${f(q(42, 0)[0])} ${f(q(42, 0)[1])}`, ...[-18, -10, 10, 18].map(o => `M${f(q(12, o)[0])} ${f(q(12, o)[1])} L${f(q(36, o)[0])} ${f(q(36, o)[1])}`)], decals: a.stain(q(30, 12)[0], q(30, 12)[1], 8, G.blood, 0.7) });
      a.raw(D.aura(el, q(24, 0)[0], q(24, 0)[1] - 30, 0.7));
      return q(24, 0);
    }
    case 'bell': {
      const v = [x, y - 30];
      a.shape({ d: P([[v[0] - 6, v[1] - 40], [v[0] + 6, v[1] - 40], [v[0] + 22, v[1]], [v[0] - 22, v[1]]]), fill: pal.metal || G.gold, depth: 10, ink: 1.3, decals: a.stain(v[0], v[1] - 20, 10, '#4f7f6a', 0.7) });
      return v;
    }
    case 'chain': { a.raw(D.chain(x, y, x - 120, y + 60, 16) + `<path d="${blob(x - 124, y + 64, 12, a.R, 7, 0.2)}" fill="${G.iron}" stroke="${INK}" stroke-width="1.2"/>`); return [x - 124, y + 64]; }
    case 'orb': { a.raw(a.glow(x - 10, y - 26, 50, EGLOW[el] || '#fff', 0.8) + `<circle cx="${f(x - 10)}" cy="${f(y - 26)}" r="16" fill="${light(EGLOW[el] || '#ffffff', 0.4)}" stroke="${INK}" stroke-width="1.2"/>` + D.aura(el, x - 10, y - 26, 0.7)); return [x - 10, y - 26]; }
    case 'shield': {
      a.shape({ d: P([[x - 46, y - 70], [x + 30, y - 76], [x + 36, y + 20], [x - 4, y + 90], [x - 50, y + 24]]), fill: pal.metal || G.steelD, depth: 14, mottle: 0.5, ink: 1.4, hatch: 60,
        decals: a.stain(x - 10, y, 22, G.rust, 0.6) + D.skin(el, x - 6, y, 40) + `<path d="M${f(x - 30)} ${f(y - 50)} L${f(x + 16)} ${f(y - 54)} L${f(x + 18)} ${f(y + 12)} L${f(x - 6)} ${f(y + 60)} L${f(x - 34)} ${f(y + 14)} Z" fill="none" stroke="${INK}" stroke-width="1"/>`, after: a.rivet(x - 30, y - 50) + a.rivet(x + 16, y - 54) + a.rivet(x - 6, y + 56) });
      return [x, y];
    }
    case 'hook': { a.raw(`<path d="M${f(x)} ${f(y)} L${f(x - 6)} ${f(y + 50)} C${f(x - 10)} ${f(y + 80)} ${f(x - 40)} ${f(y + 80)} ${f(x - 44)} ${f(y + 56)}" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${f(x)} ${f(y)} L${f(x - 6)} ${f(y + 50)} C${f(x - 10)} ${f(y + 80)} ${f(x - 40)} ${f(y + 80)} ${f(x - 44)} ${f(y + 56)}" stroke="${G.steel}" stroke-width="4" fill="none" stroke-linecap="round"/>`); return [x - 40, y + 70]; }
    default: return [x, y];
  }
}

// ------------------------------------------------------------------ humanoid
// Built from grim/anatomy.js: contrapposto stance, leaning toward the heroes, modelled head on a real neck,
// muscled limbs, gripping fists, garments and armour layered over the body.
function humanoid(a, D, s) {
  const A = require('./anatomy')(a), R = a.R;
  const pal = s.pal, els = s.els, el = els[0], el2 = els[1] || el;
  const w = { gaunt: 0.86, normal: 1, heavy: 1.22, giant: 1.34 }[s.build || 'normal'];
  const cx = 232, skin = pal.skin, cloth = pal.cloth, metal = pal.metal || G.steelD;
  const dress = s.dress || 'rags';
  const armour = dress === 'armor';
  const limbCol = s.armFill || (armour ? metal : (dress === 'robe' ? cloth : (dress === 'furs' ? dark(cloth, 0.05) : skin)));
  const hipY = 444, lean = s.lean !== undefined ? s.lean : 10;
  a.layer('shadow'); a.raw(a.ground(cx, 676, 112 * w + 24, 10));
  // ---------------------------------------------------------------- back: wings, halo, far arm and off-hand
  a.layer('back', [cx - 10, 230]);
  if (s.wings) wings(a, D, s.wings, [cx + 24, 236], pal, els, 1);
  if (s.halo) a.raw(a.glow(cx - 22, 136, 96, EGLOW[el] || '#f6d27a', 0.45) + `<ellipse cx="${cx - 18}" cy="128" rx="60" ry="62" fill="none" stroke="${INK}" stroke-width="7"/><ellipse cx="${cx - 18}" cy="128" rx="60" ry="62" fill="none" stroke="${pal.accent || G.goldL}" stroke-width="4"/>` + Array.from({ length: 16 }, (_, i) => { const t = i / 16 * 6.28, r0 = 64, r1 = 70 + (i % 2) * 12; return `<path d="M${f(cx - 18 + Math.cos(t) * r0)} ${f(128 + Math.sin(t) * r0)} L${f(cx - 18 + Math.cos(t) * r1)} ${f(128 + Math.sin(t) * r1)}" stroke="${pal.accent || G.goldL}" stroke-width="2.2"/>`; }).join(''));
  const off = s.off || 'none';
  const T0 = (dx, dy) => [cx - lean + dx * w * (dy < 330 ? 1.28 : 1.12) + (dy / 240) * lean, dy];
  const fsh = T0(-40, 228);
  const farEl = off === 'shield' ? [fsh[0] - 30 * w, 300] : [fsh[0] - 12 * w, 312];
  const farW = off === 'shield' ? [fsh[0] - 54 * w, 340] : (off === 'none' ? [fsh[0] - 18 * w, 392] : [fsh[0] - 50 * w, 370]);
  A.arm({ sh: fsh, el: farEl, wr: farW, fill: dark(limbCol, 0.12), w: w * 0.98, hatch: 40, bracer: armour ? dark(metal, 0.1) : undefined });
  const farDir = off === 'shield' ? [-1, -0.2] : (off === 'none' ? [-0.25, 1] : [-1, 0.35]);
  if (off === 'none') A.hand(farW, farDir, dark(armour ? metal : skin, 0.1), w, s.claws);
  else { const gp = A.fist(farW, farDir, dark(armour ? metal : skin, 0.1), w, armour); held(a, D, off, gp, farDir, pal, els); A.fist(farW, farDir, dark(armour ? metal : skin, 0.1), w, armour); }
  // ---------------------------------------------------------------- legs: weight on the far leg, near leg striding toward the heroes
  a.layer('legs', [cx, hipY]);
  const footKind = s.feet === 'talon' ? 'talon' : (armour ? 'sabaton' : (dress === 'bare' ? 'bare' : 'boot'));
  const legFill = armour ? dark(cloth, 0.1) : (s.legFill || (dress === 'bare' ? skin : dark(cloth, 0.12)));
  const footFill = armour ? metal : (dress === 'bare' ? skin : G.leatherD);
  if (dress !== 'robe' && !s.float && !s.tail) {
    A.leg({ hip: [cx + 8 * w, hipY - 8], knee: [cx + 30, 548], ankle: [cx + 56, 650], w: w * 0.98, fill: dark(legFill, 0.15), shin: dark(legFill, 0.15), foot: footKind, footFill: dark(footFill, 0.15), hatch: 40, greave: armour ? dark(metal, 0.15) : undefined, wraps: dress === 'furs' || dress === 'rags' });
    A.leg({ hip: [cx - 22 * w, hipY - 6], knee: [cx - 44, 544], ankle: [cx - 58, 654], w: w * 0.98, fill: legFill, shin: legFill, foot: footKind, footFill, hatch: 110, greave: armour ? metal : undefined, wraps: dress === 'furs' || dress === 'rags', bare: dress === 'bare', shinDecals: D.skin(el2, cx - 34, 600, 22) });
  }
  if (s.tail) {
    const tc = s.tail === true ? (pal.tail || dark(skin, 0.15)) : s.tail;
    a.limb([[cx, hipY - 20], [cx + 26, 520], [cx + 30, 590], [cx - 10, 640], [cx - 80, 652], [cx - 130, 640]], [96 * w, 86 * w, 66 * w, 48 * w, 30 * w, 16 * w], { fill: tc, tex: 'url(#mail)', texOp: 0.45, depth: 14, mottle: 0.5, fine: true, hatch: 60,
      decals: D.barnacles(cx + 20, 560, 8, 24) + a.stain(cx, 600, 30, G.algae, 0.6) + a.gash(cx + 20, 600, cx + 40, 620, 4, { rim: '#c08070', dripLen: 12 }), spec: [`M${cx + 30} 500 C${cx + 40} 560 ${cx + 30} 610 ${cx} 636`], specOp: 0.3 });
    a.shape({ d: smooth([[cx - 126, 636], [cx - 180, 600], [cx - 200, 616], [cx - 178, 640], [cx - 206, 662], [cx - 186, 676], [cx - 126, 650]], true, 0.4), fill: light(tc, 0.12), depth: 8, core: false, lines: [`M${cx - 128} 642 L${cx - 190} 606`, `M${cx - 128} 644 L${cx - 196} 640`, `M${cx - 128} 646 L${cx - 190} 670`] });
  }
  if (s.float && dress !== 'robe' && !s.tail) for (const [x, far] of [[cx + 6, 1], [cx - 18, 0]]) {
    a.limb([[x, hipY - 10], [x - 6, 500], [x - 14, 560], [x - 8, 614]], [46 * w, 40 * w, 28 * w, 18 * w], { fill: far ? dark(skin, 0.25) : skin, depth: 10, mottle: 0.5, fine: true, hatch: far ? 40 : 110 });
    A.foot([x - 8, 612], 'talon', G.bone, w);
  }
  // ---------------------------------------------------------------- torso and garment
  a.layer('body', [cx, hipY]);
  const tFill = { armor: dark(cloth, 0.05), bare: skin, robe: cloth, rags: cloth, furs: dark(cloth, 0.05), apron: s.shirt || light(cloth, 0.15) }[dress];
  if (dress === 'robe') {
    const hem = s.float ? 610 : 668, fl = 52 * w;
    const pts = [T0(-34, 214), T0(30, 214), T0(48, 300), [cx + 40 * w + fl * 0.5, 470], [cx + 30 * w + fl, hem - 20]];
    for (let i = 0; i <= 10; i++) { const x = cx + 30 * w + fl - (60 * w + fl * 2) * i / 10; pts.push([x + (R() - 0.5) * 6, hem + (i % 2 ? 10 + R() * 14 : R() * 6)]); }
    pts.push([cx - 30 * w - fl * 0.5, 470], T0(-54, 300));
    let folds = ''; for (let i = 0; i < 6; i++) { const x0 = cx - 30 * w + i * 13 * w, x1 = cx - 40 * w - fl * 0.6 + i * (20 * w + fl * 0.24); folds += a.fold(x0, 330 + R() * 30, x1, hem - 6, 7); }
    a.shape({ d: smooth(pts, true, 0.5), fill: cloth, depth: 44, mottle: 0.55, fine: true, hatch: 80, tex: 'url(#weave)', texOp: 0.35, decals: folds + a.stain(cx, hem - 50, 34, dark(cloth, 0.45), 0.7) + D.skin(el2, cx + 10, 530, 60) + a.stain(cx - 20, 400, 16, G.blood, 0.45) });
  }
  const tor = A.torso({ cx, w, lean, fill: tFill, bare: dress === 'bare', tex: armour ? 'url(#mail)' : (dress === 'robe' ? 'url(#weave)' : undefined), texOp: armour ? 0.55 : 0.35,
    decals: (dress === 'bare' ? D.skin(el, cx - 6, 330, 46) : '') + a.stain(cx + 8, 404, 16, G.blood, 0.45) });
  if (armour) { A.breastplate(tor, metal, w, D.skin(el, cx - 10, 290, 34)); A.tassets(tor, dark(metal, 0.08), w); A.gorget(tor, metal); }
  if ((dress === 'rags' || dress === 'bare') && !s.noLoin && !s.tail) {
    const hem = dress === 'bare' ? 500 : 530, T = tor.T;
    const pts = [T(-40, 424), T(40, 420)]; for (let i = 0; i <= 8; i++) { const x = T(44 - 88 * i / 8, 0)[0]; pts.push([x + (R() - 0.5) * 5, hem + (i % 2 ? 14 + R() * 16 : R() * 6)]); }
    a.shape({ d: smooth(pts, true, 0.4), fill: dark(cloth, 0.15), depth: 18, mottle: 0.6, fine: true, hatch: 80, decals: a.fold(cx - 10, 434, cx - 16, hem, 6) + a.fold(cx + 18, 434, cx + 22, hem, 5) + a.stain(cx, hem - 20, 14, G.black, 0.5) });
  }
  if (dress === 'rags') { const T = tor.T; a.raw(`<path d="${blob(T(-18, 300)[0], 300, 9, R, 7, 0.4)}" fill="${skin}" stroke="${INK}" stroke-width="1"/><path d="${blob(T(14, 370)[0], 370, 7, R, 7, 0.4)}" fill="${skin}" stroke="${INK}" stroke-width="1"/>` + `<path d="M${f(T(-30, 250)[0])} 250 l14 4 m-12 4 l12 2" stroke="${INK}" stroke-width="0.8"/>`); }
  if (dress === 'apron') { const T = tor.T, aw = Math.min(w, 1.05); a.shape({ d: smooth([T(-22 / w * aw, 252), T(6 / w * aw, 250), T(10 / w * aw, 290), [cx - 4 + 30 * aw, 350], [cx + 24 * aw, 520], [cx - 10, 532], [cx - 44 * aw, 520], [cx - 10 - 40 * aw, 350], T(-32 / w * aw, 290)], true, 0.4), fill: pal.apron || '#7a5a3e', depth: 18, mottle: 0.8, grime: 0.3, hatch: 70, decals: a.stain(cx - 10, 430, 28, G.blood, 0.75) + a.stain(cx - 16, 340, 16, G.bloodD, 0.6) + a.splat(cx - 20, 480, 6, { drops: 5 }) + D.skin(el, cx - 10, 470, 28) + a.fold(cx - 20, 300, cx - 26, 540, 6) + a.fold(cx + 4, 300, cx + 10, 540, 6), lines: [`M${f(T(-24, 252)[0])} 252 L${f(T(-46, 214)[0])} 212`] }); }
  if (dress === 'furs') { const T = tor.T; const pts = [T(-56, 220), T(-20, 196), T(30, 200), T(60, 230), T(62, 270)]; for (let i = 0; i <= 12; i++) { const x = T(60 - 124 * i / 12, 0)[0]; pts.push([x + (R() - 0.5) * 6, 290 + (i % 2 ? 22 + R() * 18 : R() * 8)]); } pts.push(T(-66, 266));
    a.shape({ d: smooth(pts, true, 0.45), fill: pal.fur || '#6a5a48', depth: 22, mottle: 0.6, hatch: 70, lines: Array.from({ length: 30 }, () => { const x = T(-56 + R() * 112, 0)[0], y = 216 + R() * 70; return `M${f(x)} ${f(y)} q${f(-3 + R() * 6)} 10 ${f(-2 + R() * 4)} ${f(18 + R() * 16)}`; }), decals: D.skin(el2, cx, 236, 40) + a.stain(cx - 20, 270, 16, G.black, 0.4) }); }
  if (s.belt !== false && dress !== 'robe' && !armour && !s.tail) { const T = tor.T; a.shape({ d: smooth([T(-38, 420), T(40, 416), T(40, 434), T(-38, 438)], true, 0.2), fill: G.leatherD, depth: 4, lines: [`M${f(T(-36, 428)[0])} 428 L${f(T(38, 424)[0])} 424`], after: `<rect x="${f(T(-16, 418)[0])}" y="416" width="14" height="20" fill="none" stroke="${G.steelL}" stroke-width="2.2"/>` }); }
  if (dress === 'robe') { const T = tor.T; a.raw(`<path d="${curve2([T(-44, 420), T(0, 428), T(44, 418)])}" stroke="${INK}" stroke-width="5" fill="none"/><path d="${curve2([T(-44, 420), T(0, 428), T(44, 418)])}" stroke="${G.parchD}" stroke-width="3" fill="none" stroke-dasharray="3 2"/><path d="M${f(T(-20, 426)[0])} 426 L${f(T(-24, 480)[0])} 486 M${f(T(-14, 426)[0])} 426 L${f(T(-12, 470)[0])} 476" stroke="${INK}" stroke-width="1.6"/>`); }
  if (s.chains) a.raw(D.chain(tor.T(-46, 300)[0], 290, tor.T(46, 380)[0], 384, 14));
  if (s.body_extra) s.body_extra(a, D, cx, w);
  // ---------------------------------------------------------------- head on a neck, then headgear
  const hx = tor.neck[0] - 18, hy = 150;
  a.layer('head', [tor.neck[0], 210]);
  if (s.gear === 'hood') a.shape({ d: smooth([[hx - 42, 168], [hx - 22, 98], [hx + 30, 84], [hx + 68, 118], [hx + 74, 196], [hx + 60, 240], [hx + 30, 220], [hx + 34, 164], [hx + 12, 130], [hx - 14, 136], [hx - 22, 186], [hx - 22, 228], [hx - 42, 224]], true, 0.6), fill: s.hoodFill || dark(cloth, 0.25), depth: 16, mottle: 0.5, hatch: 30 });
  A.neck({ x: hx, y: hy, skin: armour && s.gear === 'helm' ? metal : skin, w: w * 0.95 });
  if (armour) A.gorget(tor, metal);
  const hs = Object.assign({ x: hx, y: hy, k: (s.headK || 1) * (w > 1.2 ? 1.06 : 1), skin, style: 'gaunt', jaw: 0.2, eye: 'glint', glow: EGLOW[el] }, s.headSpec || {});
  if (hs.style === 'skull' && !hs.eye) hs.eye = 'socket';
  const H = s.head !== false ? A.head(hs) : { top: [hx, 100], eye: [hx - 24, 148] };
  const gear = s.gear || 'none';
  if (gear === 'hood') a.shape({ d: smooth([[hx - 40, 146], [hx - 20, 100], [hx + 30, 88], [hx + 64, 118], [hx + 56, 130], [hx + 28, 112], [hx - 6, 116], [hx - 24, 152]], true, 0.6), fill: s.hoodFill || dark(cloth, 0.25), depth: 10, mottle: 0.5, hatch: 30, decals: a.fold(hx, 104, hx + 30, 118, 4) });
  if (gear === 'helm' || gear === 'horns') {
    a.shape({ d: smooth([[hx - 46, 160], [hx - 42, 116], [hx - 14, 92], [hx + 26, 94], [hx + 42, 124], [hx + 40, 186], [hx + 24, 198], [hx + 6, 182], [hx - 4, 168], [hx - 30, 172], [hx - 44, 176]], true, 0.55), fill: metal, depth: 16, mottle: 0.45, hatch: 70, spec: [`M${hx - 28} 112 C${hx - 8} 98 ${hx + 18} 100 ${hx + 30} 112`], specOp: 0.55,
      decals: a.stain(hx + 12, 130, 12, G.rust, 0.6) + D.skin(el, hx, 128, 24), lines: [`M${hx - 44} 146 L${hx - 2} 148`, `M${hx - 18} 96 L${hx - 22} 172`, { d: `M${hx - 40} 156 L${hx - 8} 158`, w: 0.6 }],
      after: `<path d="M${hx - 46} 140 L${hx - 2} 142 L${hx - 4} 152 L${hx - 46} 151 Z" fill="${G.black}"/>` + D.glowEye(hx - 26, 146, 2.4, EGLOW[el] || '#fff') + [0, 1, 2, 3].map(i => `<circle cx="${hx - 40 + i * 6}" cy="166" r="1.6" fill="${G.black}"/>`).join('') + a.rivet(hx + 18, 118, 2) + a.rivet(hx + 30, 160, 2) });
    if (gear === 'horns') for (const sg of [-1, 1]) a.limb([[hx + 4 + sg * 14, 106], [hx + 14 + sg * 30, 74], [hx + 40 + sg * 30, 46], [hx + 60 + sg * 22, 50]], [20, 15, 9, 3], { fill: pal.horn || G.bone, depth: 6, mottle: 0.5, hatch: 120, lines: [0, 1, 2, 3, 4].map(i => `M${hx + 6 + sg * 18 + i * 8} ${96 - i * 9} l${sg * 8} 6`) });
  }
  if (gear === 'crown') { const t = H.top; a.shape({ d: poly([[t[0] - 34, t[1] + 26], [t[0] - 30, t[1] - 4], [t[0] - 18, t[1] + 14], [t[0] - 6, t[1] - 14], [t[0] + 6, t[1] + 10], [t[0] + 18, t[1] - 10], [t[0] + 28, t[1] + 16], [t[0] + 32, t[1] + 30], [t[0] - 32, t[1] + 34]]), fill: pal.crown || G.gold, depth: 8, ink: 1.3, mottle: 0.5, hatch: 70, decals: a.stain(t[0], t[1] + 22, 10, G.rust, 0.6), spec: [`M${t[0] - 28} ${t[1] + 26} L${t[0] + 26} ${t[1] + 24}`], specOp: 0.5, after: [[-22, 26], [0, 24], [20, 26]].map(([dx, dy]) => `<circle cx="${t[0] + dx}" cy="${t[1] + dy}" r="3" fill="${EGLOW[el] || '#a83a2a'}" stroke="${INK}" stroke-width="0.8"/>`).join('') }); }
  if (gear === 'antlers') for (const sg of [-1, 1]) { const base = [H.top[0] + 4 + sg * 12, H.top[1] + 12], tip = [base[0] + sg * 56 + 10, base[1] - 82]; let o = `M${f(base[0])} ${f(base[1])} C${f(base[0] + sg * 8)} ${f(base[1] - 30)} ${f(tip[0] - sg * 22)} ${f(tip[1] + 24)} ${f(tip[0])} ${f(tip[1])}`; for (let i = 0; i < 4; i++) { const t = 0.32 + i * 0.17, bx = base[0] + (tip[0] - base[0]) * t, by = base[1] + (tip[1] - base[1]) * t; o += ` M${f(bx)} ${f(by)} q${f(sg * 4)} -10 ${f(sg * (8 + R() * 12))} ${f(-18 - R() * 14)}`; } a.raw(`<path d="${o}" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${o}" stroke="${pal.horn || '#b8a888'}" stroke-width="5.6" fill="none" stroke-linecap="round"/><path d="${o}" stroke="#fff" stroke-width="1" fill="none" opacity="0.35" transform="translate(-1 -1)"/>` + (els.includes('toxin') ? D.fungus(tip[0], tip[1] + 34, 2, 0.6) : '')); }
  if (gear === 'mask') { const e = H.eye; a.shape({ d: smooth([[e[0] - 14, e[1] - 30], [e[0] + 18, e[1] - 38], [e[0] + 30, e[1] - 6], [e[0] + 26, e[1] + 34], [e[0] + 10, e[1] + 52], [e[0] - 12, e[1] + 46], [e[0] - 22, e[1] + 10]], true, 0.5), fill: pal.mask || '#d8ccb0', depth: 10, ink: 1.3, mottle: 0.6, hatch: 100, spec: [`M${e[0] - 10} ${e[1] - 20} Q${e[0] - 16} ${e[1] + 10} ${e[0] - 8} ${e[1] + 36}`], specOp: 0.5,
    after: `<path d="M${e[0] - 10} ${e[1]} C${e[0] - 4} ${e[1] - 6} ${e[0] + 4} ${e[1] - 6} ${e[0] + 10} ${e[1]} C${e[0] + 4} ${e[1] + 5} ${e[0] - 4} ${e[1] + 5} ${e[0] - 10} ${e[1]} Z" fill="${G.black}"/>` + D.glowEye(e[0], e[1], 1.8, EGLOW[el] || '#fff') + `<path d="M${e[0] - 12} ${e[1] + 32} L${e[0] + 8} ${e[1] + 32}" stroke="${INK}" stroke-width="1.6"/>` + a.drip(e[0] - 2, e[1] + 5, 24, 1.8, G.blood) + `<path d="M${e[0] + 6} ${e[1] - 34} l6 14 l-4 10 l8 12" stroke="${INK}" stroke-width="0.9" fill="none"/>` }); }
  if (gear === 'cage') { const t = H.top; a.raw(Array.from({ length: 7 }, (_, i) => { const x = t[0] - 42 + i * 13; return `<path d="M${x} ${t[1] - 4} C${x - 6} ${t[1] + 40} ${x - 4} ${t[1] + 80} ${x + 4} ${t[1] + 112}" stroke="${INK}" stroke-width="4.6" fill="none"/><path d="M${x} ${t[1] - 4} C${x - 6} ${t[1] + 40} ${x - 4} ${t[1] + 80} ${x + 4} ${t[1] + 112}" stroke="${G.rust}" stroke-width="2.4" fill="none"/>`; }).join('') + `<ellipse cx="${t[0]}" cy="${t[1] - 4}" rx="46" ry="9" fill="none" stroke="${INK}" stroke-width="5.4"/><ellipse cx="${t[0]}" cy="${t[1] - 4}" rx="46" ry="9" fill="none" stroke="${G.rust}" stroke-width="2.6"/><path d="M${t[0]} ${t[1] - 13} L${t[0]} ${t[1] - 30}" stroke="${INK}" stroke-width="3"/><circle cx="${t[0]}" cy="${t[1] - 34}" r="5" fill="none" stroke="${INK}" stroke-width="2.4"/>`); }
  if (gear === 'brim') { const t = H.top, hc = s.hoodFill || G.black;
    // a witch-hunter's capotain: tall tapering crown, a wide brim that droops at the front, a band and a dull buckle
    a.shape({ d: smooth([[t[0] - 30, t[1] + 26], [t[0] - 22, t[1] - 40], [t[0] - 6, t[1] - 52], [t[0] + 16, t[1] - 48], [t[0] + 26, t[1] - 36], [t[0] + 34, t[1] + 22]], true, 0.5), fill: hc, depth: 12, mottle: 0.5, hatch: 30, lines: [{ d: `M${t[0] - 14} ${t[1] - 40} C${t[0] - 16} ${t[1] - 10} ${t[0] - 14} ${t[1] + 6} ${t[0] - 18} ${t[1] + 20}`, w: 0.8 }], decals: a.stain(t[0] + 6, t[1] - 20, 12, '#5a4a3a', 0.4) });
    a.shape({ d: smooth([[t[0] - 31, t[1] + 8], [t[0] + 34, t[1] + 4], [t[0] + 35, t[1] + 20], [t[0] - 31, t[1] + 24]], true, 0.3), fill: G.leatherD, depth: 3, ink: 1, after: `<rect x="${t[0] - 14}" y="${t[1] + 5}" width="14" height="17" fill="none" stroke="${G.boneD}" stroke-width="2.4"/>` });
    a.shape({ d: smooth([[t[0] - 80, t[1] + 44], [t[0] - 40, t[1] + 22], [t[0] + 40, t[1] + 16], [t[0] + 70, t[1] + 26], [t[0] + 60, t[1] + 34], [t[0] - 10, t[1] + 34], [t[0] - 60, t[1] + 50]], true, 0.5), fill: hc, depth: 5, ink: 1.2, hatch: 30, lines: [{ d: `M${t[0] - 70} ${t[1] + 44} C${t[0] - 30} ${t[1] + 28} ${t[0] + 30} ${t[1] + 24} ${t[0] + 62} ${t[1] + 28}`, w: 0.6, op: 0.6 }] }); }
  if (s.head_extra) s.head_extra(a, D, hx, hy);
  // ---------------------------------------------------------------- near arm, weapon in a gripping fist
  const wpn = s.weapon || 'none';
  const pose = s.armPose || ({ sword: 'raised', greatsword: 'raised', axe: 'raised', hammer: 'raised', mace: 'raised', pick: 'raised', scythe: 'raised', torch: 'raised', spear: 'forward', harpoon: 'forward', trident: 'forward', staff: 'forward', censer: 'forward', lantern: 'forward', book: 'forward', orb: 'forward', claws: 'reach', chain: 'low', hook: 'forward', bell: 'raised' }[wpn] || 'low');
  const nsh = tor.nsh;
  const J = { raised: [[nsh[0] + 44, 214], [nsh[0] + 34, 150], [0.55, -0.85]], forward: [[nsh[0] - 34, 316], [nsh[0] - 120, 300], [-1, -0.05]], reach: [[nsh[0] - 20, 300], [nsh[0] - 96, 284], [-1, 0.05]], low: [[nsh[0] + 6, 326], [nsh[0] - 18, 404], [-0.3, 1]] }[pose];
  a.layer('arm', nsh);
  A.arm({ sh: nsh, el: J[0], wr: J[1], fill: limbCol, w: w * 1.02, hatch: 120, bracer: armour ? metal : (dress === 'furs' ? G.leatherD : undefined), upperDecals: D.skin(el2, nsh[0] + 14, 262, 18) });
  if (armour || s.pauldron) A.pauldron([nsh[0] + 2, nsh[1] - 4], metal, w, D.skin(el, nsh[0], nsh[1] - 8, 16));
  if (s.shoulderAura) a.raw(D.aura(el, nsh[0] + 8, nsh[1] - 22, 0.6));
  const wdir = { raised: [0.72, -0.7], forward: [-1, -0.08], reach: [-1, 0.05], low: [-0.4, 1] }[pose];
  const handCol = armour ? metal : skin;
  let tip;
  if (wpn === 'none' || wpn === 'claws') { A.hand(J[1], J[2], handCol, w, s.claws || wpn === 'claws'); tip = [J[1][0] - 40, J[1][1]]; }
  else if (wpn === 'staff' || wpn === 'censer' || wpn === 'lantern' || wpn === 'book' || wpn === 'orb' || wpn === 'bell') { tip = held(a, D, wpn, J[1], wdir, pal, els); A.fist(J[1], J[2], handCol, w, armour); }
  else { const gp = [J[1][0] + J[2][0] * 12, J[1][1] + J[2][1] * 12]; tip = held(a, D, wpn, gp, wdir, pal, els); A.fist(J[1], J[2], handCol, w, armour); }
  if (s.weaponAura) a.raw(D.aura(el, tip[0], tip[1], 0.7));
  return { hand: tip, idle: s.idle || (w > 1.2 ? 'heavy' : (s.float ? 'float' : 'sway')), attack: s.attack || ({ raised: 'swing', forward: (['staff', 'orb', 'book', 'censer', 'lantern'].includes(wpn) ? 'cast' : 'thrust'), reach: 'claw', low: 'grab' }[pose]) };
}
const curve2 = pts => smooth(pts, false, 1);

// ------------------------------------------------------------------ wings: feathered, bat, insect, or tattered
// Built from a jointed arm (shoulder, wrist, hand) with real membrane or layered feathers: coverts, secondaries, primaries.
function wings(a, D, kind, root, pal, els, sc = 1) {
  const [x, y] = root, R = a.R, col = pal.wing || dark(pal.cloth || G.black, 0.2);
  for (const side of [-1, 1]) {
    const far = side < 0, k = sc * (far ? 0.78 : 1), c = far ? dark(col, 0.22) : col;
    const elb = [x + 70 * k * (far ? -0.4 : 1), y - 96 * k], wr = [x + 150 * k * (far ? -0.5 : 1), y - 150 * k], tip = [x + 220 * k * (far ? -0.55 : 1), y - 118 * k];
    if (kind === 'insect') {
      for (const o of [0, 1]) a.shape({ d: smooth([[x, y + o * 24], [wr[0], wr[1] + o * 120], [tip[0], tip[1] + 60 + o * 140], [x + (tip[0] - x) * 0.3, y + 60 + o * 40]], true, 0.6), fill: pal.wing || '#c8c0a0', depth: 8, mottle: 0.4, ink: 1, hatch: 30,
        lines: Array.from({ length: 7 }, (_, i) => `M${x} ${y + o * 24} Q${f((x + tip[0]) / 2)} ${f(y - 60 + o * 80 + i * 10)} ${f(tip[0] - (tip[0] - x) * i * 0.06)} ${f(tip[1] + 60 + o * 140 - i * 16)}`), decals: D.eyes((x + tip[0]) / 2, (y + tip[1]) / 2 + 50 + o * 70, 10, 1, pal.accent || '#c8a040') });
      continue;
    }
    // membrane / feather bed
    const trail = [];
    for (let i = 0; i <= 7; i++) { const t = i / 7, bx = tip[0] + (x - tip[0]) * t, by = tip[1] + (y + 150 * k - tip[1]) * t; trail.push([bx + (R() - 0.5) * 6, by + (kind === 'bat' ? (i % 2 ? -14 : 22) * k : (36 + R() * 20) * k * Math.sin(t * 3.1))]); }
    if (kind === 'bat') {
      a.shape({ d: smooth([[x, y], elb, wr, tip, ...trail], true, 0.3), fill: c, depth: 30, mottle: 0.6, fine: true, hatch: 60, ink: 1.3,
        lines: trail.filter((_, i) => i % 2).map(p => curve3([wr, [(wr[0] + p[0]) / 2 + 6, (wr[1] + p[1]) / 2], p])), decals: D.skin(els[0], (x + tip[0]) / 2, y - 30 * k, 50) + a.stain((x + wr[0]) / 2, y, 20, G.black, 0.5) + (kind === 'tattered' ? '' : '') });
    } else {
      // feathered wing: solid planform with scalloped primaries/secondaries, shafts, and a covert row
      const fe = [], N = 11;
      for (let i = 0; i <= N; i++) {
        const t = i / N, ang = (far ? 1 : -1) * (0.15 + t * 1.25) + Math.PI / 2 * (far ? 1 : 1);
        const base = [tip[0] + (x - tip[0]) * t * 0.95, tip[1] + (y - tip[1]) * t * 0.95 - Math.sin(t * Math.PI) * 30 * k];
        const L2 = (60 + 120 * (1 - t) * (1 - t) + 60 * t) * k * (kind === 'tattered' && R() < 0.3 ? 0.55 : 1);
        fe.push({ base, end: [base[0] + Math.cos(ang) * L2 * (far ? -0.35 : 0.35) , base[1] + L2] });
      }
      const outline = [[x, y], elb, wr, tip];
      fe.forEach((q, i) => { outline.push(q.end); if (i < fe.length - 1) { const n2 = fe[i + 1].end; outline.push([(q.end[0] + n2[0]) / 2, (q.end[1] + n2[1]) / 2 - 16 * k]); } });
      outline.push([x + (far ? -10 : 10), y + 60 * k]);
      a.shape({ d: smooth(outline, true, 0.35), fill: c, depth: 26, mottle: 0.5, fine: true, hatch: far ? 40 : 70, ink: 1.3,
        lines: fe.map(q => ({ d: curve3([q.base, [(q.base[0] + q.end[0]) / 2 + 3, (q.base[1] + q.end[1]) / 2], [q.end[0], q.end[1] - 14 * k]]), w: 0.9, col: light(c, 0.25) })).concat(fe.map(q => ({ d: curve3([[q.base[0] + 6, q.base[1] + 8], [q.end[0] + 6, q.end[1] - 10]]), w: 0.7 }))),
        decals: D.skin(els[0], (x + wr[0]) / 2, (y + wr[1]) / 2 + 60, 40) + (kind === 'tattered' ? a.stain((x + tip[0]) / 2, (y + tip[1]) / 2 + 70, 30, G.black, 0.6) : '') });
      // coverts: a shorter scalloped row along the leading edge
      const cov = [[x, y + 10], elb, wr];
      for (let i = 0; i <= 7; i++) { const t = i / 7, p = [wr[0] + (x - wr[0]) * t, wr[1] + (y - wr[1]) * t + 46 * k + (i % 2 ? 0 : 10 * k)]; cov.push(p); }
      a.shape({ d: smooth(cov, true, 0.4), fill: light(c, 0.08), depth: 12, mottle: 0.5, hatch: 70, ink: 1.1, lines: Array.from({ length: 7 }, (_, i) => { const t = (i + 0.5) / 7; return `M${f(wr[0] + (x - wr[0]) * t)} ${f(wr[1] + (y - wr[1]) * t + 6)} l${f(far ? -4 : 4)} ${f(40 * k)}`; }) });
      a.raw(D.skin(els[0], (x + wr[0]) / 2, (y + wr[1]) / 2 + 30, 40));
    }
    a.limb([[x, y], elb, wr, tip], [26 * k, 18 * k, 11 * k, 4 * k], { fill: dark(c, 0.15), depth: 5, hatch: 60, mottle: 0.5 });
    if (kind === 'bat') a.raw(`<path d="M${f(elb[0])} ${f(elb[1])} l-4 -14 l8 4 Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.8"/>`);
  }
}
const curve3 = pts => smooth(pts, false, 1);

module.exports = { dressing, held, humanoid, wings, mix, dark, light, CANVAS, EGLOW, f };
