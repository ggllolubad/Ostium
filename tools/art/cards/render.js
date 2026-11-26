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
const RV = (process.argv.find(a => a.startsWith('-rv=')) || '').slice(4);   // -rv=<name>: the variety pass's review batches, to emblem2/variety/<name> (with -all too)
// hero staging (hero-card agent): -h renders to emblem2/_heroes; -heroes[=bulwark,duelist] takes the staged hero cards of those callings (all if none);
// -dry runs the checks and stops before rendering (with -all: the full-deck dry run)
const HEROES = (process.argv.find(a => a === '-heroes' || a.startsWith('-heroes=')) || '');
const HSUB = (process.argv.find(a => a.startsWith('-h=')) || '').slice(3);   // -h=<name>: emblem2/_heroes/<name> (calibration batches)
const OUT = HSUB ? BASE + '/_heroes/' + HSUB : process.argv.includes('-h') ? BASE + '/_heroes' : RV ? BASE + '/variety/' + RV : process.argv.includes('-all') ? BASE + '/all' : process.argv.includes('-t') ? BASE + '/_test' : process.argv.includes('-r7') ? BASE + '/review7' : process.argv.includes('-r6') ? BASE + '/review6' : process.argv.includes('-r5') ? BASE + '/review5' : process.argv.includes('-r4') ? BASE + '/review4' : process.argv.includes('-r3') ? BASE + '/review3' : process.argv.includes('-r2') ? BASE + '/review2' : process.argv.includes('-r') ? BASE + '/review' : BASE;
const fname = id => id.replace(/^@/, 'test_').replace(/[\/!~]/g, '_');   // <id>~<course> is written as <id>_<course> (attuned variants)

(async () => {
  const ids = process.argv.slice(2).filter(a => !a.startsWith('-'));
  const want = HEROES.includes('=') ? HEROES.split('=')[1].split(',') : null;
  const list = ids.length ? ids : process.argv.includes('-all') ? Object.keys(S.CARDS) : HEROES ? Object.keys(require('./hero_routes').HERO).filter(id => S.CARDS[id] && (!want || want.includes(S.CARDS[id].cls))).sort() : S.SAMPLES;
  fs.mkdirSync(path.join(OUT, '_full'), { recursive: true });
  // the lessons checks run on the batch metadata before anything renders (checks.js); a failure stops the run
  S.allocate(list);
  const built = list.map(id => { const b = S.build(id); fs.writeFileSync(path.join(OUT, '_full', fname(id) + '.svg'), b.svg); return { id, meta: b.meta }; });   // SVGs go to disk now, so a full run holds only metadata
  const C = require('./checks'), res = C.runMeta(built.map(b => b.meta));
  let report = `checks for ${list.length} cards (${built.filter(b => b.meta.kind === 'object').length} object cards), ${new Date().toISOString()}\n` + C.report(res);
  fs.writeFileSync(path.join(OUT, 'checks.txt'), report + '\n');
  console.log(report);
  if (res.some(r => !r.ok) && !process.argv.includes('-force')) { console.error('\nCHECKS FAILED: nothing rendered. Fix the cards above (or pass -force to render anyway for a look).'); process.exit(1); }
  if (process.argv.includes('-dry')) { console.log(`\nDRY RUN: ${list.length} cards built and checked, nothing rendered`); return; }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: S.W, height: S.H } });
  for (const { id, meta } of built) {
    const t0 = Date.now();
    const svg = fs.readFileSync(path.join(OUT, '_full', fname(id) + '.svg'), 'utf8');
    await pg.setContent(`<html><body style="margin:0;background:#000">${svg}</body></html>`);
    await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '.png'), clip: { x: 0, y: 0, width: S.W, height: S.H } });
    if (meta.kind === 'object') { // the object alone, for the flatness check (L3)
      await pg.evaluate(() => { document.body.style.background = 'transparent'; let n = document.getElementById('subj'); n.removeAttribute('filter'); while (n && n.parentNode && n.tagName !== 'svg') { for (const sib of n.parentNode.children) if (sib !== n && sib.tagName !== 'defs') sib.style.display = 'none'; n = n.parentNode; } });
      await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '_subj.png'), clip: { x: 0, y: 0, width: S.W, height: S.H }, omitBackground: true });   // the subject, hand and all (L45)
      if (!meta.hand) { try { fs.unlinkSync(path.join(OUT, '_full', fname(id) + '_hand.png')); } catch (e) {} }   // a stale hand mask from an earlier held render would fail L53 on a card that no longer has a hand
      if (meta.hand) { // the hand alone, to weigh it against the object it holds (L53)
        await pg.evaluate(() => { for (const c of document.getElementById('subj').children) if (c.id !== 'hand') c.style.visibility = 'hidden'; });
        await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '_hand.png'), clip: { x: 0, y: 0, width: S.W, height: S.H }, omitBackground: true });
        await pg.evaluate(() => { for (const c of document.getElementById('subj').children) c.style.visibility = ''; });
      }
      await pg.evaluate(() => { const h = document.getElementById('hand'); if (h) h.style.display = 'none'; });   // the object alone: the hand is the hero's own drawing (L3, L46, L47)
      await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '_mask.png'), clip: { x: 0, y: 0, width: S.W, height: S.H }, omitBackground: true });
    }
    if (meta.course || meta.elem) { // an attuned variant's (or any element card's) FX layer alone (the .cfx groups), for the greyscale element check (attuned_check.py, L61)
      await pg.evaluate(() => { document.body.style.background = 'transparent'; for (const c of document.querySelector('svg').children) if (c.tagName !== 'defs') c.style.display = c.classList && c.classList.contains('cfx') ? '' : 'none'; });   // object cards hid their siblings of #subj above, the cfx layers too: show them again
      await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '_fx.png'), clip: { x: 0, y: 0, width: S.W, height: S.H }, omitBackground: true });
      await pg.evaluate(() => { const st = document.createElement('style'); st.id = 'impOnly'; st.textContent = '.cfx *{visibility:hidden} .cimp, .cimp *{visibility:visible}'; document.head.appendChild(st); });
      await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '_imp.png'), clip: { x: 0, y: 0, width: S.W, height: S.H }, omitBackground: true });   // the element impact alone (L61 symmetry)
      await pg.evaluate(() => { document.getElementById('impOnly').remove(); for (const c of document.querySelector('svg').children) c.style.display = ''; });
    }
    if (meta.kind === 'hero' && meta.cue) { // the name cue alone (L67, cue_check.py): its solid pixels, beside the card and the hero mask
      await pg.evaluate(() => { document.body.style.background = 'transparent'; for (const c of document.querySelector('svg').children) if (c.tagName !== 'defs') c.style.display = c.classList && c.classList.contains('cue') ? '' : 'none'; });
      await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '_cue.png'), clip: { x: 0, y: 0, width: S.W, height: S.H }, omitBackground: true });
      await pg.evaluate(() => { for (const c of document.querySelector('svg').children) c.style.display = ''; });
    }
    if (meta.kind === 'hero' && meta.frame) { // the hero figure alone, for the silhouette check (herosim.py)
      await pg.evaluate(() => { document.body.style.background = 'transparent'; let n = document.getElementById('hero'); n.removeAttribute('filter'); while (n && n.parentNode && n.tagName !== 'svg') { for (const sib of n.parentNode.children) if (sib !== n && sib.tagName !== 'defs') sib.style.display = 'none'; n = n.parentNode; } });
      await pg.screenshot({ path: path.join(OUT, '_full', fname(id) + '_hero.png'), clip: { x: 0, y: 0, width: S.W, height: S.H }, omitBackground: true });
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
  try { pix += execFileSync('python3', [path.join(__dirname, 'lookalike.py'), OUT, listFile]).toString(); } catch (e) { pix += (e.stdout || '').toString(); pixOk = false; }   // L70: visual look-alikes within a calling (the variety pass)
  report += '\n' + pix.trim();
  // hero cards of a calling must each be their own picture: silhouette and band-pass picture distance (herosim.py)
  if (built.some(x => x.meta.kind === 'hero' && x.meta.frame)) { let hs = ''; try { hs = execFileSync('python3', [path.join(__dirname, 'herosim.py'), OUT, listFile, '--report', path.join(OUT, 'herosim.tsv')]).toString(); } catch (e) { hs = (e.stdout || '').toString(); pixOk = false; } report += '\n' + hs.trim(); pix += '\n' + hs.trim(); }
  // every hero card's name cue reads at game size (cue_check.py, L67)
  if (built.some(x => x.meta.kind === 'hero' && x.meta.cue)) { let cc = ''; try { cc = execFileSync('python3', [path.join(__dirname, 'cue_check.py'), OUT, listFile]).toString(); } catch (e) { cc = (e.stdout || '').toString(); pixOk = false; } report += '\n' + cc.trim(); pix += '\n' + cc.trim(); }
  // attuned variants and element FX (attuned_check.py: L60 colour, L61 greyscale shape and size)
  if (built.some(x => x.meta.course || x.meta.elem)) { let ac = ''; try { ac = execFileSync('python3', [path.join(__dirname, 'attuned_check.py'), OUT, listFile]).toString(); } catch (e) { ac = (e.stdout || '').toString(); pixOk = false; } report += '\n' + ac.trim(); pix += '\n' + ac.trim(); }
  fs.writeFileSync(path.join(OUT, 'checks.txt'), report + '\n');
  // L57: a sample of the batch rebuilt alone in fresh processes must match the batch SVGs byte for byte (not on -all)
  if (!process.argv.includes('-all')) { let det = ''; try { det = execFileSync('node', [path.join(__dirname, 'check_determinism.js'), OUT]).toString(); } catch (e) { det = (e.stdout || '').toString(); pixOk = false; } report += '\n' + det.trim(); pix += det; }
  fs.writeFileSync(path.join(OUT, 'checks.txt'), report + '\n');
  console.log(pix.trim());
  if (!pixOk) { console.error('\nPIXEL CHECKS FAILED (see checks.txt)'); process.exit(1); }
})();
