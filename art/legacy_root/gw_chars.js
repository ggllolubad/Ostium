const { build } = require('./lib');
const { S, C, brush } = require('./gw_style');
const fs = require('fs');
const WARM = 'rgba(255,214,160,0.32)', RIM = 'rgba(150,220,210,0.35)';

// ---------- Painterly Bulwark: heavy plate, T-visor barbute with horsehair crest, tattered cape,
// warhammer on the shoulder, and a shield that is literally a reinforced dungeon door. Faces right.
const bulwark = [
  `<ellipse cx="160" cy="368" rx="110" ry="10" fill="#05070b" opacity="0.55"/>`,
  // cape
  { d: 'M104 112 C80 150 66 220 62 300 L76 290 L82 314 L94 296 L102 320 L114 300 L122 140 Z', fill: C.redD, shade: 'M62 300 L76 290 L82 314 L94 296 L102 320 L108 260 C90 270 74 284 62 300 Z',
    after: brush('M100 140 C88 180 80 230 78 280', 'rgba(255,190,150,0.18)', 6, 1) },
  // warhammer (behind arm)
  { d: 'M97 222 L106 221 L80 60 L72 62 Z', fill: C.wood, shade: 'M102 221 L106 221 L80 60 L77 61 Z', lines: ['M84 100 L92 98', 'M88 120 L96 118'] },
  { d: 'M46 44 L98 36 L102 62 L50 70 Z', fill: C.steel, hl: 'M46 44 L98 36 L99 44 L47 52 Z', hlFill: WARM, shade: 'M50 62 L102 54 L102 62 L50 70 Z' },
  { d: 'M46 48 L28 54 L46 62 Z', fill: C.steelD, ink: 1.4 },
  { d: 'M98 40 L114 34 L112 50 L100 52 Z', fill: C.steelL, ink: 1.4 },
  // back leg
  { d: 'M110 236 L142 238 L138 300 L134 350 L106 350 L108 300 Z', fill: C.steelD, shade: 'M128 238 L142 238 L138 300 L134 350 L126 350 Z', hl: 'M110 240 L118 240 L114 346 L108 346 Z' },
  { d: 'M104 290 C104 280 136 280 138 290 L136 308 C128 314 112 314 106 308 Z', fill: C.steel, hl: 'M106 288 C112 282 124 282 132 286 L130 292 C122 290 112 290 106 294 Z', hlFill: WARM, shade: 'M126 284 L138 290 L136 308 L126 312 Z' },
  { d: 'M96 344 L136 344 L142 368 L88 368 Z', fill: C.iron, hl: 'M98 346 L130 346 L132 352 L98 352 Z', hlFill: WARM },
  // front leg
  { d: 'M146 236 L180 236 L192 300 L198 350 L168 352 L160 300 Z', fill: C.steelD, shade: 'M170 236 L180 236 L192 300 L198 350 L186 351 Z' },
  { d: 'M162 346 L198 344 C210 352 218 360 222 368 L158 368 Z', fill: C.iron, hl: 'M164 348 L196 346 L200 352 L164 354 Z', hlFill: WARM },
  // tabard
  { d: 'M116 210 L172 210 L178 302 L162 296 L152 312 L140 294 L124 304 Z', fill: C.red, shade: 'M156 210 L172 210 L178 302 L162 296 L156 304 Z',
    after: brush('M126 220 C124 250 124 270 128 296', 'rgba(255,190,150,0.22)', 5, 1) },
  // torso plate
  { d: 'M92 120 C92 104 112 96 144 96 C176 96 198 104 198 120 L186 222 L106 222 Z', fill: C.steel,
    hl: 'M96 116 C98 106 112 100 130 100 C120 120 116 160 116 220 L106 220 Z', hlFill: WARM,
    shade: 'M172 100 C188 104 198 110 198 120 L186 222 L168 222 C176 180 176 136 172 100 Z', shade2: 'M190 150 L186 222 L180 222 C184 196 186 172 190 150 Z',
    lines: ['M144 104 L146 218', 'M108 170 C130 178 162 178 190 170'] },
  `<path d="M196 130 C194 160 190 190 186 220" fill="none" stroke="${RIM}" stroke-width="4" stroke-linecap="round"/>`,
  { d: 'M104 212 L190 212 L190 226 L104 226 Z', fill: C.woodD, ink: 1.3, after: `<rect x="138" y="210" width="16" height="18" fill="${C.bronze}" stroke="${C.ink}" stroke-width="1.3"/>` },
  // back arm + gauntlet
  { d: 'M84 134 L110 140 L106 186 L82 184 Z', fill: C.steelD, hl: 'M86 136 L94 138 L90 184 L84 184 Z', hlFill: WARM },
  { d: 'M82 180 L106 184 L112 212 L90 216 Z', fill: C.steel, shade: 'M100 183 L106 184 L112 212 L104 213 Z' },
  { d: 'M88 206 C88 198 112 196 114 206 L112 228 C104 234 92 232 88 224 Z', fill: C.steel, hl: 'M90 204 C96 200 104 200 110 202 L108 208 C102 206 96 206 90 210 Z', hlFill: WARM, lines: ['M90 214 L112 214', 'M90 220 L112 220'] },
  // pauldrons
  { d: 'M74 128 C70 102 94 90 122 98 C128 116 120 136 100 144 C88 144 78 140 74 128 Z', fill: C.steel,
    hl: 'M78 120 C78 106 92 96 110 98 C98 106 90 116 88 132 Z', hlFill: WARM, shade: 'M114 104 C124 112 124 128 112 140 C106 142 102 144 100 144 C110 132 114 118 114 104 Z',
    lines: ['M76 132 C88 136 104 132 118 120'] },
  { d: 'M168 98 C190 90 214 98 216 122 C206 136 190 140 176 136 Z', fill: C.steel, shade: 'M196 94 C210 100 216 110 216 122 C206 136 192 140 184 139 C194 128 198 112 196 94 Z',
    lines: ['M172 122 C186 124 200 120 212 114'] },
  `<path d="M210 108 C214 116 214 124 210 130" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>`,
  // gorget + helm
  { d: 'M118 94 C130 102 160 102 172 94 L174 110 C160 118 130 118 116 110 Z', fill: C.steelD, ink: 1.3, lines: ['M120 102 C134 108 158 108 172 102'] },
  { d: 'M120 70 C118 46 130 30 146 30 C162 30 176 46 174 70 L172 98 C160 106 132 106 122 98 Z', fill: C.steel,
    hl: 'M124 66 C124 48 132 36 144 34 C136 46 132 58 132 72 Z', hlFill: WARM, shade: 'M160 36 C170 44 176 56 174 70 L172 98 C168 101 164 102 160 103 C164 80 164 56 160 36 Z' },
  { d: 'M143 54 L151 54 L151 92 L143 92 Z', fill: '#07090c', ink: 0 },
  { d: 'M126 56 L168 56 L168 64 L126 64 Z', fill: '#07090c', ink: 0 },
  `<path d="M172 68 C174 80 174 90 170 98" fill="none" stroke="${RIM}" stroke-width="3" stroke-linecap="round"/>`,
  { d: 'M140 30 C140 20 152 18 156 26 C150 30 144 32 140 30 Z', fill: C.bronze, ink: 1.2 },
  { d: 'M146 24 C126 18 108 26 98 44 C94 54 96 64 102 70 C102 56 112 42 128 38 C112 50 108 64 112 78 C116 60 128 46 146 40 Z', fill: C.redD,
    after: brush('M140 26 C124 28 112 38 106 52', 'rgba(255,170,140,0.25)', 3, 1) },
  // door shield
  { d: 'M148 152 C148 108 252 108 252 152 L252 342 L148 342 Z', fill: C.wood,
    hl: 'M152 150 C152 122 168 112 186 110 L186 340 L152 340 Z', hlFill: 'rgba(255,214,160,0.16)',
    shade: 'M228 116 C244 124 252 136 252 152 L252 342 L230 342 Z', lines: ['M174 116 L174 342', 'M200 110 L200 342', 'M226 116 L226 342', 'M160 200 C162 220 160 240 162 260', 'M186 150 C188 180 186 200 188 230', 'M212 260 C214 280 212 300 214 330', 'M238 170 C240 190 238 210 240 230'] },
  { d: 'M148 176 L252 176 L252 188 L148 188 Z', fill: C.iron, hl: 'M148 176 L252 176 L252 179 L148 179 Z', hlFill: WARM },
  { d: 'M148 296 L252 296 L252 308 L148 308 Z', fill: C.iron, hl: 'M148 296 L252 296 L252 299 L148 299 Z', hlFill: WARM },
  `<path d="M150 342 L150 152 C150 110 250 110 250 152 L250 342" fill="none" stroke="${C.iron}" stroke-width="7"/>`,
  `<g fill="${C.steelL}" stroke="${C.ink}" stroke-width="0.9">${[160, 180, 200, 220, 240].map(x => `<circle cx="${x}" cy="182" r="2.4"/><circle cx="${x}" cy="302" r="2.4"/>`).join('')}</g>`,
  { d: 'M182 134 L218 134 L218 162 L182 162 Z', fill: '#07090c', ink: 1.4, after: `<path d="M191 134 L191 162 M200 134 L200 162 M209 134 L209 162" stroke="${C.iron}" stroke-width="3.2"/><path d="M182 148 L218 148" stroke="${C.iron}" stroke-width="2.4"/>` },
  `<circle cx="230" cy="240" r="10" fill="none" stroke="${C.ink}" stroke-width="5"/><circle cx="230" cy="240" r="10" fill="none" stroke="${C.steelL}" stroke-width="2.6"/><circle cx="230" cy="230" r="3" fill="${C.iron}" stroke="${C.ink}" stroke-width="1"/>`,
  `<path d="M248 150 C252 200 252 280 248 340" fill="none" stroke="${RIM}" stroke-width="4" stroke-linecap="round"/>`,
  `<path d="M160 200 L172 210 M218 250 L228 262 M168 320 L176 312" stroke="#2a1c12" stroke-width="2" stroke-linecap="round"/>`,
  // fingers wrapping door edge
  { d: 'M144 230 C150 226 158 228 158 236 L158 252 C152 256 146 254 144 248 Z', fill: C.steel, ink: 1.4, lines: ['M146 238 L158 238', 'M146 244 L158 244'] },
];

// ---------- Painterly Elementalist: hunched old occultist under a vast crooked hat, scarred grey beard,
// plum robe and mustard scarf, open grimoire with a glowing rune in one hand, staff with a caged lantern
// of four-coloured flame in the other. Faces right.
const elementalist = [
  `<ellipse cx="150" cy="368" rx="96" ry="10" fill="#05070b" opacity="0.55"/>`,
  `<circle cx="214" cy="56" r="40" fill="${C.glow}" opacity="0.35" filter="url(#glow)"/>`,
  `<circle cx="86" cy="186" r="28" fill="${C.glowB}" opacity="0.35" filter="url(#glow)"/>`,
  // staff
  { d: 'M210 76 L218 76 L220 368 L212 368 Z', fill: C.woodD, hl: 'M210 76 L213 76 L215 368 L212 368 Z', hlFill: WARM, lines: ['M210 140 L218 138', 'M211 230 L219 228'] },
  // robe (hunched)
  { d: 'M110 110 C94 140 90 200 96 260 C92 300 84 340 78 368 L212 368 C202 330 194 290 192 250 C198 200 192 150 178 112 Z', fill: C.cloth,
    hl: 'M104 140 C98 180 98 230 104 270 C100 310 94 340 90 366 L112 366 C116 320 118 270 116 220 C116 180 114 150 112 128 Z', hlFill: 'rgba(255,214,160,0.14)',
    shade: 'M168 112 C186 150 196 200 190 250 C192 290 200 330 212 368 L178 368 C178 300 178 220 168 112 Z',
    lines: ['M128 200 C126 260 122 310 116 366', 'M152 220 C154 280 154 320 152 366', 'M176 240 C180 290 184 330 190 366'] },
  `<path d="M192 200 C196 260 200 320 210 366" fill="none" stroke="${RIM}" stroke-width="4" stroke-linecap="round"/>`,
  // hem rags
  { d: 'M80 360 L96 350 L104 368 L118 352 L128 368 L146 354 L156 368 L172 354 L182 368 L198 354 L212 368 Z', fill: C.cloth, ink: 1.2 },
  // belt with pouches, hanging vial
  { d: 'M100 226 C130 236 166 236 194 226 L194 238 C166 248 130 248 100 238 Z', fill: C.woodD, ink: 1.2 },
  { d: 'M110 236 L126 236 L128 258 L108 258 Z', fill: C.wood, ink: 1.2, hl: 'M110 236 L116 236 L116 258 L109 258 Z', hlFill: WARM },
  { d: 'M168 238 L176 238 L178 262 C178 268 166 268 166 262 Z', fill: C.glowB, ink: 1.2, after: `<circle cx="172" cy="258" r="8" fill="${C.glowB}" opacity="0.4" filter="url(#glow2)"/>` },
  // mustard scarf / mantle
  { d: 'M104 106 C120 96 168 96 184 108 C190 130 186 150 176 162 L164 150 L156 170 L144 152 L132 170 L124 150 L110 160 C102 146 100 126 104 106 Z', fill: C.mustard,
    hl: 'M108 110 C120 102 140 100 154 102 C136 110 120 126 116 150 L110 158 C104 142 104 124 108 110 Z', hlFill: WARM, shade: 'M170 104 C182 108 188 120 186 136 C184 148 180 156 176 162 L168 150 C176 136 176 120 170 104 Z' },
  // book arm (left) + open grimoire with rune
  { d: 'M112 122 C98 140 90 160 86 180 L104 186 C108 168 116 152 126 140 Z', fill: C.cloth, shade: 'M86 180 L104 186 C106 178 108 170 112 162 L94 158 C90 164 88 172 86 180 Z' },
  { d: 'M58 178 L94 170 L100 198 L64 206 Z', fill: C.redD, ink: 1.4 },
  { d: 'M62 176 L92 170 L96 192 L66 198 Z', fill: C.bone, hl: 'M62 176 L77 173 L80 195 L66 198 Z', hlFill: 'rgba(255,240,210,0.4)', lines: ['M78 172 L81 195', 'M66 182 L74 180', 'M66 187 L74 185', 'M84 178 L91 176'] },
  `<path d="M84 182 L88 188 L84 192 L80 186 Z" fill="${C.glowB}" stroke="${C.tealD}" stroke-width="1"/><circle cx="84" cy="187" r="10" fill="${C.glowB}" opacity="0.5" filter="url(#glow2)"/>`,
  { d: 'M88 194 C92 188 104 188 104 196 L102 204 C96 208 90 206 88 200 Z', fill: C.skin, shade: 'M98 189 L104 196 L102 204 L98 206 Z' },
  // staff arm (right) + gnarled hand
  { d: 'M176 116 C192 128 202 148 206 168 L210 196 L194 200 C190 178 184 158 172 144 Z', fill: C.cloth, shade: 'M196 140 C202 152 206 160 206 168 L210 196 L202 198 C200 176 198 158 196 140 Z' },
  { d: 'M204 190 C210 184 222 186 224 194 L222 210 C216 214 208 212 204 206 Z', fill: C.skin, shade: 'M216 187 L224 194 L222 210 L216 212 Z', lines: ['M206 198 L222 198', 'M206 204 L222 204'] },
  // caged lantern on staff head
  { d: 'M200 40 L228 40 L230 76 L198 76 Z', fill: 'none', ink: 0, after: '' },
  `<path d="M214 28 L214 40" stroke="${C.iron}" stroke-width="3"/>`,
  { d: 'M202 44 L226 44 L226 72 L202 72 Z', fill: C.glow, ink: 0 },
  `<path d="M214 70 C206 64 206 56 210 50 C212 56 216 56 214 48 C220 54 222 62 216 70 Z" fill="#e0603a"/><path d="M210 70 C206 66 206 60 208 56" fill="none" stroke="#5aa0e0" stroke-width="2.4" stroke-linecap="round"/><path d="M220 68 C224 62 222 56 218 52" fill="none" stroke="#e8f2f4" stroke-width="2" stroke-linecap="round"/><path d="M212 60 L216 56 L214 62 L218 58" fill="none" stroke="${C.glow}" stroke-width="1.6"/>`,
  `<path d="M200 42 L228 42 M200 74 L228 74" stroke="${C.iron}" stroke-width="4" stroke-linecap="round"/><path d="M202 42 L202 74 M214 42 L214 74 M226 42 L226 74" stroke="${C.iron}" stroke-width="2.4"/><path d="M198 42 C198 32 230 32 230 42" fill="${C.iron}" stroke="${C.ink}" stroke-width="1.2"/>`,
  // face under brim, beard
  { d: 'M136 100 C136 92 160 90 170 96 L188 108 L174 112 C172 124 162 130 152 130 C142 130 136 120 136 112 Z', fill: C.skin,
    shade: 'M136 100 C140 96 154 94 168 96 L170 104 C158 102 146 104 138 110 Z', shadeFill: 'rgba(8,12,20,0.55)', lines: ['M170 96 L188 108 L174 112'] },
  `<circle cx="164" cy="106" r="1.8" fill="${C.glow}"/>`,
  { d: 'M140 114 C142 142 150 164 146 188 C162 172 176 150 174 116 C164 124 152 124 140 114 Z', fill: C.bone,
    hl: 'M144 118 C146 140 150 156 148 176 C152 160 152 140 150 120 Z', hlFill: 'rgba(255,240,210,0.35)', shade: 'M164 120 C172 118 174 116 174 116 C176 150 162 172 146 188 C160 166 166 146 164 120 Z',
    lines: ['M152 128 C156 148 154 166 150 180', 'M160 126 C164 144 162 160 158 174'] },
  // hat: crown + brim
  { d: 'M112 90 C116 60 130 32 162 14 C160 36 170 52 188 60 C184 70 186 80 190 90 Z', fill: '#2e2433',
    hl: 'M118 86 C122 62 134 40 156 24 C142 46 134 66 132 88 Z', hlFill: 'rgba(255,214,160,0.16)', lines: ['M118 80 C140 74 166 74 188 82'] },
  { d: 'M116 80 C140 72 168 72 190 82 L190 90 C168 82 140 82 116 90 Z', fill: C.mustard, ink: 1.2 },
  { d: 'M64 96 C86 78 214 78 236 96 C214 108 86 108 64 96 Z', fill: '#2e2433', hl: 'M70 94 C92 84 140 82 170 84 C130 86 96 90 78 98 Z', hlFill: 'rgba(255,214,160,0.18)', shade: 'M64 96 C86 108 214 108 236 96 C214 102 86 102 64 96 Z', shade2: 'M100 100 C130 106 170 106 200 100 L200 104 C170 110 130 110 100 104 Z' },
  `<path d="M226 92 C232 96 234 100 230 102" fill="none" stroke="${RIM}" stroke-width="3" stroke-linecap="round"/>`,
  // motes
  `<g><circle cx="44" cy="140" r="5" fill="#e0603a"/><circle cx="44" cy="140" r="10" fill="#e0603a" opacity="0.35" filter="url(#glow2)"/><circle cx="250" cy="120" r="4.5" fill="#e8f2f4"/><circle cx="250" cy="120" r="9" fill="#e8f2f4" opacity="0.35" filter="url(#glow2)"/><circle cx="56" cy="250" r="4" fill="#5aa0e0"/><circle cx="56" cy="250" r="9" fill="#5aa0e0" opacity="0.35" filter="url(#glow2)"/></g>`,
];

// ---------- Painterly Duelist: lanky highway duelist in a long dark-teal greatcoat, tricorn, red scarf,
// rapier extended with crackling lightning, off hand back holding a stiletto. Faces right.
const duelist = [
  `<ellipse cx="170" cy="368" rx="116" ry="10" fill="#05070b" opacity="0.55"/>`,
  `<circle cx="300" cy="96" r="30" fill="${C.glow}" opacity="0.25" filter="url(#glow)"/>`,
  // off arm back with stiletto
  { d: 'M126 122 C112 120 98 124 88 134 L94 146 C104 138 116 136 128 138 Z', fill: C.tealD, shade: 'M88 134 L94 146 C100 142 106 140 112 138 L106 128 C98 130 92 132 88 134 Z' },
  { d: 'M88 132 L100 142 L82 166 L70 156 Z', fill: C.tealD },
  { d: 'M66 158 C64 150 72 146 78 150 C84 154 84 162 78 166 C72 170 66 166 66 158 Z', fill: C.skin, ink: 1.4 },
  { d: 'M66 162 L44 186 L46 188 L70 166 Z', fill: C.steelL, ink: 1.2 },
  // coat tails back
  { d: 'M122 196 C106 240 96 290 86 340 L110 344 L128 300 L140 210 Z', fill: C.tealD, shade: 'M86 340 L110 344 L118 320 C108 300 104 280 104 260 Z' },
  // legs
  { d: 'M136 226 L156 230 L132 294 L114 288 Z', fill: '#2a2a30', shade: 'M148 228 L156 230 L132 294 L124 291 Z' },
  { d: 'M112 286 L134 294 L118 350 L98 348 Z', fill: C.woodD, hl: 'M112 288 L118 290 L102 348 L98 348 Z', hlFill: WARM },
  { d: 'M92 344 L120 346 L122 368 L80 368 C80 358 84 350 92 344 Z', fill: '#1d1a18', hl: 'M92 346 L116 348 L116 352 L92 352 Z', hlFill: WARM },
  { d: 'M160 226 L182 224 L214 288 L194 298 Z', fill: '#2a2a30', shade: 'M176 224 L182 224 L214 288 L206 292 Z' },
  { d: 'M194 290 L216 284 L222 350 L200 352 Z', fill: C.woodD, hl: 'M194 292 L200 290 L204 350 L200 352 Z', hlFill: WARM },
  { d: 'M198 346 L222 346 C234 352 246 358 254 362 L254 368 L196 368 Z', fill: '#1d1a18', hl: 'M200 348 L226 348 L232 352 L200 352 Z', hlFill: WARM },
  // greatcoat body + front tails
  { d: 'M124 116 C134 106 170 106 182 116 C186 150 188 180 188 206 C196 240 208 280 220 316 C200 324 176 322 164 312 L160 230 L154 312 C142 320 128 318 118 310 C124 270 126 236 124 206 C122 176 122 146 124 116 Z', fill: C.teal,
    hl: 'M128 120 C134 114 146 112 156 112 C142 130 136 170 136 210 C136 250 132 286 128 310 L120 308 C126 270 128 236 126 206 C124 176 124 146 128 120 Z', hlFill: WARM,
    shade: 'M168 110 C178 112 182 116 182 116 C186 150 188 180 188 206 C196 240 208 280 220 316 C212 319 204 320 196 320 C188 280 178 220 168 110 Z',
    lines: ['M152 116 L156 230', 'M136 214 C134 250 130 280 126 306', 'M176 240 C182 270 190 296 198 318'] },
  `<path d="M186 180 C190 230 204 280 218 314" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>`,
  `<g fill="${C.bronzeL}" stroke="${C.ink}" stroke-width="0.9">${[136, 152, 168, 184].map(y => `<circle cx="160" cy="${y}" r="2.4"/>`).join('')}</g>`,
  { d: 'M126 196 C146 204 168 204 188 196 L188 208 C168 216 146 216 126 208 Z', fill: C.woodD, ink: 1.2, after: `<rect x="150" y="196" width="14" height="14" fill="${C.bronze}" stroke="${C.ink}" stroke-width="1.1"/>` },
  // red scarf
  { d: 'M136 104 C148 116 166 116 178 104 L180 120 C168 132 146 132 134 120 Z', fill: C.red, hl: 'M138 108 C146 116 156 118 164 118 L162 124 C154 124 144 122 136 116 Z', hlFill: WARM },
  { d: 'M140 118 C126 128 116 146 112 168 L122 170 C126 152 134 138 146 128 Z', fill: C.red, shade: 'M112 168 L122 170 C124 160 128 150 134 142 L126 136 C120 146 114 156 112 168 Z' },
  // head + tricorn
  { d: 'M148 88 L162 88 L164 106 L146 106 Z', fill: C.skin, shade: 'M156 88 L162 88 L164 106 L158 106 Z', shadeFill: 'rgba(8,12,20,0.5)' },
  { d: 'M142 60 C142 48 152 42 162 42 C172 42 180 52 180 64 L186 72 L180 76 C178 86 172 92 162 94 C152 94 144 86 142 76 Z', fill: C.skin,
    shade: 'M142 60 C146 54 156 52 170 54 L170 62 C158 60 148 64 144 72 Z', shadeFill: 'rgba(8,12,20,0.5)', lines: ['M180 64 L186 72 L180 76'] },
  `<path d="M164 66 C167 64 171 64 173 66" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round"/><circle cx="169" cy="67" r="1.2" fill="${C.glow}"/>`,
  { d: 'M162 80 C168 78 176 80 182 78 C178 84 168 84 162 82 Z', fill: '#2a1c14', ink: 1 },
  `<path d="M170 86 L172 94" stroke="#2a1c14" stroke-width="2.4" stroke-linecap="round"/><path d="M150 70 C156 74 158 80 156 86" fill="none" stroke="#8a4a3a" stroke-width="1.6" stroke-linecap="round"/>`,
  { d: 'M140 56 C136 66 136 80 140 92 C134 88 130 76 132 64 Z', fill: '#2a1c14', ink: 1.2 },
  { d: 'M126 52 C140 44 168 36 196 40 L190 50 C176 48 162 50 150 54 C140 56 132 58 126 52 Z', fill: '#1d1a20', hl: 'M128 50 C142 44 160 40 176 40 C160 44 144 48 132 54 Z', hlFill: WARM },
  { d: 'M140 50 C140 34 152 26 164 26 C176 26 184 34 184 46 C170 50 154 52 140 50 Z', fill: '#1d1a20', hl: 'M144 46 C144 36 150 30 158 28 C152 34 150 40 150 48 Z', hlFill: 'rgba(255,214,160,0.18)' },
  { d: 'M184 46 L198 40 L190 52 Z', fill: '#1d1a20', ink: 1.2 },
  { d: 'M140 50 C152 52 170 50 184 46 L184 50 C170 54 152 56 140 54 Z', fill: C.red, ink: 1 },
  // sword arm extended + rapier
  { d: 'M176 116 C194 116 212 124 222 134 L214 148 C204 140 190 136 176 136 Z', fill: C.teal, hl: 'M178 118 C192 118 206 122 216 130 L212 134 C202 128 190 124 178 124 Z', hlFill: WARM },
  { d: 'M214 132 L246 128 L248 142 L216 148 Z', fill: C.teal, shade: 'M216 148 L248 142 L247 138 L216 144 Z' },
  { d: 'M242 124 L252 122 L254 146 L244 148 Z', fill: C.bone, ink: 1.2 },
  { d: 'M262 132 L336 88 L338 92 L264 138 Z', fill: C.steelL, hl: 'M262 132 L336 88 L337 89 L263 134 Z', hlFill: '#ffffff', ink: 1.2 },
  `<path d="M270 128 L280 118 L284 126 L296 112 L300 120 L312 104 L316 110 L328 96" fill="none" stroke="${C.glow}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" opacity="0.5" filter="url(#glow2)"/>`,
  `<path d="M270 128 L280 118 L284 126 L296 112 L300 120 L312 104 L316 110 L328 96" fill="none" stroke="#fff6d8" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`,
  `<g stroke="${C.glow}" stroke-width="1.6" stroke-linecap="round"><path d="M304 124 L312 128"/><path d="M288 108 L284 100"/><path d="M322 112 L330 116"/></g>`,
  { d: 'M252 126 C258 122 266 126 266 134 C266 142 258 146 252 142 Z', fill: C.skin, ink: 1.4, lines: ['M254 130 L264 131', 'M254 136 L264 137'] },
  `<path d="M250 146 C258 160 278 156 278 138 C278 124 268 118 260 120" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="M250 146 C258 160 278 156 278 138 C278 124 268 118 260 120" fill="none" stroke="${C.bronzeL}" stroke-width="2.6" stroke-linecap="round"/>`,
];

// ---------- Painterly Hollow Tidewarden: a bronze diving-helmet knight. Corroded plate furred with barnacles,
// kelp, chains and a dragging anchor; portholes glowing sea-green; a cracked faceplate leaking light. Faces left.
const warden = [
  `<ellipse cx="150" cy="370" rx="124" ry="11" fill="#05070b" opacity="0.6"/>`,
  `<circle cx="122" cy="64" r="44" fill="${C.glowB}" opacity="0.3" filter="url(#glow)"/>`,
  `<circle cx="152" cy="166" r="36" fill="${C.glowB}" opacity="0.25" filter="url(#glow)"/>`,
  // chain + anchor (dragging, held in front-left hand)
  `<path d="M62 210 C50 250 54 290 44 326" fill="none" stroke="${C.ink}" stroke-width="7" stroke-dasharray="9 5" stroke-linecap="round"/><path d="M62 210 C50 250 54 290 44 326" fill="none" stroke="${C.steelD}" stroke-width="4" stroke-dasharray="9 5" stroke-linecap="round"/>`,
  { d: 'M36 316 L52 316 L54 362 L38 362 Z', fill: C.iron, ink: 1.4 },
  { d: 'M8 350 C14 372 80 372 84 350 L72 350 C66 362 24 362 20 350 Z', fill: C.iron, hl: 'M8 350 L20 350 C22 356 26 360 30 362 L18 364 C12 360 8 356 8 350 Z', hlFill: WARM },
  { d: 'M2 340 L22 352 L8 360 Z M90 340 L70 352 L84 360 Z', fill: C.iron, ink: 1.4 },
  // legs
  { d: 'M104 268 L138 268 L134 350 L100 350 Z', fill: C.tealD, hl: 'M104 270 L112 270 L108 348 L100 348 Z', hlFill: WARM, lines: ['M106 296 C116 300 128 300 136 296'] },
  { d: 'M160 268 L196 268 L202 350 L166 350 Z', fill: C.tealD, shade: 'M186 268 L196 268 L202 350 L192 350 Z', lines: ['M162 296 C174 300 186 300 196 296'] },
  { d: 'M90 344 L138 344 L140 370 L80 370 C80 360 84 350 90 344 Z', fill: C.bronzeD, hl: 'M92 346 L134 346 L134 352 L92 352 Z', hlFill: WARM },
  { d: 'M160 344 L204 344 C214 352 220 360 222 370 L158 370 Z', fill: C.bronzeD },
  // fauld
  { d: 'M94 222 C126 236 180 236 208 222 L216 282 C182 296 122 296 88 282 Z', fill: C.teal, hl: 'M96 226 C110 232 124 234 136 236 L132 292 C116 290 102 286 90 282 Z', hlFill: 'rgba(255,214,160,0.18)',
    shade: 'M186 228 L208 222 L216 282 C206 286 196 289 186 291 Z', lines: ['M96 246 C130 258 180 258 210 246', 'M92 266 C130 278 180 278 212 266'] },
  // torso plate
  { d: 'M86 118 C86 100 116 92 152 92 C188 92 218 100 218 118 L208 228 C182 240 120 240 96 228 Z', fill: C.teal,
    hl: 'M92 114 C96 104 112 98 130 96 C116 130 112 180 112 234 L98 228 Z', hlFill: WARM,
    shade: 'M188 96 C206 100 218 108 218 118 L208 228 C202 232 196 234 188 236 C194 190 194 140 188 96 Z',
    lines: ['M106 142 C130 154 176 154 200 142', 'M104 182 C130 194 176 194 202 182'] },
  `<path d="M214 130 C212 170 210 200 206 226" fill="none" stroke="${RIM}" stroke-width="4" stroke-linecap="round"/>`,
  // cracked chest porthole glowing
  `<circle cx="152" cy="166" r="20" fill="${C.bronze}" stroke="${C.ink}" stroke-width="1.6"/><circle cx="152" cy="166" r="14" fill="${C.glowB}" stroke="${C.ink}" stroke-width="1.4"/><path d="M146 156 L152 166 L148 174 M152 166 L160 162" stroke="${C.tealD}" stroke-width="1.2" fill="none"/>`,
  `<g fill="${C.bronzeL}" stroke="${C.ink}" stroke-width="0.8">${[0, 1, 2, 3, 4, 5].map(i => { const a = i / 6 * Math.PI * 2; return `<circle cx="${(152 + Math.cos(a) * 17).toFixed(1)}" cy="${(166 + Math.sin(a) * 17).toFixed(1)}" r="1.8"/>`; }).join('')}</g>`,
  // barnacle clusters + kelp
  `<g fill="${C.bone}" stroke="${C.ink}" stroke-width="1">${[[100, 120, 5], [110, 112, 3.5], [94, 132, 3], [196, 206, 4.5], [188, 214, 3], [120, 274, 3.5], [178, 286, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="${C.ink}"/>`).join('')}</g>`,
  brush('M196 104 C188 140 200 170 190 210 C186 230 192 246 186 262', C.ink, 8, 1), brush('M196 104 C188 140 200 170 190 210 C186 230 192 246 186 262', C.kelp, 5, 1),
  brush('M112 104 C118 130 108 150 116 176', C.ink, 7, 1), brush('M112 104 C118 130 108 150 116 176', C.kelpL, 4, 1),
  // pauldrons
  { d: 'M66 122 C62 96 92 84 120 96 C124 114 114 132 92 138 C80 138 70 134 66 122 Z', fill: C.teal, hl: 'M70 116 C70 102 84 92 104 92 C90 102 82 112 80 128 Z', hlFill: WARM, shade: 'M110 100 C120 110 118 126 104 136 C100 137 96 138 92 138 C104 126 110 114 110 100 Z' },
  { d: 'M184 96 C210 84 238 96 238 122 C226 134 206 136 192 128 Z', fill: C.teal, shade: 'M216 88 C230 96 238 108 238 122 C228 132 214 134 206 134 C218 122 220 104 216 88 Z' },
  `<g fill="${C.bone}" stroke="${C.ink}" stroke-width="1">${[[78, 104, 5], [90, 98, 3.5], [214, 96, 5], [226, 108, 3.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="${C.ink}"/>`).join('')}</g>`,
  // diving helmet
  { d: 'M112 94 C96 80 92 52 108 32 C122 14 170 10 190 28 C208 46 206 78 192 94 Z', fill: C.bronze,
    hl: 'M108 78 C100 60 104 42 118 30 C128 22 140 18 150 18 C130 28 116 46 116 76 Z', hlFill: 'rgba(255,224,170,0.35)',
    shade: 'M176 22 C196 34 206 56 200 78 C198 86 196 90 192 94 L176 94 C186 72 186 44 176 22 Z' },
  { d: 'M106 96 C130 104 176 104 196 96 L198 106 C176 116 130 116 104 106 Z', fill: C.bronzeD, ink: 1.4, lines: ['M116 101 L116 110', 'M136 104 L136 113', 'M164 104 L164 113', 'M186 101 L186 110'] },
  `<circle cx="126" cy="60" r="20" fill="${C.bronzeD}" stroke="${C.ink}" stroke-width="1.6"/><circle cx="126" cy="60" r="15" fill="${C.glowB}" stroke="${C.ink}" stroke-width="1.4"/><path d="M114 60 L138 60 M126 48 L126 72" stroke="${C.bronzeD}" stroke-width="3"/><path d="M118 50 L124 58 L120 66" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.8"/>`,
  `<circle cx="168" cy="52" r="9" fill="${C.bronzeD}" stroke="${C.ink}" stroke-width="1.4"/><circle cx="168" cy="52" r="6" fill="${C.glowB}" opacity="0.8"/>`,
  `<g fill="${C.bronzeL}" stroke="${C.ink}" stroke-width="0.8">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * Math.PI * 2; return `<circle cx="${(126 + Math.cos(a) * 18).toFixed(1)}" cy="${(60 + Math.sin(a) * 18).toFixed(1)}" r="1.6"/>`; }).join('')}</g>`,
  `<g fill="${C.bone}" stroke="${C.ink}" stroke-width="1"><circle cx="186" cy="38" r="4"/><circle cx="186" cy="38" r="1.6" fill="${C.ink}"/><circle cx="150" cy="22" r="3"/><circle cx="196" cy="70" r="3.5"/></g>`,
  `<path d="M200 60 C204 70 204 80 198 90" fill="none" stroke="${RIM}" stroke-width="3" stroke-linecap="round"/>`,
  // arms
  { d: 'M70 128 L94 136 L80 196 L58 190 Z', fill: C.teal, hl: 'M72 130 L80 132 L66 192 L60 190 Z', hlFill: WARM },
  { d: 'M46 188 C46 176 76 176 78 188 L76 210 C68 216 52 216 46 208 Z', fill: C.bronzeD, hl: 'M48 186 C56 180 66 180 74 184 L72 190 C64 188 56 188 48 192 Z', hlFill: WARM, lines: ['M48 196 L76 196', 'M48 202 L76 202'] },
  { d: 'M210 124 L234 132 L228 198 L206 196 Z', fill: C.teal, shade: 'M224 130 L234 132 L228 198 L218 197 Z' },
  { d: 'M202 194 C202 182 230 182 232 194 L230 214 C222 220 208 220 202 212 Z', fill: C.bronzeD, ink: 1.4, lines: ['M204 202 L230 202'] },
];

// ---------- Painterly Brine Siren: an eel-woman with an anglerfish lure arcing from her brow, finned ears,
// scaled shoulders, wet black hair, coiled mottled tail, a hand raised to cast her mending light. Faces left.
const siren = [
  `<ellipse cx="150" cy="370" rx="96" ry="10" fill="#05070b" opacity="0.55"/>`,
  `<circle cx="70" cy="44" r="40" fill="${C.glow}" opacity="0.4" filter="url(#glow)"/>`,
  // tail coil
  `<path d="M146 204 C126 244 138 272 170 280 C208 288 220 316 192 334 C162 352 118 348 90 334" fill="none" stroke="${C.ink}" stroke-width="40" stroke-linecap="round"/>`,
  `<path d="M146 204 C126 244 138 272 170 280 C208 288 220 316 192 334 C162 352 118 348 90 334" fill="none" stroke="${C.sea}" stroke-width="35" stroke-linecap="round"/>`,
  `<path d="M140 210 C124 246 136 266 164 272 C196 280 210 300 196 318" fill="none" stroke="rgba(255,214,160,0.22)" stroke-width="10" stroke-linecap="round"/>`,
  `<path d="M160 220 C150 250 156 262 176 270 M212 300 C214 320 200 336 180 342" fill="none" stroke="rgba(8,12,20,0.45)" stroke-width="12" stroke-linecap="round"/>`,
  `<g fill="#1f3f3e">${[[134, 236], [150, 258], [176, 268], [200, 290], [206, 318], [176, 336], [140, 340], [110, 336]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="3"/>`).join('')}</g>`,
  { d: 'M92 334 C72 316 50 318 40 332 C54 336 58 350 52 364 C68 360 82 348 92 334 Z', fill: C.tealL, shade: 'M92 334 C82 348 68 360 52 364 C60 352 66 344 74 340 Z', lines: ['M86 334 L56 326', 'M84 340 L60 348'] },
  // dorsal fin along back
  { d: 'M178 132 C196 140 206 160 204 186 C198 176 190 170 180 168 Z', fill: C.tealL, ink: 1.4, lines: ['M184 140 L194 168', 'M182 150 L188 170'] },
  // hair behind
  { d: 'M150 46 C116 44 102 72 106 106 C98 140 86 166 70 184 C98 186 116 168 124 146 L130 112 Z', fill: '#121418', hl: 'M112 70 C108 96 110 120 100 150 C108 130 116 104 118 80 Z', hlFill: 'rgba(150,220,210,0.22)' },
  { d: 'M152 46 C184 46 196 76 190 108 C198 140 214 162 230 176 C206 182 188 166 180 144 L172 112 Z', fill: '#121418', hl: 'M184 80 C188 104 192 128 206 154 C196 132 192 106 190 84 Z', hlFill: 'rgba(150,220,210,0.22)' },
  // torso
  { d: 'M128 130 C136 122 164 122 172 130 C170 150 166 170 164 190 C166 198 168 204 170 210 L130 210 C132 204 134 198 136 190 C134 170 130 150 128 130 Z', fill: '#8fb3a8',
    hl: 'M130 132 C136 126 146 124 152 124 C142 140 140 170 140 208 L130 208 C132 196 136 186 136 176 C134 160 130 146 130 132 Z', hlFill: WARM,
    shade: 'M160 124 C168 126 172 130 172 130 C170 150 166 170 164 190 C166 198 168 204 170 210 L160 210 C158 180 162 150 160 124 Z' },
  { d: 'M130 140 C140 134 160 134 170 140 L168 172 C158 178 142 178 132 172 Z', fill: C.sea, ink: 1.2, after: `<g fill="none" stroke="#1f3f3e" stroke-width="1.1">${[[138, 148], [150, 146], [162, 148], [144, 160], [156, 160], [150, 170]].map(([x, y]) => `<path d="M${x - 5} ${y} C${x - 3} ${y + 4} ${x + 3} ${y + 4} ${x + 5} ${y}"/>`).join('')}</g>` },
  { d: 'M126 204 C140 216 160 216 174 204 L178 216 L166 220 L158 228 L150 220 L142 228 L134 220 L122 216 Z', fill: C.tealL, ink: 1.2 },
  // casting arm raised (front, left)
  { d: 'M134 136 C120 128 106 116 96 100 L106 92 C116 104 128 116 140 124 Z', fill: '#8fb3a8', hl: 'M96 100 L106 92 C110 98 114 102 118 106 L108 114 C104 110 100 106 96 100 Z', hlFill: WARM },
  { d: 'M92 82 C90 74 98 70 104 74 C110 78 110 86 106 92 C100 96 92 92 92 82 Z', fill: '#8fb3a8', ink: 1.4, lines: ['M94 80 L104 78'] },
  `<circle cx="96" cy="72" r="10" fill="${C.glowB}" opacity="0.55" filter="url(#glow2)"/><circle cx="96" cy="72" r="3.4" fill="#e8fff8"/>`,
  // other arm on hip
  { d: 'M166 136 C178 150 182 172 178 192 L166 194 C168 176 164 158 156 146 Z', fill: '#8fb3a8', shade: 'M172 150 C178 162 180 176 178 192 L172 193 C174 176 174 162 172 150 Z' },
  // neck + face (eel-like, sharp)
  { d: 'M142 108 L158 108 L160 132 L140 132 Z', fill: '#8fb3a8', shade: 'M152 108 L158 108 L160 132 L154 132 Z' },
  { d: 'M124 82 C124 66 136 58 148 58 C160 58 168 68 168 82 C168 96 160 110 148 112 C138 112 130 104 128 96 L120 92 L128 86 Z', fill: '#9fc7bc',
    hl: 'M128 80 C128 70 136 62 146 62 C138 70 134 80 134 92 Z', hlFill: WARM, shade: 'M158 62 C166 68 168 76 168 82 C168 96 160 110 148 112 C156 102 160 88 158 62 Z' },
  `<path d="M130 82 C134 79 139 79 141 83 C137 85 133 85 130 82 Z" fill="${C.glow}"/><circle cx="135" cy="82" r="1.2" fill="#121418"/><path d="M146 82 C149 80 153 80 155 82 C152 84 148 84 146 82 Z" fill="${C.glow}"/>`,
  `<path d="M128 100 C134 104 142 104 146 100" fill="none" stroke="#121418" stroke-width="1.8" stroke-linecap="round"/><path d="M132 101 L133 104 M138 102 L138 105 M143 101 L142 104" stroke="#e8e2d4" stroke-width="1.1"/>`,
  { d: 'M166 80 C178 70 186 72 188 80 C182 84 174 88 166 90 Z', fill: C.tealL, ink: 1.2, lines: ['M170 82 L184 76'] },
  // hair fringe
  { d: 'M122 84 C118 60 132 46 150 46 C168 46 178 60 174 82 C166 70 154 64 140 66 C132 68 126 74 122 84 Z', fill: '#121418', hl: 'M130 62 C138 54 150 52 160 54 C148 56 138 60 132 68 Z', hlFill: 'rgba(150,220,210,0.25)' },
  // anglerfish lure
  `<path d="M146 50 C130 20 96 14 74 34" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="M146 50 C130 20 96 14 74 34" fill="none" stroke="#5a7a72" stroke-width="2.8" stroke-linecap="round"/>`,
  `<circle cx="70" cy="40" r="9" fill="${C.glow}" stroke="${C.ink}" stroke-width="1.4"/><circle cx="68" cy="38" r="3" fill="#fffbe8"/>`,
];

fs.writeFileSync('src/gw_bulwark.svg', build(300, 380, S, bulwark, { filter: 'url(#paint)' }));
fs.writeFileSync('src/gw_elementalist.svg', build(300, 380, S, elementalist, { filter: 'url(#paint)' }));
fs.writeFileSync('src/gw_duelist.svg', build(340, 380, S, duelist, { filter: 'url(#paint)' }));
fs.writeFileSync('src/gw_warden.svg', build(300, 380, S, warden, { filter: 'url(#paint)' }));
fs.writeFileSync('src/gw_siren.svg', build(300, 380, S, siren, { filter: 'url(#paint)' }));
