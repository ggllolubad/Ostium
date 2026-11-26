// Render card art: node cards/render.js [ids...]   (no ids = the eight samples; -t to emblem2/_test, -r to emblem2/review, -r4 to review4;
// checks.js runs first and stops the run on any failure, -force renders anyway)
// Each card is drawn at 1120 x 612, rendered with Chromium one at a time, then downscaled to 560 x 306 with Lanczos
// (PIL) to build/emblem2/<id>.jpg, plus contact.jpg of everything rendered in this run.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const S = require('./samples');
if (process.argv.includes('-all')) require('./check_poses').run(S);   // L5 pose shares, L6 block hits, frame (L4 runs in rig.js on load)
const BASE = '/home/claude/ostium/build/emblem2';
const OUT = process.argv.includes('-all') ? BASE + '/all' : process.argv.includes('-t') ? BASE + '/_test' : process.argv.includes('-r4') ? BASE + '/review4' : process.argv.includes('-r3') ? BASE + '/review3' : process.argv.includes('-r2') ? BASE + '/review2' : process.argv.includes('-r') ? BASE + '/review' : BASE;
const fname = id => id.replace(/^@/, 'test_').replace(/[\/!]/g, '_');

(async () => {
  const ids = process.argv.slice(2).filter(a => !a.startsWith('-'));
  const list = ids.length ? ids : S.SAMPLES;
  fs.mkdirSync(path.join(OUT, '_full'), { recursive: true });
  // the lessons checks run on the batch metadata before anything renders (checks.js); a failure stops the run
  S.allocate(list);
  const built = list.map(id => { const b = S.build(id); fs.writeFileSync(path.join(OUT, '_full', fname(id) + '.svg'), b.svg); return { id, meta: b.meta }; });   // SVGs go to disk now, so a full run holds only metadata
  const C = require('./checks'), res = C.runMeta(built.map(b => b.meta));
  let report = `checks for ${list.length} cards (${built.filter(b => b.meta.kind === 'object').length} object cards), ${new Date().toISOString()}\n` + C.report(res);
  fs.writeFileSync(path.join(OUT, 'checks.txt'), report + '\n');
  console.log(report);
  if (res.some(r => !r.ok) && !process.argv.includes('-force')) { console.error('\nCHECKS FAILED: nothing rendered. Fix the cards above (or pass -force to render anyway for a look).'); process.exit(1); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: S.W, height: S.H } });
  for (const { id, meta } of built) {
    const t0 = Date.now();
    const svg = fs.readFileSync(path.join(OUT, '_full', fname(id) + '.svg'), 'utf8');
    await pg.setContent(`<html><body style="margin:0;background:#000">${svg}</body></html>`);
    await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '.png'), clip: { x: 0, y: 0, width: S.W, height: S.H } });
    if (meta.kind === 'object') { // the object alone, for the flatness check (L3)
      await pg.evaluate(() => { document.body.style.background = 'transparent'; let n = document.getElementById('subj'); while (n && n.parentNode && n.tagName !== 'svg') { for (const sib of n.parentNode.children) if (sib !== n && sib.tagName !== 'defs') sib.style.display = 'none'; n = n.parentNode; } const h = document.getElementById('hand'); if (h) h.style.display = 'none'; });   // the object alone: the hand is the hero's own drawing
      await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '_mask.png'), clip: { x: 0, y: 0, width: S.W, height: S.H }, omitBackground: true });
    }
    console.log(id, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  await b.close();
  const listFile = path.join(OUT, '_full', '_list.txt');
  fs.writeFileSync(listFile, list.map(id => fname(id) + '\t' + id + '\t' + S.describe(id)).join('\n'));
  execFileSync('python3', [path.join(__dirname, 'downscale.py'), OUT, listFile, OUT === BASE ? 'samples' : 'sheet'], { stdio: 'inherit' });
  // pixel checks after rendering (L3 flatness, L14 hue clusters) and the unlabelled thumbs170.png
  let pix = '', pixOk = true;
  try { pix = execFileSync('python3', [path.join(__dirname, 'pixchecks.py'), OUT, listFile]).toString(); } catch (e) { pix = (e.stdout || '').toString(); pixOk = false; }
  report += '\n' + pix.trim();
  fs.writeFileSync(path.join(OUT, 'checks.txt'), report + '\n');
  console.log(pix.trim());
  if (!pixOk) { console.error('\nPIXEL CHECKS FAILED (see checks.txt)'); process.exit(1); }
})();
