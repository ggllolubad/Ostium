# Gate 3 spec: card and creature sheets

Gate 3 turns the approved Gate 2 briefs into game data. Every card and creature is written in the content DSL
(`tools/content/dsl.py`), so the same file is the review sheet, the game data and the simulator's input.

Read first: `docs/design/GATE2_SPEC.md` (decisions and style rules still apply), the Gate 2 brief you are turning into
cards (`docs/design/gate2/`), `docs/design/combat_rules_v2.md`, and `tools/content/dsl.py` (every effect the engine
supports). Cole's decisions on the Gate 2 table are in `docs/design/gate2/DECISIONS.md` once he has answered; until
then the "My recommendation" column of that table stands.

## Card budget

One vigour buys about **6 points** at common. Costs are set by this table, then corrected by the simulator.

| Effect | Points |
|---|---|
| 1 damage to one foe | 1 |
| 1 damage to every foe | 2.2 (3 foes on average, less overkill) |
| 1 Block | 0.85 |
| 1 HP healed | 1.2 |
| 1 stress shed | 0.5 |
| 1 Armor for the fight | 6 |
| 1 Ward | 1.5 |
| 1 Bleed (deals n, n-1, ... over rounds) | 1.6 |
| 1 course stack, Stable | 1.2 (more on a calling that sets it off) |
| 1 course stack, Volatile | 2 (sets off a Conjunction at once) |
| Mark | 2 |
| Vulnerable (1 round) | 4 |
| Stun | 9 (8 on a foe that already lost an action this fight) |
| 1 Might for the fight | 5 |
| 1 Thorns | 1.3 |
| Draw 1 next round | 4 |
| +1 vigour next round | 6 |
| Prime n | 0.9 n |
| Taunt | 3 |
| Guard | 4 |
| Move a foe 1 rank | 2 |

Rarity multipliers on the points per vigour: Starter 0.95, Common 1.0, Uncommon 1.15, Rare 1.3, Path 1.2. A card
with a drawback (self-damage, stress gained, Exhaust on a repeatable effect) earns back the drawback's points.
Conditional effects count at the chance they apply (a bonus "if Marked" in a Mark archetype counts at about 70%).
0-cost cards carry 2 to 3 points. X cards pay 5 points per X.

Legendaries are not budgeted. Each one is a win condition for its path and is checked only in the simulator: it must
raise the clear rate of a descent that takes it, without making the path's other cards pointless.

## Upgrades

Each card gets one upgrade (the `up` block in `card(...)`):

- raise its numbers by about a third, or
- remove a drawback, or
- cut its cost by 1 (only for cards of cost 2 or more), or
- for a legendary: add a new clause.

The upgraded text is written in full in `up.text`. Upgrades have a matching art note.

## Card fields

Each card: id, name, cost, rarity, target, effects, text, user ranks, target ranks, course and attribute, keywords,
path, upgrade, flavour (one line in the lore's voice, under 90 characters), art note (one line: the chronicle moment
the card art shows, composed from the Living Ink rigs and rooms).

## Creature fields

Each creature: key, name, tier, HP, Armor, ranks it takes, resistances, intents (with generated text), AI rules,
trait, phases (rulers), personality, and lore line. Numbers come from a tier budget: a foe threatens about 9 damage a
round at Threat 0; an elite about 15; a ruler about 22 split across targets; HP so that foes last 4 to 6 rounds,
elites 6 to 8 and rulers 8 to 12 against the reference company. The simulator corrects both.

## Checks before a sheet goes to Cole

1. `python3 tools/content/build.py` runs with "validation problems: none".
2. `tests/card_test.gd` plays every card with no inert card.
3. The build-aware simulator: each archetype's assembly rate (key cards in the final deck) and clear rate, against the
   Threat-calibrated baseline. A build that cannot assemble in most descents, or that clears far above the others,
   is reworked before review.
