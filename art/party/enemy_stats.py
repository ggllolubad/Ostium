"""Combat reference blocks for the bestiary: each creature's current game stats, moves, how it picks them, phases and
encounters, read from the game data (data/enemies.json, data/encounters.json). Used by build_bestiary.py and by
splice_stats.py (which adds the blocks to an already-built bestiary without re-rendering any art)."""
import json, re, html, unicodedata

GAME = '/home/claude/ostium-game/data'
E = html.escape
ENEMIES = json.load(open(f'{GAME}/enemies.json'))
ROOMS = json.load(open(f'{GAME}/encounters.json'))['rooms']
ALIAS = {'sparkblindsmith': 'cyclops_smith'}   # art renamed after the data was written

def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z]', '', s.lower().replace('the ', ''))

BY_NAME = {norm(v['name']): k for k, v in ENEMIES.items()}
BY_NAME.update(ALIAS)

KIND = {'attack': 'Attack', 'defend': 'Defend', 'debuff': 'Afflict', 'heal': 'Heal', 'buff': 'Empower'}
TARGET = {'front': 'the front hero', 'back': 'the rearmost hero', 'all_heroes': 'every hero', 'self': 'itself',
          'all_allies': 'every foe', 'ally_lowest': 'its most wounded ally'}
COND = {'ally_hurt': 'another foe is below half HP', 'ally_hurt75': 'any foe is at 75% HP or less',
        'hero_dd': "a hero is at Death's Door", 'round==1': 'it is the first round'}
TIER = {'foe': 'Foe', 'elite': 'Elite', 'boss': 'Ruler'}
EL = {'fire': 'fire', 'frost': 'frost', 'lightning': 'lightning', 'water': 'water', 'toxin': 'toxin', 'void': 'void', 'physical': 'physical'}

def cond_text(c):
    if c in COND: return COND[c]
    m = re.match(r'hp_pct<(\d+)', c)
    if m: return f'it is below {m.group(1)}% HP'
    m = re.match(r'round>=(\d+)', c)
    if m: return f'it is round {m.group(1)} or later'
    return c

def rule_text(r, intents):
    nm = intents.get(r['use'], {}).get('name', r['use'])
    bits = []
    if 'if' in r: bits.append('when ' + cond_text(r['if']))
    if 'every' in r: bits.append(f"every {r['every']} rounds" if r['every'] != 1 else 'every round')
    s = f'<b>{E(nm)}</b>' + (' ' + E(', '.join(bits)) if bits else ', otherwise')
    if r.get('not_twice'): s += E(' (never twice in a row)')
    return s

def ai_list(rules, intents):
    return '<ol class="ai">' + ''.join(f'<li>{rule_text(r, intents)}</li>' for r in rules) + '</ol>'

def statblock(name):
    key = BY_NAME.get(norm(name))
    if not key:
        return ('<details class="stats none"><summary>Moves and stats</summary><p class="none">Not in the game data yet. '
                'Its stats, moves and traits are written in Stage 4 of the card and enemy redesign.</p></details>')
    d = ENEMIES[key]
    intents = d['intents']
    res = d.get('resist', {})
    groups = {g: [EL.get(k, k) for k, v in res.items() if v == g] for g in ('immune', 'resist', 'weak')}
    chips = ''.join(f'<span class="chip {g}">{ {"immune": "Immune", "resist": "Resists", "weak": "Weak to"}[g] } {E(", ".join(v))}</span>'
                    for g, v in groups.items() if v)
    span = int(d.get('span', 1))
    head = (f'<p class="sl"><span><b>{d["hp"]}</b> HP</span><span><b>{d["armor"]}</b> Armor</span>'
            + (f'<span>Fills {span} ranks</span>' if span > 1 else '') + '</p>')
    moves = ''
    for ik, it in intents.items():
        moves += (f'<div class="mv {E(it["kind"])}"><p class="mk">{E(KIND.get(it["kind"], it["kind"]))} · {E(TARGET.get(it["target"], it["target"]))}</p>'
                  f'<p class="mn">{E(it["name"])}</p><p class="mt">{E(it.get("text", ""))}</p></div>')
    out = f'<details class="stats"><summary>Moves and stats ({len(intents)} moves)</summary>{head}'
    if chips: out += f'<p class="chips">{chips}</p>'
    out += f'<p class="sh">Moves</p><div class="mvs">{moves}</div>'
    out += f'<p class="sh">How it chooses</p><p class="note">It checks these in order each round and uses the first that applies.</p>' + ai_list(d['ai'], intents)
    if d.get('personality'):
        out += f'<p class="note">Personality: {E(d["personality"])}.</p>'
    for i, ph in enumerate(d.get('phases', [])):
        extra = []
        if ph.get('might'): extra.append(f"+{ph['might']} Might")
        if ph.get('heal'): extra.append(f"heals {ph['heal']}")
        out += (f'<p class="sh">Phase {i + 2}: at {ph["at"]}% HP</p><p class="note"><i>{E(ph.get("text", ""))}</i>'
                + (f' {E("; ".join(extra))}.' if extra else '') + ' Then it chooses:</p>' + ai_list(ph['ai'], intents))
    encs = [r for r in ROOMS if key in r['enemies']]
    if encs:
        out += '<p class="sh">Encounters</p><ul class="enc">' + ''.join(
            f'<li><b>{E(r["name"])}</b> ({E(TIER.get(r["tier"], r["tier"]))}): {E(", ".join(ENEMIES[k]["name"] for k in r["enemies"]))}</li>' for r in encs) + '</ul>'
    out += '<p class="note src">Current game data, before the redesign. Stage 4 replaces these numbers and moves.</p></details>'
    return out

CSS = '''
.stats { border-top: 1px solid var(--rule); padding-top: 8px; margin-top: 4px; font-size: 13.5px; }
.stats summary { cursor: pointer; font: 600 12px/1.4 var(--body); letter-spacing: .08em; text-transform: uppercase; color: var(--sea); }
.stats summary:focus-visible { outline: 1px solid var(--rubric); }
.stats[open] { display: grid; gap: 7px; }
.stats .none { color: var(--muted); font-style: italic; margin-top: 6px; }
.stats .sl { display: flex; flex-wrap: wrap; gap: 4px 12px; color: var(--muted); margin-top: 6px; }
.stats .sl b { color: var(--ink); font-size: 16px; }
.stats .chips { display: flex; flex-wrap: wrap; gap: 4px; }
.stats .chip { border: 1px solid var(--rule); border-radius: 3px; padding: 1px 6px; font-size: 12px; }
.stats .chip.immune { color: #d2c7b6; } .stats .chip.resist { color: var(--warm); } .stats .chip.weak { color: var(--sea); }
.stats .sh { font: 600 11px/1.3 var(--body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-top: 4px; }
.stats .mvs { display: grid; gap: 6px; }
.stats .mv { background: #17130f; border: 1px solid var(--rule); border-left: 3px solid var(--muted); border-radius: 3px; padding: 6px 8px; display: grid; gap: 2px; }
.stats .mv.attack { border-left-color: #b4503f; } .stats .mv.defend { border-left-color: #5f84a8; } .stats .mv.debuff { border-left-color: #8a76a8; }
.stats .mv.heal { border-left-color: #6f9258; } .stats .mv.buff { border-left-color: var(--warm); }
.stats .mk { font-size: 11px; color: var(--muted); letter-spacing: .04em; }
.stats .mn { font: 400 16px/1.15 var(--display); }
.stats .mt { color: var(--ink); }
.stats .note { color: var(--muted); }
.stats .src { font-size: 12px; font-style: italic; }
.stats ol.ai, .stats ul.enc { margin: 0; padding-left: 18px; display: grid; gap: 3px; }
.stats b { font-weight: 600; }
'''
