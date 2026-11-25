#!/usr/bin/env python3
# Builds preview_ac.html: the A+C "Living Ink" cast. Images embedded as WebP.
import base64, io, json, html
from PIL import Image

OUT = '/home/claude/party/out'
N = json.load(open('/home/claude/party/notes_ac.json'))
E = html.escape

def b64(path, w=None, bg=None, q=82, crop=False):
    im = Image.open(path).convert('RGBA')
    if crop:
        bb = im.getbbox(); p = 14
        im = im.crop((max(0, bb[0] - p), max(0, bb[1] - p), min(im.width, bb[2] + p), min(im.height, bb[3] + p)))
    if bg:
        c = Image.new('RGBA', im.size, bg); c.alpha_composite(im); im = c
    if w and im.width > w:
        im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=q, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()

cards = ''
for c in N['cast']:
    img = b64(f"{OUT}/{c['file']}.png", w=480, crop=True)
    det = ''.join(f'<li>{E(x)}</li>' for x in c['details'])
    cards += f'''<article class="ent {E(c['kind'])}">
  <div class="plate"><img src="{img}" alt="{E(c['alt'])}" loading="lazy"></div>
  <div class="cap"><p class="role">{E(c['role'])}</p><h3>{E(c['name'])}</h3><p>{E(c['pitch'])}</p><ul>{det}</ul></div>
</article>'''

fixed = ''.join(f'<li><strong>{E(a)}</strong> {E(b)}</li>' for a, b in N['ad_fixed'])
openi = ''.join(f'<li>{E(x)}</li>' for x in N['ad_open'])
qs = ''.join(f'<li>{E(x)}</li>' for x in N['questions'])
before = b64(f'{OUT}/dirA_bulwark.png', w=420, crop=True)
after = b64(f'{OUT}/dirAC_bulwark.png', w=420, crop=True)

page = f'''<title>Ostium Living Ink Cast</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Source+Sans+3:wght@400;600&display=swap">
<style>
/* Layout: a Codex folio. The encounter opens the page as the plate; the cast follows as catalogued entries. */
:root {{
  --bg: #15120f; --surface: #1e1a16; --ink: #ece4d6; --muted: #aa9f8f; --rule: #3a332c; --rubric: #c4473a; --tile: #d8d2c4; --warm: #e0a25a;
  --display: "IM Fell English", "Iowan Old Style", Georgia, serif;
  --sc: "IM Fell English SC", "IM Fell English", Georgia, serif;
  --body: "Source Sans 3", "Segoe UI", system-ui, sans-serif;
  color-scheme: dark;
}}
body {{ background: var(--bg); color: var(--ink); font: 16px/1.55 var(--body); }}
.wrap {{ max-width: 1240px; margin: 0 auto; padding-block: 40px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 52px; }}
header {{ display: grid; gap: 12px; max-width: 74ch; }}
.eyebrow {{ font: 600 12px/1 var(--body); letter-spacing: .14em; text-transform: uppercase; color: var(--rubric); }}
h1 {{ font: 400 clamp(38px, 6vw, 62px)/1.02 var(--display); margin: 0; text-wrap: balance; }}
h2 {{ font: 400 clamp(26px, 3.6vw, 36px)/1.08 var(--display); margin: 0; text-wrap: balance; }}
h3 {{ font: 400 22px/1.12 var(--display); margin: 0; }}
p {{ margin: 0; }}
.lead {{ font-size: 18px; color: var(--muted); }}
.small {{ font-size: 14px; color: var(--muted); max-width: 74ch; }}
section {{ display: grid; gap: 16px; }}
section + section {{ padding-top: 28px; border-top: 1px solid var(--rule); }}
figure {{ margin: 0; display: grid; gap: 8px; }}
.wide {{ overflow-x: auto; border-radius: 4px; }}
.wide img {{ display: block; width: 100%; height: auto; }}
.wide.roster img {{ width: auto; height: 420px; max-width: none; }}
figcaption {{ font-size: 13px; color: var(--muted); }}
.ba {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; max-width: 760px; }}
.ba figure {{ background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; padding: 12px; }}
.ba .plate {{ height: 400px; }}
.cast {{ display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }}
.ent {{ background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; display: grid; grid-template-rows: auto 1fr; min-width: 0; }}
.plate {{ background: radial-gradient(ellipse at 50% 40%, #4a3f33, #18140f 78%); display: grid; place-items: end center; height: 380px; padding: 12px 8px 6px; }}
.plate img {{ max-height: 360px; width: auto; max-width: 100%; }}
.ent.foe .plate {{ background: radial-gradient(ellipse at 50% 40%, #2e3a38, #101614 78%); }}
.ent.keeper .plate {{ background: radial-gradient(ellipse at 50% 45%, #6a4a2a, #1c120a 78%); }}
.cap {{ padding: 12px 14px 16px; display: grid; gap: 7px; align-content: start; }}
.role {{ font: 600 11px/1 var(--body); letter-spacing: .14em; text-transform: uppercase; color: var(--rubric); }}
.ent.foe .role {{ color: #7fb0a8; }}
.ent.keeper .role {{ color: var(--warm); }}
.cap ul {{ margin: 2px 0 0; padding-left: 1.1em; display: grid; gap: 3px; font-size: 14px; color: var(--muted); }}
.tile {{ background: var(--tile); border-radius: 4px; padding: 12px; overflow-x: auto; }}
.tile img {{ display: block; height: 190px; width: auto; max-width: none; }}
.cols {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }}
.logic {{ margin: 0; padding-left: 1.2em; display: grid; gap: 8px; max-width: 86ch; }}
.cols ul, .ask ol {{ margin: 0; padding-left: 1.2em; display: grid; gap: 8px; }}
.ask {{ padding: 22px; background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; }}
strong {{ font-weight: 600; }}
@media (max-width: 1000px) {{ .cast {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }} }}
@media (max-width: 620px) {{ .cast, .ba, .cols {{ grid-template-columns: 1fr; }} .wide.roster img {{ height: 300px; }} }}
</style>
<div class="wrap">
  <header>
    <span class="eyebrow">Character direction · {E(N['date'])}</span>
    <h1>Ostium Living Ink Cast</h1>
    <p class="lead">{E(N['lead'])}</p>
  </header>
  <section aria-labelledby="enc-h">
    <h2 id="enc-h">First encounter</h2>
    <figure class="wide"><img src="{b64(f'{OUT}/AC_encounter.png', w=1900)}" alt="The starter party in marching order facing a Drowned Thrall"><figcaption>Elementalist, Duelist and Bulwark in marching order against a Drowned Thrall. Heroes face right, foes face left, one key light from the upper left.</figcaption></figure>
  </section>
  <section aria-labelledby="bul-h">
    <h2 id="bul-h">The Bulwark, standing taller</h2>
    <p class="small">{E(N['bulwark_note'])}</p>
    <div class="ba">
      <figure><div class="plate"><img src="{before}" alt="Direction A Bulwark, hunched"></div><figcaption>Before: direction A, hunched low behind the door.</figcaption></figure>
      <figure><div class="plate"><img src="{after}" alt="Living Ink Bulwark, standing taller"></div><figcaption>Now: spine more upright, helm higher, still braced on the door.</figcaption></figure>
    </div>
  </section>
  <section aria-labelledby="ros-h">
    <h2 id="ros-h">The six callings and a keeper</h2>
    <figure class="wide roster"><img src="{b64(f'{OUT}/AC_roster.png', w=3000)}" alt="All six hero callings and Mother Hild the Smith side by side"><figcaption>Bulwark, Duelist, Elementalist, Alchemist, Oracle, Hexweaver, and Mother Hild of the undercroft smithy. Scroll sideways on a narrow screen.</figcaption></figure>
  </section>
  <section aria-labelledby="cast-h">
    <h2 id="cast-h">The entries</h2>
    <div class="cast">{cards}</div>
  </section>
  <section aria-labelledby="sil-h">
    <h2 id="sil-h">Silhouettes at game size</h2>
    <p class="small">All eight as solid black at about in-game height. Each should be recognisable from its shape alone.</p>
    <div class="tile"><img src="{b64(f'{OUT}/AC_sil.png', w=1600)}" alt="Silhouettes of the eight figures"></div>
  </section>
  <section aria-labelledby="log-h">
    <h2 id="log-h">Logic audit</h2>
    <p class="small">{E(N['logic_intro'])}</p>
    <ul class="logic">{''.join(f'<li><strong>{E(a)}:</strong> {E(b)}</li>' for a, b in N['logic'])}</ul>
  </section>
  <section aria-labelledby="rev-h">
    <h2 id="rev-h">Art director review</h2>
    <p class="small">{E(N['ad_intro'])}</p>
    <div class="cols"><div><h3>Found and fixed</h3><ul>{fixed}</ul></div><div><h3>Still open</h3><ul>{openi}</ul></div></div>
  </section>
  <section class="ask" aria-labelledby="ask-h">
    <h3 id="ask-h">What to redirect</h3>
    <ol>{qs}</ol>
  </section>
</div>
'''
open('/home/claude/party/preview_ac.html', 'w').write(page)
print(len(page) // 1024, 'KB')
