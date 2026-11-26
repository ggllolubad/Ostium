// Object library check: node cards/objsheet.js <out.png> [course] [key,key,...]. Every object on a grey tile, named.
'use strict';
const { chromium } = require('playwright');
const K = require('./card_kit');
const OB = require('./objects');
const { O } = require('./objects2');
const O3 = require('./objects3').O;
const O4 = require('./objects4').O;
(async () => {
  const out = process.argv[2], course = process.argv[3] || 'physical';
  const all = Object.assign({ flask: OB.flask, hourglass: OB.hourglass, mirror: OB.mirror, bell: OB.bell, shield: (f, o) => OB.shield(f, Object.assign({ s: 1.7 }, o)) }, O, O3, O4);
  const only = process.argv[4] ? process.argv[4].split(',') : null;
  const keys = Object.keys(all).filter(k => !only || only.includes(k));
  const sc = +(process.argv[5] || 0.5), cw = Math.round(600 * sc), ch = Math.round(600 * sc), cols = +(process.argv[6] || 7), rows = Math.ceil(keys.length / cols);
  let defs = '', body = '';
  keys.forEach((k, i) => {
    const f = K.objFig(3000 + i); all[k](f, { course });
    const s = K.figSVG(f), x = (i % cols) * cw + cw / 2, y = Math.floor(i / cols) * ch + ch / 2 - 10;
    defs += s.defs; body += `<rect x="${(i % cols) * cw + 2}" y="${Math.floor(i / cols) * ch + 2}" width="${cw - 4}" height="${ch - 4}" fill="#5a5048"/>` + K.place(s.body, [0, 0], [x, y], sc) + `<text x="${(i % cols) * cw + 8}" y="${Math.floor(i / cols) * ch + ch - 10}" font-size="16" fill="#ff0" font-family="sans-serif">${k}</text>`;
  });
  const W = cols * cw, H = rows * ch;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${defs}</defs><rect width="${W}" height="${H}" fill="#2a2420"/>${body}</svg>`;
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: W, height: H } });
  await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await pg.screenshot({ path: out }); await b.close();
  console.log(keys.length, 'objects');
})();
