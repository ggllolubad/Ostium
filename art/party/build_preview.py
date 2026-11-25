#!/usr/bin/env python3
# Builds preview.html: three art directions for the starter party, images embedded as WebP.
import base64, io, json, html
from PIL import Image

OUT = '/home/claude/party/out'
notes = json.load(open('/home/claude/party/notes.json'))

def b64(path, w=None, bg=None, q=82):
    im = Image.open(path).convert('RGBA')
    if bg:
        c = Image.new('RGBA', im.size, bg); c.alpha_composite(im); im = c
    if w and im.width > w:
        im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=q, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()

def crop_fig(path):
    im = Image.open(path).convert('RGBA'); bb = im.getbbox()
    pad = 16; bb = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.width, bb[2] + pad), min(im.height, bb[3] + pad))
    p = path.replace('.png', '_crop.png'); im.crop(bb).save(p); return p

def sil_strip():
    row = []
    for d in ['dirA', 'dirB', 'dirC']:
        for k in ['bulwark', 'duelist', 'elementalist']:
            s = Image.open(f'{OUT}/{d}_{k}_sil.png').convert('RGBA')
            bb = s.convert('L').point(lambda v: 255 if v < 128 else 0).getbbox()
            s = s.crop((max(0, bb[0] - 10), 0, min(s.width, bb[2] + 10), s.height))
            s = s.resize((int(s.width * 190 / s.height), 190), Image.LANCZOS); row.append(s)
    w = sum(r.width for r in row) + 14 * (len(row) - 1)
    c = Image.new('RGBA', (w, 190), (216, 210, 196, 255)); x = 0
    for r in row: c.paste(r, (x, 0)); x += r.width + 14
    c.save(f'{OUT}/sil_strip.png'); return f'{OUT}/sil_strip.png'

E = html.escape
dirs_html = ''
for d in notes['directions']:
    k = d['key']
    cards = ''
    for h in d['heroes']:
        img = b64(crop_fig(f"{OUT}/{k}_{h['key']}.png"), w=520)
        details = ''.join(f'<li>{E(x)}</li>' for x in h['details'])
        cards += f'''<article class="hero">
  <div class="plate"><img src="{img}" alt="{E(h['alt'])}" loading="lazy"></div>
  <div class="cap"><p class="role">{E(h['role'])}</p><h4>{E(h['name'])}</h4><p>{E(h['pitch'])}</p><ul>{details}</ul></div>
</article>'''
    dirs_html += f'''<section class="dir" id="{k}" aria-labelledby="{k}-h">
  <div class="dir-head"><span class="mark">{E(d['letter'])}</span><div><h2 id="{k}-h">{E(d['name'])}</h2><p class="line">{E(d['line'])}</p></div></div>
  <dl class="specs">{''.join(f'<div><dt>{E(a)}</dt><dd>{E(b)}</dd></div>' for a, b in d['specs'])}</dl>
  <figure class="lineup"><img src="{b64(f'{OUT}/{k}_lineup.png', w=1500)}" alt="{E(d['name'])} party lineup, marching order with the Bulwark in front"><figcaption>Marching order: Elementalist at the back, Duelist in the middle, Bulwark in front.</figcaption></figure>
  <div class="heroes">{cards}</div>
</section>'''

ad = ''.join(f'<li><strong>{E(a)}</strong> {E(b)}</li>' for a, b in notes['ad_fixed'])
ad_open = ''.join(f'<li>{E(x)}</li>' for x in notes['ad_open'])
old = b64('/tmp/claude-0/-home-claude/b481cb9f-fd90-5adc-8daf-8b9ac366d903/scratchpad/pilot/sheet.png', w=1400)
sil = b64(sil_strip(), w=1600)
q = ''.join(f'<li>{E(x)}</li>' for x in notes['questions'])

page = f'''<title>Ostium Party Rebuild</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Source+Sans+3:wght@400;600&display=swap">
<style>
/* Layout: a dark campaign ledger. Each direction is one folio: lineup first, then the three heroes as plates with notes. */
:root {{
  --bg: #121010; --surface: #1c1917; --plate: #2a2420; --ink: #ece4d6; --muted: #a99e8e; --rule: #3a332d; --rubric: #c4473a; --tile: #d8d2c4;
  --display: "IM Fell English", "Iowan Old Style", Georgia, serif;
  --sc: "IM Fell English SC", "IM Fell English", Georgia, serif;
  --body: "Source Sans 3", "Segoe UI", system-ui, sans-serif;
  color-scheme: dark;
}}
body {{ background: var(--bg); color: var(--ink); font: 16px/1.55 var(--body); }}
.wrap {{ max-width: 1240px; margin: 0 auto; padding-block: 40px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 56px; }}
header {{ display: grid; gap: 12px; max-width: 72ch; }}
.eyebrow {{ font: 600 12px/1 var(--body); letter-spacing: .14em; text-transform: uppercase; color: var(--rubric); }}
h1 {{ font: 400 clamp(38px, 6vw, 62px)/1.02 var(--display); margin: 0; text-wrap: balance; }}
h2 {{ font: 400 clamp(28px, 4vw, 38px)/1.05 var(--display); margin: 0; text-wrap: balance; }}
h3 {{ font: 400 24px/1.15 var(--display); margin: 0; }}
h4 {{ font: 400 22px/1.1 var(--display); margin: 0; }}
p {{ margin: 0; }}
.lead {{ font-size: 18px; color: var(--muted); }}
.jump {{ display: flex; flex-wrap: wrap; gap: 8px 18px; font: 15px/1.3 var(--sc); letter-spacing: .04em; }}
.jump a {{ color: var(--ink); text-decoration-color: var(--rubric); text-underline-offset: 4px; }}
.jump a:focus-visible, a:focus-visible {{ outline: 2px solid var(--rubric); outline-offset: 3px; }}
.compare {{ display: grid; gap: 14px; }}
.compare .pair {{ display: grid; gap: 14px; grid-template-columns: minmax(0, 1fr); }}
.tile {{ background: var(--tile); border-radius: 4px; padding: 12px; overflow-x: auto; }}
.tile img {{ display: block; max-width: none; height: 190px; width: auto; }}
.tile.old img {{ height: 220px; }}
.small {{ font-size: 14px; color: var(--muted); }}
.dir {{ display: grid; gap: 22px; padding-top: 32px; border-top: 1px solid var(--rule); }}
.dir-head {{ display: flex; gap: 18px; align-items: flex-start; }}
.mark {{ font: 400 54px/0.9 var(--display); color: var(--rubric); min-width: 0.9em; }}
.line {{ font: italic 19px/1.35 var(--display); color: var(--muted); margin-top: 6px; max-width: 70ch; }}
.specs {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px 24px; margin: 0; }}
.specs div {{ border-left: 2px solid var(--rule); padding-left: 12px; }}
.specs dt {{ font: 600 11px/1.2 var(--body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }}
.specs dd {{ margin: 4px 0 0; font-size: 15px; }}
.lineup {{ margin: 0; display: grid; gap: 8px; }}
.lineup img {{ width: 100%; height: auto; border-radius: 4px; display: block; }}
figcaption {{ font-size: 13px; color: var(--muted); }}
.heroes {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }}
.hero {{ background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; display: grid; grid-template-rows: auto 1fr; min-width: 0; }}
.plate {{ background: radial-gradient(ellipse at 50% 40%, #3a3129, #161311 75%); display: grid; place-items: end center; height: 440px; padding: 14px 10px 6px; }}
.plate img {{ max-height: 420px; width: auto; max-width: 100%; }}
.cap {{ padding: 14px 16px 18px; display: grid; gap: 8px; align-content: start; }}
.role {{ font: 600 11px/1 var(--body); letter-spacing: .14em; text-transform: uppercase; color: var(--rubric); }}
.cap ul {{ margin: 2px 0 0; padding-left: 1.1em; display: grid; gap: 4px; font-size: 14px; color: var(--muted); }}
.review {{ display: grid; gap: 18px; padding-top: 32px; border-top: 1px solid var(--rule); }}
.cols {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }}
.cols ul, .ask ol {{ margin: 0; padding-left: 1.2em; display: grid; gap: 8px; }}
.ask {{ display: grid; gap: 14px; padding: 22px; background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; }}
strong {{ color: var(--ink); font-weight: 600; }}
@media (max-width: 900px) {{ .heroes {{ grid-template-columns: 1fr; }} .cols {{ grid-template-columns: 1fr; }} .plate {{ height: 400px; }} .plate img {{ max-height: 380px; }} }}
</style>
<div class="wrap">
  <header>
    <span class="eyebrow">Character direction · {E(notes['date'])}</span>
    <h1>Ostium Party Rebuild</h1>
    <p class="lead">{E(notes['lead'])}</p>
    <nav class="jump" aria-label="Directions">{''.join(f'<a href="#{d["key"]}">{E(d["letter"])} · {E(d["name"])}</a>' for d in notes['directions'])}<a href="#review">Art director review</a></nav>
  </header>
  <section class="compare" aria-labelledby="cmp-h">
    <h3 id="cmp-h">Before and after, as silhouettes</h3>
    <p class="small">The current pilot art first. Then all nine new figures as solid black at roughly in-game height, in the order A, B, C (Bulwark, Duelist, Elementalist). Each one should be recognisable from its shape alone.</p>
    <div class="tile old"><img src="{old}" alt="Current Bulwark and Drowned Thrall pilot art: stiff, upright, tube-limbed"></div>
    <div class="tile"><img src="{sil}" alt="Silhouettes of the nine new hero figures"></div>
  </section>
  {dirs_html}
  <section class="review" id="review" aria-labelledby="rev-h">
    <h2 id="rev-h">Art director review</h2>
    <p class="small">{E(notes['ad_intro'])}</p>
    <div class="cols">
      <div><h3>Found and fixed</h3><ul>{ad}</ul></div>
      <div><h3>Still open</h3><ul>{ad_open}</ul></div>
    </div>
  </section>
  <section class="ask" aria-labelledby="ask-h">
    <h3 id="ask-h">What to redirect</h3>
    <ol>{q}</ol>
  </section>
</div>
'''
open('/home/claude/party/preview.html', 'w').write(page)
print(len(page) // 1024, 'KB')
