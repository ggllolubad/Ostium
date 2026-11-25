# Gate 3 engine update (2026-11-25): what the drafts' NEEDS now have

The engine owner implemented these after the first drafts. `GATE3_VOCAB.md` lists them in full. Revise your module to
use them wherever your `NEEDS` asked for them, delete the NEEDS lines they settle, and keep the text matching the
effects exactly.

## Cards and rites
- **Play rites target the played card's target.** A `"play"` rite's effects land on the target of the card that
  triggered it (on the owner only if that card had no target). Use this for "each hit also ..." rites.
- **Kill rites read the foe that died** through `m.` (for example `per="m.bleed"` or `if: "m.hex>=3"`); effects without
  `to` land on the owner. Use `to="all_enemies"` or `to="front_enemy"` to reach the living.
- **Rite duration:** `rite={"on": ..., "fx": [...], "rounds": 1}` ends the rite that many rounds after it was played.
- **Prime stacks:** Prime an action cannot use carries to the next action, so consecutive Prime cards add up. Prime is
  also spent by Block and healing (in full) and by course stacks (half, rounded up), and a belt flask is an action.
- **`TRANSFER(frm, n=1)`** moves only the largest ailment (all its stacks); without `n`, every ailment.
- **`cat="attuned"`** is accepted for cards that apply the attuned course.
- **Quantities:** `t.delayed` (Delayed this round), `t.incoming_to` (attack damage aimed at the unit), `t.targeted`
  (foes aiming an attack at the unit).
- **Status `empower`:** a one-shot bonus on the unit's next hit, then spent (heroes and foes).
- **Status `lockdown` on a hero** is a plain ailment (acts last this round); Ward does not stop it. Also `blight` (no
  healing) and `neuro` (next action keeps only its first effect).
- Unbind's Hex lands even when the company holds no affliction card. Doom is spent when it breaks a ruler's phase.
- Brew and Refill ignore the belt's size: Fresh flasks spoil at fight end anyway.

## Creatures
- **Intent targets:** `marked`, `most_cards`, `heaviest` (most Block plus Armor), `healthiest`, `most_burn`,
  `most_played` (cards last round), `acted_last`, `first_actor` (led the last Ordo), plus `front2` and `back2`.
- **Effect targets (`to=`):** `front2` (the two front heroes, for traits and riders), `self_adjacent` (the creature's
  neighbours), `killer` (in a death trait: the hero that landed the last hit).
- **Trait triggers:** `moved` (pushed or pulled), `course` (a hero laid a course on it; `T(..., e="lightning")` filters
  by course), `lost_action` (Stunned or Frozen).
- **`SUMMON(key, max, front=True)`** calls into the front rank.
- **AI rule `"once": True`** is supported (it was always in the vocabulary).
- **Intent text** now shows effect conditions ("6 (if Marked) to the front hero") and names added cards and stripped
  statuses, so conditional riders are fine on intents.
- Cards a foe adds to a hero's next hand fire their `on_draw` when they arrive.

## Still not in the engine
Choosing a course, flask or hero in a card (pickers), cost cuts, stealing or stripping one buff, redirecting a course or
hit to another unit, enemy swaps, self-revive, untargetable, reversing the Ordo, per-hit traits beyond one a round,
gold. Keep the nearest legal version and the NEEDS line.
