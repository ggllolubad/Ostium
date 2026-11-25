"""Adds the combat reference block (enemy_stats.statblock) to every creature card in an already-built bestiary.html,
without re-rendering any art. Safe to run twice: existing blocks are replaced."""
import re, html, sys
sys.path.insert(0, '/home/claude/party')
from enemy_stats import statblock, CSS

P = '/home/claude/party/out/bestiary.html'
s = open(P).read()
s = re.sub(r'<details class="stats.*?</details>', '', s, flags=re.S)
if '.stats summary' not in s:
    s = s.replace('</style>', CSS + '</style>', 1)
n = 0
def add(m):
    global n
    n += 1
    name = html.unescape(m.group(2))
    return m.group(1) + statblock(name) + m.group(3)
s = re.sub(r'(<article class="ent foe">.*?<h3>(.*?)</h3>.*?)(</div>\n</article>)', add, s, flags=re.S)
s = s.replace('awaiting your review, and the Priory interiors close the book.', 'awaiting your review, and the Priory interiors close the book. Open <b>Moves and stats</b> on any creature for its HP, Armor, resistances, every move, how it chooses them, its phases and its encounters (current game data, before the redesign).', 1)
open(P, 'w').write(s)
print('cards', n, 'size MB', round(len(s) / 1e6, 2))
