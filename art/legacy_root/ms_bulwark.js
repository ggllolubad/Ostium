const { build } = require('./lib');
const { S, C } = require('./ms_style');
const fs = require('fs');

// Manuscript Bulwark: knight in azure surcoat over mail, great helm with turret crest,
// heater shield bearing an open gold door on vermilion, flanged mace cocked over the shoulder.
// Facing right. Light from upper left: shadows hatched on right / underside.
const parts = [
  // ground shadow
  `<ellipse cx="160" cy="346" rx="92" ry="8" fill="url(#h45w)" opacity="0.8"/>`,

  `<g fill="none" stroke="${S.ink}" stroke-width="1.1"><path d="M96 344 C98 340 104 340 105 344"/><path d="M238 344 C240 341 245 341 246 344"/><path d="M252 346 C253 344 256 344 257 346"/></g>`,
  // mantling (behind helm), vermilion with dagged edge, flows back-left
  { d: 'M142 46 C120 48 100 60 90 80 C84 92 88 104 98 102 C92 114 100 126 112 118 C110 132 122 140 132 128 C134 136 144 136 146 126 L150 96 Z', fill: C.red,
    shade: 'M90 80 C96 96 110 108 132 128 L150 126 L150 96 Z', lines: ['M140 58 C120 66 106 80 100 96', 'M144 74 C130 84 120 100 118 116'] },

  // mace haft + flanged head (behind hand)
  { d: 'M93 128 L100 125 L76 42 L70 44 Z', fill: C.brown, shade: 'M97 126 L100 125 L76 42 L73 43 Z', lines: ['M80 70 L86 68', 'M84 82 L90 80', 'M88 94 L94 92'] },
  { d: 'M60 30 L66 18 L72 28 L82 22 L80 34 L90 38 L80 44 L84 54 L72 50 L66 60 L62 48 L50 50 L56 40 L48 32 Z', fill: C.steel,
    shade: 'M72 50 L84 54 L80 44 L90 38 L80 34 L70 40 Z', shade2: 'M66 60 L72 50 L70 40 L62 48 Z', lines: ['M70 40 L66 18', 'M70 40 L48 32', 'M70 40 L84 54', 'M70 40 L62 48'] },
  `<circle cx="70" cy="40" r="3.2" fill="${C.goldD}" stroke="${S.ink}" stroke-width="1.2"/>`,

  { d: 'M95 134 L102 132 L104 142 L97 144 Z', fill: C.brown, ink: 1.4 },
  `<circle cx="101" cy="146" r="3.6" fill="${C.steel}" stroke="${S.ink}" stroke-width="1.4"/>`,
  // back leg: mail chausse, knee cop, sabaton
  { d: 'M126 226 L150 228 L144 280 L138 330 L120 330 L120 282 Z', fill: C.steel, tex: 'url(#mail)', shade: 'M140 228 L150 228 L144 280 L138 330 L130 330 L136 282 Z' },
  { d: 'M120 270 C120 262 142 262 142 270 L140 288 C134 294 124 292 120 286 Z', fill: C.steel, shade: 'M134 264 L142 270 L140 288 L132 292 Z', lines: ['M122 278 C128 282 136 282 140 278'] },
  { d: 'M116 326 L140 324 C146 330 152 336 158 340 L156 345 L112 345 C110 338 112 330 116 326 Z', fill: C.steel, shade: 'M112 340 L156 340 L156 345 L112 345 Z', shade2: 'M136 325 L140 324 L158 340 L146 340 Z', lines: ['M120 332 L142 330', 'M118 338 L150 338'] },

  // front leg
  { d: 'M154 228 L180 226 L188 280 L192 330 L172 332 L166 282 Z', fill: C.steel, tex: 'url(#mail)', shade: 'M178 226 L180 226 L188 280 L192 330 L182 330 L180 282 Z' },
  { d: 'M166 272 C166 264 190 264 190 272 L190 290 C184 296 172 296 166 290 Z', fill: C.steel, shade: 'M182 266 L190 272 L190 290 L182 294 Z', lines: ['M168 280 C174 284 184 284 190 280'] },
  { d: 'M170 328 L192 326 C204 332 216 336 226 338 L226 345 L168 345 C166 338 166 332 170 328 Z', fill: C.steel, shade: 'M168 340 L226 340 L226 345 L168 345 Z', shade2: 'M190 327 L192 326 L226 338 L212 340 Z', lines: ['M174 334 L198 332', 'M172 339 L212 338'] },

  // surcoat skirt (front panels, slit between legs)
  { d: 'M116 196 L184 194 L198 262 C184 266 172 266 160 262 L156 244 L150 264 C138 268 124 266 110 262 Z', fill: C.azure,
    shade: 'M168 196 L184 194 L198 262 C190 264 182 265 176 264 L172 210 Z', shade2: 'M150 230 L156 244 L150 264 L146 264 Z',
    lines: ['M126 204 C124 224 122 244 124 262', 'M140 204 C142 222 140 242 144 264', 'M164 204 C166 224 164 244 168 262', 'M124 262 C128 256 132 258 134 264', 'M168 262 C172 256 176 256 178 264'] },

  { d: 'M110 258 C124 264 138 266 150 262 L150 268 C138 272 124 270 109 264 Z', fill: C.gold, ink: 1.2, lines: ['M118 262 L117 268','M128 265 L127 270','M138 266 L138 271'] },
  { d: 'M158 258 C172 263 186 263 198 258 L199 264 C186 269 172 269 159 264 Z', fill: C.gold, ink: 1.2, lines: ['M168 262 L168 267','M178 263 L178 268','M188 262 L188 267'] },
  // dagger at left hip (rondel)
  { d: 'M110 200 L118 200 L117 246 L114 252 L111 246 Z', fill: C.brownD, shade: 'M115 200 L118 200 L117 246 L114 252 Z', lines: ['M111 214 L117 214','M111 228 L117 228'] },
  `<circle cx="114" cy="194" r="4.5" fill="${C.gold}" stroke="${S.ink}" stroke-width="1.3"/>`,
  // back arm upper (mail) then elbow cop then forearm (vambrace)
  { d: 'M116 112 L132 126 L102 162 L86 150 Z', fill: C.steel, tex: 'url(#mail)', shade: 'M120 116 L132 126 L102 162 L96 156 Z' },
  { d: 'M84 146 C84 138 100 138 102 148 L100 162 C94 166 86 164 84 158 Z', fill: C.steel, shade: 'M94 140 L102 148 L100 162 L94 164 Z', lines: ['M86 152 L100 154'] },
  { d: 'M86 150 L100 158 L108 130 L94 122 Z', fill: C.steel, shade: 'M100 158 L108 130 L104 128 L96 156 Z', lines: ['M90 140 L104 146'] },

  // torso: surcoat body over mail
  { d: 'M110 114 C110 102 124 96 140 96 L160 96 C178 96 190 102 190 114 C190 136 186 150 182 162 L184 196 L116 198 L118 162 C114 150 110 136 110 114 Z', fill: C.azure,
    shade: 'M168 98 C182 100 190 104 190 114 C190 136 186 150 182 162 L184 196 L172 196 C176 170 176 136 168 98 Z', shade2: 'M178 150 L182 162 L184 196 L178 196 Z',
    lines: ['M124 106 C132 130 128 160 126 196', 'M138 112 C142 138 138 168 140 196', 'M118 162 C140 168 162 168 182 162', 'M128 150 C132 156 134 162 132 168'] },
  { d: 'M110 116 C112 108 118 104 124 104 L124 110 C118 112 116 116 116 122 Z', fill: C.gold, ink: 1.2 },
  // chest charge: small gold door
  { d: 'M138 168 L138 146 C138 136 154 136 154 146 L154 168 Z', fill: C.gold, ink: 1.4, shade: 'M148 140 L154 146 L154 168 L148 168 Z', lines: ['M146 166 L146 144'] },
  // belt with buckle and hanging tongue
  { d: 'M114 190 L186 188 L186 200 L114 202 Z', fill: C.brown, shade: 'M114 197 L186 195 L186 200 L114 202 Z', lines: ['M124 190 L124 201', 'M134 190 L134 201'] },
  { d: 'M144 186 L158 186 L158 204 L144 204 Z', fill: C.gold, ink: 1.5, lines: ['M151 189 L151 201'] },
  { d: 'M146 204 L154 204 L153 230 L147 232 Z', fill: C.brown, ink: 1.4, lines: ['M148 214 L152 214', 'M148 222 L152 222'] },

  // spaulder on back shoulder, layered lames
  { d: 'M104 112 C104 98 118 92 130 96 C134 104 132 118 126 128 C118 130 108 126 104 120 Z', fill: C.steel, hl: 'M108 102 C112 98 118 96 122 97 L118 108 L108 112 Z',
    shade: 'M124 100 C132 104 132 118 126 128 C120 129 116 128 112 126 C120 120 124 110 124 100 Z', lines: ['M104 110 C112 112 120 112 130 106', 'M105 118 C112 120 120 120 128 116'] },
  `<g fill="${C.goldD}" stroke="${S.ink}" stroke-width="0.8"><circle cx="110" cy="104" r="1.5"/><circle cx="124" cy="101" r="1.5"/></g>`,
  // aventail (mail at neck)
  { d: 'M128 86 L172 86 L180 106 C160 112 140 112 120 106 Z', fill: C.steel, tex: 'url(#mail)', shade: 'M160 88 L172 86 L180 106 L166 110 Z' },

  // great helm
  { d: 'M130 34 L170 34 C174 34 176 38 176 42 L178 92 C162 100 138 100 122 92 L124 42 C124 38 126 34 130 34 Z', fill: C.steel,
    hl: 'M128 40 L136 40 L134 90 L126 88 Z', shade: 'M164 36 L170 34 C174 34 176 38 176 42 L178 92 C172 95 168 96 164 97 Z',
    lines: ['M124 58 C140 62 160 62 177 58', 'M150 36 L150 96'] },
  `<ellipse cx="150" cy="35" rx="23" ry="4.5" fill="${C.steelD}" stroke="${S.ink}" stroke-width="1.6"/>`,
  { d: 'M128 46 L136 44', fill: 'none', ink: 0, free: ['M128 46 L135 44', 'M131 84 L138 80', 'M168 46 L172 50', 'M158 88 L163 84'], freeW: 0.9 },
  // eye slits + breaths
  { d: 'M134 66 L148 66 L148 70 L134 70 Z', fill: S.ink, ink: 0 },
  { d: 'M153 66 L172 66 L172 70 L153 70 Z', fill: S.ink, ink: 0 },
  `<g fill="${S.ink}"><circle cx="160" cy="80" r="1.4"/><circle cx="165" cy="80" r="1.4"/><circle cx="170" cy="80" r="1.4"/><circle cx="160" cy="85" r="1.4"/><circle cx="165" cy="85" r="1.4"/><circle cx="170" cy="85" r="1.4"/></g>`,
  // rivets along brow
  `<g fill="${C.goldD}" stroke="${S.ink}" stroke-width="0.8"><circle cx="130" cy="60" r="1.6"/><circle cx="140" cy="61" r="1.6"/><circle cx="160" cy="61" r="1.6"/><circle cx="170" cy="60" r="1.6"/></g>`,
  // turret crest
  { d: 'M138 33 L138 18 L142 18 L142 13 L147 13 L147 18 L153 18 L153 13 L158 13 L158 18 L162 18 L162 33 Z', fill: C.gold, ink: 1.6,
    shade: 'M156 18 L162 18 L162 33 L156 33 Z', lines: ['M146 33 L146 25 C146 21 154 21 154 25 L154 33'] },

  // guige strap from shield to shoulder
  { d: 'M150 118 C142 110 138 104 140 98 L146 98 C146 104 150 110 156 116 Z', fill: C.brown, ink: 1.4 },

  // shield (heater), vermilion field, gold border, open door charge
  { d: 'M148 110 L240 110 L240 176 C240 222 208 250 194 260 C180 250 148 222 148 176 Z', fill: C.gold,
    shade: 'M212 110 L240 110 L240 176 C240 222 208 250 194 260 C200 240 214 210 214 176 Z' },
  { d: 'M156 118 L232 118 L232 176 C232 216 204 240 194 248 C184 240 156 216 156 176 Z', fill: C.red, tex: 'url(#diaper)',
    shade: 'M210 118 L232 118 L232 176 C232 216 204 240 194 248 C202 228 210 206 210 176 Z' },
  { d: 'M178 206 L178 156 C178 138 210 138 210 156 L210 206 Z', fill: C.gold, ink: 1.8, shade: 'M202 146 C206 148 210 152 210 156 L210 206 L202 206 Z',
    lines: ['M184 206 L184 160 C184 148 204 148 204 160 L204 206'] },
  { d: 'M184 206 L184 160 C184 148 204 148 204 160 L204 206 Z', fill: S.ink, ink: 0, after: `<path d="M190 206 L190 168 L200 162 L200 206 Z" fill="${C.goldD}" stroke="${S.ink}" stroke-width="1"/>` },
  `<path d="M148 150 L153 153 L148 156 Z M240 140 L235 144 L240 147 Z M176 240 L180 236 L182 242 Z" fill="#ecdfc2" stroke="${S.ink}" stroke-width="1.2" stroke-linejoin="round"/>`,
  `<path d="M166 132 L176 140 M216 188 L224 182 M170 196 L176 204 M222 132 L228 138" stroke="${S.ink}" stroke-width="0.9" stroke-linecap="round"/>`,
  `<g fill="${C.goldD}" stroke="${S.ink}" stroke-width="0.9"><circle cx="160" cy="122" r="2"/><circle cx="228" cy="122" r="2"/><circle cx="194" cy="114" r="2"/></g>`,

  // gauntlet gripping mace (in front of haft)
  { d: 'M88 120 C90 110 106 110 108 118 L106 134 C100 138 90 136 88 130 Z', fill: C.steel, shade: 'M100 114 L108 118 L106 134 L100 136 Z',
    lines: ['M90 122 L106 124', 'M90 127 L106 129'] },
];
fs.writeFileSync(process.argv[2] || 'src/ms_bulwark.svg', build(300, 360, S, parts, { filter: 'url(#wob)' }));
