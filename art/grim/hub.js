// The Ostium: the hub chamber and its fifteen doors.
// Writes grim/hub/hub_bg.svg (1600x1000), grim/hub/door_<world>.svg (240x360) and grim/hub/door_chains.svg.
const { Art, G, INK, smooth, poly, blob } = require('../gr');
const { dressing, mix, dark, light } = require('./kit');
const { sig } = require('./sigils');
const fs = require('fs');
const f = n => +n.toFixed(1);
fs.mkdirSync('grim/hub', { recursive: true });

// ------------------------------------------------------------------ the chamber
// A rotunda seen from its floor: ribbed dome and oculus, a curved arcaded wall of niches, the great sealed Ostium
// at the back as the focal point, a floor of radial flags with a brass sigil ring round a misted well.
{
  const { masonry, voussoirs, leaf } = require('./surfaces');
  const W = 1600, H = 1000, a = new Art(W, H, 777), D = dressing(a), R = a.R;
  const stone = '#6a6052', WALL0 = 150, WALL1 = 640, CX = 800;
  a.raw(`<rect width="${W}" height="${H}" fill="#14100c"/>`);
  // the curved wall: masonry, darkened toward its ends where it turns away
  a.raw(masonry(a, R, 0, WALL0, W, WALL1, stone, { course: 30, block: 90, streaks: 18 }));
  a.raw(`<linearGradient id="curveL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.75"/><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="0.65" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></linearGradient><rect y="${WALL0}" width="${W}" height="${WALL1 - WALL0}" fill="url(#curveL)"/>`);
  // pilasters and niches spaced by angle around the curve (narrower toward the edges)
  const th = [-1.3, -1.02, -0.74, -0.46, 0.46, 0.74, 1.02, 1.3];
  const X = t => CX + Math.sin(t) * 860, Wd = t => Math.cos(t);
  for (let i = 0; i < th.length - 1; i++) {
    if (th[i] < 0 && th[i + 1] > 0) continue;
    const t = (th[i] + th[i + 1]) / 2, x = X(t), w = 150 * Wd(t), top = 300, bot = WALL1 - 20;
    a.shape({ d: `M${f(x - w / 2)} ${bot} L${f(x - w / 2)} ${top + w * 0.5} C${f(x - w / 2)} ${f(top - w * 0.1)} ${f(x + w / 2)} ${f(top - w * 0.1)} ${f(x + w / 2)} ${top + w * 0.5} L${f(x + w / 2)} ${bot} Z`, fill: '#0e0c0a', depth: 18 * Wd(t), hatch: 60, hl: false, ink: 1.6, wash: 0.5 });
    a.raw(voussoirs(R, x, top + w * 0.5, w / 2, w * 0.55, 16 * Wd(t), stone, 9));
    // a hooded saint in each niche, catching a little candlelight
    const sx = x, sb = bot - 10, sh = 230 * Wd(t), sw = 56 * Wd(t);
    a.shape({ d: smooth([[sx - sw, sb], [sx - sw * 1.1, sb - sh * 0.5], [sx - sw * 0.6, sb - sh * 0.9], [sx, sb - sh], [sx + sw * 0.55, sb - sh * 0.9], [sx + sw * 1.05, sb - sh * 0.5], [sx + sw, sb]], true, 0.6), fill: '#5a5448', depth: 20 * Wd(t), mottle: 0.3, hatch: 80,
      lines: [-0.4, 0, 0.4].map(k => ({ d: `M${f(sx + sw * k)} ${f(sb - sh * 0.8)} C${f(sx + sw * k - 4)} ${f(sb - sh * 0.5)} ${f(sx + sw * k + 4)} ${f(sb - sh * 0.3)} ${f(sx + sw * k)} ${f(sb)}`, w: 0.9, op: 0.7 })),
      decals: `<path d="M${f(sx - sw * 0.4)} ${f(sb - sh * 0.95)} C${f(sx - sw * 0.1)} ${f(sb - sh * 0.8)} ${f(sx + sw * 0.1)} ${f(sb - sh * 0.8)} ${f(sx + sw * 0.4)} ${f(sb - sh * 0.95)} L${f(sx + sw * 0.3)} ${f(sb - sh * 0.7)} L${f(sx - sw * 0.3)} ${f(sb - sh * 0.7)} Z" fill="#0a0806"/>` + a.stain(sx, sb - sh * 0.3, sw * 0.6, G.black, 0.5) });
    if (i % 2 === 0) for (let c = 0; c < 4; c++) { const cxx = sx - sw * 0.8 + c * sw * 0.5, ch = 14 + R() * 18; a.raw(`<rect x="${f(cxx - 3)}" y="${f(sb - ch)}" width="6" height="${f(ch)}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.8"/>` + D.flame(cxx, sb - ch, 12, 3.4) + a.glow(cxx, sb - ch - 6, 40, '#ffb060', 0.35)); }
  }
  for (const t of th) { const x = X(t), w = 54 * Wd(t); a.shape({ d: `M${f(x - w / 2)} ${WALL1} L${f(x - w / 2)} ${WALL0} L${f(x + w / 2)} ${WALL0} L${f(x + w / 2)} ${WALL1} Z`, fill: '#7a7060', depth: w * 0.45, mottle: 0.3, hatch: 80, hlOp: 0.15, lines: [`M${f(x - w * 0.2)} ${WALL0} L${f(x - w * 0.2)} ${WALL1}`, `M${f(x + w * 0.2)} ${WALL0} L${f(x + w * 0.2)} ${WALL1}`], decals: a.stain(x, WALL1 - 60, w, G.black, 0.5) }); }
  // the great Ostium: three receding orders of arch around an iron-bound door, its seam leaking cold light
  const dw = 150, dtop = 230, dbot = WALL1;
  a.raw(masonry(a, R, CX - 280, WALL0, CX + 280, WALL1, '#7a705e', { course: 34, block: 70, streaks: 6 }));
  for (const [k, col] of [[120, '#6a6052'], [80, '#7a705e'], [40, '#8a806c']]) {
    a.shape({ d: `M${CX - dw - k} ${dbot} L${CX - dw - k} ${dtop + dw * 0.6} C${CX - dw - k} ${dtop - k * 0.9 - 40} ${CX + dw + k} ${dtop - k * 0.9 - 40} ${CX + dw + k} ${dtop + dw * 0.6} L${CX + dw + k} ${dbot} Z`, fill: col, depth: 24, mottle: 0.3, hatch: 70, ink: 1.6,
      lines: Array.from({ length: 13 }, (_, i) => { const tt = Math.PI * (i + 0.5) / 13; return `M${f(CX - Math.cos(tt) * (dw + k - 2))} ${f(dtop + dw * 0.6 - Math.sin(tt) * (dw * 0.6 + k * 0.9 + 38))} L${f(CX - Math.cos(tt) * (dw + k - 38))} ${f(dtop + dw * 0.6 - Math.sin(tt) * (dw * 0.6 + k * 0.9 + 4))}`; }) });
  }
  const dp = [[CX - dw, dbot], [CX - dw, dtop + dw * 0.6], [CX - dw * 0.7, dtop - 10], [CX, dtop - 34], [CX + dw * 0.7, dtop - 10], [CX + dw, dtop + dw * 0.6], [CX + dw, dbot]];
  a.raw(leaf(a, R, [[CX - dw, dbot], [CX - dw, dtop + dw * 0.6], [CX - dw * 0.7, dtop - 10], [CX - 4, dtop - 34], [CX - 4, dbot]], CX - dw, CX - 4, [320, 420, 520, 600], '#3a2c20'));
  a.raw(leaf(a, R, [[CX + 4, dbot], [CX + 4, dtop - 34], [CX + dw * 0.7, dtop - 10], [CX + dw, dtop + dw * 0.6], [CX + dw, dbot]], CX + 4, CX + dw, [320, 420, 520, 600], '#3a2c20'));
  a.raw(a.glow(CX, 440, 220, '#c8d8e0', 0.28) + `<path d="M${CX} ${dtop - 30} L${CX} ${dbot}" stroke="#e8f0f4" stroke-width="3" opacity="0.85"/><path d="M${CX} ${dtop - 30} L${CX} ${dbot}" stroke="#c8d8e0" stroke-width="14" opacity="0.18"/>`);
  a.raw(D.chain(CX - dw + 10, 380, CX + dw - 10, 400, 26, '#4a4640') + D.chain(CX - dw + 10, 470, CX + dw - 10, 450, 26, '#4a4640'));
  a.shape({ d: smooth([[CX - 26, 406], [CX + 26, 406], [CX + 30, 456], [CX - 30, 456]], true, 0.3), fill: '#5a564e', depth: 10, ink: 1.6, mottle: 0.4, after: `<circle cx="${CX}" cy="${428}" r="6" fill="${G.black}"/><path d="M${CX} 432 L${CX} 446" stroke="${G.black}" stroke-width="3.4"/>` });
  a.raw(['fire', 'frost', 'lightning', 'water', 'toxin', 'void'].map((el, i) => { const tt = Math.PI * (i + 0.5) / 6; return sig(el, CX - Math.cos(tt) * (dw + 100), dtop + dw * 0.6 - Math.sin(tt) * (dw * 0.6 + 140), 18, '#c8b070', 2.4); }).join(''));
  // the dome: ribs converging on a bright oculus; a shaft of grey light falling on the well
  a.raw(`<rect width="${W}" height="${WALL0 + 4}" fill="#1a1612"/>`);
  for (let i = 0; i <= 14; i++) { const t = i / 14, x = t * W; a.raw(`<path d="M${f(x)} ${WALL0} Q${f(CX + (x - CX) * 0.6)} ${f(WALL0 * 0.45)} ${f(CX + (x - CX) * 0.12)} 0" stroke="${INK}" stroke-width="16" fill="none"/><path d="M${f(x)} ${WALL0} Q${f(CX + (x - CX) * 0.6)} ${f(WALL0 * 0.45)} ${f(CX + (x - CX) * 0.12)} 0" stroke="#5a5244" stroke-width="10" fill="none"/>`); }
  a.raw(`<rect y="${WALL0 - 14}" width="${W}" height="20" fill="#5a5044" stroke="${INK}" stroke-width="1.6"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M${i * 40 + 10} ${WALL0 - 14} l0 20" stroke="${INK}" stroke-width="1"/>`).join(''));
  a.raw(`<ellipse cx="${CX}" cy="0" rx="150" ry="30" fill="#d8d4c4" opacity="0.7"/>` + `<path d="M${CX - 140} 0 L${CX + 140} 0 L${CX + 260} 860 L${CX - 260} 860 Z" fill="#e8e4d4" opacity="0.06"/><path d="M${CX - 80} 0 L${CX + 80} 0 L${CX + 140} 860 L${CX - 140} 860 Z" fill="#e8e4d4" opacity="0.07"/>`);
  // floor: radial flagstones in rings, a brass ring of sigils, the well
  a.raw(`<rect x="0" y="${WALL1}" width="${W}" height="${H - WALL1}" fill="#2e2822"/>`);
  const FY = 830;
  for (let ring = 0; ring < 7; ring++) {
    const r0 = 150 + ring * 110, r1 = r0 + 110, n = 12 + ring * 6;
    for (let i = 0; i < n; i++) {
      const t0 = i / n * Math.PI * 2 + ring * 0.1, t1 = (i + 1) / n * Math.PI * 2 + ring * 0.1;
      const P = (t, r) => [CX + Math.cos(t) * r, FY + Math.sin(t) * r * 0.25];
      const pts = [P(t0, r0), P(t1, r0), P(t1, r1), P(t0, r1)];
      if (Math.min(...pts.map(p => p[1])) < WALL1 - 4) continue;
      a.raw(`<path d="${poly(pts)}" fill="${mix('#5a5246', R() < 0.5 ? '#c8bca0' : '#0c0a08', R() * 0.25)}" stroke="${INK}" stroke-width="1.1"/>` + (R() < 0.15 ? `<path d="M${f((pts[0][0] + pts[2][0]) / 2)} ${f((pts[0][1] + pts[2][1]) / 2)} l14 3 l8 -4" stroke="${INK}" stroke-width="0.8" fill="none"/>` : ''));
    }
  }
  a.raw(`<ellipse cx="${CX}" cy="${FY}" rx="440" ry="110" fill="none" stroke="${INK}" stroke-width="9"/><ellipse cx="${CX}" cy="${FY}" rx="440" ry="110" fill="none" stroke="#a8873e" stroke-width="5"/>`);
  ['fire', 'frost', 'lightning', 'water', 'toxin', 'void'].forEach((el, i) => { const t = i / 6 * Math.PI * 2 + 0.26, x = CX + Math.cos(t) * 440, y = FY + Math.sin(t) * 110; a.raw(`<g transform="translate(${f(x)} ${f(y)}) scale(1 0.32) translate(${f(-x)} ${f(-y)})"><circle cx="${f(x)}" cy="${f(y)}" r="40" fill="#3a3228" stroke="${INK}" stroke-width="3"/>${sig(el, x, y, 32, '#c8a653', 3)}</g>`); });
  a.raw(`<ellipse cx="${CX}" cy="${FY}" rx="160" ry="44" fill="#4a4034" stroke="${INK}" stroke-width="3"/><ellipse cx="${CX}" cy="${FY + 2}" rx="134" ry="34" fill="#050403"/>` + a.glow(CX, FY - 30, 200, '#c8d4d8', 0.2) + Array.from({ length: 6 }, () => `<g filter="url(#rough)"><path d="M${f(CX - 100 + R() * 200)} ${FY} C${f(CX - 80 + R() * 160)} ${FY - 60} ${f(CX - 100 + R() * 200)} ${FY - 120} ${f(CX - 60 + R() * 120)} ${FY - 180}" stroke="#d8dcd8" stroke-width="${f(14 + R() * 20)}" opacity="0.07" fill="none"/></g>`).join(''));
  a.raw(`<ellipse cx="${CX}" cy="${FY - 40}" rx="300" ry="70" fill="#e8e4d4" opacity="0.05"/>`);
  // candles round the ring, bones and offerings at the edges
  for (const [x, y] of [[300, 760], [1300, 760], [520, 940], [1080, 940], [760, 700], [860, 700]]) for (let i = 0; i < 5; i++) { const cx = x - 24 + i * 12, h = 16 + R() * 30; a.raw(a.drip(cx, y - h, 10, 1.4, '#d8ccb0') + `<rect x="${cx - 4}" y="${f(y - h)}" width="8" height="${f(h)}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.8"/>` + D.flame(cx, y - h, 16, 4) + a.glow(cx, y - h - 8, 60, '#ffb060', 0.25)); }
  for (const [x, y] of [[90, 980], [1510, 980]]) for (let i = 0; i < 18; i++) { const bx = x + (R() - 0.5) * 220, by = y - R() * 70; a.raw(i % 3 ? `<path d="M${f(bx - 16)} ${f(by)} L${f(bx + 16)} ${f(by - 5)}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${f(bx - 16)} ${f(by)} L${f(bx + 16)} ${f(by - 5)}" stroke="${G.bone}" stroke-width="4.6" stroke-linecap="round"/>` : `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="12" ry="11" fill="${G.bone}" stroke="${INK}" stroke-width="0.9"/><circle cx="${f(bx - 4)}" cy="${f(by - 1)}" r="2.8" fill="${G.black}"/><circle cx="${f(bx + 4)}" cy="${f(by - 1)}" r="2.8" fill="${G.black}"/>`); }
  // foreground framing pillars, very dark
  for (const x of [-20, W + 20]) a.shape({ d: `M${x - 70} ${H} L${x - 60} 0 L${x + 60} 0 L${x + 70} ${H} Z`, fill: '#0c0a08', depth: 30, hatch: 70, hl: false, ink: 1.4 });
  a.raw(Array.from({ length: 160 }, () => `<circle cx="${f(R() * W)}" cy="${f(R() * H)}" r="${f(0.6 + R() * 1.4)}" fill="#e8dcc0" opacity="${f(0.1 + R() * 0.25)}"/>`).join(''));
  a.raw(`<radialGradient id="vg" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.65"/></radialGradient><rect width="${W}" height="${H}" fill="url(#vg)"/>`);
  fs.writeFileSync('grim/hub/hub_bg.svg', a.svg());
}

// ------------------------------------------------------------------ the doors
const DW = 240, DH = 360;
const DOORS = {
  drowned: { frame: '#5a6a62', arch: 'round', sky: ['#2a4a48', '#0e1a1a'], els: ['water', 'void'], glimpse: (a, D, R) => a.raw(`<path d="M70 300 L90 160 L100 120 L110 160 L130 300 Z M140 300 L150 200 L160 300 Z" fill="#0e1616" opacity="0.9"/>` + Array.from({ length: 20 }, () => `<circle cx="${f(50 + R() * 140)}" cy="${f(80 + R() * 220)}" r="${f(1 + R() * 3)}" fill="none" stroke="#a8d0c8" stroke-width="0.8" opacity="0.7"/>`).join('')), trim: (a, D) => a.raw(D.weed(70, 60, 80) + D.weed(170, 60, 60)) },
  rime: { frame: '#2e2a2a', arch: 'pointed', sky: ['#9ab8c8', '#3a4a58'], els: ['fire', 'frost'], glimpse: (a, D) => a.raw(`<path d="M40 300 L80 150 L110 200 L150 120 L200 300 Z" fill="#c8dce8" stroke="${INK}" stroke-width="1"/>` + a.glow(120, 280, 80, '#ff7a2a', 0.8) + D.veins(80, 300, 160, 230, '#ff7a2a', 2.6)), trim: (a, D) => a.raw(D.icicles(50, 190, 64, 9, 30)) },
  foundry: { frame: '#8a6a3a', arch: 'square', sky: ['#4a4038', '#1a1410'], els: ['fire', 'lightning'], glimpse: (a, D) => a.raw(a.glow(120, 260, 90, '#ff8a2a', 0.8) + `<path d="M60 300 L70 180 L100 180 L110 300 Z M140 300 L150 160 L180 160 L190 300 Z" fill="#1a1410"/>` + D.arc(150, 80, 110, 200, 2)), trim: (a) => a.raw([60, 120, 180].map(x => a.rivet(x, 62, 3.4)).join('')) },
  baths: { frame: '#c8bca8', arch: 'round', sky: ['#8a5a4a', '#3a2420'], els: ['fire', 'water'], glimpse: (a, D, R) => a.raw(`<rect x="40" y="250" width="160" height="60" fill="#6a8a88"/>` + [70, 120, 170].map(x => `<rect x="${x - 8}" y="120" width="16" height="130" fill="#d8ccb8" stroke="${INK}" stroke-width="1"/>`).join('') + Array.from({ length: 8 }, () => `<path d="${blob(50 + R() * 140, 140 + R() * 120, 20 + R() * 20, R, 8, 0.3)}" fill="#f0e8e0" opacity="0.18"/>`).join('')), trim: () => {} },
  pits: { frame: '#5a4630', arch: 'square', sky: ['#6a6030', '#1e1a10'], els: ['fire', 'toxin'], glimpse: (a, D, R) => a.raw(`<path d="M60 310 L70 120 M180 310 L170 120 M60 130 L180 130" stroke="#2a2014" stroke-width="10"/>` + a.glow(120, 150, 40, '#e8c060', 0.8) + Array.from({ length: 6 }, () => `<path d="${blob(60 + R() * 120, 180 + R() * 120, 24 + R() * 20, R, 8, 0.3)}" fill="#c8c060" opacity="0.15"/>`).join('')), trim: (a) => a.raw(`<path d="M40 62 L200 62" stroke="${INK}" stroke-width="12"/><path d="M40 62 L200 62" stroke="#6a5438" stroke-width="8"/>`) },
  pyre: { frame: '#2a2428', arch: 'pointed', sky: ['#3a2a34', '#0e0a0e'], els: ['fire', 'void'], glimpse: (a, D) => a.raw(a.glow(120, 240, 100, '#a47ae0', 0.5) + `<path d="M120 310 L120 170" stroke="#1a1214" stroke-width="8"/>` + D.flame(120, 300, 110, 40).replace(/#8a2a12/g, '#1a1020').replace(/#e0621e/g, '#4a2a6a').replace(/#ffc860/g, '#b89ae8').replace(/#c8481c/g, '#1a1020').replace(/#f08a30/g, '#3a2050').replace(/#ffd27a/g, '#a47ae0').replace(/#ff7a2a/g, '#6a3aa0')), trim: (a, D) => a.raw(D.chain(50, 70, 190, 70, 14, '#3a3430')) },
  spire: { frame: '#8a98a4', arch: 'pointed', sky: ['#2a3a52', '#0e1420'], els: ['frost', 'lightning'], glimpse: (a, D) => a.raw(`<circle cx="120" cy="170" r="50" fill="#d8dce0" stroke="${INK}" stroke-width="2"/><path d="M120 170 L120 135 M120 170 L146 178" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` + [0, 1, 2].map(i => `<path d="M40 ${100 + i * 16} C90 ${80 + i * 20} 150 ${120 + i * 10} 200 ${96 + i * 16}" stroke="${['#7ad8a0', '#8aa8e0', '#c8a0e0'][i]}" stroke-width="8" opacity="0.3" fill="none"/>`).join('')), trim: (a, D) => a.raw(D.icicles(60, 180, 64, 6, 22)) },
  fleet: { frame: '#5a4a3a', arch: 'square', sky: ['#a8b8c0', '#4a5a64'], els: ['frost', 'water'], glimpse: (a, D) => a.raw(`<rect x="40" y="250" width="160" height="60" fill="#e0ecf0"/><path d="M60 260 C80 230 150 230 180 255 L175 262 L65 262 Z" fill="#3a3028"/><path d="M120 240 L120 110 M95 140 L145 140" stroke="#2a2420" stroke-width="5"/>` + D.icicles(95, 145, 142, 5, 16)), trim: (a, D) => a.raw(D.icicles(40, 200, 64, 10, 26)) },
  barrow: { frame: '#6a6a5a', arch: 'dolmen', sky: ['#4a5448', '#1a201a'], els: ['frost', 'toxin'], glimpse: (a) => a.raw(`<path d="M40 300 C70 230 170 230 200 300 Z" fill="#c8ccc0" stroke="${INK}" stroke-width="1.4"/><rect x="108" y="262" width="24" height="38" fill="#0a0a0a"/>` + a.glow(120, 280, 40, '#b4d860', 0.7)), trim: () => {} },
  silence: { frame: '#d8d0c0', arch: 'round', sky: ['#24243a', '#08080e'], els: ['frost', 'void'], glimpse: (a, D, R) => a.raw(a.glow(120, 150, 90, '#a47ae0', 0.5) + `<circle cx="120" cy="150" r="30" fill="#04040a" stroke="#c8b0f0" stroke-width="1.6"/><path d="M40 300 L90 250 L130 270 L200 230 L200 310 L40 310 Z" fill="#d8dce4"/>` + Array.from({ length: 20 }, () => `<circle cx="${f(40 + R() * 160)}" cy="${f(80 + R() * 140)}" r="0.9" fill="#fff"/>`).join('')), trim: (a) => a.raw([60, 100, 140, 180].map(x => `<path d="M${x} 58 l4 14 l4 -14" fill="${G.bone}" stroke="${INK}" stroke-width="0.8"/>`).join('')) },
  coast: { frame: '#6a5a48', arch: 'round', sky: ['#3a4448', '#14181a'], els: ['lightning', 'water'], glimpse: (a, D) => a.raw(`<rect x="40" y="250" width="160" height="60" fill="#2a3a40"/><path d="M160 250 L164 160 L176 160 L180 250 Z" fill="#c8c0b0"/><rect x="162" y="150" width="16" height="12" fill="#ffe680"/>` + a.glow(170, 156, 50, '#ffe680', 0.7) + D.arc(70, 90, 90, 220, 2)), trim: (a) => a.raw(`<path d="M40 70 C80 90 160 90 200 70" stroke="${INK}" stroke-width="5" fill="none"/><path d="M40 70 C80 90 160 90 200 70" stroke="#a8946a" stroke-width="3" fill="none" stroke-dasharray="4 2"/>`) },
  hive: { frame: '#8a6a2a', arch: 'pointed', sky: ['#6a5a28', '#1e1a0c'], els: ['lightning', 'toxin'], glimpse: (a, D) => a.raw([[80, 180], [130, 140], [180, 200]].map(([x, h]) => `<path d="M${x - 20} 310 C${x - 26} 250 ${x - 6} ${310 - h} ${x} ${300 - h} C${x + 6} ${310 - h} ${x + 26} 250 ${x + 20} 310 Z" fill="#4a3a1a" stroke="${INK}" stroke-width="1"/>`).join('') + D.arc(110, 80, 140, 170, 1.6)), trim: (a) => a.raw(Array.from({ length: 6 }, (_, i) => `<path d="${poly(Array.from({ length: 6 }, (_, k) => [50 + i * 28 + Math.cos(k / 6 * 6.28) * 12, 64 + Math.sin(k / 6 * 6.28) * 10]))}" fill="#c89a40" stroke="${INK}" stroke-width="1"/>`).join('')) },
  sky: { frame: '#d8d0c0', arch: 'broken', sky: ['#3a3a58', '#14142a'], els: ['lightning', 'void'], glimpse: (a, D) => a.raw(`<path d="M50 200 L110 200 L90 240 L70 240 Z M130 150 L200 150 L180 190 L150 200 Z" fill="#8a8478" stroke="${INK}" stroke-width="1"/>` + a.glow(120, 110, 60, '#a47ae0', 0.5) + `<path d="M115 70 L125 100 L110 130 L128 160" stroke="#c8b0f0" stroke-width="3" fill="none"/>` + D.arc(60, 90, 80, 160, 1.6)), trim: () => {} },
  mire: { frame: '#3a3024', arch: 'roots', sky: ['#4a5038', '#141810'], els: ['toxin', 'water'], glimpse: (a) => a.raw(`<rect x="40" y="260" width="160" height="50" fill="#3a4a30"/><path d="M90 260 L90 220 M150 260 L150 220 M80 220 L160 220 L150 180 L90 180 Z" stroke="#1a140c" stroke-width="4" fill="#3a3020"/><rect x="112" y="194" width="16" height="16" fill="#e8c060"/>` + a.glow(120, 200, 40, '#e8c060', 0.6) + `<ellipse cx="120" cy="250" rx="90" ry="14" fill="#c8d0b0" opacity="0.15"/>`), trim: () => {} },
  garden: { frame: '#3a4430', arch: 'round', sky: ['#3a2a40', '#100a14'], els: ['toxin', 'void'], glimpse: (a, D) => a.raw(`<path d="M110 310 L114 200 L126 200 L130 310 Z" fill="#c8b8a0"/><path d="M60 205 C60 150 180 150 180 205 C150 195 90 195 60 205 Z" fill="#7a5a7a" stroke="${INK}" stroke-width="1.4"/>` + a.glow(120, 190, 70, '#c8a0e0', 0.5) + D.spores(120, 230, 70, 20)), trim: (a, D) => a.raw(D.fungus(60, 70, 3, 0.8, '#a88ab8') + D.fungus(180, 70, 3, 0.8, '#a88ab8')) },
};
function archPath(kind, x0, y0, x1, y1) {
  const cx = (x0 + x1) / 2, w = x1 - x0;
  if (kind === 'pointed') return `M${x0} ${y1} L${x0} ${y0 + w * 0.6} C${x0} ${y0 + w * 0.2} ${cx - w * 0.2} ${y0} ${cx} ${y0 - 10} C${cx + w * 0.2} ${y0} ${x1} ${y0 + w * 0.2} ${x1} ${y0 + w * 0.6} L${x1} ${y1} Z`;
  if (kind === 'square' || kind === 'dolmen') return `M${x0} ${y1} L${x0} ${y0} L${x1} ${y0} L${x1} ${y1} Z`;
  if (kind === 'broken') return `M${x0} ${y1} L${x0} ${y0 + w * 0.5} C${x0} ${y0} ${x1 - w * 0.3} ${y0 - 6} ${x1 - w * 0.25} ${y0 + 4} L${x1 - 20} ${y0 + 30} L${x1} ${y0 + 20} L${x1} ${y1} Z`;
  return `M${x0} ${y1} L${x0} ${y0 + w * 0.5} C${x0} ${y0 - 4} ${x1} ${y0 - 4} ${x1} ${y0 + w * 0.5} L${x1} ${y1} Z`;
}
for (const [k, d] of Object.entries(DOORS)) {
  let seed = 0; for (const c of k) seed = seed * 31 + c.charCodeAt(0);
  const a = new Art(DW, DH, seed % 9999 + 1), D = dressing(a), R = a.R;
  const op = [44, 70, 196, 330];
  const ap = archPath(d.arch, ...op);
  // the frame mass, then the opening cut into it
  const framePath = d.arch === 'dolmen' ? `M14 ${DH} L24 46 L216 46 L226 ${DH} Z` : `M10 ${DH} L10 40 C10 10 230 10 230 40 L230 ${DH} Z`;
  a.raw(`<clipPath id="fr${k}"><path d="${framePath}"/></clipPath><g clip-path="url(#fr${k})">` + require('./surfaces').masonry(a, R, 6, 0, 234, DH, d.frame, { course: 22, block: 40, streaks: 4, ink: 0.8 }) + `</g>`);
  a.shape({ d: framePath, fill: 'rgba(0,0,0,0)', depth: 26, mottle: 0, hatch: 70, hlOp: 0.15, decals: a.stain(60, 300, 24, G.black, 0.5) + a.stain(180, 120, 18, G.black, 0.4) + (d.arch === 'roots' ? Array.from({ length: 8 }, () => `<path d="M${f(10 + R() * 220)} 10 C${f(R() * 240)} 100 ${f(R() * 240)} 200 ${f(10 + R() * 220)} ${DH}" stroke="#1a140c" stroke-width="${f(4 + R() * 6)}" fill="none"/>`).join('') : '') });
  if (d.arch === 'dolmen') a.shape({ d: 'M4 20 L236 26 L232 60 L8 56 Z', fill: light(d.frame, 0.1), depth: 12, mottle: 0.8, hatch: 70 });
  const id = 'clip' + k;
  a.raw(`<clipPath id="${id}"><path d="${ap}"/></clipPath><g clip-path="url(#${id})"><linearGradient id="sky${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d.sky[0]}"/><stop offset="1" stop-color="${d.sky[1]}"/></linearGradient><rect x="0" y="0" width="${DW}" height="${DH}" fill="url(#sky${k})"/>`);
  d.glimpse(a, D, R);
  a.raw(`<path d="${ap}" fill="${a.hatchPat(30, 3, 0.5)}" opacity="0.25"/></g>`);
  // a half-open door leaf hinged on the left: planks, iron straps, studs, a ring pull
  a.raw(require('./surfaces').leaf(a, R, [[op[0], op[3]], [op[0], op[1] + 40], [op[0] + 46, op[1] + 56], [op[0] + 46, op[3] - 6]], op[0], op[0] + 46, [op[1] + 90, op[3] - 70], d.arch === 'square' ? '#4a3a28' : '#3a2e22') + `<circle cx="${op[0] + 36}" cy="${(op[1] + op[3]) / 2 + 20}" r="7" fill="none" stroke="${INK}" stroke-width="3.4"/><circle cx="${op[0] + 36}" cy="${(op[1] + op[3]) / 2 + 20}" r="7" fill="none" stroke="#6a6660" stroke-width="1.8"/>`);
  a.raw(`<path d="${ap}" fill="none" stroke="${INK}" stroke-width="3"/>`);
  // keystone plaque with the pair's sigils
  a.shape({ d: smooth([[70, 6], [170, 6], [176, 40], [64, 40]], true, 0.3), fill: light(d.frame, 0.2), depth: 6, ink: 1.3, mottle: 0.5 });
  a.raw(sig(d.els[0], 102, 23, 14, dark(require('./sigils').COL[d.els[0]], 0.1), 2.6) + sig(d.els[1], 138, 23, 14, dark(require('./sigils').COL[d.els[1]], 0.1), 2.6));
  d.trim(a, D, R);
  // threshold step
  a.shape({ d: `M0 ${DH} L0 ${DH - 24} L${DW} ${DH - 24} L${DW} ${DH} Z`, fill: '#5a5044', depth: 8, mottle: 0.6, hatch: 80 });
  fs.writeFileSync(`grim/hub/door_${k}.svg`, a.svg());
}
// chains and lock over a sealed door
{
  const a = new Art(DW, DH, 9), D = dressing(a);
  a.raw(`<rect width="${DW}" height="${DH}" fill="#000" opacity="0.45"/>` + D.chain(20, 90, 220, 300, 22, '#3a3632') + D.chain(220, 90, 20, 300, 22, '#3a3632'));
  a.shape({ d: smooth([[100, 180], [140, 180], [146, 230], [94, 230]], true, 0.3), fill: '#4a4640', depth: 10, ink: 1.6, mottle: 0.6, decals: `<circle cx="120" cy="200" r="5" fill="${G.black}"/><path d="M120 204 L120 216" stroke="${G.black}" stroke-width="3"/>` + a.stain(110, 220, 8, G.rust, 0.7) });
  a.raw(`<path d="M106 182 C106 150 134 150 134 182" stroke="${INK}" stroke-width="8" fill="none"/><path d="M106 182 C106 150 134 150 134 182" stroke="#6a6660" stroke-width="5" fill="none"/>`);
  fs.writeFileSync('grim/hub/door_chains.svg', a.svg());
}
console.log('hub', Object.keys(DOORS).length, 'doors');
