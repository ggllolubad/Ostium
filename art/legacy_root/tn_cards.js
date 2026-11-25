const { C } = require('./tn_style');
const fs = require('fs');
const INK = C.ink;
// Tarot card plates, 168x128 with an arched top (clipped), Mucha ornament.
const wrap = (id, bg, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="168" height="128" viewBox="0 0 168 128"><defs><clipPath id="${id}"><path d="M2 126 L2 64 C2 28 32 2 84 2 C136 2 166 28 166 64 L166 126 Z"/></clipPath><filter id="sf${id}"><feGaussianBlur stdDeviation="5"/></filter></defs><g clip-path="url(#${id})"><rect width="168" height="128" fill="${bg}"/>${body}</g><path d="M2 126 L2 64 C2 28 32 2 84 2 C136 2 166 28 166 64 L166 126 Z" fill="none" stroke="${INK}" stroke-width="3"/><path d="M9 126 L9 65 C9 34 36 9 84 9 C132 9 159 34 159 65 L159 126" fill="none" stroke="${C.ochre}" stroke-width="2"/></svg>`;
const rays = (cx, cy, col) => Array.from({ length: 18 }, (_, i) => { const a = Math.PI * (i / 17); return `<path d="M${cx} ${cy} L${(cx - Math.cos(a) * 140).toFixed(1)} ${(cy - Math.sin(a) * 140).toFixed(1)}" stroke="${col}" stroke-width="2" opacity="0.35"/>`; }).join('');

const tide = wrap('a', C.tealL,
  `<circle cx="84" cy="64" r="44" fill="${C.cream}" opacity="0.55"/>` +
  `<path d="M-4 128 L-4 82 C20 46 76 36 108 60 C128 76 118 102 98 98 C84 95 88 78 102 80 C92 66 54 70 32 100 L32 128 Z" fill="${C.teal}" stroke="${INK}" stroke-width="2.6"/>` +
  `<path d="M108 60 C118 56 128 62 126 70 M98 98 C110 106 124 100 128 92" fill="none" stroke="${C.cream}" stroke-width="2"/>` +
  `<path d="M126 128 C134 106 152 98 172 102 L172 128 Z" fill="${C.tealD}" stroke="${INK}" stroke-width="2.6"/>` +
  `<path d="M40 42 C70 32 110 30 148 40 C110 50 70 52 40 42 Z" fill="${C.seafoam}" stroke="${INK}" stroke-width="2.4"/><path d="M60 41 C90 37 120 37 140 40" fill="none" stroke="#fff" stroke-width="2"/>` +
  `<path d="M148 40 L160 34 L156 40 L160 46 Z" fill="${C.cream}" stroke="${INK}" stroke-width="2"/>`);

const kindle = wrap('b', C.plum,
  rays(84, 100, C.ochreL) + `<circle cx="84" cy="80" r="46" fill="${C.ochre}" opacity="0.3" filter="url(#sfb)"/>` +
  `<path d="M84 118 C56 108 50 78 62 52 C66 68 74 74 80 68 C76 52 80 32 92 20 C92 42 104 52 112 46 C120 70 116 106 84 118 Z" fill="${C.rose}" stroke="${INK}" stroke-width="2.6"/>` +
  `<path d="M84 112 C70 104 70 88 78 78 C82 90 88 92 92 86 C98 96 96 108 84 112 Z" fill="${C.ochreL}" stroke="${INK}" stroke-width="2"/>` +
  `<path d="M38 128 C48 114 66 112 84 118 C102 112 120 114 130 128 Z" fill="${C.sage}" stroke="${INK}" stroke-width="2.4"/>`);

const rime = wrap('c', C.tealD,
  `<circle cx="84" cy="70" r="50" fill="${C.tealL}" opacity="0.35"/>` +
  `<g stroke="${INK}" stroke-width="2.4"><path d="M84 70 C70 46 74 26 84 18 C94 26 98 46 84 70 Z M84 70 C98 94 94 114 84 122 C74 114 70 94 84 70 Z M84 70 C60 56 40 60 34 70 C40 80 60 84 84 70 Z M84 70 C108 84 128 80 134 70 C128 60 108 56 84 70 Z" fill="${C.cream}"/>` +
  `<path d="M84 70 C70 54 58 50 50 52 C52 62 64 66 84 70 Z M84 70 C98 86 110 90 118 88 C116 78 104 74 84 70 Z M84 70 C98 54 110 50 118 52 C116 62 104 66 84 70 Z M84 70 C70 86 58 90 50 88 C52 78 64 74 84 70 Z" fill="${C.seafoam}"/></g>` +
  `<circle cx="84" cy="70" r="7" fill="${C.ochreL}" stroke="${INK}" stroke-width="2"/>`);

const arc = wrap('d', '#4d4a5c',
  `<path d="M14 46 C4 22 40 6 60 22 C72 2 112 2 120 22 C138 8 172 22 162 48 C150 58 26 58 14 46 Z" fill="${C.steel}" stroke="${INK}" stroke-width="2.6"/>` +
  `<path d="M60 34 C66 24 80 24 82 34 C84 42 72 44 70 38" fill="none" stroke="${INK}" stroke-width="1.6"/>` +
  [[44, 'M44 56 C34 74 52 82 40 102 C34 112 42 120 36 128'], [84, 'M84 56 C76 78 96 86 84 108 C78 118 88 124 84 128'], [124, 'M124 56 C118 72 132 82 124 100 C120 110 128 118 124 128']].map(([, d]) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.ochreL}" stroke-width="3.6" stroke-linecap="round"/>`).join('') +
  `<path d="M40 102 C50 98 56 104 52 110 M84 108 C94 104 100 110 96 116" fill="none" stroke="${C.ochre}" stroke-width="2" stroke-linecap="round"/>`);

fs.writeFileSync('src/tn_card_tide.svg', tide);
fs.writeFileSync('src/tn_card_kindle.svg', kindle);
fs.writeFileSync('src/tn_card_rime.svg', rime);
fs.writeFileSync('src/tn_card_arc.svg', arc);
