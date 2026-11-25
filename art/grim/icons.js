// Item, status, node and supply icons. Each icon is an engraved object on a 128x128 transparent canvas.
// Usage: node grim/icons.js  -> grim/icons/<id>.svg
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { dressing, mix, dark, light } = require('./kit');
const { sig, COL } = require('./sigils');
const fs = require('fs');
const f = n => +n.toFixed(1);
fs.mkdirSync('grim/icons', { recursive: true });
const N = 128;
const EC = { fire: '#e8783a', frost: '#a8d0e8', lightning: '#f0d060', water: '#4f8abf', toxin: '#9ab850', void: '#8a6ab8' };

// ------------------------------------------------------------------ primitives
function kit(a) {
  const D = dressing(a), R = a.R, P = {};
  P.S = (d, fill, o = {}) => a.shape(Object.assign({ d, fill, depth: 6, mottle: 0.4, fine: true, hatch: 60, ink: 1.1 }, o));
  P.line = (x1, y1, x2, y2, w, col, cap = 'round') => a.raw(`<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${INK}" stroke-width="${f(w + 2)}" stroke-linecap="${cap}"/><path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="${cap}"/>`);
  P.bar = (x1, y1, x2, y2, w, col, o = {}) => { const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = -dy / l * w / 2, ny = dx / l * w / 2; P.S(poly([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]), col, Object.assign({ depth: Math.max(2, w * 0.35), core: false }, o)); };
  P.sword = (x1, y1, x2, y2, w = 9, metal = G.steelL, o = {}) => {
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
    const q = (s, t) => [x1 + ux * s + nx * t, y1 + uy * s + ny * t];
    P.S(poly([q(l * 0.26, -w / 2), q(l - w * 1.6, -w / 2 + 1), q(l, 0), q(l - w * 1.6, w / 2 - 1), q(l * 0.26, w / 2)]), metal, { depth: 3, core: false, spec: [`M${f(q(l * 0.28, -1)[0])} ${f(q(l * 0.28, -1)[1])} L${f(q(l - 12, -1)[0])} ${f(q(l - 12, -1)[1])}`], specOp: 0.7, decals: o.blood ? a.stain(q(l * 0.7, 0)[0], q(l * 0.7, 0)[1], 8, G.blood, 0.8) : (o.rust ? a.stain(q(l * 0.6, 0)[0], q(l * 0.6, 0)[1], 9, G.rust, 0.8) : '') });
    P.bar(...q(l * 0.24, -w * 1.6), ...q(l * 0.24, w * 1.6), 5, o.guard || G.gold);
    P.bar(...q(2, 0), ...q(l * 0.23, 0), 6, G.leatherD);
    P.S(blob(...q(0, 0), 5, R, 7, 0.1), o.guard || G.gold, { depth: 3 });
  };
  P.bottle = (cx, cy, kind, liq, o = {}) => {
    const sh = { round: [[cx - 6, cy - 34], [cx + 6, cy - 34], [cx + 7, cy - 18], [cx + 26, cy], [cx + 26, cy + 18], [cx, cy + 34], [cx - 26, cy + 18], [cx - 26, cy], [cx - 7, cy - 18]],
      tall: [[cx - 6, cy - 40], [cx + 6, cy - 40], [cx + 7, cy - 24], [cx + 16, cy - 14], [cx + 16, cy + 34], [cx - 16, cy + 34], [cx - 16, cy - 14], [cx - 7, cy - 24]],
      flat: [[cx - 6, cy - 34], [cx + 6, cy - 34], [cx + 7, cy - 20], [cx + 30, cy - 10], [cx + 32, cy + 26], [cx - 32, cy + 26], [cx - 30, cy - 10], [cx - 7, cy - 20]],
      vial: [[cx - 7, cy - 40], [cx + 7, cy - 40], [cx + 9, cy + 30], [cx, cy + 38], [cx - 9, cy + 30]] }[kind];
    const lv = o.level || 0.55, top = cy + 34 - 68 * lv;
    a.raw(`<clipPath id="bt${cx}${cy}${kind}"><path d="${smooth(sh, true, 0.4)}"/></clipPath><g clip-path="url(#bt${cx}${cy}${kind})"><rect x="${cx - 40}" y="${f(top)}" width="80" height="80" fill="${liq}"/><path d="M${cx - 40} ${f(top)} q10 -3 20 0 t20 0 t20 0 t20 0" stroke="${light(liq, 0.5)}" stroke-width="1.4" fill="none"/>${o.bubbles !== false ? Array.from({ length: 6 }, () => `<circle cx="${f(cx + (R() - 0.5) * 30)}" cy="${f(top + 6 + R() * 40)}" r="${f(1 + R() * 2.4)}" fill="none" stroke="${light(liq, 0.5)}" stroke-width="0.8"/>`).join('') : ''}</g>`);
    P.S(smooth(sh, true, 0.4), 'rgba(200,216,216,0.22)', { depth: 8, core: false, hl: true, hlOp: 0.3, spec: [`M${cx - 12} ${cy - 6} C${cx - 14} ${cy + 6} ${cx - 12} ${cy + 16} ${cx - 8} ${cy + 22}`], specOp: 0.8, mottle: 0 });
    P.S(poly([[cx - 7, cy - (kind === 'tall' || kind === 'vial' ? 48 : 42)], [cx + 7, cy - (kind === 'tall' || kind === 'vial' ? 48 : 42)], [cx + 6, cy - (kind === 'tall' || kind === 'vial' ? 38 : 32)], [cx - 6, cy - (kind === 'tall' || kind === 'vial' ? 38 : 32)]]), G.wood, { depth: 3, core: false });
    if (o.label) P.S(poly([[cx - 12, cy + 4], [cx + 12, cy + 2], [cx + 13, cy + 16], [cx - 11, cy + 18]]), G.parch, { depth: 2, core: false, mottle: 0.6, lines: [`M${cx - 8} ${cy + 9} L${cx + 8} ${cy + 8}`, `M${cx - 8} ${cy + 13} L${cx + 6} ${cy + 12}`] });
    if (o.glow) a.raw(a.glow(cx, cy + 10, 40, o.glow, 0.4));
  };
  P.gem = (x, y, r, col) => { P.S(poly([[x, y - r], [x + r, y - r * 0.2], [x + r * 0.6, y + r], [x - r * 0.6, y + r], [x - r, y - r * 0.2]]), col, { depth: r * 0.5, ink: 1, spec: [`M${x - r * 0.4} ${y - r * 0.3} L${x} ${y - r * 0.7}`] }); a.raw(`<path d="M${x - r} ${f(y - r * 0.2)} L${x + r} ${f(y - r * 0.2)} M${x} ${y - r} L${f(x - r * 0.3)} ${f(y - r * 0.2)} L${x} ${y + r} M${x} ${y - r} L${f(x + r * 0.3)} ${f(y - r * 0.2)}" stroke="${INK}" stroke-width="0.6" opacity="0.6"/>`); };
  P.skull = (x, y, r, col = G.bone, o = {}) => {
    P.S(smooth([[x - r, y], [x - r * 0.9, y - r * 0.7], [x, y - r * 1.05], [x + r * 0.9, y - r * 0.7], [x + r, y], [x + r * 0.6, y + r * 0.5], [x + r * 0.5, y + r * 0.9], [x - r * 0.5, y + r * 0.9], [x - r * 0.6, y + r * 0.5]], true, 0.6), col, { depth: r * 0.4, mottle: 0.6,
      decals: `<path d="M${f(x - r * 0.15)} ${f(y - r * 0.9)} l${f(r * 0.1)} ${f(r * 0.3)} l${f(-r * 0.12)} ${f(r * 0.2)}" stroke="${INK}" stroke-width="0.8" fill="none"/>` });
    for (const s of [-1, 1]) a.raw(`<ellipse cx="${f(x + s * r * 0.38)}" cy="${f(y)}" rx="${f(r * 0.26)}" ry="${f(r * 0.3)}" fill="${G.black}"/>` + (o.glow ? `<circle cx="${f(x + s * r * 0.38)}" cy="${f(y)}" r="${f(r * 0.08)}" fill="${o.glow}"/>` : ''));
    a.raw(`<path d="M${x} ${f(y + r * 0.25)} l${f(-r * 0.1)} ${f(r * 0.25)} l${f(r * 0.2)} 0 Z" fill="${G.black}"/>` + Array.from({ length: 5 }, (_, i) => `<path d="M${f(x - r * 0.4 + i * r * 0.2)} ${f(y + r * 0.62)} l0 ${f(r * 0.26)}" stroke="${INK}" stroke-width="0.8"/>`).join(''));
  };
  P.ring = (x, y, r, col, gemCol) => { a.raw(`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.8)}" fill="none" stroke="${INK}" stroke-width="${f(r * 0.42)}"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.8)}" fill="none" stroke="${col}" stroke-width="${f(r * 0.3)}"/><path d="M${f(x - r * 0.7)} ${f(y - r * 0.5)} A${r} ${f(r * 0.8)} 0 0 1 ${f(x + r * 0.2)} ${f(y - r * 0.8)}" stroke="#fff" stroke-width="1.2" fill="none" opacity="0.6"/>`); if (gemCol) P.gem(x, y - r * 0.9, r * 0.45, gemCol); };
  P.cloth = (pts, col, o = {}) => P.S(smooth(pts, true, 0.5), col, Object.assign({ depth: 14, mottle: 0.6, hatch: 70, tex: 'url(#weave)', texOp: 0.4 }, o));
  P.torso = (col, o = {}) => {
    const body = [[50, 18], [64, 23], [78, 18], [96, 27], [114, 62], [101, 68], [93, 52], [95, 84], [100, 104], [104, 120], [76, 116], [66, 121], [56, 116], [24, 120], [28, 104], [33, 84], [35, 52], [27, 68], [14, 62], [32, 27]];
    const r = P.S(smooth(body, true, 0.45), col, Object.assign({ depth: 16, mottle: 0.5, hatch: 70, decals: (o.decals || '') + a.fold(50, 60, 46, 116, 5) + a.fold(80, 60, 84, 116, 5) }, o, { decals: (o.decals || '') + a.fold(50, 60, 46, 116, 5) + a.fold(80, 60, 84, 116, 5) }));
    P.S(smooth([[48, 14], [64, 18], [80, 14], [82, 24], [64, 30], [46, 24]], true, 0.5), dark(col, 0.2), { depth: 4, ink: 1 });
    a.raw(`<path d="M64 30 L64 60" stroke="${INK}" stroke-width="1"/><path d="M62 36 l4 0 M62 44 l4 0 M62 52 l4 0" stroke="${G.boneD}" stroke-width="1.6"/><path d="M33 84 L36 118 M95 84 L92 118" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`);
    return r;
  };
  P.flame = (x, y, h, w) => a.raw(D.flame(x, y, h, w));
  P.drop = (x, y, r, col) => P.S(smooth([[x, y - r * 1.6], [x + r, y], [x, y + r], [x - r, y]], true, 0.7), col, { depth: r * 0.4, core: false, spec: [`M${f(x - r * 0.4)} ${f(y - r * 0.2)} L${f(x - r * 0.2)} ${f(y - r * 0.7)}`] });
  P.coin = (x, y, r, col = G.goldL) => { P.S(`M${x - r} ${y} a${r} ${f(r * 0.9)} 0 1 0 ${2 * r} 0 a${r} ${f(r * 0.9)} 0 1 0 ${-2 * r} 0`, col, { depth: r * 0.4, ink: 1 }); a.raw(`<ellipse cx="${x}" cy="${y}" rx="${f(r * 0.7)}" ry="${f(r * 0.63)}" fill="none" stroke="${INK}" stroke-width="0.7"/><path d="M${x} ${f(y - r * 0.4)} L${x} ${f(y + r * 0.4)} M${f(x - r * 0.3)} ${y} L${f(x + r * 0.3)} ${y}" stroke="${INK}" stroke-width="0.9"/>`); };
  P.shield = (x, y, s, col, o = {}) => P.S(smooth([[x - 30 * s, y - 34 * s], [x, y - 40 * s], [x + 30 * s, y - 34 * s], [x + 30 * s, y + 4 * s], [x, y + 40 * s], [x - 30 * s, y + 4 * s]], true, 0.35), col, Object.assign({ depth: 12 * s, mottle: 0.6, hatch: 60, decals: a.stain(x + 6, y, 12 * s, G.rust, 0.6), after: a.rivet(x - 22 * s, y - 28 * s, 2) + a.rivet(x + 22 * s, y - 28 * s, 2) + a.rivet(x, y + 30 * s, 2) }, o));
  P.D = D; P.R = R;
  return P;
}

// ------------------------------------------------------------------ the icon list: id -> draw(a, P)
const I = {};
const pal = { bone: G.bone, steel: G.steelL, gold: G.goldL, wood: G.wood, leather: G.leather };
// --- weapons
I.w_rusted_mace = (a, P) => { P.bar(30, 104, 74, 46, 8, G.woodD); P.S(blob(82, 38, 20, P.R, 9, 0.15), G.iron, { depth: 8, decals: a.stain(82, 40, 14, G.rust, 0.9) }); a.raw(P.D.spikes(82, 38, 8, 14, 0, 6.28, G.steelD)); };
I.w_templar_hammer = (a, P) => { P.bar(28, 106, 76, 44, 8, G.woodD); P.S(poly([[60, 28], [96, 60], [84, 72], [48, 40]]), G.steelL, { depth: 8, spec: ['M62 34 L92 62'] }); a.raw(`<path d="M70 44 l8 8 M74 40 l0 16 M66 48 l16 0" stroke="${G.red}" stroke-width="2.4"/>`); };
I.w_gatebreaker = (a, P) => { P.bar(24, 110, 72, 50, 10, G.woodD); P.S(poly([[54, 22], [104, 62], [92, 78], [40, 38]]), G.iron, { depth: 10, decals: a.stain(80, 56, 12, G.rust, 0.7) }); a.raw(P.D.spikes(98, 72, 3, 12, 0.6, 1, G.steelD) + P.D.spikes(46, 30, 3, 12, -2.4, 1, G.steelD)); };
I.w_notched_rapier = (a, P) => { P.sword(20, 108, 108, 20, 6, G.steelL, { rust: true }); a.raw(`<path d="M24 92 C10 80 18 70 30 76" stroke="${G.gold}" stroke-width="2.4" fill="none"/><path d="M60 64 l3 4 M74 50 l3 4" stroke="${INK}" stroke-width="1.4"/>`); };
I.w_stormglass_blade = (a, P) => { P.sword(20, 108, 106, 22, 9, '#b8d8e8'); a.raw(P.D.arc(50, 70, 100, 26, 1.4) + a.glow(76, 50, 40, EC.lightning, 0.35)); };
I.w_widowmaker = (a, P) => { P.sword(20, 108, 108, 20, 8, '#5a5a62', { blood: true, guard: G.black }); a.raw(a.drip(98, 34, 26, 2.2) + a.drip(80, 52, 16, 1.6)); };
I.w_ash_staff = (a, P) => { P.bar(40, 120, 82, 26, 7, '#8a7a6a'); a.raw(P.D.flame(84, 30, 30, 10) + P.D.embers(84, 14, 30, 6)); };
I.w_drowned_sceptre = (a, P) => { P.bar(40, 118, 78, 40, 7, G.gold); P.S(blob(82, 30, 15, P.R, 8, 0.2), G.teal, { depth: 7, decals: a.stain(80, 30, 10, G.algae, 0.7) }); a.raw(P.D.weed(76, 40, 30) + P.D.drips(70, 92, 44, 3, 18)); };
I.w_prism_rod = (a, P) => { P.bar(36, 118, 78, 44, 6, G.woodD); P.gem(82, 30, 16, '#d8e8f0'); a.raw([EC.fire, EC.frost, EC.toxin].map((c, i) => `<path d="M90 30 L120 ${18 + i * 12}" stroke="${c}" stroke-width="3" opacity="0.8"/>`).join('')); };
I.w_cracked_retort = (a, P) => { P.bottle(60, 70, 'round', '#9ab850', { glow: EC.toxin }); a.raw(`<path d="M60 30 C70 20 96 18 108 30" stroke="${INK}" stroke-width="7" fill="none"/><path d="M60 30 C70 20 96 18 108 30" stroke="#c8d8d8" stroke-width="4" fill="none"/><path d="M44 62 l10 10 l-4 10 l8 8" stroke="${INK}" stroke-width="1.4" fill="none"/>` + a.drip(66, 104, 16, 2, '#9ab850')); };
I.w_brass_alembic = (a, P) => { P.S(smooth([[34, 104], [30, 70], [50, 50], [74, 52], [90, 72], [86, 104]], true, 0.6), G.goldL, { depth: 12, spec: ['M42 70 C44 60 52 56 60 56'] }); P.bar(80, 56, 112, 40, 6, G.gold); a.raw(P.D.flame(60, 120, 18, 14)); };
I.w_philosophers_still = (a, P) => { P.bottle(46, 74, 'tall', '#c84a2a', { glow: '#ff8a4a' }); P.bottle(90, 80, 'vial', '#e8c050'); a.raw(`<path d="M50 30 C60 14 84 14 90 38" stroke="${G.gold}" stroke-width="3" fill="none"/>` + a.glow(70, 40, 30, '#fff4c0', 0.5)); };
I.w_bone_dice = (a, P) => { for (const [x, y, r] of [[48, 70, -12], [82, 58, 14]]) { P.S(poly([[x - 18, y - 16], [x + 16, y - 20], [x + 20, y + 16], [x - 14, y + 20]]), G.bone, { depth: 8, mottle: 0.6 }); a.raw([[x - 6, y - 6], [x + 6, y + 6], [x, y]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="2.6" fill="${G.black}"/>`).join('')); } a.raw(a.stain(62, 96, 10, G.blood, 0.6)); };
I.w_seers_lens = (a, P) => { P.bar(30, 110, 56, 80, 8, G.woodD); P.ring(72, 54, 32, G.gold); a.raw(`<ellipse cx="72" cy="54" rx="28" ry="22" fill="#c8d8e8" opacity="0.5"/>` + P.D.eyes(72, 54, 4, 1, '#8a6ab8') + `<path d="M56 44 C60 38 68 36 74 38" stroke="#fff" stroke-width="2" fill="none" opacity="0.8"/>`); };
I.w_astrolabe = (a, P) => { for (const r of [44, 34]) P.ring(64, 66, r, r > 40 ? G.gold : G.goldL); a.raw(`<path d="M24 66 L104 66 M64 30 L64 102" stroke="${INK}" stroke-width="2"/><path d="M40 44 L88 88" stroke="${G.gold}" stroke-width="4"/>` + P.D.weed(90, 90, 26) + Array.from({ length: 12 }, (_, i) => { const t = i / 12 * 6.28; return `<path d="M${f(64 + Math.cos(t) * 44)} ${f(66 + Math.sin(t) * 35)} l${f(Math.cos(t) * 6)} ${f(Math.sin(t) * 5)}" stroke="${INK}" stroke-width="1.4"/>`; }).join('')); };
I.w_rag_poppet = (a, P) => { P.cloth([[52, 22], [76, 22], [80, 44], [104, 50], [100, 62], [80, 58], [86, 108], [70, 108], [64, 80], [58, 108], [42, 108], [48, 58], [28, 62], [24, 50], [48, 44]], '#b8a88a'); a.raw(`<path d="M56 32 l4 4 m0 -4 l-4 4 M68 32 l4 4 m0 -4 l-4 4" stroke="${INK}" stroke-width="1.6"/><path d="M64 46 L64 100" stroke="${INK}" stroke-width="0.8" stroke-dasharray="3 3"/>` + a.stain(66, 74, 10, G.blood, 0.8)); P.line(84, 40, 110, 16, 2, G.steel); };
I.w_coffin_nail = (a, P) => { P.S(poly([[40, 28], [62, 24], [56, 34], [54, 108], [50, 112], [46, 34]]), G.iron, { depth: 4, decals: a.stain(52, 60, 10, G.rust, 0.9) }); P.S(poly([[70, 40], [104, 36], [106, 100], [72, 104]]), G.woodD, { depth: 6, tex: 'url(#grain)', texOp: 0.6 }); a.raw(a.drip(52, 112, 12, 2)); };
I.w_witch_skull = (a, P) => { P.skull(64, 62, 34, G.bone, { glow: '#9ab850' }); a.raw(P.D.flame(64, 32, 30, 10).replace(/#c8481c/g, '#3a5a20').replace(/#f08a30/g, '#7a9a3a').replace(/#ffd27a/g, '#c8e880') + P.D.chain(30, 100, 98, 100, 10, G.iron)); };
// --- armour
I.a_padded_jack = (a, P) => P.torso('#8a7a5a', { lines: [0, 1, 2, 3, 4].map(i => `M36 ${46 + i * 12} L92 ${46 + i * 12}`), decals: a.stain(70, 80, 14, G.blood, 0.5) });
I.a_brigandine = (a, P) => P.torso(G.redD, { decals: Array.from({ length: 18 }, (_, i) => a.rivet(42 + (i % 6) * 9, 48 + Math.floor(i / 6) * 18, 1.6)).join('') });
I.a_oilskin = (a, P) => { P.torso('#5a5a3a', { spec: ['M44 40 C46 70 44 90 46 100', 'M80 40 C82 70 80 90 82 100'], specOp: 0.5 }); a.raw(P.D.drips(40, 90, 100, 5, 14, '#8aa0a0')); };
I.a_hauberk = (a, P) => P.torso(G.steelD, { tex: 'url(#mail)', texOp: 0.9, decals: a.stain(66, 70, 18, G.algae, 0.6) + a.stain(50, 90, 10, G.rust, 0.6) });
I.a_pilgrim_robes = (a, P) => P.cloth([[44, 18], [84, 18], [100, 40], [110, 112], [18, 112], [28, 40]], '#8f8068', { decals: a.fold(56, 30, 48, 110, 5) + a.fold(74, 30, 80, 110, 5), after: `<path d="M58 22 L64 40 L70 22" stroke="${INK}" stroke-width="1.2" fill="none"/>` });
I.a_thorned_mail = (a, P) => { P.torso(G.steelD, { tex: 'url(#mail)', texOp: 0.8 }); a.raw(P.D.spikes(64, 40, 7, 14, -Math.PI / 2, 2.6, G.steel) + P.D.spikes(40, 70, 3, 10, Math.PI, 1, G.steel) + P.D.spikes(88, 70, 3, 10, 0, 1, G.steel)); };
I.a_saints_plate = (a, P) => {
  // a white-enamelled breastplate with a gilt cross, its lames and a pauldron, scarred by a blade
  P.S(smooth([[34, 30], [64, 22], [94, 30], [102, 62], [92, 92], [64, 100], [36, 92], [26, 62]], true, 0.45), G.steelL, { depth: 16, hatch: 70, lines: [{ d: 'M64 24 C60 50 60 70 64 98', w: 1.2 }], spec: ['M40 38 C34 56 36 76 44 88'], specOp: 0.7, decals: a.gash(72, 44, 88, 70, 2.4) + a.stain(80, 80, 10, G.rust, 0.6), after: [[40, 36], [88, 36], [42, 88], [86, 88]].map(([x, y]) => a.rivet(x, y, 2)).join('') });
  P.bar(64, 34, 64, 82, 6, G.goldL); P.bar(50, 50, 78, 50, 6, G.goldL);
  for (let i = 0; i < 2; i++) P.S(smooth([[38, 96 + i * 10], [90, 96 + i * 10], [92, 108 + i * 10], [36, 108 + i * 10]], true, 0.3), dark(G.steelL, 0.1 + i * 0.08), { depth: 5, ink: 1 });
  P.S(smooth([[84, 20], [108, 24], [118, 46], [100, 50], [92, 34]], true, 0.5), G.steelL, { depth: 8, ink: 1.1, spec: ['M90 26 L108 30'], specOp: 0.6 });
};
I.a_shroud = (a, P) => {
  // a burial shroud with its hood up and nobody inside it
  P.cloth([[46, 12], [82, 12], [96, 40], [104, 80], [98, 118], [84, 108], [72, 120], [58, 108], [42, 120], [28, 106], [26, 70], [34, 36]], '#3a3632', { decals: a.fold(52, 40, 44, 112, 6) + a.fold(70, 44, 72, 116, 6) + a.fold(88, 50, 92, 110, 5) + a.stain(64, 90, 14, G.algae, 0.5) });
  P.S(smooth([[46, 24], [64, 16], [82, 24], [80, 50], [64, 58], [48, 50]], true, 0.6), '#0c0a08', { depth: 4, ink: 1 });
  a.raw(a.glow(58, 38, 10, '#c8d0c0', 0.5) + a.glow(70, 38, 10, '#c8d0c0', 0.5));
};
// --- trinkets
I.t_tooth_charm = (a, P) => { a.raw(`<path d="M24 26 C40 60 88 60 104 26" stroke="${INK}" stroke-width="2" fill="none"/>`); for (const [x, y] of [[44, 52], [64, 58], [84, 52]]) P.S(smooth([[x - 7, y], [x + 7, y], [x + 4, y + 30], [x, y + 36], [x - 4, y + 30]], true, 0.5), G.bone, { depth: 4 }); };
I.t_salt_pouch = (a, P) => { P.S(smooth([[40, 40], [88, 40], [102, 90], [64, 112], [26, 90]], true, 0.6), G.leather, { depth: 14, mottle: 0.7 }); P.line(40, 42, 88, 42, 3, G.parchD); a.raw(Array.from({ length: 16 }, () => `<rect x="${f(56 + P.R() * 20)}" y="${f(26 + P.R() * 14)}" width="3" height="3" fill="#f4f0e8" stroke="${INK}" stroke-width="0.4"/>`).join('')); };
I.t_rosary = (a, P) => { let o = ''; for (let i = 0; i < 18; i++) { const t = i / 18 * 6.28, x = 64 + Math.cos(t) * 32, y = 50 + Math.sin(t) * 26; o += `<circle cx="${f(x)}" cy="${f(y)}" r="4" fill="${G.iron}" stroke="${INK}" stroke-width="0.9"/>`; } a.raw(o); P.bar(64, 76, 64, 118, 6, G.iron); P.bar(52, 90, 76, 90, 6, G.iron); };
I.t_eel_tooth = (a, P) => { P.S(smooth([[50, 20], [76, 22], [72, 70], [60, 112], [52, 70]], true, 0.5), G.bone, { depth: 6, decals: a.stain(60, 40, 8, G.blood, 0.6) }); P.line(62, 22, 62, 8, 2, G.leatherD); };
I.t_candle_stub = (a, P) => { P.S(poly([[44, 60], [84, 60], [86, 112], [42, 112]]), '#d8ccb0', { depth: 10, decals: a.stain(64, 90, 10, G.black, 0.4) }); a.raw(a.drip(48, 60, 26, 4, '#d8ccb0') + a.drip(80, 60, 18, 4, '#d8ccb0') + P.D.flame(64, 58, 40, 10)); };
I.t_grave_moss = (a, P) => { P.S(blob(64, 74, 36, P.R, 12, 0.3), '#4f5f3a', { depth: 12, mottle: 0.9 }); a.raw(P.D.fungus(60, 56, 3, 0.7, '#c8b88a') + P.D.spores(64, 50, 30, 12)); };
I.t_hangmans_knot = (a, P) => { a.raw(`<path d="M64 8 L64 40 M64 40 C30 50 30 100 64 112 C98 100 98 50 64 40" stroke="${INK}" stroke-width="9" fill="none"/><path d="M64 8 L64 40 M64 40 C30 50 30 100 64 112 C98 100 98 50 64 40" stroke="#a8946a" stroke-width="6" fill="none" stroke-dasharray="5 2"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M56 ${40 + i * 5} L72 ${42 + i * 5}" stroke="${INK}" stroke-width="2"/>`).join('')); };
I.t_pearl_of_ysolde = (a, P) => { P.S(`M38 64 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0`, '#e8e4dc', { depth: 14, hl: true, hlOp: 0.4, spec: ['M50 52 C54 46 60 44 66 44'] }); a.raw(a.glow(64, 64, 50, '#f4ecd0', 0.4) + a.stain(70, 76, 8, G.blood, 0.6)); };
I.t_kings_ring = (a, P) => { P.ring(64, 72, 30, G.gold, '#2a6a6a'); a.raw(P.D.weed(84, 84, 20) + a.stain(50, 84, 8, G.algae, 0.7)); };
// --- runes: carved stones with their glyph
const rune = (glyph, col) => (a, P) => { P.S(smooth([[36, 24], [90, 20], [104, 64], [90, 108], [40, 110], [24, 66]], true, 0.6), '#7a766a', { depth: 16, mottle: 0.9 }); a.raw(`<path d="${glyph}" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${glyph}" stroke="${col}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + a.glow(64, 64, 40, col, 0.35)); };
I.r_iron = rune('M52 40 L52 90 M52 40 L78 56 L52 66', '#a8a8a0');
I.r_blood = rune('M64 34 L64 94 M44 50 L84 50 M48 80 L64 94 L80 80', '#c83a2a');
I.r_wrath = rune('M44 40 L84 90 M84 40 L44 90 M64 34 L64 96', '#e8783a');
I.r_eye = rune('M40 64 C52 46 76 46 88 64 C76 82 52 82 40 64 Z M64 58 L64 70', '#8a6ab8');
I.r_salt = rune('M64 36 L64 92 M48 46 L80 82 M80 46 L48 82', '#e8e4dc');
I.r_ward = rune('M64 36 L88 64 L64 92 L40 64 Z M64 50 L64 78', '#6a8ac8');
I.r_thorn = rune('M52 36 L52 94 M52 48 L76 62 L52 76', '#6a8a3a');
I.r_haste = rune('M44 40 L64 60 L44 80 M64 40 L84 60 L64 80', '#d8c060');
// --- relics
I.rl_bell_clapper = (a, P) => { P.bar(64, 14, 64, 74, 8, G.iron); P.S(blob(64, 88, 20, P.R, 9, 0.1), G.iron, { depth: 10, decals: a.stain(64, 88, 14, G.rust, 0.8) }); a.raw(P.D.chain(64, 4, 64, 16, 2, G.iron)); };
I.rl_saints_finger = (a, P) => { a.limb([[34, 96], [60, 70], [84, 46], [100, 30]], [18, 16, 13, 10], { fill: '#b8a890', depth: 6, mottle: 0.6, fine: true, hatch: 110 }); P.ring(66, 66, 10, G.gold); a.raw(a.glow(64, 64, 50, '#f4ecd0', 0.3)); };
I.rl_drowned_lantern = (a, P) => { P.S(poly([[42, 40], [86, 40], [90, 100], [38, 100]]), G.iron, { depth: 8, core: false }); a.raw(`<rect x="48" y="48" width="32" height="44" fill="#a8e0d0" opacity="0.8"/>` + a.glow(64, 70, 50, '#a8e0d0', 0.6) + P.D.weed(44, 100, 18) + P.D.weed(84, 100, 14)); P.S(poly([[38, 40], [64, 20], [90, 40]]), G.iron, { depth: 4 }); };
I.rl_salt_crown = (a, P) => { P.S(poly([[26, 90], [28, 50], [44, 70], [54, 36], [64, 64], [74, 36], [84, 70], [100, 50], [102, 90]]), '#e8e4dc', { depth: 10, mottle: 0.6, decals: Array.from({ length: 20 }, () => `<rect x="${f(30 + P.R() * 68)}" y="${f(50 + P.R() * 38)}" width="2.4" height="2.4" fill="#fff" stroke="${INK}" stroke-width="0.3"/>`).join('') }); };
I.rl_hooked_heart = (a, P) => { P.S(smooth([[64, 108], [26, 70], [32, 40], [52, 34], [64, 48], [76, 34], [96, 40], [102, 70]], true, 0.6), '#8a2a20', { depth: 12, mottle: 0.6, decals: `<path d="M48 50 C54 60 52 74 60 84" stroke="#4a1210" stroke-width="2" fill="none"/>` }); a.raw(`<path d="M80 14 L80 54 C80 70 58 70 58 56" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M80 14 L80 54 C80 70 58 70 58 56" stroke="${G.steel}" stroke-width="4" fill="none" stroke-linecap="round"/>` + a.drip(70, 96, 18, 2.4)); };
I.rl_kraken_beak = (a, P) => { P.S(smooth([[24, 50], [70, 22], [108, 40], [80, 60], [94, 96], [56, 76]], true, 0.4), '#2a2420', { depth: 12, spec: ['M40 48 C56 36 74 30 92 38'], specOp: 0.4 }); };
I.rl_tidestone = (a, P) => { P.S(blob(64, 66, 38, P.R, 10, 0.2), '#3a5a5e', { depth: 16, mottle: 0.7, hl: true, hlOp: 0.3 }); a.raw([0, 8, 16].map(d => `<path d="M34 ${58 + d} q8 -6 15 0 t15 0 t15 0 t15 0" stroke="#a8d0d8" stroke-width="2" fill="none"/>`).join('')); };
I.rl_reliquary = (a, P) => { P.S(poly([[28, 50], [100, 50], [100, 106], [28, 106]]), G.goldL, { depth: 12, mottle: 0.5 }); P.S(poly([[24, 50], [64, 22], [104, 50]]), G.gold, { depth: 6 }); a.raw(`<rect x="46" y="62" width="36" height="32" fill="#1a1410"/>`); P.skull(64, 80, 12); };
I.rl_hourglass = (a, P) => { P.bar(30, 20, 98, 20, 8, G.woodD); P.bar(30, 108, 98, 108, 8, G.woodD); P.S(smooth([[38, 24], [90, 24], [68, 64], [90, 104], [38, 104], [60, 64]], true, 0.3), 'rgba(200,216,216,0.35)', { depth: 6, core: false }); a.raw(`<path d="M46 30 L82 30 L64 58 Z" fill="${G.black}"/><path d="M64 66 L64 92 M44 100 L84 100 L64 86 Z" stroke="${G.black}" fill="${G.black}" stroke-width="1.4"/><path d="M58 40 L72 74 L60 96" stroke="#e8e4dc" stroke-width="1.4" fill="none"/>`); };
I.rl_pilgrim_badge = (a, P) => { P.S(smooth([[64, 20], [94, 50], [84, 100], [64, 112], [44, 100], [34, 50]], true, 0.5), G.steelL, { depth: 8 }); a.raw(`<path d="M50 50 C56 76 72 76 78 50 M52 66 L76 66" stroke="${INK}" stroke-width="2.4" fill="none"/>`); };
I.rl_mourning_veil = (a, P) => {
  // black lace on a pinned comb: scalloped edge, a lace web, a jet bead
  P.S(smooth([[30, 22], [98, 22], [104, 34], [24, 34]], true, 0.4), '#2a2420', { depth: 4, ink: 1.1, after: Array.from({ length: 6 }, (_, i) => `<path d="M${36 + i * 12} 34 l0 6" stroke="#1c130c" stroke-width="2"/>`).join('') });
  const hem = []; for (let i = 0; i <= 10; i++) hem.push([102 - i * 8, 112 + (i % 2 ? 8 : 0)]);
  P.S(smooth([[26, 36], [102, 36], [110, 80], ...hem, [18, 80]], true, 0.4), '#1e1a1c', { depth: 10, mottle: 0.3, hatch: 60, ink: 1,
    decals: `<g stroke="#8a8078" stroke-width="0.7" fill="none" opacity="0.7">` + Array.from({ length: 6 }, (_, j) => `<path d="M${22 + j * 4} ${50 + j * 12} Q64 ${60 + j * 12} ${106 - j * 4} ${50 + j * 12}"/>`).join('') + Array.from({ length: 8 }, (_, j) => `<path d="M${30 + j * 10} 36 L${24 + j * 11} 118"/>`).join('') + '</g>' });
  a.raw('<circle cx="64" cy="28" r="5" fill="#0a0808" stroke="#1c130c" stroke-width="1"/><circle cx="62" cy="26" r="1.4" fill="#fff" opacity="0.7"/>');
};
I.rl_black_pearl = (a, P) => { P.S(smooth([[24, 74], [64, 40], [104, 74], [64, 96]], true, 0.6), '#a89a88', { depth: 10, decals: `<path d="M30 74 L98 74" stroke="${INK}" stroke-width="1"/>` }); P.S(`M50 70 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0`, '#1a1820', { depth: 8, hl: true, hlOp: 0.5, spec: ['M56 64 C58 60 62 58 66 58'] }); a.raw(a.glow(64, 70, 40, '#8a6ab8', 0.4)); };
I.rl_anchor_link = (a, P) => { a.raw(`<ellipse cx="64" cy="64" rx="24" ry="42" fill="none" stroke="${INK}" stroke-width="16"/><ellipse cx="64" cy="64" rx="24" ry="42" fill="none" stroke="${G.iron}" stroke-width="12"/><path d="M64 26 L64 102" stroke="${INK}" stroke-width="10"/><path d="M64 26 L64 102" stroke="${G.iron}" stroke-width="7"/>` + a.stain(56, 64, 16, G.rust, 0.8) + P.D.weed(80, 86, 24)); };
I.rl_eel_skin = (a, P) => { for (const dx of [-18, 18]) P.S(smooth([[64 + dx - 16, 110], [64 + dx - 18, 60], [64 + dx - 22, 30], [64 + dx - 10, 22], [64 + dx + 6, 26], [64 + dx + 16, 40], [64 + dx + 14, 110]], true, 0.5), '#3a4a3a', { depth: 10, mottle: 0.8, spec: [`M${64 + dx - 8} 40 C${64 + dx - 10} 60 ${64 + dx - 8} 80 ${64 + dx - 6} 100`], specOp: 0.4 }); };
// --- flasks (belt consumables)
I.fl_heal = (a, P) => P.bottle(64, 68, 'round', '#b83a2a', { label: true });
I.fl_fire = (a, P) => { P.bottle(64, 70, 'round', '#e8783a', { glow: '#ff8a3a' }); a.raw(P.D.flame(64, 26, 26, 8)); };
I.fl_brine = (a, P) => P.bottle(64, 68, 'tall', '#3a7a9a', { label: true });
I.fl_salts = (a, P) => { P.bottle(64, 72, 'vial', '#e8e4dc', { level: 0.8, bubbles: false }); a.raw(Array.from({ length: 10 }, () => `<rect x="${f(58 + P.R() * 12)}" y="${f(50 + P.R() * 50)}" width="3" height="3" fill="#fff" stroke="${INK}" stroke-width="0.3"/>`).join('')); };
I.fl_acid = (a, P) => { P.bottle(64, 68, 'flat', '#a8c840', { glow: EC.toxin }); a.raw(a.drip(48, 96, 20, 2.4, '#a8c840') + P.D.spores(64, 20, 20, 8)); };
I.fl_blast = (a, P) => { P.S(smooth([[36, 60], [44, 40], [84, 40], [92, 60], [92, 106], [36, 106]], true, 0.4), '#5a4632', { depth: 12, tex: 'url(#grain)', texOp: 0.6, lines: ['M36 76 L92 76', 'M36 94 L92 94'] }); a.raw(`<path d="M64 40 C70 26 80 22 90 14" stroke="${INK}" stroke-width="3" fill="none"/>` + P.D.flame(92, 16, 18, 6) + `<text x="64" y="90" font-size="16" text-anchor="middle" font-family="serif" fill="${INK}">XXX</text>`); };
I.fl_frost = (a, P) => { P.bottle(64, 70, 'vial', '#a8d8f0', { glow: EC.frost }); a.raw(P.D.icicles(50, 78, 104, 4, 14) + P.D.frost(64, 60, 18)); };
I.fl_iron = (a, P) => { P.bottle(64, 68, 'tall', '#6a5a3a', { label: true }); a.raw(`<path d="M50 80 L78 80" stroke="${G.iron}" stroke-width="4"/>`); };
I.fl_rage = (a, P) => { P.bottle(64, 68, 'round', '#6a0a0a', { glow: '#c83a2a' }); a.raw(P.D.spikes(64, 30, 3, 12, -Math.PI / 2, 1, '#8a1a12')); };
I.fl_steam = (a, P) => { P.bottle(64, 72, 'round', '#8ab0c0'); a.raw(Array.from({ length: 5 }, (_, i) => `<path d="${blob(54 + i * 6, 26 - i * 4, 10 + i * 2, P.R, 8, 0.3)}" fill="#f0f0f0" opacity="0.35" stroke="${INK}" stroke-width="0.5"/>`).join('')); };
// --- injuries
I.broken_ribs = (a, P) => { for (let i = 0; i < 4; i++) a.raw(`<path d="M64 ${30 + i * 18} C40 ${26 + i * 18} 26 ${40 + i * 18} 24 ${56 + i * 18} M64 ${30 + i * 18} C88 ${26 + i * 18} 102 ${40 + i * 18} 104 ${56 + i * 18}" stroke="${INK}" stroke-width="8" fill="none"/><path d="M64 ${30 + i * 18} C40 ${26 + i * 18} 26 ${40 + i * 18} 24 ${56 + i * 18} M64 ${30 + i * 18} C88 ${26 + i * 18} 102 ${40 + i * 18} 104 ${56 + i * 18}" stroke="${G.bone}" stroke-width="5" fill="none"/>`); P.bar(64, 20, 64, 108, 10, G.bone); a.raw(`<path d="M86 52 l6 -6 l4 10 l6 -4" stroke="${G.blood}" stroke-width="3" fill="none"/>` + a.stain(90, 56, 10, G.blood, 0.8)); };
I.festering = (a, P) => { P.S(blob(64, 64, 40, P.R, 12, 0.2), '#a8907a', { depth: 14, mottle: 0.8 }); a.raw(`<path d="M44 64 C54 56 74 56 84 64 C74 72 54 72 44 64 Z" fill="#5a1a10" stroke="${INK}" stroke-width="1.4"/>` + P.D.pustules(64, 64, 26, 9) + a.stain(64, 64, 24, '#7a8a3a', 0.6)); };
I.shaken = (a, P) => { const A = require('./anatomy')(a); A.arm({ sh: [20, 122], el: [40, 96], wr: [60, 70], fill: '#b8a088', w: 0.7 }); A.hand([60, 70], [0.6, -1], '#b8a088', 0.9); a.raw(['M88 30 q6 4 0 8 q-6 4 0 8', 'M98 46 q6 4 0 8 q-6 4 0 8', 'M80 18 q6 4 0 8'].map(d => `<path d="${d}" stroke="#1c130c" stroke-width="1.6" fill="none"/>`).join('') + P.D.drips(58, 74, 66, 2, 10, '#c8d8e0')); };
I.torn_tendon = (a, P) => { a.limb([[50, 10], [56, 60], [60, 108]], [28, 22, 18], { fill: '#b8a088', depth: 8, mottle: 0.6, hatch: 110 }); a.raw(a.gash(48, 70, 70, 76, 5, { rim: G.bloodW, dripLen: 20 })); };
// --- talents
I.tough = (a, P) => { P.S(smooth([[64, 108], [26, 70], [32, 40], [52, 34], [64, 48], [76, 34], [96, 40], [102, 70]], true, 0.6), '#8a2a20', { depth: 12 }); P.bar(26, 66, 102, 66, 10, G.iron); a.raw(a.rivet(40, 66, 2.2) + a.rivet(88, 66, 2.2)); };
I.grit = (a, P) => { P.S(smooth([[28, 60], [40, 40], [88, 40], [100, 60], [92, 92], [36, 92]], true, 0.5), '#b8a088', { depth: 10 }); a.raw(`<rect x="38" y="58" width="52" height="20" fill="${G.black}"/>` + Array.from({ length: 7 }, (_, i) => `<rect x="${40 + i * 7}" y="58" width="6" height="9" fill="${G.bone}" stroke="${INK}" stroke-width="0.6"/><rect x="${40 + i * 7}" y="69" width="6" height="9" fill="${G.bone}" stroke="${INK}" stroke-width="0.6"/>`).join('')); };
I.iron_hide = (a, P) => {
  // riveted iron plates laced over a scarred hide
  P.S(smooth([[16, 40], [60, 24], [108, 36], [112, 92], [64, 112], [20, 96]], true, 0.5), '#8a7058', { depth: 12, mottle: 0.6, hatch: 70, decals: a.gash(30, 50, 50, 70, 3) });
  for (const [x, y] of [[36, 50], [66, 44], [52, 78], [84, 72]]) P.S(poly([[x - 14, y - 12], [x + 14, y - 14], [x + 16, y + 12], [x - 12, y + 14]]), G.steelD, { depth: 6, spec: [`M${x - 10} ${y - 8} L${x + 10} ${y - 10}`], specOp: 0.5, decals: a.stain(x, y, 8, G.rust, 0.7), after: [[-9, -8], [9, -9], [10, 8], [-8, 9]].map(([dx, dy]) => a.rivet(x + dx, y + dy, 1.6)).join('') });
};
I.steady = (a, P) => { a.limb([[30, 112], [54, 82], [66, 60]], [26, 22, 18], { fill: '#b8a088', depth: 8, mottle: 0.6, hatch: 110 }); P.sword(66, 70, 70, 6, 7, G.steelL); };
I.sharp = (a, P) => { P.S(poly([[24, 84], [104, 60], [108, 74], [28, 98]]), '#6a6a62', { depth: 8, mottle: 0.8 }); P.sword(20, 56, 100, 36, 7, G.steelL); a.raw(P.D.embers(70, 56, 30, 6)); };
I.studied = (a, P) => { P.S(smooth([[16, 40], [62, 34], [64, 104], [18, 100]], true, 0.3), G.parch, { depth: 6, lines: [0, 1, 2, 3, 4].map(i => `M24 ${50 + i * 10} L56 ${48 + i * 10}`) }); P.S(smooth([[66, 34], [112, 40], [110, 100], [64, 104]], true, 0.3), G.parch, { depth: 6, lines: [0, 1, 2, 3, 4].map(i => `M72 ${48 + i * 10} L104 ${50 + i * 10}`), decals: a.stain(90, 80, 8, G.blood, 0.6) }); };
I.quick = (a, P) => {
  // a flight feather: rachis, vane with split barbs, downy base
  const vane = [[24, 112], [34, 86], [54, 56], [80, 28], [104, 12], [96, 30], [86, 56], [70, 70], [56, 86], [40, 100]];
  P.S(smooth(vane, true, 0.5), '#d8ccb0', { depth: 8, mottle: 0.5, hatch: 60, lines: Array.from({ length: 16 }, (_, i) => { const t = i / 16, x = 30 + t * 70, y = 104 - t * 88; return `M${f(x)} ${f(y)} l${f(10 - t * 4)} ${f(6 - t * 2)}`; }) });
  a.raw('<path d="M18 122 C40 92 70 52 104 12" stroke="#1c130c" stroke-width="3" fill="none"/><path d="M18 122 C40 92 70 52 104 12" stroke="#efe4c9" stroke-width="1.4" fill="none"/><path d="M72 48 l10 -2 M60 66 l10 -1" stroke="#1c130c" stroke-width="2"/>' + Array.from({ length: 8 }, (_, i) => `<path d="M${26 + i * 2} ${110 - i * 3} q-8 -4 -12 2" stroke="#c8bca0" stroke-width="1" fill="none"/>`).join(''));
};
I.cull = (a, P) => { P.bar(30, 112, 72, 24, 7, G.woodD); P.S(smooth([[70, 22], [110, 34], [118, 70], [102, 46], [76, 34]], true, 0.4), G.steelL, { depth: 4, decals: a.stain(104, 50, 8, G.blood, 0.8) }); };
// --- supplies
I.food = (a, P) => { P.S(smooth([[22, 80], [30, 54], [64, 44], [100, 54], [106, 80], [64, 92]], true, 0.6), '#b8864a', { depth: 14, mottle: 0.7, lines: ['M44 56 L50 74', 'M64 50 L66 72', 'M84 56 L80 74'] }); P.S(smooth([[60, 92], [96, 84], [110, 104], [70, 112]], true, 0.6), '#8a3a2a', { depth: 8, decals: `<circle cx="102" cy="100" r="5" fill="${G.bone}"/>` }); };
I.light = (a, P) => { P.bar(44, 118, 70, 40, 9, G.woodD); P.S(smooth([[60, 46], [80, 42], [82, 30], [60, 34]], true, 0.3), '#6a5a48', { depth: 4 }); a.raw(P.D.flame(72, 36, 44, 14) + P.D.embers(72, 10, 30, 6)); };
I.medicine = (a, P) => { P.S(smooth([[24, 56], [104, 56], [104, 104], [24, 104]], true, 0.2), '#d8ccb0', { depth: 12, mottle: 0.6, decals: `<path d="M56 64 L72 64 L72 74 L82 74 L82 88 L72 88 L72 98 L56 98 L56 88 L46 88 L46 74 L56 74 Z" fill="${G.red}"/>` }); P.bottle(92, 42, 'vial', '#c83a2a', { level: 0.6 }); };
I.tools = (a, P) => { P.bar(30, 110, 80, 40, 7, G.woodD); P.S(poly([[60, 30], [100, 50], [96, 58], [58, 40]]), G.iron, { depth: 4 }); P.bar(98, 110, 50, 48, 6, G.woodD); P.S(poly([[36, 40], [60, 40], [62, 56], [34, 56]]), G.iron, { depth: 6 }); };
I.gold = (a, P) => { for (const [x, y] of [[44, 86], [64, 78], [84, 88], [54, 64], [76, 60], [64, 44]]) P.coin(x, y, 14); };
I.ostia = (a, P) => { P.S(smooth([[40, 20], [88, 20], [96, 64], [64, 112], [32, 64]], true, 0.5), G.bone, { depth: 12, mottle: 0.6 }); a.raw(`<path d="M64 36 L64 90 M48 52 L80 52" stroke="${G.gold}" stroke-width="5"/>` + a.glow(64, 60, 40, '#f4ecd0', 0.4)); };
// --- map nodes
I.n_start = (a, P) => { P.S('M30 112 L30 50 C30 20 98 20 98 50 L98 112 Z', '#4a3a28', { depth: 12, tex: 'url(#grain)', texOp: 0.6 }); a.raw(`<path d="M64 28 L64 112" stroke="${INK}" stroke-width="2"/>` + a.rivet(56, 76, 3) + a.rivet(72, 76, 3)); };
I.n_combat = (a, P) => { P.sword(24, 104, 104, 24, 8); P.sword(104, 104, 24, 24, 8, G.steelL, { blood: true }); };
I.n_elite = (a, P) => { P.skull(64, 70, 30); P.S(poly([[34, 44], [40, 20], [52, 36], [64, 14], [76, 36], [88, 20], [94, 44]]), G.gold, { depth: 6 }); };
I.n_boss = (a, P) => { P.skull(64, 74, 32, G.bone, { glow: '#e8783a' }); for (const s of [-1, 1]) a.limb([[64 + s * 20, 46], [64 + s * 44, 26], [64 + s * 50, 6]], [14, 9, 3], { fill: G.boneD, depth: 4, hatch: 120 }); };
I.n_event = (a, P) => { P.S(smooth([[24, 30], [104, 26], [100, 104], [28, 108]], true, 0.3), G.parch, { depth: 8, mottle: 0.7 }); a.raw(`<text x="64" y="86" font-size="60" text-anchor="middle" font-family="serif" fill="${G.redD}">?</text>`); };
I.n_merchant = (a, P) => { P.S(smooth([[40, 50], [88, 50], [102, 96], [64, 112], [26, 96]], true, 0.6), G.leather, { depth: 14, mottle: 0.7 }); P.line(42, 52, 86, 52, 3, G.parchD); P.coin(64, 36, 12); P.coin(86, 30, 10); };
I.n_shrine = (a, P) => { P.S(poly([[28, 70], [100, 70], [96, 112], [32, 112]]), '#6a6458', { depth: 10, mottle: 0.8 }); for (const x of [44, 64, 84]) { P.S(poly([[x - 5, 50], [x + 5, 50], [x + 5, 70], [x - 5, 70]]), '#d8ccb0', { depth: 3, core: false }); a.raw(P.D.flame(x, 50, 18, 5)); } };
I.n_camp = (a, P) => { for (const [x1, x2] of [[30, 98], [98, 30]]) P.bar(x1, 106, x2, 92, 8, G.woodD); a.raw(P.D.flame(64, 100, 60, 22) + P.D.embers(64, 40, 40, 10)); };
I.n_hidden = (a, P) => { P.S(poly([[24, 60], [104, 60], [100, 106], [28, 106]]), G.woodD, { depth: 10, tex: 'url(#grain)', texOp: 0.6 }); P.S('M24 60 C24 30 104 30 104 60 Z', G.wood, { depth: 8, tex: 'url(#grain)', texOp: 0.6 }); P.bar(24, 60, 104, 60, 6, G.iron); a.raw(a.rivet(64, 70, 4) + a.glow(64, 58, 30, '#f4d27a', 0.6)); };
I.n_waypoint = (a, P) => { P.S(poly([[64, 18], [108, 104], [20, 104]]), '#8a7a5a', { depth: 14, mottle: 0.7, tex: 'url(#weave)', texOp: 0.4 }); a.raw(`<path d="M64 52 L52 104 L76 104 Z" fill="${G.black}"/>` + a.glow(64, 92, 24, '#f4d27a', 0.6)); };
I.n_forge = (a, P) => { P.S(poly([[20, 50], [100, 50], [110, 60], [76, 66], [72, 90], [88, 106], [40, 106], [56, 90], [52, 66], [18, 60]]), G.iron, { depth: 10, spec: ['M24 52 L96 52'] }); a.raw(P.D.embers(70, 46, 30, 8)); };
// --- intents
I.i_attack = I.n_combat;
I.i_defend = (a, P) => P.shield(64, 64, 1.3, G.steelD);
I.i_heal = (a, P) => { P.S(smooth([[64, 108], [24, 66], [30, 34], [52, 28], [64, 44], [76, 28], [98, 34], [104, 66]], true, 0.6), '#a83a2a', { depth: 12 }); a.raw(`<path d="M56 54 L72 54 L72 62 L80 62 L80 74 L72 74 L72 82 L56 82 L56 74 L48 74 L48 62 L56 62 Z" fill="${G.parch}" stroke="${INK}" stroke-width="1"/>`); };
I.i_debuff = (a, P) => { P.skull(64, 70, 30); P.bar(64, 6, 64, 54, 6, G.iron); a.raw(`<path d="M58 6 L70 6" stroke="#1c130c" stroke-width="5"/>` + a.drip(56, 96, 22, 2.4, G.black) + a.drip(72, 98, 16, 2, G.black) + P.D.motes(64, 70, 40, 8, '#2a1a3a')); };
I.i_buff = (a, P) => {
  // a clenched fist seen from the front: wrist wrap, four knuckle ridges, the thumb locked across
  P.S(smooth([[46, 122], [44, 92], [84, 92], [86, 122]], true, 0.3), '#6e4e34', { depth: 6, tex: 'url(#weave)', texOp: 0.5, lines: [0, 1, 2].map(i => `M44 ${98 + i * 8} L86 ${96 + i * 8}`) });
  P.S(smooth([[34, 52], [42, 34], [60, 28], [80, 30], [94, 42], [98, 62], [90, 92], [42, 94], [32, 74]], true, 0.5), '#c0a48a', { depth: 14, mottle: 0.6, hatch: 120,
    decals: a.stain(70, 70, 12, G.bruise, 0.5) + `<g stroke="#5a3a52" stroke-width="1" fill="none" opacity="0.7"><path d="M56 92 C58 80 54 74 58 66"/><path d="M74 92 C72 82 76 76 72 70"/></g>` });
  for (let i = 0; i < 4; i++) { const x = 40 + i * 14; P.S(smooth([[x, 46], [x + 6, 30 + Math.abs(i - 1.5) * 3], [x + 14, 32 + Math.abs(i - 1.5) * 3], [x + 15, 52], [x + 8, 56]], true, 0.6), '#c8ac92', { depth: 6, mottle: 0.5, ink: 1.1, lines: [`M${x + 3} ${44} L${x + 13} ${44}`] }); }
  P.S(smooth([[30, 66], [46, 56], [74, 58], [86, 66], [70, 72], [40, 76]], true, 0.5), '#b8987e', { depth: 6, ink: 1.2, lines: ['M70 62 L82 66'] });
  a.raw('<path d="M50 30 l2 -6 M64 26 l0 -7 M78 28 l2 -6" stroke="#1c130c" stroke-width="1.4" opacity="0.6"/>');
};
// --- statuses
I.s_block = (a, P) => P.shield(64, 64, 1.3, G.steelD);
I.s_armor = (a, P) => { P.S(smooth([[30, 70], [34, 30], [64, 18], [94, 30], [98, 70], [86, 104], [42, 104]], true, 0.5), G.steelD, { depth: 14, spec: ['M44 34 C54 26 74 26 84 34'] }); a.raw(`<path d="M34 60 L94 60 L94 70 L34 70 Z" fill="${G.black}"/><path d="M64 30 L64 100" stroke="${INK}" stroke-width="1.4"/>`); };
I.s_ward = (a, P) => { a.raw(a.glow(64, 64, 56, '#b8a0e0', 0.5) + `<circle cx="64" cy="64" r="44" fill="none" stroke="#5a4a7a" stroke-width="5"/><circle cx="64" cy="64" r="36" fill="none" stroke="#e0d0ff" stroke-width="2"/>` + Array.from({ length: 8 }, (_, i) => { const t = i / 8 * 6.28; return `<text x="${f(64 + Math.cos(t) * 40)}" y="${f(64 + Math.sin(t) * 40 + 4)}" font-size="11" text-anchor="middle" font-family="serif" fill="#e0d0ff">${'ᚠᚢᚦᚨᚱᚲᚷᚹ'[i]}</text>`; }).join('')); };
I.s_bleed = (a, P) => { P.drop(52, 64, 18, '#8a1a12'); P.drop(84, 80, 12, '#8a1a12'); };
I.s_stun = (a, P) => { P.S(smooth([[30, 76], [34, 40], [64, 26], [94, 40], [98, 76]], true, 0.5), G.steelD, { depth: 12 }); a.raw(`<path d="M60 28 l-6 16 l10 8 l-8 16" stroke="${INK}" stroke-width="2.4" fill="none"/>` + [0, 1, 2].map(i => { const x = 34 + i * 30, y = 104 - (i % 2) * 8; return `<path d="M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2} Z" fill="#f4dc78" stroke="${INK}" stroke-width="0.8"/>`; }).join('')); };
I.s_mark = (a, P) => a.raw(`<circle cx="64" cy="64" r="40" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="64" cy="64" r="40" fill="none" stroke="#c83a2a" stroke-width="4"/><circle cx="64" cy="64" r="20" fill="none" stroke="#c83a2a" stroke-width="3"/><path d="M14 64 L114 64 M64 14 L64 114" stroke="#c83a2a" stroke-width="3"/>`);
I.s_vulnerable = (a, P) => { P.shield(64, 64, 1.2, G.steelD); a.raw(`<path d="M62 18 l-8 20 l14 10 l-10 22 l12 14 l-8 22" stroke="${G.black}" stroke-width="4" fill="none"/>`); };
I.s_might = I.i_buff;
I.s_focus = (a, P) => { a.raw(`<path d="M16 64 C36 32 92 32 112 64 C92 96 36 96 16 64 Z" fill="#e8dcc0" stroke="${INK}" stroke-width="3"/><circle cx="64" cy="64" r="18" fill="#c8a040" stroke="${INK}" stroke-width="2"/><circle cx="64" cy="64" r="8" fill="${G.black}"/><circle cx="58" cy="58" r="3" fill="#fff"/>`); };
I.s_momentum = (a, P) => a.raw([0, 1, 2].map(i => `<path d="M${24 + i * 22} 30 L${56 + i * 22} 64 L${24 + i * 22} 98" stroke="${INK}" stroke-width="13" fill="none"/><path d="M${24 + i * 22} 30 L${56 + i * 22} 64 L${24 + i * 22} 98" stroke="${G.goldL}" stroke-width="8" fill="none"/>`).join(''));
I.s_riposte = (a, P) => { P.sword(20, 100, 100, 20, 7); P.sword(108, 92, 40, 28, 6, G.steelL, { blood: true }); };
I.s_thorns = (a, P) => { a.raw(`<path d="M10 70 C30 40 50 100 70 60 C86 30 104 70 118 50" stroke="${INK}" stroke-width="10" fill="none"/><path d="M10 70 C30 40 50 100 70 60 C86 30 104 70 118 50" stroke="#4a5a2a" stroke-width="6" fill="none"/>` + P.D.spikes(30, 56, 3, 14, -1.2, 2, '#d8ccaa') + P.D.spikes(70, 60, 3, 14, 1.4, 2, '#d8ccaa') + P.D.spikes(100, 54, 3, 14, -1.4, 2, '#d8ccaa')); };
I.s_dodge = (a, P) => {
  // a cloak whipped aside; the blade passes through where the body was
  P.cloth([[22, 40], [50, 22], [86, 30], [108, 60], [96, 92], [104, 112], [80, 102], [70, 116], [58, 98], [40, 104], [44, 80], [28, 70]], '#3a3430', { decals: a.fold(40, 40, 54, 100, 6) + a.fold(70, 34, 78, 104, 6) + a.fold(90, 54, 92, 100, 5) });
  P.sword(8, 104, 112, 26, 8, G.steelL);
  a.raw(['M14 58 C30 50 40 52 54 46', 'M10 74 C26 66 38 68 50 62', 'M18 90 C30 84 40 84 48 80'].map(d => `<path d="${d}" stroke="#e8dcc0" stroke-width="1.6" fill="none" opacity="0.7"/>`).join(''));
};
I.s_regen = (a, P) => { a.raw(`<path d="M64 110 C60 80 66 60 64 30" stroke="${INK}" stroke-width="7" fill="none"/><path d="M64 110 C60 80 66 60 64 30" stroke="#5a7a3a" stroke-width="4" fill="none"/>`); P.S('M64 60 C40 60 30 40 34 26 C50 26 64 40 64 60 Z', '#7a9a4a', { depth: 6 }); P.S('M64 46 C84 46 96 30 94 16 C78 16 64 28 64 46 Z', '#7a9a4a', { depth: 6 }); a.raw(a.glow(64, 64, 40, '#c8e080', 0.3)); };
I.s_hex = I.w_rag_poppet;
I.s_doom = (a, P) => { I.rl_hourglass(a, P); P.skull(64, 92, 10); };
I.s_taunt = (a, P) => {
  // a war horn on its baldric, bell toward the foe
  P.S(smooth([[24, 40], [40, 34], [70, 50], [96, 76], [114, 102], [92, 112], [76, 88], [52, 62], [30, 52]], true, 0.5), G.bone, { depth: 10, mottle: 0.5, hatch: 60, lines: [{ d: 'M40 44 C60 54 80 74 100 98', w: 0.7 }], decals: a.stain(60, 60, 8, G.umber, 0.5) });
  P.S(smooth([[90, 94], [118, 88], [124, 112], [98, 118]], true, 0.6), '#3a2a20', { depth: 6, ink: 1.2 });
  for (const x of [44, 74]) P.bar(x, 38 + (x - 44) * 0.7, x - 6, 58 + (x - 44) * 0.8, 6, G.goldL);
  a.raw('<path d="M44 40 C48 10 86 8 76 52" stroke="#1c130c" stroke-width="5" fill="none"/><path d="M44 40 C48 10 86 8 76 52" stroke="#6e4e34" stroke-width="3" fill="none"/>');
};
I.s_fortify = (a, P) => { P.S(poly([[34, 112], [34, 40], [44, 40], [44, 30], [54, 30], [54, 40], [74, 40], [74, 30], [84, 30], [84, 40], [94, 40], [94, 112]]), '#7a766a', { depth: 12, mottle: 0.8, lines: [0, 1, 2, 3].map(i => `M34 ${56 + i * 14} L94 ${56 + i * 14}`) }); a.raw(`<path d="M56 112 L56 84 C56 74 72 74 72 84 L72 112 Z" fill="${G.black}"/>`); };
I.s_anchor = (a, P) => { a.raw(`<path d="M64 22 L64 106 M40 40 L88 40 M24 76 C30 100 52 110 64 106 C76 110 98 100 104 76" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M64 22 L64 106 M40 40 L88 40 M24 76 C30 100 52 110 64 106 C76 110 98 100 104 76" stroke="${G.iron}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="64" cy="16" r="8" fill="none" stroke="${INK}" stroke-width="5"/>` + a.stain(60, 80, 12, G.rust, 0.8)); };
I.s_freeze = (a, P) => { P.S(poly([[24, 34], [96, 24], [108, 94], [34, 106]]), '#cfe6f4', { fillOp: 0.85, depth: 10, hl: true, hlOp: 0.4, spec: ['M32 40 L50 38'] }); a.raw(P.D.frost(66, 66, 28) + `<path d="M40 60 L70 80 M60 40 L90 70" stroke="#fff" stroke-width="1.4" opacity="0.8"/>`); };
I.s_neuro = (a, P) => { a.raw(`<path d="M20 64 L44 64 L52 40 L64 90 L74 30 L84 76 L92 64 L110 64" stroke="${INK}" stroke-width="8" fill="none" stroke-linejoin="round"/><path d="M20 64 L44 64 L52 40 L64 90 L74 30 L84 76 L92 64 L110 64" stroke="#c8e080" stroke-width="4" fill="none" stroke-linejoin="round"/>` + a.glow(64, 64, 40, EC.toxin, 0.3)); };
I.s_silence = (a, P) => { P.S(smooth([[20, 64], [40, 46], [88, 46], [108, 64], [88, 82], [40, 82]], true, 0.6), '#b8a088', { depth: 10 }); a.raw(`<path d="M28 64 L100 64" stroke="${G.bloodD}" stroke-width="3"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${34 + i * 9} 54 L${38 + i * 9} 74" stroke="${INK}" stroke-width="2.2"/>`).join('')); };
I.s_blight = (a, P) => { a.raw(`<path d="M64 112 C60 90 66 70 64 56" stroke="${INK}" stroke-width="6" fill="none"/><path d="M64 112 C60 90 66 70 64 56" stroke="#3a3a2a" stroke-width="3" fill="none"/>`); for (let i = 0; i < 6; i++) { const t = i / 6 * 6.28; P.S(smooth([[64, 44], [64 + Math.cos(t) * 30, 44 + Math.sin(t) * 26], [64 + Math.cos(t + 0.5) * 22, 44 + Math.sin(t + 0.5) * 20]], true, 0.7), '#1e1a1c', { depth: 6, core: false }); } a.raw(P.D.motes(64, 44, 30, 8)); };
I.s_lockdown = (a, P) => { P.S(smooth([[38, 56], [90, 56], [92, 110], [36, 110]], true, 0.2), G.iron, { depth: 10 }); a.raw(`<path d="M46 56 C46 22 82 22 82 56" stroke="${INK}" stroke-width="10" fill="none"/><path d="M46 56 C46 22 82 22 82 56" stroke="${G.steel}" stroke-width="6" fill="none"/><circle cx="64" cy="82" r="14" fill="#efe4c9" stroke="${INK}" stroke-width="1.6"/><path d="M64 82 L64 72 M64 82 L71 85" stroke="${INK}" stroke-width="2"/>` + P.D.icicles(40, 88, 110, 5, 10)); };
I.s_stress = (a, P) => {
  // a head split by dread: mouth open, eye milky, a crack running from the crown, black fumes leaving it
  const A = require('./anatomy')(a);
  A.head({ x: 70, y: 70, k: 0.74, skin: '#b8a690', style: 'gaunt', jaw: 0.8, eye: 'milky' });
  a.raw(P.D.crack ? '' : '');
  a.raw('<path d="M70 26 L64 38 L72 46 L62 60" stroke="#1c130c" stroke-width="2.4" fill="none"/><path d="M70 14 L64 30 L72 40 L62 60" stroke="#3a1a3a" stroke-width="1" fill="none"/>' + P.D.motes(72, 18, 30, 14, '#1a0e24') + `<g filter="url(#rough)"><path d="M70 14 C60 4 82 -2 72 -12" stroke="#1a0e24" stroke-width="6" fill="none" opacity="0.6"/></g>`);
};
// --- elements
for (const el of Object.keys(EC)) I['e_' + el] = (a, P) => a.raw(a.glow(64, 64, 60, EC[el], 0.45) + `<circle cx="64" cy="64" r="48" fill="#efe4c9" opacity="0.9"/>` + sig(el, 64, 64, 48, COL[el], 3));

// ------------------------------------------------------------------ render
const only = process.argv.slice(2);
let n = 0;
for (const [id, fn] of Object.entries(I)) {
  if (only.length && !only.includes(id)) continue;
  let seed = 0; for (const c of id) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const a = new Art(N, N, seed % 9999 + 1), P = kit(a);
  a.raw(`<ellipse cx="64" cy="116" rx="40" ry="6" fill="${G.umber}" opacity="0.25"/>`);
  fn(a, P);
  fs.writeFileSync(`grim/icons/${id}.svg`, a.svg());
  n++;
}
console.log('icons', n);
module.exports = { ICONS: Object.keys(I) };
