// The eight abbey shop panels: each is its keeper's object seen close, in one shared frame language
// (dark oak and iron trim, a rubric title plate, the ostia dish, an iron ring to close). The game lays text,
// items and buttons over the areas listed in layout.json. Plus the small UI sprites the panels use.
// Usage: node grim/panels.js  -> grim/panels/*.svg + grim/panels/layout.json
const { Art, G, INK, smooth, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const OUT = 'grim/panels';
fs.mkdirSync(OUT, { recursive: true });
const W = 1600, H = 1000;
const LAYOUT = {};

// ================================================================== shared kit
function kit(seed) {
  const a = new Art(W, H, seed).useGrain(), R = a.R, K = {};
  const rr = (lo, hi) => lo + R() * (hi - lo);
  K.a = a; K.R = R; K.rr = rr;
  K.defs = () => {
    a.raw(`<defs>
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>
      <radialGradient id="pageV" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#fff6df" stop-opacity="0.18"/><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3a2210" stop-opacity="0.38"/></radialGradient>
      <linearGradient id="gutL" x1="0" y1="0" x2="1" y2="0"><stop offset="0.75" stop-color="#2a1608" stop-opacity="0"/><stop offset="1" stop-color="#2a1608" stop-opacity="0.55"/></linearGradient>
      <linearGradient id="gutR" x1="1" y1="0" x2="0" y2="0"><stop offset="0.75" stop-color="#2a1608" stop-opacity="0"/><stop offset="1" stop-color="#2a1608" stop-opacity="0.5"/></linearGradient>
      <linearGradient id="ironG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5650"/><stop offset="0.45" stop-color="#2e2c2a"/><stop offset="1" stop-color="#141210"/></linearGradient>
      <linearGradient id="brassG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8b860"/><stop offset="0.5" stop-color="#8a6a28"/><stop offset="1" stop-color="#4a3410"/></linearGradient>
      <linearGradient id="oakV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a3220"/><stop offset="0.4" stop-color="#3a2616"/><stop offset="1" stop-color="#1e140c"/></linearGradient>
      <linearGradient id="oakG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a3e26"/><stop offset="1" stop-color="#22160c"/></linearGradient>
      <linearGradient id="linenG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8d0bc"/><stop offset="1" stop-color="#9a907a"/></linearGradient>
      <linearGradient id="velvetG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1018"/><stop offset="1" stop-color="#14060a"/></linearGradient>
      <radialGradient id="glowW" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffc870" stop-opacity="0.35"/><stop offset="1" stop-color="#ffc870" stop-opacity="0"/></radialGradient>
    </defs>`);
  };
  // a soft round stain or light: a radial gradient, never a hard-edged blob
  let sid = 0;
  K.soft = (x, y, r, col, op) => { const id = 'sf' + seed + '_' + (sid++); return `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${id})"/>`; };
  // fine grain over a rect: hundreds of tiny dark and light flecks, the texture of a surface rather than a blotch
  K.grain = (x, y, w, h, n, dk = '#000', lt = '#fff', op = 0.18) => { let o = ''; for (let k = 0; k < n; k++) o += `<rect x="${f(x + R() * w)}" y="${f(y + R() * h)}" width="${f(rr(0.8, 2.4))}" height="${f(rr(0.6, 1.4))}" fill="${R() < 0.6 ? dk : lt}" opacity="${f(rr(0.3, 1) * op)}"/>`; return o; };
  // the dimmed room behind: a dark veil the interior shows through
  K.veil = () => a.raw(`<rect width="${W}" height="${H}" fill="#0a0705" opacity="0.62"/><rect width="${W}" height="${H}" fill="url(#vig)"/>`);
  // oak boards with grain, knots and nails, laid horizontally inside a rect
  K.oak = (x, y, w, h, col = '#4a3220', bw = 70) => {
    let o = `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${col}"/>`;
    for (let by = y; by < y + h; by += bw) {
      const bh = Math.min(bw, y + h - by), tone = mix(col, R() < 0.5 ? '#8a6a48' : '#140c06', R() * 0.35);
      const gid = 'pk' + seed + '_' + (sid++);
      o += `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light(tone, 0.12)}"/><stop offset="0.5" stop-color="${tone}"/><stop offset="1" stop-color="${dark(tone, 0.35)}"/></linearGradient><rect x="${f(x)}" y="${f(by)}" width="${f(w)}" height="${f(bh)}" fill="url(#${gid})" stroke="${INK}" stroke-width="1.6"/>`;
      for (let g = 0; g < 6; g++) { const gy = by + 6 + R() * (bh - 12); let d = `M${f(x)} ${f(gy)}`; for (let gx = x; gx <= x + w; gx += 60) d += ` Q${f(gx + 30)} ${f(gy + (R() - 0.5) * 6)} ${f(gx + 60)} ${f(gy + (R() - 0.5) * 3)}`; o += `<path d="${d}" stroke="${dark(tone, 0.45)}" stroke-width="${f(0.6 + R() * 0.8)}" fill="none" opacity="0.7"/>`; }
      if (R() < 0.6) { const kx = x + R() * w, ky = by + bh / 2; o += `<ellipse cx="${f(kx)}" cy="${f(ky)}" rx="${f(rr(5, 12))}" ry="${f(rr(3, 6))}" fill="${dark(tone, 0.5)}" stroke="${INK}" stroke-width="0.8"/><ellipse cx="${f(kx)}" cy="${f(ky)}" rx="${f(rr(10, 18))}" ry="${f(rr(5, 8))}" fill="none" stroke="${dark(tone, 0.4)}" stroke-width="0.7"/>`; }
      o += `<path d="M${f(x)} ${f(by + 1.5)} L${f(x + w)} ${f(by + 1.5)}" stroke="#c8a878" stroke-width="1" opacity="0.18"/>`;
    }
    return o;
  };
  // the shared trim: an oak frame bound with iron at the corners, rivets, worn edges
  K.frame = (x, y, w, h, t = 26) => {
    let o = K.oak(x - t, y - t, w + 2 * t, t, '#3a2616', 26) + K.oak(x - t, y + h, w + 2 * t, t, '#3a2616', 26);
    o += `<rect x="${f(x - t)}" y="${f(y)}" width="${f(t)}" height="${f(h)}" fill="url(#oakV)" stroke="${INK}" stroke-width="1.6"/><rect x="${f(x + w)}" y="${f(y)}" width="${f(t)}" height="${f(h)}" fill="url(#oakV)" stroke="${INK}" stroke-width="1.6"/>`;
    for (const sx of [x - t, x + w]) for (let k = 0; k < 5; k++) { const gx = sx + 4 + R() * (t - 8); o += `<path d="M${f(gx)} ${f(y)} q${f((R() - 0.5) * 4)} ${f(h / 2)} 0 ${f(h)}" stroke="#140c06" stroke-width="0.8" fill="none" opacity="0.6"/>`; }
    o += `<rect x="${f(x - t)}" y="${f(y - t)}" width="${f(w + 2 * t)}" height="${f(h + 2 * t)}" fill="none" stroke="${INK}" stroke-width="3"/><rect x="${f(x - 2)}" y="${f(y - 2)}" width="${f(w + 4)}" height="${f(h + 4)}" fill="none" stroke="${INK}" stroke-width="2.4"/>`;
    // iron corner brackets
    for (const [cx, cy, sx, sy] of [[x - t, y - t, 1, 1], [x + w + t, y - t, -1, 1], [x - t, y + h + t, 1, -1], [x + w + t, y + h + t, -1, -1]]) {
      const L = t * 3.2, B = t * 1.25;
      const d = `M${f(cx)} ${f(cy)} L${f(cx + sx * L)} ${f(cy)} L${f(cx + sx * L)} ${f(cy + sy * B * 0.6)} Q${f(cx + sx * (L - 10))} ${f(cy + sy * B)} ${f(cx + sx * B)} ${f(cy + sy * B)} L${f(cx + sx * B)} ${f(cy + sy * (L - 10))} Q${f(cx + sx * B)} ${f(cy + sy * L)} ${f(cx + sx * B * 0.6)} ${f(cy + sy * L)} L${f(cx)} ${f(cy + sy * L)} Z`;
      o += `<path d="${d}" fill="url(#ironG)" stroke="${INK}" stroke-width="2"/>`;
      o += `<path d="M${f(cx + sx * 4)} ${f(cy + sy * 4)} L${f(cx + sx * (L - 6))} ${f(cy + sy * 4)}" stroke="#8a8680" stroke-width="1.2" opacity="0.6"/>`;
      for (const [px, py] of [[L * 0.75, B * 0.35], [B * 0.35, L * 0.75], [B * 0.45, B * 0.45]]) o += a.rivet(cx + sx * px, cy + sy * py, 3.2);
      o += K.soft(cx + sx * L * 0.5, cy + sy * B * 0.5, 10, '#6a3418', 0.45);
    }
    // a band of iron across the top and bottom middle
    for (const by of [y - t, y + h]) for (const bx of [x + w * 0.33, x + w * 0.67]) { o += `<rect x="${f(bx - 14)}" y="${f(by - 2)}" width="28" height="${f(t + 4)}" fill="url(#ironG)" stroke="${INK}" stroke-width="1.6"/>` + a.rivet(bx, by + t / 2, 3); }
    return o;
  };
  // a vellum page: warm base, darker edges, foxing, a faint ruled grid if asked
  K.vellum = (pts, base = '#e2d2ae', o2 = {}) => {
    const d = typeof pts === 'string' ? pts : poly(pts);
    let o = `<path d="${d}" fill="${base}"/><path d="${d}" fill="url(#pageV)"/>`;
    if (o2.bbox) { const [x, y, w, h] = o2.bbox;
      for (let k = 0; k < (o2.fox || 14); k++) o += `<circle cx="${f(x + R() * w)}" cy="${f(y + R() * h)}" r="${f(rr(0.8, 3))}" fill="#8a5a2a" opacity="${f(rr(0.08, 0.25))}"/>`;
      for (let k = 0; k < 3; k++) o += K.soft(x + R() * w, y + R() * h, rr(40, 110), '#8a6a3a', 0.12);
      o += K.grain(x, y, w, h, Math.floor(w * h / 900), '#6a4a2a', '#fff8e8', 0.12);
      if (o2.rule) for (let ly = y + o2.rule[0]; ly < y + h - 20; ly += o2.rule[1]) o += `<path d="M${f(x + 24)} ${f(ly)} L${f(x + w - 24)} ${f(ly)}" stroke="#8a6a4a" stroke-width="0.7" opacity="0.35"/>`;
      if (o2.margin) o += `<path d="M${f(x + o2.margin)} ${f(y + 18)} L${f(x + o2.margin)} ${f(y + h - 18)} M${f(x + o2.margin + 5)} ${f(y + 18)} L${f(x + o2.margin + 5)} ${f(y + h - 18)}" stroke="#9a3a2a" stroke-width="1" opacity="0.55"/>`;
    }
    o += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2"/>`;
    return o;
  };
  // an open book: leather boards, page block edges, two pages and the gutter
  K.book = (x, y, w, h, leather = '#4a1a12', o2 = {}) => {
    const gx = x + w / 2;
    let o = `<path d="M${f(x - 22)} ${f(y - 14)} L${f(x + w + 22)} ${f(y - 14)} L${f(x + w + 26)} ${f(y + h + 26)} L${f(x - 26)} ${f(y + h + 26)} Z" fill="${leather}" stroke="${INK}" stroke-width="3"/>`;
    for (let k = 0; k < 40; k++) o += `<path d="M${f(x - 20 + R() * (w + 40))} ${f(y - 10 + R() * (h + 30))} l${f(rr(-20, 20))} ${f(rr(-6, 6))}" stroke="${dark(leather, 0.5)}" stroke-width="1" opacity="0.5"/>`;
    o += `<path d="M${f(x - 22)} ${f(y - 14)} L${f(x + w + 22)} ${f(y - 14)} L${f(x + w + 26)} ${f(y + h + 26)} L${f(x - 26)} ${f(y + h + 26)} Z" fill="url(#vig)" opacity="0.8"/>`;
    for (const [cx, cy] of [[x - 22, y - 14], [x + w + 22, y - 14], [x - 26, y + h + 26], [x + w + 26, y + h + 26]]) o += `<path d="M${f(cx - 26)} ${f(cy)} L${f(cx)} ${f(cy - 26)} L${f(cx + 26)} ${f(cy)} L${f(cx)} ${f(cy + 26)} Z" fill="url(#brassG)" stroke="${INK}" stroke-width="1.6" transform="scale(1)"/>` + a.rivet(cx, cy, 3.4);
    // page block edges stacked under each page
    for (let k = 4; k >= 1; k--) {
      o += `<path d="M${f(x - k * 2)} ${f(y + k * 3)} Q${f(x + w * 0.25)} ${f(y - 8 + k * 3)} ${f(gx)} ${f(y + 10 + k * 3)} L${f(gx)} ${f(y + h + 8 + k * 2)} Q${f(x + w * 0.25)} ${f(y + h + k * 3)} ${f(x - k * 2)} ${f(y + h + k * 4)} Z" fill="${mix('#c8b890', '#6a5a40', k / 6)}" stroke="${INK}" stroke-width="0.8"/>`;
      o += `<path d="M${f(x + w + k * 2)} ${f(y + k * 3)} Q${f(x + w * 0.75)} ${f(y - 8 + k * 3)} ${f(gx)} ${f(y + 10 + k * 3)} L${f(gx)} ${f(y + h + 8 + k * 2)} Q${f(x + w * 0.75)} ${f(y + h + k * 3)} ${f(x + w + k * 2)} ${f(y + h + k * 4)} Z" fill="${mix('#c8b890', '#6a5a40', k / 6)}" stroke="${INK}" stroke-width="0.8"/>`;
    }
    const L = `M${f(x)} ${f(y)} Q${f(x + w * 0.25)} ${f(y - 12)} ${f(gx)} ${f(y + 8)} L${f(gx)} ${f(y + h + 6)} Q${f(x + w * 0.25)} ${f(y + h - 6)} ${f(x)} ${f(y + h)} Z`;
    const Rp = `M${f(x + w)} ${f(y)} Q${f(x + w * 0.75)} ${f(y - 12)} ${f(gx)} ${f(y + 8)} L${f(gx)} ${f(y + h + 6)} Q${f(x + w * 0.75)} ${f(y + h - 6)} ${f(x + w)} ${f(y + h)} Z`;
    o += K.vellum(L, o2.page || '#e0cfa8', { bbox: [x, y, w / 2, h], rule: o2.rule, margin: o2.margin, fox: 20 }) + K.vellum(Rp, o2.page || '#e2d2ae', { bbox: [gx, y, w / 2, h], rule: o2.rule, margin: o2.margin, fox: 20 });
    o += `<path d="${L}" fill="url(#gutL)"/><path d="${Rp}" fill="url(#gutR)"/><path d="M${f(gx)} ${f(y + 8)} L${f(gx)} ${f(y + h + 6)}" stroke="${INK}" stroke-width="2.4"/>`;
    // ribbons hanging from the gutter
    for (const [dx, col] of o2.ribbons || []) o += `<path d="M${f(gx + dx)} ${f(y + h - 40)} L${f(gx + dx + 4)} ${f(y + h + 70)} L${f(gx + dx + 13)} ${f(y + h + 58)} L${f(gx + dx + 22)} ${f(y + h + 72)} L${f(gx + dx + 18)} ${f(y + h - 40)} Z" fill="${col}" stroke="${INK}" stroke-width="1.4"/>`;
    return o;
  };
  // a border of rubric and gold vine round a page area, with a gilt initial square at the top left
  K.illum = (x, y, w, h, col = '#8a1a14') => {
    let o = `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="${col}" stroke-width="2" opacity="0.75"/><rect x="${f(x + 6)}" y="${f(y + 6)}" width="${f(w - 12)}" height="${f(h - 12)}" fill="none" stroke="${G.gold}" stroke-width="1.2" opacity="0.7"/>`;
    for (let t = 0; t < 1; t += 0.06) { const vx = x + 3, vy = y + 20 + t * (h - 40); o += `<path d="M${f(vx)} ${f(vy)} q${f(10)} ${f(6)} ${f(4)} ${f(14)}" stroke="${G.gold}" stroke-width="1" fill="none" opacity="0.7"/><circle cx="${f(vx + 6)}" cy="${f(vy + 6)}" r="1.8" fill="${col}" opacity="0.8"/>`; }
    return o;
  };
  // the ostia dish: a pewter dish of lead pilgrim badges, top right of every panel
  K.dish = (cx, cy) => {
    let o = `<ellipse cx="${f(cx)}" cy="${f(cy + 6)}" rx="86" ry="30" fill="#0a0806" opacity="0.6"/><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="82" ry="28" fill="url(#ironG)" stroke="${INK}" stroke-width="2"/><ellipse cx="${f(cx)}" cy="${f(cy - 3)}" rx="64" ry="19" fill="#3a3834" stroke="${INK}" stroke-width="1.2"/>`;
    for (let k = 0; k < 14; k++) { const bx = cx - 50 + R() * 100, by = cy - 12 + R() * 14, r = rr(6, 9); o += `<g transform="rotate(${f(rr(-40, 40))} ${f(bx)} ${f(by)})"><path d="M${f(bx - r)} ${f(by)} L${f(bx)} ${f(by - r * 1.2)} L${f(bx + r)} ${f(by)} L${f(bx)} ${f(by + r * 0.9)} Z" fill="${mix('#8a8a86', '#4a4844', R())}" stroke="${INK}" stroke-width="0.9"/><path d="M${f(bx)} ${f(by - r * 0.7)} l0 ${f(r * 1.2)} M${f(bx - r * 0.4)} ${f(by - r * 0.2)} l${f(r * 0.8)} 0" stroke="#2a2826" stroke-width="0.9"/></g>`; }
    return o;
  };
  // the iron ring knocker that closes a panel
  K.ring = (cx, cy) => `<circle cx="${f(cx)}" cy="${f(cy - 18)}" r="9" fill="url(#ironG)" stroke="${INK}" stroke-width="1.6"/>` + a.rivet(cx, cy - 18, 3) +
    `<circle cx="${f(cx)}" cy="${f(cy + 6)}" r="24" fill="none" stroke="${INK}" stroke-width="10"/><circle cx="${f(cx)}" cy="${f(cy + 6)}" r="24" fill="none" stroke="url(#ironG)" stroke-width="7"/><path d="M${f(cx - 16)} ${f(cy - 10)} A24 24 0 0 1 ${f(cx + 8)} ${f(cy - 17)}" stroke="#a8a49a" stroke-width="1.6" fill="none" opacity="0.6"/>`;
  // the title plate: a black iron plate with a brass rim, where the game writes the keeper and the object
  K.plate = (cx, cy, w = 520) => {
    const h = 64;
    let o = `<path d="M${f(cx - w / 2)} ${f(cy - h / 2)} L${f(cx + w / 2)} ${f(cy - h / 2)} L${f(cx + w / 2 + 26)} ${f(cy)} L${f(cx + w / 2)} ${f(cy + h / 2)} L${f(cx - w / 2)} ${f(cy + h / 2)} L${f(cx - w / 2 - 26)} ${f(cy)} Z" fill="url(#brassG)" stroke="${INK}" stroke-width="2.4"/>`;
    o += `<path d="M${f(cx - w / 2 + 8)} ${f(cy - h / 2 + 7)} L${f(cx + w / 2 - 8)} ${f(cy - h / 2 + 7)} L${f(cx + w / 2 + 12)} ${f(cy)} L${f(cx + w / 2 - 8)} ${f(cy + h / 2 - 7)} L${f(cx - w / 2 + 8)} ${f(cy + h / 2 - 7)} L${f(cx - w / 2 - 12)} ${f(cy)} Z" fill="#1a1412" stroke="${INK}" stroke-width="1.4"/>`;
    for (const sx of [-1, 1]) o += a.rivet(cx + sx * (w / 2 + 6), cy, 3.6);
    o += `<path d="M${f(cx - w / 2 + 14)} ${f(cy - h / 2 + 10)} L${f(cx + w / 2 - 14)} ${f(cy - h / 2 + 10)}" stroke="#fff4d0" stroke-width="1.4" opacity="0.35"/>`;
    return o;
  };
  // a candle with a real flame and a pool of light (drawn in the art, lit for warmth)
  K.candle = (x, y, h = 70) => `<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(h * 1.4)}" ry="${f(h * 1.2)}" fill="url(#glowW)"/><rect x="${f(x - 9)}" y="${f(y - h)}" width="18" height="${f(h)}" fill="#d8ccb0" stroke="${INK}" stroke-width="1.6"/><path d="M${f(x + 9)} ${f(y - h + 6)} q4 ${f(h * 0.3)} 0 ${f(h * 0.5)}" stroke="#e8dcc0" stroke-width="3" fill="none"/><path d="M${f(x)} ${f(y - h)} l0 -6" stroke="${INK}" stroke-width="1.6"/><path d="M${f(x)} ${f(y - h - 28)} Q${f(x + 8)} ${f(y - h - 12)} ${f(x)} ${f(y - h - 4)} Q${f(x - 8)} ${f(y - h - 12)} ${f(x)} ${f(y - h - 28)} Z" fill="#ffd27a"/><path d="M${f(x)} ${f(y - h - 18)} Q${f(x + 3)} ${f(y - h - 10)} ${f(x)} ${f(y - h - 6)} Q${f(x - 3)} ${f(y - h - 10)} ${f(x)} ${f(y - h - 18)} Z" fill="#fff4d0"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="22" ry="6" fill="url(#ironG)" stroke="${INK}" stroke-width="1.2"/>`;
  K.quill = (x, y, ang = -30) => `<g transform="rotate(${ang} ${f(x)} ${f(y)})"><path d="M${f(x)} ${f(y)} Q${f(x + 60)} ${f(y - 14)} ${f(x + 150)} ${f(y - 4)} Q${f(x + 70)} ${f(y + 8)} ${f(x)} ${f(y)} Z" fill="#d8d0c0" stroke="${INK}" stroke-width="1.4"/>${Array.from({ length: 14 }, (_, k) => `<path d="M${f(x + 20 + k * 9)} ${f(y - 1)} l${f(6)} ${f(-8 + k * 0.3)}" stroke="#8a8478" stroke-width="0.8"/>`).join('')}<path d="M${f(x - 30)} ${f(y + 2)} L${f(x + 10)} ${f(y)}" stroke="${INK}" stroke-width="3"/></g>`;
  K.inkpot = (x, y) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="30" ry="10" fill="#0a0806" opacity="0.5"/><path d="M${f(x - 24)} ${f(y)} Q${f(x - 28)} ${f(y - 30)} ${f(x - 12)} ${f(y - 38)} L${f(x + 12)} ${f(y - 38)} Q${f(x + 28)} ${f(y - 30)} ${f(x + 24)} ${f(y)} Z" fill="#1a1614" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${f(x)}" cy="${f(y - 38)}" rx="12" ry="4" fill="#0a0806" stroke="${INK}" stroke-width="1"/><path d="M${f(x - 16)} ${f(y - 30)} Q${f(x - 18)} ${f(y - 14)} ${f(x - 12)} ${f(y - 6)}" stroke="#6a6460" stroke-width="2" fill="none" opacity="0.6"/>`;
  K.write = (name, extra) => { fs.writeFileSync(`${OUT}/${name}.svg`, a.svg(false)); LAYOUT[name] = extra; };
  return K;
}

// the panel body every shop shares: veil, the object's area framed in oak and iron, the title plate, dish and ring
function shell(K, bg) {
  const { a } = K, X = 80, Y = 96, PW = 1440, PH = 856;
  K.defs(); K.veil();
  a.raw(`<rect x="${X - 40}" y="${Y - 30}" width="${PW + 80}" height="${PH + 70}" fill="#000" opacity="0.5" rx="8"/>`);
  a.raw(`<clipPath id="bodyclip"><rect x="${X}" y="${Y}" width="${PW}" height="${PH}"/></clipPath><g clip-path="url(#bodyclip)">`);
  bg(X, Y, PW, PH);
  a.raw(`</g>`);
  a.raw(K.frame(X, Y, PW, PH));
  a.raw(K.plate(800, 66));
  a.raw(K.dish(1404, 70));
  a.raw(K.ring(1532, 50));
  return { title: [800, 66], dish: [1404, 70], close: [1532, 56, 34], body: [X, Y, PW, PH], line: [X + 60, Y + PH - 46, PW - 120, 36] };
}

// ================================================================== the eight objects
// Guesthouse: the guest book open on a table, a candle and the Hosteller's quill
{
  const K = kit(11), { a } = K;
  const L = shell(K, (x, y, w, h) => {
    a.raw(K.oak(x, y, w, h, '#3a2618', 90));
    a.raw(K.book(x + 130, y + 64, w - 260, h - 160, '#3a2416', { rule: [86, 44], ribbons: [[-60, '#7a1a14'], [30, '#2a3a5a']] }));
    a.raw(K.illum(x + 170, y + 88, (w - 260) / 2 - 70, h - 210));
    a.raw(K.candle(x + 34, y + h - 30, 90) + K.inkpot(x + w - 50, y + h - 24) + K.quill(x + w - 70, y + h - 70, -150));
  });
  K.write('guesthouse', Object.assign(L, { left: [250, 180, 520, 620], right: [830, 180, 520, 620] }));
}
// Almonry: Fenn's ledger with red-ruled columns, a balance scale and a stack of badges
{
  const K = kit(12), { a, R } = K;
  const L = shell(K, (x, y, w, h) => {
    a.raw(K.oak(x, y, w, h, '#2e2016', 70));
    a.raw(K.book(x + 130, y + 64, w - 260, h - 160, '#2a1e14', { page: '#ddcfa6', rule: [100, 50], margin: 60, ribbons: [[-40, '#5a1a10']] }));
    // price columns ruled in red on both pages
    for (const px of [x + 130 + (w - 260) / 2 - 130, x + w - 260]) a.raw(`<path d="M${px} ${y + 80} L${px} ${y + h - 90} M${px + 5} ${y + 80} L${px + 5} ${y + h - 90}" stroke="#9a3a2a" stroke-width="1" opacity="0.6"/>`);
    // a balance scale and a stack of coin at the left edge
    const sx = x + 96, sy = y + h - 30;
    a.raw(`<path d="M${sx} ${sy} L${sx} ${sy - 150}" stroke="${INK}" stroke-width="6"/><path d="M${sx} ${sy} L${sx} ${sy - 150}" stroke="#8a6a28" stroke-width="3.6"/><path d="M${sx - 50} ${sy - 140} L${sx + 50} ${sy - 150}" stroke="${INK}" stroke-width="5"/><path d="M${sx - 50} ${sy - 140} L${sx + 50} ${sy - 150}" stroke="#a8842a" stroke-width="3"/>`);
    for (const [dx, dy] of [[-50, -140], [50, -150]]) a.raw(`<path d="M${sx + dx} ${sy + dy} L${sx + dx - 18} ${sy + dy + 46} M${sx + dx} ${sy + dy} L${sx + dx + 18} ${sy + dy + 46}" stroke="#5a5650" stroke-width="1.2"/><path d="M${sx + dx - 24} ${sy + dy + 46} Q${sx + dx} ${sy + dy + 62} ${sx + dx + 24} ${sy + dy + 46} Z" fill="url(#brassG)" stroke="${INK}" stroke-width="1.4"/>`);
    for (let k = 0; k < 7; k++) a.raw(`<ellipse cx="${f(x + w - 40 + (R() - 0.5) * 3)}" cy="${f(y + h - 26 - k * 5)}" rx="20" ry="6" fill="${mix('#8a8a86', '#5a5854', R())}" stroke="${INK}" stroke-width="1"/>`);
  });
  K.write('almonry', Object.assign(L, { left: [250, 180, 520, 620], right: [830, 180, 520, 620] }));
}
// Smithy: Hild's forge wall lit from below, a leather tool-roll for the company, the anvil on its stump at the centre,
// a slate rune tablet above it, a timber rack of the armoury on the right
{
  const K = kit(13), { a, R, rr } = K;
  const L = shell(K, (x, y, w, h) => {
    // stone wall: courses of dark blocks, each lit warm from the forge below
    a.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1a1612"/>`);
    let row = 0;
    for (let by = y; by < y + h; by += 64, row++) {
      let bx = x - (row % 2) * 60;
      while (bx < x + w) {
        const bw = rr(110, 190), t = (by - y) / h, tone = mix('#2a2622', '#4a3a2e', t * 0.8 + R() * 0.2), gid = 'st' + row + '_' + Math.floor(bx);
        a.raw(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark(tone, 0.35)}"/><stop offset="1" stop-color="${light(tone, 0.08)}"/></linearGradient><rect x="${f(Math.max(x, bx + 3))}" y="${f(by + 3)}" width="${f(Math.min(bw - 6, x + w - Math.max(x, bx + 3)))}" height="58" rx="5" fill="url(#${gid})" stroke="#0a0806" stroke-width="2"/>`);
        if (bx + 3 >= x) a.raw(`<path d="M${f(bx + 8)} ${f(by + 58)} L${f(bx + bw - 10)} ${f(by + 58)}" stroke="#c87a3a" stroke-width="1.4" opacity="${f(0.1 + t * 0.35)}"/>`);
        bx += bw;
      }
    }
    a.raw(K.grain(x, y, w, h, 5000, '#000', '#d8b890', 0.22));
    // soot climbing the wall over the anvil, the forge's glow from below
    a.raw(K.soft(x + w / 2, y + 40, 420, '#000', 0.55) + K.soft(x + w / 2, y + h + 60, 640, '#ff7a2a', 0.32) + K.soft(x + w / 2, y + h - 80, 300, '#ffb060', 0.18));
    // left: a leather tool-roll hung from two iron hooks, one pocket row per hero
    const lx = x + 40, ly = y + 40, lw = 380, lh = h - 80;
    const roll = `M${lx} ${ly + 20} Q${lx + lw / 2} ${ly} ${lx + lw} ${ly + 20} L${lx + lw + 6} ${ly + lh - 30} Q${lx + lw / 2} ${ly + lh + 10} ${lx - 6} ${ly + lh - 30} Z`;
    a.raw(`<linearGradient id="lthr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2212"/><stop offset="0.45" stop-color="#6a4226"/><stop offset="1" stop-color="#2a180c"/></linearGradient>`);
    a.raw(`<path d="${roll}" fill="#000" opacity="0.5" transform="translate(10 12)"/><path d="${roll}" fill="url(#lthr)" stroke="${INK}" stroke-width="3"/>`);
    a.raw(K.grain(lx, ly, lw, lh, 1800, '#1a0c04', '#c89a6a', 0.25));
    a.raw(`<path d="M${lx + 14} ${ly + 30} Q${lx + lw / 2} ${ly + 12} ${lx + lw - 14} ${ly + 30} L${lx + lw - 10} ${ly + lh - 40} Q${lx + lw / 2} ${ly + lh - 4} ${lx + 10} ${ly + lh - 40} Z" fill="none" stroke="#c8a070" stroke-width="2" stroke-dasharray="7 5" opacity="0.55"/>`);
    for (const hx of [lx + 60, lx + lw - 60]) a.raw(`<path d="M${hx} ${ly - 26} L${hx} ${ly + 6} q0 16 -14 14" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${hx} ${ly - 26} L${hx} ${ly + 6} q0 16 -14 14" stroke="#4a4642" stroke-width="5" fill="none" stroke-linecap="round"/>` + a.rivet(hx, ly - 30, 4.4));
    for (let k = 1; k < 4; k++) { const py = ly + k * lh / 4; a.raw(`<path d="M${lx + 6} ${py} Q${lx + lw / 2} ${py + 10} ${lx + lw - 6} ${py}" stroke="#1a0c04" stroke-width="3" fill="none" opacity="0.7"/><path d="M${lx + 6} ${py + 3} Q${lx + lw / 2} ${py + 13} ${lx + lw - 6} ${py + 3}" stroke="#a87a4a" stroke-width="1.2" fill="none" opacity="0.4"/>`); }
    a.raw(K.soft(lx + lw * 0.3, ly + lh * 0.3, 160, '#fff0d0', 0.08));
    // centre: the anvil on its stump, three-quarter view, horn to the right
    const ax = x + w / 2 + 10, ay = y + h - 210;
    a.raw(K.soft(ax, ay + 190, 300, '#000', 0.7));
    const stump = `M${ax - 150} ${ay + 70} L${ax - 160} ${ay + 200} Q${ax} ${ay + 230} ${ax + 160} ${ay + 200} L${ax + 150} ${ay + 70} Z`;
    a.raw(`<linearGradient id="stumpG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1a0e"/><stop offset="0.4" stop-color="#5a3a22"/><stop offset="1" stop-color="#1a0e06"/></linearGradient><path d="${stump}" fill="url(#stumpG)" stroke="${INK}" stroke-width="3"/>`);
    for (let k = 0; k < 14; k++) { const sx = ax - 140 + k * 21; a.raw(`<path d="M${f(sx)} ${ay + 80} q${f(rr(-6, 6))} 60 ${f(rr(-4, 4))} ${f(rr(100, 130))}" stroke="#140a04" stroke-width="${f(rr(1, 2.4))}" fill="none" opacity="0.7"/>`); }
    a.raw(`<ellipse cx="${ax}" cy="${ay + 70}" rx="150" ry="28" fill="#7a5a3a" stroke="${INK}" stroke-width="2.4"/>` + [0.3, 0.55, 0.8].map(t => `<ellipse cx="${ax}" cy="${ay + 70}" rx="${f(150 * t)}" ry="${f(28 * t)}" fill="none" stroke="#4a3018" stroke-width="1.2"/>`).join(''));
    a.raw(`<linearGradient id="anvT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8680"/><stop offset="0.25" stop-color="#4a4642"/><stop offset="1" stop-color="#141210"/></linearGradient><linearGradient id="anvS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1816"/><stop offset="0.55" stop-color="#3e3a36"/><stop offset="1" stop-color="#0e0c0a"/></linearGradient>`);
    const body = `M${ax - 110} ${ay + 70} L${ax - 80} ${ay - 10} L${ax - 120} ${ay - 46} L${ax + 120} ${ay - 46} L${ax + 80} ${ay - 10} L${ax + 110} ${ay + 70} Z`;
    a.raw(`<path d="${body}" fill="url(#anvS)" stroke="${INK}" stroke-width="3"/>`);
    const face = `M${ax - 230} ${ay - 110} L${ax + 150} ${ay - 110} Q${ax + 230} ${ay - 104} ${ax + 270} ${ay - 72} Q${ax + 220} ${ay - 60} ${ax + 150} ${ay - 46} L${ax - 230} ${ay - 46} Z`;
    a.raw(`<path d="${face}" fill="url(#anvT)" stroke="${INK}" stroke-width="3.4"/><path d="M${ax - 226} ${ay - 104} L${ax + 150} ${ay - 104} Q${ax + 222} ${ay - 98} ${ax + 260} ${ay - 72}" stroke="#d8d4cc" stroke-width="3" fill="none" opacity="0.7"/>`);
    a.raw(`<rect x="${ax - 190}" y="${ay - 106}" width="22" height="16" fill="#0a0908" stroke="${INK}" stroke-width="1.2"/><circle cx="${ax - 140}" cy="${ay - 98}" r="7" fill="#0a0908" stroke="${INK}" stroke-width="1.2"/>`);
    a.raw(K.soft(ax + 220, ay - 82, 50, '#ff9a4a', 0.5) + K.grain(ax - 230, ay - 110, 560, 64, 400, '#000', '#e8e4dc', 0.25));
    // sparks thrown off the heel of the horn, kept low and to the right of the work
    for (let k = 0; k < 26; k++) { const sx = ax + rr(160, 250), sy = ay - 112 - rr(0, 70), l = rr(4, 12); a.raw(`<path d="M${f(sx)} ${f(sy)} l${f(rr(-3, 3))} ${f(-l)}" stroke="${R() < 0.5 ? '#ffd27a' : '#ff8a3a'}" stroke-width="${f(rr(1, 2.4))}" opacity="${f(rr(0.4, 1))}" stroke-linecap="round"/>`); }
    // hammer and tongs leaning on the stump
    a.raw(`<path d="M${ax - 260} ${ay + 190} L${ax - 150} ${ay + 60}" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M${ax - 260} ${ay + 190} L${ax - 150} ${ay + 60}" stroke="#5a3a22" stroke-width="10" stroke-linecap="round"/><rect x="${ax - 182}" y="${ay + 22}" width="66" height="42" rx="5" fill="url(#anvT)" stroke="${INK}" stroke-width="2.4" transform="rotate(-50 ${ax - 149} ${ay + 43})"/>`);
    a.raw(`<path d="M${ax + 250} ${ay + 200} L${ax + 150} ${ay + 40} M${ax + 266} ${ay + 196} L${ax + 168} ${ay + 36}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${ax + 250} ${ay + 200} L${ax + 150} ${ay + 40} M${ax + 266} ${ay + 196} L${ax + 168} ${ay + 36}" stroke="#3e3a36" stroke-width="5" stroke-linecap="round"/>`);
    // top centre: the slate rune tablet with six carved sockets rimmed in brass
    const tx = x + 470, ty = y + 40, tw = w - 940, th = 150;
    a.raw(`<rect x="${tx + 8}" y="${ty + 10}" width="${tw}" height="${th}" rx="10" fill="#000" opacity="0.5"/><rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="10" fill="#2a2e30" stroke="${INK}" stroke-width="3"/>`);
    a.raw(`<linearGradient id="slateG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4044"/><stop offset="1" stop-color="#1e2224"/></linearGradient><rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="10" fill="url(#slateG)"/>`);
    // split layers of the slate, chisel marks, chipped corners, iron straps
    for (let k = 0; k < 7; k++) { const yy = ty + 12 + k * (th - 24) / 6 + rr(-3, 3); a.raw(`<path d="M${tx + 6} ${f(yy)} Q${f(tx + tw * rr(0.3, 0.7))} ${f(yy + rr(-4, 4))} ${tx + tw - 6} ${f(yy + rr(-2, 2))}" stroke="#0e1012" stroke-width="1" opacity="0.35" fill="none"/><path d="M${tx + 6} ${f(yy + 1.4)} Q${f(tx + tw * 0.5)} ${f(yy + 1.4)} ${tx + tw - 6} ${f(yy + 1.4)}" stroke="#8a969a" stroke-width="0.6" opacity="0.2" fill="none"/>`); }
    for (let k = 0; k < 60; k++) { const cx = tx + 10 + R() * (tw - 20), cy = ty + 8 + R() * (th - 16); a.raw(`<path d="M${f(cx)} ${f(cy)} l${f(rr(2, 6))} ${f(rr(-2, 2))}" stroke="#a8b4b8" stroke-width="0.8" opacity="${f(rr(0.1, 0.3))}"/>`); }
    for (const [cx, cy] of [[tx, ty], [tx + tw, ty], [tx, ty + th], [tx + tw, ty + th]]) a.raw(`<path d="M${cx} ${cy} l${cx === tx ? 14 : -14} 0 l${cx === tx ? -14 : 14} ${cy === ty ? 12 : -12} Z" fill="#14100c"/>`);
    for (const bx of [tx - 14, tx + tw - 10]) a.raw(`<rect x="${bx}" y="${ty + 14}" width="24" height="${th - 28}" rx="3" fill="url(#ironG)" stroke="${INK}" stroke-width="1.6"/>` + a.rivet(bx + 12, ty + 26, 3.4) + a.rivet(bx + 12, ty + th - 26, 3.4));
    a.raw(K.grain(tx, ty, tw, th, 900, '#000', '#9aa4a8', 0.3) + K.soft(tx + tw * 0.3, ty + 30, 160, '#c8d4d8', 0.08));
    for (let k = 0; k < 6; k++) { const cx = tx + 44 + k * (tw - 88) / 5, cy = ty + th / 2; a.raw(`<circle cx="${f(cx)}" cy="${f(cy)}" r="34" fill="#141618" stroke="url(#brassG)" stroke-width="5"/><circle cx="${f(cx)}" cy="${f(cy)}" r="34" fill="none" stroke="${INK}" stroke-width="1.4"/><path d="M${f(cx - 24)} ${f(cy - 16)} A30 30 0 0 1 ${f(cx + 10)} ${f(cy - 30)}" stroke="#000" stroke-width="3" fill="none" opacity="0.6"/>`); }
    // right: the armoury rack, two timber posts with three crossbars of iron hooks
    const rx = x + w - 440, ry = y + 40, rw = 400, rh = h - 80;
    for (const px of [rx + 10, rx + rw - 40]) a.raw(`<rect x="${px}" y="${ry}" width="30" height="${rh}" fill="url(#oakV)" stroke="${INK}" stroke-width="2.4"/>` + K.grain(px, ry, 30, rh, 200, '#000', '#c8a070', 0.3));
    for (let k = 0; k < 4; k++) { const by = ry + 40 + k * (rh - 80) / 3; a.raw(`<rect x="${rx}" y="${f(by - 12)}" width="${rw}" height="24" fill="url(#oakG)" stroke="${INK}" stroke-width="2"/>` + a.rivet(rx + 25, by, 4) + a.rivet(rx + rw - 25, by, 4));
      for (let j = 0; j < 4; j++) { const hx = rx + 70 + j * (rw - 140) / 3; a.raw(`<path d="M${f(hx)} ${f(by + 12)} l0 18 q0 10 10 8" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${f(hx)} ${f(by + 12)} l0 18 q0 10 10 8" stroke="#5a5650" stroke-width="3" fill="none" stroke-linecap="round"/>`); } }
  });
  K.write('smithy', Object.assign(L, { heroes: [130, 170, 360, 740], rack: [1100, 150, 400, 760], tray: [550, 136, 500, 150], anvil: [560, 330, 480, 330] }));
}
// Infirmarium: a shelf of Wenna's remedies on the stone wall, her table under stained linen, the patient chart pinned to it,
// a bone saw, a lancet, a basin of leeches and a roll of bandage laid out ready
{
  const K = kit(14), { a, R, rr } = K;
  const L = shell(K, (x, y, w, h) => {
    // wall: dim limestone courses lit from a window at the upper left
    a.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2a2622"/>`);
    let row = 0;
    for (let by = y; by < y + 260; by += 52, row++) { let bx = x - (row % 2) * 70; while (bx < x + w) { const bw = rr(120, 200), tone = mix('#3e3a34', '#5a544a', R()), gid = 'iw' + row + '_' + Math.floor(bx);
      a.raw(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light(tone, 0.06)}"/><stop offset="1" stop-color="${dark(tone, 0.3)}"/></linearGradient><rect x="${f(bx + 3)}" y="${f(by + 3)}" width="${f(bw - 6)}" height="46" rx="4" fill="url(#${gid})" stroke="#141210" stroke-width="2"/>`); bx += bw; } }
    a.raw(K.grain(x, y, w, 260, 2400, '#000', '#e8e0d0', 0.2) + K.soft(x + 200, y + 40, 420, '#e8e4dc', 0.16));
    // the remedy shelf: an oak board on two iron brackets, jars of every size and colour
    const sy = y + 214;
    a.raw(K.oak(x + 30, sy, w - 60, 26, '#4a3220', 26));
    for (const bx of [x + 120, x + w - 120]) a.raw(`<path d="M${bx} ${sy + 26} l0 50 l-36 -50 Z" fill="url(#ironG)" stroke="${INK}" stroke-width="2"/>`);
    // herbs drying from a cord along the top of the wall
    a.raw(`<path d="M${x + 20} ${y + 26} Q${x + w / 2} ${y + 46} ${x + w - 20} ${y + 26}" stroke="#8a7a5a" stroke-width="2" fill="none"/>`);
    for (let k = 0; k < 16; k++) { const hx = x + 70 + k * (w - 140) / 15 + rr(-10, 10), hy = y + 30 + 20 * Math.sin(Math.PI * (hx - x) / w), hl = rr(40, 70), col = ['#5a6a3a', '#7a6a3a', '#4a5a3a', '#6a4a3a'][Math.floor(R() * 4)];
      a.raw(`<path d="M${f(hx)} ${f(hy)} l0 8" stroke="#c8b890" stroke-width="3"/>`);
      for (let j = 0; j < 7; j++) { const ang = rr(-0.35, 0.35); a.raw(`<path d="M${f(hx)} ${f(hy + 6)} q${f(Math.sin(ang) * hl * 0.6)} ${f(hl * 0.5)} ${f(Math.sin(ang) * hl)} ${f(hl)}" stroke="${INK}" stroke-width="3" fill="none"/><path d="M${f(hx)} ${f(hy + 6)} q${f(Math.sin(ang) * hl * 0.6)} ${f(hl * 0.5)} ${f(Math.sin(ang) * hl)} ${f(hl)}" stroke="${mix(col, '#c8b890', R() * 0.3)}" stroke-width="1.6" fill="none"/><ellipse cx="${f(hx + Math.sin(ang) * hl * 0.8)}" cy="${f(hy + hl * 0.8)}" rx="4" ry="2" fill="${col}" transform="rotate(${f(70 + ang * 50)} ${f(hx + Math.sin(ang) * hl * 0.8)} ${f(hy + hl * 0.8)})"/>`); } }
    // the jars: glass with the liquid level showing, a meniscus, two highlights, stoppers of cork or cloth tied with string,
    // labels in Wenna's hand, and dust on their shoulders
    let jn = 0;
    for (let jx = x + 70; jx < x + w - 70; jn++) {
      const jh = rr(80, 150), jw = rr(26, 46), col = ['#3a5a3a', '#6a2a1a', '#9a7a2a', '#2a3a5a', '#5a4a2a', '#5a4a6a', '#7a6a52', '#2a4a4a'][Math.floor(R() * 8)], kind = R();
      if (jn % 5 === 3) { // a mortar and pestle between the jars
        a.raw(`<path d="M${f(jx - 34)} ${sy - 50} Q${f(jx - 36)} ${sy - 4} ${f(jx)} ${sy} Q${f(jx + 36)} ${sy - 4} ${f(jx + 34)} ${sy - 50} Z" fill="url(#ironG)" stroke="${INK}" stroke-width="2"/><ellipse cx="${f(jx)}" cy="${sy - 50}" rx="34" ry="8" fill="#2a2622" stroke="${INK}" stroke-width="1.6"/><path d="M${f(jx - 6)} ${sy - 52} L${f(jx + 30)} ${sy - 104}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${f(jx - 6)} ${sy - 52} L${f(jx + 30)} ${sy - 104}" stroke="#8a8478" stroke-width="8" stroke-linecap="round"/><path d="M${f(jx - 26)} ${sy - 40} q4 24 20 30" stroke="#d8d4cc" stroke-width="2" fill="none" opacity="0.4"/>`);
        jx += 90; continue;
      }
      const gid = 'jr' + Math.floor(jx), lid = 'jl' + Math.floor(jx), cid = 'jc' + Math.floor(jx);
      a.raw(`<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${dark(col, 0.55)}"/><stop offset="0.3" stop-color="${light(col, 0.12)}"/><stop offset="0.55" stop-color="${col}"/><stop offset="1" stop-color="${dark(col, 0.65)}"/></linearGradient><linearGradient id="${lid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${dark(col, 0.75)}"/><stop offset="0.35" stop-color="${dark(col, 0.25)}"/><stop offset="1" stop-color="${dark(col, 0.85)}"/></linearGradient>`);
      const d = kind < 0.5 ? `M${f(jx - jw)} ${sy} L${f(jx - jw)} ${f(sy - jh * 0.75)} Q${f(jx - jw)} ${f(sy - jh * 0.88)} ${f(jx - jw * 0.5)} ${f(sy - jh * 0.9)} L${f(jx + jw * 0.5)} ${f(sy - jh * 0.9)} Q${f(jx + jw)} ${f(sy - jh * 0.88)} ${f(jx + jw)} ${f(sy - jh * 0.75)} L${f(jx + jw)} ${sy} Z`
        : `M${f(jx - jw)} ${sy} Q${f(jx - jw * 1.2)} ${f(sy - jh * 0.5)} ${f(jx - jw * 0.35)} ${f(sy - jh * 0.8)} L${f(jx - jw * 0.3)} ${f(sy - jh)} L${f(jx + jw * 0.3)} ${f(sy - jh)} L${f(jx + jw * 0.35)} ${f(sy - jh * 0.8)} Q${f(jx + jw * 1.2)} ${f(sy - jh * 0.5)} ${f(jx + jw)} ${sy} Z`;
      const lvl = sy - jh * rr(0.3, 0.7);
      a.raw(`<clipPath id="${cid}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#${gid})" opacity="0.55"/>`);
      a.raw(`<g clip-path="url(#${cid})"><rect x="${f(jx - jw * 1.3)}" y="${f(lvl)}" width="${f(jw * 2.6)}" height="${f(sy - lvl)}" fill="url(#${lid})"/><ellipse cx="${f(jx)}" cy="${f(lvl)}" rx="${f(jw * 1.1)}" ry="3" fill="${light(col, 0.25)}" opacity="0.6"/>` +
        Array.from({ length: 5 }, () => `<circle cx="${f(jx + rr(-jw * 0.7, jw * 0.7))}" cy="${f(lvl + rr(6, sy - lvl - 4))}" r="${f(rr(1, 2.6))}" fill="${light(col, 0.4)}" opacity="0.4"/>`).join('') + `</g>`);
      a.raw(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2"/><path d="M${f(jx - jw * 0.62)} ${f(sy - jh * 0.12)} L${f(jx - jw * 0.62)} ${f(sy - jh * 0.62)}" stroke="#fff6e0" stroke-width="3.4" opacity="0.4" stroke-linecap="round"/><path d="M${f(jx + jw * 0.7)} ${f(sy - jh * 0.2)} L${f(jx + jw * 0.7)} ${f(sy - jh * 0.4)}" stroke="#fff6e0" stroke-width="1.6" opacity="0.3" stroke-linecap="round"/>`);
      if (kind < 0.5) {
        if (R() < 0.5) a.raw(`<rect x="${f(jx - jw * 0.6)}" y="${f(sy - jh * 0.98)}" width="${f(jw * 1.2)}" height="${f(jh * 0.1)}" fill="#8a6a42" stroke="${INK}" stroke-width="1.4"/>` + Array.from({ length: 4 }, (_, k) => `<path d="M${f(jx - jw * 0.5 + k * jw * 0.3)} ${f(sy - jh * 0.97)} l0 ${f(jh * 0.08)}" stroke="#5a4028" stroke-width="1"/>`).join(''));
        else a.raw(`<path d="M${f(jx - jw * 0.72)} ${f(sy - jh * 0.86)} Q${f(jx - jw * 0.8)} ${f(sy - jh * 1.02)} ${f(jx)} ${f(sy - jh * 1.04)} Q${f(jx + jw * 0.8)} ${f(sy - jh * 1.02)} ${f(jx + jw * 0.72)} ${f(sy - jh * 0.86)} L${f(jx + jw * 0.5)} ${f(sy - jh * 0.8)} L${f(jx - jw * 0.5)} ${f(sy - jh * 0.8)} Z" fill="#c8b48a" stroke="${INK}" stroke-width="1.4"/><path d="M${f(jx - jw * 0.6)} ${f(sy - jh * 0.88)} L${f(jx + jw * 0.6)} ${f(sy - jh * 0.88)}" stroke="#6a3a1a" stroke-width="2.4"/><path d="M${f(jx + jw * 0.5)} ${f(sy - jh * 0.88)} q6 8 2 16" stroke="#6a3a1a" stroke-width="1.6" fill="none"/>`);
      } else a.raw(`<path d="M${f(jx - jw * 0.36)} ${f(sy - jh - 12)} L${f(jx + jw * 0.36)} ${f(sy - jh - 12)} L${f(jx + jw * 0.3)} ${f(sy - jh + 4)} L${f(jx - jw * 0.3)} ${f(sy - jh + 4)} Z" fill="#8a6a42" stroke="${INK}" stroke-width="1.2"/>` + Array.from({ length: 5 }, () => `<circle cx="${f(jx + rr(-jw * 0.25, jw * 0.25))}" cy="${f(sy - jh - rr(0, 10))}" r="0.9" fill="#3a2a14"/>`).join(''));
      if (R() < 0.8) { const lw2 = jw * 1.24, lh2 = jh * 0.24, lx2 = jx - lw2 / 2, ly2 = sy - jh * 0.56;
        a.raw(`<path d="M${f(lx2)} ${f(ly2 + 2)} L${f(lx2 + lw2)} ${f(ly2)} L${f(lx2 + lw2 - 1)} ${f(ly2 + lh2)} L${f(lx2 + 1)} ${f(ly2 + lh2 + 1)} Z" fill="#d8ccac" stroke="${INK}" stroke-width="0.9"/>` +
          Array.from({ length: 3 }, (_, k) => { let dd = `M${f(lx2 + 4)} ${f(ly2 + 6 + k * lh2 / 3.4)}`; for (let q = 0; q < 5; q++) dd += ` q${f(lw2 / 12)} ${f(rr(-2.4, 2.4))} ${f(lw2 / 6.2)} 0`; return `<path d="${dd}" stroke="#3a2416" stroke-width="0.9" fill="none" opacity="${k === 0 ? 0.85 : 0.5}"/>`; }).join('') + K.soft(lx2 + lw2 * rr(0.2, 0.8), ly2 + lh2 * 0.6, lh2 * 0.6, '#7a5a30', 0.3)); }
      a.raw(`<path d="M${f(jx - jw * 0.9)} ${f(sy - jh * (kind < 0.5 ? 0.86 : 0.62))} q${f(jw * 0.9)} -4 ${f(jw * 1.8)} 0" stroke="#b8b0a0" stroke-width="2.2" opacity="0.22" fill="none"/>`);
      jx += jw * 2 + rr(10, 40) + (R() < 0.15 ? 60 : 0);
    }
    // the table: oak edge and the linen drawn over it, darker in the folds, old blood soaked into it
    const ty = y + 270;
    a.raw(K.oak(x, ty - 10, w, h - 260, '#3a2818', 80));
    const lin = `M${x + 20} ${ty + 10} Q${x + w / 2} ${ty - 6} ${x + w - 20} ${ty + 10} L${x + w - 10} ${y + h - 10} L${x + 10} ${y + h - 10} Z`;
    a.raw(`<linearGradient id="lin2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8bea6"/><stop offset="1" stop-color="#7a705a"/></linearGradient><path d="${lin}" fill="url(#lin2)" stroke="${INK}" stroke-width="2.6"/><path d="${lin}" fill="url(#weave)" opacity="0.3"/>`);
    for (let k = 0; k < 9; k++) { const fx = x + 80 + k * (w - 160) / 8 + rr(-30, 30), fw = rr(16, 40);
      a.raw(`<path d="M${f(fx)} ${ty + 10} q${f(rr(-20, 20))} ${f(h * 0.3)} ${f(rr(-14, 14))} ${f(h - 290)}" stroke="#4a4232" stroke-width="${f(fw * 0.4)}" fill="none" opacity="0.18" stroke-linecap="round"/><path d="M${f(fx + fw * 0.35)} ${ty + 10} q${f(rr(-20, 20))} ${f(h * 0.3)} ${f(rr(-14, 14))} ${f(h - 290)}" stroke="#f4ecd8" stroke-width="${f(fw * 0.2)}" fill="none" opacity="0.22" stroke-linecap="round"/>`); }
    a.raw(K.grain(x, ty, w, h - 270, 3000, '#3a3024', '#fff8e8', 0.18));
    for (let k = 0; k < 5; k++) a.raw(K.soft(x + 60 + R() * (w - 120), ty + 60 + R() * (h - 360), rr(24, 70), k % 2 ? '#6a1410' : '#7a5a30', 0.25));
    a.raw(K.soft(x + w / 2, y + h, 700, '#000', 0.45));
    // the chart, pinned a little crooked
    const cx = x + 580, cy = ty + 20, cw = 540, ch = h - 330;
    a.raw(`<g transform="rotate(-1.2 ${cx + cw / 2} ${cy + ch / 2})"><rect x="${cx + 8}" y="${cy + 12}" width="${cw}" height="${ch}" fill="#000" opacity="0.4"/>` + K.vellum([[cx, cy], [cx + cw, cy], [cx + cw, cy + ch], [cx, cy + ch]], '#e2d4b0', { bbox: [cx, cy, cw, ch], fox: 30 }) +
      `<path d="M${cx + 24} ${cy + 64} L${cx + cw - 24} ${cy + 64}" stroke="#7a1a14" stroke-width="1.6" opacity="0.7"/>`);
    // the body diagram in ink at the chart's left
    const bx = cx + 120, by = cy + 100, s2 = (ch - 140) / 320;
    const body = `M${bx} ${by} m-16 0 a16 18 0 1 0 32 0 a16 18 0 1 0 -32 0 M${bx - 8} ${by + 16} L${bx - 8} ${by + 28} L${bx - 44} ${by + 40} L${bx - 60} ${by + 130} L${bx - 50} ${by + 132} L${bx - 32} ${by + 60} L${bx - 30} ${by + 150} L${bx - 34} ${by + 300} L${bx - 14} ${by + 300} L${bx} ${by + 170} L${bx + 14} ${by + 300} L${bx + 34} ${by + 300} L${bx + 30} ${by + 150} L${bx + 32} ${by + 60} L${bx + 50} ${by + 132} L${bx + 60} ${by + 130} L${bx + 44} ${by + 40} L${bx + 8} ${by + 28} L${bx + 8} ${by + 16}`;
    a.raw(`<g transform="translate(${bx} ${by}) scale(${f(s2)}) translate(${-bx} ${-by})"><path d="${body}" fill="none" stroke="#3a2a1c" stroke-width="2.2" opacity="0.75"/><path d="M${bx} ${by + 40} L${bx} ${by + 160}" stroke="#3a2a1c" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/></g></g>`);
    for (const [px, py] of [[cx + 16, cy + 14], [cx + cw - 16, cy + 18]]) a.raw(`<circle cx="${px}" cy="${py}" r="8" fill="url(#ironG)" stroke="${INK}" stroke-width="1.4"/><circle cx="${px - 2}" cy="${py - 2}" r="2.4" fill="#fff" opacity="0.5"/>`);
    // tools laid on the linen to the right of the chart
    const tx = x + w - 300, tY = y + h - 34;
    a.raw(`<path d="M${tx} ${tY} L${tx + 200} ${tY - 46}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M${tx} ${tY} L${tx + 200} ${tY - 46}" stroke="#9a968e" stroke-width="13" stroke-linecap="round"/><path d="M${tx} ${tY - 4} L${tx + 196} ${tY - 50}" stroke="#e8e4dc" stroke-width="2" opacity="0.6"/>`);
    for (let k = 0; k < 20; k++) a.raw(`<path d="M${f(tx + 6 + k * 9.5)} ${f(tY + 6 - k * 2.2)} l2 7" stroke="${INK}" stroke-width="1.6"/>`);
    a.raw(`<rect x="${tx + 196}" y="${tY - 72}" width="70" height="36" rx="9" fill="#5a3e26" stroke="${INK}" stroke-width="2.4" transform="rotate(-13 ${tx + 231} ${tY - 54})"/>`);
    a.raw(`<path d="M${tx + 40} ${tY - 120} L${tx + 210} ${tY - 150}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${tx + 40} ${tY - 120} L${tx + 210} ${tY - 150}" stroke="#c8c4bc" stroke-width="3" stroke-linecap="round"/><path d="M${tx + 150} ${tY - 140} L${tx + 210} ${tY - 150}" stroke="#4a3220" stroke-width="7" stroke-linecap="round"/>`);
    // the basin of leeches and a bandage roll at the left foot
    const qx = x + 300, qy = y + h - 80;
    a.raw(`<ellipse cx="${qx}" cy="${qy + 10}" rx="96" ry="30" fill="#000" opacity="0.4"/><ellipse cx="${qx}" cy="${qy}" rx="90" ry="30" fill="url(#ironG)" stroke="${INK}" stroke-width="2.4"/><ellipse cx="${qx}" cy="${qy - 6}" rx="72" ry="19" fill="#3a1410"/><ellipse cx="${qx - 20}" cy="${qy - 10}" rx="30" ry="6" fill="#8a3a2a" opacity="0.4"/>`);
    for (let k = 0; k < 6; k++) { const lx2 = qx - 50 + R() * 100, ly2 = qy - 12 + R() * 12; a.raw(`<path d="M${f(lx2)} ${f(ly2)} q10 -8 22 -2" stroke="#0a0604" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${f(lx2 + 2)} ${f(ly2 - 2)} q8 -6 16 -2" stroke="#4a2a1a" stroke-width="2" fill="none" stroke-linecap="round"/>`); }
    a.raw(`<ellipse cx="${x + 140}" cy="${y + h - 70}" rx="44" ry="44" fill="#d8d0bc" stroke="${INK}" stroke-width="2.4"/>` + [36, 26, 16, 7].map(r => `<circle cx="${x + 140}" cy="${y + h - 70}" r="${r}" fill="none" stroke="#9a907a" stroke-width="1.4"/>`).join('') + `<path d="M${x + 180} ${y + h - 60} q60 10 120 -6" stroke="#d8d0bc" stroke-width="18" fill="none"/><path d="M${x + 180} ${y + h - 60} q60 10 120 -6" stroke="${INK}" stroke-width="1.2" fill="none"/>` + K.soft(x + 250, y + h - 60, 24, '#7a1410', 0.5));
  });
  K.write('infirmarium', Object.assign(L, { patients: [120, 420, 420, 460], chart: [870, 470, 310, 400], services: [1190, 420, 290, 420] }));
}
// Cellarium: the tally board, four lanes of notched sticks and peg holes, chalk totals on a slate
{
  const K = kit(15), { a, R, rr } = K;
  const L = shell(K, (x, y, w, h) => {
    a.raw(`<linearGradient id="brd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8844a"/><stop offset="1" stop-color="#5a3416"/></linearGradient>`);
    a.raw(K.oak(x, y, w, h, '#4a3420', 120));
    // four lanes, each a darker recessed board with a hanging tally stick
    const lanes = 4, lw = (w - 380) / lanes;
    for (let k = 0; k < lanes; k++) {
      const lx = x + 40 + k * lw;
      a.raw(`<rect x="${f(lx + 10)}" y="${y + 40}" width="${f(lw - 20)}" height="${h - 80}" fill="#1e140c" stroke="${INK}" stroke-width="2.6" rx="6"/>`);
      a.raw(K.oak(lx + 18, y + 48, lw - 36, h - 96, mix('#3a2818', '#2a1c10', R()), 40));
      a.raw(`<rect x="${f(lx + 18)}" y="${y + 48}" width="${f(lw - 36)}" height="${h - 96}" fill="url(#vig)"/>`);
      // a long tally stick, notched along its length
      const sx = lx + lw / 2;
      a.raw(`<rect x="${f(sx - 14)}" y="${y + 230}" width="28" height="${h - 360}" rx="6" fill="#b89868" stroke="${INK}" stroke-width="2"/><rect x="${f(sx - 14)}" y="${y + 230}" width="10" height="${h - 360}" rx="4" fill="#e8d0a0" opacity="0.35"/>`);
      for (let n = 0; n < 16; n++) a.raw(`<path d="M${f(sx - 14)} ${f(y + 250 + n * ((h - 400) / 16))} l${f(rr(8, 18))} ${f(rr(-3, 3))}" stroke="${INK}" stroke-width="2"/>`);
      // peg holes down each side
      for (let n = 0; n < 8; n++) for (const dx of [-lw * 0.32, lw * 0.32]) a.raw(`<circle cx="${f(sx + dx)}" cy="${f(y + 250 + n * ((h - 400) / 8))}" r="7" fill="#0a0604" stroke="#6a5038" stroke-width="1.2"/>`);
      a.raw(`<circle cx="${f(sx)}" cy="${y + 196}" r="9" fill="url(#ironG)" stroke="${INK}" stroke-width="1.6"/><path d="M${f(sx)} ${y + 204} L${f(sx)} ${y + 230}" stroke="#8a7a5a" stroke-width="2"/>`);
      // what the lane counts, drawn at its head: bread, candles, a tincture, a pry-bar and keys
      const hy = y + 170;
      a.raw(K.soft(sx, hy - 50, 90, '#ffd8a0', 0.08));
      if (k === 0) { for (const [dx, dy, ww] of [[-40, 0, 44], [26, 4, 52], [-6, -30, 48]]) a.raw(`<path d="M${f(sx + dx - ww)} ${f(hy + dy)} Q${f(sx + dx - ww)} ${f(hy + dy - 46)} ${f(sx + dx)} ${f(hy + dy - 50)} Q${f(sx + dx + ww)} ${f(hy + dy - 46)} ${f(sx + dx + ww)} ${f(hy + dy)} Z" fill="url(#brd)" stroke="${INK}" stroke-width="2.4"/><path d="M${f(sx + dx - ww * 0.5)} ${f(hy + dy - 36)} l${f(ww * 0.25)} 14 M${f(sx + dx)} ${f(hy + dy - 42)} l${f(ww * 0.25)} 14 M${f(sx + dx + ww * 0.45)} ${f(hy + dy - 34)} l${f(ww * 0.2)} 12" stroke="#4a2a10" stroke-width="2"/><path d="M${f(sx + dx - ww * 0.6)} ${f(hy + dy - 34)} Q${f(sx + dx)} ${f(hy + dy - 50)} ${f(sx + dx + ww * 0.5)} ${f(hy + dy - 36)}" stroke="#e8c890" stroke-width="2" fill="none" opacity="0.5"/>`); }
      if (k === 1) { for (let c = 0; c < 7; c++) { const cx2 = sx - 54 + c * 18, ch2 = 70 + (c % 3) * 14; a.raw(`<rect x="${f(cx2 - 7)}" y="${f(hy - ch2)}" width="14" height="${ch2}" fill="#e0d4b0" stroke="${INK}" stroke-width="1.4"/><path d="M${f(cx2 - 3)} ${f(hy - ch2 + 6)} l0 ${f(ch2 - 12)}" stroke="#fff8e8" stroke-width="2" opacity="0.5"/><path d="M${f(cx2)} ${f(hy - ch2)} l0 -6" stroke="${INK}" stroke-width="1.4"/>`); } a.raw(`<path d="M${f(sx - 64)} ${f(hy - 34)} Q${f(sx)} ${f(hy - 26)} ${f(sx + 64)} ${f(hy - 34)}" stroke="#8a6a3a" stroke-width="4" fill="none"/>`); }
      if (k === 2) { for (const [dx, col, hh] of [[-36, '#2a4a3a', 80], [10, '#6a2a1a', 104], [50, '#5a4a6a', 70]]) a.raw(`<path d="M${f(sx + dx - 18)} ${hy} Q${f(sx + dx - 26)} ${f(hy - hh * 0.5)} ${f(sx + dx - 8)} ${f(hy - hh * 0.75)} L${f(sx + dx - 6)} ${f(hy - hh)} L${f(sx + dx + 6)} ${f(hy - hh)} L${f(sx + dx + 8)} ${f(hy - hh * 0.75)} Q${f(sx + dx + 26)} ${f(hy - hh * 0.5)} ${f(sx + dx + 18)} ${hy} Z" fill="${col}" stroke="${INK}" stroke-width="2"/><path d="M${f(sx + dx - 10)} ${f(hy - 10)} l0 ${f(-hh * 0.4)}" stroke="#fff6e0" stroke-width="2.4" opacity="0.4"/><rect x="${f(sx + dx - 8)}" y="${f(hy - hh - 10)}" width="16" height="11" fill="#6a4a2a" stroke="${INK}" stroke-width="1.2"/>`); }
      if (k === 3) { a.raw(`<path d="M${f(sx - 60)} ${f(hy - 10)} L${f(sx + 50)} ${f(hy - 80)} q14 -6 10 10" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${f(sx - 60)} ${f(hy - 10)} L${f(sx + 50)} ${f(hy - 80)} q14 -6 10 10" stroke="#4a4642" stroke-width="8" fill="none" stroke-linecap="round"/>`); for (const [dx, dy] of [[-30, -60], [-10, -70], [10, -62]]) a.raw(`<circle cx="${f(sx + dx)}" cy="${f(hy + dy)}" r="10" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="${f(sx + dx)}" cy="${f(hy + dy)}" r="10" fill="none" stroke="#a8842a" stroke-width="3"/><path d="M${f(sx + dx)} ${f(hy + dy + 10)} l0 30 l8 0 m-8 -8 l6 0" stroke="#a8842a" stroke-width="3.4" fill="none"/>`); }
    }
    // the slate on the right with chalk smears
    const sx = x + w - 320, sy = y + 60;
    a.raw(`<rect x="${sx}" y="${sy}" width="280" height="${h - 120}" fill="#5a4430" stroke="${INK}" stroke-width="3" rx="6"/><rect x="${sx + 16}" y="${sy + 16}" width="248" height="${h - 152}" fill="#24282a" stroke="${INK}" stroke-width="2"/>`);
    for (let k = 0; k < 5; k++) a.raw(K.soft(sx + 30 + R() * 220, sy + 40 + R() * (h - 220), rr(40, 90), '#a8aaa4', 0.035));
    // old tallies half wiped off the lower slate: gates of five in chalk
    for (let r = 0; r < 7; r++) for (let g = 0; g < 4; g++) { if (R() < 0.25) continue; const gx = sx + 40 + g * 56, gy = sy + h * 0.5 + r * 46, op = rr(0.08, 0.22);
      for (let q = 0; q < 4; q++) a.raw(`<path d="M${f(gx + q * 9 + rr(-1, 1))} ${f(gy)} l${f(rr(-2, 2))} 28" stroke="#d8d8d0" stroke-width="2" opacity="${f(op)}" stroke-linecap="round"/>`);
      a.raw(`<path d="M${f(gx - 4)} ${f(gy + 22)} L${f(gx + 34)} ${f(gy + 4)}" stroke="#d8d8d0" stroke-width="2" opacity="${f(op)}" stroke-linecap="round"/>`); }
    a.raw(`<rect x="${sx + 4}" y="${sy + h - 136}" width="272" height="14" fill="#3a2a1a" stroke="${INK}" stroke-width="1.4"/><rect x="${sx + 200}" y="${sy + h - 146}" width="44" height="12" rx="3" fill="#e8e4d8" stroke="${INK}" stroke-width="1"/>`);
    a.raw(`<path d="M${sx + 40} ${sy + 60} l40 0 M${sx + 40} ${sy + 66} l30 0" stroke="#d8d8d0" stroke-width="2" opacity="0.4"/>`);
  });
  K.write('cellarium', Object.assign(L, { lanes: [120, 136, 1060, 776], slate: [1200, 156, 280, 736] }));
}
// Sacristy: the relic case, velvet compartments behind old glass, a row of fifteen niches for the Teeth, an altar cloth below
{
  const K = kit(16), { a, R, rr } = K;
  const L = shell(K, (x, y, w, h) => {
    a.raw(K.oak(x, y, w, h, '#2a1a10', 100));
    // teeth niches along the top
    for (let k = 0; k < 15; k++) { const nx = x + 70 + k * ((w - 140) / 15), nw = (w - 140) / 15 - 12;
      a.raw(`<path d="M${f(nx)} ${y + 150} L${f(nx)} ${y + 60} Q${f(nx + nw / 2)} ${y + 34} ${f(nx + nw)} ${y + 60} L${f(nx + nw)} ${y + 150} Z" fill="url(#velvetG)" stroke="${INK}" stroke-width="2"/><path d="M${f(nx)} ${y + 150} L${f(nx)} ${y + 60} Q${f(nx + nw / 2)} ${y + 34} ${f(nx + nw)} ${y + 60} L${f(nx + nw)} ${y + 150} Z" fill="url(#vig)"/>`);
      // each niche its own: a roman numeral cut in the lintel, and in some a cobweb, a candle stub or a dried flower
      a.raw(`<path d="M${f(nx - 3)} ${y + 58} Q${f(nx + nw / 2)} ${y + 28} ${f(nx + nw + 3)} ${y + 58}" stroke="url(#brassG)" stroke-width="3" fill="none"/>`);
      const v = R();
      if (v < 0.3) a.raw(`<path d="M${f(nx + 2)} ${y + 62} L${f(nx + 22)} ${y + 82} M${f(nx + 2)} ${y + 74} L${f(nx + 16)} ${y + 64} M${f(nx + 2)} ${y + 70} Q${f(nx + 10)} ${y + 70} ${f(nx + 12)} ${y + 62}" stroke="#d8d0c0" stroke-width="0.7" opacity="0.45" fill="none"/>`);
      else if (v < 0.5) a.raw(`<rect x="${f(nx + nw / 2 - 4)}" y="${y + 128}" width="8" height="${f(rr(8, 18))}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.8" transform="translate(0 ${f(-rr(0, 10))})"/>`);
      else if (v < 0.62) a.raw(`<path d="M${f(nx + nw / 2)} ${y + 148} q-4 -20 6 -34" stroke="#4a5a2a" stroke-width="1.4" fill="none"/><circle cx="${f(nx + nw / 2 + 6)}" cy="${y + 112}" r="4" fill="#6a2a3a" stroke="${INK}" stroke-width="0.6"/>`); }
    a.raw(`<rect x="${x + 50}" y="${y + 150}" width="${w - 100}" height="14" fill="url(#brassG)" stroke="${INK}" stroke-width="1.6"/><path d="M${x + 52} ${y + 153} l${w - 104} 0" stroke="#fff2c0" stroke-width="1.2" opacity="0.5"/>` + K.grain(x + 50, y + 150, w - 100, 14, 500, '#3a2a08', '#fff0b0', 0.35));
    // the case: 6 x 3 compartments behind glass
    const cx = x + 60, cy = y + 196, cw = w - 120, ch = h - 380, cols = 6, rows = 3;
    a.raw(`<rect x="${cx - 14}" y="${cy - 14}" width="${cw + 28}" height="${ch + 28}" fill="#1a0e08" stroke="${INK}" stroke-width="3"/>`);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const bx = cx + c * cw / cols, by = cy + r * ch / rows, bw = cw / cols, bh = ch / rows;
      a.raw(`<rect x="${f(bx + 6)}" y="${f(by + 6)}" width="${f(bw - 12)}" height="${f(bh - 12)}" fill="url(#velvetG)" stroke="${INK}" stroke-width="2"/>`);
      for (let k = 0; k < 6; k++) a.raw(`<path d="M${f(bx + 10 + R() * (bw - 20))} ${f(by + 12)} l${f(rr(-4, 4))} ${f(bh - 24)}" stroke="#4a1622" stroke-width="1" opacity="0.5"/>`);
      // a tufted cushion with the dent of whatever lay on it once
      const qx = bx + bw / 2, qy = by + bh * 0.56, qw = bw * 0.36, qh = bh * 0.22;
      a.raw(`<ellipse cx="${f(qx + 4)}" cy="${f(qy + 6)}" rx="${f(qw)}" ry="${f(qh)}" fill="#000" opacity="0.35"/><ellipse cx="${f(qx)}" cy="${f(qy)}" rx="${f(qw)}" ry="${f(qh)}" fill="#5a1a26" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${f(qx - qw * 0.2)}" cy="${f(qy - qh * 0.3)}" rx="${f(qw * 0.5)}" ry="${f(qh * 0.35)}" fill="#8a3a46" opacity="0.4"/><ellipse cx="${f(qx)}" cy="${f(qy)}" rx="${f(qw * 0.45)}" ry="${f(qh * 0.4)}" fill="#2a0a10" opacity="0.35"/>` +
        [[-0.6, 0], [0.6, 0], [0, -0.6], [0, 0.6]].map(([u, v]) => `<circle cx="${f(qx + u * qw)}" cy="${f(qy + v * qh)}" r="2.4" fill="url(#brassG)" stroke="${INK}" stroke-width="0.6"/>`).join(''));
      a.raw(`<rect x="${f(qx - 26)}" y="${f(by + bh - 30)}" width="52" height="12" rx="2" fill="url(#brassG)" stroke="${INK}" stroke-width="1"/><path d="M${f(qx - 18)} ${f(by + bh - 24)} l36 0" stroke="#4a3412" stroke-width="1" stroke-dasharray="3 2"/>`);
      a.raw(K.grain(bx + 6, by + 6, bw - 12, bh - 12, 120, '#1a0408', '#c86a7a', 0.2));
      a.raw(`<rect x="${f(bx + 6)}" y="${f(by + 6)}" width="${f(bw - 12)}" height="${f(bh - 12)}" fill="url(#vig)"/>`);
    }
    // gilded mullions over the glass
    for (let c = 1; c < cols; c++) a.raw(`<rect x="${f(cx + c * cw / cols - 5)}" y="${cy - 10}" width="10" height="${ch + 20}" fill="url(#brassG)" stroke="${INK}" stroke-width="1.2"/><path d="M${f(cx + c * cw / cols - 2)} ${cy - 8} l0 ${ch + 16}" stroke="#fff2c0" stroke-width="1" opacity="0.4"/>` + K.grain(cx + c * cw / cols - 5, cy - 10, 10, ch + 20, 60, '#3a2a08', '#fff0b0', 0.35));
    for (let r = 1; r < rows; r++) a.raw(`<rect x="${cx - 10}" y="${f(cy + r * ch / rows - 5)}" width="${cw + 20}" height="10" fill="url(#brassG)" stroke="${INK}" stroke-width="1.2"/><path d="M${cx - 8} ${f(cy + r * ch / rows - 2)} l${cw + 16} 0" stroke="#fff2c0" stroke-width="1" opacity="0.4"/>` + K.grain(cx - 10, cy + r * ch / rows - 5, cw + 20, 10, 300, '#3a2a08', '#fff0b0', 0.35));
    for (let r = 1; r < rows; r++) for (let c = 1; c < cols; c++) a.raw(`<circle cx="${f(cx + c * cw / cols)}" cy="${f(cy + r * ch / rows)}" r="9" fill="url(#brassG)" stroke="${INK}" stroke-width="1.4"/><path d="M${f(cx + c * cw / cols - 5)} ${f(cy + r * ch / rows)} l10 0 M${f(cx + c * cw / cols)} ${f(cy + r * ch / rows - 5)} l0 10" stroke="#5a3a10" stroke-width="1.4"/>`);
    // glass reflections
    for (let k = 0; k < 5; k++) { const gx = cx + R() * cw; a.raw(`<path d="M${f(gx)} ${cy} L${f(gx + 80)} ${cy} L${f(gx - 60)} ${cy + ch} L${f(gx - 140)} ${cy + ch} Z" fill="#fff" opacity="${f(rr(0.02, 0.05))}"/>`); }
    // the altar cloth along the bottom: carried relics are laid here
    const ay = y + h - 160;
    a.raw(`<path d="M${x + 40} ${ay} L${x + w - 40} ${ay} L${x + w - 50} ${y + h - 30} L${x + 50} ${y + h - 30} Z" fill="#c8c0b0" stroke="${INK}" stroke-width="2"/><path d="M${x + 40} ${ay} L${x + w - 40} ${ay} L${x + w - 50} ${y + h - 30} L${x + 50} ${y + h - 30} Z" fill="url(#weave)" opacity="0.35"/>`);
    a.raw(`<path d="M${x + 40} ${ay + 18} L${x + w - 40} ${ay + 18}" stroke="#7a1a14" stroke-width="8"/><path d="M${x + 40} ${ay + 18} L${x + w - 40} ${ay + 18}" stroke="${G.gold}" stroke-width="2" stroke-dasharray="10 6"/>`);
    for (let k = 0; k < 4; k++) a.raw(K.soft(x + 100 + R() * (w - 200), ay + 60 + R() * 60, rr(50, 90), '#8a6a3a', 0.07));
    a.raw(K.grain(x + 50, ay, w - 100, 130, 1600, '#5a5040', '#fff8e8', 0.16));
  });
  K.write('sacristy', Object.assign(L, { teeth: [150, 130, 1300, 116], case: [140, 292, 1320, 476], cloth: [140, 812, 1320, 110] }));
}
// Scriptorium: the Codex open on a slope, illuminated borders, ribbon tabs down the right edge
{
  const K = kit(17), { a } = K;
  const L = shell(K, (x, y, w, h) => {
    a.raw(K.oak(x, y, w, h, '#3a2818', 80));
    a.raw(K.book(x + 70, y + 46, w - 200, h - 110, '#5a1a14', { page: '#e6d6ae', ribbons: [[-20, '#7a1a14'], [10, G.gold]] }));
    a.raw(K.illum(x + 110, y + 76, (w - 200) / 2 - 70, h - 180, '#7a1a14') + K.illum(x + 70 + (w - 200) / 2 + 30, y + 76, (w - 200) / 2 - 70, h - 180, '#7a1a14'));
    a.raw(K.inkpot(x + w - 66, y + h - 40) + K.quill(x + w - 90, y + h - 90, -120));
  });
  K.write('scriptorium', Object.assign(L, { left: [190, 180, 560, 640], right: [820, 180, 560, 640], tabs: [1360, 170, 140, 640] }));
}
// Chapter House: the charter, a long vellum sheet on the Prior's table with hanging seals, two columns: works and vows
{
  const K = kit(18), { a, R, rr } = K;
  const L = shell(K, (x, y, w, h) => {
    a.raw(K.oak(x, y, w, h, '#2a1c12', 110));
    const px = x + 80, py = y + 36, pw = w - 160, ph = h - 140;
    a.raw(`<path d="M${px + 6} ${py + 10} L${px + pw + 6} ${py + 16} L${px + pw - 4} ${py + ph + 14} L${px + 2} ${py + ph + 8} Z" fill="#000" opacity="0.45"/>`);
    a.raw(K.vellum([[px, py], [px + pw, py + 6], [px + pw - 8, py + ph], [px - 2, py + ph - 4]], '#e6d8b4', { bbox: [px, py, pw, ph], fox: 40 }));
    a.raw(K.illum(px + 30, py + 30, pw - 60, ph - 60, '#7a1a14'));
    a.raw(`<path d="M${px + pw / 2} ${py + 90} L${px + pw / 2} ${py + ph - 60}" stroke="#7a1a14" stroke-width="1.4" opacity="0.6"/>`);
    // the fold creases of an old charter
    for (const t of [0.33, 0.66]) a.raw(`<path d="M${px} ${f(py + ph * t)} L${px + pw} ${f(py + ph * t + 4)}" stroke="#8a7a5a" stroke-width="1" opacity="0.1"/>`);
    // hanging seals at the foot, on cords
    for (let k = 0; k < 7; k++) { const sx = px + 140 + k * (pw - 280) / 6, sy = py + ph + 40 + rr(0, 20), col = ['#7a1a14', '#5a1a10', '#2a3a1a', '#7a1a14', '#4a2a10', '#7a1a14', '#5a1a3a'][k];
      a.raw(`<path d="M${f(sx - 6)} ${py + ph - 6} Q${f(sx - 10)} ${f(sy - 20)} ${f(sx)} ${f(sy - 26)} M${f(sx + 6)} ${py + ph - 6} Q${f(sx + 10)} ${f(sy - 20)} ${f(sx)} ${f(sy - 26)}" stroke="#c8b890" stroke-width="2" fill="none"/><path d="${blob(sx, sy, 26, R, 10, 0.12)}" fill="${col}" stroke="${INK}" stroke-width="1.8"/><circle cx="${f(sx)}" cy="${f(sy)}" r="15" fill="none" stroke="${dark(col, 0.4)}" stroke-width="2"/><path d="M${f(sx - 7)} ${f(sy)} l14 0 M${f(sx)} ${f(sy - 7)} l0 14" stroke="${dark(col, 0.5)}" stroke-width="2"/><path d="M${f(sx - 14)} ${f(sy - 10)} q6 -8 14 -8" stroke="#fff" stroke-width="2" fill="none" opacity="0.25"/>`); }
  });
  K.write('chapter', Object.assign(L, { left: [200, 196, 590, 620], right: [820, 196, 590, 620] }));
}

// ================================================================== small UI sprites
function sprite(name, w, h, draw) {
  const a = new Art(w, h, name.length * 7).useGrain();
  const K = kit(name.length); K.a = a;
  a.raw(`<defs><linearGradient id="ironG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5650"/><stop offset="0.45" stop-color="#2e2c2a"/><stop offset="1" stop-color="#141210"/></linearGradient><linearGradient id="brassG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8b860"/><stop offset="0.5" stop-color="#8a6a28"/><stop offset="1" stop-color="#4a3410"/></linearGradient><radialGradient id="pageV" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#fff6df" stop-opacity="0.18"/><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3a2210" stop-opacity="0.38"/></radialGradient></defs>`);
  draw(a, a.R);
  fs.writeFileSync(`${OUT}/ui_${name}.svg`, a.svg(false));
}
// a vellum label button (9-slice: 24px corners), normal and hover and disabled
for (const [nm, base, edge] of [['btn', '#e0cfa6', INK], ['btn_hover', '#f0e2bc', '#7a1a14'], ['btn_off', '#9a907a', '#5a5040'], ['btn_down', '#c8b890', INK]]) sprite(nm, 120, 56, (a, R) => {
  a.raw(`<path d="M6 4 L114 6 L116 50 L4 52 Z" fill="${base}" stroke="${edge}" stroke-width="2.6"/><path d="M6 4 L114 6 L116 50 L4 52 Z" fill="url(#pageV)"/>`);
  for (let k = 0; k < 6; k++) a.raw(`<circle cx="${f(10 + R() * 100)}" cy="${f(8 + R() * 40)}" r="${f(1 + R() * 2)}" fill="#8a5a2a" opacity="0.15"/>`);
  a.raw(`<path d="M10 10 L110 11" stroke="${edge}" stroke-width="0.8" opacity="0.35"/><path d="M10 46 L110 45" stroke="${edge}" stroke-width="0.8" opacity="0.35"/>`);
});
// a red wax seal (buy / sign)
for (const [nm, col] of [['seal', '#8a1a14'], ['seal_hover', '#b0261c'], ['seal_off', '#4a3a34']]) sprite(nm, 96, 96, (a, R) => {
  a.raw(`<path d="${blob(48, 50, 40, R, 12, 0.1)}" fill="#000" opacity="0.4"/><path d="${blob(48, 46, 40, R, 12, 0.1)}" fill="${col}" stroke="${INK}" stroke-width="2.4"/><circle cx="48" cy="46" r="26" fill="none" stroke="${dark(col, 0.45)}" stroke-width="3"/><path d="M30 30 q10 -12 26 -12" stroke="#fff" stroke-width="3" fill="none" opacity="0.3"/>`);
});
// an item slot: a dark recess with iron corners
for (const [nm, ring] of [['slot', '#5a5650'], ['slot_hover', '#d6ad52'], ['slot_sel', '#c4573f']]) sprite(nm, 112, 112, (a) => {
  a.raw(`<rect x="6" y="6" width="100" height="100" rx="6" fill="#140e0a" stroke="${INK}" stroke-width="3"/><rect x="10" y="10" width="92" height="92" rx="4" fill="none" stroke="${ring}" stroke-width="2.4"/>`);
  for (const [cx, cy, sx, sy] of [[6, 6, 1, 1], [106, 6, -1, 1], [6, 106, 1, -1], [106, 106, -1, -1]]) a.raw(`<path d="M${cx} ${cy} l${sx * 26} 0 l0 ${sy * 8} l${-sx * 18} 0 l0 ${sy * 18} l${-sx * 8} 0 Z" fill="url(#ironG)" stroke="${INK}" stroke-width="1.4"/>`);
});
// a ribbon tab for the Codex and other paged panels
for (const [nm, col] of [['tab', '#5a1a14'], ['tab_sel', '#a02a1c']]) sprite(nm, 150, 64, (a) => {
  a.raw(`<path d="M4 6 L140 6 L128 32 L140 58 L4 58 Z" fill="${col}" stroke="${INK}" stroke-width="2.4"/><path d="M8 12 L128 12" stroke="${G.gold}" stroke-width="1.6" opacity="0.7"/><path d="M8 52 L128 52" stroke="${G.gold}" stroke-width="1.6" opacity="0.7"/>`);
});
// a portrait frame: an oval of iron with a brass inner rim
sprite('portrait', 200, 240, (a) => {
  a.raw(`<ellipse cx="100" cy="120" rx="94" ry="114" fill="none" stroke="${INK}" stroke-width="16"/><ellipse cx="100" cy="120" rx="94" ry="114" fill="none" stroke="url(#ironG)" stroke-width="12"/><ellipse cx="100" cy="120" rx="84" ry="104" fill="none" stroke="url(#brassG)" stroke-width="3"/>`);
  for (const t of [0, 90, 180, 270]) { const r = t * Math.PI / 180; a.raw(a.rivet(100 + Math.cos(r) * 94, 120 + Math.sin(r) * 114, 4)); }
});

fs.writeFileSync(`${OUT}/layout.json`, JSON.stringify(LAYOUT, null, 1));
console.log('panels:', Object.keys(LAYOUT).join(' '));
