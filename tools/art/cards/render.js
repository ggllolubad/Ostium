// Render card art: node cards/render.js [ids...]   (no ids = the eight samples; -t to emblem2/_test, -r to emblem2/review)
// Each card is drawn at 1120 x 612, rendered with Chromium one at a time, then downscaled to 560 x 306 with Lanczos
// (PIL) to build/emblem2/<id>.jpg, plus contact.jpg of everything rendered in this run.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const S = require('./samples');
const BASE = '/home/claude/ostium/build/emblem2';
const OUT = process.argv.includes('-all') ? BASE + '/all' : process.argv.includes('-t') ? BASE + '/_test' : process.argv.includes('-r3') ? BASE + '/review3' : process.argv.includes('-r2') ? BASE + '/review2' : process.argv.includes('-r') ? BASE + '/review' : BASE;
const fname = id => id.replace(/^@/, 'test_').replace(/[\/!]/g, '_');

(async () => {
  const ids = process.argv.slice(2).filter(a => !a.startsWith('-'));
  const list = ids.length ? ids : S.SAMPLES;
  fs.mkdirSync(path.join(OUT, '_full'), { recursive: true });
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: S.W, height: S.H } });
  for (const id of list) {
    const t0 = Date.now();
    const svg = S.card(id);
    fs.writeFileSync(path.join(OUT, '_full', fname(id) + '.svg'), svg);
    await pg.setContent(`<html><body style="margin:0;background:#000">${svg}</body></html>`);
    await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '.png'), clip: { x: 0, y: 0, width: S.W, height: S.H } });
    console.log(id, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  await b.close();
  const listFile = path.join(OUT, '_full', '_list.txt');
  fs.writeFileSync(listFile, list.map(id => fname(id) + '\t' + id + '\t' + S.describe(id)).join('\n'));
  execFileSync('python3', [path.join(__dirname, 'downscale.py'), OUT, listFile, OUT === BASE ? 'samples' : 'sheet'], { stdio: 'inherit' });
})();
