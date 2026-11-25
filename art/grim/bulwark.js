// Grim Bulwark: oathbound veteran knight. Battered great helm with a sword gash and an eye in the
// slit, hacked heater shield with broken arrows and a bloody handprint, flanged mace hanging from the
// near fist and dripping into a pool, tattered cloak, grime-soaked surcoat. Faces right; light upper left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(440, 700, 31);
const R = a.R;
const rot = (pts, cx, cy, ang) => pts.map(([x, y]) => { const c = Math.cos(ang), s = Math.sin(ang), dx = x - cx, dy = y - cy; return [cx + dx * c - dy * s, cy + dx * s + dy * c]; });
const ln = (pts) => 'M' + pts.map(p => p.map(v => +v.toFixed(1)).join(' ')).join(' L');
const ragged = (x0, x1, y, n, amp, lenJ) => { const o = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([x + (R() - 0.5) * 4, y + (i % 2 ? amp * (0.6 + R() * 0.8) : R() * lenJ)]); } return o; };

a.layer('shadow');
a.raw(a.ground(214, 676, 150, 11));
// blood pool under the mace
a.raw(`<path d="M96 674 C100 666 140 664 160 668 C176 671 174 680 150 682 C120 684 92 682 96 674 Z" fill="${G.blood}" opacity="0.85"/><path d="M110 674 C120 670 140 670 150 673" stroke="#c0503a" stroke-width="0.8" fill="none" opacity="0.6"/>`);

a.layer('back', [200, 180]);
// ---------------------------------------------------------------- cloak (behind everything)
{
  const hem = ragged(212, 92, 560, 11, 28, 10);
  const pts = [[190, 168], [236, 174], [226, 250], [214, 380], [214, 470], ...hem, [94, 470], [112, 330], [142, 226], [162, 180]];
  a.shape({ d: smooth(pts, true, 0.5), fill: G.cloth, depth: 40, mottle: 0.9, grime: 0.2, wash: 0.4,
    lines: ['M150 220 C132 300 120 400 110 540', 'M172 232 C158 320 150 430 144 560', 'M196 246 C186 340 184 440 182 560', 'M130 268 C114 350 106 440 100 530',
      { d: 'M162 260 C156 300 154 330 156 360', w: 0.6 }],
    decals: a.fold(150, 230, 110, 540, 9) + a.fold(174, 240, 146, 556, 8) + a.fold(198, 260, 184, 556, 7) + a.stain(150, 520, 30, G.blood, 0.55) + a.stain(122, 430, 16, G.umber, 0.35) + a.stain(190, 540, 18, G.algae, 0.35) });
}
a.layer('legs', [220, 400]);
// ---------------------------------------------------------------- far leg (forward)
{
  a.limb([[248, 350], [266, 430], [282, 505]], [56, 48, 38], {fill: G.steel, tex: 'url(#mail)', depth: 18, mottle: 0.6, hatch: 60, decals: a.stain(268, 470, 14, G.blood, 0.5) });
  a.limb([[284, 512], [292, 576], [298, 634]], [40, 38, 28], {fill: G.steel, depth: 14, mottle: 0.7, hatch: 62,
    lines: ['M290 520 L297 630', { d: 'M280 560 L284 572', w: 0.7 }, { d: 'M304 588 C300 598 302 606 298 614', w: 0.7 }],
    spec: ['M279 524 C279 560 284 600 288 628'], decals: a.stain(300, 610, 10, G.rust, 0.6) + a.stain(286, 548, 8, G.rust, 0.5) + a.drips(286, 300, 520, 2, 40, 2) });
  a.shape({ d: smooth([[264, 488], [288, 482], [306, 494], [306, 518], [290, 530], [270, 526], [262, 508]]), fill: G.steel, depth: 10, grime: 0.2,
    lines: ['M266 506 C278 512 294 512 304 504', 'M268 494 C280 500 294 500 304 494'], spec: ['M268 490 C274 486 282 485 288 486'], after: a.rivet(285, 518) + a.rivet(298, 514) });
  a.shape({ d: smooth([[262, 496], [250, 490], [244, 504], [252, 520], [264, 514]]), fill: G.steel, depth: 6 });
  // pointed sabaton
  a.shape({ d: smooth([[284, 626], [306, 624], [318, 640], [342, 656], [360, 668], [358, 678], [282, 678], [278, 650]], true, 0.4), fill: G.steelD, depth: 9, grime: 0.4,
    lines: ['M286 638 C298 636 310 638 318 642', 'M284 650 C300 648 318 650 330 656', 'M282 662 C304 660 326 662 344 668'], spec: ['M290 630 L304 629'], decals: a.stain(318, 668, 16, G.umber, 0.55) });
}
// ---------------------------------------------------------------- near leg (back)
{
  a.limb([[196, 356], [186, 430], [176, 505]], [56, 48, 38], {fill: G.steel, tex: 'url(#mail)', depth: 18, mottle: 0.6, hatch: 50, decals: a.stain(188, 478, 12, G.blood, 0.45) });
  a.limb([[175, 512], [166, 576], [158, 634]], [40, 38, 28], {fill: G.steel, depth: 14, mottle: 0.7, hatch: 50,
    lines: ['M170 520 L160 630', { d: 'M178 590 L182 600', w: 0.7 }], spec: ['M162 522 C160 560 156 600 152 626'], decals: a.stain(166, 600, 12, G.rust, 0.55) + a.stain(160, 630, 10, G.umber, 0.5) });
  a.shape({ d: smooth([[156, 486], [180, 482], [196, 494], [196, 518], [180, 530], [160, 526], [152, 508]]), fill: G.steel, depth: 10, grime: 0.25,
    lines: ['M156 506 C168 512 184 512 194 504', 'M158 494 C170 500 184 500 194 494'], spec: ['M160 490 C166 486 174 485 180 486'], after: a.rivet(166, 518) + a.rivet(182, 516) });
  a.shape({ d: smooth([[142, 626], [164, 624], [176, 640], [200, 656], [218, 668], [216, 678], [140, 678], [136, 650]], true, 0.4), fill: G.steelD, depth: 9, grime: 0.4,
    lines: ['M144 638 C156 636 168 638 176 642', 'M142 650 C158 648 176 650 188 656', 'M140 662 C162 660 184 662 202 668'], spec: ['M148 630 L162 629'], decals: a.stain(176, 668, 16, G.umber, 0.55) });
}
a.layer('body', [220, 400]);
// ---------------------------------------------------------------- torso + surcoat skirt
{
  const hem = ragged(292, 156, 466, 13, 26, 8);
  a.shape({ d: smooth([[184, 322], [262, 320], [278, 380], ...hem, [168, 380]], true, 0.5), fill: G.azureD, depth: 26, mottle: 0.9, grime: 0.3, hatch: 70,
    lines: ['M200 340 C196 380 190 430 186 480', 'M222 340 C222 390 224 430 226 488', 'M244 338 C248 380 256 430 260 480', 'M180 350 C176 400 170 440 166 470'],
    decals: a.fold(200, 340, 186, 478, 7) + a.fold(224, 342, 228, 486, 6) + a.fold(246, 340, 262, 478, 7) + a.stain(226, 440, 30, G.blood, 0.8) + a.stain(240, 474, 20, G.bloodD, 0.7) + a.stain(190, 400, 14, G.umber, 0.4),
    over: a.drips(196, 268, 488, 6, 26, 2.2) });
  a.shape({ d: smooth([[198, 170], [252, 168], [272, 196], [268, 262], [260, 330], [184, 334], [174, 262], [172, 200]], true, 0.8), fill: G.azure, depth: 30, mottle: 0.9, grime: 0.3, hatch: 70,
    lines: ['M190 210 C196 250 194 290 192 326', 'M214 196 C220 240 222 290 220 330', { d: 'M180 240 C186 246 192 246 198 240', w: 0.7 }],
    decals: a.fold(192, 212, 192, 324, 5) + a.fold(214, 200, 220, 328, 6) + a.stain(214, 300, 24, G.blood, 0.75) + a.splat(200, 262, 7, { drops: 6 }) + a.gash(186, 278, 204, 292, 5, { rim: '#4a5a6c', drip: false }) });
  a.shape({ d: smooth([[188, 276], [204, 284], [206, 296], [192, 296]]), fill: G.steelD, tex: 'url(#mail)', depth: 3, core: false, ink: 0.8 });
}
// belt, buckle, pouch
{
  a.shape({ d: smooth([[178, 318], [266, 314], [268, 332], [180, 338]], true, 0.2), fill: G.leatherD, depth: 6, grime: 0.4, lines: ['M182 322 L264 318', 'M182 334 L264 328'] });
  a.shape({ d: poly([[204, 316], [220, 315], [221, 334], [205, 336]]), fill: G.gold, depth: 5, ink: 1.1, lines: ['M212 316 L212 335'], spec: ['M206 318 L206 330'] });
  a.shape({ d: smooth([[238, 336], [256, 334], [258, 360], [246, 366], [236, 358]]), fill: G.leather, depth: 8, grime: 0.4, lines: ['M238 344 L256 342'] });
}
// ---------------------------------------------------------------- far pauldron peeking above the shield
a.shape({ d: smooth([[248, 178], [272, 174], [290, 190], [286, 214], [258, 214]]), fill: G.steel, depth: 10, mottle: 0.6, lines: ['M254 196 C266 200 280 200 288 196'], spec: ['M256 182 C264 178 272 178 278 180'], after: a.rivet(270, 186) });
a.layer('shield', [262, 190]);
// ---------------------------------------------------------------- shield
{
  const face = 'M230 198 L342 212 C348 300 332 400 296 466 C262 404 234 300 230 198 Z';
  a.shape({ d: 'M222 194 L230 198 C234 300 262 404 296 466 L289 470 C254 406 226 302 222 194 Z', fill: G.woodD, depth: 3, core: false, tex: 'url(#grain)', texOp: 0.6 });
  const chips = a.stain(320, 250, 14, G.wood, 0.95) + a.stain(250, 400, 12, G.wood, 0.95) + a.stain(338, 330, 9, G.wood, 0.95) + a.stain(270, 236, 7, G.wood, 0.95);
  const door = `<path d="M262 400 L262 300 C262 266 312 266 312 300 L312 400 Z" fill="${G.gold}" stroke="${INK}" stroke-width="1.3"/><path d="M272 400 L272 304 C272 280 302 280 302 304 L302 400 Z" fill="${G.black}"/>` +
    `<path d="M262 400 L312 400" stroke="${INK}" stroke-width="1.5"/>`;
  const hand = `<g fill="${G.blood}" opacity="0.9"><path d="M244 236 C240 250 244 264 252 270 C258 274 268 270 270 262 C272 252 266 240 258 236 Z"/><path d="M246 236 L240 214 L244 212 L250 234 Z"/><path d="M252 234 L250 206 L255 206 L257 233 Z"/><path d="M258 236 L260 208 L265 209 L263 237 Z"/><path d="M264 240 L272 220 L276 222 L268 242 Z"/><path d="M268 256 L282 252 L282 257 L270 262 Z"/></g>` + a.drips(246, 268, 268, 4, 40, 2.4);
  a.shape({ d: face, fill: G.red, depth: 40, mottle: 1, grime: 0.3, hatch: 35,
    decals: chips + door + hand + a.stain(300, 430, 18, G.bloodD, 0.5) + `<path d="M330 214 L318 236 L338 228 Z" fill="${G.wood}" stroke="${INK}" stroke-width="1"/>` + `<path d="M343 268 L328 280 L345 290 Z" fill="${G.wood}" stroke="${INK}" stroke-width="1"/>` +
      a.gash(250, 330, 330, 372, 6, { rim: G.wood, drip: false }),
    after: `<path d="M236 205 L338 218 C343 300 328 398 296 456 C266 400 240 300 236 205 Z" fill="none" stroke="${G.steelD}" stroke-width="3" opacity="0.9"/><path d="M236 205 L338 218 C343 300 328 398 296 456 C266 400 240 300 236 205 Z" fill="none" stroke="${INK}" stroke-width="0.7"/>` +
      [[238, 214], [290, 212], [334, 222], [336, 300], [322, 380], [298, 448], [250, 300], [270, 390]].map(([x, y]) => a.rivet(x, y, 1.6)).join('') });
  a.limb([[300, 300], [338, 286]], [3.2, 3], {fill: G.wood, depth: 2, core: false, ink: 1, after: `<path d="M336 284 L344 280 M338 288 L346 290 M337 286 L345 285" stroke="${INK}" stroke-width="0.9"/>` });
  a.limb([[262, 382], [318, 404]], [3.2, 3], {fill: G.wood, depth: 2, core: false, ink: 1 });
  a.shape({ d: smooth([[300, 396], [322, 392], [328, 400], [320, 410], [302, 404]]), fill: G.parchD, depth: 4, core: false, ink: 0.9, lines: ['M304 400 L326 400', 'M306 397 L310 393', 'M312 397 L316 392', 'M306 403 L310 407', 'M312 404 L316 409'] });
  a.limb([[318, 340], [344, 334]], [3, 2.6], {fill: G.wood, depth: 2, core: false, ink: 1, after: `<path d="M342 332 L350 334 M343 336 L349 340" stroke="${INK}" stroke-width="0.9"/>` });
}
a.layer('head', [230, 160]);
// ---------------------------------------------------------------- torn cloth strips hanging from the back of the helm
{
  for (const [x0, len, w] of [[200, 70, 10], [208, 92, 9], [196, 54, 8]]) {
    const pts = [[x0, 96], [x0 + w, 98], [x0 + w - 6, 96 + len * 0.5], [x0 + w - 14, 96 + len], [x0 - 16, 96 + len - 4], [x0 - 8, 96 + len * 0.5]];
    a.shape({ d: smooth(pts, true, 0.5), fill: G.redD, depth: 5, mottle: 0.8, core: false, lines: [`M${x0 + 2} 100 C${x0 - 2} ${96 + len * 0.4} ${x0 - 6} ${96 + len * 0.7} ${x0 - 10} ${96 + len - 6}`] });
  }
}
// ---------------------------------------------------------------- aventail + helm
{
  let sc = [];
  for (let i = 0; i <= 8; i++) { const x = 182 + i * 10.5; sc.push([x, 190 + (i % 2 ? 5 : 0)]); }
  a.shape({ d: smooth([[194, 140], [258, 138], [270, 168], ...sc.reverse(), [178, 170]], true, 0.6), fill: G.steel, tex: 'url(#mail)', depth: 14, mottle: 0.6, decals: a.stain(240, 172, 10, G.rust, 0.5) });
  const helm = 'M198 88 C198 74 212 68 228 68 C246 68 258 74 259 88 L261 146 C255 154 238 157 228 157 C214 157 203 154 198 148 Z';
  a.shape({ d: helm, fill: G.steel, depth: 26, mottle: 0.75, grime: 0.25, hatch: 55,
    lines: ['M200 86 C216 82 242 82 258 88', 'M200 91 C216 87 242 87 258 93', { d: 'M208 124 C211 132 213 140 213 150', w: 0.8 }],
    spec: ['M203 96 C202 110 202 126 204 140', 'M212 74 C220 71 228 71 232 72'],
    decals: a.stain(228, 134, 12, G.rust, 0.5) + a.stain(206, 78, 8, G.rust, 0.55) + a.drips(220, 232, 106, 3, 34, 2.2) + a.drip(250, 106, 22, 2) +
      `<path d="M204 76 L232 96 L230 99 L202 80 Z" fill="${G.black}"/><path d="M202 80 L204 76 L207 78 M214 84 L218 82 M224 90 L228 88" stroke="${G.steelL}" stroke-width="1.1"/>` });
  a.shape({ d: 'M236 69 L244 70 L246 156 L238 157 Z', fill: G.steelL, depth: 3, core: false, ink: 1.1, after: [80, 96, 118, 136, 150].map(y => a.rivet(241, y, 1.5)).join('') });
  a.raw(`<path d="M210 99 L235 99 L235 105 L212 106 Z" fill="${G.black}" stroke="${INK}" stroke-width="0.9"/><path d="M248 99 L259 99 L259 105 L249 105 Z" fill="${G.black}" stroke="${INK}" stroke-width="0.9"/>` +
    `<ellipse cx="224" cy="102.2" rx="4.6" ry="1.9" fill="#d6c8a8"/><circle cx="225.2" cy="102.2" r="1.7" fill="#3a2a1a"/><circle cx="225.6" cy="101.7" r="0.5" fill="#fff"/><path d="M219.4 101 C221.5 100.3 224 100.2 228.6 101" stroke="${G.bloodL}" stroke-width="0.5" fill="none"/>`);
  let br = '';
  for (const [x, y] of [[250, 122], [255, 122], [252.5, 127], [250, 132], [255, 132], [220, 122], [225, 122], [222.5, 127], [220, 132], [225, 132]]) br += `<circle cx="${x}" cy="${y}" r="1.2" fill="${G.black}"/>`;
  a.raw(br);
}
a.layer('arm', [176, 208]);
// ---------------------------------------------------------------- near arm hanging, fist around the mace haft
{
  // mace: pommel above the fist, haft angled forward-down, flanged head at knee height
  const top = [150, 352], head = [122, 520];
  a.shape({ d: limb([top, [136, 436], head], [8, 8.5, 9]), fill: G.wood, depth: 4, hatch: 64, tex: 'url(#grain)', texOp: 0.5,
    lines: [ln([[142, 380], [152, 382]]), ln([[140, 388], [150, 390]]), ln([[139, 396], [149, 398]])], decals: a.stain(130, 470, 6, G.blood, 0.8) + a.drips(128, 134, 476, 2, 24, 2) });
  a.shape({ d: smooth([[144, 342], [156, 340], [158, 352], [150, 358], [143, 352]]), fill: G.iron, depth: 4 });
  a.limb([[118, 498], [128, 470]], [11, 8], {fill: G.iron, depth: 4, core: false });
  // flanged head: seven flanges; three on the silhouette
  const cx = 118, cy = 540, ang = Math.atan2(cy - 436, cx - 136) - Math.PI / 2;
  const fl = (pts) => rot(pts, cx, cy, ang);
  a.shape({ d: smooth(fl([[cx - 8, cy - 26], [cx - 24, cy - 18], [cx - 26, cy + 8], [cx - 18, cy + 24], [cx - 6, cy + 24]]), true, 0.3), fill: G.steelD, depth: 6, grime: 0.3, decals: a.stain(cx - 16, cy, 8, G.blood, 0.7) });
  a.shape({ d: smooth(fl([[cx + 8, cy - 26], [cx + 24, cy - 18], [cx + 26, cy + 8], [cx + 18, cy + 24], [cx + 6, cy + 24]]), true, 0.3), fill: G.steel, depth: 6, grime: 0.3, decals: a.splat(cx + 16, cy + 4, 6, { drops: 4 }) });
  a.shape({ d: smooth(fl([[cx - 9, cy - 30], [cx + 9, cy - 30], [cx + 10, cy + 24], [cx, cy + 34], [cx - 10, cy + 24]]), true, 0.4), fill: G.steel, depth: 8, grime: 0.35,
    spec: [ln(fl([[cx - 4, cy - 24], [cx - 4, cy + 16]]))], decals: a.splat(cx + 2, cy + 6, 9, { drops: 6 }) + a.stain(cx - 2, cy - 14, 6, G.rust, 0.6) });
  let hair = '';
  for (let i = 0; i < 18; i++) { const x0 = cx - 10 + R() * 22, y0 = cy + R() * 22; hair += `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} C${(x0 + (R() - 0.5) * 10).toFixed(1)} ${(y0 + 10).toFixed(1)} ${(x0 + (R() - 0.5) * 12).toFixed(1)} ${(y0 + 20).toFixed(1)} ${(x0 + (R() - 0.5) * 16).toFixed(1)} ${(y0 + 30 + R() * 12).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.55"/>`; }
  a.raw(hair + a.drip(cx + 2, cy + 34, 22, 3) + a.drip(cx - 8, cy + 28, 14, 2.2) + `<circle cx="${cx}" cy="${cy + 92}" r="2" fill="${G.blood}"/><circle cx="${cx - 2}" cy="${cy + 118}" r="2.4" fill="${G.blood}"/>`);
  // upper arm (mail sleeve under rerebrace), couter, vambrace, gauntlet
  a.limb([[176, 208], [166, 250], [158, 290]], [36, 32, 28], {fill: G.steel, tex: 'url(#mail)', depth: 12, hatch: 30 });
  a.limb([[172, 222], [164, 254], [160, 278]], [28, 26, 22], {fill: G.steel, depth: 10, mottle: 0.6, hatch: 30, lines: ['M160 236 L180 238', { d: 'M156 256 L170 258', w: 0.7 }], spec: ['M156 232 C154 250 152 262 150 274'] });
  a.limb([[158, 296], [154, 330], [151, 358]], [28, 26, 22], {fill: G.steel, depth: 10, mottle: 0.6, hatch: 75, lines: ['M142 318 L166 318'], spec: ['M146 300 C144 320 143 336 142 350'], decals: a.stain(154, 336, 8, G.blood, 0.6) });
  a.shape({ d: smooth([[142, 282], [158, 274], [174, 284], [174, 304], [158, 312], [142, 302]]), fill: G.steelL, depth: 9, spec: ['M148 284 C152 280 158 279 162 280'], after: a.rivet(158, 294) });
  a.shape({ d: smooth([[140, 288], [128, 282], [124, 298], [132, 310], [142, 304]]), fill: G.steel, depth: 5 });
  a.shape({ d: smooth([[138, 358], [164, 352], [168, 366], [140, 372]], true, 0.6), fill: G.steelD, depth: 7, grime: 0.3 });
  a.shape({ d: smooth([[134, 368], [150, 362], [164, 366], [166, 384], [158, 396], [140, 396], [132, 384]], true, 0.7), fill: G.steel, depth: 10, mottle: 0.5,
    lines: ['M136 374 C146 376 156 376 164 374', 'M134 382 C144 386 156 386 164 384', 'M136 390 C146 392 154 392 160 390'], spec: ['M140 368 L150 366'], decals: a.splat(154, 384, 5, { drops: 3 }) });
  a.shape({ d: smooth([[160, 368], [170, 364], [174, 376], [166, 382]]), fill: G.steelL, depth: 4, core: false });
  // pauldron: cop + two lames
  a.shape({ d: smooth([[150, 232], [190, 228], [212, 234], [206, 248], [168, 252], [150, 246]], true, 0.6), fill: G.steelD, depth: 7, mottle: 0.5 });
  a.shape({ d: smooth([[146, 220], [192, 214], [216, 222], [210, 238], [170, 242], [148, 236]], true, 0.6), fill: G.steel, depth: 7, mottle: 0.5, after: a.rivet(160, 232) + a.rivet(204, 230) });
  a.shape({ d: smooth([[152, 190], [180, 172], [210, 180], [218, 206], [204, 224], [164, 228], [146, 212]], true, 0.8), fill: G.steel, depth: 22, mottle: 0.7, grime: 0.3, hatch: 40,
    lines: ['M158 202 C172 198 196 198 216 206', { d: 'M176 184 L184 194', w: 0.8 }], spec: ['M160 192 C170 182 184 178 196 180'],
    decals: a.stain(190, 216, 12, G.rust, 0.6) + a.rake(168, 190, 0.5, 26, 3, 5, 2.2),
    after: a.rivet(168, 216) + a.rivet(200, 214) + a.rivet(188, 182) });
}
require('fs').writeFileSync('grim/bulwark.svg', a.svg());
a.writeRig('grim/rig/bulwark', { idle: 'heavy', attack: 'swing', hand: [118, 540] });
