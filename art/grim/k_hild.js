// Mother Hild, smith of the Undercroft. Short and broad, a hammer laid on her near shoulder, cropped grey hair
// that stands out in a halo of static, smoked goggles pushed up on her brow, Lichtenberg scars branching up both bare
// forearms, a habit kilted up over breeches, a scorched leather apron, clogs. Faces left. Canvas 560 x 860, ground 830.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const a = new Art(560, 860, 4417), R = a.R;
const K = require('./keeperkit')(a);
const DETAIL = process.env.PASS !== 'base';
const SKIN = '#b98a68', HAB = '#4a4038', APRON = '#5a3a24', HAIR = '#9e9a92';

// Lichtenberg figure: a branching fern of fine pale scar lines from a root point
const lichten = (x, y, ang, len, depth = 3) => {
  let o = '';
  const grow = (x0, y0, t, l, d) => {
    let px = x0, py = y0; const n = 4;
    let path = `M${f(px)} ${f(py)}`;
    for (let i = 0; i < n; i++) { const tt = t + (R() - 0.5) * 0.9; px += Math.cos(tt) * l / n; py += Math.sin(tt) * l / n; path += ` L${f(px)} ${f(py)}`;
      if (d > 0 && R() < 0.75) grow(px, py, t + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.6), l * 0.55, d - 1); }
    o += `<path d="${path}" stroke="#d4e8f2" stroke-width="${f(0.9 + d * 0.75)}" fill="none" stroke-linecap="round" opacity="0.9"/><path d="${path}" stroke="#7a3e2e" stroke-width="${f(0.2 + d * 0.2)}" fill="none" opacity="0.5" transform="translate(0.6 0.6)"/>`;
  };
  grow(x, y, ang, len, depth);
  return o;
};

a.raw(a.ground(270, 830, 175, 13));

// ---------------------------------------------------------------- far arm (her right, leading edge), tongs hanging
const tongs = () => {
  const p0 = [136, 548], p1 = [114, 704], p2 = [140, 706];
  a.raw(`<path d="M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]} M${p0[0] + 8} ${p0[1]} L${p2[0]} ${p2[1]}" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/>` +
    `<path d="M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]} M${p0[0] + 8} ${p0[1]} L${p2[0]} ${p2[1]}" stroke="${G.iron}" stroke-width="4.2" stroke-linecap="round"/>` +
    `<circle cx="${p0[0] + 4}" cy="${p0[1] + 28}" r="4.5" fill="${G.steelD}" stroke="${INK}" stroke-width="1.6"/>` +
    `<path d="M${p1[0]} ${p1[1]} q-6 10 2 18 M${p2[0]} ${p2[1]} q6 10 -2 18" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`);
};
// ---------------------------------------------------------------- legs: breeches to the knee, wool hose, clogs
const leg = (hip, knee, ank, toe) => {
  a.limb([hip, knee], [72, 60], { fill: '#3a3430', depth: 12, mottle: 0.4, hatch: 70, grime: 0.5, decals: a.fold(hip[0], hip[1] + 10, knee[0], knee[1] - 8, 6) });
  a.limb([knee, ank], [54, 40], { fill: '#5e5448', depth: 9, mottle: 0.5, hatch: 70, tex: 'url(#weave)', texOp: 0.5, grime: 0.5 });
  // a clog: a carved wooden block with a thick sole and an upturned, scorched toe
  a.shape({ d: smooth([[ank[0] + 24, ank[1] - 10], [ank[0] + 28, ank[1] + 34], [toe[0] - 4, toe[1] + 6], [toe[0] - 16, toe[1] - 4], [toe[0] - 10, toe[1] - 18], [ank[0] - 24, ank[1] - 2], [ank[0] - 20, ank[1] - 14]], true, 0.3), fill: '#5a4430', depth: 9, hatch: 20, ink: 2.4, grime: 0.6, tex: 'url(#grain)', texOp: 0.5,
    lines: [{ d: `M${toe[0] - 12} ${toe[1] - 2} L${ank[0] + 28} ${ank[1] + 26}`, w: 2.2 }, { d: `M${ank[0] - 18} ${ank[1] - 4} Q${ank[0]} ${ank[1] + 4} ${ank[0] + 22} ${ank[1] - 4}`, w: 1.2, op: 0.7 }],
    decals: a.stain(toe[0], toe[1] - 6, 10, '#0e0804', 0.6) });
};
leg([228, 600], [200, 688], [212, 784], [156, 818]);
leg([302, 600], [318, 698], [318, 790], [266, 826]);

// ---------------------------------------------------------------- the habit, kilted up: skirts hauled into the belt
const hab = K.habit({ cx: 260, sh: 324, sw: 116, waist: 470, hem: 650, flare: 1.18, col: HAB, dirt: 0.15,
  folds: [[-0.7, -0.1], [-0.3, 0.05], [0.1, -0.05], [0.5, 0.06], [0.8, 0.1]] });
K.arm({ sh: [168, 352], el: [146, 452], wr: [140, 540], col: HAB, w: 1.3, skin: SKIN, rolled: true, hand: 'fist', dir: [-0.2, 1], hatch: 120,
  foreDecals: DETAIL ? lichten(148, 470, 1.6, 60) + lichten(144, 500, 1.9, 36, 2) + a.stain(142, 520, 10, '#2a1a10', 0.35) : '' });

// the tucked-up hem: the skirts pulled to a bunch at the near hip, so the front rides high over the breeches
a.shape({ d: smooth([[170, 470], [356, 470], [372, 560], [352, 640], [300, 610], [250, 596], [196, 620], [158, 600]], true, 0.4), fill: dark(HAB, 0.05), depth: 20, ink: 2, hatch: 70, mottle: 0.4, grime: 0.4,
  decals: a.fold(200, 480, 180, 600, 8) + a.fold(330, 480, 350, 620, 8) + a.fold(270, 480, 260, 590, 6) + a.fold(352, 476, 300, 600, 7) + a.fold(352, 476, 230, 604, 7) + a.fold(352, 476, 180, 606, 6),
  lines: [{ d: 'M164 600 Q200 616 250 598 Q300 610 352 640', w: 2.2 }] });
// the bunched skirt tucked through the belt at the near hip
a.shape({ d: smooth([[338, 452], [372, 450], [384, 480], [370, 520], [346, 506]], true, 0.4), fill: dark(HAB, 0.1), depth: 8, ink: 2, hatch: 70, mottle: 0.4, lines: [{ d: 'M346 460 Q360 480 352 504 M360 456 Q372 480 366 512', w: 1, op: 0.7 }] });
tongs();

// ---------------------------------------------------------------- the apron: heavy scorched leather, bib to the shins
a.shape({ d: smooth([[214, 360], [292, 356], [300, 470], [330, 520], [338, 700], [300, 716], [240, 718], [196, 706], [196, 520], [210, 470]], true, 0.3), fill: APRON, depth: 22, ink: 2.4, hatch: 60, mottle: 0.55, grime: 0.6,
  decals: a.stain(250, 600, 40, '#1a0e08', 0.55) + a.stain(290, 660, 26, '#0e0804', 0.6) + (DETAIL ? Array.from({ length: 16 }, () => { const x = 206 + R() * 124, y = 520 + R() * 190; return `<path d="${blob(x, y, 2 + R() * 4, R, 7, 0.5)}" fill="#120a06" opacity="0.85"/><path d="${blob(x, y, 4 + R() * 4, R, 8, 0.4)}" fill="none" stroke="#2a160c" stroke-width="0.8" opacity="0.7"/>`; }).join('') : '') +
    a.fold(232, 480, 226, 700, 8) + a.fold(290, 480, 306, 706, 7),
  lines: [{ d: 'M206 470 L302 470', w: 1.4, op: 0.8 }, ...(DETAIL ? [{ d: 'M210 716 l6 -12 l8 10 l7 -14 l9 12 l8 -8', w: 1, op: 0.6 }] : [])] });
// apron strap and the belt over it, with tools
a.raw(`<path d="M222 362 L196 322 M286 358 L318 320" stroke="${INK}" stroke-width="7"/><path d="M222 362 L196 322 M286 358 L318 320" stroke="${G.leatherD}" stroke-width="4"/>`);
a.shape({ d: smooth([[188, 462], [352, 458], [356, 480], [188, 486]], true, 0.2), fill: G.leatherD, depth: 4, ink: 1.8, hatch: 20, core: false,
  decals: `<rect x="238" y="460" width="20" height="24" fill="none" stroke="${G.iron}" stroke-width="3"/>` });
K.keys(340, 492, 0.7, 3);
// a cold chisel and a set punch in the belt
a.raw(`<path d="M316 470 L322 546" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M316 470 L322 546" stroke="${G.steelD}" stroke-width="5"/><path d="M304 470 L306 528" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M304 470 L306 528" stroke="${G.iron}" stroke-width="4"/>`);

// ---------------------------------------------------------------- shoulders, neck, the cowl lying back
K.cowl(268, 316, 160, dark(HAB, 0.1));
a.limb([[256, 324], [252, 296]], [62, 58], { fill: SKIN, depth: 10, mottle: 0.5, hatch: 120, decals: a.stain(258, 316, 18, dark(SKIN, 0.4), 0.55) });

// ---------------------------------------------------------------- head
const F = K.face({ x: 248, y: 252, k: 1.06, skin: SKIN, age: 0.6, nose: 'round', brow: 0.9, mouth: 'set', eye: 'narrow', cheek: 0.7, jaw: 1.15, browCol: '#7a7670',
  scars: DETAIL ? [[[-30, 18], [-24, 22], [-20, 20]], [[6, -32], [12, -24]]] : [] });
K.hair(F, 'static', HAIR, 1.06);
// smoked goggles pushed up onto the brow: two dark lenses in brass rims on a leather band
{
  const p = F.p;
  a.raw(`<path d="M${p(-30, -34).join(' ')} Q${p(4, -40).join(' ')} ${p(36, -30).join(' ')}" stroke="${INK}" stroke-width="7" fill="none"/><path d="M${p(-30, -34).join(' ')} Q${p(4, -40).join(' ')} ${p(36, -30).join(' ')}" stroke="${G.leatherD}" stroke-width="4.5" fill="none"/>`);
  for (const [u, v, r] of [[-22, -40, 11], [-2, -43, 10]]) {
    const [cx, cy] = p(u, v);
    a.raw(`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${r}" ry="${f(r * 0.8)}" fill="#1a1c1e" stroke="${INK}" stroke-width="2.4"/><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${r - 2.5}" ry="${f(r * 0.8 - 2.5)}" fill="none" stroke="${G.gold}" stroke-width="2"/><path d="M${f(cx - r * 0.5)} ${f(cy - r * 0.3)} l${f(r * 0.4)} ${f(-r * 0.2)}" stroke="#8aa0b0" stroke-width="1.6" opacity="0.7"/>`);
  }
}

// ---------------------------------------------------------------- near arm (her left): hand at the shoulder, the hammer laid back over it
// the arm first, then the hammer laid over the shoulder, then the fist closed on the haft
K.arm({ sh: [344, 340], el: [368, 436], wr: [326, 362], col: HAB, w: 1.3, skin: SKIN, rolled: true, hand: false, hatch: 120,
  foreDecals: DETAIL ? lichten(344, 420, -1.9, 50) + lichten(336, 400, -2.2, 30, 2) : '' });
{
  const hand = [324, 350], end = [412, 262], butt = [280, 410];
  a.shape({ d: limb([butt, hand, end], [11, 12, 13]), fill: G.wood, depth: 4, ink: 1.8, hatch: 20, core: false, tex: 'url(#grain)', texOp: 0.5 });
  const hx = end[0], hy = end[1];
  a.shape({ d: smooth([[hx - 30, hy - 26], [hx + 4, hy - 34], [hx + 34, hy - 20], [hx + 40, hy - 4], [hx + 10, hy + 12], [hx - 26, hy + 4]], true, 0.25), fill: G.iron, depth: 10, ink: 2.2, hatch: 30, mottle: 0.5,
    decals: a.stain(hx + 10, hy - 6, 12, G.rust, 0.5) + (DETAIL ? `<path d="M${hx + 34} ${hy - 20} L${hx + 40} ${hy - 4}" stroke="#d8d4c8" stroke-width="2" opacity="0.7"/>` : '') });
}
K.hand([326, 362], SKIN, [-0.3, -1], 1.3 * 1.25, 'grip');

// ---------------------------------------------------------------- detail pass: soot, burns, wear, the static she carries
if (DETAIL) {
  const p = F.p;
  // soot wiped across the cheek and brow, sweat sheen on the nose and forehead
  a.raw(`<g opacity="0.55">${a.stain(...p(-14, 12), 12, '#1a120c', 0.6)}${a.stain(...p(4, -26), 10, '#1a120c', 0.5)}</g>` +
    `<path d="M${p(-36, -2).join(' ')} q-2 4 -1 7" stroke="#fff4e0" stroke-width="1.4" opacity="0.55" fill="none"/><path d="M${p(-22, -30).join(' ')} q6 -3 12 -2" stroke="#fff4e0" stroke-width="1.2" opacity="0.45" fill="none"/>`);
  // burn holes and scorch along the kilted skirts and sleeves, a darned patch on the near shoulder
  let burns = '';
  for (const [x, y, r] of [[166, 580], [352, 600], [176, 640], [362, 520], [150, 420], [380, 400]].map(q => [...q, 3 + R() * 4]))
    burns += `<path d="${blob(x, y, r * 2.4, R, 8, 0.5)}" fill="#1a120c" opacity="0.45"/><path d="${blob(x, y, r, R, 7, 0.5)}" fill="#0a0604" stroke="#6a3a1a" stroke-width="0.8"/>`;
  a.raw(burns);
  a.shape({ d: smooth([[352, 330], [380, 334], [384, 360], [356, 362]], true, 0.2), fill: '#5a5046', depth: 3, ink: 1.2, hatch: 120, core: false,
    lines: [{ d: 'M352 333 l4 3 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3', w: 0.8, op: 0.8 }, { d: 'M356 362 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3', w: 0.8, op: 0.8 }] });
  // rivets at the apron corners, a hot-iron brand on the bib: the order's door
  a.raw([[218, 366], [290, 362], [206, 474], [300, 472]].map(([x, y]) => a.rivet(x, y, 2.6)).join('') +
    `<path d="M244 400 L244 384 Q254 374 264 384 L264 400 Z" fill="none" stroke="#1a0e08" stroke-width="2.6" opacity="0.8"/>`);
  // the haft bound with cord below the head, and a leather cuff on the near wrist
  a.raw(`<path d="M382 300 l10 -8 M378 306 l10 -8 M374 312 l10 -8 M370 318 l10 -8" stroke="${INK}" stroke-width="3"/><path d="M382 300 l10 -8 M378 306 l10 -8 M374 312 l10 -8 M370 318 l10 -8" stroke="#8a7a5a" stroke-width="1.6"/>`);
  // static: a few cold blue-white threads crawling in the hair (emissive in the lit scene)
  let st = '';
  for (let i = 0; i < 6; i++) { const t = Math.PI * (1.0 + R() * 0.95), c = p(8, -6), r0 = 40 + R() * 10, r1 = r0 + 14 + R() * 12; let d = `M${f(c[0] + Math.cos(t) * r0)} ${f(c[1] + Math.sin(t) * r0)}`;
    for (let j = 1; j <= 4; j++) { const rr = r0 + (r1 - r0) * j / 4, tt = t + (R() - 0.5) * 0.18; d += ` L${f(c[0] + Math.cos(tt) * rr)} ${f(c[1] + Math.sin(tt) * rr)}`; }
    st += `<path d="${d}" stroke="#bfe6ff" stroke-width="2.6" fill="none" opacity="0.35"/><path d="${d}" stroke="#f2fbff" stroke-width="0.9" fill="none"/>`; }
  a.raw(`<g class="em">${st}</g>`);
}

fs.writeFileSync(`grim/keepers/hild${DETAIL ? '' : '_base'}.svg`, a.svg());
console.log('hild', DETAIL ? 'detail' : 'base');
