// Godric, the Cellarer. Sixties, heavy-set and stooped, hugging a bundle of candles to his chest. A lay brother's short
// habit over layer on layer of wool, a stained leather apron, mittens with the two empty fingers sewn shut, a huge ring of
// store keys, candles tied in bundles at the belt, a tally stick behind the ear. A knitted cap pulled to the brows, a red
// nose, white stubble, worried eyes. Faces left. Canvas 560 x 860, ground 830.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const a = new Art(560, 860, 7741), R = a.R;
const K = require('./keeperkit')(a);
const DETAIL = process.env.PASS !== 'base';
const SKIN = '#c4927a', HAB = '#5a5044', WOOL1 = '#6a5a46', WOOL2 = '#4e4a44', MITT = '#7a6a52', WAX = '#e0d4b0';

a.raw(a.ground(270, 830, 170, 12));
a.raw('<g transform="rotate(-10 280 830)">');
// legs: thick wool hose, wrapped in rags at the shins, old boots
for (const [hip, knee, ank, toe] of [[[234, 640], [222, 720], [222, 796], [172, 822]], [[300, 640], [312, 722], [316, 796], [266, 826]]]) {
  a.limb([hip, knee, ank], [66, 56, 46], { fill: WOOL2, depth: 10, mottle: 0.5, hatch: 70, tex: 'url(#weave)', texOp: 0.5, grime: 0.6 });
  for (let k = 0; k < 4; k++) a.raw(`<path d="M${f(knee[0] - 26)} ${f(knee[1] + 18 + k * 13)} q26 ${f(6 + R() * 6)} 52 ${f(-4 + R() * 6)}" stroke="${INK}" stroke-width="5" fill="none"/><path d="M${f(knee[0] - 26)} ${f(knee[1] + 18 + k * 13)} q26 ${f(6 + R() * 6)} 52 ${f(-4 + R() * 6)}" stroke="#7a6e5a" stroke-width="3" fill="none"/>`);
  a.shape({ d: smooth([[ank[0] + 24, ank[1] - 10], [ank[0] + 26, ank[1] + 28], [toe[0] - 2, toe[1] + 4], [toe[0] - 12, toe[1] - 10], [ank[0] - 24, ank[1] - 2]], true, 0.4), fill: G.leatherD, depth: 8, hatch: 20, ink: 2.2, grime: 0.7 });
}
// the layers: a long under-tunic showing below the short habit, then the habit, bulked by wool beneath
a.shape({ d: smooth([[160, 600], [370, 596], [384, 690], [300, 704], [220, 706], [150, 690]], true, 0.4), fill: WOOL1, depth: 12, ink: 2, hatch: 70, mottle: 0.5, grime: 0.6, tex: 'url(#weave)', texOp: 0.4, lines: [{ d: 'M156 688 l10 -8 l8 10 l12 -8 l10 9 l14 -7', w: 1, op: 0.6 }] });
K.habit({ cx: 266, sh: 330, sw: 126, waist: 480, hem: 652, flare: 1.12, col: HAB, dirt: 0.3, folds: [[-0.7, -0.05], [-0.3, 0.04], [0.15, -0.03], [0.55, 0.05], [0.82, 0.08]] });
// the belly under it all, and a stained leather apron tied high over it
a.shape({ d: smooth([[184, 420], [256, 400], [330, 410], [378, 470], [372, 560], [320, 610], [220, 612], [178, 570], [168, 490]], true, 0.5), fill: G.leatherD, depth: 24, ink: 2.4, hatch: 60, mottle: 0.55, grime: 0.7,
  decals: a.stain(270, 520, 40, '#1a120a', 0.5) + a.stain(310, 580, 22, '#3a1e10', 0.5) + a.stain(220, 470, 18, '#6a5a3a', 0.4) + a.fold(230, 430, 220, 600, 7) + a.fold(330, 430, 344, 600, 6) });
// the belt with its load: candles tied in bundles, a great ring of store keys at the near hip
a.shape({ d: smooth([[176, 556], [376, 548], [378, 568], [178, 578]], true, 0.3), fill: '#3a2a1c', depth: 4, ink: 1.8, hatch: 20, core: false });
for (const bx of [190, 214]) {
  for (let k = 0; k < 5; k++) a.raw(`<rect x="${f(bx - 9 + k * 4)}" y="${f(574 + (k % 2) * 3)}" width="4.6" height="${f(50 + (k % 3) * 6)}" rx="1.5" fill="${WAX}" stroke="${INK}" stroke-width="1"/>`);
  a.raw(`<path d="M${bx - 11} 586 l24 0" stroke="${INK}" stroke-width="3"/><path d="M${bx - 11} 586 l24 0" stroke="#8a7a5a" stroke-width="1.6"/>`);
}
K.keys(360, 588, 1.25, 8);

// ---------------------------------------------------------------- head: hunched forward on a thick neck, the cowl bunched
K.cowl(268, 330, 176, dark(HAB, 0.12));
// a woollen scarf wound round and round
a.shape({ d: smooth([[208, 318], [258, 304], [312, 316], [318, 344], [262, 350], [206, 344]], true, 0.4), fill: '#6a3a2a', depth: 8, ink: 1.8, hatch: 60, mottle: 0.5, tex: 'url(#weave)', texOp: 0.6,
  lines: [{ d: 'M214 326 Q262 318 312 330', w: 1.2, op: 0.7 }, { d: 'M212 336 Q262 330 314 340', w: 1, op: 0.6 }] });
const F = K.face({ x: 236, y: 266, k: 1.04, skin: SKIN, age: 0.85, nose: 'round', brow: 0.6, mouth: 'frown', eye: 'open', cheek: 0.6, brow: 0.2, jaw: 1.18, browCol: '#c8c4bc', stubble: '#d8d4cc', iris: '#4a4a3a' });
// the red nose, the worry lines, the brows pushed up in the middle
a.raw(a.stain(...F.p(-38, 6), 8, '#b03a2a', 0.65) + `<path d="M${F.p(-30, -24).join(' ')} Q${F.p(-20, -30).join(' ')} ${F.p(-10, -24).join(' ')}" stroke="${INK}" stroke-width="1" fill="none" opacity="0.7"/><path d="M${F.p(-28, -30).join(' ')} Q${F.p(-20, -35).join(' ')} ${F.p(-12, -30).join(' ')}" stroke="${INK}" stroke-width="0.9" fill="none" opacity="0.6"/>`);
K.hair(F, 'cap', '#7a6040', 1.04);
// the knit: vertical ribs and a turned-up band
a.raw(Array.from({ length: 11 }, (_, i) => { const u = -28 + i * 6.4; return `<path d="M${F.p(u, -18).join(' ')} Q${F.p(u + 2, -40).join(' ')} ${F.p(u * 0.5 + 10, -58).join(' ')}" stroke="${INK}" stroke-width="1" fill="none" opacity="0.55"/>`; }).join('') + `<path d="M${F.p(-32, -14).join(' ')} Q${F.p(2, -8).join(' ')} ${F.p(40, -12).join(' ')}" stroke="#5a4428" stroke-width="7" fill="none"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${F.p(-30 + i * 5, -17).join(' ')} l0 6" stroke="${INK}" stroke-width="0.9" opacity="0.7"/>`).join(''));
// worry: the brows pushed up and together, eyes wide
// the tally stick behind the ear
a.raw(`<path d="M${F.p(6, -34).join(' ')} L${F.p(40, 26).join(' ')}" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M${F.p(6, -34).join(' ')} L${F.p(40, 26).join(' ')}" stroke="#c8a870" stroke-width="7" stroke-linecap="round"/>` + [0, 1, 2, 3, 4].map(i => { const p0 = F.p(13 + i * 4.4, -15 + i * 7.6); return `<path d="M${f(p0[0] - 3)} ${f(p0[1] + 2)} l5 -3" stroke="${INK}" stroke-width="1.2"/>`; }).join(''));

// ---------------------------------------------------------------- arms wrapped round the candles held to the chest
const mitten = (x, y, s, ang, missing) => {
  const c = Math.cos(ang), sn = Math.sin(ang), q = (u, v) => [x + (c * u - sn * v) * s, y + (sn * u + c * v) * s];
  a.shape({ d: smooth([q(-12, -14), q(18, -16), q(34, -8), q(36, 8), q(18, 16), q(-12, 14)], true, 0.5), fill: MITT, depth: 6, ink: 1.8, hatch: 70, mottle: 0.5, tex: 'url(#weave)', texOp: 0.6,
    lines: missing ? [{ d: `M${q(20, -6).map(f).join(' ')} L${q(34, -4).map(f).join(' ')}`, w: 1.4 }, { d: `M${q(22, 2).map(f).join(' ')} L${q(34, 4).map(f).join(' ')}`, w: 1.4 }, ...[0, 1, 2, 3].map(i => ({ d: `M${q(24 + i * 3, -9).map(f).join(' ')} l1 4`, w: 0.9 }))] : [{ d: `M${q(14, -14).map(f).join(' ')} Q${q(22, 0).map(f).join(' ')} ${q(14, 14).map(f).join(' ')}`, w: 1, op: 0.6 }] });
  a.shape({ d: smooth([q(-4, -20), q(6, -26), q(14, -22), q(10, -14)], true, 0.5), fill: MITT, depth: 3, ink: 1.4, hatch: 70 });
  // the finger stalls: two full, two flat and sewn across with big black stitches
  for (let i = 0; i < 4; i++) { const v = -10 + i * 7, flat = missing && i >= 2, a0 = q(30, v), a1 = q(flat ? 38 : 48, v + 1);
    a.raw(`<path d="M${a0.map(f).join(' ')} L${a1.map(f).join(' ')}" stroke="${INK}" stroke-width="${f((flat ? 6 : 9) * s)}" stroke-linecap="round"/><path d="M${a0.map(f).join(' ')} L${a1.map(f).join(' ')}" stroke="${flat ? dark(MITT, 0.25) : MITT}" stroke-width="${f((flat ? 3.6 : 6.4) * s)}" stroke-linecap="round"/>` +
      (flat ? [0, 1, 2].map(j => { const c = q(33 + j * 2, v); return `<path d="M${f(c[0] - 3)} ${f(c[1] - 3)} l6 6" stroke="${INK}" stroke-width="1.6"/>`; }).join('') : '')); }
};
// far arm: under the bundle, forearm across the belly
K.arm({ sh: [184, 352], el: [176, 456], wr: [262, 452], col: HAB, w: 1.3, skin: SKIN, hand: false, hatch: 120, wide: 0.8 });
// the bundle: two dozen candles tied with twine, held upright against the chest
{
  const cx = 250, cy = 400;
  let c = '';
  for (let k = 0; k < 14; k++) { const x = cx - 40 + k * 6 + (R() - 0.5) * 2, top = cy - 66 - (k % 3) * 6 - R() * 6; c += `<rect x="${f(x)}" y="${f(top)}" width="6.4" height="${f(cy + 52 - top)}" rx="2" fill="${mix(WAX, '#a8987a', R() * 0.4)}" stroke="${INK}" stroke-width="1.1"/><path d="M${f(x + 3.2)} ${f(top)} l0 -5" stroke="${INK}" stroke-width="1.2"/>`; }
  a.raw(c);
  for (const yy of [cy - 30, cy + 22]) a.raw(`<path d="M${cx - 44} ${yy} Q${cx} ${yy + 6} ${cx + 46} ${yy}" stroke="${INK}" stroke-width="4" fill="none"/><path d="M${cx - 44} ${yy} Q${cx} ${yy + 6} ${cx + 46} ${yy}" stroke="#8a7a5a" stroke-width="2.2" fill="none"/>`);
}
mitten(258, 452, 1.2, -0.2, true);
// near arm: over the bundle, mitten clutching it to him
K.arm({ sh: [350, 352], el: [354, 448], wr: [268, 404], col: HAB, w: 1.32, skin: SKIN, hand: false, hatch: 120, wide: 0.8 });
mitten(262, 404, 1.25, -0.55, false);
if (DETAIL) {
  // wax drips down the habit front, a darn, a frayed hem of the under-tunic, breath fog
  a.raw(Array.from({ length: 5 }, () => { const x = 200 + R() * 110, y = 470 + R() * 100; return `<path d="M${f(x)} ${f(y)} q1 ${f(6 + R() * 8)} -1 ${f(12 + R() * 10)}" stroke="${WAX}" stroke-width="3" stroke-linecap="round" opacity="0.75"/>`; }).join(''));
  a.raw(`<path d="M300 380 l6 4 l-3 6 l8 4 l-4 6" stroke="#8a7a62" stroke-width="1.4" fill="none"/>`);
  a.raw(`<g opacity="0.35"><path d="${blob(...F.p(-48, 26), 10, R, 8, 0.4)}" fill="#d8dce0"/><path d="${blob(...F.p(-62, 18), 7, R, 7, 0.4)}" fill="#d8dce0"/></g>`);
}
a.raw('</g>');
fs.mkdirSync('grim/keepers', { recursive: true });
fs.writeFileSync(`grim/keepers/godric${DETAIL ? '' : '_base'}.svg`, a.svg());
console.log('godric', DETAIL ? 'detail' : 'base');
