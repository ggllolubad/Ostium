// Usage: node card_figure.js <module> <key> '<pose json>' <out.svg> [list]
// Lives in the Living Ink art workspace (art/party) next to engine.js; a copy is kept here. emblem.py runs it there (PARTY env).
// Writes the hero posed as one SVG (vector, any size): each draw-order run is rotated about its bone chain's rest
// pivots, parent outermost, the same composition posetest.py and the game's BoneRig use. For card art close-ups.
'use strict';
const fs = require('fs');
const [mod, key, poseJson, out, list = 'heroes'] = process.argv.slice(2);
const D = require('./' + mod);
const h = D[list].find(q => q.key === key);
if (!h) { console.error('no figure ' + key + ' in ' + mod); process.exit(1); }
const f = h.build(), W = h.w || 600, H = h.h || 820;
const rot = JSON.parse(poseJson || '{}');
const J = f.joints;
const chain = b => { const c = []; while (b && J[b]) { c.push(b); b = J[b].parent; } return c.reverse(); };
const defs = f.sharedDefs() + f.defs.join('\n');
let body = '';
for (const r of f.runs()) {
  const ops = r.bone === 'root' || !J[r.bone] ? [] : chain(r.bone).filter(b => rot[b]).map(b => `rotate(${rot[b]} ${J[b].pivot[0]} ${J[b].pivot[1]})`);
  body += ops.length ? `<g transform="${ops.join(' ')}">${r.body}</g>` : r.body;
}
const lean = rot.lean ? `rotate(${rot.lean} ${W / 2} ${f.o.groundY})` : '';
const wrap = (h.flip ? `translate(${W},0) scale(-1,1) ` : '') + lean;
const P = 300;   // room around the canvas so a raised weapon is not clipped
fs.writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" width="${W + 2 * P}" height="${H + 2 * P}" viewBox="${-P} ${-P} ${W + 2 * P} ${H + 2 * P}" overflow="visible"><defs>${defs}</defs><g transform="${wrap}">${body}</g></svg>`);
console.log(JSON.stringify({ key, W, H, pad: P, ground: f.o.groundY, joints: Object.fromEntries(Object.entries(J).map(([k, v]) => [k, v.pivot])) }));
