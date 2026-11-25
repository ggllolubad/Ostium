#!/usr/bin/env python3
# Builds bestiary.html: every reviewed world, creature cards in bible order plus a true-scale lineup.
# Add a world to SECTIONS once it has passed independent review, then rerun and republish.
import base64, io, json, html, os, re, subprocess
from PIL import Image

ROOT = '/home/claude/party'
OUT = f'{ROOT}/out'
E = html.escape

SECTIONS = [
    dict(roman='I', title='The Drowned Kingdom', act='Act I', bible='world_I_drowned_kingdom.md',
         modules=['worlds/world_I_a', 'worlds/world_I_b', 'worlds/world_I_c'],
         extra={'Drowned Thrall': ('human', f'{OUT}/dirAC2_thrall.png')}),
    dict(roman='II', title='The Rotmire', act='Act I', bible='world_II_rotmire.md', modules=['worlds/world_II', 'worlds/world_II_b']),
    dict(roman='III', title='The Boiling Baths', act='Act I', bible='world_III_boiling_baths.md', modules=['worlds/world_III', 'worlds/world_III_b']),
    dict(roman='IV', title='The Sulphur Pits', act='Act II', bible='world_IV_sulphur_pits.md', modules=['worlds/world_IV', 'worlds/world_IV_b']),
    dict(roman='V', title='The Storm Foundry', act='Act II', bible='world_V_storm_foundry.md', modules=['worlds/world_V','worlds/world_V_b']),
    dict(roman='VI', title='The Stormwrack Coast', act='Act II', bible='world_VI_stormwrack_coast.md', modules=['worlds/world_VI','worlds/world_VI_b']),
    dict(roman='VII', title='The Icebound Fleet', act='Act III', bible='world_VII_icebound_fleet.md', modules=['worlds/world_VII','worlds/world_VII_b']),
    dict(roman='VIII', title='The Sundered Rime', act='Act III', bible='world_VIII_sundered_rime.md', modules=['worlds/world_VIII','worlds/world_VIII_b']),
    dict(roman='IX', title='The Hollow Barrow', act='Act III', bible='world_IX_hollow_barrow.md', modules=['worlds/world_IX','worlds/world_IX_b']),
    dict(roman='X', title='The Venom Spires', act='Act IV', bible='world_X_venom_spires.md', modules=['worlds/world_X','worlds/world_X_b']),
    dict(roman='XI', title='The Stilled Spire', act='Act IV', bible='world_XI_stilled_spire.md', modules=['worlds/world_XI','worlds/world_XI_b']),
    dict(roman='XII', title='The White Silence', act='Act IV', bible='world_XII_white_silence.md', modules=['worlds/world_XII','worlds/world_XII_b']),
    dict(roman='XIII', title='The Black Pyre', act='Act V', bible='world_XIII_black_pyre.md', modules=['worlds/world_XIII','worlds/world_XIII_b']),
    dict(roman='XIV', title='The Blighted Garden', act='Act V', bible='world_XIV_blighted_garden.md', modules=['worlds/world_XIV','worlds/world_XIV_b']),
    dict(roman='XV', title='The Torn Sky', act='Act V', bible='world_XV_torn_sky.md', modules=['worlds/world_XV','worlds/world_XV_b']),
]
# Hub keepers are listed separately (not a bible world file).
KEEPERS = dict(module='worlds/keepers', title='The Keepers of the Priory')

def norm(s):
    import unicodedata
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z]', '', s.lower().replace('the ', ''))

def bible(path):
    """Returns intro paragraph and [(name, lore, group)] in bible order."""
    txt = open(f'{ROOT}/bible/{path}').read()
    intro = ''
    for line in txt.splitlines():
        if line.startswith('A ') or line.startswith('An ') or line.startswith('The '):
            if len(line) > 120: intro = line; break
    out, group, name = [], '', None
    for line in txt.splitlines():
        if line.startswith('### '): group = line[4:].strip()
        elif line.startswith('#### '): name = line[5:].strip()
        elif name and '**Lore line:**' in line:
            m = re.search(r'"(.+)"', line); out.append((name, m.group(1) if m else '', group)); name = None
    intro = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', E(intro))
    return intro, out

def heroes(module):
    js = f"const D=require('./{module}');console.log(JSON.stringify(D.heroes.map(h=>({{key:h.key,name:h.name,tier:h.tier}}))))"
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))

def render_path(module, key):
    world = module.split('/')[-1]
    cands = [f'{OUT}/worlds/{world}_{key}.png']
    return max((p for p in cands if os.path.exists(p)), key=os.path.getmtime)

def crop(path):
    im = Image.open(path).convert('RGBA'); bb = im.getbbox(); p = 12
    return im.crop((max(0, bb[0] - p), max(0, bb[1] - p), min(im.width, bb[2] + p), min(im.height, bb[3] + p)))

def b64(im, w=None, q=76):
    if w and im.width > w: im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=q, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()

def lineup(items, scale=0.22, gap=10, h=430):
    """True-scale lineup: all renders share one pixel scale (human = 640 px), bottom-aligned on a ground line."""
    ims = []
    for it in items:
        im = Image.open(it['path']).convert('RGBA'); bb = im.getbbox()
        ground = im.height - 30
        im = im.crop((bb[0], bb[1], bb[2], max(bb[3], ground)))
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.LANCZOS)
        ims.append(im)
    W = sum(i.width for i in ims) + gap * (len(ims) + 1)
    H = max(h, max(i.height for i in ims) + 30)
    c = Image.new('RGBA', (W, H), (0, 0, 0, 0)); x = gap
    for im in ims:
        c.alpha_composite(im, (x, H - 18 - im.height)); x += im.width + gap
    return c

# ---- Environment scenes: written as separate WebP files beside the page (keeps the page under 16 MB) ----
SCN = f'{OUT}/scenes'
SCN_OUT = f'{OUT}/bestiary_files'
os.makedirs(SCN_OUT, exist_ok=True)
SCENE_FILES = {}  # published path -> local path
def scene_img(im, name, w=1600, q=80):
    im = im.convert('RGB')
    if im.width > w: im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    pub = f'scenes/{name}.webp'; loc = f'{SCN_OUT}/{name}.webp'
    im.save(loc, 'WEBP', quality=q, method=6); SCENE_FILES[pub] = loc
    return pub
def room_title(js):
    m = re.search(r':\s*([A-Z][A-Z \'\-]+?)\s*[\(,]', open(js).readline())
    if not m: return os.path.basename(js)
    w = m.group(1).strip().title().replace("'S", "'s").split(' ')
    return ' '.join(x.lower() if i and x.lower() in ('in', 'the', 'of', 'at', 'on', 'and') else x for i, x in enumerate(w))
BATTLE = {  # roman -> [(room key, scene js, boss name or None)]; regular rooms first, then boss rooms
    'I': [('nave','bg_drowned_nave',None),('stair','bg_drowned_stair',None),('ossuary','bg_drowned_ossuary',None),('belfry','bg_drowned_belfry','The Bell Below'),('throne','bg_drowned_throne','The Drowned King'),('brine_grotto','bg_drowned_grotto','Mother of Brine')],
    'II': [('mire_hut','bg_mire_hut',None),('mire_bog','bg_mire_bog',None),('mire_drown','bg_mire_drown',None),('mire_boss','bg_mire_boss','The Mire Mother')],
    'III': [('baths_pool','bg_baths_pool',None),('baths_furnace','bg_baths_furnace',None),('baths_cistern','bg_baths_cistern',None),('baths_boss','bg_baths_boss','The Simmering Matron')],
    'IV': [('pits_shaft','bg_pits_shaft',None),('pits_vent','bg_pits_vent',None),('pits_chapel','bg_pits_chapel',None),('pits_boss','bg_pits_boss','The Burning Lung')],
    'V': [('foundry_mould','bg_foundry_mould',None),('foundry_floor','bg_foundry_floor',None),('foundry_roof','bg_foundry_roof',None),('foundry_boss','bg_foundry_boss','The Anvil Titan')],
    'VI': [('coast_cliffs','bg_coast_cliffs',None),('coast_cove','bg_coast_cove',None),('coast_light','bg_coast_light',None),('coast_boss','bg_coast_boss','The Thunder Whale')],
    'VII': [('fleet_ice','bg_fleet_ice',None),('fleet_deck','bg_fleet_deck',None),('fleet_hold','bg_fleet_hold',None),('fleet_boss','bg_fleet_boss','The Leviathan in the Ice')],
    'VIII': [('rime_crevasse','bg_rime_crevasse',None),('rime_glacier','bg_rime_glacier',None),('rime_hall','bg_rime_hall',None),('rime_boss','bg_rime_boss','The Riven Jarl')],
    'IX': [('barrow_hall','bg_barrow_hall',None),('barrow_mound','bg_barrow_mound',None),('barrow_tomb','bg_barrow_tomb',None),('barrow_boss','bg_barrow_boss','The Barrow King')],
    'X': [('hive_spires','bg_hive_spires',None),('hive_comb','bg_hive_comb',None),('hive_brood','bg_hive_brood',None),('hive_boss','bg_hive_boss','The Hive Queen')],
    'XI': [('spire_orrery','bg_spire_orrery',None),('spire_stair','bg_spire_stair',None),('spire_top','bg_spire_top',None),('spire_boss','bg_spire_boss','The Last Hour')],
    'XII': [('silence_tundra','bg_silence_tundra',None),('silence_shrine','bg_silence_shrine',None),('silence_rift','bg_silence_rift',None),('silence_boss','bg_silence_boss','The Cold Star')],
    'XIII': [('pyre_nave','bg_pyre_nave',None),('pyre_stake','bg_pyre_stake',None),('pyre_crypt','bg_pyre_crypt',None),('pyre_boss','bg_pyre_boss','The Saint Unending')],
    'XIV': [('garden_hedge','bg_garden_hedge',None),('garden_grove','bg_garden_grove',None),('garden_heart','bg_garden_heart',None),('garden_boss','bg_garden_boss','The Antlered Mother')],
    'XV': [('sky_ruins','bg_sky_ruins',None),('sky_gate','bg_sky_gate',None),('sky_choir','bg_sky_choir',None),('sky_boss','bg_sky_boss','The Shattered God')],
}
def battle_block(roman):
    rooms = []
    for key, js, boss in BATTLE.get(roman, []):
        d = f'{SCN}/battle/{roman}'; prev = f'{d}/{key}_preview.png'
        if not os.path.exists(prev): continue
        base = Image.open(f'{d}/{key}_far.png').convert('RGBA')
        for lay in ('mid', 'fore'): base.alpha_composite(Image.open(f'{d}/{key}_{lay}.png').convert('RGBA').resize(base.size))
        a = scene_img(base, f'{roman}_{key}_room'); b = scene_img(Image.open(prev), f'{roman}_{key}_fighters')
        jsp = f'{ROOT}/scenes/{js}.js'
        t = room_title(jsp) if os.path.exists(jsp) else key
        head = f'Boss room: {E(t)} <span class="small">({E(boss)})</span>' if boss else f'Battle room: {E(t)}'
        rooms.append(f"""<div class="scene{' boss' if boss else ''}"><h3>{head}</h3>
  <div class="pair"><figure><img src="{a}" alt="{E(t)}, empty" loading="lazy"><figcaption>The room alone (far, mid and fore layers).</figcaption></figure>
  <figure><img src="{b}" alt="{E(t)} with fighters" loading="lazy"><figcaption>{'With the boss and its companion at true scale.' if boss else 'With 4 heroes and foes at true combat scale.'}</figcaption></figure></div></div>""")
    if not rooms:
        return '<p class="small pending">Battle room: in production.</p>'
    return '<div class="scenes">' + ''.join(rooms) + '</div>'
HUB_ROOMS = [
    (r, t, f'{SCN}/hub/{r}/{r}_preview.png', f'{SCN}/hub/{r}/{r}_lit_check.png') for r, t in
    [('guesthouse', 'The Guesthouse'), ('sacristy', 'The Sacristy'), ('scriptorium', 'The Scriptorium'), ('smithy', 'The Smithy (Undercroft)'), ('almonry', 'The Almonry'),
     ('cellarium', 'The Cellarium'), ('chapter', 'The Chapter House'), ('infirmarium', 'The Infirmarium')]]
def hub_block():
    out = ''
    for r, t, prev, lit in HUB_ROOMS:
        if not os.path.exists(prev): continue
        a = scene_img(Image.open(prev), f'hub_{r}_unlit'); b = scene_img(Image.open(lit), f'hub_{r}_lit')
        out += f"""<div class="scene"><h3>{E(t)}</h3>
  <div class="pair"><figure><img src="{a}" alt="{E(t)}, unlit preview" loading="lazy"><figcaption>Unlit art with its keeper.</figcaption></figure>
  <figure><img src="{b}" alt="{E(t)}, game lighting" loading="lazy"><figcaption>Rendered through the game's own lighting.</figcaption></figure></div></div>"""
    gd = f'{SCN}/hub/garth'
    if os.path.exists(f'{gd}/garth_lit_company.png'):
        a = scene_img(Image.open(f'{gd}/garth_unlit_vessel.png'), 'hub_garth_unlit'); b = scene_img(Image.open(f'{gd}/garth_lit_company.png'), 'hub_garth_lit')
        out = f"""<div class="scene"><h3>The Garth (the courtyard)</h3>
  <div class="pair"><figure><img src="{a}" alt="The garth, unlit, with the Vessel in the party" loading="lazy"><figcaption>Unlit art, with the Vessel in party slot 3. The belfry stands empty.</figcaption></figure>
  <figure><img src="{b}" alt="The garth under game lighting" loading="lazy"><figcaption>Rendered through the game's own lighting, with the four heroes.</figcaption></figure></div></div>""" + out
    tp = f'{SCN}/hub/title/title_preview.png'
    if os.path.exists(tp):
        out = f"""<div class="scene"><h3>Title screen</h3><figure><img src="{scene_img(Image.open(tp), 'hub_title', w=900)}" alt="The title sky over the garth" loading="lazy" style="max-width:640px"><figcaption>The title sky over the garth. The belfry is empty here too.</figcaption></figure></div>""" + out
    ps = f'{SCN}/hub/panels/panels_v3_sheet.png'
    if os.path.exists(ps):
        out += f"""<div class="scene"><h3>Shop and service panels</h3><figure><img src="{scene_img(Image.open(ps), 'hub_panels', w=1400)}" alt="The eight shop panels" loading="lazy"><figcaption>All eight panels; text and items are filled in by the game.</figcaption></figure></div>"""
    ic = f'{SCN}/hub/icons_sheet.png'
    if os.path.exists(ic):
        out += f"""<div class="scene"><h3>Icons</h3><figure><img src="{scene_img(Image.open(ic), 'hub_icons', w=1600, q=84)}" alt="All 132 icons at 128, 48, 32 and 22 px" loading="lazy"><figcaption>All 132 item, status, course, map and supply icons, each at 128, 48, 32 and 22 px (22 px is the size inside card text).</figcaption></figure></div>"""
    return '<div class="scenes">' + out + '</div>'

from enemy_stats import statblock, CSS as STATS_CSS
TIER_LABEL = {'ruler': 'Ruler', 'elite': 'Elite', 'large': 'Large', 'human': 'Human', 'small': 'Small'}

def card(name, tier, lore, path, cls='foe'):
    img = b64(crop(path), w=320, q=68)
    return f'''<article class="ent {cls}">
  <div class="plate"><img src="{img}" alt="{E(name)}, ink figure" loading="lazy"></div>
  <div class="cap"><p class="tier">{E(TIER_LABEL.get(tier, tier))}</p><h3>{E(name)}</h3>{f'<p class="lore">{E(lore)}</p>' if lore else ''}{statblock(name) if cls == 'foe' else ''}</div>
</article>'''

body, nav, total = '', '', 0
for S in SECTIONS:
    intro, entries = bible(S['bible'])
    have = {}
    for m in S['modules']:
        for h in heroes(m): have[norm(h['name'])] = (h['tier'], render_path(m, h['key']))
    for n, (tier, p) in S.get('extra', {}).items(): have[norm(n)] = (tier, p)
    cards, items, missing = '', [], []
    for name, lore, group in entries:
        if norm(name) not in have: missing.append(name); continue
        tier, p = have[norm(name)]
        cards += card(name, tier, lore, p); items.append(dict(path=p)); total += 1
    if missing: print('MISSING in', S['roman'], missing)
    line = b64(lineup(items), q=64)
    sid = f"world-{S['roman'].lower()}"
    nav += f'<a href="#{sid}">{E(S["roman"])}. {E(S["title"])}</a>'
    body += f'''<section id="{sid}">
  <div class="head"><p class="eyebrow">{E(S['act'])} · World {E(S['roman'])} · {len(items)} creatures</p><h2>{E(S['title'])}</h2><p class="small">{intro}</p></div>
  <figure><div class="wide"><img class="line" src="{line}" alt="All {E(S['title'])} creatures at true relative scale"></div>
  <figcaption>True relative scale. One pixel scale for the whole game; rulers are cropped by the frame as in combat.</figcaption></figure>
  <div class="cast">{cards}</div>
  {battle_block(S['roman'])}
</section>'''

if KEEPERS:
    ks = heroes(KEEPERS['module']); cards = ''; items = []
    for h in ks:
        p = render_path(KEEPERS['module'], h['key'])
        cards += card(h['name'], 'human', '', p, cls='keeper'); items.append(dict(path=p)); total += 1
    line = b64(lineup(items), q=64)
    nav += '<a href="#keepers">The Keepers</a>'
    body += f'''<section id="keepers">
  <div class="head"><p class="eyebrow">The Priory hub · {len(items)} keepers</p><h2>{E(KEEPERS['title'])}</h2><p class="small">The brothers and sisters who run the priory's shops and services between descents.</p></div>
  <figure><div class="wide"><img class="line" src="{line}" alt="The keepers side by side"></div></figure>
  <div class="cast">{cards}</div>
</section>'''
    nav += '<a href="#priory">The Priory interiors</a>'
    body += f'''<section id="priory">
  <div class="head"><p class="eyebrow">The Priory hub · environments</p><h2>The Priory interiors</h2><p class="small">Every hub room converted to Living Ink. The title screen, the garth (the courtyard you return to between descents), every interior and the shop panels. The icon set closes the section.</p></div>
  {hub_block()}
</section>'''

page = f'''<title>Ostium Bestiary</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Source+Sans+3:wght@400;600&display=swap">
<style>
/* Layout: a Codex folio. Each world is a chapter: true-scale lineup as its plate, then catalogued entries in bible order. */
:root {{
  --bg: #15120f; --surface: #1e1a16; --ink: #ece4d6; --muted: #aa9f8f; --rule: #3a332c; --rubric: #c4473a; --sea: #7fb0a8; --warm: #e0a25a;
  --display: "IM Fell English", "Iowan Old Style", Georgia, serif;
  --body: "Source Sans 3", "Segoe UI", system-ui, sans-serif;
  color-scheme: dark;
}}
body {{ background: var(--bg); color: var(--ink); font: 16px/1.55 var(--body); }}
.wrap {{ max-width: 1240px; margin: 0 auto; padding-block: 40px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 48px; }}
header {{ display: grid; gap: 12px; max-width: 74ch; }}
.eyebrow {{ font: 600 12px/1.3 var(--body); letter-spacing: .14em; text-transform: uppercase; color: var(--rubric); margin: 0; }}
h1 {{ font: 400 clamp(38px, 6vw, 62px)/1.02 var(--display); margin: 0; text-wrap: balance; }}
h2 {{ font: 400 clamp(28px, 4vw, 40px)/1.06 var(--display); margin: 0; text-wrap: balance; }}
h3 {{ font: 400 21px/1.12 var(--display); margin: 0; }}
p {{ margin: 0; }}
.lead {{ font-size: 18px; color: var(--muted); }}
.small {{ font-size: 15px; color: var(--muted); max-width: 78ch; }}
.small strong {{ color: var(--ink); font-weight: 600; }}
nav {{ display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: 14px; }}
nav a {{ color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--rule); padding-bottom: 2px; }}
nav a:hover, nav a:focus-visible {{ border-color: var(--rubric); outline: none; }}
section {{ display: grid; gap: 18px; scroll-margin-top: 16px; }}
section + section {{ padding-top: 32px; border-top: 1px solid var(--rule); }}
.head {{ display: grid; gap: 8px; }}
figure {{ margin: 0; display: grid; gap: 8px; }}
.wide {{ overflow-x: auto; background: radial-gradient(ellipse at 50% 30%, #2c2a26, #100e0c 80%); border-radius: 4px; }}
.wide img.line {{ display: block; height: 340px; width: auto; max-width: none; }}
figcaption {{ font-size: 13px; color: var(--muted); }}
.cast {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }}
.ent {{ background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; display: grid; grid-template-rows: auto 1fr; min-width: 0; }}
.plate {{ background: radial-gradient(ellipse at 50% 40%, #2e3a38, #101614 78%); display: grid; place-items: end center; height: 320px; padding: 12px 8px 6px; }}
.plate img {{ max-height: 300px; width: auto; max-width: 100%; }}
.ent.keeper .plate {{ background: radial-gradient(ellipse at 50% 45%, #6a4a2a, #1c120a 78%); }}
.cap {{ padding: 12px 14px 16px; display: grid; gap: 6px; align-content: start; }}
.tier {{ font: 600 11px/1 var(--body); letter-spacing: .14em; text-transform: uppercase; color: var(--sea); }}
.ent.keeper .tier {{ color: var(--warm); }}
.scenes {{ display: grid; gap: 28px; margin-top: 12px; }}
.scene {{ display: grid; gap: 10px; }}
.pair {{ display: grid; gap: 12px; grid-template-columns: 1fr; }}
@media (min-width: 900px) {{ .pair {{ grid-template-columns: 1fr 1fr; }} }}
.scene img {{ display: block; width: 100%; height: auto; border-radius: 4px; border: 1px solid var(--rule); }}
.pending {{ font-style: italic; }}
.lore {{ font: italic 16px/1.4 var(--display); color: var(--muted); }}
@media (max-width: 520px) {{ .wide img.line {{ height: 240px; }} .plate {{ height: 280px; }} .plate img {{ max-height: 260px; }} }}
</style>
<div class="wrap">
<header>
  <p class="eyebrow">Ostium · Living Ink bestiary</p>
  <h1>Ostium Bestiary</h1>
  <p class="lead">Every creature that has passed both review gates (logic audit and style), drawn in the locked style: direction A bodies at 6.4 heads, rendered in Living Ink. Worlds are added here as each one clears independent review. {total} figures so far. Each world now also shows its battle rooms: three regular rooms and its boss room(s), awaiting your review, and the Priory interiors close the book.</p>
  <nav>{nav}</nav>
</header>
{body}
</div>'''
page = page.replace('</style>', STATS_CSS + '</style>', 1)
open(f'{OUT}/bestiary.html', 'w').write(page)
json.dump(SCENE_FILES, open(f'{SCN_OUT}/files.json', 'w'), indent=1)
print('wrote', f'{OUT}/bestiary.html', round(len(page) / 1e6, 2), 'MB', total, 'figures')
