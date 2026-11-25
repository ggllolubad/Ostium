// Battle rooms for the door worlds. Three layers per room at 1480x480 (exported at 2x):
//   far (opaque) backdrop + floor, mid (behind fighters), fore (framing, over fighters).
// Usage: node grim/bg_worlds.js [room ...]   (no args = all)
const { Art, G, INK, smooth, poly, blob } = require('../gr');
const fs = require('fs');
const W = 1480, H = 480, HOR = 300;
const f = n => +n.toFixed(1);
fs.mkdirSync('grim/bg', { recursive: true });
const { dressing, mix, dark, light } = require('./kit');

// room recipes: sky (interior|exterior|cave), far features, floor, mid props, fore hangers, particles
const ROOMS = {
  rime_glacier: { tint: '#2a3a48', light: '#d8eef8', sky: 'exterior', far: ['peaks_ice', 'vent_glow'], floor: 'ice', mid: ['crystals', 'basalt'], fore: 'icicles', fx: 'snow', glow: '#ff7a2a' },
  rime_hall: { tint: '#3a3434', light: '#ffc890', sky: 'cave', far: ['magma_falls', 'arcade'], floor: 'basalt', mid: ['basalt', 'braziers'], fore: 'icicles', fx: 'embers', glow: '#ff7a2a' },
  rime_crevasse: { tint: '#243040', light: '#bfe0f0', sky: 'cave', far: ['ice_walls', 'steam'], floor: 'ice', mid: ['crystals', 'bones'], fore: 'icicles', fx: 'steam', glow: '#ff9a4a' },
  foundry_floor: { tint: '#3a2a20', light: '#ffd08a', sky: 'interior', far: ['furnaces', 'chains_far'], floor: 'iron', mid: ['anvils', 'pillars_iron'], fore: 'chains', fx: 'sparks', glow: '#ff8a2a' },
  foundry_roof: { tint: '#2a2e3a', light: '#f4ecb0', sky: 'exterior', far: ['stormclouds', 'chimneys', 'lightning'], floor: 'iron', mid: ['pillars_iron', 'coils'], fore: 'chains', fx: 'sparks', glow: '#ffe680' },
  foundry_mould: { tint: '#3a2418', light: '#ffb060', sky: 'interior', far: ['molten_channels', 'arcade'], floor: 'ash', mid: ['anvils', 'statues'], fore: 'chains', fx: 'embers', glow: '#ff7a2a' },
  baths_pool: { tint: '#4a3a34', light: '#f0d8c0', sky: 'interior', far: ['colonnade', 'steam'], floor: 'tile_pool', mid: ['columns', 'urns'], fore: 'drapes', fx: 'steam', glow: '#ff9a6a' },
  baths_furnace: { tint: '#3a2420', light: '#ffb080', sky: 'interior', far: ['furnaces', 'arcade'], floor: 'tile', mid: ['cauldrons', 'columns'], fore: 'drapes', fx: 'steam', glow: '#ff6a3a' },
  baths_cistern: { tint: '#2a3434', light: '#c8e0d8', sky: 'cave', far: ['arcade', 'steam'], floor: 'water', mid: ['columns', 'bones'], fore: 'chains', fx: 'steam', glow: '#ff9a6a' },
  pits_shaft: { tint: '#3a3420', light: '#f0e0a0', sky: 'cave', far: ['mine_beams', 'gas'], floor: 'rock', mid: ['carts', 'beams'], fore: 'roots', fx: 'spores', glow: '#d8c040' },
  pits_vent: { tint: '#40301c', light: '#ffd070', sky: 'cave', far: ['magma_falls', 'gas'], floor: 'ash', mid: ['crystals_sulphur', 'bones'], fore: 'roots', fx: 'embers', glow: '#ff8a2a' },
  pits_chapel: { tint: '#34301c', light: '#f0e0a0', sky: 'interior', far: ['arcade', 'cages'], floor: 'rock', mid: ['braziers', 'beams'], fore: 'chains', fx: 'spores', glow: '#d8c040' },
  pyre_nave: { tint: '#1e1a20', light: '#c8a8e8', sky: 'interior', far: ['rose', 'arcade', 'black_fire'], floor: 'stone', mid: ['pillars', 'candles'], fore: 'chains', fx: 'ash', glow: '#a47ae0' },
  pyre_stake: { tint: '#241c20', light: '#e8b8a0', sky: 'exterior', far: ['stakes', 'smoke'], floor: 'ash', mid: ['stakes_near', 'bones'], fore: 'chains', fx: 'embers', glow: '#ff7a2a' },
  pyre_crypt: { tint: '#1a1820', light: '#b8a0d8', sky: 'interior', far: ['niches', 'black_fire'], floor: 'stone', mid: ['candles', 'statues'], fore: 'chains', fx: 'ash', glow: '#a47ae0' },
  spire_orrery: { tint: '#24303e', light: '#e8f0f8', sky: 'interior', far: ['orrery', 'windows_tall'], floor: 'ice', mid: ['gears', 'pillars'], fore: 'icicles', fx: 'snow', glow: '#ffe680' },
  spire_stair: { tint: '#2a3442', light: '#d8e8f4', sky: 'interior', far: ['clockface', 'arcade'], floor: 'stone', mid: ['gears', 'statues'], fore: 'chains', fx: 'snow', glow: '#ffe680' },
  spire_top: { tint: '#1e2838', light: '#f4ecb0', sky: 'exterior', far: ['stormclouds', 'lightning', 'peaks_ice'], floor: 'ice', mid: ['coils', 'crystals'], fore: 'icicles', fx: 'snow', glow: '#ffe680' },
  fleet_deck: { tint: '#2c3840', light: '#e0eef4', sky: 'exterior', far: ['peaks_ice', 'frozen_ships'], floor: 'deck', mid: ['masts', 'barrels'], fore: 'ropes', fx: 'snow', glow: '#bfe6ff' },
  fleet_hold: { tint: '#2a2a28', light: '#d8c8a0', sky: 'interior', far: ['hull_ribs', 'lanterns'], floor: 'deck', mid: ['barrels', 'whale_bones'], fore: 'ropes', fx: 'snow', glow: '#ffc070' },
  fleet_ice: { tint: '#30404c', light: '#e8f4f8', sky: 'exterior', far: ['frozen_ships', 'aurora'], floor: 'ice', mid: ['whale_bones', 'crystals'], fore: 'icicles', fx: 'snow', glow: '#bfe6ff' },
  barrow_mound: { tint: '#2a302c', light: '#d8e0c8', sky: 'exterior', far: ['mounds', 'dead_trees'], floor: 'snow', mid: ['standing_stones', 'bones'], fore: 'roots', fx: 'snow', glow: '#b4d860' },
  barrow_tomb: { tint: '#242820', light: '#c8d0a8', sky: 'interior', far: ['niches', 'arcade'], floor: 'stone', mid: ['sarcophagi', 'candles'], fore: 'roots', fx: 'spores', glow: '#b4d860' },
  barrow_hall: { tint: '#2a2c28', light: '#e0d8c0', sky: 'interior', far: ['longhall', 'shields_wall'], floor: 'stone', mid: ['pillars_wood', 'braziers'], fore: 'chains', fx: 'snow', glow: '#b4d860' },
  silence_tundra: { tint: '#1c1c28', light: '#e8e8f4', sky: 'exterior', far: ['black_star', 'peaks_ice'], floor: 'snow', mid: ['standing_stones', 'crystals'], fore: 'icicles', fx: 'snow', glow: '#a47ae0' },
  silence_shrine: { tint: '#202030', light: '#d8d0f0', sky: 'exterior', far: ['black_star', 'statues_far'], floor: 'ice', mid: ['statues', 'crystals'], fore: 'icicles', fx: 'motes', glow: '#a47ae0' },
  silence_rift: { tint: '#16141e', light: '#c8b8f0', sky: 'cave', far: ['rift', 'ice_walls'], floor: 'ice', mid: ['crystals', 'bones'], fore: 'icicles', fx: 'motes', glow: '#a47ae0' },
  coast_cliffs: { tint: '#2a3434', light: '#e8f0d8', sky: 'exterior', far: ['stormclouds', 'sea', 'lighthouse', 'lightning'], floor: 'rock', mid: ['wreck', 'rocks'], fore: 'ropes', fx: 'rain', glow: '#ffe680' },
  coast_cove: { tint: '#24302e', light: '#d8e8d8', sky: 'cave', far: ['sea', 'wreck_far'], floor: 'water', mid: ['wreck', 'rocks', 'whale_bones'], fore: 'kelp', fx: 'rain', glow: '#7fb6e0' },
  coast_light: { tint: '#2a2c30', light: '#f4ecb0', sky: 'interior', far: ['lantern_room', 'windows_tall'], floor: 'stone', mid: ['coils', 'barrels'], fore: 'ropes', fx: 'rain', glow: '#ffe680' },
  hive_spires: { tint: '#3a3420', light: '#f0e0a0', sky: 'exterior', far: ['hive_towers', 'stormclouds', 'lightning'], floor: 'rock', mid: ['webs', 'hive_cells'], fore: 'webs', fx: 'spores', glow: '#d8b030' },
  hive_comb: { tint: '#40301a', light: '#f8d880', sky: 'cave', far: ['honeycomb', 'webs_far'], floor: 'wax', mid: ['hive_cells', 'cocoons'], fore: 'webs', fx: 'spores', glow: '#d8b030' },
  hive_brood: { tint: '#2c2418', light: '#e8c880', sky: 'cave', far: ['honeycomb', 'cocoons_far'], floor: 'wax', mid: ['cocoons', 'webs'], fore: 'webs', fx: 'spores', glow: '#b4d860' },
  sky_ruins: { tint: '#2c2c40', light: '#f4ecd0', sky: 'exterior', far: ['floating_isles', 'stormclouds', 'lightning'], floor: 'marble', mid: ['columns_broken', 'statues'], fore: 'chains', fx: 'motes', glow: '#ffe680' },
  sky_gate: { tint: '#24243a', light: '#e8e0f8', sky: 'exterior', far: ['rift', 'floating_isles'], floor: 'marble', mid: ['columns_broken', 'statues', 'crystals'], fore: 'chains', fx: 'motes', glow: '#a47ae0' },
  sky_choir: { tint: '#2a2838', light: '#f8f0d0', sky: 'interior', far: ['rose', 'colonnade'], floor: 'marble', mid: ['statues', 'candles'], fore: 'drapes', fx: 'motes', glow: '#ffe680' },
  mire_bog: { tint: '#2a3024', light: '#d8e0b0', sky: 'exterior', far: ['dead_trees', 'fog'], floor: 'water', mid: ['dead_trees_near', 'reeds'], fore: 'roots', fx: 'spores', glow: '#b4d860' },
  mire_hut: { tint: '#2c2a20', light: '#e0d0a0', sky: 'exterior', far: ['stilt_huts', 'fog'], floor: 'mud', mid: ['reeds', 'cages_hang'], fore: 'roots', fx: 'spores', glow: '#b4d860' },
  mire_drown: { tint: '#1e2620', light: '#c8d8b0', sky: 'cave', far: ['roots_wall', 'fog'], floor: 'water', mid: ['bones', 'reeds'], fore: 'kelp', fx: 'spores', glow: '#b4d860' },
  garden_grove: { tint: '#2a2430', light: '#e0d0e8', sky: 'exterior', far: ['giant_mushrooms', 'fog'], floor: 'moss', mid: ['mushrooms', 'dead_trees_near'], fore: 'roots', fx: 'spores', glow: '#c8a0e0' },
  garden_hedge: { tint: '#24282a', light: '#d8e0d0', sky: 'exterior', far: ['hedges', 'statues_far'], floor: 'moss', mid: ['statues', 'mushrooms'], fore: 'roots', fx: 'spores', glow: '#c8a0e0' },
  garden_heart: { tint: '#201a24', light: '#d8c0e8', sky: 'cave', far: ['roots_wall', 'giant_mushrooms', 'black_star'], floor: 'moss', mid: ['mushrooms', 'cocoons'], fore: 'roots', fx: 'spores', glow: '#a47ae0' },
};


// ------------------------------------------------------------------ surfaces: dressed masonry, fractured rock, haze, light pools
function masonry(a, R, y0, y1, col, opt = {}) {
  // coursed ashlar: courses shrink toward the top, every block toned and chipped, mortar shadowed below, soot and damp streaks
  a.raw(`<rect x="0" y="${y0}" width="${W}" height="${y1 - y0}" fill="${dark(col, 0.25)}"/>`);
  let y = y1, row = 0, o = '';
  while (y > y0) {
    const ch = 22 + (y - y0) / (y1 - y0) * 12, yt = Math.max(y0, y - ch);
    let x = (row % 2) * -40 - R() * 30;
    while (x < W) {
      const bw = 60 + R() * 70, tone = mix(col, R() < 0.5 ? '#d8cbb0' : '#1a1410', R() * 0.22);
      const x0 = x + 1.5, x1 = x + bw - 1.5, ya = yt + 1.5, yb = y - 1.5, c = 2 + R() * 3;
      o += `<path d="M${f(x0 + c)} ${f(ya)} L${f(x1 - R() * 3)} ${f(ya + R() * 1.5)} L${f(x1)} ${f(yb - c)} L${f(x1 - c)} ${f(yb)} L${f(x0 + R() * 2)} ${f(yb)} L${f(x0)} ${f(ya + c)} Z" fill="${tone}" stroke="${INK}" stroke-width="0.9"/>`;
      o += `<path d="M${f(x0 + 2)} ${f(yb - 2)} L${f(x1 - 2)} ${f(yb - 2)}" stroke="${INK}" stroke-width="2.2" opacity="0.35"/><path d="M${f(x0 + 3)} ${f(ya + 2)} L${f(x1 - 6)} ${f(ya + 2)}" stroke="#fff4dc" stroke-width="1" opacity="0.18"/>`;
      if (R() < 0.12) o += `<path d="M${f(x0 + bw * 0.3)} ${f(ya)} l${f(4 + R() * 6)} ${f(ch * 0.4)} l${f(-3)} ${f(ch * 0.5)}" stroke="${INK}" stroke-width="0.8" fill="none"/>`;
      x += bw;
    }
    y = yt; row++;
  }
  a.raw(o);
  a.raw(`<rect x="0" y="${y0}" width="${W}" height="${y1 - y0}" fill="${a.hatchPat(70, 3.4, 0.5)}" opacity="0.35"/>`);
  for (let i = 0; i < (opt.streaks || 10); i++) { const x = R() * W; a.raw(`<path d="M${f(x)} ${y0} C${f(x + 6)} ${f(y0 + 80)} ${f(x - 4)} ${f(y0 + 160)} ${f(x + 2)} ${f(y1)}" stroke="${opt.streak || '#1a1410'}" stroke-width="${f(10 + R() * 30)}" opacity="${f(0.08 + R() * 0.12)}" fill="none"/>`); }
  a.raw(`<linearGradient id="wsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.45"/><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.25"/></linearGradient><rect x="0" y="${y0}" width="${W}" height="${y1 - y0}" fill="url(#wsh)"/>`);
}
function rockface(a, R, y0, y1, col) {
  // fractured strata: overlapping angular slabs, lit on the upper-left faces, hatched in the cracks
  a.raw(`<rect x="0" y="${y0}" width="${W}" height="${y1 - y0}" fill="${dark(col, 0.35)}"/>`);
  for (let i = 0; i < 70; i++) {
    const cx = R() * W, cy = y0 + R() * (y1 - y0), w = 50 + R() * 120, h = 30 + R() * 60, sk = (R() - 0.5) * 30;
    const pts = [[cx - w / 2, cy + h / 2], [cx - w / 2 + sk + R() * 10, cy - h / 2], [cx + w * 0.1, cy - h / 2 - R() * 10], [cx + w / 2 + sk, cy - h / 3], [cx + w / 2, cy + h / 2]];
    a.raw(`<path d="${poly(pts)}" fill="${mix(col, R() < 0.5 ? '#c8bca0' : '#0c0a08', 0.08 + R() * 0.25)}" stroke="${INK}" stroke-width="1"/><path d="M${f(pts[1][0])} ${f(pts[1][1])} L${f(pts[2][0])} ${f(pts[2][1])} L${f(pts[3][0])} ${f(pts[3][1])}" stroke="#fff4dc" stroke-width="1.2" opacity="0.2" fill="none"/><path d="${poly([pts[3], pts[4], pts[0], [pts[0][0] + 6, pts[0][1] - 10], [pts[4][0] - 6, pts[4][1] - 12]])}" fill="${a.hatchPat(60, 2.8, 0.6)}" opacity="0.5"/>`);
  }
}
function haze(a, col, y = HOR, h = 90, op = 0.22) {
  a.raw(`<linearGradient id="hz${y}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset="0.7" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient><rect x="0" y="${y - h}" width="${W}" height="${h + 30}" fill="url(#hz${y})"/>`);
}
function wisp(a, R, x, y, w, col = '#e8e0d8', op = 0.12) {
  return `<g filter="url(#rough)"><path d="M${f(x - w)} ${f(y)} C${f(x - w * 0.6)} ${f(y - w * 0.4)} ${f(x - w * 0.1)} ${f(y + w * 0.1)} ${f(x + w * 0.3)} ${f(y - w * 0.25)} C${f(x + w * 0.6)} ${f(y - w * 0.5)} ${f(x + w)} ${f(y - w * 0.2)} ${f(x + w * 1.1)} ${f(y - w * 0.6)}" stroke="${col}" stroke-width="${f(w * 0.35)}" opacity="${op}" fill="none" stroke-linecap="round"/></g>`;
}

function room(key) {
  const cfg = ROOMS[key];
  let seed = 0; for (const c of key) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  // ======================================================================== FAR
  {
    const a = new Art(W, H, seed % 9999 + 3), D = dressing(a), R = a.R;
    const sky = cfg.sky;
    a.raw(`<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky === 'exterior' ? mix(cfg.tint, cfg.light, 0.18) : cfg.tint}"/><stop offset="1" stop-color="${dark(cfg.tint, 0.5)}"/></linearGradient><rect width="${W}" height="${HOR + 2}" fill="url(#sk)"/>`);
    if (sky === 'cave') { // fractured rock walls, a ragged ceiling with stalactites
      rockface(a, R, 40, HOR, mix(cfg.tint, '#5a5246', 0.4));
      a.shape({ d: smooth([[0, 0], [W, 0], [W, 140], ...Array.from({ length: 14 }, (_, i) => [W - i * W / 13, 60 + R() * 90]), [0, 140]], true, 0.6), fill: dark(cfg.tint, 0.2), depth: 30, mottle: 0.2, hatch: 70, hl: false, ink: 1, wash: 0.25 });
      for (let i = 0; i < 18; i++) { const x = R() * W, l = 20 + R() * 70; a.raw(`<path d="M${f(x - 10)} 60 L${f(x + 10)} 60 L${f(x)} ${f(80 + l)} Z" fill="${dark(cfg.tint, 0.3)}" stroke="${INK}" stroke-width="1"/>`); }
    }
    if (sky === 'interior') masonry(a, R, 20, HOR, mix(cfg.tint, '#7a7262', 0.45), { streak: dark(cfg.tint, 0.6) });
    const F = FAR(a, D, cfg, R);
    for (const feat of cfg.far) if (F[feat]) F[feat](); else console.error('missing far', feat);
    haze(a, cfg.light, HOR, 110, cfg.sky === 'exterior' ? 0.3 : 0.18);
    FLOOR(a, D, cfg, R)[cfg.floor]();
    for (const x of [W * 0.22, W * 0.5, W * 0.78]) a.raw(`<ellipse cx="${f(x + (R() - 0.5) * 80)}" cy="${HOR + 70}" rx="${f(200 + R() * 80)}" ry="40" fill="${cfg.glow}" opacity="0.07"/>`);
    a.raw(`<radialGradient id="vg" cx="0.5" cy="0.55" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient><rect width="${W}" height="${H}" fill="url(#vg)"/>`);
    a.raw(PARTS(a, D, cfg, R, 90, 0, HOR + 80));
    fs.writeFileSync(`grim/bg/${key}_far.svg`, a.svg());
  }
  // ======================================================================== MID
  {
    const a = new Art(W, H, seed % 9999 + 4), D = dressing(a), R = a.R;
    const M = MID(a, D, cfg, R);
    const xs = [[60, 1420], [300, 1180], [520, 960]];
    cfg.mid.forEach((p, i) => { if (M[p]) M[p](xs[i % 3], i); else console.error('missing mid', p); });
    fs.writeFileSync(`grim/bg/${key}_mid.svg`, a.svg());
  }
  // ======================================================================== FORE
  {
    const a = new Art(W, H, seed % 9999 + 5), D = dressing(a), R = a.R, dk = '#0f1210';
    a.shape({ d: `M0 0 L${92 + (seed % 3) * 10} 0 C80 120 110 240 70 ${H} L0 ${H} Z`, fill: dk, depth: 30, hatch: 70, hl: false, wash: 0.2 });
    a.shape({ d: `M${W} 0 L${W - 100} 0 C${W - 70} 140 ${W - 110} 300 ${W - 60} ${H} L${W} ${H} Z`, fill: dk, depth: 30, hatch: 120, hl: false, wash: 0.2 });
    a.shape({ d: smooth([[0, H], [0, 440], [40, 428], [80, 446], [110, H]], true, 0.6), fill: dk, depth: 20, hatch: 70, hl: false });
    a.shape({ d: smooth([[W, H], [W, 436], [W - 40, 426], [W - 80, 446], [W - 110, H]], true, 0.6), fill: dk, depth: 20, hatch: 120, hl: false });
    for (const x of [150, 240, 1230, 1330]) {
      const len = 60 + R() * 90;
      const h = cfg.fore;
      if (h === 'icicles') a.raw(D.icicles(x - 40, x + 40, 0, 5, len).replace(/#dceef8/g, '#9ab0bc'));
      else if (h === 'chains') a.raw(D.chain(x, 0, x + 6, len, Math.round(len / 10), '#2a2a28'));
      else if (h === 'ropes') a.raw(`<path d="M${x} 0 C${x + 8} ${len * 0.4} ${x - 6} ${len * 0.7} ${x + 2} ${len}" stroke="${dk}" stroke-width="5" fill="none"/><path d="M${x - 8} ${len} C${x - 2} ${len + 12} ${x + 8} ${len + 12} ${x + 12} ${len}" stroke="${dk}" stroke-width="5" fill="none"/>`);
      else if (h === 'roots') a.raw(`<path d="M${x} 0 C${x + 20} ${len * 0.3} ${x - 20} ${len * 0.6} ${x + 6} ${len} M${x + 4} ${len * 0.4} C${x + 30} ${len * 0.5} ${x + 20} ${len * 0.7} ${x + 34} ${len * 0.8}" stroke="${dk}" stroke-width="7" fill="none" stroke-linecap="round"/>` + (cfg.glow === '#c8a0e0' || cfg.glow === '#b4d860' ? D.fungus(x + 4, len * 0.5, 2, 0.7, '#3a3428') : ''));
      else if (h === 'webs') a.raw(`<g stroke="#c8c0a8" stroke-width="0.9" opacity="0.55" fill="none">` + Array.from({ length: 6 }, (_, i) => `<path d="M${x} 0 L${f(x + (i - 2.5) * 30)} ${f(len + 40)}"/>`).join('') + Array.from({ length: 5 }, (_, i) => `<path d="M${f(x - 12 - i * 12)} ${f(20 + i * 22)} Q${x} ${f(30 + i * 24)} ${f(x + 12 + i * 12)} ${f(20 + i * 22)}"/>`).join('') + `</g>`);
      else if (h === 'drapes') a.raw(`<path d="M${x - 40} 0 C${x - 30} ${len} ${x + 30} ${len} ${x + 40} 0 Z" fill="${dk}"/><path d="M${x - 20} ${len * 0.5} L${x - 16} ${len * 0.9} M${x + 8} ${len * 0.5} L${x + 6} ${len * 0.95}" stroke="#2a2420" stroke-width="2"/>`);
      else a.raw(D.weed(x, 0, len + 40).replace(/#4f5f3a/g, '#1f2a1a'));
    }
    a.raw(PARTS(a, D, cfg, R, 24, 40, H - 40));
    fs.writeFileSync(`grim/bg/${key}_fore.svg`, a.svg(false));
  }
}

// ------------------------------------------------------------------ particles
function PARTS(a, D, cfg, R, n, y0, y1) {
  const k = cfg.fx;
  return Array.from({ length: n }, () => {
    const x = R() * W, y = y0 + R() * (y1 - y0);
    if (k === 'snow') return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + R() * 2)}" fill="#f4f8ff" opacity="${f(0.4 + R() * 0.5)}"/>`;
    if (k === 'embers' || k === 'sparks') return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.6 + R() * 1.6)}" fill="${R() < 0.5 ? '#ffd27a' : '#ff8a3a'}" opacity="${f(0.5 + R() * 0.5)}"/>`;
    if (k === 'ash') return `<path d="${blob(x, y, 1 + R() * 2, R, 5, 0.5)}" fill="#8a8078" opacity="${f(0.4 + R() * 0.4)}"/>`;
    if (k === 'spores') return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + R() * 1.8)}" fill="${cfg.glow}" opacity="${f(0.3 + R() * 0.4)}"/>`;
    if (k === 'rain') return `<path d="M${f(x)} ${f(y)} l-6 18" stroke="#c8d8e0" stroke-width="0.8" opacity="${f(0.3 + R() * 0.3)}"/>`;
    if (k === 'steam') return R() < 0.15 ? wisp(a, R, x, y, 30 + R() * 40, '#ece4dc', 0.08) : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + R() * 1.4)}" fill="#f4ece4" opacity="0.4"/>`;
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + R() * 1.5)}" fill="${cfg.light}" opacity="${f(0.3 + R() * 0.4)}"/>`;
  }).join('');
}

// ------------------------------------------------------------------ far features
function FAR(a, D, cfg, R) {
  const L = cfg.light, T = cfg.tint, stone = mix(T, '#7a7468', 0.45), dstone = dark(stone, 0.3);
  const arcade = (n, top, opt = {}) => {
    const step = W / n;
    for (let i = 0; i < n; i++) { const cx = step * (i + 0.5), aw = step * 0.56, ah = (HOR - top) * 0.8, y = HOR;
      a.shape({ d: `M${f(cx - aw / 2)} ${y} L${f(cx - aw / 2)} ${f(y - ah * 0.6)} C${f(cx - aw / 2)} ${f(y - ah * 1.05)} ${f(cx + aw / 2)} ${f(y - ah * 1.05)} ${f(cx + aw / 2)} ${f(y - ah * 0.6)} L${f(cx + aw / 2)} ${y} Z`, fill: opt.void || dark(T, 0.5), depth: 20, hatch: 60, hl: false, ink: 1.6, wash: 0.5, decals: opt.inArch ? opt.inArch(cx, y, aw, ah, i) : '' }); }
  };
  const ridge = (y, amp, col, n = 12, op = 1) => a.raw(`<path d="M0 ${HOR} L0 ${y} ${Array.from({ length: n + 1 }, (_, i) => `L${f(i * W / n)} ${f(y - R() * amp)}`).join(' ')} L${W} ${HOR} Z" fill="${col}" opacity="${op}" stroke="${INK}" stroke-width="1.2"/>`);
  const tree = (x, base, h, col) => { let o = `M${x} ${base} C${x - 4} ${base - h * 0.4} ${x + 6} ${base - h * 0.7} ${x} ${base - h}`; for (let i = 0; i < 6; i++) { const t = 0.3 + i * 0.11, y = base - h * t, sg = i % 2 ? 1 : -1; o += ` M${x} ${f(y)} q${sg * 20} -10 ${sg * (30 + R() * 30)} ${f(-20 - R() * 30)}`; } return `<path d="${o}" stroke="${col}" stroke-width="${f(3 + h / 60)}" fill="none" stroke-linecap="round"/>`; };
  return {
    arcade: () => arcade(6, 120),
    colonnade: () => { for (let i = 0; i < 10; i++) { const x = 80 + i * 145; a.shape({ d: `M${x - 16} ${HOR} L${x - 16} 90 L${x + 16} 90 L${x + 16} ${HOR} Z`, fill: light(stone, 0.2), depth: 10, mottle: 0.6, hatch: 80, lines: [`M${x - 6} 90 L${x - 6} ${HOR}`, `M${x + 6} 90 L${x + 6} ${HOR}`] }); } a.raw(`<rect x="0" y="70" width="${W}" height="22" fill="${stone}" stroke="${INK}" stroke-width="1.4"/>`); },
    rose: () => { const cx = W / 2, cy = 110, r = 84; a.raw(`<circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="${dstone}" stroke="${INK}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${L}" opacity="0.45"/>` + Array.from({ length: 12 }, (_, i) => { const t = i / 12 * 6.28; return `<path d="M${cx} ${cy} L${f(cx + Math.cos(t) * r)} ${f(cy + Math.sin(t) * r)}" stroke="${INK}" stroke-width="4"/><circle cx="${f(cx + Math.cos(t + 0.26) * r * 0.66)}" cy="${f(cy + Math.sin(t + 0.26) * r * 0.66)}" r="${f(r * 0.2)}" fill="${[cfg.glow, '#2a4a6a', '#6a2a24'][i % 3]}" opacity="0.5" stroke="${INK}" stroke-width="1.6"/>`; }).join('')); for (let i = 0; i < 5; i++) { const x = 300 + R() * 880; a.raw(`<path d="M${f(x)} 0 L${f(x + 60)} 0 L${f(x + 140)} ${H} L${f(x + 50)} ${H} Z" fill="${L}" opacity="0.07"/>`); } },
    windows_tall: () => { for (const x of [260, 620, 860, 1220]) a.raw(`<path d="M${x - 40} ${HOR - 30} L${x - 40} 90 C${x - 40} 40 ${x + 40} 40 ${x + 40} 90 L${x + 40} ${HOR - 30} Z" fill="${L}" opacity="0.4" stroke="${INK}" stroke-width="3"/><path d="M${x} 50 L${x} ${HOR - 30} M${x - 40} 150 L${x + 40} 150" stroke="${INK}" stroke-width="3"/><path d="M${x - 40} 0 L${x + 40} 0 L${x + 140} ${H} L${x + 20} ${H} Z" fill="${L}" opacity="0.06"/>`); },
    niches: () => { for (let row = 0; row < 5; row++) for (let i = 0; i < 26; i++) { const x = 30 + i * 57 + (row % 2) * 28, y = 60 + row * 46; a.raw(`<path d="M${x - 20} ${y + 18} L${x - 20} ${y - 8} C${x - 20} ${y - 26} ${x + 20} ${y - 26} ${x + 20} ${y - 8} L${x + 20} ${y + 18} Z" fill="#121212"/>` + ((i + row) % 4 ? `<path d="M${x - 14} ${y + 16} C${x - 14} ${y} ${x + 14} ${y} ${x + 14} ${y + 16} Z" fill="${G.bone}" opacity="0.7" stroke="${INK}" stroke-width="0.7"/>` : `<circle cx="${x}" cy="${y + 4}" r="4" fill="${cfg.glow}" opacity="0.8"/>`)); } },
    longhall: () => { for (const x of [200, 500, 980, 1280]) a.raw(`<path d="M${x} 20 L${x} ${HOR}" stroke="${INK}" stroke-width="30"/><path d="M${x} 20 L${x} ${HOR}" stroke="#5a4632" stroke-width="24"/>`); a.raw(`<path d="M0 120 L${W / 2} 20 L${W} 120" stroke="${INK}" stroke-width="22" fill="none"/><path d="M0 120 L${W / 2} 20 L${W} 120" stroke="#5a4632" stroke-width="16" fill="none"/>`); },
    shields_wall: () => { for (let i = 0; i < 12; i++) { const x = 80 + i * 118, y = 170 + (i % 2) * 20; a.raw(`<circle cx="${x}" cy="${y}" r="30" fill="${['#5a3a2a', '#3a4a5a', '#6a5a3a'][i % 3]}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="7" fill="${G.steel}" stroke="${INK}" stroke-width="1.2"/><path d="M${x - 30} ${y} L${x + 30} ${y}" stroke="${INK}" stroke-width="1" opacity="0.6"/>`); } },
    peaks_ice: () => { for (const [base, amp, n, tone, op] of [[170, 120, 7, 0.6, 0.75], [230, 80, 11, 0.4, 0.95]]) { const pk = Array.from({ length: n + 1 }, (_, i) => [i * W / n + (R() - 0.5) * 60, base - R() * amp]); let d = `M0 ${HOR}`; pk.forEach((p, i) => { d += ` L${f(p[0])} ${f(p[1])}`; if (i < n) d += ` L${f((p[0] + pk[i + 1][0]) / 2)} ${f(Math.max(p[1], pk[i + 1][1]) + 30 + R() * 40)}`; }); d += ` L${W} ${HOR} Z`;
        a.raw(`<path d="${d}" fill="${mix(T, '#5a6470', tone)}" opacity="${op}" stroke="${INK}" stroke-width="1.2"/>`);
        pk.forEach(p => { a.raw(`<path d="M${f(p[0])} ${f(p[1])} L${f(p[0] + 26 + R() * 30)} ${f(p[1] + 50 + R() * 30)} L${f(p[0] + 10)} ${f(p[1] + 34)} L${f(p[0] - 8)} ${f(p[1] + 46)} L${f(p[0] - 30 - R() * 20)} ${f(p[1] + 40 + R() * 20)} Z" fill="#e4ecf2" opacity="${f(op * 0.9)}" stroke="${INK}" stroke-width="0.8"/><path d="M${f(p[0])} ${f(p[1])} L${f(p[0] + 40)} ${f(p[1] + 120)} L${f(p[0] + 70)} ${f(p[1] + 160)}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.5"/><path d="M${f(p[0])} ${f(p[1])} L${f(p[0] + 60)} ${f(p[1] + 120)} L${f(p[0] + 4)} ${f(p[1] + 140)} Z" fill="${a.hatchPat(60, 3, 0.6)}" opacity="${f(op * 0.6)}"/>`); });
        haze(a, L, base + 40, 120, 0.22); } },
    vent_glow: () => { for (const x of [380, 1010]) a.raw(a.glow(x, HOR - 30, 160, cfg.glow, 0.6) + D.veins(x - 60, HOR - 80, x + 40, HOR, cfg.glow, 4) + `<path d="M${x - 30} ${HOR - 40} C${x - 50} 160 ${x + 20} 120 ${x - 10} 40" stroke="#d8d0c8" stroke-width="30" opacity="0.08" fill="none"/>`); },
    magma_falls: () => { for (const x of [300, 760, 1180]) a.raw(a.glow(x, 200, 140, '#ff6a2a', 0.5) + `<path d="M${x - 18} 60 C${x - 26} 140 ${x - 10} 220 ${x - 22} ${HOR} L${x + 22} ${HOR} C${x + 16} 220 ${x + 26} 140 ${x + 18} 60 Z" fill="#e8622a" stroke="${INK}" stroke-width="1.4"/><path d="M${x - 6} 60 C${x - 10} 140 ${x} 220 ${x - 6} ${HOR}" stroke="#ffd27a" stroke-width="4" fill="none"/>`); },
    ice_walls: () => { for (let i = 0; i < 16; i++) { const x = i * 100 + R() * 40, h = 120 + R() * 160; a.raw(`<path d="M${f(x)} ${HOR} L${f(x + 20)} ${f(HOR - h)} L${f(x + 60)} ${f(HOR - h * 0.8)} L${f(x + 80)} ${HOR} Z" fill="${mix(L, T, 0.4)}" opacity="0.8" stroke="${INK}" stroke-width="1.2"/><path d="M${f(x + 22)} ${f(HOR - h + 10)} L${f(x + 30)} ${HOR}" stroke="#fff" stroke-width="1" opacity="0.5"/>`); } },
    steam: () => { for (let i = 0; i < 18; i++) a.raw(wisp(a, R, R() * W, 100 + R() * 200, 60 + R() * 80, '#ece4dc', 0.1 + R() * 0.08)); },
    furnaces: () => { for (const x of [260, 740, 1220]) { a.shape({ d: `M${x - 90} ${HOR} L${x - 80} 110 C${x - 60} 60 ${x + 60} 60 ${x + 80} 110 L${x + 90} ${HOR} Z`, fill: '#4a3a30', depth: 30, mottle: 0.7, hatch: 70, decals: Array.from({ length: 12 }, (_, i) => `<path d="M${x - 80} ${110 + i * 16} l160 0" stroke="${INK}" stroke-width="0.8"/>`).join('') }); a.raw(a.glow(x, 230, 120, '#ff7a2a', 0.8) + `<path d="M${x - 40} ${HOR - 10} L${x - 40} 210 C${x - 40} 180 ${x + 40} 180 ${x + 40} 210 L${x + 40} ${HOR - 10} Z" fill="#ffb050" stroke="${INK}" stroke-width="2"/>` + D.flame(x, HOR - 14, 60, 30)); } },
    chimneys: () => { for (const x of [200, 520, 1000, 1320]) { a.raw(`<rect x="${x - 30}" y="${60 + R() * 60}" width="60" height="${HOR}" fill="#3a3028" stroke="${INK}" stroke-width="2"/>` + `<path d="${blob(x, 40, 40, R, 10, 0.3)}" fill="#4a4448" opacity="0.6"/>`); } },
    chains_far: () => { for (const x of [160, 420, 1060, 1320]) a.raw(`<g opacity="0.7">${D.chain(x, 0, x + 10, 220, 22, '#3a3430')}</g>` + `<path d="M${x - 24} 222 L${x + 34} 222 L${x + 20} 260 L${x - 10} 260 Z" fill="#3a3430" stroke="${INK}" stroke-width="1.4"/>`); },
    molten_channels: () => { for (let i = 0; i < 4; i++) { const y = 200 + i * 28; a.raw(`<path d="M0 ${y} C${W * 0.3} ${y - 10} ${W * 0.6} ${y + 14} ${W} ${y}" stroke="#ff7a2a" stroke-width="${6 - i}" opacity="0.7" fill="none"/>`); } a.raw(a.glow(W / 2, 240, 400, '#ff7a2a', 0.3)); },
    stormclouds: () => { for (let i = 0; i < 18; i++) a.raw(`<path d="${blob(R() * W, 30 + R() * 90, 70 + R() * 90, R, 12, 0.25)}" fill="${mix(T, '#1a1a1a', 0.3 + R() * 0.3)}" opacity="0.85" stroke="${INK}" stroke-width="0.8"/>`); },
    lightning: () => { for (let i = 0; i < 3; i++) { const x = 200 + R() * 1080; a.raw(D.arc(x, 60, x + (R() - 0.5) * 200, HOR - 40, 2.4) + a.glow(x, 80, 120, '#ffe680', 0.25)); } },
    smoke: () => { for (let i = 0; i < 12; i++) a.raw(`<path d="${blob(R() * W, 40 + R() * 180, 60 + R() * 70, R, 10, 0.3)}" fill="#1a1416" opacity="${f(0.3 + R() * 0.3)}"/>`); },
    stakes: () => { for (let i = 0; i < 9; i++) { const x = 100 + i * 160 + R() * 40, h = 140 + R() * 60; a.raw(`<path d="M${f(x)} ${HOR} L${f(x)} ${f(HOR - h)}" stroke="${INK}" stroke-width="9"/><path d="M${f(x)} ${HOR} L${f(x)} ${f(HOR - h)}" stroke="#3a2a20" stroke-width="6"/>` + (i % 2 ? D.flame(x, HOR - 10, 70 + R() * 40, 24) : `<path d="M${f(x - 10)} ${f(HOR - h + 20)} l20 40 m-20 0 l20 -40" stroke="#1a1414" stroke-width="5"/>`)); } },
    black_fire: () => { for (const x of [300, W / 2, 1180]) a.raw(a.glow(x, 200, 120, '#a47ae0', 0.4) + D.flame(x, HOR, 160, 50, -0.05).replace(/#c8481c/g, '#1a1020').replace(/#f08a30/g, '#3a2050').replace(/#ffd27a/g, '#a47ae0').replace(/#ff7a2a/g, '#6a3aa0')); },
    orrery: () => { const cx = W / 2, cy = 150; for (const r of [60, 100, 140]) a.raw(`<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.6}" ry="${r * 0.5}" fill="none" stroke="${G.gold}" stroke-width="3"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 1.6}" ry="${r * 0.5}" fill="none" stroke="${INK}" stroke-width="0.8"/>`); a.raw([[0.3, 60], [2, 100], [4, 140]].map(([t, r]) => `<circle cx="${f(cx + Math.cos(t) * r * 1.6)}" cy="${f(cy + Math.sin(t) * r * 0.5)}" r="${f(10 + r / 20)}" fill="${['#c8a040', '#8aa8c0', '#a87a5a'][r % 3]}" stroke="${INK}" stroke-width="1.4"/>`).join('') + `<circle cx="${cx}" cy="${cy}" r="24" fill="#f4dc78" stroke="${INK}" stroke-width="1.6"/>` + a.glow(cx, cy, 80, '#ffe680', 0.5) + D.icicles(cx - 200, cx + 200, cy + 60, 12, 30)); },
    clockface: () => { const cx = W / 2, cy = 140, r = 110; a.raw(`<circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="${dstone}" stroke="${INK}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${light(stone, 0.5)}" stroke="${INK}" stroke-width="2"/>` + Array.from({ length: 12 }, (_, i) => { const t = i / 12 * 6.28; return `<text x="${f(cx + Math.cos(t - 1.57) * r * 0.8)}" y="${f(cy + Math.sin(t - 1.57) * r * 0.8 + 6)}" font-family="serif" font-size="18" text-anchor="middle" fill="${INK}">${['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][i]}</text>`; }).join('') + `<path d="M${cx} ${cy} L${cx - 20} ${cy - 80} M${cx} ${cy} L${cx + 60} ${cy + 10}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${cx - 60} ${cy - 30} l50 30 l-20 40" stroke="${INK}" stroke-width="2" fill="none"/>` + D.icicles(cx - r, cx + r, cy + r, 10, 30)); },
    frozen_ships: () => { for (const [x, s] of [[300, 0.8], [900, 1.1], [1300, 0.7]]) { a.raw(`<path d="M${f(x - 160 * s)} ${HOR - 10} C${f(x - 120 * s)} ${f(HOR - 80 * s)} ${f(x + 120 * s)} ${f(HOR - 80 * s)} ${f(x + 170 * s)} ${f(HOR - 30)} L${f(x + 150 * s)} ${HOR} L${f(x - 150 * s)} ${HOR} Z" fill="#3a3430" stroke="${INK}" stroke-width="2" transform="rotate(${f((R() - 0.5) * 10)} ${x} ${HOR})"/><path d="M${x} ${f(HOR - 60 * s)} L${x} ${f(HOR - 260 * s)} M${f(x - 60 * s)} ${f(HOR - 200 * s)} L${f(x + 60 * s)} ${f(HOR - 200 * s)}" stroke="#2a2420" stroke-width="${f(6 * s)}"/>` + D.icicles(x - 60 * s, x + 60 * s, HOR - 200 * s, 6, 24 * s)); } },
    aurora: () => { for (let i = 0; i < 4; i++) a.raw(`<path d="M0 ${60 + i * 20} C${W * 0.25} ${20 + i * 30} ${W * 0.5} ${100 + i * 10} ${W} ${50 + i * 24}" stroke="${['#7ad8a0', '#a0e0c8', '#8aa8e0', '#c8a0e0'][i]}" stroke-width="${24 - i * 4}" opacity="0.18" fill="none"/>`); },
    hull_ribs: () => { for (let i = 0; i < 9; i++) { const x = 100 + i * 160; a.raw(`<path d="M${x} ${HOR} C${x - 30} 200 ${x - 10} 80 ${x + 40} 20" stroke="${INK}" stroke-width="22" fill="none"/><path d="M${x} ${HOR} C${x - 30} 200 ${x - 10} 80 ${x + 40} 20" stroke="#4a3a2a" stroke-width="16" fill="none"/>`); } },
    lanterns: () => { for (const x of [300, 700, 1100]) a.raw(`<path d="M${x} 0 L${x} 100" stroke="${INK}" stroke-width="2"/><rect x="${x - 12}" y="100" width="24" height="30" fill="#ffd080" stroke="${INK}" stroke-width="2"/>` + a.glow(x, 115, 90, '#ffc070', 0.5)); },
    mounds: () => { for (const [x, w] of [[300, 260], [800, 340], [1250, 240]]) { a.raw(`<path d="M${x - w} ${HOR} C${x - w * 0.6} ${HOR - w * 0.45} ${x + w * 0.6} ${HOR - w * 0.45} ${x + w} ${HOR} Z" fill="${mix(T, '#d8d8d0', 0.3)}" stroke="${INK}" stroke-width="1.6"/><path d="M${x - 24} ${HOR} L${x - 24} ${HOR - 50} L${x + 24} ${HOR - 50} L${x + 24} ${HOR} Z" fill="#141414" stroke="${INK}" stroke-width="2"/>` + a.glow(x, HOR - 20, 40, cfg.glow, 0.5)); } },
    dead_trees: () => { for (let i = 0; i < 9; i++) a.raw(tree(80 + i * 170 + R() * 60, HOR, 120 + R() * 120, mix(T, '#0a0a0a', 0.5))); },
    black_star: () => { const cx = 1000, cy = 100; a.raw(a.glow(cx, cy, 200, '#a47ae0', 0.4) + `<circle cx="${cx}" cy="${cy}" r="56" fill="#08060c" stroke="#c8b0f0" stroke-width="2"/>` + Array.from({ length: 16 }, (_, i) => { const t = i / 16 * 6.28; return `<path d="M${f(cx + Math.cos(t) * 62)} ${f(cy + Math.sin(t) * 62)} L${f(cx + Math.cos(t) * (90 + R() * 60))} ${f(cy + Math.sin(t) * (90 + R() * 60))}" stroke="#c8b0f0" stroke-width="1.2" opacity="0.6"/>`; }).join('') + Array.from({ length: 60 }, () => `<circle cx="${f(R() * W)}" cy="${f(R() * 200)}" r="${f(0.5 + R())}" fill="#e8e8f4" opacity="0.6"/>`).join('')); },
    statues_far: () => { for (const x of [240, 560, 920, 1240]) { const c = mix(T, '#c8c8c0', 0.4), h = 150 + R() * 30;
      // hooded, head-bowed saints on plinths, the robes falling in long folds
      a.raw(`<path d="M${x - 34} ${HOR} L${x + 34} ${HOR} L${x + 30} ${HOR - 16} L${x - 30} ${HOR - 16} Z" fill="${dark(c, 0.2)}" stroke="${INK}" stroke-width="1.2"/>` +
        `<path d="M${x - 26} ${HOR - 16} C${x - 32} ${HOR - 70} ${x - 24} ${HOR - h + 30} ${x - 14} ${HOR - h} C${x - 4} ${HOR - h - 22} ${x + 18} ${HOR - h - 16} ${x + 20} ${HOR - h + 8} C${x + 26} ${HOR - h + 40} ${x + 30} ${HOR - 70} ${x + 26} ${HOR - 16} Z" fill="${c}" stroke="${INK}" stroke-width="1.2"/>` +
        `<path d="M${x - 14} ${HOR - h} C${x - 6} ${HOR - h + 10} ${x - 2} ${HOR - h + 20} ${x - 8} ${HOR - h + 26}" fill="${INK}" opacity="0.6" stroke="none"/>` +
        [-12, -2, 10].map(dx => `<path d="M${x + dx} ${HOR - h + 40} C${x + dx - 2} ${HOR - 90} ${x + dx + 3} ${HOR - 60} ${x + dx} ${HOR - 18}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.7"/>`).join('') +
        `<path d="M${x + 4} ${HOR - h + 4} L${x + 26} ${HOR - 18} L${x + 26} ${HOR - h + 40} Z" fill="${a.hatchPat(60, 2.6, 0.6)}" opacity="0.7"/>` + a.stain(x, HOR - 60, 14, G.black, 0.4)); } },
    rift: () => { const cx = W / 2; a.raw(a.glow(cx, 150, 260, '#a47ae0', 0.5) + `<path d="M${cx - 30} 0 L${cx + 20} 60 L${cx - 40} 120 L${cx + 30} 200 L${cx - 10} ${HOR} L${cx + 30} ${HOR} L${cx + 60} 200 L${cx + 10} 120 L${cx + 60} 60 L${cx + 10} 0 Z" fill="#08060c" stroke="#c8b0f0" stroke-width="2"/>` + D.motes(cx, 150, 200, 40)); },
    sea: () => { a.raw(`<rect x="0" y="${HOR - 70}" width="${W}" height="70" fill="${mix(T, '#2a4048', 0.5)}" stroke="${INK}" stroke-width="1"/>` + Array.from({ length: 30 }, () => { const x = R() * W, y = HOR - 60 + R() * 56; return `<path d="M${f(x)} ${f(y)} q10 -6 20 0 q10 6 20 0" stroke="#d8e8e8" stroke-width="1" fill="none" opacity="0.5"/>`; }).join('')); },
    lighthouse: () => { const x = 1180; a.raw(`<path d="M${x - 30} ${HOR - 60} L${x - 20} 90 L${x + 20} 90 L${x + 30} ${HOR - 60} Z" fill="#c8c0b0" stroke="${INK}" stroke-width="2"/><path d="M${x - 26} 180 L${x + 26} 180 M${x - 24} 130 L${x + 24} 130" stroke="#8a2a24" stroke-width="10"/><rect x="${x - 18}" y="64" width="36" height="26" fill="#ffe680" stroke="${INK}" stroke-width="2"/>` + a.glow(x, 76, 160, '#ffe680', 0.5) + `<path d="M${x} 76 L${x - 600} 40 L${x - 600} 120 Z" fill="#fff4c0" opacity="0.08"/>`); },
    wreck_far: () => { a.raw(`<path d="M500 ${HOR - 20} C560 ${HOR - 120} 820 ${HOR - 120} 900 ${HOR - 50} L880 ${HOR} L520 ${HOR} Z" fill="#2a2420" stroke="${INK}" stroke-width="2" transform="rotate(-8 700 ${HOR})"/><path d="M700 ${HOR - 90} L760 40" stroke="#2a2420" stroke-width="8"/>`); },
    lantern_room: () => { const cx = W / 2; a.raw(a.glow(cx, 150, 300, '#ffe680', 0.5) + `<circle cx="${cx}" cy="150" r="70" fill="#fff4c0" stroke="${INK}" stroke-width="3"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${cx - 70 + i * 20} 80 L${cx - 70 + i * 20} 220" stroke="${INK}" stroke-width="2" opacity="0.6"/>`).join('') + D.arcs(cx, 150, 100, 4)); },
    hive_towers: () => { for (let i = 0; i < 7; i++) { const x = 100 + i * 210, h = 160 + R() * 120; a.raw(`<path d="M${x - 40} ${HOR} C${x - 50} ${HOR - h * 0.6} ${x - 10} ${HOR - h} ${x} ${HOR - h - 30} C${x + 10} ${HOR - h} ${x + 50} ${HOR - h * 0.6} ${x + 40} ${HOR} Z" fill="${mix(T, '#8a7a4a', 0.4)}" stroke="${INK}" stroke-width="1.6"/>` + Array.from({ length: 6 }, (_, k) => `<ellipse cx="${f(x + (R() - 0.5) * 40)}" cy="${f(HOR - R() * h)}" rx="5" ry="7" fill="#141008"/>`).join('')); } },
    honeycomb: () => { for (let r = 0; r < 8; r++) for (let i = 0; i < 26; i++) { const x = i * 58 + (r % 2) * 29, y = 20 + r * 34, p = Array.from({ length: 6 }, (_, k) => [x + Math.cos(k / 6 * 6.28) * 30, y + Math.sin(k / 6 * 6.28) * 22]); a.raw(`<path d="${poly(p)}" fill="${(i + r) % 5 ? '#4a3414' : '#a87a2a'}" opacity="${(i + r) % 5 ? 0.85 : 0.6}" stroke="${INK}" stroke-width="1.4"/>`); } },
    webs_far: () => { a.raw(`<g stroke="#d8d0b8" stroke-width="0.8" opacity="0.4" fill="none">` + Array.from({ length: 4 }, (_, j) => { const cx = 200 + j * 360, cy = 120; return Array.from({ length: 10 }, (_, i) => `<path d="M${cx} ${cy} L${f(cx + Math.cos(i / 10 * 6.28) * 160)} ${f(cy + Math.sin(i / 10 * 6.28) * 120)}"/>`).join('') + [40, 80, 120].map(r => `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.3}" ry="${r}"/>`).join(''); }).join('') + `</g>`); },
    cocoons_far: () => { for (let i = 0; i < 10; i++) { const x = 80 + i * 140; a.raw(`<path d="M${x} 0 L${x} 60" stroke="#d8d0b8" stroke-width="1"/><path d="${blob(x, 100, 30, R, 8, 0.2)}" fill="#c8c0a0" stroke="${INK}" stroke-width="1.2" transform="scale(1 1.5) translate(0 -34)"/>`); } },
    floating_isles: () => { for (const [x, y, w] of [[260, 120, 140], [700, 70, 200], [1180, 140, 160]]) {
      // torn-off rock: a flat top with a fallen colonnade, a jagged underside trailing roots and rubble
      const under = []; const n = 9; for (let i = 0; i <= n; i++) { const t = i / n, dx = (t - 0.5) * 2 * w, depth = (1 - Math.pow(Math.abs(t - 0.5) * 2, 1.6)) * w * 0.9; under.push([x + dx, y + depth * (0.7 + R() * 0.5)]); }
      const rock = mix(T, '#8a8478', 0.5);
      a.raw(`<path d="M${f(x - w)} ${y} L${f(x + w)} ${y} ${under.reverse().map(p => `L${f(p[0])} ${f(p[1])}`).join(' ')} Z" fill="${rock}" stroke="${INK}" stroke-width="1.6"/>` +
        `<path d="M${f(x - w * 0.2)} ${y} L${f(x + w * 0.9)} ${y} L${f(x + w * 0.3)} ${f(y + w * 0.8)} Z" fill="${a.hatchPat(60, 3, 0.6)}" opacity="0.6"/>` +
        Array.from({ length: 6 }, () => { const sx = x + (R() - 0.5) * w * 1.4; return `<path d="M${f(sx)} ${f(y + 20)} C${f(sx + 8)} ${f(y + w * 0.6)} ${f(sx - 6)} ${f(y + w * 0.9)} ${f(sx + 4)} ${f(y + w * (1 + R() * 0.4))}" stroke="${dark(rock, 0.4)}" stroke-width="2" fill="none"/>`; }).join('') +
        Array.from({ length: 4 }, () => { const sx = x + (R() - 0.5) * w * 0.8, sy = y + w * (1 + R()); return `<path d="${blob(sx, sy, 4 + R() * 6, R, 6, 0.3)}" fill="${rock}" stroke="${INK}" stroke-width="1"/>`; }).join('') +
        Array.from({ length: 4 }, (_, k) => { const cx2 = x - w * 0.7 + k * w * 0.45, h = 30 + R() * 40; return `<path d="M${f(cx2 - 5)} ${y} L${f(cx2 - 5)} ${f(y - h)} L${f(cx2 + 5)} ${f(y - h + 6)} L${f(cx2 + 5)} ${y} Z" fill="#d8d0c0" stroke="${INK}" stroke-width="1"/>`; }).join('') +
        `<path d="M${f(x - w * 0.8)} ${f(y - 2)} L${f(x + w * 0.8)} ${f(y - 2)}" stroke="#d8d0c0" stroke-width="4"/>`); } },
    fog: () => { for (let i = 0; i < 10; i++) a.raw(`<ellipse cx="${f(R() * W)}" cy="${f(HOR - 40 + R() * 40)}" rx="${f(200 + R() * 200)}" ry="${f(30 + R() * 20)}" fill="${L}" opacity="0.08"/>`); },
    stilt_huts: () => { for (const x of [300, 880, 1260]) a.raw(`<path d="M${x - 60} ${HOR - 70} L${x - 60} ${HOR} M${x + 60} ${HOR - 70} L${x + 60} ${HOR} M${x} ${HOR - 70} L${x} ${HOR}" stroke="#2a2018" stroke-width="6"/><path d="M${x - 80} ${HOR - 70} L${x + 80} ${HOR - 70} L${x + 70} ${HOR - 150} L${x - 70} ${HOR - 150} Z" fill="#3a3020" stroke="${INK}" stroke-width="2"/><path d="M${x - 100} ${HOR - 150} L${x} ${HOR - 220} L${x + 100} ${HOR - 150} Z" fill="#4a4030" stroke="${INK}" stroke-width="2"/><rect x="${x - 14}" y="${HOR - 130}" width="28" height="30" fill="#e8c060"/>` + a.glow(x, HOR - 115, 50, '#e8c060', 0.5)); },
    roots_wall: () => { for (let i = 0; i < 22; i++) { const x = R() * W; a.raw(`<path d="M${f(x)} 0 C${f(x + (R() - 0.5) * 100)} 100 ${f(x + (R() - 0.5) * 100)} 200 ${f(x + (R() - 0.5) * 60)} ${HOR}" stroke="${mix(T, '#2a2018', 0.5)}" stroke-width="${f(6 + R() * 14)}" fill="none"/>`); } },
    giant_mushrooms: () => { for (const [x, h, w] of [[240, 220, 140], [700, 260, 180], [1200, 200, 130]]) { a.raw(`<path d="M${x - 16} ${HOR} C${x - 10} ${HOR - h * 0.5} ${x - 24} ${HOR - h * 0.8} ${x - 10} ${HOR - h} L${x + 10} ${HOR - h} C${x + 24} ${HOR - h * 0.8} ${x + 10} ${HOR - h * 0.5} ${x + 16} ${HOR} Z" fill="#c8b8a0" stroke="${INK}" stroke-width="1.6"/><path d="M${x - w} ${HOR - h + 10} C${x - w} ${HOR - h - w * 0.8} ${x + w} ${HOR - h - w * 0.8} ${x + w} ${HOR - h + 10} C${x + w * 0.4} ${HOR - h - 10} ${x - w * 0.4} ${HOR - h - 10} ${x - w} ${HOR - h + 10} Z" fill="${mix('#8a6a8a', T, 0.3)}" stroke="${INK}" stroke-width="2"/>` + Array.from({ length: 8 }, () => `<circle cx="${f(x + (R() - 0.5) * w * 1.4)}" cy="${f(HOR - h - R() * w * 0.4)}" r="${f(4 + R() * 6)}" fill="${cfg.glow}" opacity="0.7"/>`).join('') + a.glow(x, HOR - h, w, cfg.glow, 0.2)); } },
    hedges: () => { for (let i = 0; i < 6; i++) { const x = i * 260; a.raw(`<path d="M${x} ${HOR} L${x} 140 C${x + 30} 110 ${x + 180} 110 ${x + 210} 140 L${x + 210} ${HOR} Z" fill="${mix(T, '#2a3a24', 0.5)}" stroke="${INK}" stroke-width="1.6"/>` + Array.from({ length: 20 }, () => `<circle cx="${f(x + R() * 210)}" cy="${f(140 + R() * 160)}" r="${f(3 + R() * 6)}" fill="${INK}" opacity="0.25"/>`).join('')); } },
    gas: () => { for (let i = 0; i < 12; i++) a.raw(`<path d="${blob(R() * W, 120 + R() * 160, 60 + R() * 80, R, 10, 0.3)}" fill="#b8c060" opacity="${f(0.06 + R() * 0.06)}"/>`); },
    mine_beams: () => { for (let i = 0; i < 5; i++) { const x = 120 + i * 300; a.raw(`<path d="M${x - 70} ${HOR} L${x - 60} 80 L${x + 60} 80 L${x + 70} ${HOR}" stroke="${INK}" stroke-width="20" fill="none"/><path d="M${x - 70} ${HOR} L${x - 60} 80 L${x + 60} 80 L${x + 70} ${HOR}" stroke="#5a4630" stroke-width="14" fill="none"/>` + `<path d="M${x} 80 L${x} 110" stroke="${INK}" stroke-width="2"/><rect x="${x - 8}" y="110" width="16" height="20" fill="#e8c060" stroke="${INK}" stroke-width="1.4"/>` + a.glow(x, 120, 60, '#e8c060', 0.5)); } },
    cages: () => { for (const x of [300, 740, 1180]) a.raw(`<path d="M${x} 0 L${x} 70" stroke="${INK}" stroke-width="2"/><path d="M${x - 30} 70 L${x + 30} 70 L${x + 30} 150 L${x - 30} 150 Z" fill="none" stroke="${INK}" stroke-width="3"/>` + [-15, 0, 15].map(d => `<path d="M${x + d} 70 L${x + d} 150" stroke="${INK}" stroke-width="2"/>`).join('') + `<path d="M${x - 10} 120 L${x - 6} 150 M${x + 6} 116 L${x + 4} 150" stroke="${G.bone}" stroke-width="3"/>`); },
  };
}

// ------------------------------------------------------------------ floors
function FLOOR(a, D, cfg, R) {
  const T = cfg.tint, L = cfg.light;
  const flags = (cols, glintCol) => { const vx = W / 2, rows = [HOR, 316, 336, 362, 396, 440, 480];
    for (let r = 0; r < rows.length - 1; r++) { const yA = rows[r], yB = rows[r + 1]; for (let k = -22; k <= 22; k++) { const sA = (yA - 230) / 220, sB = (yB - 230) / 220; const xa0 = vx + k * 110 * sA, xa1 = vx + (k + 1) * 110 * sA, xb0 = vx + k * 110 * sB, xb1 = vx + (k + 1) * 110 * sB;
      a.raw(`<path d="M${f(xa0)} ${yA} L${f(xa1)} ${yA} L${f(xb1)} ${yB} L${f(xb0)} ${yB} Z" fill="${cols[(k + r * 3 + 40) % cols.length]}" stroke="${INK}" stroke-width="1"/>`);
      if ((k * 7 + r * 5) % 5 === 0) a.raw(`<path d="M${f(xa0)} ${yA} L${f(xa1)} ${yA} L${f(xb1)} ${yB} L${f(xb0)} ${yB} Z" fill="${a.hatchPat(40, 2.6, 0.6)}" opacity="0.6"/>`); } } };
  const ground = (col, speck) => {
    a.raw(`<rect x="0" y="${HOR}" width="${W}" height="${H - HOR}" fill="${col}"/>` + `<rect x="0" y="${HOR}" width="${W}" height="${H - HOR}" fill="${a.hatchPat(-8, 4.2, 0.45)}" opacity="0.35"/>`);
    let o = '';
    for (let i = 0; i < 260; i++) { const y = HOR + 4 + Math.pow(R(), 0.8) * (H - HOR), sc = 0.3 + (y - HOR) / (H - HOR) * 1.3, x = R() * W, r = (2 + R() * 7) * sc;
      o += `<path d="${blob(x, y, r, R, 7, 0.35)}" fill="${mix(col, R() < 0.5 ? speck : '#d8ccb0', 0.25 + R() * 0.35)}" stroke="${INK}" stroke-width="${f(0.5 + sc * 0.4)}"/><path d="M${f(x - r * 0.8)} ${f(y + r * 0.6)} Q${f(x)} ${f(y + r * 1.2)} ${f(x + r)} ${f(y + r * 0.5)}" stroke="${INK}" stroke-width="${f(sc)}" opacity="0.5" fill="none"/>`; }
    for (let i = 0; i < 14; i++) { const x = R() * W, y = HOR + 20 + R() * 150; o += `<path d="M${f(x)} ${f(y)} l${f(30 + R() * 50)} ${f((R() - 0.5) * 12)} l${f(20 + R() * 30)} ${f((R() - 0.5) * 12)}" stroke="${INK}" stroke-width="1" fill="none" opacity="0.6"/>`; }
    a.raw(o);
  };
  const shade = () => a.raw(`<linearGradient id="flo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.4"/><stop offset="0.4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></linearGradient><rect x="0" y="${HOR}" width="${W}" height="${H - HOR}" fill="url(#flo)"/>`);
  const pools = (col, n = 6) => { for (let i = 0; i < n; i++) { const cx = 120 + R() * (W - 240), cy = 330 + R() * 130, rx = 60 + R() * 140, ry = rx * 0.12; a.raw(`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${col}" opacity="0.75"/><ellipse cx="${f(cx)}" cy="${f(cy - ry * 0.3)}" rx="${f(rx * 0.7)}" ry="${f(ry * 0.4)}" fill="none" stroke="${L}" stroke-width="0.8" opacity="0.5"/>`); } };
  return {
    stone: () => { flags(['#5a5850', '#4e4c46', '#625e54', '#56544c'].map(c => mix(c, T, 0.25))); shade(); },
    marble: () => { flags(['#c8c0b0', '#b0a898', '#d0c8b8', '#a8a090'].map(c => mix(c, T, 0.2))); a.raw(Array.from({ length: 30 }, () => { const x = R() * W, y = HOR + 10 + R() * 160; return `<path d="M${f(x)} ${f(y)} l${f(20 + R() * 40)} ${f((R() - 0.5) * 10)}" stroke="#6a6458" stroke-width="0.7" opacity="0.6"/>`; }).join('')); shade(); },
    tile: () => { flags(['#8a5a4a', '#c8b8a0', '#7a4a3a', '#b8a890'].map(c => mix(c, T, 0.2))); shade(); },
    tile_pool: () => { flags(['#8a5a4a', '#c8b8a0', '#7a4a3a', '#b8a890'].map(c => mix(c, T, 0.2))); a.raw(`<ellipse cx="${W / 2}" cy="400" rx="520" ry="56" fill="#5a7a78" stroke="${INK}" stroke-width="3"/><ellipse cx="${W / 2}" cy="396" rx="480" ry="44" fill="#7a9a98" opacity="0.6"/>` + Array.from({ length: 16 }, () => `<path d="${blob(W / 2 + (R() - 0.5) * 900, 390 + (R() - 0.5) * 50, 20 + R() * 30, R, 8, 0.3)}" fill="#e8e0d8" opacity="0.15"/>`).join('')); shade(); },
    iron: () => { flags(['#4a4642', '#3e3a38', '#524c46', '#46423e'].map(c => mix(c, T, 0.2))); a.raw(Array.from({ length: 40 }, () => a.rivet(R() * W, HOR + 10 + R() * 160, 2.2)).join('') + D.veins(200, 470, 700, 330, cfg.glow, 3) + D.veins(900, 340, 1300, 470, cfg.glow, 3)); shade(); },
    basalt: () => { ground(mix('#2a2624', T, 0.2), '#1a1614'); a.raw(D.veins(100, 460, 600, 320, '#ff7a2a', 3) + D.veins(800, 330, 1400, 470, '#ff7a2a', 3) + D.veins(500, 470, 900, 400, '#ff9a3a', 2)); shade(); },
    ice: () => { ground(mix('#b8ccd8', T, 0.25), '#e8f4f8'); a.raw(Array.from({ length: 30 }, () => { const x = R() * W, y = HOR + 10 + R() * 160; return `<path d="M${f(x)} ${f(y)} l${f(30 + R() * 60)} ${f((R() - 0.5) * 20)} l${f(20 + R() * 30)} ${f((R() - 0.5) * 20)}" stroke="#2a4058" stroke-width="0.9" fill="none" opacity="0.6"/>`; }).join('') + (cfg.glow === '#ff7a2a' || cfg.glow === '#ff9a4a' ? D.veins(300, 470, 700, 340, '#ff7a2a', 3) : '')); pools(mix('#8ab0c8', T, 0.2), 4); shade(); },
    snow: () => { ground(mix('#c8ccd0', T, 0.2), '#f4f8ff'); a.raw(Array.from({ length: 24 }, () => { const x = R() * W, y = HOR + 20 + R() * 150; return `<path d="M${f(x - 40)} ${f(y)} C${f(x - 10)} ${f(y - 8)} ${f(x + 10)} ${f(y - 8)} ${f(x + 40)} ${f(y)}" stroke="#8a94a0" stroke-width="1" fill="none" opacity="0.6"/>`; }).join('')); shade(); },
    ash: () => { ground(mix('#4a4440', T, 0.2), '#2a2420'); a.raw(D.embers(W / 2, 470, 1400, 60)); shade(); },
    rock: () => { ground(mix('#5a5040', T, 0.3), '#2a2418'); a.raw(Array.from({ length: 26 }, () => `<path d="${blob(R() * W, HOR + 20 + R() * 160, 8 + R() * 18, R, 8, 0.3)}" fill="${mix('#6a604a', T, 0.3)}" stroke="${INK}" stroke-width="1"/>`).join('')); shade(); },
    deck: () => { a.raw(`<rect x="0" y="${HOR}" width="${W}" height="${H - HOR}" fill="#5a4a38"/>` + Array.from({ length: 12 }, (_, i) => { const y = HOR + i * 16 + i * i * 0.6; return `<path d="M0 ${f(y)} L${W} ${f(y)}" stroke="${INK}" stroke-width="1.4"/>`; }).join('') + `<rect x="0" y="${HOR}" width="${W}" height="${H - HOR}" fill="url(#grain)" opacity="0.6"/>` + Array.from({ length: 8 }, () => a.stain(R() * W, HOR + 20 + R() * 160, 14 + R() * 20, '#a8b8c0', 0.25)).join('')); shade(); },
    water: () => { a.raw(`<rect x="0" y="${HOR}" width="${W}" height="${H - HOR}" fill="${mix('#3a4a44', T, 0.3)}"/>` + Array.from({ length: 60 }, () => { const x = R() * W, y = HOR + 6 + R() * 170; return `<path d="M${f(x)} ${f(y)} q14 -5 28 0 q14 5 28 0" stroke="${L}" stroke-width="0.8" fill="none" opacity="0.35"/>`; }).join('') + Array.from({ length: 16 }, () => `<path d="${blob(R() * W, HOR + 20 + R() * 150, 10 + R() * 30, R, 8, 0.4)}" fill="${mix('#5a5040', T, 0.3)}" stroke="${INK}" stroke-width="0.8"/>`).join('')); shade(); },
    mud: () => { ground(mix('#4a4030', T, 0.3), '#2a2218'); pools(mix('#3a4a30', T, 0.2), 7); shade(); },
    moss: () => { ground(mix('#4a4a34', T, 0.3), '#6a7a40'); a.raw(D.fungus(300, 400, 4, 0.8, '#a88ab8') + D.fungus(1100, 430, 5, 0.9, '#a88ab8') + D.spores(W / 2, 400, 600, 40)); shade(); },
    wax: () => { ground(mix('#8a6a2a', T, 0.3), '#c89a40'); a.raw(Array.from({ length: 20 }, () => a.drip(R() * W, HOR + R() * 140, 20 + R() * 30, 3, '#e8b040')).join('')); shade(); },
  };
}

// ------------------------------------------------------------------ mid props (two per prop type, mirrored to the sides)
function MID(a, D, cfg, R) {
  const T = cfg.tint, stone = mix(T, '#7a7468', 0.45), base = HOR + 26;
  const pillar = (x, w, col) => { a.shape({ d: `M${x - w / 2} ${base} L${x - w / 2} 20 L${x + w / 2} 20 L${x + w / 2} ${base} Z`, fill: col, depth: w * 0.45, mottle: 0.8, hatch: 80, hlOp: 0.15, lines: [`M${x - w * 0.2} 20 L${x - w * 0.2} ${base}`, `M${x + w * 0.15} 20 L${x + w * 0.15} ${base}`], decals: a.stain(x, base - 40, w * 0.6, G.black, 0.5) }); a.shape({ d: `M${x - w / 2 - 8} ${base - 12} L${x + w / 2 + 8} ${base - 12} L${x + w / 2 + 12} ${base} L${x - w / 2 - 12} ${base} Z`, fill: col, depth: 6, mottle: 0.6 }); };
  const at = (xs, fn) => xs.forEach((x, i) => fn(x, i));
  return {
    pillars: xs => at(xs, x => pillar(x, 56, stone)),
    pillars_iron: xs => at(xs, x => { pillar(x, 50, '#4a4642'); a.raw(Array.from({ length: 8 }, (_, i) => a.rivet(x - 18, 40 + i * 34, 2.4) + a.rivet(x + 18, 40 + i * 34, 2.4)).join('')); }),
    pillars_wood: xs => at(xs, x => { a.shape({ d: `M${x - 26} ${base} L${x - 22} 20 L${x + 22} 20 L${x + 26} ${base} Z`, fill: '#5a4632', tex: 'url(#grain)', texOp: 0.6, depth: 14, mottle: 0.6, hatch: 80 }); a.raw(`<path d="M${x - 20} 100 C${x} 120 ${x} 140 ${x - 20} 160" stroke="${INK}" stroke-width="2" fill="none"/>`); }),
    columns: xs => at(xs, x => pillar(x, 50, light(stone, 0.25))),
    columns_broken: xs => at(xs, x => { a.shape({ d: `M${x - 26} ${base} L${x - 26} ${120 + R() * 80} L${x - 6} ${100 + R() * 40} L${x + 10} ${140 + R() * 40} L${x + 26} ${110 + R() * 60} L${x + 26} ${base} Z`, fill: light(stone, 0.3), depth: 14, mottle: 0.7, hatch: 80, lines: [`M${x - 10} 160 L${x - 10} ${base}`, `M${x + 10} 160 L${x + 10} ${base}`] }); }),
    basalt: xs => at(xs, x => { for (let i = 0; i < 4; i++) { const bx = x - 50 + i * 30, h = 120 + R() * 140; a.shape({ d: poly([[bx - 14, base], [bx - 14, base - h], [bx, base - h - 8], [bx + 14, base - h], [bx + 14, base]]), fill: '#2e2a28', depth: 8, mottle: 0.6, hatch: 80, decals: D.veins(bx, base - h + 10, bx + 2, base, '#ff7a2a', 1.6) }); } }),
    crystals: xs => at(xs, x => a.raw(D.spikes(x, base, 6, 120, -Math.PI / 2, 1.2, cfg.glow === '#a47ae0' ? '#c8b8e8' : '#cfe6f4') + a.glow(x, base - 60, 80, cfg.glow, 0.25))),
    crystals_sulphur: xs => at(xs, x => a.raw(D.spikes(x, base, 7, 90, -Math.PI / 2, 1.4, '#d8c850') + a.glow(x, base - 40, 70, '#d8c040', 0.3))),
    braziers: xs => at(xs, x => { a.shape({ d: smooth([[x - 30, base - 90], [x + 30, base - 90], [x + 20, base - 60], [x - 20, base - 60]], true, 0.4), fill: '#4a4038', depth: 8, ink: 1.2 }); a.raw(`<path d="M${x - 14} ${base} L${x} ${base - 60} L${x + 14} ${base}" stroke="${INK}" stroke-width="5" fill="none"/>` + D.flame(x, base - 90, 70, 26, -0.1) + D.embers(x, base - 140, 80, 10)); }),
    anvils: xs => at(xs, x => { a.shape({ d: poly([[x - 60, base - 70], [x + 50, base - 70], [x + 70, base - 60], [x + 30, base - 50], [x + 20, base - 20], [x + 40, base], [x - 40, base], [x - 20, base - 20], [x - 30, base - 50]]), fill: '#3a3634', depth: 14, mottle: 0.5, hatch: 80, spec: [`M${x - 50} ${base - 68} L${x + 40} ${base - 68}`], specOp: 0.5 }); a.raw(D.embers(x, base - 80, 60, 8)); }),
    coils: xs => at(xs, x => { a.raw(`<path d="M${x} ${base} L${x} ${base - 180}" stroke="${INK}" stroke-width="14"/><path d="M${x} ${base} L${x} ${base - 180}" stroke="#8a6a3a" stroke-width="10"/>` + Array.from({ length: 10 }, (_, i) => `<ellipse cx="${x}" cy="${base - 40 - i * 13}" rx="22" ry="6" fill="none" stroke="#b8803a" stroke-width="4"/><ellipse cx="${x}" cy="${base - 40 - i * 13}" rx="22" ry="6" fill="none" stroke="${INK}" stroke-width="1"/>`).join('') + `<circle cx="${x}" cy="${base - 190}" r="16" fill="#c8a040" stroke="${INK}" stroke-width="1.6"/>` + D.arcs(x, base - 190, 50, 3)); }),
    statues: xs => at(xs, x => { a.shape({ d: smooth([[x - 30, base], [x - 34, base - 140], [x - 20, base - 190], [x, base - 200], [x + 20, base - 190], [x + 34, base - 140], [x + 30, base]], true, 0.6), fill: light(stone, 0.2), depth: 22, mottle: 0.8, hatch: 80, decals: a.stain(x, base - 80, 22, G.black, 0.5) }); a.shape({ d: blob(x, base - 222, 20, R, 8, 0.1), fill: light(stone, 0.2), depth: 8, mottle: 0.7, decals: `<path d="M${x - 8} ${base - 226} L${x + 8} ${base - 224}" stroke="${INK}" stroke-width="1.4"/>` }); a.raw(`<path d="M${x - 40} ${base} L${x + 40} ${base} L${x + 36} ${base - 16} L${x - 36} ${base - 16} Z" fill="${stone}" stroke="${INK}" stroke-width="1.2"/>`); }),
    candles: xs => at(xs, x => { for (let i = 0; i < 7; i++) { const cx = x - 50 + i * 16, h = 20 + R() * 40; a.raw(`<rect x="${cx - 4}" y="${base - h}" width="8" height="${h}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.8"/>` + a.drip(cx + 2, base - h, 12, 1.6, '#d8ccb0') + D.flame(cx, base - h, 14, 4).replace(/#c8481c/g, cfg.glow === '#a47ae0' ? '#3a2050' : '#c8481c')); } }),
    bones: xs => at(xs, x => { for (let i = 0; i < 14; i++) { const bx = x + (R() - 0.5) * 140, by = base - R() * 24; a.raw(i % 3 ? `<path d="M${f(bx - 14)} ${f(by)} L${f(bx + 14)} ${f(by - 4)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${f(bx - 14)} ${f(by)} L${f(bx + 14)} ${f(by - 4)}" stroke="${G.bone}" stroke-width="3.6" stroke-linecap="round"/>` : `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="9" ry="8" fill="${G.bone}" stroke="${INK}" stroke-width="0.8"/><circle cx="${f(bx - 3)}" cy="${f(by - 1)}" r="2" fill="${G.black}"/><circle cx="${f(bx + 3)}" cy="${f(by - 1)}" r="2" fill="${G.black}"/>`); } }),
    urns: xs => at(xs, x => a.shape({ d: smooth([[x - 20, base], [x - 34, base - 50], [x - 20, base - 90], [x + 20, base - 90], [x + 34, base - 50], [x + 20, base]], true, 0.6), fill: '#8a5a3a', depth: 18, mottle: 0.7, hatch: 80, lines: [`M${x - 30} ${base - 60} L${x + 30} ${base - 60}`], decals: a.stain(x, base - 40, 14, G.black, 0.4) })),
    cauldrons: xs => at(xs, x => { a.shape({ d: smooth([[x - 60, base - 80], [x + 60, base - 80], [x + 50, base - 20], [x, base], [x - 50, base - 20]], true, 0.6), fill: '#2e2a28', depth: 18, mottle: 0.5, hatch: 80 }); a.raw(`<ellipse cx="${x}" cy="${base - 80}" rx="60" ry="12" fill="#8a3a2a" stroke="${INK}" stroke-width="2"/>` + D.flame(x - 20, base, 30, 12) + D.flame(x + 20, base, 26, 10) + `<path d="${blob(x, base - 130, 40, R, 8, 0.3)}" fill="#e8e0d8" opacity="0.2"/>`); }),
    carts: xs => at(xs, x => { a.shape({ d: poly([[x - 60, base - 30], [x + 60, base - 30], [x + 70, base - 90], [x - 70, base - 90]]), fill: '#4a3a28', tex: 'url(#grain)', texOp: 0.6, depth: 12, mottle: 0.6 }); a.raw(`<circle cx="${x - 40}" cy="${base - 14}" r="16" fill="#2a2420" stroke="${INK}" stroke-width="2"/><circle cx="${x + 40}" cy="${base - 14}" r="16" fill="#2a2420" stroke="${INK}" stroke-width="2"/>` + D.spikes(x, base - 90, 5, 30, -Math.PI / 2, 1.2, '#d8c850')); }),
    beams: xs => at(xs, x => a.raw(`<path d="M${x - 40} ${base} L${x + 60} 40" stroke="${INK}" stroke-width="20"/><path d="M${x - 40} ${base} L${x + 60} 40" stroke="#5a4630" stroke-width="14"/>`)),
    stakes_near: xs => at(xs, x => { a.raw(`<path d="M${x} ${base} L${x} 60" stroke="${INK}" stroke-width="16"/><path d="M${x} ${base} L${x} 60" stroke="#3a2a20" stroke-width="11"/><path d="M${x - 40} 110 L${x + 40} 110" stroke="${INK}" stroke-width="10"/>` + D.flame(x, base, 110, 40)); a.shape({ d: smooth([[x - 16, 100], [x + 16, 100], [x + 20, 220], [x - 20, 220]], true, 0.5), fill: '#2a2220', depth: 10, mottle: 0.6, decals: D.veins(x - 10, 120, x + 6, 210, '#ff7a2a', 1.6) }); }),
    gears: xs => at(xs, (x, i) => { const cx = x, cy = 150, r = 60 + i * 10; a.raw(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${G.gold}" stroke="${INK}" stroke-width="2"/>` + Array.from({ length: 14 }, (_, k) => { const t = k / 14 * 6.28; return `<rect x="${f(cx + Math.cos(t) * r - 6)}" y="${f(cy + Math.sin(t) * r - 6)}" width="12" height="12" fill="${G.gold}" stroke="${INK}" stroke-width="1.2" transform="rotate(${f(t * 57.3)} ${f(cx + Math.cos(t) * r)} ${f(cy + Math.sin(t) * r)})"/>`; }).join('') + `<circle cx="${cx}" cy="${cy}" r="${r * 0.3}" fill="${G.black}"/>` + D.icicles(cx - r, cx + r, cy + r, 6, 24) + `<path d="M${cx} ${cy + r} L${cx} ${base}" stroke="${INK}" stroke-width="10"/>`); }),
    masts: xs => at(xs, x => { a.raw(`<path d="M${x} ${base} L${x} 0 M${x - 90} 70 L${x + 90} 70" stroke="${INK}" stroke-width="14"/><path d="M${x} ${base} L${x} 0 M${x - 90} 70 L${x + 90} 70" stroke="#4a3a2a" stroke-width="10"/><path d="M${x - 80} 74 C${x - 60} 160 ${x + 60} 150 ${x + 80} 74 Z" fill="#a8a090" opacity="0.8" stroke="${INK}" stroke-width="1.6"/>` + D.icicles(x - 90, x + 90, 74, 9, 30)); }),
    barrels: xs => at(xs, x => { for (const dx of [-30, 20]) a.shape({ d: smooth([[x + dx - 22, base], [x + dx - 26, base - 30], [x + dx - 22, base - 60], [x + dx + 22, base - 60], [x + dx + 26, base - 30], [x + dx + 22, base]], true, 0.6), fill: '#5a4632', tex: 'url(#grain)', texOp: 0.6, depth: 12, mottle: 0.6, lines: [`M${x + dx - 26} ${base - 18} L${x + dx + 26} ${base - 18}`, `M${x + dx - 26} ${base - 44} L${x + dx + 26} ${base - 44}`] }); }),
    whale_bones: xs => at(xs, x => { for (let i = 0; i < 5; i++) a.raw(`<path d="M${x - 60 + i * 30} ${base} C${x - 80 + i * 30} ${base - 120} ${x - 20 + i * 30} ${base - 200} ${x + 30 + i * 30} ${base - 220}" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${x - 60 + i * 30} ${base} C${x - 80 + i * 30} ${base - 120} ${x - 20 + i * 30} ${base - 200} ${x + 30 + i * 30} ${base - 220}" stroke="${G.bone}" stroke-width="8" fill="none" stroke-linecap="round"/>`); }),
    standing_stones: xs => at(xs, x => a.shape({ d: smooth([[x - 30, base], [x - 36, base - 120], [x - 20, base - 200], [x + 16, base - 190], [x + 34, base - 110], [x + 30, base]], true, 0.6), fill: mix(stone, '#5a5a50', 0.4), depth: 20, mottle: 0.8, hatch: 80, decals: `<path d="M${x - 10} ${base - 160} l10 20 l-6 20 l12 16 M${x} ${base - 100} l-10 14 l10 14" stroke="${cfg.glow}" stroke-width="2.4" fill="none" opacity="0.8"/>` + a.stain(x, base - 50, 20, G.algae, 0.5) })),
    sarcophagi: xs => at(xs, x => { a.shape({ d: poly([[x - 80, base], [x - 80, base - 50], [x + 80, base - 50], [x + 80, base]]), fill: stone, depth: 14, mottle: 0.7, hatch: 80 }); a.shape({ d: smooth([[x - 86, base - 50], [x - 60, base - 80], [x + 60, base - 80], [x + 86, base - 50]], true, 0.4), fill: light(stone, 0.2), depth: 10, mottle: 0.6, decals: `<path d="M${x - 40} ${base - 66} L${x + 40} ${base - 66}" stroke="${INK}" stroke-width="2"/>` }); a.raw(`<path d="M${x + 50} ${base - 52} q20 -10 30 0" stroke="${INK}" stroke-width="3" fill="${G.black}"/>`); }),
    rocks: xs => at(xs, x => a.shape({ d: blob(x, base - 30, 60, R, 10, 0.3), fill: mix(stone, '#4a4a40', 0.4), depth: 20, mottle: 0.7, hatch: 80, decals: a.stain(x, base - 10, 30, G.algae, 0.6) })),
    wreck: xs => at(xs, x => { a.shape({ d: smooth([[x - 100, base], [x - 80, base - 80], [x + 40, base - 110], [x + 100, base - 60], [x + 90, base]], true, 0.5), fill: '#3a3028', tex: 'url(#grain)', texOp: 0.6, depth: 20, mottle: 0.6 }); a.raw(`<path d="M${x - 40} ${base - 90} L${x - 70} 60" stroke="${INK}" stroke-width="10"/><path d="M${x - 40} ${base - 90} L${x - 70} 60" stroke="#4a3a2a" stroke-width="6"/>`); }),
    webs: xs => at(xs, x => a.raw(`<g stroke="#d8d0b8" stroke-width="0.9" opacity="0.6" fill="none">` + Array.from({ length: 9 }, (_, i) => `<path d="M${x} 120 L${f(x + Math.cos(i / 9 * 6.28) * 140)} ${f(120 + Math.sin(i / 9 * 6.28) * 120)}"/>`).join('') + [40, 80, 120].map(r => `<ellipse cx="${x}" cy="120" rx="${r * 1.1}" ry="${r}"/>`).join('') + `</g>`)),
    hive_cells: xs => at(xs, x => { for (let i = 0; i < 6; i++) { const cx = x - 40 + (i % 3) * 40, cy = base - 30 - Math.floor(i / 3) * 34; a.raw(`<path d="${poly(Array.from({ length: 6 }, (_, k) => [cx + Math.cos(k / 6 * 6.28) * 22, cy + Math.sin(k / 6 * 6.28) * 18]))}" fill="#8a6a2a" stroke="${INK}" stroke-width="2"/><ellipse cx="${cx}" cy="${cy}" rx="10" ry="8" fill="#e8b040" opacity="0.8"/>`); } }),
    cocoons: xs => at(xs, x => { for (const dx of [-30, 30]) { a.raw(`<path d="M${x + dx} 0 L${x + dx} 120" stroke="#d8d0b8" stroke-width="1.4"/>`); a.shape({ d: smooth([[x + dx, 110], [x + dx + 24, 160], [x + dx + 16, 240], [x + dx, 260], [x + dx - 16, 240], [x + dx - 24, 160]], true, 0.6), fill: '#c8c0a0', depth: 14, mottle: 0.6, hatch: 80, lines: Array.from({ length: 6 }, (_, k) => `M${x + dx - 22} ${140 + k * 20} Q${x + dx} ${150 + k * 20} ${x + dx + 22} ${140 + k * 20}`), decals: a.stain(x + dx, 200, 10, G.blood, 0.5) }); } }),
    reeds: xs => at(xs, x => a.raw(Array.from({ length: 16 }, () => { const rx = x + (R() - 0.5) * 120, h = 60 + R() * 100; return `<path d="M${f(rx)} ${base} Q${f(rx + 6)} ${f(base - h * 0.6)} ${f(rx + (R() - 0.5) * 20)} ${f(base - h)}" stroke="#3a4024" stroke-width="3" fill="none"/>` + (R() < 0.3 ? `<ellipse cx="${f(rx)}" cy="${f(base - h)}" rx="4" ry="12" fill="#4a3020"/>` : ''); }).join(''))),
    dead_trees_near: xs => at(xs, x => { let o = `M${x} ${base} C${x - 10} 200 ${x + 14} 120 ${x} 0`; for (let i = 0; i < 5; i++) { const y = 60 + i * 40, sg = i % 2 ? 1 : -1; o += ` M${x} ${y} q${sg * 40} -20 ${sg * (60 + R() * 40)} ${-30 - R() * 30}`; } a.raw(`<path d="${o}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="${o}" stroke="#3a3024" stroke-width="11" fill="none" stroke-linecap="round"/>` + D.fungus(x + 10, 220, 3, 0.8)); }),
    mushrooms: xs => at(xs, x => { a.raw(D.fungus(x, base - 4, 6, 1.6, '#a88ab8') + a.glow(x, base - 30, 70, cfg.glow, 0.3)); a.shape({ d: smooth([[x - 8, base], [x - 6, base - 80], [x + 6, base - 80], [x + 8, base]], true, 0.4), fill: '#c8b8a0', depth: 4 }); a.shape({ d: smooth([[x - 50, base - 76], [x, base - 120], [x + 50, base - 76], [x, base - 84]], true, 0.6), fill: '#7a5a7a', depth: 12, mottle: 0.6, decals: D.spores(x, base - 100, 40, 12) }); }),
    cages_hang: xs => at(xs, x => a.raw(`<path d="M${x} 0 L${x} 80" stroke="${INK}" stroke-width="2"/><path d="M${x - 30} 80 L${x + 30} 80 L${x + 30} 170 L${x - 30} 170 Z" fill="none" stroke="${INK}" stroke-width="3"/>` + [-15, 0, 15].map(d => `<path d="M${x + d} 80 L${x + d} 170" stroke="${INK}" stroke-width="2"/>`).join('') + `<path d="M${x - 10} 130 L${x - 6} 170 M${x + 6} 120 L${x + 4} 170" stroke="${G.bone}" stroke-width="3"/>`)),
  };
}

const only = process.argv.slice(2);
for (const k of Object.keys(ROOMS)) if (!only.length || only.some(o => k.startsWith(o))) room(k);
console.log(Object.keys(ROOMS).filter(k => !only.length || only.some(o => k.startsWith(o))).join(' '));
module.exports = { ROOMS };
