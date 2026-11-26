// L57: review art must be production art. A card's SVG may not depend on the batch it is rendered in.
// Usage: node cards/check_determinism.js <out dir> [id ...]
// For each id (default: up to 10 spread across the batch's _list.txt), build the card alone in a fresh node process and
// compare it byte for byte with the SVG the batch render wrote to <out dir>/_full/. Prints one PASS or FAIL line and
// exits 1 on any difference. render.js runs it on every review batch.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const out = process.argv[2];
let ids = process.argv.slice(3);
const fname = id => id.replace(/^@/, 'test_').replace(/[\/!~]/g, '_');   // ~: attuned course variants (hero-card agent), as render.js
if (!ids.length) {
  const rows = fs.readFileSync(path.join(out, '_full', '_list.txt'), 'utf8').split('\n').filter(Boolean).map(l => l.split('\t')[1]);
  const step = Math.max(1, Math.floor(rows.length / 10));
  ids = rows.filter((_, i) => i % step === 0).slice(0, 10);
}
const sha = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const bad = [];
for (const id of ids) {
  const alone = execFileSync('node', ['-e', `const S = require(${JSON.stringify(path.join(__dirname, 'samples'))}); process.stdout.write(S.build(process.argv[1]).svg);`, id], { maxBuffer: 1 << 28 }).toString();
  const inBatch = fs.readFileSync(path.join(out, '_full', fname(id) + '.svg'), 'utf8');
  if (alone !== inBatch) bad.push(`${id} (alone ${sha(alone)}, in batch ${sha(inBatch)})`);
}
if (bad.length) { console.log(`FAIL  L57  rendered alone, ${bad.length} of ${ids.length} cards differ from the batch: ` + bad.join(', ')); process.exit(1); }
console.log(`PASS  L57  ${ids.length} cards rendered alone in fresh processes match their batch SVGs byte for byte (${ids.join(' ')})`);
