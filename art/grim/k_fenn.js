// Brother Fenn, the Almoner. Round and soft, leaning over his counter with his hands spread on the ledger.
// A habit of better wool than anyone's, dyed a shade darker, with fur-trimmed cuffs (his vanity); a fat purse and a
// counting board of beads at the belt; spectacles on a cord; a seal ring. A glossy tonsure, a ruddy round face with a
// double chin, a cheerful mouth and small calculating eyes. Faces left. Canvas 560 x 860, ground 830.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const a = new Art(560, 860, 6113), R = a.R;
const K = require('./keeperkit')(a);
const DETAIL = process.env.PASS !== 'base';
const SKIN = '#cf9a80', HAB = '#3a2a1e', FUR = '#8a7458', HAIR = '#5a4a3a';

a.raw(a.ground(270, 830, 170, 12));
a.raw('<g transform="rotate(-8 280 830)">');
// feet in soft good leather shoes
for (const [x, t] of [[230, 196], [310, 266]]) a.shape({ d: smooth([[x + 18, 800], [x + 22, 826], [t - 4, 828], [t - 12, 818], [x - 18, 806]], true, 0.4), fill: '#3a281a', depth: 6, hatch: 20, ink: 1.8, spec: [`M${t + 4} 816 L${x} 812`], specOp: 0.4 });
// the habit: wide, well cut, falling in heavy folds over the belly
K.habit({ cx: 268, sh: 330, sw: 122, waist: 500, hem: 812, flare: 1.08, col: HAB, dirt: 0, folds: [[-0.75, -0.04], [-0.35, 0.03], [0.05, -0.03], [0.45, 0.04], [0.78, 0.06]] });
// the belly: a great round of wool pushing out before him, the belt riding under it
a.shape({ d: smooth([[166, 420], [220, 390], [300, 392], [356, 420], [374, 490], [356, 560], [290, 588], [214, 584], [168, 548], [154, 490]], true, 0.5), fill: mix(HAB, '#7a6a52', 0.2), depth: 30, ink: 2, hatch: 70, mottle: 0.4, grime: 0.15, tex: 'url(#weave)', texOp: 0.25,
  decals: a.fold(200, 440, 186, 560, 7) + a.fold(330, 430, 346, 560, 7), spec: ['M210 420 Q250 404 300 408'], specOp: 0.25 });
// the belt: a good leather girdle with a brass buckle, under the belly
a.shape({ d: smooth([[164, 566], [372, 552], [374, 574], [166, 588]], true, 0.3), fill: '#4a3020', depth: 4, ink: 1.8, hatch: 20, core: false, decals: `<rect x="252" y="560" width="20" height="22" fill="none" stroke="${G.gold}" stroke-width="3"/>` });
// the fat purse at the near hip: a soft leather bag swollen with coin, drawstring knotted
a.shape({ d: smooth([[340, 576], [370, 574], [392, 610], [388, 654], [358, 666], [330, 650], [326, 610]], true, 0.5), fill: '#6a4a2a', depth: 12, ink: 2, hatch: 60, mottle: 0.5, spec: ['M344 600 Q356 592 372 600'], specOp: 0.35,
  lines: [{ d: 'M340 590 Q358 598 376 588', w: 1.4 }, { d: 'M346 630 q6 6 14 2', w: 0.9, op: 0.6 }] });
a.raw(`<path d="M358 576 l-6 -14 M362 576 l8 -12" stroke="${INK}" stroke-width="2"/>`);
// the counting board at the far hip: a little frame of wires strung with beads
{
  const x = 180, y = 596, w = 52, h = 40;
  a.raw(`<path d="M${x + 10} 584 L${x + 12} ${y}" stroke="${INK}" stroke-width="1.6"/>`);
  a.shape({ d: `M${x} ${y} L${x + w} ${y + 2} L${x + w - 2} ${y + h} L${x - 2} ${y + h - 2} Z`, fill: '#5a3e26', depth: 4, ink: 1.8, hatch: 20, core: false });
  let b = '';
  for (let r = 0; r < 4; r++) { const yy = y + 8 + r * 8; b += `<path d="M${x + 4} ${yy} L${x + w - 4} ${yy + 1}" stroke="${INK}" stroke-width="0.9"/>`; for (let k = 0; k < 5; k++) { const bx = x + 8 + (k + (r % 2 ? 2 : 0)) * 6 + (k > 2 ? 8 : 0); if (bx < x + w - 6) b += `<circle cx="${bx}" cy="${yy}" r="2.8" fill="${r % 2 ? '#8a2a1a' : '#c8b890'}" stroke="${INK}" stroke-width="0.8"/>`; } }
  a.raw(b);
}
// a key and the badge on a chain over the belly
K.badge(232, 470, 1.1);

// ---------------------------------------------------------------- shoulders, the cowl, the head
K.cowl(272, 326, 168, dark(HAB, 0.08));
a.limb([[262, 340], [256, 322]], [70, 66], { fill: SKIN, depth: 10, mottle: 0.5, hatch: 120 });
const F = K.face({ x: 244, y: 270, k: 1.14, skin: SKIN, age: 0.45, nose: 'round', brow: 0.35, mouth: 'smile', eye: 'narrow', cheek: 0.9, jaw: 1.28, browCol: '#4a3a2a', iris: '#2a2a1a' });
// the double chin and the fat of the neck folding over the collar
a.shape({ d: smooth([F.p(-26, 44), F.p(-14, 58), F.p(6, 62), F.p(22, 50), F.p(18, 40), F.p(2, 50), F.p(-14, 50)], true, 0.5), fill: SKIN, depth: 6, ink: 1.4, hatch: 120, mottle: 0.5, decals: a.stain(...F.p(-4, 56), 8, '#a86a5a', 0.4) });
// small eyes pushed up by the cheeks: a fold under each, laugh lines
a.raw(`<path d="M${F.p(-26, -3).join(' ')} Q${F.p(-18, 2).join(' ')} ${F.p(-10, -3).join(' ')}" stroke="${INK}" stroke-width="1.2" fill="none"/><path d="M${F.p(-8, -6).join(' ')} l5 -3 M${F.p(-8, -2).join(' ')} l6 0" stroke="${INK}" stroke-width="0.9"/>`);
K.hair(F, 'tonsure', HAIR, 1.14);
// jowls: the round of the cheek swelling over the jaw line
a.shape({ d: smooth([F.p(-30, 14), F.p(-20, 8), F.p(-6, 16), F.p(4, 34), F.p(-4, 48), F.p(-20, 50), F.p(-30, 38)], true, 0.5), fill: SKIN, depth: 5, ink: 0, hatch: 120, mottle: 0.4, hl: false, decals: a.stain(...F.p(-18, 20), 12, '#c06a5a', 0.45) });
a.raw(`<path d="M${F.p(-6, 18).join(' ')} Q${F.p(4, 34).join(' ')} ${F.p(-6, 46).join(' ')}" stroke="${INK}" stroke-width="1.2" fill="none" opacity="0.7"/>`);
// the glossy crown
a.raw(`<path d="M${F.p(-14, -46).join(' ')} Q${F.p(-2, -52).join(' ')} ${F.p(10, -48).join(' ')}" stroke="#fff4e4" stroke-width="3" fill="none" opacity="0.6"/><ellipse cx="${f(F.p(-4, -42)[0])}" cy="${f(F.p(-4, -42)[1])}" rx="7" ry="3" fill="#fff4e4" opacity="0.5"/>`);
// spectacles on a cord, hanging on his chest
a.raw(`<path d="M${F.p(-20, 56).join(' ')} Q214 380 214 404 M${F.p(14, 46).join(' ')} Q256 390 246 404" stroke="${INK}" stroke-width="1" fill="none"/>`);
for (const cx of [212, 240]) a.raw(`<circle cx="${cx}" cy="410" r="9" fill="#8a9a9a" fill-opacity="0.35" stroke="${INK}" stroke-width="2"/><path d="M${cx - 4} 406 l4 -3" stroke="#e8f0f0" stroke-width="1.4" opacity="0.8"/>`);
a.raw(`<path d="M221 410 l10 0" stroke="${INK}" stroke-width="2"/>`);

// ---------------------------------------------------------------- arms: forward and down, hands spread flat on the ledger, fur at the cuffs
const furCuff = (el, wr, w) => {
  const ang = Math.atan2(wr[1] - el[1], wr[0] - el[0]) + Math.PI / 2, l = Math.hypot(wr[0] - el[0], wr[1] - el[1]), x = wr[0] - (wr[0] - el[0]) / l * 4, y = wr[1] - (wr[1] - el[1]) / l * 4 + 8;
  let o = '';
  const n = 16;
  for (let i = 0; i < n * 2; i++) { const t = (i % n) / (n - 1), row = i < n ? -4 : 4, px = x + Math.cos(ang) * (t - 0.5) * w, py = y + Math.sin(ang) * (t - 0.5) * w; const qx = px + Math.cos(ang - Math.PI / 2) * row, qy = py + Math.sin(ang - Math.PI / 2) * row; o += `<path d="${blob(qx, qy, 6 + R() * 3, R, 6, 0.45)}" fill="${mix(FUR, R() < 0.5 ? '#c8b494' : '#3a2a1a', R() * 0.35)}" stroke="${INK}" stroke-width="0.8"/>`; }
  a.raw(o);
};
K.arm({ sh: [176, 352], el: [136, 444], wr: [100, 516], col: HAB, w: 1.25, skin: SKIN, hand: 'rest', dir: [-1, 0.2], hatch: 120, wide: 1.2 });
furCuff([136, 444], [100, 516], 76);
K.arm({ sh: [350, 350], el: [330, 452], wr: [250, 520], col: HAB, w: 1.3, skin: SKIN, hand: 'rest', dir: [-1, 0.18], hatch: 120, wide: 1.2 });
furCuff([330, 452], [250, 520], 80);
// the seal ring on the near hand, an ink-stained thumb
a.raw(`<rect x="210" y="516" width="9" height="7" rx="2" fill="${G.gold}" stroke="${INK}" stroke-width="1.4"/><circle cx="228" cy="506" r="4" fill="#1a1a2a" opacity="0.7"/>`);
if (DETAIL) {
  // the sleeve's better wool shows a fine twill and a single darn he would deny
  a.raw(`<path d="M300 400 l8 4 l-2 6 l8 4" stroke="${mix(HAB, '#8a7a5a', 0.5)}" stroke-width="1.2" fill="none"/>` + a.stain(330, 470, 10, '#1a1008', 0.4));
  // a drip of candle wax on the belly, crumbs
  a.raw(`<path d="M290 470 q2 6 0 10" stroke="#e8dcc0" stroke-width="3" stroke-linecap="round" opacity="0.8"/>` + Array.from({ length: 6 }, () => `<circle cx="${f(220 + R() * 80)}" cy="${f(420 + R() * 60)}" r="1.4" fill="#c8b48a" opacity="0.8"/>`).join(''));
}
a.raw('</g>');
fs.mkdirSync('grim/keepers', { recursive: true });
fs.writeFileSync(`grim/keepers/fenn${DETAIL ? '' : '_base'}.svg`, a.svg());
console.log('fenn', DETAIL ? 'detail' : 'base');
