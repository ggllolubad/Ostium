// Render SVG files to PNG with the same browser renderer as the figures (Playwright Chromium), one at a time.
// Usage: node scenes/render.js <in.svg> <out.png> [scale] [<in2.svg> <out2.png> [scale2]] ...
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const a = process.argv.slice(2), jobs = [];
  for (let i = 0; i < a.length;) { const j = { src: a[i], out: a[i + 1], s: 1 }; i += 2; if (a[i] && /^[\d.]+$/.test(a[i])) j.s = +a[i++]; jobs.push(j); }
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const j of jobs) {
    const svg = fs.readFileSync(j.src, 'utf8'), m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/), W = Math.round(+m[1] * j.s), H = Math.round(+m[2] * j.s);
    const sized = svg.replace(/^<svg([^>]*?)width="[^"]*" height="[^"]*"/, `<svg$1width="${W}" height="${H}"`);
    await page.setViewportSize({ width: W, height: H });
    await page.setContent(`<html><body style="margin:0;background:transparent">${sized}</body></html>`);
    await page.screenshot({ path: j.out, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H }, timeout: 300000 });
    console.log('rendered', j.out, W + 'x' + H);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
