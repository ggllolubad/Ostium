// Variety library sheet: node cards/varsheet.js <out.png> [course] [key,key,...] [scale] [cols]
// Every object from objects6+.js on a grey tile, named (the L9 form check at 2x, the L8 read at small scale).
'use strict';
const fs = require('fs');
const { chromium } = require('playwright');
const K = require('./card_kit');
(async () => {
  const out = process.argv[2], course = process.argv[3] || 'physical';
  const all = {}; for (const fn of fs.readdirSync(__dirname).filter(n => /^objects([6-9]|\d\d)\.js$/.test(n)).sort((a, b) => parseInt(a.slice(7)) - parseInt(b.slice(7)))) Object.assign(all, require('./' + fn).O);
  if (process.argv[4] && process.argv[4] !== '-') { require('./samples'); Object.assign(all, Object.fromEntries(Object.entries(require('./objcomp').LIB).filter(([k]) => !(k in all)))); }   // named keys may come from the whole library
  const only = process.argv[4] && process.argv[4] !== '-' ? process.argv[4].split(',') : null;
  const keys = Object.keys(all).filter(k => !only || only.includes(k));
  const sc = +(process.argv[5] || 0.4), cw = Math.round(800 * sc), ch = Math.round(800 * sc), cols = +(process.argv[6] || 8), rows = Math.ceil(keys.length / cols);
  let defs = '', body = '';
  keys.forEach((k, i) => {
    const f = K.objFig(3000 + i); all[k](f, { course, holy: true });
    const s = K.figSVG(f), x = (i % cols) * cw + cw / 2, y = Math.floor(i / cols) * ch + ch / 2 - 6;
    defs += s.defs; body += `<rect x="${(i % cols) * cw + 2}" y="${Math.floor(i / cols) * ch + 2}" width="${cw - 4}" height="${ch - 4}" fill="#4a4440"/>` + K.place(s.body, [0, 0], [x, y], sc) + `<text x="${(i % cols) * cw + 6}" y="${Math.floor(i / cols) * ch + ch - 6}" font-size="13" fill="#ff0" font-family="sans-serif">${k}</text>`;
  });
  const W = cols * cw, H = rows * ch;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${defs}</defs><rect width="${W}" height="${H}" fill="#2a2420"/>${body}</svg>`;
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: W, height: H } });
  await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await pg.screenshot({ path: out }); await b.close();
  console.log(keys.length, 'objects');
})();
