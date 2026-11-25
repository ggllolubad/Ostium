// Bloated Corpse: a drowned body swollen to bursting with gas and rot, skin taut and marbled, splitting
// along the seams; it waddles, belching toxin, and will burst. Faces left.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const a = new Art(480, 700, 161);
const P = require('./parts')(a), R = a.R;
const skin = { fill: '#8f9a78', mottle: 0.55, fine: true, wash: 0.34 };
a.raw(a.ground(240, 676, 150, 11));
a.raw(`<path d="M150 672 C200 662 300 662 340 672 C320 684 180 686 150 672 Z" fill="${G.slime}" opacity="0.5"/>`);
// stumpy legs
a.limb([[200, 560], [192, 640]], [54, 44], Object.assign({ depth: 14, hatch: 60 }, skin));
a.limb([[290, 560], [298, 640]], [54, 44], Object.assign({ depth: 14, hatch: 110 }, skin));
for (const x of [164, 272]) a.shape(Object.assign({ d: smooth([[x, 630], [x + 54, 630], [x + 62, 676], [x - 6, 676]], true, 0.5), depth: 7, lines: [`M${x + 4} 666 L${x + 4} 676`, `M${x + 16} 664 L${x + 16} 676`] }, skin));
// the enormous belly
{
  const belly = smooth([[180, 300], [250, 270], [326, 300], [366, 400], [352, 520], [300, 590], [200, 596], [134, 540], [118, 430], [140, 350]], true, 0.8);
  const veins = `<g stroke="#5b5468" stroke-width="1.2" fill="none" opacity="0.85">` + Array.from({ length: 9 }, () => { const x = 140 + R() * 200, y = 330 + R() * 220; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} C${(x + 14).toFixed(1)} ${(y + 10).toFixed(1)} ${(x + 6).toFixed(1)} ${(y + 24).toFixed(1)} ${(x + 22).toFixed(1)} ${(y + 34).toFixed(1)} M${(x + 10).toFixed(1)} ${(y + 14).toFixed(1)} L${(x - 6).toFixed(1)} ${(y + 26).toFixed(1)}"/>`; }).join('') + `</g>`;
  const split = `<path d="M236 360 C256 400 262 450 250 520 C236 470 226 420 236 360 Z" fill="${G.black}"/><path d="M238 366 C252 404 258 450 250 510" stroke="#b84a3a" stroke-width="3" fill="none"/><path d="M234 380 C226 420 232 470 248 516" stroke="#e0d090" stroke-width="2.2" fill="none"/>` +
    `<path d="M290 360 C306 380 316 404 312 430 C300 410 292 386 290 360 Z" fill="${G.black}"/>`;
  a.shape(Object.assign({ d: belly, depth: 60, hatch: 110, decals: veins + split + a.stain(300, 480, 30, G.bruise, 0.55) + a.stain(190, 520, 24, '#5f6a40', 0.5) + a.stain(250, 330, 20, G.bruise, 0.4), over: a.drip(248, 520, 30, 3, '#7a5a30') + P.drool(242, 500, 40, '#c8d080') }, skin));
  a.raw(P.flies(320, 320, 10, 80) + P.barnacles(330, 470, 6, 12));
  // gas bubbles weeping from the split
  a.raw([[244, 410, 4], [240, 440, 3], [252, 470, 2.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#c8d080" stroke="${INK}" stroke-width="0.6"/>`).join(''));
}
// little arms
a.limb([[160, 360], [124, 400], [118, 444]], [26, 22, 18], Object.assign({ depth: 8, hatch: 60 }, skin));
a.limb([[340, 360], [374, 410], [370, 452]], [26, 22, 18], Object.assign({ depth: 8, hatch: 120 }, skin));
for (const [x, y] of [[104, 440], [358, 448]]) a.shape(Object.assign({ d: smooth([[x, y], [x + 26, y - 2], [x + 30, y + 18], [x + 14, y + 26], [x - 2, y + 18]], true, 0.6), depth: 5 }, skin));
// head sunk into the swollen shoulders, face stretched
a.shape(Object.assign({ d: smooth([[196, 216], [238, 196], [284, 208], [300, 244], [288, 286], [248, 300], [206, 290], [186, 254]], true, 0.75), depth: 22, hatch: 110,
  decals: P.eye(226, 236, 11, '#c0a840', true) + P.socket(266, 234, 6) + `<path d="M208 262 C222 258 250 258 266 262 C262 292 216 296 208 262 Z" fill="${G.black}"/><path d="M216 276 C228 284 246 284 258 276" stroke="#7a2a24" stroke-width="3" fill="none"/>` + P.teeth(212, 264, 262, 264, 7, 6, 1, '#b8a878') + P.teeth(218, 288, 256, 288, 5, 5, -1, '#b8a878') + a.stain(280, 222, 10, G.bruise, 0.6) + `<path d="M226 225 L222 210 M232 226 L236 212" stroke="${G.bloodL}" stroke-width="0.8"/>`,
  over: P.drool(232, 290, 28, '#c8d080') }, skin));
a.raw(`<path d="M206 214 C214 200 220 186 214 172 M240 200 C246 188 240 176 246 164 M268 204 C276 194 274 182 282 172" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.7"/>`);
// toxic belch
a.raw(Array.from({ length: 6 }, (_, i) => `<path d="${blob(176 - i * 14, 282 - i * 10, 8 + i * 2, R, 9, 0.3)}" fill="${G.slime}" opacity="${(0.45 - i * 0.06).toFixed(2)}"/>`).join(''));
require('fs').writeFileSync('grim/e_bloated.svg', a.svg());
