const { S, C } = require('./ms_style');
const fs = require('fs');
const INK = S.ink;
const wrap = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="110" viewBox="0 0 200 110"><defs>${S.defs}</defs><g filter="url(#wob)"><rect width="200" height="110" fill="${C.parch}"/>${body}<rect x="1.5" y="1.5" width="197" height="107" fill="none" stroke="${INK}" stroke-width="3"/></g></svg>`;
// Toxin: a toad drollery exhaling a green miasma over a cracked flagon
const toxin = wrap(`<rect width="200" height="110" fill="${C.green}" opacity="0.2"/>` +
  `<path d="M0 92 L200 92" stroke="${INK}" stroke-width="2"/><rect y="92" width="200" height="18" fill="url(#h45w)" opacity="0.6"/>` +
  `<path d="M40 92 C36 70 52 56 72 58 C88 56 100 68 96 92 Z" fill="${C.green}" stroke="${INK}" stroke-width="2"/><path d="M76 58 C90 58 100 70 96 92 L84 92 C88 76 84 64 76 58 Z" fill="url(#h45)"/>` +
  `<circle cx="58" cy="60" r="6" fill="${C.bone}" stroke="${INK}" stroke-width="1.6"/><circle cx="60" cy="60" r="2.4" fill="${INK}"/><circle cx="76" cy="58" r="6" fill="${C.bone}" stroke="${INK}" stroke-width="1.6"/><circle cx="78" cy="58" r="2.4" fill="${INK}"/>` +
  `<path d="M48 74 C58 80 74 80 84 74" fill="none" stroke="${INK}" stroke-width="1.8"/>` +
  `<path d="M90 70 C110 60 120 70 138 58 C150 50 162 60 176 48 C184 42 192 46 196 40" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M90 70 C110 60 120 70 138 58 C150 50 162 60 176 48 C184 42 192 46 196 40" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>` +
  `<g fill="${C.greenD}" stroke="${INK}" stroke-width="1"><circle cx="128" cy="40" r="4"/><circle cx="150" cy="32" r="3"/><circle cx="170" cy="26" r="5"/><circle cx="114" cy="50" r="2.5"/></g>` +
  `<path d="M140 92 L142 74 C136 70 138 62 146 62 L156 62 C164 62 166 70 160 74 L162 92 Z" fill="${C.steel}" stroke="${INK}" stroke-width="1.8"/><path d="M150 66 L148 78 L154 84" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
// Void: a doorway opening onto nothing, edges unravelling into threads, a hand reaching out
const voidc = wrap(`<rect width="200" height="110" fill="${C.violet}" opacity="0.22"/>` +
  `<path d="M70 100 L70 40 C70 16 130 16 130 40 L130 100 Z" fill="${C.ink}" stroke="${INK}" stroke-width="2.4"/>` +
  `<path d="M60 100 L60 38 C60 6 140 6 140 38 L140 100" fill="none" stroke="${INK}" stroke-width="3"/><path d="M60 100 L60 38 C60 6 140 6 140 38 L140 100" fill="none" stroke="${C.gold}" stroke-width="1.6" stroke-dasharray="3 4"/>` +
  `<g fill="none" stroke="#f7eedb" stroke-width="1.1" opacity="0.8"><circle cx="100" cy="56" r="10"/><circle cx="100" cy="56" r="20"/><circle cx="100" cy="56" r="30" stroke-dasharray="3 5"/></g>` +
  `<path d="M70 60 C56 58 48 66 36 60 M70 80 C58 84 46 78 34 86 M130 60 C146 56 152 64 166 58 M130 82 C144 86 154 80 168 88" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>` +
  `<path d="M100 96 C96 86 98 78 104 74 L108 66 L110 76 L116 70 L114 80 C116 86 112 94 108 96 Z" fill="${C.bone}" stroke="${INK}" stroke-width="1.6"/>`);
// Physical defence: a kite shield bearing a door, crossed with a mace, ringed by laurels
const shield = wrap(`<rect width="200" height="110" fill="${C.azure}" opacity="0.18"/>` +
  `<path d="M40 20 L64 92 M160 20 L136 92" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M40 20 L64 92 M160 20 L136 92" stroke="${C.brown}" stroke-width="3" stroke-linecap="round"/>` +
  `<circle cx="38" cy="16" r="9" fill="${C.steel}" stroke="${INK}" stroke-width="1.8"/><circle cx="162" cy="16" r="9" fill="${C.steel}" stroke="${INK}" stroke-width="1.8"/>` +
  `<path d="M70 14 L130 14 L130 52 C130 80 108 96 100 102 C92 96 70 80 70 52 Z" fill="${C.red}" stroke="${INK}" stroke-width="2.4"/><path d="M114 14 L130 14 L130 52 C130 80 108 96 100 102 C108 86 114 70 114 52 Z" fill="url(#h45)"/>` +
  `<path d="M90 78 L90 46 C90 34 110 34 110 46 L110 78 Z" fill="${C.gold}" stroke="${INK}" stroke-width="1.8"/><path d="M95 78 L95 48 C95 42 105 42 105 48 L105 78 Z" fill="${INK}"/>` +
  `<path d="M60 100 C40 90 30 70 34 50 M140 100 C160 90 170 70 166 50" fill="none" stroke="${C.greenD}" stroke-width="2.4"/>` +
  `<g fill="${C.green}" stroke="${INK}" stroke-width="1">${[[36, 60], [40, 76], [50, 90], [164, 60], [160, 76], [150, 90]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" transform="rotate(${x < 100 ? -40 : 40} ${x} ${y})"/>`).join('')}</g>`);
// Physical attack: a rapier lunge through a hare drollery's hat (the hare, unbothered)
const blade = wrap(`<rect width="200" height="110" fill="${C.red}" opacity="0.12"/>` +
  `<path d="M0 94 L200 94" stroke="${INK}" stroke-width="2"/>` +
  `<path d="M120 94 C116 76 124 60 140 58 C156 56 166 70 162 94 Z" fill="${C.bone}" stroke="${INK}" stroke-width="2"/>` +
  `<path d="M134 60 C130 40 132 22 138 18 C144 22 144 42 140 58 M146 58 C148 38 154 24 160 22 C164 28 158 46 150 60" fill="${C.bone}" stroke="${INK}" stroke-width="1.8"/>` +
  `<circle cx="132" cy="70" r="2" fill="${INK}"/><path d="M122 74 L118 72 M122 76 L117 77" stroke="${INK}" stroke-width="1"/>` +
  `<path d="M122 52 L170 40 L172 46 L126 58 Z" fill="${C.green}" stroke="${INK}" stroke-width="1.8"/>` +
  `<path d="M14 62 L186 34" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M14 62 L186 34" stroke="${C.steel}" stroke-width="2.4" stroke-linecap="round"/>` +
  `<path d="M12 56 C4 62 8 74 18 70 M22 52 L26 72" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="M12 56 C4 62 8 74 18 70 M22 52 L26 72" fill="none" stroke="${C.gold}" stroke-width="2.2" stroke-linecap="round"/>` +
  `<path d="M60 40 C70 34 80 32 92 32 M50 70 C62 72 74 70 86 66" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="4 4"/>`);
fs.writeFileSync('src/ms_card_toxin.svg', toxin);
fs.writeFileSync('src/ms_card_void.svg', voidc);
fs.writeFileSync('src/ms_card_shield.svg', shield);
fs.writeFileSync('src/ms_card_blade.svg', blade);
