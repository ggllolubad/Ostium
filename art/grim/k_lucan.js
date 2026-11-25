// Brother Lucan, the Armarius. Tall, thin and stooped over his slanted desk, a quill raised. Linen oversleeves tied over
// the grey habit to the elbow; an ink horn, a pen-knife, pumice and a wax tablet at the belt; a quill behind the ear.
// Reading lenses on the nose, a thin face, a neat grey tonsure, raised eyebrows. Ink-black fingertips. Faces left.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const a = new Art(560, 860, 8263), R = a.R;
const K = require('./keeperkit')(a);
const DETAIL = process.env.PASS !== 'base';
const SKIN = '#c8a890', HAB = '#5a5854', SLEEVE = '#c8bea4', INKC = '#141418';

a.raw(a.ground(270, 830, 130, 10));
a.raw('<g transform="rotate(-10 280 830)">');
for (const [x, t] of [[244, 210], [300, 266]]) a.shape({ d: smooth([[x + 14, 812], [x + 16, 828], [t - 6, 830], [t - 10, 822], [x - 12, 814]], true, 0.4), fill: '#3a2e24', depth: 4, hatch: 20, ink: 1.6 });
K.habit({ cx: 272, sh: 262, sw: 84, waist: 450, hem: 816, flare: 1.18, col: HAB, dirt: 0.1, folds: [[-0.7, -0.05], [-0.3, 0.03], [0.1, -0.02], [0.5, 0.04], [0.8, 0.06]] });
K.scapular(268, 276, 780, 28, dark(HAB, 0.12));
// belt: ink horn, pen-knife, pumice, wax tablet
K.rope(204, 344, 448, '#6a5a44', 60);
{
  const ix = 214, iy = 470;
  a.shape({ d: smooth([[ix - 8, iy - 18], [ix + 8, iy - 18], [ix + 6, iy + 10], [ix - 2, iy + 22], [ix - 8, iy + 8]], true, 0.4), fill: '#d8c8a0', depth: 4, ink: 1.6, hatch: 60, lines: [{ d: `M${ix - 7} ${iy - 12} l14 0`, w: 1.2 }] });
  a.raw(`<path d="M${ix + 18} 456 L${ix + 22} 506" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${ix + 18} 456 L${ix + 20} 480" stroke="${G.wood}" stroke-width="3"/><path d="M${ix + 20} 480 L${ix + 22} 506" stroke="${G.steelL}" stroke-width="2.6"/>`);
  a.shape({ d: 'M300 460 L334 458 L336 504 L302 506 Z', fill: '#6a4a2a', depth: 4, ink: 1.6, hatch: 20, core: false, decals: `<rect x="306" y="464" width="24" height="36" fill="#b8a060" opacity="0.8"/><path d="M310 474 l14 0 M310 482 l12 0 M310 490 l15 0" stroke="${INK}" stroke-width="0.8"/>` });
}
// the long neck, the head pushed forward over the desk
K.cowl(274, 258, 116, dark(HAB, 0.1));
a.limb([[262, 266], [250, 232]], [40, 36], { fill: SKIN, depth: 8, mottle: 0.4, hatch: 120, lines: [{ d: 'M256 236 Q262 246 258 256', w: 0.9, op: 0.6 }] });
// the habit's collar standing up round the neck
a.shape({ d: smooth([[222, 270], [238, 236], [266, 232], [286, 244], [292, 272], [258, 280]], true, 0.4), fill: dark(HAB, 0.15), depth: 8, ink: 1.8, hatch: 70, mottle: 0.4, lines: [{ d: 'M236 244 Q262 238 284 250', w: 1, op: 0.6 }] });
const F = K.face({ x: 232, y: 186, k: 0.96, skin: SKIN, age: 0.55, nose: 'hook', brow: 0.3, mouth: 'thin', eye: 'narrow', cheek: 0.1, jaw: 0.9, browCol: '#8a8680' });
K.hair(F, 'tonsure', '#8a8680', 0.96);
// eyebrows raised high, a deep forehead crease; reading lenses on the nose
a.raw(`<path d="M${F.p(-32, -24).join(' ')} Q${F.p(-22, -32).join(' ')} ${F.p(-8, -26).join(' ')}" stroke="#6a6660" stroke-width="2.4" fill="none"/><path d="M${F.p(-26, -38).join(' ')} Q${F.p(-14, -42).join(' ')} ${F.p(0, -38).join(' ')}" stroke="${INK}" stroke-width="0.9" fill="none" opacity="0.6"/>`);
{ const c = F.p(-26, -4); a.raw(`<circle cx="${f(c[0])}" cy="${f(c[1])}" r="8" fill="#a8b8b8" fill-opacity="0.3" stroke="${INK}" stroke-width="1.8"/><path d="M${f(c[0] + 8)} ${f(c[1] - 2)} L${f(F.p(16, -4)[0])} ${f(F.p(16, -4)[1])}" stroke="${INK}" stroke-width="1.2"/><path d="M${f(c[0] - 4)} ${f(c[1] - 4)} l3 -2" stroke="#e8f0f0" stroke-width="1.4"/>`); }
// the quill behind the ear
a.raw(`<path d="${smooth([F.p(12, -6), F.p(30, -30), F.p(46, -60)], false, 0.5)}" stroke="${INK}" stroke-width="3" fill="none"/><path d="${smooth([F.p(20, -18), F.p(32, -36), F.p(46, -60), F.p(40, -36)], true, 0.5)}" fill="#e8e0d0" stroke="${INK}" stroke-width="1"/>`);

// ---------------------------------------------------------------- arms: the far hand flat on the page, the near hand raising the quill
const oversleeve = (el, wr, w) => { const dx = wr[0] - el[0], dy = wr[1] - el[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
  const q = (u, v) => [el[0] + ux * u * l + nx * v * w, el[1] + uy * u * l + ny * v * w];
  a.shape({ d: smooth([q(-0.05, 1.05), q(0.5, 0.95), q(0.92, 0.75), q(0.92, -0.75), q(0.5, -0.95), q(-0.05, -1.05)], true, 0.4), fill: SLEEVE, depth: 6, ink: 1.6, hatch: 60, mottle: 0.4, grime: 0.4,
    lines: [{ d: `M${q(0.08, 1).map(f).join(' ')} L${q(0.08, -1).map(f).join(' ')}`, w: 2, col: '#8a7a5a' }, { d: `M${q(0.88, 0.8).map(f).join(' ')} L${q(0.88, -0.8).map(f).join(' ')}`, w: 2, col: '#8a7a5a' }],
    decals: a.stain(...q(0.7, 0.2), 8, INKC, 0.5) });
};
K.arm({ sh: [208, 276], el: [176, 372], wr: [120, 436], col: HAB, w: 0.9, skin: SKIN, hand: false, hatch: 120, wide: 0.7 });
oversleeve([176, 372], [124, 432], 20);
K.hand([120, 436], SKIN, [-1, 0.35], 1.05, 'rest', `<rect x="128" y="436" width="12" height="20" fill="${INKC}" opacity="0.7"/>`);
K.arm({ sh: [326, 278], el: [336, 384], wr: [222, 452], col: HAB, w: 0.92, skin: SKIN, hand: false, hatch: 120, wide: 0.7 });
oversleeve([336, 384], [228, 448], 20);
K.hand([222, 452], SKIN, [-1, 0.5], 1.05, 'grip');
// the raised quill, its nib black and wet
a.raw(`<path d="M206 474 L236 408" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="${smooth([[226, 432], [238, 400], [256, 360], [244, 396], [234, 426]], true, 0.4)}" fill="#e8e0d0" stroke="${INK}" stroke-width="1"/><path d="M206 474 l-3 7" stroke="${INKC}" stroke-width="2.6" stroke-linecap="round"/>`);
if (DETAIL) {
  // ink everywhere on him: fingertips, a smear on the jaw, spatter down the scapular
  a.raw(`<g>${[[118, 440], [104, 446]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${INKC}" opacity="0.85"/>`).join('')}</g>` + a.stain(...F.p(-6, 40), 6, INKC, 0.4) +
    Array.from({ length: 10 }, () => `<circle cx="${f(250 + R() * 36)}" cy="${f(320 + R() * 160)}" r="${f(0.8 + R() * 1.8)}" fill="${INKC}" opacity="0.7"/>`).join(''));
  a.raw(`<path d="M${F.p(-40, 10).join(' ')} l-2 6" stroke="#fff" stroke-width="1" opacity="0.5"/>`);
}
a.raw('</g>');
fs.mkdirSync('grim/keepers', { recursive: true });
fs.writeFileSync(`grim/keepers/lucan${DETAIL ? '' : '_base'}.svg`, a.svg());
console.log('lucan', DETAIL ? 'detail' : 'base');
