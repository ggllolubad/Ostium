// Pose check: node cards/posepeek.js <module> <key> '<pose json>' <out.png> [list]
// Renders the posed hero on mid grey with every joint marked and named, so a card pose can be tuned by eye.
'use strict';
const { chromium } = require('playwright');
const K = require('./card_kit');
(async () => {
  const [mod, key, pj, out, list = 'heroes'] = process.argv.slice(2);
  const h = K.hero(mod, key, JSON.parse(pj || '{}'), list);
  const pad = 250, Wd = h.W + pad * 2, Hd = h.H + pad * 2;
  let marks = '';
  for (const n of Object.keys(h.J)) { const p = h.joint(n); marks += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#f0f"/><text x="${p[0] + 6}" y="${p[1] - 4}" font-size="12" fill="#ff0" font-family="sans-serif">${n}</text>`; }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="${Hd}" viewBox="${-pad} ${-pad} ${Wd} ${Hd}"><defs>${h.defs}</defs><rect x="${-pad}" y="${-pad}" width="${Wd}" height="${Hd}" fill="#5a5048"/>${h.body}${marks}</svg>`;
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: Wd, height: Hd } });
  await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await pg.screenshot({ path: out });
  await b.close();
})();
