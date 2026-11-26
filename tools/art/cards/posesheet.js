// Pose sheets: node cards/posesheet.js [calling,...|all] [outdir]
// For every calling, figure (base and path variants) and pose, the card as render.js draws it plus 2x crops of both
// hands, then per-pose sheets (one row per figure: card | near hand 2x | far hand 2x), a grid per calling and
// contact.jpg. Default outdir: /home/claude/ostium/build/emblem2/poses. Runs the rig.js and check_poses.js checks first.
'use strict';
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const S = require('./samples');
const { RIG, FIGURES } = require('./rig');
const K = require('./card_kit');
const C = require('./check_poses');
const which = process.argv[2] || 'all', OUT = process.argv[3] || '/home/claude/ostium/build/emblem2/poses';
const BASE = { bulwark: ['dirAC', 'bulwark'], duelist: ['dirAC', 'duelist'], elementalist: ['dirAC', 'elementalist_fire', 'signs'], alchemist: ['dirAC2', 'alchemist'], oracle: ['dirAC2', 'oracle'], hexweaver: ['dirAC2', 'hexweaver'], vessel: ['worlds/hero_vessel', 'vessel'] };
const figOf = (cls, key) => key === cls ? BASE[cls] : [/^(bulwark|duelist|elementalist)_/.test(key) ? 'worlds/hero_paths_A' : 'worlds/hero_paths_B', key];
(async () => {
  C.run(S);
  fs.mkdirSync(path.join(OUT, 'cells'), { recursive: true });
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: S.W, height: S.H } });
  const shot = async (svg, w, h, file) => { await pg.setViewportSize({ width: w, height: h }); await pg.setContent(`<html><body style="margin:0;background:#000">${svg}</body></html>`); await pg.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h } }); };
  const rows = [];
  for (const cls of which === 'all' ? Object.keys(FIGURES) : which.split(',')) for (const list of ['act', 'block']) {
    const L = RIG[cls][list];
    for (let i = 0; i < L.length; i++) for (const key of Object.keys(FIGURES[cls])) {
      const arch = key === cls ? '' : key.slice(cls.length + 1);
      S.CARDS._posesheet = { name: '', cls, arch, cat: 'physical', target: 'enemy', fx: list === 'block' ? [{ t: 'block', n: 5 }] : [{ t: 'dmg', n: 5 }] };
      const keep = RIG[cls][list]; RIG[cls][list] = [L[i]];
      let svg; try { svg = S.card('_posesheet'); } finally { RIG[cls][list] = keep; delete S.CARDS._posesheet; }
      const base = path.join(OUT, 'cells', `${cls}_${list}${i}_${key}`);
      await shot(svg, S.W, S.H, base + '_card.png');
      const [mod, k, l] = figOf(cls, key), h = K.hero(mod, k, L[i].pose, l || 'heroes', { hide: L[i].hide });
      for (const s of ['n', 'f']) {
        const c = h.joint('hand_' + s), m = 90, vb = [c[0] - m, c[1] - m, 2 * m, 2 * m];
        await shot(`<svg xmlns="http://www.w3.org/2000/svg" width="${4 * m}" height="${4 * m}" viewBox="${vb.join(' ')}"><defs>${h.defs}</defs><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="#6a6058"/>${h.body}</svg>`, 4 * m, 4 * m, base + '_hand' + s + '.png');
      }
      rows.push([cls, `${list}${i}`, key, base].join('\t'));
      console.log(cls, list + i, key);
    }
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'cells', '_rows.txt'), rows.join('\n'));
  execFileSync('python3', [path.join(__dirname, 'posesheet.py'), OUT], { stdio: 'inherit' });
})();
