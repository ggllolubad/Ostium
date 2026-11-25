// Card illustrations: one unique vignette per card, composed from grim motifs chosen by what the card does.
// The first meaningful effect picks the hero motif, the next ones add supporting motifs; the card id seeds
// the layout, ground pattern, tint and props, so no two cards share an image.
// Usage: node grim/cards.js <cards.json> <outdir>  (writes one SVG per card into outdir)
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const fs = require('fs');
const W = 336, H = 184;
const cards = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const outdir = process.argv[3] || 'grim/cards';
fs.mkdirSync(outdir, { recursive: true });
const EL = { fire: '#c4573f', frost: '#7fa4c8', lightning: '#d6ad52', water: '#4f7fa6', toxin: '#7d8a5a', void: '#6d5a8a', physical: '#8a7a64', attuned: '#7b6a96' };
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const f = n => +n.toFixed(1);

// ------------------------------------------------------------------ motifs, drawn around (0,0), roughly 120 units tall
const M = {};
M.sword = (a) => { a.shape({ d: poly([[-5, -60], [0, -72], [5, -60], [5, 30], [-5, 30]]), fill: G.steelL, depth: 4, spec: ['M-2 -58 L-2 26'] }); a.shape({ d: poly([[-26, 30], [26, 30], [26, 38], [-26, 38]]), fill: G.goldL, depth: 4 }); a.shape({ d: poly([[-4, 38], [4, 38], [4, 64], [-4, 64]]), fill: G.leatherD, depth: 3, lines: ['M-4 46 L4 44', 'M-4 54 L4 52'] }); a.raw(`<circle cx="0" cy="68" r="6" fill="${G.goldL}" stroke="${INK}" stroke-width="1.2"/>`); };
M.rapier = (a) => { a.shape({ d: poly([[-2.4, -76], [2.4, -76], [3, 30], [-3, 30]]), fill: G.steelL, depth: 2, core: false }); a.raw(`<path d="M-18 30 C-20 52 18 52 18 30" fill="none" stroke="${INK}" stroke-width="4"/><path d="M-18 30 C-20 52 18 52 18 30" fill="none" stroke="${G.goldL}" stroke-width="2"/><ellipse cx="0" cy="36" rx="10" ry="6" fill="none" stroke="${INK}" stroke-width="3"/>`); a.shape({ d: poly([[-4, 38], [4, 38], [4, 62], [-4, 62]]), fill: G.leatherD, depth: 3 }); };
M.mace = (a) => { a.shape({ d: limb([[0, 64], [0, -20]], [9, 9]), fill: G.woodD, depth: 3, tex: 'url(#grain)' }); for (const [x, s] of [[-14, -1], [14, 1]]) a.shape({ d: poly([[0, -60], [x + s * 12, -50], [x + s * 12, -24], [0, -14]]), fill: s < 0 ? G.steelD : G.steel, depth: 6 }); a.shape({ d: poly([[-7, -66], [7, -66], [8, -14], [-8, -14]]), fill: G.steelL, depth: 5, spec: ['M-3 -60 L-3 -20'] }); };
M.shield = (a) => a.shape({ d: 'M-46 -54 L46 -54 C48 0 32 40 0 66 C-32 40 -48 0 -46 -54 Z', fill: G.red, depth: 30, mottle: 0.8, after: `<path d="M-38 -46 L38 -46 C40 0 26 34 0 56 C-26 34 -40 0 -38 -46 Z" fill="none" stroke="${G.steelD}" stroke-width="3"/><path d="M-14 30 L-14 -10 C-14 -26 14 -26 14 -10 L14 30 Z" fill="${G.gold}" stroke="${INK}" stroke-width="1.2"/><path d="M-8 30 L-8 -8 C-8 -18 8 -18 8 -8 L8 30 Z" fill="${G.black}"/>` });
M.flask = (a, col) => { a.shape({ d: smooth([[-8, -60], [8, -60], [8, -36], [36, 10], [30, 50], [0, 60], [-30, 50], [-36, 10], [-8, -36]], true, 0.35), fill: col || G.slime, depth: 18, spec: ['M-20 4 C-24 20 -20 36 -12 46'], specOp: 0.6 }); a.shape({ d: poly([[-11, -72], [11, -72], [10, -60], [-10, -60]]), fill: G.wood, depth: 3 }); a.raw(`<path d="M-30 14 C-10 6 10 22 30 14" stroke="${INK}" stroke-width="1" fill="none" opacity="0.6"/>`); };
M.skull = (a) => a.shape({ d: smooth([[-34, -20], [-20, -50], [20, -50], [34, -20], [30, 14], [16, 22], [14, 40], [-14, 40], [-16, 22], [-30, 14]], true, 0.7), fill: G.bone, depth: 20, mottle: 0.6, decals: `<ellipse cx="-13" cy="-8" rx="10" ry="11" fill="${G.black}"/><ellipse cx="13" cy="-8" rx="10" ry="11" fill="${G.black}"/><path d="M0 6 L-5 18 L5 18 Z" fill="${G.black}"/><path d="M-12 30 L-12 40 M-4 30 L-4 40 M4 30 L4 40 M12 30 L12 40" stroke="${INK}" stroke-width="1.2"/>` });
M.hand = (a) => a.shape({ d: smooth([[-22, 60], [-26, 10], [-40, -6], [-36, -14], [-20, -4], [-20, -50], [-12, -54], [-8, -20], [-6, -64], [2, -66], [4, -22], [10, -60], [18, -58], [16, -18], [24, -48], [32, -44], [26, 14], [20, 60]], true, 0.5), fill: G.fleshP, depth: 16, mottle: 0.6, fine: true, lines: ['M-14 14 C-4 20 8 20 18 14'] });
M.eye = (a) => { a.raw(`<path d="M-56 0 C-30 -36 30 -36 56 0 C30 36 -30 36 -56 0 Z" fill="#e6dcc0" stroke="${INK}" stroke-width="2"/><circle cx="0" cy="0" r="20" fill="${G.violetD}" stroke="${INK}" stroke-width="1.4"/><circle cx="0" cy="0" r="9" fill="${G.black}"/><circle cx="-6" cy="-6" r="3.6" fill="#fff"/><path d="M-50 -4 C-40 -10 -30 -12 -22 -10 M50 -4 C40 -12 30 -14 22 -10" stroke="${G.bloodL}" stroke-width="0.8" fill="none"/>`); };
M.hourglass = (a) => { a.shape({ d: poly([[-34, -62], [34, -62], [34, -54], [-34, -54]]), fill: G.woodD, depth: 3 }); a.shape({ d: poly([[-34, 54], [34, 54], [34, 62], [-34, 62]]), fill: G.woodD, depth: 3 }); a.shape({ d: smooth([[-26, -54], [26, -54], [6, -4], [26, 54], [-26, 54], [-6, -4]], true, 0.25), fill: '#d8e0e0', fillOp: 0.7, depth: 6, core: false, after: `<path d="M-18 -46 L18 -46 L0 -8 Z" fill="${G.black}"/><path d="M0 -4 L0 40" stroke="${G.black}" stroke-width="1.2"/><path d="M-20 52 C-10 36 10 36 20 52 Z" fill="${G.black}"/>` }); };
M.candle = (a) => { a.shape({ d: poly([[-12, -20], [12, -20], [14, 60], [-14, 60]]), fill: '#d8d0b8', depth: 8, mottle: 0.5, decals: a.drips(-10, 10, -20, 3, 18, 3, '#e8e0c8') }); a.raw(`<circle cx="0" cy="-40" r="20" fill="#f0c060" opacity="0.25"/><path d="M0 -60 C10 -44 8 -32 0 -26 C-8 -32 -10 -44 0 -60 Z" fill="#e8823a" stroke="${INK}" stroke-width="1"/><path d="M0 -48 C4 -40 4 -34 0 -30 C-4 -34 -4 -40 0 -48 Z" fill="#f6d27a"/>`); };
M.book = (a) => a.shape({ d: poly([[-56, -36], [0, -28], [56, -36], [56, 40], [0, 48], [-56, 40]]), fill: '#cfc6ae', depth: 12, mottle: 0.6, lines: ['M0 -28 L0 48', ...[0, 1, 2, 3, 4].map(i => `M-48 ${-20 + i * 12} L-8 ${-14 + i * 12}`), ...[0, 1, 2, 3, 4].map(i => `M8 ${-14 + i * 12} L48 ${-20 + i * 12}`)], decals: a.stain(-26, 10, 10, G.blood, 0.6) });
M.chain = (a) => { let c = ''; for (let i = 0; i < 9; i++) { const x = -64 + i * 16, y = Math.sin(i * 0.8) * 10; c += `<ellipse cx="${x}" cy="${f(y)}" rx="${i % 2 ? 4 : 10}" ry="7" fill="none" stroke="${INK}" stroke-width="5"/><ellipse cx="${x}" cy="${f(y)}" rx="${i % 2 ? 4 : 10}" ry="7" fill="none" stroke="${G.iron}" stroke-width="2.6"/>`; } a.raw(c); };
M.nail = (a) => { a.shape({ d: poly([[-3, -50], [3, -50], [2, 50], [0, 60], [-2, 50]]), fill: G.rust, depth: 3, core: false }); a.shape({ d: poly([[-12, -58], [12, -58], [10, -50], [-10, -50]]), fill: G.iron, depth: 3 }); };
M.poppet = (a) => a.shape({ d: smooth([[-12, -54], [12, -54], [14, -30], [40, -24], [38, -12], [14, -10], [20, 50], [6, 50], [0, 20], [-6, 50], [-20, 50], [-14, -10], [-38, -12], [-40, -24], [-14, -30]], true, 0.4), fill: '#b8a88a', depth: 12, mottle: 0.7, fine: true, lines: ['M0 -50 L0 40', 'M-6 -6 L6 -6 M-6 4 L6 4 M-6 14 L6 14'], decals: `<path d="M-8 -44 l4 4 m0 -4 l-4 4 M4 -44 l4 4 m0 -4 l-4 4" stroke="${INK}" stroke-width="1.2"/>` + a.stain(4, 0, 8, G.blood, 0.8) });
M.wound = (a) => a.raw(a.gash(-50, -20, 50, 20, 14, { dripLen: 30 }) + a.splat(30, -10, 8, { drops: 7 }));
M.drop = (a, col) => a.shape({ d: smooth([[0, -60], [30, -4], [34, 24], [0, 50], [-34, 24], [-30, -4]], true, 0.6), fill: col || '#4f7fa6', depth: 20, spec: ['M-16 4 C-20 16 -16 28 -8 34'], specOp: 0.7 });
M.flame = (a) => a.raw(`<path d="M0 60 C-50 40 -36 -6 -16 -30 C-14 -12 -6 -6 0 -10 C-6 -40 12 -64 22 -70 C18 -40 48 -20 44 16 C40 44 24 58 0 60 Z" fill="#d4602a" stroke="${INK}" stroke-width="2"/><path d="M0 50 C-24 36 -18 10 -6 -4 C-4 10 4 12 8 8 C6 -8 16 -20 22 -26 C22 0 34 10 30 30 C28 44 16 50 0 50 Z" fill="#f0a040"/><path d="M0 42 C-10 32 -8 20 0 12 C4 22 12 24 10 34 C8 40 4 42 0 42 Z" fill="#f6e0a0"/>`);
M.snowflake = (a) => a.raw([0, 60, 120].map(r => `<g transform="rotate(${r})"><path d="M0 -58 L0 58 M-12 -40 L0 -28 L12 -40 M-12 40 L0 28 L12 40" stroke="#e8f4f8" stroke-width="7" fill="none"/><path d="M0 -58 L0 58 M-12 -40 L0 -28 L12 -40 M-12 40 L0 28 L12 40" stroke="${G.azureD}" stroke-width="2.6" fill="none"/></g>`).join(''));
M.bolt = (a) => a.raw(`<path d="M10 -66 L-24 6 L0 6 L-14 64 L28 -14 L4 -14 Z" fill="${G.goldL}" stroke="${INK}" stroke-width="2.2"/><path d="M6 -50 L-14 2" stroke="#fff6d0" stroke-width="2"/>`);
M.bubbles = (a) => a.raw([[0, 10, 30], [30, -30, 16], [-30, -26, 12], [26, 40, 10], [-36, 36, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${G.slime}" stroke="${INK}" stroke-width="1.6"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.25)}" fill="#e8f0c8"/>`).join(''));
M.void = (a) => a.raw(`<circle cx="0" cy="0" r="58" fill="#7b6a96" opacity="0.4"/><circle cx="0" cy="0" r="44" fill="${G.black}" stroke="${INK}" stroke-width="2"/>` + [0, 1, 2].map(i => `<path d="M${-40 + i * 6} 0 A${40 - i * 6} ${40 - i * 6} 0 0 1 0 ${-40 + i * 6}" stroke="#b9a8d6" stroke-width="1.2" fill="none" stroke-dasharray="4 3"/>`).join(''));
M.thorns = (a) => { a.raw(`<path d="M-60 30 C-30 -20 0 40 30 -10 C44 -34 56 -30 64 -40" stroke="${INK}" stroke-width="8" fill="none"/><path d="M-60 30 C-30 -20 0 40 30 -10 C44 -34 56 -30 64 -40" stroke="${G.greenD}" stroke-width="5" fill="none"/>` + [[-44, 6, -1], [-22, 2, 1], [0, 18, -1], [20, 8, 1], [40, -24, -1]].map(([x, y, s]) => `<path d="M${x - 5} ${y} L${x} ${y + s * 16} L${x + 5} ${y} Z" fill="${G.bone}" stroke="${INK}" stroke-width="1"/>`).join('') + a.drip(0, 30, 16, 2.6)); };
M.boot = (a) => a.shape({ d: smooth([[-20, -60], [10, -60], [12, 20], [52, 34], [56, 56], [-24, 56], [-26, 20]], true, 0.5), fill: G.leatherD, depth: 16, mottle: 0.6, lines: ['M-20 -40 L10 -40', 'M-24 40 L54 40'] });
M.crown = (a) => a.shape({ d: poly([[-50, 30], [-50, -30], [-28, 0], [-14, -44], [0, -6], [14, -44], [28, 0], [50, -30], [50, 30]]), fill: G.gold, depth: 14, mottle: 0.6, decals: `<circle cx="0" cy="16" r="6" fill="${G.bloodL}" stroke="${INK}" stroke-width="1"/>` + a.stain(-30, 10, 10, '#4f7f6a', 0.7) });
M.axe = (a) => { a.shape({ d: limb([[10, 66], [-6, -60]], [8, 8]), fill: G.woodD, depth: 3, tex: 'url(#grain)' }); a.shape({ d: smooth([[-4, -60], [-50, -70], [-62, -30], [-50, 6], [-6, -16]], true, 0.5), fill: G.steel, depth: 12, spec: ['M-56 -48 C-60 -32 -58 -18 -52 -6'], decals: a.splat(-48, -30, 6, { drops: 4 }) }); };
M.heart = (a) => a.shape({ d: smooth([[0, 50], [-44, 6], [-40, -30], [-14, -38], [0, -20], [14, -38], [40, -30], [44, 6]], true, 0.5), fill: '#9a2a24', depth: 18, mottle: 0.6, fine: true, lines: ['M-10 -20 C-14 0 -6 20 0 40'], decals: `<path d="M-30 -20 L-40 -46 M20 -30 L30 -52" stroke="${G.bloodD}" stroke-width="5"/>` });
M.feather = (a) => a.shape({ d: smooth([[0, 66], [-6, 20], [-22, -20], [-10, -60], [8, -64], [20, -20], [8, 20]], true, 0.5), fill: '#cfc6ae', depth: 10, core: false, lines: ['M2 60 L0 -60', ...[0, 1, 2, 3, 4, 5].map(i => `M0 ${40 - i * 18} L-16 ${30 - i * 18} M0 ${40 - i * 18} L14 ${30 - i * 18}`)] });
M.bell = (a) => a.shape({ d: 'M-40 40 C-30 -10 -24 -40 0 -46 C24 -40 30 -10 40 40 L48 48 L-48 48 Z', fill: G.gold, depth: 18, mottle: 0.7, decals: a.stain(10, 0, 12, '#4f7f6a', 0.7), after: `<circle cx="0" cy="54" r="6" fill="${G.iron}" stroke="${INK}" stroke-width="1"/>` });
M.rune = (a, col) => a.raw(`<circle cx="0" cy="0" r="52" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="0" r="52" fill="none" stroke="${col || G.goldL}" stroke-width="2"/><path d="M0 -40 L0 40 M-30 -20 L30 20 M-30 20 L30 -20 M-14 -40 L14 -40" stroke="${INK}" stroke-width="5"/><path d="M0 -40 L0 40 M-30 -20 L30 20 M-30 20 L30 -20 M-14 -40 L14 -40" stroke="${col || G.goldL}" stroke-width="2.4"/>`);
M.arrows = (a) => a.raw([-24, 0, 24].map(y => `<path d="M-50 ${y} L36 ${y} M22 ${y - 12} L40 ${y} L22 ${y + 12}" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-50 ${y} L36 ${y} M22 ${y - 12} L40 ${y} L22 ${y + 12}" stroke="${G.parch}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`).join(''));
M.horn = (a) => a.shape({ d: smooth([[-56, -20], [-20, -10], [20, -20], [52, -40], [58, -28], [30, 10], [-20, 18], [-58, 0]], true, 0.6), fill: G.bone, depth: 14, mottle: 0.5, lines: ['M-30 -12 L-28 14', 'M-10 -12 L-6 16', 'M10 -16 L14 12', 'M30 -22 L32 4'] });
M.pearls = (a) => a.raw([[-20, 10], [0, -6], [20, 12], [-6, 26], [14, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#3a3a48" stroke="${INK}" stroke-width="1.4"/><circle cx="${x - 4}" cy="${y - 4}" r="3.4" fill="#c8c8e0"/>`).join(''));
M.tooth = (a) => a.raw(a.splat(0, 30, 10, { drops: 6 })) || a.shape({ d: smooth([[-24, -50], [24, -50], [26, -10], [10, 50], [0, 20], [-10, 50], [-26, -10]], true, 0.5), fill: G.bone, depth: 12 });

// which motif a single effect suggests
function motifFor(fx, card) {
  const cls = card.cls;
  const weapon = { bulwark: 'mace', duelist: 'rapier', elementalist: 'rune', alchemist: 'flask', oracle: 'eye', hexweaver: 'nail' }[cls] || 'sword';
  switch (fx.t) {
    case 'dmg': case 'coup': case 'dmg_per_element': return card.cat === 'physical' ? (fx.times ? 'sword' : weapon) : { fire: 'flame', frost: 'snowflake', lightning: 'bolt', water: 'drop', toxin: 'bubbles', void: 'void' }[card.cat] || weapon;
    case 'block': case 'self_block': case 'block_target': case 'armor': case 'fortify': return 'shield';
    case 'ward': return 'rune';
    case 'apply': case 'apply_x': return { fire: 'flame', frost: 'snowflake', lightning: 'bolt', water: 'drop', toxin: 'bubbles', void: 'void' }[fx.e];
    case 'apply_attuned': case 'apply_next': case 'apply_missing': case 'react': case 'attune': case 'attune_to': case 'convert': case 'spread': return 'rune';
    case 'heal': case 'grit': return 'heart';
    case 'stress': case 'self_stress': case 'stress_take': return fx.n < 0 ? 'candle' : 'skull';
    case 'status': return { bleed: 'wound', mark: 'eye', stun: 'skull', vulnerable: 'wound', might: 'axe', focus: 'eye', momentum: 'boot', riposte: 'rapier', taunt: 'horn', thorns: 'thorns', dodge: 'feather', regen: 'heart', hex: 'poppet', doom: 'hourglass', anchor: 'chain', fortify: 'shield' }[fx.s] || 'rune';
    case 'push': case 'pull': case 'advance': case 'retreat': case 'swap': case 'to_front': return 'arrows';
    case 'guard': case 'guard_weakest': return 'shield';
    case 'prime': return 'rune';
    case 'draw': return 'book';
    case 'energy': return 'candle';
    case 'add': return 'flask';
    case 'consume': case 'double': return fx.s === 'hex' ? 'poppet' : (fx.s === 'bleed' ? 'wound' : 'void');
    case 'cleanse': return 'drop';
    case 'transfer': return 'hand';
    case 'execute': return 'axe';
    case 'delay': return 'hourglass';
    case 'turn': return 'eye';
    case 'steal_block': return 'hand';
    case 'omen': return 'bones';
    case 'cap': return 'rune';
    case 'self_dmg': case 'kill_self_hp': return 'wound';
    case 'bash_stun': return 'skull';
  }
  return 'rune';
}
M.bones = (a) => a.raw([[-40, -20, 40, 20], [-40, 20, 40, -20], [-10, -40, 10, 40]].map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${G.bone}" stroke-width="8" stroke-linecap="round"/>`).join(''));

function compose(id, c) {
  const seed = hash(id), a = new Art(W, H, seed % 9973 + 1), R = a.R;
  const tint = EL[c.cat] || EL.physical;
  // ground: dark murk tinted by element, hatched, with a seeded pattern
  a.raw(`<rect width="${W}" height="${H}" fill="#1c1a18"/><rect width="${W}" height="${H}" fill="${tint}" opacity="0.38"/>`);
  const pat = seed % 4;
  if (pat === 0) a.raw(`<rect width="${W}" height="${H}" fill="${a.hatchPat(30 + seed % 60, 3, 0.6, '#000')}" opacity="0.5"/>`);
  if (pat === 1) a.raw(Array.from({ length: 9 }, (_, i) => `<path d="M${-40 + i * 46} ${H} L${i * 46 + 20} 0" stroke="#000" stroke-width="10" opacity="0.18"/>`).join(''));
  if (pat === 2) a.raw(`<circle cx="${W / 2}" cy="${H / 2}" r="${H * 0.55}" fill="#fff6e0" opacity="0.1"/>` + Array.from({ length: 16 }, (_, i) => { const t = i / 16 * Math.PI * 2; return `<path d="M${W / 2} ${H / 2} L${f(W / 2 + Math.cos(t) * 220)} ${f(H / 2 + Math.sin(t) * 220)}" stroke="#fff6e0" stroke-width="2" opacity="0.08"/>`; }).join(''));
  if (pat === 3) a.raw(`<rect width="${W}" height="${H}" fill="url(#grime)" opacity="0.5"/>`);
  a.raw(`<rect width="${W}" height="${H}" filter="url(#mottle)" opacity="0.6"/>`);
  // collect motifs from effects
  const picks = [];
  for (const fx of c.fx || []) { const m = motifFor(fx, c); if (m && !picks.includes(m)) picks.push(m); }
  if (c.target === 'none') picks.push('skull');
  if (!picks.length) picks.push('rune');
  const main = picks[0], sup = picks.slice(1, 3);
  const flaskCol = { fire: '#d4602a', water: '#4f7fa6', toxin: G.slime, frost: '#a8c8d8' }[c.cat];
  const draw = (name, x, y, s, op = 1) => { a.raw(`<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})" opacity="${op}">`); (M[name] || M.rune)(a, name === 'flask' ? flaskCol : (name === 'drop' ? undefined : (name === 'rune' ? tint : undefined))); a.raw(`</g>`); };
  // layout variants
  const lay = (seed >> 3) % 3, mx = lay === 0 ? W / 2 : (lay === 1 ? W * 0.38 : W * 0.62), sc = 0.95 + R() * 0.25;
  // a halo behind the main motif
  a.raw(`<ellipse cx="${f(mx)}" cy="${f(H / 2 + 6)}" rx="${f(70 * sc)}" ry="${f(64 * sc)}" fill="${tint}" opacity="0.35"/>`);
  sup.forEach((m, i) => { const sx = lay === 0 ? (i ? W * 0.84 : W * 0.16) : (lay === 1 ? W * (0.72 + i * 0.16) : W * (0.28 - i * 0.16)); draw(m, sx, H * (0.42 + i * 0.22), 0.55 + R() * 0.15, 0.95); });
  draw(main, mx, H / 2 + 4, sc * 1.05);
  // rarity accents
  if (c.rarity === 'R' || c.rarity === 'X') a.raw(`<rect x="4" y="4" width="${W - 8}" height="${H - 8}" fill="none" stroke="${c.rarity === 'R' ? G.goldL : '#9a86b8'}" stroke-width="2" opacity="0.8"/>`);
  if ((c.kw || []).includes('Exhaust')) a.raw(a.splat(W - 30, H - 26, 6, { drops: 5, col: '#2a1a14' }));
  // gore flecks on violent cards
  if ((c.fx || []).some(x => x.t === 'dmg') && seed % 2) a.raw(a.splat(20 + R() * (W - 40), 20 + R() * (H - 40), 4 + R() * 4, { drops: 6 }));
  a.raw(`<radialGradient id="cv"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient><rect width="${W}" height="${H}" fill="url(#cv)"/>`);
  return a.svg();
}
let n = 0;
for (const [id, c] of Object.entries(cards)) { fs.writeFileSync(`${outdir}/${id}.svg`, compose(id, c)); n++; }
console.log('cards', n);
