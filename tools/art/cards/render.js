// Render card art: node cards/render.js [ids...]   (no ids = the eight samples)
// Each card is drawn at 1120 x 612, rendered with Chromium one at a time, then downscaled to 560 x 306 with Lanczos
// (PIL) to build/emblem2/<id>.jpg, plus contact.jpg of everything rendered in this run.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const S = require('./samples');
const OUT = process.argv.includes('-t') ? '/home/claude/ostium/build/emblem2/_test' : '/home/claude/ostium/build/emblem2';

(async () => {
  const ids = process.argv.slice(2).filter(a => !a.startsWith('-'));
  const list = ids.length ? ids : S.SAMPLES;
  fs.mkdirSync(path.join(OUT, '_full'), { recursive: true });
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: S.W, height: S.H } });
  for (const id of list) {
    const t0 = Date.now();
    const svg = S.card(id);
    fs.writeFileSync(path.join(OUT, '_full', id + '.svg'), svg);
    await pg.setContent(`<html><body style="margin:0;background:#000">${svg}</body></html>`);
    await pg.screenshot({ path: path.join(OUT, '_full', id + '.png'), clip: { x: 0, y: 0, width: S.W, height: S.H } });
    console.log(id, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  await b.close();
  execFileSync('python3', [path.join(__dirname, 'downscale.py'), OUT, ...(ids.length ? list : S.SAMPLES)], { stdio: 'inherit' });
})();
