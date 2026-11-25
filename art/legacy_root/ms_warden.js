const { build } = require('./lib');
const { S, C } = require('./ms_style');
const fs = require('fs');
// Manuscript Hollow Tidewarden: a drowned sea-knight drollery. Fish-headed, gaping jaw, scale hauberk,
// clam-shell pauldrons, vermilion tabard with gold fish, kelp-hung, barnacled, trident held two-handed. Faces left.
const barn = (x, y, r) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.bone}" stroke="${S.ink}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="${S.ink}"/></g>`;
const parts = [
  `<ellipse cx="160" cy="346" rx="120" ry="9" fill="url(#h45w)" opacity="0.8"/>`,
  // tentacles behind (violet)
  { d: 'M200 190 C236 186 262 200 272 228 C278 246 268 258 256 252 C266 240 260 222 242 216 C228 212 214 214 204 220 Z', fill: C.violet,
    shade: 'M204 220 C214 214 228 212 242 216 C260 222 266 240 256 252 C262 236 254 226 240 224 C228 222 216 222 204 220 Z', after: `<g fill="#e8d6e4" stroke="${S.ink}" stroke-width="0.8"><circle cx="232" cy="206" r="2"/><circle cx="248" cy="212" r="2"/><circle cx="260" cy="226" r="2"/></g>` },
  { d: 'M196 220 C222 236 234 262 228 292 C226 306 214 310 208 300 C220 290 220 270 208 256 C202 248 194 242 186 238 Z', fill: C.violet,
    shade: 'M186 238 C194 242 202 248 208 256 C220 270 220 290 208 300 C214 284 212 268 200 256 C194 250 190 246 186 238 Z' },
  // back leg + webbed foot
  { d: 'M176 236 L206 234 L210 330 L182 332 Z', fill: C.green, tex: 'url(#scale)', shade: 'M196 234 L206 234 L210 330 L200 331 Z' },
  { d: 'M176 326 L212 324 C222 330 232 336 236 345 L172 345 C170 338 172 330 176 326 Z', fill: C.greenD, ink: 2, lines: ['M196 330 L204 345', 'M210 328 L222 345'], after: `<path d="M236 345 L242 342 M222 345 L226 341" stroke="${S.ink}" stroke-width="1.6" stroke-linecap="round"/>` },
  // front leg + webbed foot
  { d: 'M118 236 L150 236 L146 330 L118 330 Z', fill: C.green, tex: 'url(#scale)', shade: 'M140 236 L150 236 L146 330 L138 330 Z' },
  { d: 'M112 326 L148 326 L152 345 L86 345 C88 336 98 328 112 326 Z', fill: C.greenD, ink: 2, lines: ['M112 330 L104 345', 'M126 330 L120 345'], after: `<path d="M86 345 L80 342 M104 345 L98 341" stroke="${S.ink}" stroke-width="1.6" stroke-linecap="round"/>` },
  // fauld (scale skirt)
  { d: 'M104 194 C130 208 190 208 216 194 L224 242 C190 252 130 252 96 242 Z', fill: C.teal, tex: 'url(#scale)', shade: 'M196 200 L216 194 L224 242 C214 245 204 247 194 248 Z' },
  // hauberk
  { d: 'M104 110 C104 96 124 88 160 88 C196 88 216 96 216 110 L212 200 C200 214 176 218 160 218 C144 218 120 214 108 200 Z', fill: C.green, tex: 'url(#scale)',
    shade: 'M192 92 C206 96 216 102 216 110 L212 200 C206 206 198 210 190 213 C196 170 196 130 192 92 Z' },
  // tabard + fish charge
  { d: 'M140 98 L182 98 L178 246 L144 246 Z', fill: C.red, shade: 'M170 98 L182 98 L178 246 L168 246 Z', lines: ['M150 180 L150 246', 'M162 200 L164 246'] },
  { d: 'M146 140 C154 128 168 128 174 140 C168 152 154 152 146 140 Z', fill: C.gold, ink: 1.4, after: `<path d="M174 140 L182 133 L182 147 Z" fill="${C.gold}" stroke="${S.ink}" stroke-width="1.4" stroke-linejoin="round"/><circle cx="152" cy="138" r="1.4" fill="${S.ink}"/>` },
  { d: 'M104 196 C130 206 190 206 216 196 L216 204 C190 214 130 214 104 204 Z', fill: C.gold, ink: 1.5, lines: ['M120 200 L120 208', 'M140 203 L140 211', 'M180 203 L180 211', 'M200 200 L200 208'] },
  // kelp draped over shoulders
  `<path d="M196 96 C190 120 200 140 192 170 C188 184 194 196 190 210" fill="none" stroke="${S.ink}" stroke-width="6.5" stroke-linecap="round"/><path d="M196 96 C190 120 200 140 192 170 C188 184 194 196 190 210" fill="none" stroke="${C.greenD}" stroke-width="4" stroke-linecap="round"/>`,
  `<path d="M120 98 C126 118 116 136 124 156" fill="none" stroke="${S.ink}" stroke-width="5.5" stroke-linecap="round"/><path d="M120 98 C126 118 116 136 124 156" fill="none" stroke="${C.greenD}" stroke-width="3" stroke-linecap="round"/>`,
  // back shoulder pauldron (clam)
  { d: 'M196 102 C210 84 240 92 236 116 C226 126 210 122 200 114 Z', fill: C.bone, shade: 'M224 92 C236 98 238 108 236 116 C230 120 224 120 218 118 C226 110 228 100 224 92 Z', shadeFill: 'url(#h135)',
    lines: ['M202 108 L214 92', 'M208 114 L224 94', 'M216 118 L232 100'] },
  // fish head
  { d: 'M140 26 C152 6 178 0 198 8 C192 16 188 24 186 32 Z', fill: C.red, shade: 'M186 32 C188 24 192 16 198 8 C190 10 184 18 180 30 Z', lines: ['M150 22 L156 6', 'M162 18 L168 4', 'M174 18 L180 4', 'M184 22 L190 8'] },
  { d: 'M108 84 C98 62 110 36 140 26 C170 18 202 28 212 50 C218 66 212 82 198 92 L122 94 Z', fill: C.green, tex: 'url(#scale)',
    shade: 'M190 30 C204 36 212 44 214 56 C218 70 212 84 198 92 L184 92 C198 74 200 50 190 30 Z', lines: ['M182 50 C186 60 186 70 182 80', 'M190 48 C195 60 195 72 190 82'] },
  { d: 'M108 66 C118 74 134 80 152 80 L156 66 C138 66 124 62 114 54 Z', fill: C.redD, after: `<path d="M114 56 L118 62 L122 58 L126 64 L130 60 L134 66 L139 62 L143 67 L148 64 L152 68" fill="none" stroke="${C.bone}" stroke-width="2.4" stroke-linejoin="round"/><path d="M112 70 L117 66 L122 72 L127 68 L132 74 L137 70 L142 76 L148 72" fill="none" stroke="${C.bone}" stroke-width="2.4" stroke-linejoin="round"/>` },
  `<circle cx="150" cy="44" r="11" fill="${C.bone}" stroke="${S.ink}" stroke-width="2"/><circle cx="147" cy="44" r="5.5" fill="${C.redD}" stroke="${S.ink}" stroke-width="1"/><circle cx="145" cy="42" r="1.6" fill="#f7eedb"/>`,
  `<path d="M136 34 C142 28 156 28 162 32" fill="none" stroke="${S.ink}" stroke-width="2.4" stroke-linecap="round"/>`,
  // barbels (tentacle beard)
  `<g fill="none" stroke-linecap="round"><path d="M126 90 C120 106 128 118 118 132" stroke="${S.ink}" stroke-width="5"/><path d="M126 90 C120 106 128 118 118 132" stroke="${C.violet}" stroke-width="2.8"/><path d="M142 92 C140 110 148 120 142 138" stroke="${S.ink}" stroke-width="5"/><path d="M142 92 C140 110 148 120 142 138" stroke="${C.violet}" stroke-width="2.8"/></g>`,
  // gorget (gilt rim)
  { d: 'M118 88 C140 96 180 96 204 88 L206 98 C180 106 140 106 116 98 Z', fill: C.gold, ink: 1.6, lines: ['M130 94 L130 101', 'M146 96 L146 103', 'M176 96 L176 103', 'M192 94 L192 101'] },
  barn(118, 50, 4.5), barn(196, 22, 3.5), barn(206, 64, 5), barn(226, 104, 4), barn(210, 140, 3.5), barn(122, 228, 3.5), barn(190, 300, 3),
  // trident shaft (in front of body) + head
  { d: 'M62 30 L71 30 L74 344 L65 344 Z', fill: C.goldD, shade: 'M67 30 L71 30 L74 344 L70 344 Z', lines: ['M64 120 L72 118', 'M64 240 L73 238'] },
  { d: 'M40 30 L94 30 L94 39 L40 39 Z', fill: C.gold, ink: 1.8 },
  { d: 'M40 30 L40 14 L35 18 L42 4 L49 18 L44 14 L44 30 Z', fill: C.gold, ink: 1.6 },
  { d: 'M64 30 L64 10 L59 14 L67 0 L75 14 L70 10 L70 30 Z', fill: C.gold, ink: 1.6 },
  { d: 'M90 30 L90 14 L85 18 L92 4 L99 18 L94 14 L94 30 Z', fill: C.gold, ink: 1.6 },
  // front pauldron (clam)
  { d: 'M84 116 C80 92 110 84 126 100 C122 114 110 124 94 126 Z', fill: C.bone, shade: 'M84 116 C82 108 84 100 90 96 C92 106 96 116 94 126 C88 124 86 120 84 116 Z', shadeFill: 'url(#h135)',
    lines: ['M90 120 L100 96', 'M98 122 L112 96', 'M106 120 L120 100'] },
  // front arm (upper + forearm) gripping trident high
  { d: 'M90 120 L112 128 L96 176 L76 170 Z', fill: C.green, tex: 'url(#scale)', shade: 'M104 126 L112 128 L96 176 L90 174 Z' },
  { d: 'M60 160 C60 150 82 150 84 160 L82 176 C76 182 64 182 60 176 Z', fill: C.steel, shade: 'M76 152 L84 160 L82 176 L76 180 Z', lines: ['M62 166 L82 166', 'M62 171 L82 171'] },
  // back arm crossing body to grip trident low
  { d: 'M200 112 L224 120 L218 176 L196 178 Z', fill: C.green, tex: 'url(#scale)', shade: 'M214 118 L224 120 L218 176 L210 177 Z' },
  { d: 'M196 168 C210 164 222 170 220 182 C218 192 206 194 198 188 Z', fill: C.steel, shade: 'M212 168 C220 172 222 180 218 188 L210 190 Z', lines: ['M200 178 L218 178'] },
  { d: 'M204 172 L214 190 C170 206 130 212 92 212 L90 196 C128 196 166 188 204 172 Z', fill: C.green, tex: 'url(#scale)', shade: 'M92 212 C130 212 170 206 214 190 L211 185 C170 200 130 206 91 206 Z' },
  { d: 'M60 196 C60 186 82 186 84 196 L82 212 C76 218 64 218 60 212 Z', fill: C.steel, shade: 'M76 188 L84 196 L82 212 L76 216 Z', lines: ['M62 202 L82 202', 'M62 207 L82 207'] },
  `<path d="M66 186 L66 182 M72 186 L72 182 M66 218 L66 222 M72 218 L72 222" stroke="${S.ink}" stroke-width="1"/>`,
  // drips
  `<g fill="${C.azure}" stroke="${S.ink}" stroke-width="0.9"><path d="M100 250 C104 256 104 260 100 260 C96 260 96 256 100 250 Z"/><path d="M220 248 C224 254 224 258 220 258 C216 258 216 254 220 250 Z"/><path d="M132 104 C135 109 135 112 132 112 C129 112 129 109 132 104 Z"/></g>`,
];
fs.writeFileSync(process.argv[2] || 'src/ms_warden.svg', build(300, 360, S, parts, { filter: 'url(#wob)' }));
