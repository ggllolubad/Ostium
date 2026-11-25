"""Ink engravings for the kingdom map: one icon per kind of node, plus the chart furniture
(parchment sheet, compass rose, cartouche, company pennant, water stain).

Usage: python3 tools/art/map_ink.py            -> assets/art/map/*.png
Drawn as SVG (iron-gall ink, sepia wash, red rubric, hatching, a displacement filter for the
hand-drawn wobble) and rendered with the bundled Chromium so every filter is honoured."""
import os
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "assets", "art", "map")
INK, WASH, RUB, PAPER = "#2b1d12", "#6f5036", "#9c3d2b", "#efe3c6"

DEFS = f"""
<defs>
 <filter id="ink" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="g"/>
  <feDisplacementMap in="d" in2="g" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
 </filter>
 <filter id="bleed"><feGaussianBlur stdDeviation="0.6"/></filter>
 <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
  <line x1="0" y1="0" x2="0" y2="7" stroke="{INK}" stroke-width="1.7"/></pattern>
 <pattern id="hatchx" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
  <line x1="0" y1="0" x2="0" y2="7" stroke="{INK}" stroke-width="1.5"/>
  <line x1="0" y1="0" x2="7" y2="0" stroke="{INK}" stroke-width="1.2"/></pattern>
 <pattern id="hatchr" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
  <line x1="0" y1="0" x2="0" y2="6" stroke="{RUB}" stroke-width="1.6"/></pattern>
</defs>"""

# stroke presets
S = f'fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"'
S3 = f'fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'
S2 = f'fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
W = f'fill="{WASH}" fill-opacity="0.22"'
H = 'fill="url(#hatch)"'
R = f'fill="{RUB}"'
P = f'fill="{PAPER}"'


def ground(y=214, x0=44, x1=212):
    tufts = "".join(f'<path d="M{x} {y} l-3 -8 M{x} {y} l3 -9 M{x} {y} l7 -6" {S2}/>' for x in range(x0 + 14, x1 - 10, 46))
    return f'<path d="M{x0} {y} Q{(x0+x1)/2} {y-4} {x1} {y}" {S3}/>' + tufts


def sword(rot, flip=False):
    shade = '<path d="M0 -104 L8 -86 L8 36 L0 36 Z" fill="url(#hatch)"/>'
    return f"""<g transform="translate(128 132) rotate({rot}) translate(0 8)">
 <path d="M-8 36 L-8 -86 L0 -104 L8 -86 L8 36 Z" {W}/>{shade}
 <path d="M-8 36 L-8 -86 L0 -104 L8 -86 L8 36" {S}/>
 <path d="M0 26 V-82" {S2}/>
 <path d="M-32 44 Q-36 36 -28 36 H28 Q36 36 32 44 Q28 52 20 46 H-20 Q-28 52 -32 44 Z" {W} />
 <path d="M-32 44 Q-36 36 -28 36 H28 Q36 36 32 44 Q28 52 20 46 H-20 Q-28 52 -32 44 Z" {S3}/>
 <rect x="-6" y="48" width="12" height="34" rx="3" {H}/>
 <rect x="-6" y="48" width="12" height="34" rx="3" {S3}/>
 <circle cx="0" cy="92" r="10" {W}/><circle cx="0" cy="92" r="10" {S3}/>
</g>"""


ICONS = {}

ICONS["start"] = f"""
<path d="M56 214 V112 A72 72 0 0 1 200 112 V214 Z M84 214 V120 A44 44 0 0 1 172 120 V214 Z" fill-rule="evenodd" {H}/>
<path d="M56 214 V112 A72 72 0 0 1 200 112 V214" {S}/>
<path d="M84 214 V120 A44 44 0 0 1 172 120 V214" {S}/>
<path d="M128 40 V76 M74 64 L94 86 M182 64 L162 86 M58 112 H86 M198 112 H170 M56 160 H84 M200 160 H172" {S3}/>
<path d="M88 214 V122 A40 40 0 0 1 168 122 V214 Z" {W}/>
<path d="M107 210 V86 M128 210 V80 M149 210 V86" {S2}/>
<path d="M92 142 H164 M90 190 H166" {S3}/>
<circle cx="154" cy="166" r="7" {S3}/>
{ground(216, 30, 226)}"""

ICONS["combat"] = sword(42) + sword(-42)

ICONS["elite"] = f"""
<path d="M80 142 C70 74 186 74 176 142 C176 160 166 170 160 174 V198 H96 V174 C90 170 80 160 80 142 Z" {W}/>
<path d="M150 96 C170 104 176 122 176 142 C176 160 166 170 160 174 V198 H140 Z" fill="url(#hatch)" opacity="0.8"/>
<path d="M80 142 C70 74 186 74 176 142 C176 160 166 170 160 174 V198 H96 V174 C90 170 80 160 80 142 Z" {S}/>
<ellipse cx="106" cy="140" rx="14" ry="16" fill="{INK}"/><ellipse cx="150" cy="140" rx="14" ry="16" fill="{INK}"/>
<path d="M128 154 L119 170 H137 Z" fill="{INK}"/>
<path d="M98 184 H158 M108 176 V198 M118 176 V198 M128 176 V198 M138 176 V198 M148 176 V198" {S2}/>
<path d="M164 108 L150 122 L156 132" {S2}/>
<path d="M76 100 L82 50 L104 76 L128 38 L152 76 L174 50 L180 100 Z" {R}/>
<path d="M76 100 L82 50 L104 76 L128 38 L152 76 L174 50 L180 100 Z" fill="url(#hatch)" opacity="0.35"/>
<path d="M76 100 L82 50 L104 76 L128 38 L152 76 L174 50 L180 100 Z" {S3}/>
<path d="M78 90 H178" {S3}/>
<circle cx="128" cy="38" r="5" {P} stroke="{INK}" stroke-width="2.5"/><circle cx="82" cy="50" r="4" {P} stroke="{INK}" stroke-width="2.5"/><circle cx="174" cy="50" r="4" {P} stroke="{INK}" stroke-width="2.5"/>"""

rays = "".join(
    f'<path d="M{128+92*__import__("math").cos(a):.1f} {128+64*__import__("math").sin(a):.1f} L{128+112*__import__("math").cos(a):.1f} {128+84*__import__("math").sin(a):.1f}" {S3}/>'
    for a in [i * 0.5236 for i in range(12)])
ICONS["event"] = f"""
{rays}
<path d="M40 128 Q128 54 216 128 Q128 202 40 128 Z" {P}/>
<path d="M40 128 Q128 54 216 128 Q128 202 40 128 Z" {S}/>
<path d="M60 112 Q128 64 196 112" {S2}/>
<circle cx="128" cy="128" r="30" fill="{RUB}"/>
<circle cx="128" cy="128" r="30" fill="url(#hatch)" opacity="0.45"/>
<circle cx="128" cy="128" r="30" {S3}/>
<circle cx="128" cy="128" r="12" fill="{INK}"/>
<circle cx="119" cy="119" r="5" {P}/>
<path d="M76 96 l-6 -12 M100 84 l-3 -13 M128 80 v-13 M156 84 l3 -13 M180 96 l6 -12" {S3}/>"""

ICONS["merchant"] = f"""
<path d="M128 62 V202" {S}/>
<circle cx="128" cy="52" r="8" {W}/><circle cx="128" cy="52" r="8" {S3}/>
<path d="M54 74 Q128 62 202 74" {S}/>
<path d="M58 76 L38 148 M58 76 L80 148 M198 76 L176 148 M198 76 L218 148" {S2}/>
<path d="M30 148 Q58 178 88 148 Z" {W}/><path d="M30 148 Q58 178 88 148 Z" {S3}/>
<path d="M168 148 Q198 178 226 148 Z" {W}/><path d="M168 148 Q198 178 226 148 Z" {S3}/>
<ellipse cx="58" cy="142" rx="13" ry="4.5" {R} stroke="{INK}" stroke-width="2.5"/>
<ellipse cx="58" cy="135" rx="13" ry="4.5" {R} stroke="{INK}" stroke-width="2.5"/>
<ellipse cx="60" cy="128" rx="13" ry="4.5" {R} stroke="{INK}" stroke-width="2.5"/>
<path d="M98 216 L108 200 H148 L158 216 Z" {H}/><path d="M92 216 L106 198 H150 L164 216 Z" {S3}/>
<path d="M84 218 H172" {S3}/>"""

ICONS["shrine"] = f"""
<path d="M66 162 H190 V214 H66 Z" {W}/>
<path d="M72 176 H184 V214 H72 Z" {H}/>
<path d="M66 162 H190 V214 H66 Z" {S}/>
<path d="M60 162 H196 M74 162 Q90 186 104 162 M152 162 Q166 186 182 162" {S3}/>
<path d="M104 162 V112 A24 24 0 0 1 152 112 V162 Z" {P}/>
<path d="M104 162 V112 A24 24 0 0 1 152 112 V162" {S}/>
<path d="M128 104 V148 M116 118 H140" stroke="{RUB}" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M128 72 V60 M104 80 l-8 -9 M152 80 l8 -9" {S2}/>
<rect x="74" y="122" width="14" height="40" {W}/><rect x="74" y="122" width="14" height="40" {S3}/>
<rect x="168" y="122" width="14" height="40" {W}/><rect x="168" y="122" width="14" height="40" {S3}/>
<path d="M81 116 Q71 102 81 88 Q91 102 81 116 Z" {R} stroke="{INK}" stroke-width="2.5"/>
<path d="M175 116 Q165 102 175 88 Q185 102 175 116 Z" {R} stroke="{INK}" stroke-width="2.5"/>"""

ICONS["camp"] = f"""
<path d="M72 212 L128 56 L184 212" {S}/>
<path d="M128 62 V98" {S3}/>
<path d="M98 100 H158 Q158 146 128 146 Q98 146 98 100 Z" {H}/>
<path d="M98 100 H158 Q158 146 128 146 Q98 146 98 100 Z" {S}/>
<path d="M94 100 H162" {S}/>
<path d="M128 196 Q106 182 116 160 Q122 172 128 166 Q126 150 138 140 Q134 160 146 168 Q150 184 128 196 Z" {R}/>
<path d="M128 196 Q106 182 116 160 Q122 172 128 166 Q126 150 138 140 Q134 160 146 168 Q150 184 128 196 Z" {S3}/>
<path d="M80 214 L176 190 M80 190 L176 214" stroke="{INK}" stroke-width="11" stroke-linecap="round"/>
<path d="M82 214 L174 191 M82 190 L174 213" stroke="{WASH}" stroke-width="5" stroke-linecap="round" stroke-opacity="0.6"/>
<path d="M140 60 Q150 46 140 34 Q132 22 144 12" {S2}/>"""

ICONS["hidden"] = f"""
<path d="M70 120 Q128 76 186 120 V176 H70 Z" {W}/>
<path d="M150 98 Q172 104 186 120 V176 H150 Z" {H}/>
<path d="M70 120 Q128 76 186 120 V176 H70 Z" {S}/>
<path d="M70 124 H186 M92 98 V176 M164 98 V176" {S3}/>
<rect x="118" y="116" width="20" height="24" rx="3" {P} stroke="{INK}" stroke-width="3"/>
<path d="M128 124 v8" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
<path d="M40 178 Q80 160 128 170 Q176 160 216 178" {S}/>
<path d="M54 192 l6 2 M84 186 l5 3 M168 186 l5 2 M196 192 l6 3" {S2}/>
<path d="M98 194 L158 226 M158 194 L98 226" stroke="{RUB}" stroke-width="9" stroke-linecap="round"/>"""

stones = "".join(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" {W}/><path d="M{cx-rx} {cy} A{rx} {ry} 0 0 0 {cx+rx} {cy}" fill="url(#hatch)" opacity="0.7"/><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" {S3}/>'
                 for cx, cy, rx, ry in [(128, 202, 62, 15), (124, 180, 50, 13), (132, 160, 40, 12), (126, 142, 30, 10)])
ICONS["waypoint"] = f"""
{stones}
<path d="M106 96 L128 74 L150 96 Z" {W}/><path d="M104 96 L128 72 L152 96 Z" {S3}/>
<circle cx="128" cy="66" r="6" {S3}/>
<rect x="112" y="96" width="32" height="36" fill="{RUB}" fill-opacity="0.75"/>
<rect x="112" y="96" width="32" height="36" {S3}/>
<path d="M128 96 V132 M112 114 H144" {S2}/>
<path d="M108 132 H148" {S}/>
<path d="M92 108 H76 M164 108 H180 M98 84 l-12 -10 M158 84 l12 -10" {S3}/>"""

ICONS["boss"] = f"""
<path d="M90 172 V74 L102 50 L114 74 V60 L128 34 L142 60 V74 L154 50 L166 74 V172 Z" {H}/>
<path d="M90 172 V74 L102 50 L114 74 V60 L128 34 L142 60 V74 L154 50 L166 74 V172" {S}/>
<path d="M108 168 V96 A20 20 0 0 1 148 96 V168" {P}/><path d="M108 168 V96 A20 20 0 0 1 148 96 V168" {S3}/>
<path d="M74 172 H182 V188 H74 Z" {W}/><path d="M74 172 H182 V188 H74 Z" {S}/>
<path d="M74 150 H98 V172 M182 150 H158 V172" {S}/>
<path d="M82 188 V216 M174 188 V216 M96 188 V206 M160 188 V206" {S}/>
<path d="M108 168 L110 140 L119 152 L128 132 L137 152 L146 140 L148 168 Z" {R}/>
<path d="M108 168 L110 140 L119 152 L128 132 L137 152 L146 140 L148 168 Z" {S3}/>"""

ICONS["forge"] = f"""
<path d="M52 104 H180 Q200 104 214 92 Q206 124 176 130 V150 H160 L172 186 H82 L94 150 H80 V130 Q58 128 52 104 Z" {W}/>
<path d="M80 130 H176 V150 H80 Z" {H}/>
<path d="M52 104 H180 Q200 104 214 92 Q206 124 176 130 V150 H160 L172 186 H82 L94 150 H80 V130 Q58 128 52 104 Z" {S}/>
<path d="M70 198 H184" {S}/>
<path d="M110 92 L150 40" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>
<path d="M130 32 L168 58 L176 46 L140 20 Z" {W}/><path d="M130 32 L168 58 L176 46 L140 20 Z" {S3}/>
<path d="M98 86 l-14 -8 M92 96 l-16 2 M108 80 l-4 -14" stroke="{RUB}" stroke-width="4" stroke-linecap="round"/>"""

ICONS["unknown"] = f"""
<path d="M62 160 Q40 160 44 140 Q48 122 68 126 Q66 98 94 98 Q104 74 132 82 Q154 66 172 88 Q200 86 200 112 Q222 118 214 140 Q210 160 188 160 Z" {P}/>
<path d="M62 160 Q40 160 44 140 Q48 122 68 126 Q66 98 94 98 Q104 74 132 82 Q154 66 172 88 Q200 86 200 112 Q222 118 214 140 Q210 160 188 160 Z" {S3} stroke-dasharray="3 7"/>
<path d="M78 138 Q92 120 110 132 Q124 110 146 124 Q166 112 180 134" {S2} stroke-dasharray="2 6"/>
<path d="M66 176 H194 M84 190 H176" {S2} stroke-dasharray="4 9"/>"""

ICONS["pennant"] = f"""
<path d="M86 30 V226" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>
<circle cx="86" cy="26" r="7" {W}/><circle cx="86" cy="26" r="7" {S3}/>
<path d="M90 40 Q140 30 196 46 L166 76 L200 106 Q140 92 90 104 Z" {R}/>
<path d="M90 40 Q140 30 196 46 L166 76 L200 106 Q140 92 90 104 Z" fill="url(#hatch)" opacity="0.3"/>
<path d="M90 40 Q140 30 196 46 L166 76 L200 106 Q140 92 90 104 Z" {S3}/>
<path d="M70 226 H104" {S}/>"""

# compass rose (256 box)
import math
pts_main = []
for i in range(4):
    a = i * math.pi / 2 - math.pi / 2
    tip = (128 + 104 * math.cos(a), 128 + 104 * math.sin(a))
    l = (128 + 20 * math.cos(a - math.pi / 4), 128 + 20 * math.sin(a - math.pi / 4))
    rgt = (128 + 20 * math.cos(a + math.pi / 4), 128 + 20 * math.sin(a + math.pi / 4))
    fill_l = RUB if i == 0 else INK
    pts_main.append(f'<path d="M128 128 L{tip[0]:.1f} {tip[1]:.1f} L{l[0]:.1f} {l[1]:.1f} Z" fill="{fill_l}"/>'
                    f'<path d="M128 128 L{tip[0]:.1f} {tip[1]:.1f} L{rgt[0]:.1f} {rgt[1]:.1f} Z" {P}/>'
                    f'<path d="M128 128 L{tip[0]:.1f} {tip[1]:.1f} L{rgt[0]:.1f} {rgt[1]:.1f} Z" fill="url(#hatch)" opacity="0.5"/>'
                    f'<path d="M{l[0]:.1f} {l[1]:.1f} L{tip[0]:.1f} {tip[1]:.1f} L{rgt[0]:.1f} {rgt[1]:.1f}" {S2}/>')
pts_minor = []
for i in range(4):
    a = i * math.pi / 2 - math.pi / 4
    tip = (128 + 64 * math.cos(a), 128 + 64 * math.sin(a))
    l = (128 + 14 * math.cos(a - math.pi / 4), 128 + 14 * math.sin(a - math.pi / 4))
    rgt = (128 + 14 * math.cos(a + math.pi / 4), 128 + 14 * math.sin(a + math.pi / 4))
    pts_minor.append(f'<path d="M{l[0]:.1f} {l[1]:.1f} L{tip[0]:.1f} {tip[1]:.1f} L{rgt[0]:.1f} {rgt[1]:.1f} L128 128 Z" {W}/>'
                     f'<path d="M{l[0]:.1f} {l[1]:.1f} L{tip[0]:.1f} {tip[1]:.1f} L{rgt[0]:.1f} {rgt[1]:.1f}" {S2}/>')
ticks = "".join(f'<path d="M{128+76*math.cos(i*math.pi/16):.1f} {128+76*math.sin(i*math.pi/16):.1f} L{128+(82 if i%2 else 86)*math.cos(i*math.pi/16):.1f} {128+(82 if i%2 else 86)*math.sin(i*math.pi/16):.1f}" {S2}/>' for i in range(32))
ICONS["compass"] = f"""
<circle cx="128" cy="128" r="74" {S2}/><circle cx="128" cy="128" r="88" {S3}/>{ticks}
{''.join(pts_minor)}{''.join(pts_main)}
<circle cx="128" cy="128" r="6" {P} stroke="{INK}" stroke-width="2.5"/>"""

ICONS["stain"] = f"""
<path d="M40 130 Q36 70 98 56 Q150 30 196 70 Q232 104 210 150 Q196 206 130 204 Q62 210 40 130 Z" fill="#4f6a78" fill-opacity="0.28"/>
<path d="M40 130 Q36 70 98 56 Q150 30 196 70 Q232 104 210 150 Q196 206 130 204 Q62 210 40 130 Z" fill="none" stroke="#3c5260" stroke-opacity="0.5" stroke-width="3"/>
<path d="M64 126 Q70 90 112 80 Q150 64 182 92" fill="none" stroke="#3c5260" stroke-opacity="0.3" stroke-width="2"/>"""


def svg(body, w=256, h=256, filt=True):
    g = f'<g filter="url(#ink)">{body}</g>' if filt else body
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{DEFS}{g}</svg>'


def sheet(w, h):
    """The chart itself: aged paper, foxing, a burnt and darkened edge, a double ink rule with corner knots."""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs>
 <filter id="paper" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="4" seed="11" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.31  0 0 0 0 0.18  0 0 0 -1.6 1.05" result="m"/>
  <feComposite in="m" in2="SourceGraphic" operator="in"/>
 </filter>
 <filter id="fibre" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.6 0.05" numOctaves="2" seed="5" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 -2.2 1.2"/>
  <feComposite in2="SourceGraphic" operator="in"/>
 </filter>
 <filter id="edge" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="2" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G"/>
 </filter>
 <filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="9" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>
 <radialGradient id="vig" cx="50%" cy="50%" r="72%">
  <stop offset="62%" stop-color="#6f5036" stop-opacity="0"/>
  <stop offset="100%" stop-color="#4a3220" stop-opacity="0.55"/></radialGradient>
 <mask id="clip" maskUnits="userSpaceOnUse" x="0" y="0" width="{w}" height="{h}"><rect x="16" y="16" width="{w-32}" height="{h-32}" rx="6" fill="#fff" filter="url(#edge)"/></mask>
</defs>
<g mask="url(#clip)">
 <rect width="{w}" height="{h}" fill="#eadcb9"/>
 <rect width="{w}" height="{h}" fill="#000" filter="url(#paper)" opacity="0.32"/>
 <rect width="{w}" height="{h}" fill="#000" filter="url(#fibre)" opacity="0.18"/>
 <rect width="{w}" height="{h}" fill="url(#vig)"/>
 <circle cx="{w*0.82:.0f}" cy="{h*0.22:.0f}" r="26" fill="#8a6a3e" opacity="0.08"/>
 <circle cx="{w*0.17:.0f}" cy="{h*0.74:.0f}" r="40" fill="#8a6a3e" opacity="0.07"/>
 <circle cx="{w*0.55:.0f}" cy="{h*0.9:.0f}" r="18" fill="#8a6a3e" opacity="0.09"/>
 <g filter="url(#wob)" fill="none" stroke="{INK}">
  <rect x="34" y="34" width="{w-68}" height="{h-68}" stroke-width="3.2"/>
  <rect x="44" y="44" width="{w-88}" height="{h-88}" stroke-width="1.3"/>
  {''.join(f'<path d="M{x} {y} m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M{x-16} {y} H{x+16} M{x} {y-16} V{y+16}" stroke-width="2" fill="#eadcb9"/>' for x, y in [(39, 39), (w-39, 39), (39, h-39), (w-39, h-39)])}
 </g>
</g>
</svg>"""


def cartouche(w=520, h=74):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{DEFS}
<g filter="url(#ink)">
<path d="M40 8 H{w-40} Q{w-22} 8 {w-14} {h/2} Q{w-22} {h-8} {w-40} {h-8} H40 Q22 {h-8} 14 {h/2} Q22 8 40 8 Z" fill="#efe3c6"/>
<path d="M40 8 H{w-40} Q{w-22} 8 {w-14} {h/2} Q{w-22} {h-8} {w-40} {h-8} H40 Q22 {h-8} 14 {h/2} Q22 8 40 8 Z" {S3}/>
<path d="M46 15 H{w-46} Q{w-30} 15 {w-24} {h/2} Q{w-30} {h-15} {w-46} {h-15} H46 Q30 {h-15} 24 {h/2} Q30 15 46 15 Z" {S2}/>
<path d="M14 {h/2} Q4 {h/2-14} 8 {h/2-24} M14 {h/2} Q4 {h/2+14} 8 {h/2+24} M{w-14} {h/2} Q{w-4} {h/2-14} {w-8} {h/2-24} M{w-14} {h/2} Q{w-4} {h/2+14} {w-8} {h/2+24}" {S2}/>
</g></svg>"""


def main():
    os.makedirs(OUT, exist_ok=True)
    jobs = [(f"ink_{k}.png", svg(v)) for k, v in ICONS.items()]
    jobs.append(("sheet.png", sheet(1560, 812)))
    jobs.append(("cartouche.png", cartouche()))
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for name, s in jobs:
            pg.set_content(f'<html><body style="margin:0;background:transparent">{s}</body></html>')
            pg.locator("svg").screenshot(path=os.path.join(OUT, name), omit_background=True)
        b.close()
    print("map ink:", len(jobs), "files ->", OUT)


if __name__ == "__main__":
    main()
