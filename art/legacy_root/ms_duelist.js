const { build } = require('./lib');
const { S, C } = require('./ms_style');
const fs = require('fs');
// Manuscript Duelist: cavalier fencer en garde. Green doublet with vermilion slashes, red/green parti hose,
// bucket boots, plumed hat, short cape, swept-hilt rapier crackling with gold lightning, parrying dagger raised.
const parts = [
  `<ellipse cx="160" cy="346" rx="96" ry="8" fill="url(#h45w)" opacity="0.8"/>`,
  `<g fill="none" stroke="${S.ink}" stroke-width="1.1"><path d="M70 344 C72 340 78 340 79 344"/><path d="M250 345 C251 342 256 342 257 345"/></g>`,
  // cape
  { d: 'M134 98 C112 104 96 130 90 160 C86 178 88 194 92 206 L104 198 L110 210 L120 196 L128 206 L136 176 C140 150 142 120 142 100 Z', fill: C.red,
    shade: 'M90 160 C88 178 88 194 92 206 L104 198 L110 210 L112 170 C104 150 100 130 112 108 C100 120 92 140 90 160 Z',
    lines: ['M124 106 C114 130 112 160 118 196', 'M134 110 C128 140 128 170 128 204', 'M108 120 C102 140 100 170 104 198'] },
  // scabbard angled behind
  { d: 'M136 186 L142 190 L90 252 L84 248 Z', fill: C.brownD, shade: 'M139 188 L142 190 L90 252 L87 250 Z', lines: ['M118 214 L124 218'] },
  `<path d="M84 248 L90 252 L86 258 Z" fill="${C.gold}" stroke="${S.ink}" stroke-width="1.2"/>`,
  // back arm raised behind (off hand with parrying dagger, clear of the plume)
  { d: 'M78 58 L71 20 L74 19 L82 57 Z', fill: C.steel, shade: 'M72 20 L74 19 L82 57 L80 58 Z' },
  { d: 'M68 62 L90 54 L91 58 L69 66 Z', fill: C.gold, ink: 1.4 },
  { d: 'M132 102 C120 94 108 92 98 94 L98 112 C108 110 120 112 128 118 Z', fill: C.green, shade: 'M98 106 C110 106 120 110 128 118 L98 112 Z',
    free: ['M108 94 L108 110', 'M118 98 L117 112'], lineColor: C.redD },
  { d: 'M90 100 L108 106 L92 74 L78 80 Z', fill: C.green, shade: 'M100 102 L108 106 L92 74 L86 77 Z', lines: ['M86 92 L100 88'] },
  { d: 'M74 82 L94 74 L92 66 L72 74 Z', fill: C.bone, ink: 1.3, lines: ['M78 79 L76 72', 'M84 77 L82 70', 'M89 75 L87 68'] },
  { d: 'M72 70 C68 62 72 54 80 54 C86 54 90 60 88 68 Z', fill: C.flesh, shade: 'M82 54 C86 56 90 60 88 68 L82 68 Z', lines: ['M74 62 L86 60'] },
  // back leg: red hose, bucket boot, foot turned out
  { d: 'M138 190 L158 196 L134 266 L116 260 Z', fill: C.red, shade: 'M150 194 L158 196 L134 266 L126 264 Z' },
  { d: 'M114 258 L136 266 L118 330 L100 328 Z', fill: C.brown, shade: 'M128 262 L136 266 L118 330 L110 330 Z', lines: ['M112 290 C118 292 124 294 128 290', 'M106 310 C112 312 118 312 122 308'] },
  { d: 'M108 252 C116 246 136 252 142 260 L138 276 C128 270 118 266 106 266 Z', fill: C.brown, shade: 'M130 254 L142 260 L138 276 L130 272 Z', lines: ['M112 258 C120 256 130 260 136 266'] },
  { d: 'M96 324 L120 326 L122 342 L82 344 C80 336 86 328 96 324 Z', fill: C.brownD, shade: 'M84 338 L122 338 L122 342 L82 344 Z', lines: ['M100 330 L118 332'] },
  // front leg: green hose, boot, foot forward
  { d: 'M150 192 L174 190 L206 252 L186 264 Z', fill: C.green, shade: 'M168 190 L174 190 L206 252 L196 258 Z' },
  { d: 'M186 254 L208 250 L214 330 L194 332 Z', fill: C.brown, shade: 'M202 251 L208 250 L214 330 L206 331 Z', lines: ['M190 290 C196 292 204 292 210 288', 'M192 312 C198 314 206 314 212 310'] },
  { d: 'M180 248 C190 240 208 240 214 248 L212 264 C204 258 192 258 182 262 Z', fill: C.brown, shade: 'M204 242 L214 248 L212 264 L204 260 Z', lines: ['M186 250 C194 246 204 248 210 252'] },
  { d: 'M192 326 L214 326 C224 332 234 336 242 338 L242 344 L190 344 Z', fill: C.brownD, shade: 'M190 339 L242 339 L242 344 L190 344 Z', lines: ['M196 332 L222 334'] },
  // peplum (tabbed skirt of doublet)
  { d: 'M126 170 C140 178 160 178 174 170 L182 196 L172 202 L166 194 L158 204 L150 196 L142 204 L134 196 L126 202 L120 196 Z', fill: C.green,
    shade: 'M160 174 L174 170 L182 196 L172 202 L166 194 L160 200 Z', lines: ['M134 178 L134 196', 'M150 180 L150 196', 'M166 178 L166 194'] },
  // doublet body
  { d: 'M126 102 C126 94 138 88 150 88 C164 88 176 94 176 102 C176 130 174 154 172 176 C160 182 140 182 128 176 C126 152 124 128 126 102 Z', fill: C.green,
    shade: 'M162 90 C170 92 176 96 176 102 C176 130 174 154 172 176 L162 178 C166 150 166 120 162 90 Z',
    lines: ['M136 110 C134 130 134 150 136 172', 'M146 120 C148 140 148 160 146 176'] },
  // slashes on doublet (vermilion showing through)
  { d: 'M137 112 C134 120 134 128 137 136 C140 128 140 120 137 112 Z', fill: C.red, ink: 1.1 },
  { d: 'M137 142 C134 150 134 158 137 166 C140 158 140 150 137 142 Z', fill: C.red, ink: 1.1 },
  { d: 'M153 120 C150 128 150 136 153 144 C156 136 156 128 153 120 Z', fill: C.red, ink: 1.1 },
  { d: 'M153 150 C150 158 150 164 153 172 C156 164 156 158 153 150 Z', fill: C.red, ink: 1.1 },
  `<g fill="${C.gold}" stroke="${S.ink}" stroke-width="0.9"><circle cx="166" cy="104" r="2"/><circle cx="166" cy="118" r="2"/><circle cx="166" cy="132" r="2"/><circle cx="166" cy="146" r="2"/><circle cx="166" cy="160" r="2"/></g>`,
  // belt + hanger
  { d: 'M126 172 C140 178 160 178 174 172 L174 180 C160 186 140 186 126 180 Z', fill: C.brownD, ink: 1.5 },
  { d: 'M146 174 L156 174 L156 184 L146 184 Z', fill: C.gold, ink: 1.2 },
  // falling-band collar
  { d: 'M134 88 C142 100 158 100 168 88 L174 98 C162 110 140 110 128 98 Z', fill: C.bone, shade: 'M160 94 L168 88 L174 98 L164 104 Z', lines: ['M140 100 L138 106', 'M150 102 L150 108', 'M160 100 L162 106'] },
  // neck, hair, face
  { d: 'M144 74 L158 74 L159 92 L143 92 Z', fill: C.flesh, shade: 'M152 74 L158 74 L159 92 L152 92 Z' },
  { d: 'M140 44 C128 54 128 76 134 90 C140 96 148 92 148 84 C142 74 142 60 148 50 Z', fill: C.brownD, lines: ['M136 60 C140 64 140 70 136 74', 'M138 78 C142 82 142 86 138 90'] },
  { d: 'M142 50 C142 38 152 32 162 34 C170 36 174 44 174 52 L179 60 L174 63 C174 70 170 77 162 79 C154 81 146 77 144 68 Z', fill: C.flesh,
    shade: 'M144 62 C146 74 154 80 162 79 C156 76 150 70 148 62 Z', lines: ['M174 52 L179 60 L174 63'] },
  `<path d="M160 52 C163 49 168 49 170 52 C167 54 163 54 160 52 Z" fill="${C.bone}" stroke="${S.ink}" stroke-width="1"/><circle cx="166" cy="52" r="1.5" fill="${S.ink}"/>`,
  `<path d="M158 46 C162 44 168 44 172 46" fill="none" stroke="${S.ink}" stroke-width="1.4" stroke-linecap="round"/>`,
  { d: 'M160 66 C166 63 172 66 178 63 C174 71 166 71 160 68 Z', fill: C.brownD, ink: 1.1 },
  { d: 'M164 74 L170 74 L167 84 Z', fill: C.brownD, ink: 1.1 },
  // hat crown, band, brim, plume
  { d: 'M136 30 C126 20 104 18 88 30 C102 28 114 30 122 36 C108 36 98 42 92 52 C108 44 122 42 138 40 Z', fill: C.red, shade: 'M92 52 C108 44 122 42 138 40 L134 36 C120 38 104 44 92 52 Z',
    lines: ['M128 32 L118 26', 'M120 34 L108 28', 'M112 36 L100 34', 'M124 38 L108 42'] },
  { d: 'M134 44 C134 26 150 16 164 18 C174 20 180 28 178 40 C162 44 148 46 134 44 Z', fill: C.brownD, hl: 'M140 40 C140 28 148 22 156 20 C150 26 146 34 146 42 Z', hlFill: '#7d5a3e' },
  { d: 'M134 40 C150 42 164 40 178 36 L178 42 C162 46 148 48 134 46 Z', fill: C.gold, ink: 1.2 },
  { d: 'M116 48 C130 38 170 30 200 34 C190 42 164 48 142 52 C130 54 120 54 116 48 Z', fill: C.brownD, shade: 'M142 52 C160 48 186 42 200 34 C190 44 170 50 150 54 Z', shadeFill: '#4a3424' },
  // front arm: puffed sleeve with slashes, forearm, lace cuff, hand
  { d: 'M166 98 C182 96 196 108 202 122 L188 134 C182 124 172 118 164 116 Z', fill: C.green, shade: 'M188 108 C196 112 200 118 202 122 L188 134 C186 128 184 124 182 120 Z' },
  { d: 'M176 104 L182 106 L180 120 L174 118 Z', fill: C.red, ink: 1 },
  { d: 'M188 110 L194 114 L190 126 L185 122 Z', fill: C.red, ink: 1 },
  { d: 'M188 120 L202 124 L222 118 L224 130 L200 138 L186 132 Z', fill: C.green, shade: 'M186 132 L200 138 L224 130 L223 126 L200 132 Z', lines: ['M204 124 L206 134'] },
  { d: 'M218 112 L228 110 L230 132 L220 134 Z', fill: C.bone, ink: 1.2, lines: ['M222 112 L223 133', 'M226 111 L227 132'] },
  // rapier: blade, then hilt + hand
  { d: 'M240 118 L334 60 L336 64 L243 123 Z', fill: C.steel, hl: 'M240 118 L334 60 L335 61 L241 120 Z', hlFill: '#ffffff', ink: 1.4 },
  `<path d="M252 106 L262 108 L264 98 L276 100 L278 90 L290 92 L292 82 L304 84 L306 74" fill="none" stroke="${C.gold}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<path d="M252 106 L262 108 L264 98 L276 100 L278 90 L290 92 L292 82 L304 84 L306 74" fill="none" stroke="${S.ink}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<g stroke="${C.goldD}" stroke-width="1.4" stroke-linecap="round"><path d="M312 70 L318 66"/><path d="M270 90 L268 84"/><path d="M284 104 L288 108"/><path d="M300 92 L306 96"/><path d="M318 80 L324 82"/></g>`,
  { d: 'M222 124 C222 120 226 118 229 120', fill: 'none', ink: 0 },
  `<circle cx="223" cy="126" r="4" fill="${C.gold}" stroke="${S.ink}" stroke-width="1.3"/>`,
  { d: 'M227 116 C233 113 239 117 240 123 C240 130 233 133 227 130 Z', fill: C.flesh, shade: 'M234 128 C238 126 240 124 240 123 C240 130 233 133 227 130 Z', lines: ['M229 120 L237 121', 'M229 125 L238 126'] },
  `<path d="M226 134 C234 144 248 140 248 126 C248 116 240 108 232 110" fill="none" stroke="${S.ink}" stroke-width="4.4" stroke-linecap="round"/>`,
  `<path d="M226 134 C234 144 248 140 248 126 C248 116 240 108 232 110" fill="none" stroke="${C.gold}" stroke-width="2.2" stroke-linecap="round"/>`,
  `<path d="M236 106 L244 140" fill="none" stroke="${S.ink}" stroke-width="4.4" stroke-linecap="round"/><path d="M236 106 L244 140" fill="none" stroke="${C.gold}" stroke-width="2.2" stroke-linecap="round"/>`,
];
fs.writeFileSync(process.argv[2] || 'src/ms_duelist.svg', build(340, 360, S, parts, { filter: 'url(#wob)' }));
