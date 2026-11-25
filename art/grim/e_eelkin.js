// Eel-kin Biter: a man gone to eel. Slick dark hide, gill slits weeping, a lamprey mouth of rasping
// teeth, thin webbed arms with a bone knife; the body runs down into a coiling tail. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 121);
const P = require('./parts')(a), R = a.R;
const hide = { fill: '#3f4a3c', mottle: 0.5, fine: true, wash: 0.3, hlOp: 0.3 };
a.raw(a.ground(240, 676, 140, 10));
// coiled tail on the floor
a.limb([[250, 470], [290, 560], [300, 630], [250, 664], [170, 660], [130, 630], [150, 600], [190, 614]], [70, 64, 56, 48, 40, 30, 20, 12], Object.assign({ depth: 20, hatch: 60, spec: ['M276 520 C296 570 300 610 286 640'],
  decals: a.stain(260, 640, 20, '#6a7a50', 0.6) + `<path d="M170 650 C200 640 240 640 270 650" stroke="#a8a070" stroke-width="2" opacity="0.6" fill="none"/>` }, hide));
// dorsal fin down the back
a.shape({ d: smooth([[276, 250], [306, 270], [318, 320], [312, 380], [300, 440], [290, 400], [290, 330]], true, 0.5), fill: '#5a4a3a', depth: 6, core: false, lines: ['M290 270 L310 300', 'M292 300 L314 330', 'M292 330 L312 360', 'M292 360 L306 390', 'M292 390 L300 420'] });
// torso
a.shape(Object.assign({ d: smooth([[214, 250], [276, 246], [296, 320], [288, 420], [268, 480], [222, 480], [206, 400], [200, 320]], true, 0.7), depth: 28, hatch: 80,
  decals: `<path d="M214 300 C230 296 250 298 266 304 M212 330 C230 326 250 328 268 334 M212 360 C230 356 252 358 270 364" stroke="#7a8a6a" stroke-width="1" fill="none" opacity="0.6"/>` + a.stain(240, 420, 18, '#6a7a50', 0.55) + a.splat(232, 360, 6, { drops: 4 }) }, hide));
// pale belly stripe
a.shape({ d: smooth([[210, 280], [232, 276], [236, 400], [226, 470], [214, 440]], true, 0.6), fill: '#a8a888', depth: 8, core: false, mottle: 0.5, fine: true });
// far arm
a.limb([[270, 272], [298, 328], [282, 384]], [16, 14, 10], Object.assign({ depth: 5, hatch: 120 }, hide));
a.shape(Object.assign({ d: smooth([[272, 378], [292, 380], [298, 404], [282, 410], [270, 398]], true, 0.6), depth: 4, after: `<path d="M280 408 L276 420 M288 408 L288 422 M294 404 L298 414" stroke="${INK}" stroke-width="1"/>` }, hide));
// head: eel skull, lamprey disc mouth, tiny eyes, gills
{
  a.limb([[236, 256], [214, 220]], [40, 34], Object.assign({ depth: 10, hatch: 80 }, hide));
  a.shape(Object.assign({ d: smooth([[150, 196], [176, 170], [222, 164], [248, 186], [246, 222], [222, 238], [180, 236], [156, 222]], true, 0.6), depth: 20, hatch: 90,
    decals: P.eye(206, 186, 4, '#d8d060') + `<path d="M226 200 C230 210 230 220 226 228 M234 198 C238 208 238 218 234 226 M242 200 C244 208 244 216 242 222" stroke="${G.bloodD}" stroke-width="1.6" fill="none"/>` + a.drip(234, 226, 14, 1.8, '#9a2a20') }, hide));
  // disc mouth: concentric rows of hooked teeth
  a.raw(`<ellipse cx="160" cy="214" rx="18" ry="22" fill="#7a2a24" stroke="${INK}" stroke-width="1.4"/><ellipse cx="160" cy="214" rx="10" ry="13" fill="${G.black}"/>` +
    Array.from({ length: 16 }, (_, i) => { const t = i / 16 * Math.PI * 2, x = 160 + Math.cos(t) * 15, y = 214 + Math.sin(t) * 18, x2 = 160 + Math.cos(t) * 10, y2 = 214 + Math.sin(t) * 13; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${G.bone}" stroke-width="2.2" stroke-linecap="round"/>`; }).join('') +
    P.drool(156, 236, 22, '#c0a090'));
}
// near arm with a jagged bone knife
a.limb([[220, 276], [186, 316], [160, 300]], [16, 14, 10], Object.assign({ depth: 5, hatch: 60 }, hide));
a.shape(Object.assign({ d: smooth([[146, 290], [166, 288], [170, 306], [156, 312], [144, 304]], true, 0.6), depth: 4 }, hide));
a.shape({ d: 'M152 292 L118 236 L112 240 L120 252 L114 256 L124 270 L118 274 L146 300 Z', fill: G.bone, depth: 4, core: false, ink: 1, decals: a.stain(126, 252, 6, G.blood, 0.8) });
a.raw(a.drip(120, 256, 14, 1.8));
require('fs').writeFileSync('grim/e_eelkin.svg', a.svg());
