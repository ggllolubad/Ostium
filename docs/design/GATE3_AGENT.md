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

## Interaction and depth (Cole, 2026-11-25: binding)

Cole: "the whole premise and original inspiration of the game was to make a deeply complex and interworking deck
builder." No archetype may be a straight line of cards that apply one status and pay off that same status. Every card
set must meet these:

1. **Bridges.** At least a third of the commons, uncommons and rares read or spend a resource they do not create
   themselves: another archetype's, another calling's, or the foe's own state (`t.spectrum`, `t.ailments`, `t.mark`,
   `t.hex`, `t.doom`, `t.bleed`, a course, `t.armor`, `t.block`, `t.attacking`, `t.moved`).
2. **Converters.** At least 6 cards per calling turn one resource into a different one (for example Momentum into
   course stacks, Thorns into Bleed, Block into damage, Hex into Block, Scars into Prime, consumed Omen into vigour).
   Use `CONS(...)` then effects `per="consumed"`, `CONV`, `STEAL`, `TRANSFER`, or a cost in one resource for a payoff
   in another.
3. **The Ordo is a dimension.** At least 6 cards per calling care about sequence inside a round: `same_target`
   (follow-up), `played`, `prime_count`, `reactions` (Conjunctions so far this round), `t.moved`, `flasks_used`,
   `dealt` or `killed` earlier in the same card, or Prime given to the next action.
4. **Company reads.** At least 6 cards per calling pay off something a different calling sets up (name the pairing in
   the card's `arch`, for example `arch="thorn_wall+hexweaver_hex"`). `arch` may name two archetypes joined by `+`.
5. **Archetypes cross.** Each archetype has at least two setup sources and two payoff axes, and shares at least two
   cards with another archetype of the same calling, so hybrids exist. Rares and legendaries should combine two
   systems (for example a Rite that turns every Conjunction into Momentum).
6. **Rank and position** count as a resource: cards that care about rank, movement, Guard and Taunt.

These are counts the final report must state.
