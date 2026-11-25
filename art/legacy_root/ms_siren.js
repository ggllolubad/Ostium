const { build } = require('./lib');
const { S, C } = require('./ms_style');
const fs = require('fs');
// Manuscript Brine Siren: bestiary mermaid perched on a kelp rock, gilt crown, long gold hair,
// mirror raised in one hand (her mending charm) and a comb in the other; coiled green scale tail with gold fluke. Faces left.
const parts = [
  `<ellipse cx="166" cy="346" rx="86" ry="8" fill="url(#h45w)" opacity="0.8"/>`,
  // hair mass behind
  { d: 'M152 36 C178 34 194 56 190 86 C198 124 196 164 214 204 C192 202 178 186 172 164 C166 132 166 100 158 78 Z', fill: C.gold,
    shade: 'M176 60 C188 70 192 82 190 86 C198 124 196 164 214 204 C204 200 196 192 190 182 C192 150 186 110 176 60 Z', shadeFill: 'url(#h135)',
    lines: ['M164 50 C176 80 176 120 184 170', 'M172 52 C184 90 184 130 196 186', 'M160 70 C166 100 168 130 176 160'] },
  // rock + kelp
  { d: 'M100 300 C110 278 196 270 222 292 L232 345 L92 345 Z', fill: C.steel, shade: 'M190 278 C208 282 218 288 222 292 L232 345 L200 345 C206 320 204 296 190 278 Z', shade2: 'M92 334 L232 334 L232 345 L92 345 Z',
    lines: ['M120 300 C130 310 140 312 150 306', 'M170 296 C176 306 186 310 196 306', 'M110 324 L126 322'] },
  `<path d="M116 344 C108 326 122 316 112 300 M226 344 C232 326 220 318 228 300" fill="none" stroke="${S.ink}" stroke-width="6" stroke-linecap="round"/><path d="M116 344 C108 326 122 316 112 300 M226 344 C232 326 220 318 228 300" fill="none" stroke="${C.greenD}" stroke-width="3.4" stroke-linecap="round"/>`,
  // tail fluke
  { d: 'M232 300 C244 282 260 276 272 280 C264 290 262 300 268 314 C258 320 248 318 242 312 Z', fill: C.gold, shade: 'M242 312 C248 318 258 320 268 314 C262 304 262 296 264 290 C256 298 248 306 242 312 Z', lines: ['M240 304 L266 284', 'M244 308 L264 300', 'M246 312 L266 312'] },
  // tail
  { d: 'M132 184 L172 184 C184 220 178 250 162 270 C148 288 152 306 176 314 C200 320 222 312 234 298 L246 310 C232 330 204 340 174 336 C138 332 120 306 128 280 C134 260 144 244 140 222 Z', fill: C.green, tex: 'url(#scale)',
    shade: 'M162 200 L172 184 C184 220 178 250 162 270 C152 282 150 294 156 304 C140 296 140 276 150 262 C164 246 168 222 162 200 Z', shade2: 'M128 300 C134 322 150 334 174 336 C150 330 136 318 128 300 Z' },
  `<path d="M140 222 C150 226 164 226 172 222 M134 262 C142 268 152 268 160 262 M150 300 C160 306 170 308 180 306" fill="none" stroke="${S.ink}" stroke-width="1.1"/>`,
  // waist fin frill
  { d: 'M130 182 C140 192 162 194 174 182 L178 194 L168 196 L162 204 L154 196 L146 204 L140 196 L128 196 Z', fill: C.gold, ink: 1.5, lines: ['M140 186 L140 196', 'M152 188 L154 196', 'M164 188 L164 196'] },
  // comb arm (behind torso, right side)
  { d: 'M162 102 L178 108 L192 82 L180 72 Z', fill: C.flesh, shade: 'M172 106 L178 108 L192 82 L187 78 Z' },
  { d: 'M178 64 L202 60 L204 70 L180 74 Z', fill: C.bone, ink: 1.4, after: `<path d="M182 64 L180 56 M186 63 L184 55 M190 63 L188 55 M194 62 L192 54 M198 61 L196 53" stroke="${S.ink}" stroke-width="1.2" stroke-linecap="round"/>` },
  { d: 'M176 72 C180 68 190 70 192 76 C192 82 184 86 178 82 Z', fill: C.flesh, ink: 1.6 },
  // torso
  { d: 'M128 106 C130 98 140 94 151 94 C162 94 172 98 176 106 C174 124 170 142 168 160 C170 170 174 180 176 188 L130 188 C132 180 136 170 138 160 C134 142 130 124 128 106 Z', fill: C.flesh,
    shade: 'M164 96 C170 98 174 102 176 106 C174 124 170 142 168 160 C170 170 174 180 176 188 L166 188 C164 170 166 140 164 96 Z' },
  { d: 'M132 120 C140 116 162 116 172 120 L170 156 C160 162 146 162 138 156 Z', fill: C.teal, tex: 'url(#scale)', shade: 'M162 118 L172 120 L170 156 L162 159 Z',
    after: `<path d="M132 120 C140 116 162 116 172 120" fill="none" stroke="${C.gold}" stroke-width="2.2"/>` },
  `<path d="M146 168 C150 172 156 172 160 168" fill="none" stroke="${S.ink}" stroke-width="1"/>`,
  // pearl necklace
  `<g fill="${C.bone}" stroke="${S.ink}" stroke-width="0.8"><circle cx="140" cy="108" r="2.2"/><circle cx="144" cy="113" r="2.2"/><circle cx="149" cy="116" r="2.2"/><circle cx="155" cy="116" r="2.2"/><circle cx="160" cy="113" r="2.2"/><circle cx="164" cy="108" r="2.2"/><circle cx="152" cy="121" r="3" fill="${C.azure}"/></g>`,
  // front hair strand over shoulder/chest
  { d: 'M148 42 C128 42 118 60 120 82 C116 112 122 142 114 172 L132 164 C134 134 136 104 142 82 Z', fill: C.gold, shade: 'M114 172 C122 142 116 112 120 82 L126 84 C124 114 128 144 122 168 Z', shadeFill: 'url(#h135)',
    lines: ['M130 64 C126 90 128 120 124 160', 'M138 66 C134 96 134 126 128 160'] },
  // neck + face (facing left)
  { d: 'M144 78 L158 78 L158 98 L144 98 Z', fill: C.flesh, shade: 'M152 78 L158 78 L158 98 L152 98 Z' },
  { d: 'M136 54 C136 44 146 38 156 40 C164 42 168 50 168 60 C168 74 160 84 150 84 C142 84 136 78 134 70 L128 64 L134 60 Z', fill: C.flesh,
    shade: 'M160 44 C166 48 168 54 168 60 C168 74 160 84 150 84 C158 76 162 62 160 44 Z', lines: ['M134 60 L128 64 L134 70'] },
  `<path d="M138 56 C141 53 146 53 148 56 C145 58 141 58 138 56 Z" fill="${C.bone}" stroke="${S.ink}" stroke-width="0.9"/><circle cx="142" cy="56" r="1.4" fill="${C.tealD}"/>`,
  `<path d="M137 50 C140 48 146 48 149 50" fill="none" stroke="${S.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M138 74 C141 76 145 76 147 74" fill="none" stroke="${C.redD}" stroke-width="1.8" stroke-linecap="round"/>`,
  // hair top / fringe
  { d: 'M134 52 C134 36 150 28 164 34 C172 38 176 48 172 58 C164 48 150 44 138 50 Z', fill: C.gold, lines: ['M144 40 C150 42 156 46 160 52', 'M154 36 C160 40 166 46 168 52'] },
  // crown
  { d: 'M138 38 L138 24 L144 30 L150 18 L156 30 L162 24 L164 38 C156 34 146 34 138 38 Z', fill: C.gold, shade: 'M156 30 L162 24 L164 38 C161 37 158 36 156 36 Z', shadeFill: C.goldD },
  `<g fill="${C.red}" stroke="${S.ink}" stroke-width="0.8"><circle cx="144" cy="34" r="1.8"/><circle cx="151" cy="33" r="1.8"/><circle cx="158" cy="34" r="1.8"/></g>`,
  // mirror arm (front): upper arm, forearm up, hand, mirror
  { d: 'M142 104 L126 100 L108 132 L124 142 Z', fill: C.flesh, shade: 'M136 103 L142 104 L124 142 L118 139 Z' },
  { d: 'M108 132 L124 142 L112 110 L98 114 Z', fill: C.flesh, shade: 'M118 139 L124 142 L112 110 L107 112 Z' },
  { d: 'M88 106 L96 104 L102 116 L94 120 Z', fill: C.gold, ink: 1.4 },
  { d: 'M74 86 A20 20 0 1 1 114 86 A20 20 0 1 1 74 86 Z', fill: C.gold, ink: 2 },
  { d: 'M80 86 A14 14 0 1 1 108 86 A14 14 0 1 1 80 86 Z', fill: '#cfe0ea', shade: 'M94 72 A14 14 0 0 1 94 100 C100 92 100 80 94 72 Z', shadeFill: '#a9c4d6',
    after: `<path d="M86 80 L92 74 M86 88 L98 76" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>` },
  { d: 'M98 106 C100 100 110 100 112 106 C112 114 104 118 98 114 Z', fill: C.flesh, ink: 1.6 },
  // sparkle from mirror (her mending)
  `<g stroke="${C.goldD}" stroke-width="1.6" stroke-linecap="round"><path d="M60 64 L66 70"/><path d="M58 88 L50 88"/><path d="M68 108 L62 114"/><path d="M94 52 L94 58"/></g>`,
];
fs.writeFileSync(process.argv[2] || 'src/ms_siren.svg', build(300, 360, S, parts, { filter: 'url(#wob)' }));
