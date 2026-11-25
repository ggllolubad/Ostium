// Grim Oracle: emaciated seer floating a hand's breadth above the floor. Eyes bound with a blood-wet
// blindfold, a third eye open on the brow, ritual scars, sackcloth shift, black veil, an hourglass full
// of dark sand in one hand and chains of void drifting about her.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 71);
const R = a.R;
const A = require('./anatomy')(a);
const ragged = (x0, x1, y, n, amp) => { const o = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([x + (R() - 0.5) * 4, y + (i % 2 ? amp * (0.5 + R() * 0.9) : R() * 6)]); } return o; };

a.layer('shadow');
a.raw(a.ground(236, 676, 100, 9));
// void smoke pooling under her
a.raw(Array.from({ length: 9 }, (_, i) => `<path d="${require('../gr').blob(180 + i * 14, 640 + (i % 3) * 8, 14 + R() * 8, R, 9, 0.35)}" fill="${G.violetD}" opacity="${(0.25 + R() * 0.2).toFixed(2)}"/>`).join(''));
a.layer('back', [240, 120]);
// ---------------------------------------------------------------- veil (behind), long and torn
{
  const hem = ragged(300, 140, 600, 10, 30);
  a.shape({ d: smooth([[214, 120], [262, 112], [296, 150], [302, 300], [304, 450], ...hem, [150, 460], [170, 300], [190, 160]], true, 0.5), fill: G.black, depth: 36, mottle: 0.7, wash: 0.4, hatch: 20,
    decals: a.fold(214, 170, 178, 580, 8) + a.fold(252, 170, 250, 590, 7) + a.fold(286, 200, 296, 580, 7) });
}
a.layer('legs', [240, 440]);
// ---------------------------------------------------------------- dangling legs and bare feet (she floats)
{
  a.limb([[230, 440], [226, 520], [222, 600]], [24, 20, 14], { fill: G.fleshP, depth: 7, mottle: 0.7, fine: true, hatch: 50 });
  a.limb([[252, 440], [258, 520], [262, 596]], [24, 20, 14], { fill: G.fleshP, depth: 7, mottle: 0.7, fine: true, hatch: 60, decals: a.gash(254, 500, 262, 530, 3, { rim: G.bloodW, dripLen: 10 }) });
  a.shape({ d: smooth([[214, 596], [232, 598], [236, 622], [226, 632], [214, 626]], true, 0.6), fill: G.fleshP, depth: 5, mottle: 0.6, lines: ['M218 624 L220 632', 'M224 624 L226 632'] });
  a.shape({ d: smooth([[254, 592], [272, 594], [276, 618], [266, 628], [254, 622]], true, 0.6), fill: G.fleshP, depth: 5, mottle: 0.6, lines: ['M258 620 L260 628', 'M264 620 L266 628'] });
  a.raw(a.drip(268, 628, 12, 2));
}
a.layer('body', [240, 330]);
// ---------------------------------------------------------------- sackcloth shift
{
  const hem = ragged(284, 196, 470, 8, 18);
  a.shape({ d: smooth([[218, 206], [268, 204], [284, 260], [282, 360], [290, 440], ...hem, [200, 440], [206, 360], [204, 260]], true, 0.5), fill: '#8f8068', tex: 'url(#weave)', texOp: 0.7, depth: 26, mottle: 0.8, hatch: 70,
    decals: a.fold(226, 260, 214, 460, 5) + a.fold(258, 260, 266, 460, 5) + a.stain(250, 330, 18, G.blood, 0.55) + a.stain(232, 420, 14, G.umber, 0.5) });
  // rope cinch with knotted charms
  a.raw(`<path d="M204 330 C230 336 262 334 284 326" stroke="${G.parchD}" stroke-width="3.4" fill="none"/><path d="M204 330 C230 336 262 334 284 326" stroke="${INK}" stroke-width="0.8" fill="none" stroke-dasharray="2 2"/>` +
    `<path d="M240 334 L236 370 M246 334 L250 364" stroke="${INK}" stroke-width="0.8"/>`);
  a.shape({ d: smooth([[230, 366], [240, 364], [242, 378], [232, 380]], true, 0.6), fill: G.bone, depth: 3, core: false, ink: 0.8 });
}
a.layer('arm', [266, 220]);
// ---------------------------------------------------------------- arms: one raised with the hourglass, one trailing chains
{
  // far arm forward/up: hourglass
  A.arm({ sh: [266, 220], el: [300, 240], wr: [326, 220], fill: G.fleshP, w: 0.58, upperDecals: `<path d="M282 222 L286 236 M290 226 L294 240" stroke="${G.bloodD}" stroke-width="0.8"/>` });
  a.shape({ d: poly([[326, 156], [356, 156], [356, 162], [326, 162]]), fill: G.woodD, depth: 3, core: false, ink: 1 });
  a.shape({ d: poly([[326, 214], [356, 214], [356, 220], [326, 220]]), fill: G.woodD, depth: 3, core: false, ink: 1 });
  a.shape({ d: smooth([[330, 162], [352, 162], [346, 184], [341, 188], [346, 192], [352, 214], [330, 214], [336, 192], [341, 188], [336, 184]], true, 0.3), fill: '#d8e0e0', fillOp: 0.6, depth: 4, core: false, ink: 1,
    after: `<path d="M334 168 L348 168 L341 186 Z" fill="${G.black}"/><path d="M341 190 L341 206" stroke="${G.black}" stroke-width="1"/><path d="M332 212 C336 204 346 204 350 212 Z" fill="${G.black}"/>` });
  a.raw(`<path d="M328 156 L328 220 M354 156 L354 220" stroke="${G.woodD}" stroke-width="2.4"/>`);
  A.fist([322, 220], [0.9, -0.3], G.fleshP, 0.8);
a.layer('near', [222, 222]);
  // near arm hanging, palm out, chains of void drifting from the wrist
  A.arm({ sh: [222, 222], el: [206, 280], wr: [198, 330], fill: G.fleshP, w: 0.58, foreDecals: `<path d="M204 290 L212 294 M202 302 L210 306 M201 314 L209 318" stroke="${G.bloodD}" stroke-width="0.8"/>` });
  A.hand([198, 330], [-0.15, 1], G.fleshP, 0.85);
  let chain = '';
  for (let i = 0; i < 16; i++) { const t = i / 15, x = 196 - 60 * t + Math.sin(t * 7) * 12, y = 352 + 150 * t; chain += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.6" ry="2.2" transform="rotate(${(i % 2 ? 60 : -30)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${G.black}" stroke-width="2"/>`; }
  a.raw(`<g opacity="0.85">${chain}</g>`);
}
a.layer('head', [246, 200]);
// ---------------------------------------------------------------- head: shaven, blindfolded, third eye, veil hood over
{
  a.shape({ d: smooth([[232, 186], [258, 184], [262, 210], [236, 214]], true, 0.5), fill: G.fleshP, depth: 6 });
  const face = smooth([[226, 126], [258, 118], [276, 134], [282, 156], [290, 168], [282, 172], [282, 182], [272, 196], [252, 200], [232, 190], [222, 160]], true, 0.6);
  a.shape({ d: face, fill: '#c9b8a2', depth: 16, mottle: 0.7, fine: true, hatch: 70,
    lines: ['M276 146 C282 156 286 162 290 168', { d: 'M268 184 C274 184 278 184 282 182', w: 1 }, { d: 'M252 170 C256 182 256 190 252 198', w: 0.7 }],
    decals: `<path d="M238 132 L244 144 M244 128 L250 140 M232 140 L236 150" stroke="${G.bloodD}" stroke-width="0.9"/>` });
  // blindfold, soaked, with blood tears
  a.shape({ d: smooth([[222, 150], [284, 146], [286, 160], [224, 166]], true, 0.3), fill: '#6a5a48', depth: 4, mottle: 0.8, ink: 1.1,
    decals: a.stain(268, 156, 8, G.blood, 0.85) + a.stain(246, 158, 6, G.blood, 0.7), over: a.drip(270, 162, 26, 2.4) + a.drip(252, 164, 18, 2) });
  // third eye, open, on the brow
  a.raw(`<path d="M248 132 C254 126 264 126 270 132 C264 138 254 138 248 132 Z" fill="#e8dcc0" stroke="${INK}" stroke-width="1"/><circle cx="259" cy="132" r="3.4" fill="${G.violetD}"/><circle cx="259" cy="132" r="1.4" fill="${G.black}"/><circle cx="258" cy="131" r="0.6" fill="#fff"/>` +
    `<path d="M248 132 C254 129 264 129 270 132" stroke="${G.bloodL}" stroke-width="0.5" fill="none"/>`);
  // veil hood
  a.shape({ d: smooth([[214, 132], [236, 100], [270, 96], [296, 118], [290, 130], [266, 116], [240, 118], [226, 150], [222, 200], [204, 210], [200, 170]], true, 0.6), fill: G.black, depth: 14, mottle: 0.6, hatch: 30,
    lines: ['M222 120 C214 150 210 180 208 204'] });
  // a crown of rusted nails
  a.raw([[236, 104], [248, 98], [260, 96], [272, 98], [284, 106]].map(([x, y], i) => `<path d="M${x} ${y} L${x + (i - 2) * 2} ${y - 14}" stroke="${G.rust}" stroke-width="2.2"/><path d="M${x - 2} ${y - 1} L${x + 2} ${y - 1}" stroke="${INK}" stroke-width="1"/>`).join(''));
}
require('fs').writeFileSync('grim/oracle.svg', a.svg());
a.writeRig('grim/rig/oracle', { idle: 'float', attack: 'cast', hand: [340, 186] });
