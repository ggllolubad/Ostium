const { build } = require('./lib');
const { S, C, halo } = require('./tn_style');
const fs = require('fs');

// ---------- Tarot Duelist: lean fencer in a long teal coat with flared skirts, rose sash, long scarf in a
// whiplash curve, swept-hilt rapier extended with ochre lightning tendrils, off hand raised. Faces right.
const duelist = [
  `<ellipse cx="166" cy="370" rx="104" ry="7" fill="${S.ink}" opacity="0.25"/>`,
  halo(150, 92, 80, C.creamD, C.ochre),
  // scarf whiplash behind
  { d: 'M140 112 C116 112 96 124 86 146 C78 164 84 182 98 186 C90 172 94 156 108 148 C118 142 132 140 144 132 Z', fill: C.rose,
    shade: 'M86 146 C78 164 84 182 98 186 C92 172 94 160 100 150 Z', shadeFill: 'rgba(43,42,40,0.28)', after: `<path d="M98 186 C108 196 120 190 116 180 C113 174 106 176 108 182" fill="none" stroke="${S.ink}" stroke-width="2.4" stroke-linecap="round"/>` },
  // off arm raised behind
  { d: 'M130 124 C116 116 102 110 92 104 L86 118 C98 124 112 132 124 140 Z', fill: C.teal, shade: 'M86 118 C98 124 112 132 124 140 L126 132 C114 126 100 118 88 112 Z' },
  { d: 'M84 104 L96 108 L92 82 L80 80 Z', fill: C.teal, shade: 'M90 106 L96 108 L92 82 L88 81 Z' },
  { d: 'M78 82 L94 84 L95 76 L79 74 Z', fill: C.cream, ink: 1.8 },
  { d: 'M80 74 C78 64 84 58 90 60 C96 62 98 68 94 76 Z', fill: C.skin, ink: 2.2, lines: ['M84 66 L92 68'] },
  // back leg (lunging back)
  { d: 'M136 222 L156 226 L132 292 L114 286 Z', fill: C.plum, shade: 'M148 224 L156 226 L132 292 L124 289 Z' },
  { d: 'M112 284 L134 292 L118 352 L98 350 Z', fill: C.tealD, shade: 'M126 288 L134 292 L118 352 L110 351 Z', lines: ['M108 300 C116 304 124 304 130 300'] },
  { d: 'M92 346 L120 348 L122 366 L82 366 C80 358 84 350 92 346 Z', fill: C.tealD, ink: 2.6, lines: ['M94 356 L118 357'] },
  // front leg
  { d: 'M158 222 L180 220 L212 286 L192 296 Z', fill: C.plum, shade: 'M174 220 L180 220 L212 286 L204 290 Z' },
  { d: 'M192 288 L214 282 L222 352 L200 354 Z', fill: C.tealD, shade: 'M208 284 L214 282 L222 352 L214 353 Z', lines: ['M196 300 C204 302 212 300 216 296'] },
  { d: 'M198 348 L222 348 C232 354 244 358 252 360 L252 366 L196 366 Z', fill: C.tealD, ink: 2.6, lines: ['M202 356 L232 357'] },
  // coat skirts (flared, split)
  { d: 'M128 196 C120 220 112 250 104 278 C120 284 138 284 152 278 L154 230 L160 278 C176 286 196 282 208 274 C196 248 186 222 182 196 Z', fill: C.teal,
    shade: 'M168 200 L182 196 C186 222 196 248 208 274 C202 278 196 280 190 281 C182 254 174 226 168 200 Z',
    lines: ['M128 220 C124 244 118 262 112 278', 'M142 220 C140 244 138 262 136 280', 'M168 224 C172 246 176 264 180 282'],
    after: `<path d="M104 278 C120 284 138 284 152 278 M160 278 C176 286 196 282 208 274" fill="none" stroke="${C.ochre}" stroke-width="3"/>` },
  // coat body
  { d: 'M126 120 C134 112 168 112 178 120 C182 150 184 176 184 200 L126 200 C124 176 124 150 126 120 Z', fill: C.teal,
    shade: 'M166 116 C172 116 176 118 178 120 C182 150 184 176 184 200 L170 200 C172 172 172 144 166 116 Z',
    lines: ['M136 130 C134 156 134 178 136 198'] },
  // lapel + buttons
  { d: 'M150 118 L170 118 L162 150 L156 200 L150 200 Z', fill: C.tealD, ink: 2 },
  `<g fill="${C.ochreL}" stroke="${S.ink}" stroke-width="1.1"><circle cx="160" cy="132" r="2.2"/><circle cx="159" cy="146" r="2.2"/><circle cx="158" cy="160" r="2.2"/><circle cx="157" cy="174" r="2.2"/></g>`,
  // sash
  { d: 'M124 186 C140 194 168 194 186 186 L188 200 C168 208 140 208 122 200 Z', fill: C.rose, shade: 'M170 190 L186 186 L188 200 L172 204 Z', lines: ['M140 192 L138 204', 'M160 194 L160 206'] },
  { d: 'M130 200 C126 214 128 230 120 244 L132 242 C136 228 136 214 140 202 Z', fill: C.rose, ink: 2 },
  // cravat
  { d: 'M144 112 C150 122 162 122 168 112 L170 128 C164 136 150 136 144 128 Z', fill: C.cream, ink: 2, lines: ['M150 124 L148 132', 'M162 124 L164 132'] },
  // neck, face, hair (shoulder length, wavy), small beard
  { d: 'M148 96 L162 96 L164 116 L146 116 Z', fill: C.skin, shade: 'M156 96 L162 96 L164 116 L158 116 Z' },
  { d: 'M136 58 C126 66 124 88 128 108 C132 116 140 114 142 106 C138 94 138 78 144 66 Z', fill: C.hairD, lines: ['M132 74 C130 86 132 98 136 106'] },
  { d: 'M140 66 C140 54 150 48 160 48 C170 48 178 58 178 70 L184 78 L178 82 C176 92 170 98 160 100 C150 100 142 92 140 82 Z', fill: C.skin,
    shade: 'M168 52 C176 56 178 62 178 70 L184 78 L178 82 C176 92 170 98 160 100 C166 90 170 74 168 52 Z', lines: ['M178 70 L184 78 L178 82'] },
  `<path d="M160 72 C163 70 167 70 169 72" fill="none" stroke="${S.ink}" stroke-width="2" stroke-linecap="round"/><path d="M158 66 L170 66" stroke="${C.hairD}" stroke-width="2.2" stroke-linecap="round"/>`,
  { d: 'M160 86 C166 84 172 86 178 84 C174 90 166 90 160 88 Z', fill: C.hairD, ink: 1.4 },
  { d: 'M164 94 L170 94 L167 102 Z', fill: C.hairD, ink: 1.4 },
  { d: 'M138 66 C136 48 150 38 164 40 C176 42 184 52 182 64 C172 54 158 52 146 58 Z', fill: C.hairD, lines: ['M150 46 C158 48 166 52 172 58'] },
  // hat: plumed, tipped
  { d: 'M134 48 C122 34 102 32 88 42 C102 42 112 46 118 54 C108 54 100 58 94 66 C108 60 124 58 138 56 Z', fill: C.ochreL, shade: 'M94 66 C108 60 124 58 138 56 L134 52 C120 54 104 58 94 66 Z', lines: ['M124 44 L114 40', 'M118 50 L106 46'] },
  { d: 'M136 50 C136 34 150 26 164 28 C174 30 180 38 178 48 C164 52 150 54 136 50 Z', fill: C.plum, hl: 'M142 46 C142 36 150 30 158 30 C152 36 148 42 148 48 Z', hlFill: 'rgba(255,250,236,0.25)' },
  { d: 'M120 54 C134 44 172 38 198 42 C188 50 164 56 142 58 C132 60 124 60 120 54 Z', fill: C.plum, shade: 'M142 58 C164 56 188 50 198 42 C188 52 168 58 150 60 Z' },
  // front arm extended with rapier
  { d: 'M172 122 C188 122 204 128 214 138 L206 150 C196 142 184 138 172 138 Z', fill: C.teal, shade: 'M206 150 C196 142 184 138 172 138 L174 132 C186 132 198 136 210 144 Z' },
  { d: 'M206 136 L234 132 L236 144 L208 150 Z', fill: C.teal, shade: 'M208 150 L236 144 L235 140 L208 146 Z' },
  { d: 'M230 128 L240 126 L242 148 L232 150 Z', fill: C.cream, ink: 1.8, lines: ['M234 128 L235 149', 'M238 127 L239 148'] },
  { d: 'M252 134 L336 92 L338 96 L254 140 Z', fill: C.steelL, hl: 'M252 134 L336 92 L337 93 L253 136 Z', hlFill: '#ffffff', ink: 1.8 },
  `<path d="M262 132 C270 120 280 130 288 118 C296 108 304 118 312 106 C318 98 326 104 330 96" fill="none" stroke="${S.ink}" stroke-width="5" stroke-linecap="round"/><path d="M262 132 C270 120 280 130 288 118 C296 108 304 118 312 106 C318 98 326 104 330 96" fill="none" stroke="${C.ochreL}" stroke-width="2.6" stroke-linecap="round"/>`,
  `<path d="M300 124 C306 126 310 122 308 118 M278 112 C276 106 280 104 284 106" fill="none" stroke="${C.ochre}" stroke-width="2" stroke-linecap="round"/>`,
  { d: 'M240 130 C246 126 254 130 254 138 C254 146 246 150 240 146 Z', fill: C.skin, ink: 2.2, lines: ['M242 134 L252 135', 'M242 140 L252 141'] },
  `<path d="M238 150 C246 164 266 160 266 142 C266 128 256 122 248 124" fill="none" stroke="${S.ink}" stroke-width="5.6" stroke-linecap="round"/><path d="M238 150 C246 164 266 160 266 142 C266 128 256 122 248 124" fill="none" stroke="${C.ochre}" stroke-width="3" stroke-linecap="round"/>`,
  `<circle cx="236" cy="140" r="5" fill="${C.ochreL}" stroke="${S.ink}" stroke-width="2"/>`,
];

// ---------- Tarot Hollow Tidewarden: a towering drowned knight overgrown with coral, kelp and lily pads,
// dark halo of waves, verdigris plate, glowing seafoam eye and heart, anchor on a chain. Faces left.
const warden = [
  `<ellipse cx="150" cy="372" rx="120" ry="8" fill="${S.ink}" opacity="0.3"/>`,
  halo(152, 96, 88, C.tealL, C.tealD, C.tealD),
  `<path d="M74 96 C94 80 112 112 132 96 C152 80 172 112 192 96 C212 80 222 100 230 96" fill="none" stroke="${C.cream}" stroke-width="2.4" stroke-linecap="round"/>`,
  // anchor chain + anchor (left, held)
  { d: 'M58 182 L70 182 L72 330 L58 330 Z', fill: C.steelD, shade: 'M65 182 L70 182 L72 330 L66 330 Z' },
  `<circle cx="64" cy="170" r="11" fill="none" stroke="${S.ink}" stroke-width="8"/><circle cx="64" cy="170" r="11" fill="none" stroke="${C.steelD}" stroke-width="4"/>`,
  { d: 'M38 226 L92 226 L92 236 L38 236 Z', fill: C.steelD, ink: 2.4 },
  { d: 'M24 312 C26 356 106 358 112 314 L100 314 C94 340 38 340 36 312 Z', fill: C.steelD, ink: 2.6 },
  { d: 'M20 302 L38 314 L26 324 Z M116 302 L98 314 L110 324 Z', fill: C.steelD, ink: 2.4 },
  `<path d="M30 340 C40 330 50 346 60 336" fill="none" stroke="${C.sageD}" stroke-width="3" stroke-linecap="round"/>`,
  // legs
  { d: 'M108 270 L140 270 L136 350 L104 350 Z', fill: C.tealD, shade: 'M130 270 L140 270 L136 350 L128 350 Z', lines: ['M110 290 C118 294 130 294 138 290'] },
  { d: 'M160 270 L194 270 L200 350 L166 350 Z', fill: C.tealD, shade: 'M184 270 L194 270 L200 350 L190 350 Z', lines: ['M162 290 C172 294 184 294 194 290'] },
  { d: 'M94 346 L140 346 L142 368 L86 368 C84 358 88 350 94 346 Z', fill: C.tealD, ink: 2.8 },
  { d: 'M162 346 L204 346 C212 352 218 360 220 368 L160 368 Z', fill: C.tealD, ink: 2.8 },
  // fauld
  { d: 'M98 220 C130 232 180 232 206 220 L214 280 C180 292 124 292 92 280 Z', fill: C.teal,
    shade: 'M186 226 L206 220 L214 280 C206 284 196 287 186 289 Z', lines: ['M100 240 C130 250 180 250 208 240', 'M96 260 C130 270 180 270 210 260'] },
  // body plate
  { d: 'M90 116 C90 100 118 92 152 92 C186 92 214 100 214 116 L206 224 C182 236 122 236 98 224 Z', fill: C.teal,
    shade: 'M186 96 C204 100 214 106 214 116 L206 224 C200 228 194 230 186 232 C192 190 192 140 186 96 Z',
    lines: ['M108 140 C130 152 174 152 196 140', 'M106 176 C130 188 174 188 198 176'] },
  // seafoam heart lantern
  `<circle cx="152" cy="162" r="26" fill="${C.seafoam}" opacity="0.35" filter="url(#soft)"/>`,
  { d: 'M152 146 C162 146 168 154 168 162 C168 172 160 180 152 182 C144 180 136 172 136 162 C136 154 142 146 152 146 Z', fill: C.seafoam, ink: 2.6, after: `<path d="M152 152 L152 176 M142 164 L162 164" stroke="${C.tealD}" stroke-width="1.6"/>` },
  // coral growth on shoulders and kelp
  `<path d="M196 104 C206 88 200 72 210 60 M206 82 C216 78 222 70 220 60 M196 104 C188 92 190 80 182 72" fill="none" stroke="${S.ink}" stroke-width="8" stroke-linecap="round"/><path d="M196 104 C206 88 200 72 210 60 M206 82 C216 78 222 70 220 60 M196 104 C188 92 190 80 182 72" fill="none" stroke="${C.rose}" stroke-width="4.6" stroke-linecap="round"/>`,
  `<path d="M110 108 C100 140 116 170 104 210" fill="none" stroke="${S.ink}" stroke-width="7" stroke-linecap="round"/><path d="M110 108 C100 140 116 170 104 210" fill="none" stroke="${C.sageD}" stroke-width="4" stroke-linecap="round"/>`,
  // pauldrons (big, shell-ribbed)
  { d: 'M70 120 C66 96 92 84 118 98 C120 116 108 130 88 134 Z', fill: C.tealL, shade: 'M70 120 C68 110 70 102 76 96 C80 110 86 124 88 134 C80 132 74 128 70 120 Z',
    lines: ['M78 128 L86 100', 'M90 130 L98 98', 'M102 126 L110 100'] },
  { d: 'M186 98 C210 84 236 96 234 120 C222 132 204 132 192 124 Z', fill: C.tealL, shade: 'M222 90 C232 96 236 106 234 120 C230 124 226 126 220 128 C226 116 226 102 222 90 Z',
    lines: ['M196 122 L206 94', 'M208 126 L218 94', 'M220 126 L228 102'] },
  // lily pads and blossom
  { d: 'M74 102 C70 92 84 86 92 92 L84 100 Z', fill: C.sage, ink: 2 },
  `<path d="M214 92 C212 84 220 78 226 82 C230 76 238 80 236 88 C230 94 220 96 214 92 Z" fill="${C.roseL}" stroke="${S.ink}" stroke-width="2"/>`,
  // helm: great helm with drowned face-grille, glowing eye
  { d: 'M120 40 C120 22 136 14 152 14 C168 14 184 22 184 40 L186 96 C168 104 136 104 118 96 Z', fill: C.teal,
    shade: 'M168 18 C178 22 184 30 184 40 L186 96 C180 99 174 101 168 102 C172 74 172 44 168 18 Z', lines: ['M152 16 L152 100', 'M120 60 C140 66 166 66 184 60'] },
  { d: 'M124 64 L148 64 L148 72 L124 72 Z', fill: S.ink, ink: 0 },
  { d: 'M156 64 L182 64 L182 72 L156 72 Z', fill: S.ink, ink: 0 },
  `<circle cx="134" cy="68" r="9" fill="${C.seafoam}" opacity="0.6" filter="url(#soft)"/><circle cx="134" cy="68" r="3.6" fill="${C.seafoam}"/>`,
  `<g fill="${C.cream}" stroke="${S.ink}" stroke-width="1.2"><circle cx="132" cy="30" r="4"/><circle cx="174" cy="44" r="3"/><circle cx="126" cy="88" r="3"/><circle cx="200" cy="200" r="3.5"/><circle cx="110" cy="250" r="3"/></g>`,
  { d: 'M136 14 C140 2 164 2 168 14 C160 10 144 10 136 14 Z', fill: C.rose, ink: 2.2 },
  // arms holding anchor chain
  { d: 'M74 128 L96 136 L80 192 L60 186 Z', fill: C.teal, shade: 'M88 134 L96 136 L80 192 L74 190 Z' },
  { d: 'M50 182 C50 170 78 170 80 182 L78 202 C70 208 56 208 50 200 Z', fill: C.tealL, shade: 'M70 172 L80 182 L78 202 L72 206 Z', lines: ['M52 190 L78 190', 'M52 196 L78 196'] },
  { d: 'M212 122 L232 130 L226 196 L206 194 Z', fill: C.teal, shade: 'M224 128 L232 130 L226 196 L218 195 Z' },
  { d: 'M202 192 C202 180 228 180 230 192 L228 210 C220 216 208 216 202 208 Z', fill: C.tealL, ink: 2.6, lines: ['M204 200 L228 200'] },
];

// ---------- Tarot Brine Siren: Mucha mermaid in a wave-ringed dark halo, a torrent of plum hair, lily crown,
// shell bodice, holding a lantern of seafoam light; sinuous sage tail ending in a rose fluke. Faces left.
const siren = [
  `<ellipse cx="150" cy="372" rx="90" ry="7" fill="${S.ink}" opacity="0.25"/>`,
  halo(150, 98, 82, C.tealL, C.tealD, C.tealD),
  `<path d="M78 98 C96 84 112 112 130 98 C148 84 164 112 182 98 C200 84 212 104 222 98" fill="none" stroke="${C.cream}" stroke-width="2.4" stroke-linecap="round"/>`,
  // tail
  `<path d="M146 200 C128 240 140 268 172 276 C210 284 222 312 194 330 C164 348 120 344 92 330" fill="none" stroke="${S.ink}" stroke-width="40" stroke-linecap="round"/>`,
  `<path d="M146 200 C128 240 140 268 172 276 C210 284 222 312 194 330 C164 348 120 344 92 330" fill="none" stroke="${C.sage}" stroke-width="34" stroke-linecap="round"/>`,
  `<path d="M150 204 C134 240 146 262 174 268 C206 276 214 304 192 320" fill="none" stroke="${C.sageD}" stroke-width="10" stroke-linecap="round" opacity="0.6"/>`,
  `<g fill="none" stroke="${S.ink}" stroke-width="1.3">${[[140, 226], [146, 250], [168, 268], [196, 284], [206, 306], [180, 330], [150, 338], [120, 334]].map(([x, y]) => `<path d="M${x - 8} ${y} C${x - 4} ${y + 6} ${x + 4} ${y + 6} ${x + 8} ${y}"/>`).join('')}</g>`,
  { d: 'M94 330 C76 310 56 314 46 326 C60 330 64 342 58 356 C72 352 84 342 94 330 Z', fill: C.rose, shade: 'M94 330 C84 342 72 352 58 356 C66 346 72 338 80 334 Z', lines: ['M86 330 L60 322', 'M84 336 L62 342'] },
  // hair torrent behind
  { d: 'M150 40 C112 40 96 70 102 104 C90 140 70 170 46 190 C78 194 102 176 116 150 L128 120 Z', fill: C.plum,
    shade: 'M46 190 C70 170 90 140 102 104 L110 108 C100 142 82 172 54 192 Z', lines: ['M118 60 C108 90 104 120 84 156', 'M126 80 C118 112 112 140 96 170'],
    after: `<path d="M46 190 C36 194 30 184 36 178 C40 174 46 178 44 184" fill="none" stroke="${S.ink}" stroke-width="2.4" stroke-linecap="round"/>` },
  { d: 'M154 40 C192 40 206 72 198 106 C210 142 230 170 252 186 C220 192 196 174 184 148 L174 118 Z', fill: C.plum,
    shade: 'M198 106 C210 142 230 170 252 186 C236 186 222 178 210 166 C208 146 204 124 198 106 Z', lines: ['M182 60 C192 90 196 120 214 156', 'M176 84 C184 116 188 140 204 168'],
    after: `<path d="M252 186 C262 190 268 180 262 174 C258 170 252 174 254 180" fill="none" stroke="${S.ink}" stroke-width="2.4" stroke-linecap="round"/>` },
  // torso + shell bodice
  { d: 'M128 130 C136 122 164 122 172 130 C170 150 166 170 164 188 C166 196 168 202 170 208 L130 208 C132 202 134 196 136 188 C134 170 130 150 128 130 Z', fill: C.skin,
    shade: 'M160 124 C166 126 170 128 172 130 C170 150 166 170 164 188 C166 196 168 202 170 208 L160 208 C158 180 162 150 160 124 Z' },
  { d: 'M132 146 C140 140 148 140 150 150 C152 140 160 140 168 146 L166 166 C158 172 142 172 134 166 Z', fill: C.roseL, ink: 2.2,
    lines: ['M138 146 L140 166', 'M144 144 L145 168', 'M156 144 L155 168', 'M162 146 L160 166'] },
  { d: 'M126 202 C140 214 160 214 174 202 L178 214 L166 218 L158 226 L150 218 L142 226 L134 218 L122 214 Z', fill: C.ochre, ink: 2, lines: ['M140 210 L140 220', 'M160 210 L160 220'] },
  // lantern arm (front, toward left)
  { d: 'M134 136 C120 142 106 150 94 158 L100 170 C112 162 126 156 138 152 Z', fill: C.skin, shade: 'M100 170 C112 162 126 156 138 152 L136 146 C124 150 110 156 98 164 Z' },
  { d: 'M84 152 C82 144 90 140 96 144 C102 148 102 156 96 160 C90 164 84 160 84 152 Z', fill: C.skin, ink: 2.2 },
  `<circle cx="74" cy="182" r="22" fill="${C.seafoam}" opacity="0.5" filter="url(#soft)"/>`,
  `<path d="M74 148 C74 140 86 140 86 148" fill="none" stroke="${S.ink}" stroke-width="2.2"/>`,
  { d: 'M64 156 L96 156 L92 164 L68 164 Z', fill: C.ochre, ink: 2 },
  { d: 'M68 164 C60 176 62 196 74 204 C86 196 88 176 80 164 Z', fill: C.seafoam, ink: 2.4, after: `<path d="M68 164 C64 178 66 194 74 204 C82 194 84 178 80 164" fill="none" stroke="${C.ochre}" stroke-width="1.6"/>` },
  { d: 'M66 204 L82 204 L80 212 L68 212 Z', fill: C.ochre, ink: 2 },
  // other arm resting on tail/hip
  { d: 'M166 136 C178 150 182 170 178 190 L166 192 C168 174 164 156 156 146 Z', fill: C.skin, shade: 'M172 150 C178 162 180 176 178 190 L172 191 C174 176 174 162 172 150 Z' },
  // neck + face (facing left 3/4)
  { d: 'M142 108 L158 108 L160 130 L140 130 Z', fill: C.skin, shade: 'M152 108 L158 108 L160 130 L154 130 Z' },
  { d: 'M124 80 C124 66 136 58 146 58 C158 58 166 66 166 80 C166 94 158 108 146 110 C136 110 128 102 126 94 L120 88 L126 84 Z', fill: C.skin,
    shade: 'M156 62 C164 66 166 74 166 80 C166 94 158 108 146 110 C154 100 158 86 156 62 Z' },
  `<path d="M130 82 C133 80 137 80 139 82 M146 82 C148 80 152 80 154 82" fill="none" stroke="${S.ink}" stroke-width="1.8" stroke-linecap="round"/>`,
  `<path d="M129 77 C133 75 137 75 140 77 M145 77 C148 75 152 75 155 77" fill="none" stroke="${C.plum}" stroke-width="1.6" stroke-linecap="round"/>`,
  `<path d="M134 102 C137 104 141 104 143 102" fill="none" stroke="${C.roseD}" stroke-width="2.2" stroke-linecap="round"/>`,
  // hair fringe + lily crown
  { d: 'M122 84 C118 60 134 46 150 46 C166 46 176 60 172 82 C164 70 152 64 140 66 C132 68 126 74 122 84 Z', fill: C.plum, lines: ['M134 54 C142 56 150 60 156 68'] },
  `<g stroke="${S.ink}" stroke-width="1.8">${[[126, 58], [146, 46], [166, 56]].map(([x, y]) => `<path d="M${x} ${y} C${x - 8} ${y - 4} ${x - 8} ${y - 14} ${x} ${y - 18} C${x + 8} ${y - 14} ${x + 8} ${y - 4} ${x} ${y} Z" fill="${C.roseL}"/><path d="M${x} ${y} C${x - 10} ${y} ${x - 14} ${y - 6} ${x - 12} ${y - 10} M${x} ${y} C${x + 10} ${y} ${x + 14} ${y - 6} ${x + 12} ${y - 10}" fill="none"/>`).join('')}</g>`,
  `<g fill="${C.cream}" stroke="${S.ink}" stroke-width="1"><circle cx="136" cy="138" r="2"/><circle cx="142" cy="141" r="2"/><circle cx="150" cy="142" r="2"/><circle cx="158" cy="141" r="2"/><circle cx="164" cy="138" r="2"/></g>`,
];

fs.writeFileSync('src/tn_duelist.svg', build(340, 380, S, duelist));
fs.writeFileSync('src/tn_warden.svg', build(300, 380, S, warden));
fs.writeFileSync('src/tn_siren.svg', build(300, 380, S, siren));
