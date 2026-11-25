// Drowned Choirboy: a small drowned chorister, surplice green with silt, eyes white, mouth stretched in
// an endless hymn far wider than a child's mouth should go. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(400, 600, 211);
const P = require('./parts')(a), R = a.R;
a.raw(a.ground(200, 576, 90, 9));
// cassock and surplice
{
  const hem = P.ragged(262, 140, 566, 10, 10);
  a.shape({ d: smooth([[170, 270], [230, 266], [252, 360], [262, 500], ...hem, [140, 500], [150, 360]], true, 0.45), fill: '#5a2a24', depth: 30, mottle: 0.5, fine: true, hatch: 70, decals: a.fold(176, 360, 166, 560, 6) + a.fold(226, 360, 236, 560, 6) + a.stain(200, 540, 20, G.algae, 0.6) });
  const hem2 = P.ragged(256, 146, 430, 10, 18);
  a.shape({ d: smooth([[166, 268], [234, 264], [252, 330], [256, 420], ...hem2, [146, 420], [150, 330]], true, 0.45), fill: '#c8c4ac', depth: 24, mottle: 0.7, fine: true, hatch: 70, decals: a.fold(180, 300, 170, 430, 5) + a.fold(220, 300, 232, 430, 5) + a.stain(210, 380, 22, G.algae, 0.6) + a.stain(190, 300, 10, G.bloodD, 0.4) });
}
// hands clasped over a rotted hymnal
a.limb([[170, 284], [158, 330], [184, 352]], [20, 17, 14], { fill: '#c8c4ac', depth: 6, mottle: 0.6, fine: true, hatch: 40 });
a.limb([[232, 284], [244, 330], [214, 352]], [20, 17, 14], { fill: '#c8c4ac', depth: 6, mottle: 0.6, fine: true, hatch: 120 });
a.shape({ d: poly([[176, 336], [226, 336], [228, 370], [178, 372]]), fill: G.leatherD, depth: 8, mottle: 0.6, decals: a.stain(200, 354, 10, G.algae, 0.7) + `<path d="M182 342 L222 342 M182 362 L222 362" stroke="#c8bc98" stroke-width="0.8"/>` });
for (const [x, y] of [[184, 350], [216, 350]]) a.shape({ d: smooth([[x - 9, y - 6], [x + 9, y - 6], [x + 9, y + 8], [x - 9, y + 8]], true, 0.6), fill: '#a8b4a8', depth: 4, mottle: 0.5 });
// head: the hymn
a.shape({ d: smooth([[164, 196], [190, 180], [222, 184], [240, 210], [238, 250], [214, 274], [184, 272], [164, 250]], true, 0.7), fill: '#a8b4a8', depth: 16, mottle: 0.5, fine: true, hatch: 90,
  decals: P.eye(184, 210, 6, '#000', true) + P.eye(214, 208, 6, '#000', true) +
    `<path d="M182 228 C190 224 208 224 216 228 L222 262 C210 274 188 274 178 262 Z" fill="${G.black}" stroke="${INK}" stroke-width="1"/><path d="M186 258 C196 264 206 264 214 258" stroke="#7a2a24" stroke-width="2.4" fill="none"/>` +
    `<path d="M180 232 L174 252 M218 232 L224 250" stroke="#c08070" stroke-width="1.4"/>` + a.stain(226, 236, 8, G.bruise, 0.6),
  over: P.drool(196, 272, 22, '#c8d4c8') });
a.shape({ d: smooth([[160, 200], [178, 172], [214, 168], [242, 192], [240, 206], [214, 188], [186, 190], [170, 214]], true, 0.6), fill: G.black, depth: 6, core: false, lines: ['M176 184 L172 200', 'M190 178 L188 192', 'M206 176 L206 188'], lineCol: '#5a5048' });
a.raw(P.weed(232, 196, 46, 1, '#4f5f3a'));
// sound: the hymn as a smear of dark notes
a.raw([0, 1, 2].map(i => `<path d="M${160 - i * 16} ${236 + i * 4} C${150 - i * 16} ${226} ${150 - i * 16} ${256} ${160 - i * 16} ${266 - i * 4}" stroke="${INK}" stroke-width="1" fill="none" opacity="${0.8 - i * 0.22}"/>`).join(''));
require('fs').writeFileSync('grim/e_choirboy.svg', a.svg());
