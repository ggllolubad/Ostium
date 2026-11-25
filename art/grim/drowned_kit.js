// The Drowned Kingdom roster rebuilt on the anatomy kit (keys and canvases unchanged). bell_below and lamprey keep their bespoke drawings.
// Usage: node grim/drowned_kit.js [key ...]
const { Art, G } = require('../gr');
const K = require('./kit'), K2 = require('./kit2');
const ARCH = { humanoid: K.humanoid, beast: K2.beast, serpent: K2.serpent, crawler: K2.crawler, floater: K2.floater, golem: K2.golem, swarm: K2.swarm };
const PAL = { skin: '#8a9a8e', cloth: '#3a403a', metal: '#5a625a', accent: '#a8d0c8', wood: '#4a3e30', horn: '#c8c0a8', tail: '#4f6a62' };
const EL = ['water', 'void'];
const bar = (a, D, cx, w) => a.raw(D.barnacles(cx - 10, 300, 10, 30) + D.barnacles(cx + 20, 420, 8, 24) + D.weed(cx - 30, 230, 90) + D.weed(cx + 30, 240, 70));
const C = {
  thrall: ['humanoid', { build: 'gaunt', dress: 'rags', weapon: 'hook', headSpec: { style: 'drowned', eye: 'milky', jaw: 0.5, hair: 'weed' }, body_extra: bar, els: ['water'] }],
  siren: ['humanoid', { build: 'gaunt', dress: 'bare', tail: true, weapon: 'claws', armPose: 'reach', headSpec: { style: 'drowned', eye: 'glint', jaw: 0.9, hair: '#1a1a18', hairLen: 150 }, pal: { skin: '#a3ad9e' }, body_extra: (a, D, cx) => a.raw(D.barnacles(cx + 30, 240, 6, 12)), idle: 'sway', attack: 'claw' }],
  eelkin: ['serpent', { kind: 'eel', fins: true, pal: { skin: '#46523f', belly: '#a8a888' }, els: ['water', 'void'] }],
  bellringer: ['humanoid', { build: 'gaunt', dress: 'robe', gear: 'hood', weapon: 'bell', headSpec: { style: 'skull', jaw: 0.5 }, pal: { cloth: '#38322e' }, chains: true, attack: 'ring' }],
  barnacle_knight: ['humanoid', { build: 'heavy', dress: 'armor', weapon: 'greatsword', gear: 'helm', pal: { metal: '#5a5e56' }, body_extra: bar, attack: 'cleave', head_extra: (a, D, hx) => a.raw(D.barnacles(hx, 110, 8, 20)) }],
  bloated: ['humanoid', { build: 'giant', dress: 'bare', weapon: 'none', armPose: 'low', headSpec: { style: 'bloated', eye: 'milky', jaw: 0.3 }, pal: { skin: '#94a08a' }, idle: 'wobble', attack: 'slam',
    body_extra: (a, D, cx, w) => { const { smooth } = require('../gr'); a.shape({ d: smooth([[cx - 70 * w, 280], [cx - 10, 250], [cx + 60 * w, 290], [cx + 70 * w, 400], [cx + 20, 470], [cx - 60 * w, 460], [cx - 90 * w, 380]], true, 0.6), fill: '#9aa48c', depth: 30, mottle: 0.6, fine: true, hatch: 100, decals: a.stain(cx, 380, 40, G.bruise, 0.6) + a.stain(cx + 30, 300, 26, '#6a7a60', 0.6) + a.gash(cx - 10, 330, cx + 4, 430, 8, { rim: '#a86a5a', dripLen: 30 }) + D.pustules(cx - 30, 380, 30, 8) + `<g stroke="#4a5a58" stroke-width="1.2" fill="none" opacity="0.7"><path d="M${cx - 50} 300 q20 30 4 60 q-10 30 10 60"/><path d="M${cx + 40} 300 q-14 40 6 70"/></g>` }); } }],
  hookline: ['humanoid', { build: 'gaunt', dress: 'rags', weapon: 'harpoon', gear: 'hood', headSpec: { style: 'drowned', eye: 'milky', jaw: 0.2 }, pal: { cloth: '#4a5232' }, chains: true, attack: 'reel' }],
  weeping_nun: ['humanoid', { build: 'gaunt', dress: 'robe', gear: 'hood', weapon: 'book', headSpec: { style: 'drowned', eye: 'none', jaw: 0 }, pal: { cloth: '#1e1c1a', skin: '#b8bcb0' }, hoodFill: '#e8e0cc', attack: 'raise', head_extra: (a, D, hx, hy) => a.raw(a.drip(hx - 24, hy, 40, 2.2) + a.drip(hx - 18, hy + 2, 30, 1.8)) }],
  anchor_brute: ['humanoid', { build: 'giant', dress: 'bare', weapon: 'chain', armPose: 'low', headSpec: { style: 'brute', eye: 'milky', jaw: 0.5 }, pal: { skin: '#8a988c' }, body_extra: bar, attack: 'swing' }],
  choirboy: ['humanoid', { build: 'gaunt', dress: 'robe', weapon: 'book', headK: 1.15, headSpec: { style: 'drowned', eye: 'socket', jaw: 1 }, pal: { cloth: '#8a2a24', skin: '#a8b0a4' }, attack: 'wail', body_extra: (a, D, cx) => { const { smooth } = require('../gr'); a.shape({ d: smooth([[cx - 50, 240], [cx + 40, 240], [cx + 60, 380], [cx - 70, 380]], true, 0.4), fill: '#d8d0bc', depth: 10, mottle: 0.4, hatch: 70, decals: a.stain(cx, 330, 20, G.algae, 0.5) + a.fold(cx - 20, 250, cx - 30, 376, 5) + a.fold(cx + 10, 250, cx + 16, 376, 5) }); } }],
  warden: ['humanoid', { build: 'heavy', dress: 'armor', weapon: 'trident', gear: 'helm', pal: { metal: '#4a5a58' }, body_extra: bar, head_extra: (a, D, hx) => a.raw(D.barnacles(hx + 6, 104, 10, 22)), attack: 'thrust' }],
  abbess: ['humanoid', { build: 'normal', dress: 'robe', gear: 'hood', weapon: 'staff', off: 'book', headSpec: { style: 'drowned', eye: 'milky', jaw: 0 }, pal: { cloth: '#14120f', accent: '#c8a653' }, hoodFill: '#e8e0cc', attack: 'raise', head_extra: (a, D, hx, hy) => a.raw(`<path d="M${hx - 40} ${hy + 24} L${hx - 8} ${hy + 28}" stroke="#1c130c" stroke-width="1.6"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${hx - 36 + i * 6} ${hy + 20} l0 10" stroke="#5a2a20" stroke-width="1.2"/>`).join('')) }],
  pearl_diver: ['humanoid', { build: 'gaunt', dress: 'bare', weapon: 'sword', armPose: 'reach', headSpec: { style: 'drowned', eye: 'glint', jaw: 0.6, hair: 'weed' }, pal: { skin: '#b8bcb0' }, lean: 26, idle: 'crouch', attack: 'stab' }],
  crab: ['crawler', { kind: 'crab', pal: { skin: '#7a4a38' }, head_extra: (a, D, hx, hy) => a.raw(D.barnacles(280, 440, 10, 40)) }],
  kraken_arm: ['serpent', { kind: 'tentacle', thick: 1.4, pal: { skin: '#5a4a62', belly: '#b8a0a8' }, idle: 'tentacle', attack: 'lash' }],
  drowned_king: ['humanoid', { build: 'giant', dress: 'robe', weapon: 'trident', gear: 'crown', pauldron: true, headSpec: { style: 'drowned', eye: 'glint', jaw: 0.5, beard: '#4a5a50' }, pal: { cloth: '#5a1e22', metal: '#7a6a3a', crown: '#a8873e' }, body_extra: bar, chains: true, attack: 'slam',
    head_extra: (a, D, hx) => a.raw([[-20, 1], [0, 1.3], [20, 1]].map(([dx, k]) => `<path d="M${hx + dx} 96 C${hx + dx - 6} ${96 - 20 * k} ${hx + dx + 8} ${96 - 34 * k} ${hx + dx} ${96 - 50 * k} M${hx + dx} ${96 - 26 * k} l-10 -8 M${hx + dx} ${96 - 38 * k} l10 -8" stroke="#1c130c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${hx + dx} 96 C${hx + dx - 6} ${96 - 20 * k} ${hx + dx + 8} ${96 - 34 * k} ${hx + dx} ${96 - 50 * k} M${hx + dx} ${96 - 26 * k} l-10 -8 M${hx + dx} ${96 - 38 * k} l10 -8" stroke="#a85a4a" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')) }],
  mother_of_brine: ['humanoid', { build: 'heavy', dress: 'bare', tail: '#3a5a56', weapon: 'claws', armPose: 'reach', gear: 'crown', headSpec: { style: 'drowned', eye: 'glint', jaw: 1, hair: '#141412', hairLen: 200 }, pal: { skin: '#9aa89c', crown: '#c8d0c0' }, body_extra: bar, attack: 'claw', idle: 'sway' }],
};
const only = process.argv.slice(2);
const done = [];
for (const [key, [arch, spec]] of Object.entries(C)) {
  if (only.length && !only.includes(key)) continue;
  const old = require('fs').existsSync(`grim/rig/${key}.rig.json`) ? JSON.parse(require('fs').readFileSync(`grim/rig/${key}.rig.json`)) : { w: 460, h: 700 };
  let seed = 0; for (const c of key) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const a = new Art(460, 700, seed % 100000 + 7), D = K.dressing(a);
  const s = Object.assign({ els: spec.els || EL }, spec, { pal: Object.assign({}, PAL, spec.pal || {}) });
  const anim = ARCH[arch](a, D, s);
  if (old.w !== 460 || old.h !== 700) a.scaleTo(old.w, old.h, 460, 700);
  a.writeRig('grim/rig/' + key, { idle: spec.idle || anim.idle, attack: spec.attack || anim.attack, hand: anim.hand });
  done.push(key);
}
console.log(done.join(' '));
