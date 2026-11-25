const { build } = require('./lib');
const { S, C } = require('./ms_style');
const fs = require('fs');
// Manuscript Drowned Thrall: a bloated drowned sailor drollery. Sou'wester hat, kelp hair, gaping mouth,
// striped shirt torn, rope belt, boat hook held two-handed, barnacles on shoulder, bare webbed feet. Faces left.
const barn = (x, y, r) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.bone}" stroke="${S.ink}" stroke-width="1.1"/><circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="${S.ink}"/></g>`;
const parts = [
  `<ellipse cx="150" cy="346" rx="84" ry="8" fill="url(#h45w)" opacity="0.8"/>`,
  // boat hook shaft (behind hands)
  { d: 'M58 40 L66 40 L84 340 L76 340 Z', fill: C.brown, shade: 'M62 40 L66 40 L84 340 L80 340 Z', lines: ['M64 120 L72 119', 'M70 220 L78 219'] },
  { d: 'M54 44 C42 40 36 26 44 16 C50 8 62 10 64 18 L58 22 C56 16 50 16 48 22 C46 30 52 36 60 36 Z', fill: C.steel, ink: 2 },
  { d: 'M58 36 L68 36 L68 48 L58 48 Z', fill: C.steelD, ink: 1.6 },
  // legs (trousers rolled) + webbed feet
  { d: 'M116 244 L144 244 L140 312 L114 312 Z', fill: C.azureD, shade: 'M134 244 L144 244 L140 312 L132 312 Z', lines: ['M118 300 L140 300'] },
  { d: 'M156 244 L184 244 L188 312 L160 312 Z', fill: C.azureD, shade: 'M176 244 L184 244 L188 312 L180 312 Z', lines: ['M160 300 L186 300'] },
  { d: 'M114 310 L140 310 L138 330 L144 345 L96 345 C98 336 106 330 114 326 Z', fill: C.teal, ink: 2, lines: ['M112 334 L104 345', 'M124 334 L120 345'] },
  { d: 'M160 310 L188 310 L192 328 L204 345 L156 345 Z', fill: C.teal, ink: 2, lines: ['M176 332 L180 345', 'M188 332 L194 345'] },
  // bloated torso: striped shirt, torn
  { d: 'M110 128 C100 150 96 190 104 222 C110 244 130 252 150 252 C170 252 190 244 196 222 C204 190 200 150 190 128 C176 118 124 118 110 128 Z', fill: C.bone,
    shade: 'M176 122 C186 124 190 128 190 128 C200 150 204 190 196 222 C192 236 184 244 174 248 C186 220 188 170 176 122 Z' },
  `<g fill="none" stroke="${C.redD}" stroke-width="5">${[140, 158, 176, 194, 212, 230].map(y => `<path d="M104 ${y} C130 ${y + 5} 170 ${y + 5} 198 ${y}"/>`).join('')}</g>`,
  { d: 'M110 128 C100 150 96 190 104 222 C110 244 130 252 150 252 C170 252 190 244 196 222 C204 190 200 150 190 128 C176 118 124 118 110 128 Z', fill: 'none', ink: 2.2 },
  { d: 'M140 190 L152 182 L160 196 L154 212 L142 206 Z', fill: '#a7c0b0', ink: 1.6, lines: ['M146 196 L154 198'] },
  { d: 'M104 224 C126 234 176 234 198 224 L198 234 C176 244 126 244 104 234 Z', fill: C.brown, ink: 1.6, lines: ['M120 230 L118 238', 'M140 233 L139 241', 'M164 233 L165 241', 'M184 230 L186 238'] },
  // kelp draped on shoulders
  `<path d="M120 126 C114 150 124 170 116 196 M182 126 C190 150 178 172 186 200" fill="none" stroke="${S.ink}" stroke-width="6" stroke-linecap="round"/><path d="M120 126 C114 150 124 170 116 196 M182 126 C190 150 178 172 186 200" fill="none" stroke="${C.greenD}" stroke-width="3.4" stroke-linecap="round"/>`,
  barn(186, 132, 4.5), barn(196, 144, 3), barn(110, 150, 3.5),
  // head: grey-green bloated face, gaping mouth, kelp hair, sou'wester
  { d: 'M116 120 C108 102 112 70 132 58 C150 48 176 56 184 74 C192 92 188 114 176 124 C160 132 130 132 116 120 Z', fill: '#a7c0b0',
    shade: 'M170 62 C182 70 188 82 188 96 C188 110 182 120 176 124 C170 126 164 128 158 129 C176 112 178 84 170 62 Z', lines: ['M140 112 C148 116 158 116 166 112'] },
  { d: 'M118 98 C120 92 132 90 140 94 C144 104 138 114 128 116 C120 116 116 108 118 98 Z', fill: C.redD, ink: 1.8 },
  `<path d="M122 96 L124 100 L127 95 L130 100 L133 95 L136 99" fill="none" stroke="${C.bone}" stroke-width="1.6"/>`,
  `<circle cx="132" cy="78" r="7" fill="${C.bone}" stroke="${S.ink}" stroke-width="1.6"/><circle cx="130" cy="79" r="2.2" fill="${S.ink}"/><circle cx="154" cy="76" r="5.5" fill="${C.bone}" stroke="${S.ink}" stroke-width="1.6"/><circle cx="152" cy="77" r="1.8" fill="${S.ink}"/>`,
  `<path d="M124 70 C128 68 136 68 140 70 M148 68 C152 66 158 66 160 68" fill="none" stroke="${S.ink}" stroke-width="1.6" stroke-linecap="round"/>`,
  `<path d="M176 74 C186 90 180 110 190 126 M184 66 C196 82 192 104 200 118" fill="none" stroke="${S.ink}" stroke-width="5" stroke-linecap="round"/><path d="M176 74 C186 90 180 110 190 126 M184 66 C196 82 192 104 200 118" fill="none" stroke="${C.greenD}" stroke-width="2.6" stroke-linecap="round"/>`,
  { d: 'M112 66 C110 40 134 26 156 28 C178 30 196 44 196 66 C176 58 132 58 112 66 Z', fill: C.gold, shade: 'M170 32 C186 38 196 50 196 66 C188 63 180 61 172 60 C176 52 176 42 170 32 Z', lines: ['M130 40 C150 36 170 38 186 46'] },
  { d: 'M100 70 C120 58 180 58 212 74 C210 82 200 84 190 80 C164 70 132 70 108 78 C100 80 96 76 100 70 Z', fill: C.gold, shade: 'M108 78 C132 70 164 70 190 80 C200 84 210 82 212 74 C208 86 196 90 184 86 C160 78 132 78 112 84 Z', shade2: '' },
  barn(170, 44, 3.5),
  // arms gripping hook (front low, back high)
  { d: 'M116 134 C100 140 88 156 80 174 L94 182 C100 166 110 154 122 148 Z', fill: C.bone, shade: 'M80 174 L94 182 C96 176 98 170 102 166 L88 160 C84 164 82 168 80 174 Z', after: `<path d="M98 146 L92 160 M106 142 L100 156" stroke="${C.redD}" stroke-width="4"/>` },
  { d: 'M64 168 C64 158 86 158 88 168 L86 186 C80 192 68 192 64 186 Z', fill: '#a7c0b0', shade: 'M80 160 L88 168 L86 186 L80 190 Z', lines: ['M66 174 L86 174', 'M66 180 L86 180'] },
  { d: 'M186 134 C176 170 140 200 92 214 L88 200 C130 190 164 166 172 130 Z', fill: C.bone, shade: 'M92 214 C140 200 176 170 186 134 L180 132 C170 164 134 192 90 206 Z' },
  { d: 'M68 204 C68 194 90 194 92 204 L90 222 C84 228 72 228 68 222 Z', fill: '#a7c0b0', shade: 'M84 196 L92 204 L90 222 L84 226 Z', lines: ['M70 210 L90 210', 'M70 216 L90 216'] },
  `<g fill="${C.azure}" stroke="${S.ink}" stroke-width="0.9"><path d="M106 256 C110 262 110 266 106 266 C102 266 102 262 106 256 Z"/><path d="M196 250 C200 256 200 260 196 260 C192 260 192 256 196 250 Z"/></g>`,
];
fs.writeFileSync(process.argv[2] || 'src/ms_thrall.svg', build(300, 360, S, parts, { filter: 'url(#wob)' }));
