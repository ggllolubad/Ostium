# Gate 3 interaction pass: how cards read other systems

Cole's ask (2026-11-25):
- "i'm not seeing anything that uses incorporates the parties energy? for example i think sts2 has some cards that gain additional values based on how many energy you've consumed or have left etc. ... use them as inspiration for the variety of ways you can make a card interact with other system and then using that knowledge adapt it into interacting in unique ways with the systems in our game"
- "i'm not asking you to completely redesign or rename cards, im just asking you to revise what we've made to have the level of complexity and diversity and interaction with other mechanics that i'm looking for"

So this is a **revision** pass. The binding "Interaction and depth" section of GATE3_AGENT.md still applies; this document adds the pattern library and the new hooks.

## 1. The patterns Slay the Spire uses (StS2 examples where known, StS1 otherwise)

Each pattern is a way a card's value comes from somewhere other than its own number.

| # | Pattern | StS examples |
|---|---|---|
| P1 | **Energy left or spent** | StS2 Expect a Fight (energy per Attack in hand), Forgotten Ritual (gain 3 energy if you Exhausted this turn), Radiate (damage per Star gained this turn), Child of the Stars (Block per Star spent); StS1 Conserve Battery, Ice Cream, Calipers |
| P2 | **Cost manipulation** | StS2 Unrelenting (next Attack costs 0), Void Form (first 2 cards each turn free), Infernal Blade (random Attack, free this turn), Blood for Blood (1 less per time you lost HP); StS1 Corruption, Madness, Enlightenment |
| P3 | **X costs and thresholds** | StS2 Heavenly Drill (X times, double X at 4+), Dirge, Eradicate, Multi-Cast; StS1 Whirlwind, Skewer |
| P4 | **Count what you did this turn or fight** | StS2 Supermassive (cards created this combat), Voltaic (Lightning channelled this combat), Automation (every 10 draws); StS1 Finisher, Flechettes, Rampage, Claw |
| P5 | **Read a status on the target** | StS2 Bully (+2 per Vulnerable), Dominate (Strength per Vulnerable), Molten Fist (double Vulnerable), No Escape (more Doom per 10 Doom), Time's Up (damage equal to Doom), Swipe (bonus if Doom); StS1 Heel Hook, Bane |
| P6 | **Convert one resource into another** | StS2 Demonic Shield (give another player Block equal to yours), Crimson Mantle (lose HP, gain Block); StS1 Body Slam, Reaper, Feed, Spot Weakness |
| P7 | **Trigger engines ("whenever")** | StS2 Hellraiser (draw a Strike: it plays itself), Friendship (play a Soul: Summon 3), Fearmonger (apply Doom: gain Block), Plague Carrier (when Osty attacks, apply Doom), Corrosive Wave (draw: Poison all); StS1 Juggernaut, Thousand Cuts |
| P8 | **Hand, pile and draw manipulation** | StS2 Shining Strike (put on top of the draw pile), Kingly Punch (gains damage each time it is drawn), Calculated Gamble, Stratagem, Sly (plays itself when discarded); StS1 Headbutt, Hologram, Well-Laid Plans |
| P9 | **Card creation** | StS2 Souls, Minion Strike, Shivs, CHARGE!! (transform into tokens), Spectrum Shift; StS1 Blade Dance, Nightmare |
| P10 | **Growth over a fight or a run** | StS2 Forge and Sovereign Blade, Hang (all Hang cards deal double to this foe), Kingly Punch; StS1 Rampage, Ritual Dagger, Genetic Algorithm |
| P11 | **Delayed and next-turn payoffs** | StS2 Glitterstream (next turn gain Block), Shadow Step (next turn Attacks deal double), Neurosurge (resources now, Doom on you each turn) |
| P12 | **Risk and self-cost** | StS2 Offering, Breakthrough (lose HP), Panic Button (big Block, no Block for 2 turns), Fight Me! (enemy gains Strength) |
| P13 | **Execute and thresholds** | StS2 End of Days (kill if Doom at least HP), Knockout Blow (if this kills, gain Stars); StS1 Judgment, Feed |
| P14 | **Companion, ally and multiplayer reads** | StS2 Osty cards, Pull Aggro, Demonic Shield, Tag Team (co-op); StS2 co-op cards that read another player |
| P15 | **Doubling and multipliers** | StS2 Oblivion (double Doom), Molten Fist (double Vulnerable), Heavenly Drill (double X); StS1 Limit Break, Catalyst |

### More patterns from the full StS2 card list (op.gg, read 2026-11-25)
| # | Pattern | StS2 examples (paraphrased) |
|---|---|---|
| P16 | **Gifts to another player** | Encore (the next 4 cards other players play cost nothing), Ambush (the target takes double damage from other players this turn), Dowsing (another player's next Attack on that foe repeats), Joy (when you gain Block, other players gain half), Malice (give another player Block equal to yours) |
| P17 | **Relay objects** | Bola (gains damage each play, then passes to a random ally's hand), Flick-Flack (Shivs into every hand) |
| P18 | **Self-adjusting cost** | Anger (costs 1 less per Attack played this turn), Bullet Time (1 less per Skill played), Pommel (1 less per card exhausted this fight), War Drum (Attacks in hand cost 1 less until played), Accelerate (costs 1 more each play) |
| P19 | **Replay and echo** | Rampage (the next Attack is played twice), Knife Trap (the next Skill twice), Hegemony (replays from the exhaust pile), Solid (replays itself from the discard) |
| P20 | **Hand size and pile conditions** | Dance of Blades (2 less per other card in hand), Ricochet (an extra hit with 5 or more cards in hand), Cheat (only when the draw pile is empty), Strategist (scales with cards drawn this fight), Blade Symphony (per Skill in hand) |
| P21 | **Spent-elsewhere scaling** | Fusion (3 damage per energy spent on other cards this turn), Phantom Blades (per Attack played this turn), Rain Dagger (the target loses HP per card played this turn) |

**New hooks for these** (engine, 2026-11-25):
- **P18 `cost_less`:** a card field `{"per": q, "k": n, "max": m}` takes k per unit of q off the card's cost while you plan. q is one of:
  - `ordo`: cards already in the Ordo;
  - `heroes`: heroes already in it;
  - `others`: heroes other than this one already in it;
  - `attacks`: attack cards in it;
  - any hero quantity, such as `hand`, `discard`, `exhaust`, `played`, `scars` or a status.

  The hand shows the live cost in green. Example: "Costs 1 less for each other hero already in the Ordo (min 0)".
- **`carried`:** vigour brought into this round by Bank or next-round vigour.
- **`base_cost`:** the card's printed cost (Thrift-proof).
- **`lost`:** HP a card's own self-harm really took.
- **Thrift** is now spent only by a card it actually discounted. A free card or an X card leaves it.
- **P16:** give an ally Thrift, Prime, Momentum or Block; use `to="ally"` reads; make a foe Vulnerable or Marked for the next hero (Handoff).
- **P17:** `ADD` a card to an ally's next hand (to="ally").
- **P19:** the Echo keyword.
- **P20:** `hand`, `draw`, `discard` and `exhaust` hero quantities, with `if_` thresholds.
- **P21:** `spent_before`, `ordo_pos` and `played`.

**Budget:** a condition on the Ordo's order (first, last, handoff) is counted at 90%, because the player sets the order. Other conditions count at 70%.

## 2. Ostium's systems: what a card can read, and the new hooks

**Vigour and the Ordo (new, engine 2026-11-25).** Vigour is shared: 2 per hero, spent when the Ordo is set. The Ordo then resolves in order. That gives Ostium a P1 and P2 space StS does not have: cards can read **the order** and **who acted**.

- Quantities, usable in `per`, `if_`, `k`/`max`:
  - `vigour_left`: unspent this round;
  - `vigour_spent`: the total cost of the Ordo;
  - `vigour_pool`: the round's vigour;
  - `cost`: what this card was paid;
  - `ordo_pos`: this card's place, from 1;
  - `ordo_len`;
  - `ordo_after`: cards still to come;
  - `spent_before`: vigour spent on earlier cards this round;
  - `heroes_before`: other heroes who acted before this card;
  - `handoff`: 1 if the card just before was another hero's;
  - `first` and `last`: 1 or 0.
- Effects:
  - `EN(n)`: n more vigour next round (exists);
  - `BANK(n)`: up to n of this round's unspent vigour carries over;
  - status `thrift` (`STATUS("thrift", n)` or `SELF`): each stack makes this hero's next card cost 1 less, never below 0. It shows in the hand as a green cost.
- Ideas:
  - **Restraint pays:** "Deal 3, plus 2 per vigour left."
  - **Big turns pay:** "If 6 or more vigour was spent this round..."
  - **The last word:** "Last in the Ordo: hit again."
  - **Openers:** "First: draw 1."
  - **Relay:** "Handoff: gain 2 Prime." "For each hero who acted before this, +3."
  - **Discounts:** "The next card a different hero plays costs 1 less" (give `thrift` to an ally).
  - **Banking:** "Bank 2."
  - **X cards** that double at 4 or more.
  - **Cost reads:** "Deal damage equal to 3 times this card's cost."

**Existing systems to cross-read** (all already in the VOCAB):
- **Courses and Conjunctions:** `spectrum`, `elements`, `el_total`, `el_max`, `reactions`, `held_*`, attune, Volatile.
- **Ailments and statuses:** Bleed, Hex, Doom, Mark, Vulnerable, Frost, Toxin; `ailments`, `debuffs`, `total_*`.
- **Defence:** Block, Ward, Armor, Thorns, Riposte, Taunt, Fortify.
- **Prime and Momentum:** carry, `prime_count`, Follow-up (`same_target`).
- **Belt and flasks:** `flasks`, `flasks_used`, Dosed, Fresh, brew, refill, improve.
- **Rites:** round_start, round_end, play, flask, conjunction, kill, hit, ally_hit, execute.
- **Ranks and movement:** push, pull, advance, retreat, `rank`, `moved`, Swap.
- **Hand and piles:** `hand`, `draw`, `discard`, `exhaust`, Retain, Echo, on_draw, add.
- **The company:** `allies`, `ally_hurt`, `hero_stress`, `allies_dd`, `played`, guard.
- **Foe intent:** `incoming`, `incoming_me`, `attackers`, `targeting_me`, `targeted`, Delay.
- **Doom and Execute, Scars, Stress, Grit, Resolve, Omen, HP:** `missing_hp`, `hp_pct`, `scars`, `stress`.

## 3. Revision rules (binding for this pass)

1. **Keep:** id, name, rarity, target, flavour, art note, path and archetype membership, and the card's identity (what it is about). Change cost only when the new text needs it, by at most 1.
2. **Revise:** `fx`, `text` and `up`, to deepen interaction. Text and fx must match exactly, including the upgrade.
3. **Density targets per calling** (count after the pass):
   - **Cross-reads:** commons at least 30%, uncommons at least 60%, rares, path cards and legendaries at least 80% read or feed a system other than the card's own main one.
   - **Vigour and Ordo:** at least 8 cards per calling use the new hooks, spread across patterns (restraint, big turn, position, handoff, thrift, bank, X, cost). No calling uses only one.
   - **Pattern spread:** at least 12 of the 21 patterns in section 1 appear in each calling, including at least 2 cards with `cost_less` (P18) and at least 2 that gift or relay to another hero (P16, P17).
   - **Company reads:** at least 6 cards per calling read or feed another hero (ally status, handoff, giving Thrift or Prime, guarding).
   - **Bridges to other callings:** at least 6 cards per calling pay off something another calling makes (for example a Duelist card that reads Hex, an Oracle card that reads Bleed).
4. **Keep commons readable:** one main effect plus at most one read. Complexity lives in uncommons and up.
5. **No straight lines:** an archetype must not be a column of cards that all add and read one status. Each archetype needs at least two input systems and two outputs.
6. **Budget:** run `python3 tools/content/v3/build_v3.py --only <module> --budget` and keep every card within its rarity band. Conditional value counts at 70% of its maximum (the budget tool's figure) unless the condition is nearly always met. Thrift is priced at 5 points a stack, Bank at 3 a point, and X cards at a typical X of 2.
7. **Validation:** `build_v3.py --only <module>` must report no problems. Use only the VOCAB plus section 2's new hooks; propose anything else in the module's NEEDS rather than inventing it.
8. **Style:** no em dashes or double hyphens; terse rules text in the house style; keywords capitalised as in data.gd KEYWORDS (Thrift, Bank, Handoff, Vigour).
