// Figures for scene previews. Renders a keeper or hero facing LEFT the way GUIDE.md section 2 renders foes: drawn with the
// key light mirrored ([0.6,-0.8], as kit.foeBase) and then flipped, so after the mirror the key light is still upper left.
// Shared files are not edited: kit.base is wrapped in this process only.
// Usage: node scenes/figs.js <module> <key> <outPrefix> [left|mirror|right] [dropBone,dropBone...]
//   left: mirrored light and flipped (ready to view); mirror: mirrored light, not flipped (the game's exporter flips it
//   when the room's keeper entry says flip: true); right: as drawn.
//   dropBone: leave out the parts bound to these bones (a keeper's own furniture, when the room draws its own: Ide's
//   relic_case, Lucan's desk). Prints the figure's alpha-free top (lowest y of any drawn part is not computed here; the
//   room uses the rendered bbox).
'use strict';
const fs = require('fs');
const path = require('path');
const KIT = require('../kit');
const [mod, key, outP, side = 'right', drop = ''] = process.argv.slice(2);
if (side === 'left' || side === 'mirror') { const orig = KIT.base; KIT.base = (seed, o = {}) => orig(seed, Object.assign({ light: [0.6, -0.8] }, o)); }
const D = require(path.resolve(__dirname, '..', mod));
const h = D.heroes.find(q => q.key === key);
const W = h.w || 600, H = h.h || 820, f = h.build(), dropSet = new Set(drop.split(',').filter(Boolean));
const body0 = dropSet.size ? f.runs().filter(r => !dropSet.has(r.bone)).map(r => r.body).join('') : f.svg().body;
const defs = f.sharedDefs() + f.defs.join('\n');
const body = side === 'left' ? `<g transform="translate(${W},0) scale(-1,1)">${body0}</g>` : body0;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${body}</svg>`;
fs.writeFileSync(outP + '.svg', svg);
console.log('wrote', outP + '.svg', dropSet.size ? 'without ' + [...dropSet].join(',') : '');
