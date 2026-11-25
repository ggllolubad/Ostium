const { build } = require('./lib');
const { S, C, halo } = require('./tn_style');
const fs = require('fs');
// Tarot Elementalist: Mucha-style sorceress. Ornamental halo carrying water / frost / lightning medallions,
// a cascade of auburn hair with whiplash locks, crescent diadem, plum gown with sage overdress and ochre border,
// crescent staff, flame cupped in the raised hand. Faces 3/4 right.
const med = (x, y, fill, glyph) => `<circle cx="${x}" cy="${y}" r="13" fill="${fill}" stroke="${S.ink}" stroke-width="2.6"/><circle cx="${x}" cy="${y}" r="9.5" fill="none" stroke="${C.ochre}" stroke-width="1.4"/>${glyph}`;
const parts = [
  `<ellipse cx="152" cy="370" rx="92" ry="7" fill="${S.ink}" opacity="0.25"/>`,
  halo(152, 96, 82, C.creamD, C.ochre),
  med(152, 18, C.ochreL, `<path d="M155 10 L148 20 L155 19 L149 28" fill="none" stroke="${S.ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`),
  med(72, 96, C.teal, `<path d="M64 98 C67 92 71 92 72 98 C73 92 77 92 80 98" fill="none" stroke="${C.cream}" stroke-width="2" stroke-linecap="round"/>`),
  med(232, 96, C.cream, `<path d="M232 88 L232 104 M225 92 L239 100 M225 100 L239 92" stroke="${C.tealD}" stroke-width="1.8" stroke-linecap="round"/>`),
  // staff (behind hand) with crescent
  { d: 'M211 62 L217 62 L219 368 L213 368 Z', fill: C.ochre, shade: 'M214 62 L217 62 L219 368 L216 368 Z' },
  { d: 'M200 34 C200 50 210 60 224 60 C214 54 210 44 214 32 C208 28 202 30 200 34 Z', fill: C.ochreL, shade: 'M200 34 C200 50 210 60 224 60 C216 58 206 50 204 36 Z' },
  `<circle cx="214" cy="64" r="4" fill="${C.seafoam}" stroke="${S.ink}" stroke-width="1.6"/>`,
  // hair, back masses (left and right cascades with whiplash ends)
  { d: 'M150 50 C120 50 106 76 110 102 C102 124 88 140 66 150 C80 158 98 154 108 146 C102 166 94 180 76 192 C98 198 118 184 126 162 L132 120 Z', fill: C.hair,
    shade: 'M66 150 C88 140 102 124 110 102 L118 104 C114 128 102 146 80 156 Z M76 192 C94 180 102 166 108 146 L114 150 C112 168 100 184 76 192 Z',
    lines: ['M124 70 C114 92 112 116 100 138', 'M130 90 C124 120 118 150 104 172', 'M118 62 C108 84 106 110 88 140', 'M136 70 C126 100 126 130 116 160', 'M112 100 C100 120 90 134 74 148'], after: `<path d="M66 150 C56 152 52 142 58 138 C62 136 66 140 64 144 M76 192 C64 196 60 186 66 182 C70 180 74 184 72 188" fill="none" stroke="${S.ink}" stroke-width="2.4" stroke-linecap="round"/>` },
  { d: 'M154 50 C186 50 198 78 192 104 C200 126 216 142 236 150 C222 158 204 154 194 146 C200 168 208 182 226 194 C202 198 186 184 180 162 L172 120 Z', fill: C.hair,
    shade: 'M190 104 C200 126 216 142 236 150 C220 154 206 150 196 140 C196 128 194 116 190 104 Z',
    lines: ['M178 72 C190 94 190 118 204 140', 'M174 94 C182 124 188 150 204 176', 'M186 62 C198 84 198 110 216 140', 'M170 70 C180 100 180 130 190 160', 'M194 100 C206 120 216 134 230 148'], after: `<path d="M236 150 C246 152 250 142 244 138 C240 136 236 140 238 144 M226 194 C238 198 242 188 236 184 C232 182 228 186 230 190" fill="none" stroke="${S.ink}" stroke-width="2.4" stroke-linecap="round"/>` },
  // raised left arm (behind body): bell sleeve, hand, flame
  { d: 'M126 140 C108 150 98 168 96 188 L84 214 C98 220 110 214 114 204 C116 184 122 168 132 158 Z', fill: C.plum,
    shade: 'M84 214 C98 220 110 214 114 204 L106 196 C100 204 92 208 84 214 Z', lines: ['M118 152 C108 168 104 186 100 206'] },
  { d: 'M84 212 C82 204 88 198 96 200 C102 202 104 208 100 214 C96 218 88 218 84 212 Z', fill: C.skin, shade: 'M84 212 C88 216 94 217 100 214 L98 210 C94 212 88 212 84 212 Z', lines: ['M88 206 L96 207'] },
  { d: 'M92 202 C102 188 102 170 92 152 C90 168 80 178 82 190 C84 198 88 201 92 202 Z', fill: '#d9785e', shade: 'M92 162 C100 176 100 190 92 202 C96 190 96 176 92 162 Z', shadeFill: C.roseD },
  { d: 'M92 198 C96 192 96 184 92 178 C90 186 88 190 89 194 Z', fill: C.ochreL, ink: 1.4 },
  // gown
  { d: 'M124 132 C134 124 170 124 180 132 C186 160 188 190 188 220 C198 260 210 312 226 362 L78 362 C92 312 104 260 114 220 C114 190 118 160 124 132 Z', fill: C.plum,
    shade: 'M170 128 C176 130 180 132 180 132 C186 160 188 190 188 220 C198 260 210 312 226 362 L196 362 C190 300 180 230 170 128 Z',
    lines: ['M120 230 C112 280 102 320 94 360', 'M190 240 C198 280 206 320 214 360', 'M128 260 C124 300 118 330 114 360', 'M108 300 C104 320 100 340 98 356', 'M200 300 C204 322 208 342 210 358', 'M94 360 C100 350 106 350 110 360', 'M196 358 C202 348 208 348 212 360'] },
  // sage overdress panel with ochre border
  { d: 'M136 140 L168 140 C172 200 178 280 186 362 L116 362 C124 280 130 200 136 140 Z', fill: C.sage,
    shade: 'M156 140 L168 140 C172 200 178 280 186 362 L170 362 C166 280 162 200 156 140 Z',
    lines: ['M146 160 C146 220 142 300 136 360', 'M156 200 C158 260 160 310 162 360'],
    after: `<path d="M136 140 C130 200 124 280 116 362 M168 140 C172 200 178 280 186 362" fill="none" stroke="${C.ochre}" stroke-width="3.2"/>` },
  // embroidered lily motifs on panel
  `<g fill="${C.ochreL}" stroke="${S.ink}" stroke-width="1.1">${[[150, 250], [148, 300], [152, 340]].map(([x, y]) => `<path d="M${x} ${y} C${x - 8} ${y - 6} ${x - 8} ${y - 16} ${x} ${y - 20} C${x + 8} ${y - 16} ${x + 8} ${y - 6} ${x} ${y} Z"/><path d="M${x} ${y} C${x - 12} ${y - 2} ${x - 16} ${y - 8} ${x - 14} ${y - 14} M${x} ${y} C${x + 12} ${y - 2} ${x + 16} ${y - 8} ${x + 14} ${y - 14}" fill="none"/>`).join('')}</g>`,
  // pooled hem
  { d: 'M78 360 C110 350 196 350 226 360 L236 370 L68 370 Z', fill: C.plumL, shade: 'M190 354 C206 356 218 358 226 360 L236 370 L200 370 Z', lines: ['M100 362 C120 366 140 366 160 364'] },
  // sash at waist
  { d: 'M118 196 C136 204 166 204 186 196 L188 208 C166 216 136 216 116 208 Z', fill: C.ochre, shade: 'M170 200 L186 196 L188 208 L172 212 Z', lines: ['M130 204 L130 212', 'M152 206 L152 214', 'M172 204 L172 212'] },
  { d: 'M150 210 C146 230 150 250 144 268 L156 266 C158 248 156 230 158 210 Z', fill: C.ochre, ink: 2 },
  // collar / neckline
  { d: 'M134 128 C144 140 160 140 170 128 L176 134 C164 150 140 150 128 134 Z', fill: C.ochreL, ink: 2, lines: ['M140 136 L138 142', 'M152 140 L152 146', 'M164 136 L166 142'] },
  `<path d="M140 132 C146 142 158 142 164 132" fill="none" stroke="${C.ochre}" stroke-width="1.6"/><path d="M152 140 L148 150 L152 158 L156 150 Z" fill="${C.seafoam}" stroke="${S.ink}" stroke-width="1.3"/>`,
  // neck + face
  { d: 'M144 106 L160 106 L162 130 L142 130 Z', fill: C.skin, shade: 'M154 106 L160 106 L162 130 L156 130 Z' },
  { d: 'M136 80 C136 66 146 58 156 58 C168 58 176 68 176 82 C176 98 168 112 156 114 C146 114 138 104 136 94 Z', fill: C.skin,
    shade: 'M166 62 C174 68 176 76 176 82 C176 98 168 112 156 114 C164 104 170 90 166 62 Z' },
  `<path d="M148 86 C151 84 155 84 158 87 M164 86 C166 84 169 84 171 86" fill="none" stroke="${S.ink}" stroke-width="1.8" stroke-linecap="round"/>`,
  `<path d="M147 81 C151 78 156 78 159 81 M163 80 C166 78 169 78 172 80" fill="none" stroke="${C.hairD}" stroke-width="1.6" stroke-linecap="round"/>`,
  `<path d="M173 86 C175 92 176 96 172 98" fill="none" stroke="${S.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M158 104 C161 106 165 105 167 103" fill="none" stroke="${C.roseD}" stroke-width="2.2" stroke-linecap="round"/>`,
  `<ellipse cx="148" cy="96" rx="6" ry="3.5" fill="${C.rose}" opacity="0.35"/>`,
  // hair over brow + framing locks
  { d: 'M134 82 C130 60 146 46 160 46 C174 46 184 60 182 80 C174 68 162 62 152 64 C144 66 138 72 134 82 Z', fill: C.hair, lines: ['M144 56 C152 58 160 62 166 70', 'M156 50 C166 54 174 62 178 72'] },
  { d: 'M136 84 C130 100 132 118 124 132 C132 130 138 120 140 106 Z', fill: C.hair, ink: 2.2 },
  // crescent diadem
  { d: 'M136 66 C146 58 166 58 180 66 L180 71 C166 64 146 64 136 71 Z', fill: C.ochre, ink: 2 },
  { d: 'M150 58 C150 46 160 40 168 42 C162 44 158 50 160 58 C156 60 152 60 150 58 Z', fill: C.ochreL, ink: 2 },
  `<circle cx="158" cy="64" r="2.6" fill="${C.seafoam}" stroke="${S.ink}" stroke-width="1.2"/>`,
  // right arm: sleeve to staff, hand gripping
  { d: 'M176 134 C192 140 204 158 206 182 L212 220 L192 224 C190 200 184 176 172 160 Z', fill: C.plum, shade: 'M196 150 C202 160 206 172 206 182 L212 220 L202 222 C200 196 198 172 196 150 Z',
    lines: ['M184 150 C190 170 192 196 194 218'] },
  { d: 'M190 222 L214 218 L216 228 L192 232 Z', fill: C.ochre, ink: 2 },
  { d: 'M206 228 C210 222 222 222 224 230 L222 244 C216 248 208 246 206 240 Z', fill: C.skin, shade: 'M218 224 C222 226 224 228 224 230 L222 244 L218 246 Z', lines: ['M208 234 L222 235', 'M208 239 L222 240'] },
];
fs.writeFileSync(process.argv[2] || 'src/tn_elementalist.svg', build(300, 380, S, parts));
