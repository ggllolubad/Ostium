// Usage: node render.js dirA [hero]  -> out/dirA_<hero>.png, out/dirA_lineup.png, out/dirA_sil.png
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function main() {
  const dir = process.argv[2], only = process.argv[3];
  delete require.cache[require.resolve('./' + dir)];
  const D = require('./' + dir);
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  let W = 600, H = 820;
  const figs = [];
  for (const h of D.heroes) {
    if (only && h.key !== only) continue;
    W = h.w || 600; H = h.h || 820;
    const fig = h.build();
    const s = fig.svg();
    figs.push({ key: h.key, s });
    const bodyT = h.flip ? `<g transform="translate(${W},0) scale(-1,1)">${s.body}</g>` : s.body;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${s.defs}</defs>${bodyT}</svg>`;
    fs.writeFileSync(`out/${dir}_${h.key}.svg`, svg);
    await page.setViewportSize({ width: W, height: H });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await page.screenshot({ path: `out/${dir}_${h.key}.png`, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
    // silhouette at in-game height (~180 px tall) on a light tile
    const sil = svg.replace('<svg ', '<svg style="filter:brightness(0)" ');
    await page.setContent(`<html><body style="margin:0;background:#d8d2c4">${sil}</body></html>`);
    await page.screenshot({ path: `out/${dir}_${h.key}_sil.png`, clip: { x: 0, y: 0, width: W, height: H } });
  }
  if (!only) {
    // lineup on the direction's scene, heroes overlap slightly like a marching order
    const LW = 1500, LH = 860;
    const bg = D.scene ? D.scene(LW, LH) : `<rect width="${LW}" height="${LH}" fill="#1a1714"/>`;
    const xs = D.lineupX || [80, 470, 860];
    const order = ['elementalist', 'duelist', 'bulwark'];
    let body = '';
    let defs = '';
    for (const k of order) {
      const f = figs.find(q => q.key === k); if (!f) continue;
      const i = order.indexOf(k);
      defs += f.s.defs;
      body += `<ellipse cx="${xs[i] + 300}" cy="${790 + 22}" rx="190" ry="22" fill="#000" opacity="0.55" filter="url(#gblur)"/>`;
      body += `<g transform="translate(${xs[i]},22)">${f.s.body}</g>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LW}" height="${LH}"><defs><filter id="gblur"><feGaussianBlur stdDeviation="10"/></filter>${defs}</defs>${bg}${body}${D.sceneFront ? D.sceneFront(LW, LH) : ''}</svg>`;
    await page.setViewportSize({ width: LW, height: LH });
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await page.screenshot({ path: `out/${dir}_lineup.png`, clip: { x: 0, y: 0, width: LW, height: LH } });
  }
  await browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
