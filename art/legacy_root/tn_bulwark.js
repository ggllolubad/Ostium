const { build } = require('./lib');
const { S, C, halo } = require('./tn_style');
const fs = require('fs');
// Tarot Bulwark: bearded knight in a pointed bascinet and mail aventail, ornate pauldrons, rose tabard with
// ochre border and lily-in-doorway emblem, sage cape ending in a whiplash curl, longsword planted point-down,
// tall arched teal shield. Faces 3/4 right.
const parts = [
  `<ellipse cx="160" cy="370" rx="96" ry="7" fill="${S.ink}" opacity="0.25"/>`,
  halo(152, 92, 80, C.creamD, C.ochre),
  // cape behind
  { d: 'M118 120 C96 160 84 222 80 292 C78 324 90 352 114 362 C104 342 104 322 112 302 L126 140 Z', fill: C.sage,
    shade: 'M80 292 C78 324 90 352 114 362 C104 342 104 322 112 302 L118 220 C100 240 88 266 80 292 Z',
    lines: ['M108 160 C98 200 92 250 92 300', 'M118 180 C112 220 108 260 106 300'], after: `<path d="M114 362 C126 366 132 356 126 350 C122 346 116 350 118 354" fill="none" stroke="${S.ink}" stroke-width="2.4" stroke-linecap="round"/>` },
  // sword planted point-down (behind hand)
  { d: 'M108 204 L116 204 L115 352 L112 362 L109 352 Z', fill: C.steelL, shade: 'M112 204 L116 204 L115 352 L112 362 Z', lines: ['M112 210 L112 340'] },
  { d: 'M96 196 L128 196 C130 200 130 204 128 206 L96 206 C94 204 94 200 96 196 Z', fill: C.ochre, ink: 2.2 },
  { d: 'M108 176 L116 176 L116 196 L108 196 Z', fill: C.plum, ink: 2, lines: ['M108 182 L116 184', 'M108 188 L116 190'] },
  `<circle cx="112" cy="171" r="6" fill="${C.ochreL}" stroke="${S.ink}" stroke-width="2.2"/>`,
  // legs (greaves, knee cops, sabatons)
  { d: 'M128 266 L150 266 L148 344 L128 344 Z', fill: C.steel, shade: 'M142 266 L150 266 L148 344 L142 344 Z', lines: ['M132 280 L132 336'] },
  { d: 'M126 292 C126 284 150 284 150 292 L148 306 C142 310 132 310 128 306 Z', fill: C.steelL, ink: 2.2, lines: ['M128 298 C134 302 144 302 149 298'] },
  { d: 'M124 340 L150 340 C156 346 162 352 166 358 L166 366 L120 366 C118 356 120 346 124 340 Z', fill: C.steel, shade: 'M120 360 L166 360 L166 366 L120 366 Z', lines: ['M126 348 L152 348'] },
  { d: 'M156 266 L180 266 L184 344 L162 344 Z', fill: C.steel, shade: 'M174 266 L180 266 L184 344 L176 344 Z', lines: ['M162 280 L164 336'] },
  { d: 'M158 292 C158 284 182 284 182 292 L182 306 C176 310 164 310 160 306 Z', fill: C.steelL, ink: 2.2, lines: ['M160 298 C166 302 176 302 181 298'] },
  { d: 'M160 340 L186 340 C196 346 206 352 214 358 L214 366 L158 366 C156 356 156 346 160 340 Z', fill: C.steel, shade: 'M158 360 L214 360 L214 366 L158 366 Z', lines: ['M162 348 L190 348'] },
  // breastplate under tabard
  { d: 'M116 120 L190 120 L186 198 L120 198 Z', fill: C.steel, shade: 'M176 120 L190 120 L186 198 L176 198 Z' },
  // tabard
  { d: 'M126 122 L182 122 C184 170 188 220 194 272 C176 280 132 280 112 272 C118 220 122 170 126 122 Z', fill: C.rose,
    shade: 'M166 122 L182 122 C184 170 188 220 194 272 C186 275 178 277 170 278 C172 220 170 170 166 122 Z',
    lines: ['M132 210 C130 236 126 256 124 274', 'M148 214 C148 240 146 258 146 278', 'M168 214 C170 240 172 258 174 276'],
    after: `<path d="M126 122 C122 170 118 220 112 272 C132 280 176 280 194 272 C188 220 184 170 182 122" fill="none" stroke="${C.ochre}" stroke-width="3" transform="translate(0 0)"/>` },
  // emblem: lily within doorway arch
  { d: 'M138 182 L138 152 C138 136 170 136 170 152 L170 182 Z', fill: C.ochreL, shade: 'M160 140 C166 142 170 146 170 152 L170 182 L162 182 Z' },
  { d: 'M154 178 C146 172 146 160 154 150 C162 160 162 172 154 178 Z', fill: C.cream, ink: 1.8, after: `<path d="M154 178 C146 178 140 174 140 168 M154 178 C162 178 168 174 168 168 M154 178 L154 186" fill="none" stroke="${S.ink}" stroke-width="1.6" stroke-linecap="round"/>` },
  // belt
  { d: 'M118 194 L190 194 L190 204 L118 204 Z', fill: C.ochre, ink: 2.2, lines: ['M134 194 L134 204', 'M174 194 L174 204'] },
  { d: 'M148 192 L160 192 L160 206 L148 206 Z', fill: C.ochreL, ink: 2 },
  // back arm: upper, forearm, gauntlet on pommel
  { d: 'M110 128 L126 136 L120 170 L104 166 Z', fill: C.steel, shade: 'M120 134 L126 136 L120 170 L114 169 Z', lines: ['M108 148 L122 152'] },
  { d: 'M102 162 L122 166 L122 184 L104 184 Z', fill: C.steelL, shade: 'M116 166 L122 166 L122 184 L116 184 Z', lines: ['M104 174 L122 175'] },
  // pauldrons
  { d: 'M104 126 C106 110 124 104 138 112 L136 138 C124 142 112 138 104 132 Z', fill: C.steelL, shade: 'M126 108 C132 108 136 110 138 112 L136 138 C132 139 128 140 124 140 C128 130 128 118 126 108 Z',
    lines: ['M106 122 C116 124 126 122 136 118', 'M106 130 C116 132 126 130 136 128'] },
  `<g fill="${C.ochre}" stroke="${S.ink}" stroke-width="1"><circle cx="112" cy="116" r="2"/><circle cx="124" cy="111" r="2"/></g>`,
  { d: 'M168 112 C182 104 200 108 204 122 C200 134 188 140 174 138 Z', fill: C.steelL, shade: 'M190 106 C198 110 202 116 204 122 C200 134 188 140 182 139 C190 130 192 118 190 106 Z',
    lines: ['M172 120 C182 118 192 118 202 122', 'M174 130 C184 128 192 128 200 130'] },
  // aventail, face, beard, bascinet
  { d: 'M134 88 C130 100 130 114 136 124 L178 124 C184 114 184 100 178 88 C176 104 168 114 156 116 C146 116 138 106 134 88 Z', fill: C.steel,
    shade: 'M170 104 C174 98 176 92 178 88 C184 100 184 114 178 124 L170 124 Z', lines: ['M136 108 L178 108', 'M136 116 L180 116', 'M134 100 L138 100', 'M176 100 L180 100'] },
  { d: 'M138 72 C138 60 148 54 158 54 C168 54 176 62 176 76 C176 90 170 100 160 102 C150 102 142 94 140 86 Z', fill: C.skin,
    shade: 'M168 58 C174 62 176 68 176 76 C176 90 170 100 160 102 C166 92 170 78 168 58 Z' },
  `<path d="M150 76 C153 74 157 74 159 76 M165 76 C167 74 170 74 172 76" fill="none" stroke="${S.ink}" stroke-width="2" stroke-linecap="round"/>`,
  `<path d="M148 71 L160 72 M164 72 L173 71" fill="none" stroke="${C.hairD}" stroke-width="2.4" stroke-linecap="round"/>`,
  `<path d="M174 78 C177 84 177 88 173 90" fill="none" stroke="${S.ink}" stroke-width="1.4" stroke-linecap="round"/>`,
  { d: 'M140 84 C142 100 150 110 160 112 C170 110 176 100 176 88 C170 94 166 94 160 92 C152 94 146 92 140 84 Z', fill: C.hairD, lines: ['M150 98 C152 104 156 108 160 110', 'M160 96 L160 108'] },
  { d: 'M156 92 C160 90 166 90 170 92 C166 96 160 96 156 92 Z', fill: C.hair, ink: 1.4 },
  { d: 'M132 66 C130 46 140 28 156 16 C172 28 180 46 178 66 C174 58 166 54 156 54 C146 54 136 58 132 66 Z', fill: C.steel,
    hl: 'M140 56 C142 42 148 30 156 22 C150 34 148 46 148 54 Z', shade: 'M164 26 C174 36 180 50 178 66 C174 58 170 56 166 55 C168 44 168 34 164 26 Z',
    lines: ['M156 18 L156 54'] },
  { d: 'M132 64 C140 56 170 54 178 64 L178 70 C170 62 140 62 132 70 Z', fill: C.ochre, ink: 2 },
  // shield (front arm)
  { d: 'M166 162 C166 132 236 132 236 162 L236 264 C236 294 212 314 201 320 C190 314 166 294 166 264 Z', fill: C.teal,
    shade: 'M210 136 C226 140 236 148 236 162 L236 264 C236 294 212 314 201 320 C210 300 214 280 214 260 L214 160 C214 150 212 142 210 136 Z' },
  `<path d="M174 164 C174 142 228 142 228 164 L228 262 C228 288 210 304 201 310 C192 304 174 288 174 262 Z" fill="none" stroke="${C.ochre}" stroke-width="3.4"/>`,
  { d: 'M186 260 L186 196 C186 176 216 176 216 196 L216 260 Z', fill: C.tealD, ink: 2, after: `<path d="M186 260 L186 196 C186 176 216 176 216 196 L216 260" fill="none" stroke="${C.ochreL}" stroke-width="2"/>` },
  { d: 'M201 252 C190 242 190 222 201 206 C212 222 212 242 201 252 Z', fill: C.cream, ink: 2, after: `<path d="M201 252 C190 252 182 246 182 238 M201 252 C212 252 220 246 220 238 M201 252 L201 264" fill="none" stroke="${C.cream}" stroke-width="2.2" stroke-linecap="round"/>` },
  `<g fill="${C.ochreL}" stroke="${S.ink}" stroke-width="1.2"><circle cx="201" cy="150" r="3"/><circle cx="178" cy="172" r="2.4"/><circle cx="224" cy="172" r="2.4"/><circle cx="201" cy="300" r="2.4"/></g>`,
];
fs.writeFileSync(process.argv[2] || 'src/tn_bulwark.svg', build(300, 380, S, parts));
