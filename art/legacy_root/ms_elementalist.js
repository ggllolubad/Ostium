const { build } = require('./lib');
const { S, C } = require('./ms_style');
const fs = require('fs');
// Manuscript Elementalist: hooded magus, long beard, azure star-strewn robe, violet mantle with gold clasp,
// astrolabe staff, girdle book, flame cupped in the off hand, water / frost / lightning roundels in orbit.
const star = (x, y, r) => `M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`;
const parts = [
  `<ellipse cx="156" cy="346" rx="86" ry="8" fill="url(#h45w)" opacity="0.8"/>`,
  // orbit trail
  `<path d="M60 172 C40 210 70 250 120 250 M236 120 C270 110 276 76 250 62" fill="none" stroke="${S.ink}" stroke-width="1" stroke-dasharray="2 5" stroke-linecap="round"/>`,
  // staff (behind hand)
  { d: 'M218 44 L226 44 L229 344 L220 344 Z', fill: C.brown, shade: 'M223 44 L226 44 L229 344 L225 344 Z', lines: ['M219 120 L227 118', 'M220 220 L228 218', 'M220 290 L228 288'] },
  `<circle cx="222" cy="30" r="17" fill="none" stroke="${S.ink}" stroke-width="5.5"/><circle cx="222" cy="30" r="17" fill="none" stroke="${C.gold}" stroke-width="3"/>`,
  `<circle cx="222" cy="30" r="10" fill="none" stroke="${S.ink}" stroke-width="1.3"/><path d="M205 30 L239 30 M222 13 L222 47 M210 18 L234 42" stroke="${S.ink}" stroke-width="1.2"/>`,
  `<circle cx="222" cy="30" r="4.5" fill="${C.azure}" stroke="${S.ink}" stroke-width="1.3"/>`,
  { d: 'M216 46 L228 46 L226 54 L218 54 Z', fill: C.gold, ink: 1.3 },
  // back arm (behind body): sleeve, hand with flame
  { d: 'M128 106 C112 116 100 132 92 150 L84 172 L112 170 C114 152 120 138 130 128 Z', fill: C.azure, shade: 'M84 172 L112 170 C112 162 114 156 116 150 L92 152 Z',
    lines: ['M108 126 C104 140 100 154 98 168'] },
  { d: 'M78 150 C82 142 98 142 102 148 L100 158 C94 162 84 162 78 158 Z', fill: C.flesh, shade: 'M78 154 L100 156 C94 162 84 162 78 158 Z', lines: ['M84 150 L84 156', 'M90 149 L90 156', 'M96 150 L96 156'] },
  { d: 'M90 144 C100 132 100 118 92 104 C90 116 82 124 84 134 C86 140 88 143 90 144 Z', fill: C.red, shade: 'M92 104 C100 118 100 132 90 144 C94 132 96 120 92 104 Z', shadeFill: C.redD },
  { d: 'M90 142 C95 134 95 126 91 120 C89 128 86 132 87 138 Z', fill: C.gold, ink: 1 },
  // robe
  { d: 'M122 104 L178 104 C186 160 200 250 216 336 C180 344 136 344 94 336 C106 250 116 160 122 104 Z', fill: C.azure,
    shade: 'M168 104 L178 104 C186 160 200 250 216 336 C206 338 196 340 186 340 C184 250 176 170 168 104 Z', shade2: 'M196 280 C200 300 206 318 216 336 C208 338 200 339 192 340 Z',
    lines: ['M136 200 C132 250 126 300 118 338', 'M152 210 C152 260 150 300 150 340', 'M168 210 C172 260 176 300 182 340', 'M118 300 C124 308 128 320 126 338'] },
  `<g fill="${C.gold}" stroke="${S.ink}" stroke-width="0.8"><path d="${star(130, 250, 5)}"/><path d="${star(164, 274, 5)}"/><path d="${star(140, 304, 4.5)}"/><path d="${star(182, 310, 4.5)}"/><path d="${star(120, 290, 4)}"/><path d="${star(172, 236, 4)}"/></g>`,
  { d: 'M96 326 C136 334 180 334 214 326 L216 336 C180 344 136 344 94 336 Z', fill: C.gold, ink: 1.4, lines: ['M110 330 L108 338', 'M130 332 L129 340', 'M150 333 L150 341', 'M170 333 L171 341', 'M190 331 L192 339'] },
  { d: 'M188 336 L214 335 C222 339 230 341 238 343 L238 345 L188 345 Z', fill: C.brownD, ink: 1.6 },
  // girdle (rope), tassel, girdle book
  { d: 'M126 196 C142 202 160 202 176 196 L176 203 C160 209 142 209 126 203 Z', fill: C.bone, ink: 1.4, lines: ['M134 199 L138 205', 'M146 201 L150 207', 'M158 201 L162 207', 'M170 199 L172 205'] },
  { d: 'M160 204 L166 204 L168 236 L158 236 Z', fill: C.bone, ink: 1.3, lines: ['M160 214 L166 214'] },
  { d: 'M156 236 L170 236 L172 254 L154 254 Z', fill: C.bone, ink: 1.3, lines: ['M158 238 L157 252', 'M163 238 L163 253', 'M168 238 L169 252'] },
  { d: 'M128 210 L150 206 L154 238 L132 242 Z', fill: C.redD, shade: 'M146 207 L150 206 L154 238 L150 239 Z', lines: ['M131 214 L150 210', 'M134 238 L152 235'] },
  { d: 'M136 222 L146 220 L147 228 L137 230 Z', fill: C.gold, ink: 1 },
  // mantle
  { d: 'M118 100 C108 130 100 170 98 222 L112 212 L118 224 L128 208 C130 170 136 136 150 114 C162 136 168 170 170 208 L180 222 L186 210 L198 220 C196 170 190 130 182 100 C162 92 138 92 118 100 Z', fill: C.violet,
    shade: 'M170 104 C180 104 182 100 182 100 C190 130 196 170 198 220 L186 210 L180 222 L172 208 C176 170 176 130 170 104 Z', shade2: 'M98 222 C100 190 104 160 110 134 C112 160 114 190 112 212 Z',
    lines: ['M112 120 C108 150 106 180 106 214', 'M186 124 C190 150 192 180 192 214'] },
  // hood + falling cowl tip
  { d: 'M136 48 C120 48 106 58 100 76 C112 68 122 66 132 70 Z', fill: C.violet, shade: 'M100 76 C112 68 122 66 132 70 L128 62 C118 62 108 68 100 76 Z' },
  { d: 'M130 102 C120 82 120 58 132 44 C140 34 156 30 168 36 C178 42 182 58 180 78 L178 102 Z', fill: C.violet,
    shade: 'M166 34 C178 42 182 58 180 78 L178 102 L168 102 C172 80 172 56 166 34 Z', lines: ['M140 50 C136 66 136 84 140 100'] },
  // face (long nose), brow, eye
  { d: 'M150 52 C156 46 168 46 172 54 L188 68 L176 72 C174 80 168 86 160 86 C154 86 150 80 150 72 Z', fill: C.flesh,
    shade: 'M150 66 C150 78 154 86 160 86 C156 80 154 74 154 66 Z', lines: ['M172 54 L188 68 L176 72'] },
  `<path d="M160 56 C164 52 170 52 174 56" fill="none" stroke="${S.ink}" stroke-width="2.2" stroke-linecap="round"/>`,
  `<path d="M163 60 C165 58 169 58 171 60 C169 62 165 62 163 60 Z" fill="${C.bone}" stroke="${S.ink}" stroke-width="0.9"/><circle cx="168" cy="60" r="1.3" fill="${S.ink}"/>`,
  // beard (in front of mantle)
  { d: 'M150 74 C152 88 160 98 156 112 C152 134 160 154 158 182 C168 164 176 142 172 120 C174 104 180 88 176 74 C168 82 158 82 150 74 Z', fill: C.bone,
    shade: 'M168 82 C176 88 176 104 172 120 C176 142 168 164 158 182 C164 160 166 140 164 120 C166 104 168 92 168 82 Z', shadeFill: 'url(#h135)',
    lines: ['M156 88 C162 104 160 120 162 140', 'M164 86 C168 104 166 128 164 160', 'M158 120 C156 136 158 150 160 170'] },
  { d: 'M160 76 C166 74 172 76 178 74 C174 80 166 80 160 78 Z', fill: C.bone, ink: 1.1 },
  // clasp
  `<circle cx="134" cy="112" r="7" fill="${C.gold}" stroke="${S.ink}" stroke-width="1.6"/><circle cx="134" cy="112" r="2.5" fill="${C.redD}" stroke="${S.ink}" stroke-width="0.8"/>`,
  // front arm: bell sleeve then hand on staff
  { d: 'M170 106 C188 112 206 128 214 146 L226 168 L196 170 C192 152 182 138 170 130 Z', fill: C.azure,
    shade: 'M196 128 C206 136 212 142 214 146 L226 168 L212 169 C210 156 204 142 196 128 Z', lines: ['M182 124 C190 136 196 150 200 166'] },
  { d: 'M196 166 L226 164 L228 172 L198 175 Z', fill: C.gold, ink: 1.3 },
  { d: 'M212 140 C220 136 230 140 231 148 L229 160 C223 164 214 162 212 156 Z', fill: C.flesh, shade: 'M224 140 C230 142 231 146 231 148 L229 160 L224 161 Z', lines: ['M214 146 L230 147', 'M214 152 L230 153'] },
  // orbiting element roundels
  { d: 'M40 180 A14 14 0 1 1 68 180 A14 14 0 1 1 40 180 Z', fill: C.azure, shade: 'M54 166 A14 14 0 0 1 54 194 C60 186 60 174 54 166 Z', after: `<path d="M44 182 C48 176 52 176 54 182 C56 176 60 176 64 182" fill="none" stroke="#f7eedb" stroke-width="2" stroke-linecap="round"/>` },
  { d: 'M54 226 A12 12 0 1 1 78 226 A12 12 0 1 1 54 226 Z', fill: '#eef2f2', shade: 'M66 214 A12 12 0 0 1 66 238 C71 232 71 220 66 214 Z', shadeFill: 'url(#h135)', after: `<path d="M66 218 L66 234 M59 222 L73 230 M59 230 L73 222" stroke="${C.azureD}" stroke-width="1.6" stroke-linecap="round"/>` },
  { d: 'M240 90 A12 12 0 1 1 264 90 A12 12 0 1 1 240 90 Z', fill: C.gold, shade: 'M252 78 A12 12 0 0 1 252 102 C257 96 257 84 252 78 Z', after: `<path d="M254 81 L248 91 L255 90 L250 100" fill="none" stroke="${C.redD}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` },
];
fs.writeFileSync(process.argv[2] || 'src/ms_elementalist.svg', build(300, 360, S, parts, { filter: 'url(#wob)' }));
