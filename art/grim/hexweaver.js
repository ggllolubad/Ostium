// Grim Hexweaver: hunched curse-binder in a funeral rag-cloak hung with poppets, teeth and knotted hair.
// Black veins crawl from the mouth; a dead crow rides the shoulder. One hand drives a nail into a
// stitched doll; the other cups a sickly green-black flame.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const a = new Art(460, 700, 83);
const R = a.R;
const A = require('./anatomy')(a);
const ragged = (x0, x1, y, n, amp) => { const o = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([x + (R() - 0.5) * 5, y + (i % 2 ? amp * (0.5 + R() * 0.9) : R() * 6)]); } return o; };

a.layer('shadow');
a.raw(a.ground(230, 676, 130, 10));
a.layer('body', [230, 400]);
// ---------------------------------------------------------------- rag cloak, hunched
{
  const hem = ragged(318, 128, 640, 16, 30);
  a.shape({ d: smooth([[190, 210], [250, 186], [300, 210], [318, 300], [322, 450], ...hem, [132, 460], [148, 320], [164, 250]], true, 0.45), fill: G.greenD, depth: 40, mottle: 0.5, fine: true, grime: 0.3, hatch: 60,
    decals: a.fold(186, 260, 150, 640, 8) + a.fold(226, 250, 210, 650, 8) + a.fold(270, 250, 270, 650, 8) + a.fold(300, 280, 314, 640, 7) +
      a.stain(220, 600, 30, G.black, 0.5) + a.stain(280, 520, 18, G.bloodD, 0.5) });
  // feet: wrapped, toes blackened
  for (const x of [206, 262]) a.shape({ d: smooth([[x, 650], [x + 30, 650], [x + 42, 664], [x + 40, 678], [x - 2, 678]], true, 0.5), fill: '#6a6050', depth: 5, mottle: 0.6, lines: [`M${x + 6} 654 L${x + 4} 676`, `M${x + 16} 652 L${x + 14} 676`] });
  // hanging charms along the cloak: poppets, teeth on cords, knotted hair
  const charms = [[160, 380], [184, 440], [300, 400], [312, 470], [150, 520]];
  for (const [x, y] of charms) {
    a.raw(`<path d="M${x} ${y - 30} L${x} ${y}" stroke="${INK}" stroke-width="0.8"/>`);
    a.shape({ d: smooth([[x - 5, y], [x + 5, y], [x + 6, y + 10], [x + 9, y + 22], [x + 3, y + 22], [x, y + 14], [x - 3, y + 22], [x - 9, y + 22], [x - 6, y + 10]], true, 0.5), fill: G.parchD, depth: 4, core: false, ink: 0.9,
      lines: [`M${x - 4} ${y + 8} L${x + 4} ${y + 8}`], after: `<path d="M${x - 2} ${y + 3} l1.5 1.5 m0 -1.5 l-1.5 1.5 M${x + 1.5} ${y + 3} l1.5 1.5 m0 -1.5 l-1.5 1.5" stroke="${INK}" stroke-width="0.6"/>` });
  }
  a.raw([[230, 300], [236, 304], [242, 306], [248, 306], [254, 304]].map(([x, y]) => `<path d="M${x} ${y} l2 7 l2 -7 Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.6"/>`).join('') + `<path d="M226 298 C238 306 250 306 258 300" stroke="${INK}" stroke-width="0.7" fill="none"/>`);
}
a.layer('arm', [284, 240]);
// ---------------------------------------------------------------- far hand: green-black flame
{
  A.sleeve({ sh: [284, 240], el: [314, 284], wr: [340, 298], fill: G.greenD, bell: 26, hang: 18, hatch: 80 });
  A.hand([340, 298], [1, -0.25], '#a89c88', 0.9, true);
  a.raw(`<path d="M352 292 C356 296 358 300 356 306 M362 290 C364 296 366 300 364 306" stroke="${G.black}" stroke-width="0.9" fill="none"/>`);
  a.raw(`<circle cx="356" cy="262" r="26" fill="${G.slime}" opacity="0.15"/>` +
    `<path d="M356 288 C334 272 346 248 338 228 C356 238 366 252 360 266 C372 258 374 244 370 232 C388 252 382 276 356 288 Z" fill="${G.slime}" stroke="${INK}" stroke-width="1"/>` +
    `<path d="M356 282 C348 270 354 258 350 248 C362 256 364 268 358 280 Z" fill="${G.black}"/>` +
    `<path d="M352 226 C348 212 356 204 350 192 M364 230 C368 218 362 210 368 200" stroke="${G.slime}" stroke-width="0.8" fill="none" opacity="0.6"/>`);
}
a.layer('head', [260, 220]);
// ---------------------------------------------------------------- head: gaunt, veined, under a cowl; dead crow on the shoulder
{
  const face = smooth([[244, 150], [274, 146], [290, 162], [298, 178], [292, 184], [292, 196], [282, 210], [264, 214], [248, 206], [240, 180]], true, 0.6);
  a.shape({ d: face, fill: '#a89c88', depth: 16, mottle: 0.8, fine: true, hatch: 70,
    lines: ['M282 168 C288 174 292 178 297 180', { d: 'M276 198 C282 198 286 198 290 196', w: 1.1 }, { d: 'M262 180 C266 192 266 202 262 212', w: 0.7 }],
    decals: `<g stroke="${G.black}" stroke-width="0.9" fill="none">` + [[284, 198], [278, 200]].map(([x, y]) => `<path d="M${x} ${y} C${x - 6} ${y + 6} ${x - 14} ${y + 6} ${x - 20} ${y + 14} M${x - 10} ${y + 6} C${x - 12} ${y + 12} ${x - 16} ${y + 12} ${x - 18} ${y + 18}"/>`).join('') + `</g>` });
  // black eyes under the cowl's shadow
  a.raw(`<path d="M244 150 L294 158 C292 170 284 176 274 176 C260 176 248 170 244 164 Z" fill="${G.black}" opacity="0.7"/><ellipse cx="280" cy="168" rx="3.4" ry="2.2" fill="${G.black}"/><circle cx="281" cy="167.4" r="0.6" fill="${G.slime}"/>`);
  a.shape({ d: smooth([[222, 156], [244, 120], [284, 116], [306, 142], [298, 150], [276, 138], [252, 142], [244, 176], [252, 216], [228, 226], [214, 196]], true, 0.6), fill: G.black, depth: 16, mottle: 0.5, hatch: 30, lines: ['M232 150 C224 176 224 200 232 220'] });
  // crow, dead and stiff, lashed to the shoulder
  a.shape({ d: smooth([[196, 196], [226, 186], [244, 196], [240, 210], [214, 216], [190, 214], [176, 206]], true, 0.6), fill: G.black, depth: 8, mottle: 0.4,
    lines: ['M200 206 L230 200', 'M196 212 L226 206'], lineCol: '#5a5048' });
  a.shape({ d: smooth([[236, 188], [252, 184], [258, 192], [248, 198]], true, 0.6), fill: G.black, depth: 4, core: false, after: `<path d="M256 190 L270 194 L256 196 Z" fill="${G.iron}" stroke="${INK}" stroke-width="0.7"/><path d="M246 190 l2 2 m0 -2 l-2 2" stroke="#d8ccaa" stroke-width="0.7"/>` });
  a.raw(`<path d="M196 214 L192 226 M202 214 L200 228" stroke="${G.iron}" stroke-width="1.2"/>`);
}
a.layer('near', [214, 236]);
// ---------------------------------------------------------------- near hand: nail into a stitched poppet
{
  A.sleeve({ sh: [214, 236], el: [196, 288], wr: [210, 322], fill: G.greenD, bell: 24, hang: 12, hatch: 30 });
  // poppet
  a.shape({ d: smooth([[222, 300], [238, 298], [242, 312], [256, 316], [254, 324], [242, 324], [246, 352], [238, 352], [232, 336], [226, 352], [218, 352], [222, 324], [208, 324], [208, 316], [220, 312]], true, 0.4),
    fill: '#b8a88a', depth: 6, mottle: 0.8, fine: true, lines: ['M230 304 L230 346', { d: 'M226 310 L234 310 M226 318 L234 318 M226 326 L234 326 M226 334 L234 334', w: 0.6 }],
    decals: `<path d="M226 306 l2 2 m0 -2 l-2 2 M232 306 l2 2 m0 -2 l-2 2" stroke="${INK}" stroke-width="0.7"/>` + a.stain(236, 330, 5, G.blood, 0.8), over: a.drip(236, 352, 14, 1.8) });
  a.raw(`<path d="M234 316 L262 292" stroke="${G.iron}" stroke-width="2.2"/><path d="M258 288 L266 296" stroke="${INK}" stroke-width="2.6"/><path d="M220 330 L246 340 M224 342 L210 318" stroke="${G.rust}" stroke-width="1.4"/>`);
  A.fist([254, 300], [0.6, -0.8], '#a89c88', 0.85);
  A.fist([206, 322], [1, 0.1], '#a89c88', 0.85);
}
require('fs').writeFileSync('grim/hexweaver.svg', a.svg());
a.writeRig('grim/rig/hexweaver', { idle: 'sway', attack: 'cast', hand: [356, 262] });
