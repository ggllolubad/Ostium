# Gate 3 drafting: instructions for every drafting agent

You are turning an approved Gate 2 brief into game data for Ostium, a Godot roguelike (Slay the Spire / Darkest Dungeon
inspired). Repository: `/home/claude/ostium` (branch `living-ink`). Cole, the designer, reviews what you write as card
and creature sheets, so it is both the review document and the game data.

## Read first (in this order)

1. `docs/design/GATE3_SPEC.md`: the budget table, upgrade rules, card and creature fields, the checks.
2. `docs/design/GATE3_VOCAB.md`: the closed list of effects, quantities, keywords, targets and triggers, and the
   creature budget. Use nothing outside it; anything you cannot express goes in your module's `NEEDS` list.
3. `docs/design/gate2/DECISIONS.md`: Cole's binding decisions.
4. Your Gate 2 brief in `docs/design/gate2/` (named in your task), and `docs/design/GATE2_SPEC.md` (the rules the briefs
   were written to; they still apply).
5. `docs/design/combat_rules_v2.md`: the combat rules (vigour, courses, Conjunctions, statuses, enemies).
6. The lore bible in `art/party/bible/` for your calling or world (names, bodies, voice for flavour text).
7. `tools/content/dsl.py` (the helpers) and the pre-redesign module for your calling or world in `tools/content/` for
   the house text style. The redesign replaces those cards and creatures: do not copy them, but match their text
   conventions ("Deal 6.", "Gain 5 Block.", "Apply 2 Fire.", "Apply 1 Volatile Water.", "Exhaust.").

## Write

Only your own file(s) in `tools/content/v3/` (named in your task). Do not edit any other file, do not run git, and do
not touch `data/`. Other agents are writing the other modules at the same time.

Check as you go, and before you finish:

```
python3 tools/content/v3/build_v3.py --only <your module(s)> --budget
```

It must end with `validation problems: none`. Budget flags (more than 20% off the table) are allowed only where the
card's design needs it; keep them under 10% of your cards and say why for each in your final report.

## Rules that matter most

- **The text is the contract.** The game's Ordo preview runs the effects, and the player reads the text. Every number
  and every effect in `text` must match `fx` exactly, and the upgrade's `text` must match the upgraded card. Write the
  text after the effects and re-read both.
- **Style.** Plain, direct English. No em dashes, en dashes or double hyphens anywhere (the checker rejects them).
  Flavour under 90 characters, in the lore's voice. Do not pad lists to three.
- **Ground it in the lore.** Names, flavour and art notes come from the bible. If the bible gives nothing, keep it plain
  rather than inventing new lore.
- **Difficulty.** Cole: err on the side of harder, real players will out-play the simulator.
- **Final report** (your last message): counts by rarity or tier, budget flags with reasons, your `NEEDS` list, and any
  place you departed from the brief and why. Keep it under 400 words.
