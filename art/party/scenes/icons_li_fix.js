// Icon redraws for the Living Ink icon set (coordinator's look, 2026-11-24). Injected by scenes/icons_li.js into the staged
// grim/icons.js just before its render loop, so it sees grim's own helpers: a (Art, here scenes/gr_li.js), P (kit), G, INK,
// smooth, poly, f, EC, sig, COL. Every icon here must read at 22 px (UiStyle.icon_tag inline in card and tooltip text):
// one clear silhouette, value contrast over the dark UI, a heavy ink outline under thin parts.
// ---- the void course sign, matched to the Elementalist's (dirAC.js sign, el 'void'): a clean-rimmed black hole in the
// air, a pale rim, the edge thinning into nothing, matter drawn in. Nothing glows. The hole is large and set off-centre in
// the roundel, biting toward its rim, so at 22 px it reads as a hole through the disc and never as an eye (a small dark
// round centred in a pale field).
const voidHole = (cx, cy, r, o = {}) => {
  const ring = (rr, n = 32) => Array.from({ length: n }, (_, i) => { const t = i / n * Math.PI * 2; return [cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]; });
  let s = `<path d="${smooth(ring(r), true, 1)}" fill="#050407"/>`;
  s += `<path d="${smooth(ring(r + 1.4), true, 1)}" fill="none" stroke="#d8d0e0" stroke-width="${f(Math.max(1.6, r * 0.09))}"/>`;
  s += `<path d="${smooth(ring(r + 2.6), true, 1)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`;
  // the edge thinning into nothing: a broken ring outside the rim on the far side
  s += `<path d="${smooth(ring(r + 7, 40).slice(o.from ?? 4, o.to ?? 20), false, 1)}" fill="none" stroke="#4a2a5c" stroke-width="2.2" stroke-dasharray="4 4" opacity="0.85"/>`;
  // matter drawn in: strokes streaming toward the rim, each ending in an inked fleck
  for (const [ang, d0, l] of o.streams || [[-2.6, 1.5, 0.45], [0.5, 1.45, 0.4], [2.2, 1.5, 0.45], [-1.2, 1.4, 0.32]]) {
    const x0 = cx + Math.cos(ang) * r * d0, y0 = cy + Math.sin(ang) * r * d0, x1 = cx + Math.cos(ang + 0.15) * r * (d0 - l), y1 = cy + Math.sin(ang + 0.15) * r * (d0 - l);
    s += `<path d="M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}" stroke="#4a2a5c" stroke-width="${f(Math.max(1.6, r * 0.08))}" stroke-linecap="round"/><circle cx="${f(x1)}" cy="${f(y1)}" r="${f(Math.max(1, r * 0.05))}" fill="${INK}"/>`;
  }
  return s;
};
I.e_void = (a, P) => {
  // the hole has eaten through the roundel's edge: the disc is left a crescent, the void spills past its rim, so nothing dark
  // sits enclosed in a pale field (the eye read is gone at every size)
  const cid = 'evc' + a.seed;
  a.raw(`<defs><clipPath id="${cid}"><path d="M0 0 H128 V128 H0 Z M118 50 a30 30 0 1 0 -60 0 a30 30 0 1 0 60 0 Z" clip-rule="evenodd"/></clipPath></defs>` +
    `<g clip-path="url(#${cid})"><circle cx="64" cy="64" r="48" fill="#efe4c9" opacity="0.9"/>` + sig('fire', 64, 64, 48, COL.void, 3).replace(/<path[\s\S]*$/, '') + `</g>` +
    voidHole(88, 50, 27, { from: 22, to: 38, streams: [[2.4, 1.6, 0.45], [3.0, 1.5, 0.4], [1.9, 1.65, 0.42], [2.75, 1.85, 0.3]] }));
};
// ---- the black pearl: one valve of the shell, a ridged fan standing up behind, and the pearl rolled out of it onto the
// ground in front, off to the right, with its cast shadow and one small highlight high on its left. No shell lips round
// the pearl, no glow, no ring: nothing that frames it like an eye.
I.rl_black_pearl = (a, P) => {
  const fan = [[34, 92], [22, 58], [30, 30], [50, 14], [74, 12], [94, 26], [100, 54], [88, 92]];
  P.S(smooth(fan, true, 0.5), '#a89a88', { depth: 10, mottle: 0.5, outline: 4, lines: [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(i => ({ d: `M62 92 L${f(62 + i * 9.5)} ${f(16 + Math.abs(i) * 3.5)}`, w: 1.8, op: 0.75 })) });
  P.S(smooth([[40, 96], [52, 84], [72, 84], [84, 96], [62, 102]], true, 0.6), '#8a7c6a', { depth: 4, ink: 1.6 });
  a.raw(`<ellipse cx="86" cy="113" rx="18" ry="4.5" fill="${INK}" opacity="0.45"/>`);
  P.S(`M70 98 a16 15 0 1 0 32 0 a16 15 0 1 0 -32 0`, '#1c1a22', { depth: 8, ink: 1.8, outline: 3 });
  a.raw(`<ellipse cx="79" cy="91" rx="4" ry="2.6" fill="#c8c8d0" transform="rotate(-35 79 91)"/><path d="M92 106 q4 -4 5 -9" stroke="#4a4858" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
};
// ---- the eye rune keeps its id; its face is now the void's hole cut into the rune stone (Cole, 2026-11-24): clean-rimmed,
// black, no eye, no glow
I.r_eye = (a, P) => {
  const stone = smooth([[36, 24], [90, 20], [104, 64], [90, 108], [40, 110], [24, 66]], true, 0.6), cid = 'rec' + a.seed;
  a.raw(`<defs><clipPath id="${cid}"><path d="M0 0 H128 V128 H0 Z M110 44 a25 25 0 1 0 -50 0 a25 25 0 1 0 50 0 Z" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#${cid})">`);
  P.S(stone, '#7a766a', { depth: 16, mottle: 0.9 });
  a.raw('</g>' + voidHole(85, 44, 22, { from: 22, to: 38, streams: [[2.5, 1.6, 0.42], [1.9, 1.7, 0.4], [3.1, 1.55, 0.35]] }));
};
// ---- neurotoxin: a hand clawed rigid by the poison, fingers hooked, short tremor strokes beside it, the sting puncture on
// its back, sick green, the veins round it darkened
I.s_neuro = (a, P) => {
  const A = require('./anatomy')(a), sk = '#b0a488';
  a.limb([[50, 132], [54, 116], [58, 98]], [30, 28, 24], { fill: sk, depth: 7, mottle: 0.5, hatch: 60, outline: 6 });
  A.hand([58, 96], [0.12, -1], sk, 1.3, true);
  // the sting: a dark puncture with a raised sick-green ring, green veins spreading from it
  a.raw(`<path d="M52 86 q-8 -6 -12 -14 M66 84 q6 -8 14 -10 M58 92 q-2 10 -8 16" stroke="#5a7a2a" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="59" cy="84" rx="7" ry="5.5" fill="#8aa83a" stroke="${INK}" stroke-width="1.4"/><ellipse cx="59" cy="84" rx="2.6" ry="2" fill="#1a1a0a"/>`);
  // tremor: paired short ink strokes either side of the twitching fingers
  a.raw(['M24 44 q-5 4 0 8 q5 4 0 8', 'M18 62 q-5 4 0 8 q5 4 0 8', 'M100 34 q5 4 0 8 q-5 4 0 8', 'M108 54 q5 4 0 8 q-5 4 0 8', 'M64 4 q4 -3 8 0'].map(d => `<path d="${d}" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join(''));
};
// ---- marked: a rubric mark, a red circle-and-cross daubed by brush on a wooden tag hung on a cord from a nail
I.s_mark = (a, P) => {
  a.raw(`<path d="M34 38 L64 12 L94 38" stroke="${INK}" stroke-width="5" fill="none"/><path d="M34 38 L64 12 L94 38" stroke="#9a8a68" stroke-width="2.6" fill="none"/>` + a.rivet(64, 12, 4));
  P.S(smooth([[26, 36, 1], [102, 34, 1], [104, 108, 1], [24, 110, 1]].map(p => [p[0], p[1]]), true, 0.12), '#7a6248', { depth: 10, tex: 'url(#grain)', texOp: 0.45, mottle: 0.4, outline: 5 });
  a.raw(`<circle cx="34" cy="40" r="3" fill="${INK}"/><circle cx="94" cy="38" r="3" fill="${INK}"/>`);
  // the daub: a thick brush ring and cross in rubric red, dry-brushed (gaps where the brush ran out), a drip from the cross
  const ring = 'M64 47 C80 46 90 58 88 72 C86 88 74 96 62 95 C46 94 38 82 40 70 C42 57 50 48 66 47';
  a.raw(`<path d="${ring}" stroke="#8a1e14" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${ring}" stroke="#b8321e" stroke-width="5" fill="none" stroke-dasharray="22 3 30 2 40 4" stroke-linecap="round"/>` +
    `<path d="M64 50 L63 92 M43 71 L85 70" stroke="#8a1e14" stroke-width="8" stroke-linecap="round"/><path d="M64 52 L63 90 M45 71 L83 70" stroke="#b8321e" stroke-width="4" stroke-dasharray="14 3 20 2" stroke-linecap="round"/>` +
    `<path d="M62 95 q1 6 0 10" stroke="#8a1e14" stroke-width="3" stroke-linecap="round"/><circle cx="62" cy="106" r="2.4" fill="#8a1e14"/>` +
    `<path d="M44 58 l6 2 M80 86 l6 -2 M70 50 l5 3" stroke="#d8c8a8" stroke-width="1.2" opacity="0.6"/>`);
};
// ---- the rosary: fewer, bigger beads on a heavy cord, a large crucifix (holy: gilt)
I.t_rosary = (a, P) => {
  const pts = Array.from({ length: 13 }, (_, i) => { const t = -Math.PI / 2 + (i + 0.5) / 13 * Math.PI * 2; return [64 + Math.cos(t) * 34, 46 + Math.sin(t) * 28]; });
  a.raw(`<path d="${smooth(pts, true, 1)}" stroke="${INK}" stroke-width="6" fill="none"/><path d="${smooth(pts, true, 1)}" stroke="#8a7a5a" stroke-width="2.6" fill="none"/><path d="M64 74 L64 82" stroke="${INK}" stroke-width="6"/>`);
  for (const [x, y] of pts) P.S(`M${f(x - 7)} ${f(y)} a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0`, '#6a4a2e', { depth: 4, ink: 1.6 });
  P.S(poly([[58, 80], [70, 80], [70, 90], [84, 90], [84, 101], [70, 101], [70, 124], [58, 124], [58, 101], [44, 101], [44, 90], [58, 90]]), G.gold, { depth: 6, ink: 1.8, outline: 5, spec: ['M61 84 L61 120'] });
};
// ---- the hangman's knot: a heavy rope, the coils of the knot thick and banded, the noose open below
I.t_hangmans_knot = (a, P) => {
  const loop = 'M64 50 C26 58 26 112 64 120 C102 112 102 58 64 50';
  a.raw(`<path d="M64 2 L64 50 ${loop}" stroke="${INK}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M64 2 L64 50 ${loop}" stroke="#a8946a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M64 2 L64 50 ${loop}" stroke="#6a5a3a" stroke-width="10" fill="none" stroke-dasharray="3 6" opacity="0.8"/>`);
  P.S(smooth([[50, 18, 1], [78, 18, 1], [80, 58, 1], [48, 58, 1]].map(p => [p[0], p[1]]), true, 0.25), '#a8946a', { depth: 6, ink: 2, outline: 4, lines: Array.from({ length: 7 }, (_, i) => ({ d: `M48 ${22 + i * 5.4} Q64 ${26 + i * 5.4} 80 ${22 + i * 5.4}`, w: 2.2, op: 0.9 })) });
};
// ---- quick: a flight feather made broad and dark-edged, rachis heavy, with three speed strokes trailing it
I.quick = (a, P) => {
  const vane = [[18, 116], [28, 86], [48, 54], [78, 24], [110, 6], [102, 30], [90, 58], [72, 76], [52, 94], [32, 108]];
  P.S(smooth(vane, true, 0.5), '#d8ccb0', { depth: 8, mottle: 0.4, outline: 5, lines: Array.from({ length: 12 }, (_, i) => { const t = i / 12, x = 30 + t * 70, y = 104 - t * 88; return { d: `M${f(x)} ${f(y)} l${f(12 - t * 5)} ${f(7 - t * 2)}`, w: 1.6, op: 0.7 }; }) });
  a.raw('<path d="M14 124 C36 94 70 50 108 8" stroke="#1c130c" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M14 124 C36 94 70 50 108 8" stroke="#efe4c9" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    '<path d="M70 40 l-26 -2 M58 58 l-30 0 M48 76 l-24 2" stroke="#1c130c" stroke-width="4" stroke-linecap="round" opacity="0.85"/>');
};
// ---- blight: a flower rotting on its stalk, head hung, sick olive petals spotted with mould, a curled dead leaf
I.s_blight = (a, P) => {
  a.raw(`<path d="M58 122 C56 96 66 70 76 52 C84 40 80 32 72 34" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M58 122 C56 96 66 70 76 52 C84 40 80 32 72 34" stroke="#5a5a34" stroke-width="5.4" fill="none" stroke-linecap="round"/>`);
  P.S(smooth([[60, 96], [36, 84], [28, 92], [44, 104]], true, 0.6), '#5a4a2a', { depth: 4, ink: 1.6, outline: 4, lines: ['M58 96 L36 90'] });
  for (let i = 0; i < 5; i++) { const t = 0.4 + i * 0.55, px = 68 + Math.cos(t) * 20, py = 46 + Math.sin(t) * 22; P.S(smooth([[68, 40], [px - 8, py - 4], [px + 2, py + 10], [px + 9, py]], true, 0.6), '#6a6a3e', { depth: 5, ink: 1.6, outline: 4 }); }
  P.S(`M60 40 a9 8 0 1 0 18 0 a9 8 0 1 0 -18 0`, '#2a2a18', { depth: 4, ink: 1.6 });
  a.raw([[56, 60], [82, 70], [70, 74], [50, 50], [86, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#c8c890" stroke="${INK}" stroke-width="0.8"/>`).join('') + P.D.motes(64, 26, 26, 6, '#3a3a20'));
};
// ---- the witch's skull: the sockets dark, a dim candle-warm ember low in each (not a pupil), a green witch-flame above
I.w_witch_skull = (a, P) => {
  P.skull(64, 62, 34, G.bone);
  a.raw([-1, 1].map(s => `<path d="M${f(64 + s * 13 - 5)} ${f(69)} q5 -2.4 10 0 q-5 2 -10 0 Z" fill="#8a5428" opacity="0.5"/>`).join(''));
  a.raw(P.D.flame(64, 32, 30, 10).replace(/#c8481c/g, '#3a5a20').replace(/#f08a30/g, '#7a9a3a').replace(/#ffd27a/g, '#c8e880') + P.D.chain(30, 100, 98, 100, 10, G.iron));
};
// ---- silence: a mouth sewn shut, drawn as a mouth (a cupid's bow over a full lower lip, the corners creased, a chin
// line below), the stitches heavy, a bead of old blood at one stitch
I.s_silence = (a, P) => {
  P.S(smooth([[16, 66], [34, 50], [52, 46], [64, 52], [76, 46], [94, 50], [112, 66], [94, 86], [64, 94], [34, 86]], true, 0.55), '#a88a78', { depth: 12, ink: 1.8, outline: 4 });
  a.raw(`<path d="M18 66 Q40 60 64 66 Q88 60 110 66" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M12 62 q-4 4 0 8 M116 62 q4 4 0 8 M44 108 Q64 116 84 108" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>` +
    Array.from({ length: 7 }, (_, i) => `<path d="M${30 + i * 11} 52 L${35 + i * 11} 80" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${30 + i * 11} 52 L${35 + i * 11} 80" stroke="#d8ccb0" stroke-width="1.6" stroke-linecap="round"/>`).join('') +
    `<circle cx="59" cy="82" r="3" fill="${G.bloodD}"/>`);
};
// ---- thorns: a heavy bramble, the stem thick, the thorns big pale hooks along it
I.s_thorns = (a, P) => {
  const d = 'M8 76 C30 40 50 104 70 62 C86 30 104 74 120 48';
  a.raw(`<path d="${d}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#4a5a2a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#6a7a3a" stroke-width="3" fill="none" transform="translate(-1 -2)" opacity="0.7"/>`);
  for (const [x, y, ang] of [[22, 58, -2.0], [38, 72, 1.3], [58, 82, 1.6], [74, 54, -1.7], [92, 52, 1.2], [108, 58, -1.4], [48, 66, -1.9]]) {
    const tx = x + Math.cos(ang) * 16, ty = y + Math.sin(ang) * 16, nx = -Math.sin(ang) * 5, ny = Math.cos(ang) * 5;
    a.raw(`<path d="M${f(x + nx)} ${f(y + ny)} L${f(tx)} ${f(ty)} L${f(x - nx)} ${f(y - ny)} Z" fill="#d8ccaa" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`);
  }
};
// ---- the tooth charm: three big teeth on a heavy thong
I.t_tooth_charm = (a, P) => {
  a.raw(`<path d="M18 20 C36 64 92 64 110 20" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M18 20 C36 64 92 64 110 20" stroke="#7a5a3a" stroke-width="3.6" fill="none" stroke-linecap="round"/>`);
  for (const [x, y, h] of [[40, 52, 40], [64, 58, 52], [88, 52, 40]]) P.S(smooth([[x - 11, y], [x + 11, y], [x + 7, y + h * 0.7], [x, y + h], [x - 7, y + h * 0.7]], true, 0.5), G.bone, { depth: 5, ink: 1.8, outline: 4 });
};
// ---- the Pearl of Ysolde: a pale pearl with a soft nacre sheen, a curved iridescent streak (pale blue-lilac beside warm
// ivory) following the sphere round its lower right, and one small off-centre highlight high on its left. No red fleck,
// no central dot, no ring: nothing in it reads as an eye at 22 px.
I.t_pearl_of_ysolde = (a, P) => {
  P.S(`M36 66 a28 27 0 1 0 56 0 a28 27 0 1 0 -56 0`, '#e6e1d6', { depth: 14, ink: 1.8, outline: 4 });
  const arc = (r, a0, a1, cx = 64, cy = 66) => Array.from({ length: 9 }, (_, i) => { const t = a0 + (a1 - a0) * i / 8; return [cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.96]; });
  a.raw(`<path d="${smooth(arc(21, -0.35, 1.75), false, 1)}" stroke="#b8b4d8" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7"/>` +
    `<path d="${smooth(arc(16.5, -0.15, 1.55), false, 1)}" stroke="#f2e4c4" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.8"/>` +
    `<path d="${smooth(arc(24.5, 0.1, 1.2), false, 1)}" stroke="#c8d8e0" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.55"/>` +
    `<ellipse cx="52" cy="53" rx="6.5" ry="4" fill="#fbf8f0" transform="rotate(-35 52 53)"/><ellipse cx="60" cy="49" rx="2" ry="1.4" fill="#fbf8f0" opacity="0.8"/>`);
};
