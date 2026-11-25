// Sister Wenna, the Infirmarer. Broad and square, forties, leaning on her treatment table with both hands, weight forward.
// Habit sleeves rolled and pinned above the elbow; a linen apron stained rust-brown; a vinegar cloth knotted at the throat;
// herb bundles, a bone saw and a bandage roll at the belt; the waxed leather plague mask of the Barrow hanging at her hip.
// Wimple tied back hard; a tired, kind, sunken-eyed face. Frost-scarred grey-green fingertips. Faces left. 560 x 860, ground 830.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const a = new Art(560, 860, 2207), R = a.R;
const K = require('./keeperkit')(a);
const DETAIL = process.env.PASS !== 'base';
const SKIN = '#c49a7c', HAB = '#46423c', LINEN = '#b9ae94', WIMPLE = '#d6ccb4', VINEGAR = '#94844c', FROST = '#8a9a8a';

a.raw(a.ground(270, 830, 160, 12));
// the whole figure leans forward over the table: everything is drawn in a group tipped about the feet
a.raw('<g transform="rotate(-7 280 830)">');
const lean = s => s;

// ---------------------------------------------------------------- far arm first (her right, the leading edge), hand flat on the table
const frostTips = (wr, dir) => '';

// ---------------------------------------------------------------- legs and habit
for (const [hip, ank, toe] of [[[236, 600], [226, 800], [184, 822]], [[300, 600], [306, 800], [262, 824]]]) {
  a.shape({ d: smooth([[ank[0] + 18, ank[1] - 6], [ank[0] + 22, ank[1] + 24], [toe[0] + 6, toe[1] + 2], [toe[0] - 8, toe[1] - 8], [ank[0] - 18, ank[1] + 2]], true, 0.4), fill: G.leatherD, depth: 7, hatch: 20, ink: 1.9, grime: 0.6 });
}
K.habit({ cx: 266, sh: 322, sw: 124, waist: 470, hem: 808, flare: 1.16, col: HAB, dirt: 0.2, folds: [[-0.7, -0.08], [-0.3, 0.05], [0.1, -0.04], [0.5, 0.06], [0.8, 0.1]] });
// the linen apron, bib to the shins, stained rust-brown where hands were wiped
a.shape({ d: smooth([[212, 352], [300, 348], [312, 470], [338, 520], [346, 770], [300, 786], [236, 788], [190, 776], [186, 520], [204, 470]], true, 0.3), fill: LINEN, depth: 20, ink: 2.2, hatch: 60, mottle: 0.5, grime: 0.45,
  decals: a.stain(300, 540, 34, '#6a2a14', 0.6) + a.stain(318, 600, 22, '#5a2010', 0.55) + a.stain(240, 660, 30, '#6a3018', 0.45) + a.stain(280, 740, 40, '#3a2a1a', 0.45) +
    (DETAIL ? a.stain(226, 420, 14, '#6a2a14', 0.5) + Array.from({ length: 14 }, () => `<circle cx="${f(200 + R() * 140)}" cy="${f(480 + R() * 290)}" r="${f(1 + R() * 2.4)}" fill="#5a1a0c" opacity="0.7"/>`).join('') + a.drip(306, 560, 30, 3, '#5a2010') : '') +
    a.fold(228, 480, 220, 770, 8) + a.fold(290, 480, 310, 780, 8) + a.fold(258, 520, 262, 780, 6),
  lines: [{ d: 'M200 470 L310 470', w: 1.2, op: 0.7 }] });
// straps over the shoulders
a.raw(`<path d="M218 356 L194 318 M296 352 L326 316" stroke="${INK}" stroke-width="6"/><path d="M218 356 L194 318 M296 352 L326 316" stroke="${dark(LINEN, 0.15)}" stroke-width="3.6"/>`);
// the belt: a plain leather strap with its load
a.shape({ d: smooth([[168, 462], [362, 458], [364, 478], [166, 482]], true, 0.2), fill: G.leatherD, depth: 4, ink: 1.8, hatch: 20, core: false });
{
  // herb bundles hung head-down: sage, rue, yarrow, tied with thread
  for (const [x, col] of [[186, '#6a7a52'], [206, '#5a6a44'], [226, '#7a7a4a']]) {
    a.raw(`<path d="M${x} 474 L${x} 486" stroke="${INK}" stroke-width="1.2"/>`);
    a.shape({ d: smooth([[x - 4, 486], [x + 4, 486], [x + 10, 520], [x + 2, 548], [x - 8, 546], [x - 12, 518]], true, 0.4), fill: col, depth: 5, ink: 1.2, hatch: 70, mottle: 0.4,
      lines: [0, 1, 2, 3].map(i => ({ d: `M${x - 6 + i * 4} 492 l${f(-3 + i * 2)} 50`, w: 0.7, op: 0.6 })).concat([{ d: `M${x - 5} 490 l10 0`, w: 2, col: '#c8b890' }]) });
  }
  // the bone saw: an open-frame saw hung by its grip, blade down, teeth outward
  a.raw(`<path d="M258 478 L258 500" stroke="${INK}" stroke-width="2"/>`);
  a.shape({ d: 'M250 500 L268 500 L270 520 L248 520 Z', fill: G.wood, depth: 3, ink: 1.6, tex: 'url(#grain)', texOp: 0.5 });
  a.raw(`<path d="M252 520 L240 604 L270 604 L266 520" fill="none" stroke="${INK}" stroke-width="5"/><path d="M252 520 L240 604 L270 604 L266 520" fill="none" stroke="${G.iron}" stroke-width="2.8"/>` +
    `<path d="M243 600 L252 524 L258 524 L250 600 Z" fill="${G.steelL}" stroke="${INK}" stroke-width="1.2"/>` + Array.from({ length: 13 }, (_, i) => `<path d="M${f(243.4 + i * 0.7)} ${f(596 - i * 5.6)} l-4 -1.5 l3.6 -3" stroke="${INK}" stroke-width="1.1" fill="${G.steelL}"/>`).join(''));
  // a roll of bandage and a pair of shears
  a.shape({ d: smooth([[280, 480], [306, 480], [308, 506], [282, 508]], true, 0.6), fill: '#d8d0bc', depth: 4, ink: 1.4, hatch: 120, lines: [{ d: 'M284 486 Q294 482 304 486 M284 494 Q294 490 304 494 M284 502 Q294 498 304 502', w: 0.7, op: 0.6 }],
    decals: a.stain(298, 500, 6, '#6a2a14', 0.5) });
  a.raw(`<path d="M290 508 Q296 530 288 546" stroke="${INK}" stroke-width="1.4" fill="none"/>`);
}
// the Barrow plague mask, hung by its strap at her near hip: waxed leather, a long stitched beak pointing down, round glass eyes
{
  const mx = 350, my = 512;
  a.raw(`<path d="M340 474 Q344 494 ${mx} ${my - 18}" stroke="${INK}" stroke-width="3.4" fill="none"/><path d="M340 474 Q344 494 ${mx} ${my - 18}" stroke="${G.leatherD}" stroke-width="2" fill="none"/>`);
  a.shape({ d: smooth([[mx - 22, my - 16], [mx + 4, my - 26], [mx + 26, my - 12], [mx + 24, my + 14], [mx + 10, my + 40], [mx + 4, my + 82], [mx - 2, my + 96], [mx - 6, my + 80], [mx - 12, my + 40], [mx - 24, my + 12]], true, 0.4), fill: '#5c4028', depth: 12, ink: 2, hatch: 60, mottle: 0.5, grime: 0.5,
    spec: [`M${mx - 14} ${my - 10} Q${mx} ${my - 18} ${mx + 14} ${my - 10}`, `M${mx + 2} ${my + 30} L${mx + 1} ${my + 80}`], specOp: 0.45,
    lines: [{ d: `M${mx - 10} ${my + 22} L${mx} ${my + 92} M${mx + 12} ${my + 20} L${mx + 2} ${my + 92}`, w: 1, op: 0.7 }, ...Array.from({ length: 8 }, (_, i) => ({ d: `M${mx - 3} ${my + 28 + i * 8} l6 0`, w: 0.9 }))] });
  for (const ex of [mx - 10, mx + 12]) a.raw(`<circle cx="${ex}" cy="${my + 2}" r="8" fill="#2a3230" stroke="${INK}" stroke-width="2.4"/><circle cx="${ex}" cy="${my + 2}" r="6" fill="none" stroke="${G.gold}" stroke-width="1.4"/><path d="M${ex - 3} ${my - 1} l3 -2" stroke="#b8d0c8" stroke-width="1.6" opacity="0.7"/>`);
}

// ---------------------------------------------------------------- shoulders, neck, the vinegar cloth, head
K.cowl(268, 318, 150, dark(HAB, 0.1));
a.limb([[256, 330], [250, 298]], [56, 52], { fill: SKIN, depth: 10, mottle: 0.5, hatch: 120, decals: a.stain(258, 322, 16, dark(SKIN, 0.4), 0.55) });
const F = K.face({ x: 240, y: 246, k: 1.0, skin: SKIN, age: 0.32, nose: 'straight', brow: 0.55, mouth: 'set', eye: 'narrow', cheek: 0.25, jaw: 1.08, browCol: '#5a4a3a',
  scars: [] });
// sunken eyes: hollow shadow under the brow and a dark crescent beneath
a.raw(a.stain(...F.p(-18, -6), 11, '#3a2018', 0.5) + `<path d="M${F.p(-25, -1).join(' ')} Q${F.p(-18, 3).join(' ')} ${F.p(-11, -1).join(' ')}" stroke="#4a2a20" stroke-width="1.4" fill="none" opacity="0.8"/>`);
// the mouth pulled a little to one side: the humour, kept to herself
a.raw(`<path d="M${F.p(-14, 27).join(' ')} q3 -2 5 -5" stroke="${INK}" stroke-width="1.3" fill="none"/>`);
K.wimple(F, WIMPLE, '#2e2a26', 1.0);
// the vinegar cloth: a yellowed rag knotted at the throat over the wimple's chin band
a.shape({ d: smooth([[208, 300], [246, 296], [282, 306], [286, 322], [246, 318], [210, 320]], true, 0.4), fill: VINEGAR, depth: 5, ink: 1.6, hatch: 60, mottle: 0.5, grime: 0.4, decals: a.stain(240, 312, 10, '#7a6020', 0.5) });
a.shape({ d: smooth([[224, 314], [240, 312], [244, 326], [236, 350], [228, 356], [218, 340]], true, 0.4), fill: dark(VINEGAR, 0.08), depth: 4, ink: 1.4, hatch: 60, lines: [{ d: 'M228 318 L230 350', w: 0.8, op: 0.6 }] });
a.raw(`<circle cx="236" cy="316" r="6" fill="${dark(VINEGAR, 0.15)}" stroke="${INK}" stroke-width="1.6"/>`);

// ---------------------------------------------------------------- arms: both reach forward and down, palms flat on the table's edge
const tips = (hand, s = 1) => '';
K.arm({ sh: [172, 344], el: [140, 432], wr: [110, 500], col: HAB, w: 1.15, skin: SKIN, rolled: true, hand: 'rest', dir: [-1, 0.28], hatch: 120,
  foreDecals: a.stain(128, 470, 8, '#6a2a14', 0.4) + (DETAIL ? `<path d="M136 452 q-6 10 -12 14" stroke="${dark(SKIN, 0.35)}" stroke-width="1" fill="none"/>` : '') });
K.arm({ sh: [350, 344], el: [324, 438], wr: [252, 504], col: HAB, w: 1.2, skin: SKIN, rolled: true, hand: 'rest', dir: [-1, 0.22], hatch: 120,
  foreDecals: a.stain(290, 470, 10, '#6a2a14', 0.45) + (DETAIL ? `<path d="M304 452 q-10 6 -24 10 M296 470 q-10 4 -20 6" stroke="${dark(SKIN, 0.35)}" stroke-width="1" fill="none"/>` : '') });
// the pins that hold the rolled sleeves, and the frost-scarred fingertips
if (DETAIL) {
  for (const [x, y] of [[150, 430], [318, 434]]) a.raw(`<path d="M${x - 10} ${y - 6} L${x + 10} ${y + 2}" stroke="${INK}" stroke-width="2.4"/><path d="M${x - 10} ${y - 6} L${x + 10} ${y + 2}" stroke="#c8c4b8" stroke-width="1.2"/>`);
  // grey-green frost at the fingertips: the Hollow Barrow's mark
  for (const [x, y] of [[80, 512], [222, 513]]) a.raw(Array.from({ length: 4 }, (_, i) => `<circle cx="${f(x + (R() - 0.5) * 6)}" cy="${f(y - 8 + i * 5)}" r="3.2" fill="${FROST}" opacity="0.75"/>`).join(''));
  // a smear of blood up the near forearm, and the apron's corner tucked into the belt
  a.raw(a.stain(282, 486, 7, G.blood, 0.55));
}
a.raw('</g>');

fs.mkdirSync('grim/keepers', { recursive: true });
fs.writeFileSync(`grim/keepers/wenna${DETAIL ? '' : '_base'}.svg`, a.svg());
console.log('wenna', DETAIL ? 'detail' : 'base');
