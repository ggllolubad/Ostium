// Usage (from /home/claude/party): node worlds/fx_export.js worlds/world_V anvil_titan
// Writes the figure's captured FX layer (see kit_fx.js) as out/worlds/<module>_<key>_fx.svg and _fx.png on the same
// canvas, origin and flip as render.js uses for the figure, so the game can lay it over the figure (or over the bone
// named in fx.json) and animate it per frame. Also writes _fx_check.png (figure + FX) for review.
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
async function main() {
  const [mod, key] = process.argv.slice(2);
  const D = require(path.resolve(mod));
  const h = D.heroes.find(q => q.key === key);
  const W = h.w || 600, H = h.h || 820;
  const f = h.build();
  if (!f.fxOut || !f.fxOut.length) { console.log(`${key}: no FX captured`); return; }
  const defs = f.sharedDefs() + f.defs.join('\n');
  const wrap = b => h.flip ? `<g transform="translate(${W},0) scale(-1,1)">${b}</g>` : b;
  const fxBody = `<g filter="url(#wob${f.o.seed})">${f.fxOut.join('\n')}</g>`;
  const svgOf = b => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${wrap(b)}</svg>`;
  const base = `out/${mod}_${key}`;
  const fxSvg = svgOf(fxBody);
  fs.writeFileSync(`${base}_fx.svg`, fxSvg);
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.setViewportSize({ width: W, height: H });
  await page.setContent(`<html><body style="margin:0;background:transparent">${fxSvg}</body></html>`);
  await page.screenshot({ path: `${base}_fx.png`, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
  const s = f.svg();
  await page.setContent(`<html><body style="margin:0;background:#3a3632">${svgOf(s.body + fxBody)}</body></html>`);
  await page.screenshot({ path: `${base}_fx_check.png`, clip: { x: 0, y: 0, width: W, height: H } });
  await browser.close();
  const fxJson = { key, module: mod, canvas: [W, H], flip: !!h.flip, anchorBone: f.joints.arcs ? 'arcs' : (f.joints.arc ? 'arc' : null), note: 'lightning arcs exported from the figure (consistency pass 2026-11-25); same canvas and origin as the figure render; additive or normal blend over the figure' };
  fs.writeFileSync(`${base}_fx.json`, JSON.stringify(fxJson, null, 1));
  console.log(`${key}: FX layer ${f.fxOut.length} elements -> ${base}_fx.svg/png`);
}
main().catch(e => { console.error(e); process.exit(1); });
