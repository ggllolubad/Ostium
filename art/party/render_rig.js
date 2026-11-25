// Usage: node render_rig.js <module> <key> [list]   (list = exported array name, default heroes)
// Writes out/rig/<module>_<key>/ : one PNG per draw-order layer (each bound to a bone) + rig.json, and check.png
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
async function main() {
  const [mod, key, list = 'heroes'] = process.argv.slice(2);
  const D = require('./' + mod);
  const h = D[list].find(q => q.key === key);
  const f = h.build(), W = h.w || 600, H = h.h || 820;
  const dir = `out/rig/${mod}_${key}`; fs.mkdirSync(dir, { recursive: true });
  for (const x of fs.readdirSync(dir)) fs.unlinkSync(`${dir}/${x}`);
  const defs = f.sharedDefs() + f.defs.join('\n');
  const wrap = b => h.flip ? `<g transform="translate(${W},0) scale(-1,1)">${b}</g>` : b;
  const svgOf = b => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${defs}</defs>${wrap(b)}</svg>`;
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.setViewportSize({ width: W, height: H });
  const runs = f.runs(), layers = [];
  for (let z = 0; z < runs.length; z++) {
    const name = `${String(z).padStart(2, '0')}_${runs[z].bone}`;
    await page.setContent(`<html><body style="margin:0;background:transparent">${svgOf(runs[z].body)}</body></html>`);
    await page.screenshot({ path: `${dir}/${name}.png`, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
    layers.push({ name, bone: runs[z].bone, z });
  }
  await page.setContent(`<html><body style="margin:0;background:transparent">${svgOf(runs.map(r => r.body).join(''))}</body></html>`);
  await page.screenshot({ path: `${dir}/check.png`, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
  await browser.close();
  const mirror = p => h.flip ? [W - p[0], p[1]] : p;
  const bones = Object.fromEntries(Object.entries(f.joints).map(([k, v]) => [k, { pivot: mirror(v.pivot), parent: v.parent }]));
  const missing = [...new Set(layers.map(l => l.bone))].filter(b => b !== 'root' && !bones[b]);
  fs.writeFileSync(`${dir}/rig.json`, JSON.stringify({ key, module: mod, canvas: [W, H], ground: f.o.groundY, flip: !!h.flip, bones, layers }, null, 1));
  console.log(`${key}: ${layers.length} layers, ${Object.keys(bones).length} bones${missing.length ? ', MISSING JOINTS: ' + missing.join(',') : ''}`);
}
main().catch(e => { console.error(e); process.exit(1); });
