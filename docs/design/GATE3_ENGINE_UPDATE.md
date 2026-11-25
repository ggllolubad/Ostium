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

## Review fixes (2026-11-25, after the independent check)
- **Momentum, Riposte and Focus halve at round end** (rounded down), like Thorns, so nothing that is read without being
  spent grows without limit. Cards that read them should still cap with `max=` where a big number would be absurd.
- **Fortify does not stack:** it lasts the longest duration it was given.
- **Prime** now also raises attuned and next-course applications and Conjoin (half, rounded up) and an Execute's
  threshold (in full).
- **Your own cards cannot take a hero below 1 HP** (`SELFDMG` stops at 1), so self-harm never costs Grit or kills.
- **Taunt counts:** `targeting_me` and `attackers` include single-target attacks a Taunt will pull onto the actor.
- **Play rites answer cards played on foes:** a `"play"` rite skips cards aimed at a hero unless the rite has
  `"allies": True`.
- **`CLR("charge")` always clears the creature's own count**, wherever the intent is aimed (the 31 charge loops are
  fixed in the engine; no content change needed).
- **Foe-phase timing:** a foe's Block now lasts from its own action until its next one (through the heroes' turn);
  Dodge, Guard, Mark, Vulnerable, Anchor, Taunt, Blight, Lockdown and Stun laid during the foes' phase skip that
  round's decay, so they last through the heroes' next turn. Intents aimed at the Marked hero now find the Mark.
- **Stun on a hero works:** a stunned hero plays no cards or kit for a round (belt flasks still allowed).
- **Rites always Exhaust** when played, whatever their keywords say (add "Exhaust" to their text if it is missing).
- **Delay postpones:** a Delayed foe's action always waits until next round (never two rounds in a row; a foe that
  just waited acts last instead). Budget prices Delay at 7.
- **Unbind** now lands the affliction's harm on the foe (energy, draw and discard effects are skipped).
- **Absolute Zero** treats the foe's HP as lower by its Doom.
- **`TRANSFER(frm="ally_most")`** never picks the hero casting it.
- **`targeting_me` on a hero** (`t.targeting_me` from a hero card) is 1 when any foe aims an attack at that hero.
