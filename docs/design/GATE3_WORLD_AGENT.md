# Gate 3 world drafting: the task for each world

Read `docs/design/GATE3_AGENT.md` first; everything there applies. For each world you are given, write
`tools/content/v3/world_<key>.py` (only your files) from its role map `docs/design/gate2/world_<n>_<name>.md`, its bible
file `art/party/bible/world_<n>_<name>.md`, `art/party/bible/RIVAL_RULERS.md`, `art/party/bible/00_design_language.md`,
and the creature section of `docs/design/GATE3_VOCAB.md` (section 5) and its budget (section 6).

## Module shape

```python
from dsl import *
from creatures import *
W = "<world key>"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])
# creatures (all 19 in the role map), encounters, the world's 4 cards, any cards its creatures put in hands
NEEDS = [...]
```

## Creatures

- Every creature in the role map's roster table (usually 19: 3 rulers, 4 elites, 12 foes), with the key the role map
  gives. Keep existing keys exactly: those creatures already have art.
- Numbers are base numbers from the VOCAB budget (Threat multiplies them in game). Foes last 4 to 6 rounds, elites 6
  to 8, rulers 8 to 12.
- Move counts (rules v2, rule 13): foes 3 moves (2 for a swarm or brute, 4 for a caster, support or summoner, never
  more than 4); elites 4 to 5 with at least one move that answers the company's setup; rulers 6 to 8 across 2 or 3
  phases, with the world's Conjunction made large as the signature move.
- Traits: foes 0 or 1, elites 1, rulers 1 or 2, from the role map's trait ideas.
- Resistances by the lore rule (immune only to what it is made of, resists what it lives in, weak to what undoes it),
  as the role map lists them. Holy creatures are weak to void (DECISIONS row 15).
- Rank footprint (DECISIONS row 13, Cole: do not "nullify the complexity of rank by having one massive enemy often"):
  foes span 1; elites span 1, except at most one elite per world may span 2 if the bible makes it truly huge; rulers
  span 2. Nothing spans 3 even where the role map says so: redesign the move so it works on 2.
- Stress pressure: 2 to 4 of the 12 foes deal stress.
- Gold theft and swallowing a hero are postponed (row 14): give those creatures their next-best move and add a NEEDS
  line. Countdowns use the `charge` status (`SELF("charge", n)`, AI `"if": "charge>=N"`, `CLR("charge")`, and
  `charge_name=` for its display name). Swarm is the `swarm` flag.
- Lore line: one line from the bible in the house voice.
- If a move puts a card into a hero's hand (`ADD(card_id)`), define that card in your module: rarity "Curse",
  kw ["Temporary", ...], id `t_<world>_<name>`, with flavour and note.

## Encounters

- About 8 foe groups and 4 elite groups (2 to 4 creatures, ranks 1 to 4 in order, spans fitting 4 ranks), each in one of
  the world's non-ruler rooms (`python3 tools/content/v3/build_v3.py --rooms` lists them), with the role map's
  tactical idea as `idea`. Elite groups lead with an elite and may add foes.
- 3 ruler fights, one per ruler, in the world's ruler room, starting with all 4 ranks filled (the ruler's 2 plus
  escorts). Rival rulers add `props="<their key>"`.
- **Art.** Only some creatures have art today (listed in your task as "has art"). So the playable build works before
  the new art lands, at least 5 of the foe groups, at least 2 of the elite groups and the original ruler's fight must use
  only creatures that have art. The other groups may use anyone.
- Encounter keys: `<world>_f1` ... `<world>_e1` ... `<world>_r_<ruler key>`.

## World cards

4 cards, rarity "W" with `world=W`, themed on the world's Conjunction, offered only inside this world to any calling,
so they must work for every calling. Ids `w_<world>_<name>`. Budget them at about uncommon strength (the checker prices W
at 1.1). Each has flavour, note, arch="world" and up.

## Fixes

Apply DECISIONS row 16 if it concerns your world (Torn Sky: no "war of gods", the bible says betrayal; Drowned
Choirboy resists void).
