// Door-world bestiary art. Each entry: [key, tier, archetype, spec]. Gameplay data lives in tools/content/worlds.py.
// Usage: node grim/worlds.js [world|key ...]
const { Art, G } = require('../gr');
const K = require('./kit'), K2 = require('./kit2');
const { dressing, humanoid, CANVAS } = K;
const ARCH = { humanoid, beast: K2.beast, serpent: K2.serpent, crawler: K2.crawler, floater: K2.floater, golem: K2.golem, bird: K2.bird, moth: K2.moth, swarm: K2.swarm };
const W = require('./worlds_def');

function build(world, key, tier, arch, spec) {
  let seed = 0; for (const c of key) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const a = new Art(460, 700, seed % 100000 + 7);
  const D = dressing(a);
  const s = Object.assign({ pal: Object.assign({}, world.pal, spec.pal || {}), els: spec.els || world.els }, spec);
  s.pal = Object.assign({}, world.pal, spec.pal || {});
  const anim = ARCH[arch](a, D, s);
  const [cw, ch] = CANVAS[tier];
  if (tier !== 'foe') a.scaleTo(cw, ch, 460, 700);
  a.writeRig('grim/rig/' + key, { idle: anim.idle, attack: anim.attack, hand: anim.hand });
  return key;
}
const only = process.argv.slice(2);
const done = [];
for (const [wk, world] of Object.entries(W)) {
  for (const [key, tier, arch, spec] of world.cast) {
    if (only.length && !only.includes(wk) && !only.includes(key)) continue;
    done.push(build(world, key, tier, arch, spec));
  }
}
console.log(done.join(' '));
