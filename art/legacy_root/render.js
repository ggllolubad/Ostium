// Usage: node render.js <in.svg> <out.png> [scale]
// Renders an SVG file to a transparent PNG at the SVG's own width/height times scale.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  const pairs = [];
  let scale = 2;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scale') { scale = parseFloat(args[++i]); continue; }
    pairs.push(args[i]);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: scale });
  for (let i = 0; i < pairs.length; i += 2) {
    const src = pairs[i], out = pairs[i + 1];
    const svg = fs.readFileSync(src, 'utf8');
    const m = svg.match(/<svg[^>]*\bwidth="([\d.]+)"[^>]*\bheight="([\d.]+)"/);
    const w = m ? parseFloat(m[1]) : 400, h = m ? parseFloat(m[2]) : 400;
    await page.setViewportSize({ width: Math.ceil(w), height: Math.ceil(h) });
    await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block}</style></head><body>${svg}</body></html>`);
    await page.waitForTimeout(50);
    await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
    console.log('rendered', path.basename(out), w + 'x' + h, '@' + scale);
  }
  await browser.close();
})();
