# Gate 3 vocabulary: what a card or creature may use

This is the closed list for Gate 3. Every effect, quantity, keyword, target and trigger here is either already in the
engine or being added to it alongside the drafting. If a design needs something that is not on this list, do not invent
syntax: write the nearest legal version and add a line to your file's `NEEDS` list (see the end) explaining what you
wanted. The engine owner reviews those.

Content lives in `tools/content/v3/`. Build and check with `python3 tools/content/v3/build_v3.py` (writes to
`build/data_v3/`, never to `data/`, until the switch-over).

## 1. Courses, statuses and words

Courses (element keys): `fire`, `frost`, `lightning`, `water`, `toxin`, `void`. On a unit they read as Burn, Weaken,
Static, Soak, Toxin, Erode. Course attributes: `stable` (piles up) and `volatile` (sets off a Conjunction at once with
every other course on the target). Conjunctions are in `combat_rules_v2.md`.

Statuses (`ST(name, n)` on the target, `SELF(name, n)` on yourself, `CLR(name)` clears one):

| Status | Meaning |
|---|---|
| `bleed` | Takes its stacks as damage at round end, then -1 |
| `stun` | Skips its next action, then gains Tenacity |
| `mark` | A mark for Mark payoffs. Does not deal damage by itself |
| `vulnerable` | Takes 50% more damage. Stacks are rounds |
| `might` | +1 damage per stack on every hit (lasts the fight) |
| `focus` | +1 per stack to the next course application, then spent. Can be given to an ally |
| `momentum` | The Duelist's resource. Finisher cards spend it |
| `riposte` | Strikes back at an attacker for its stacks, -1 per trigger. Duelist only |
| `taunt` | Single-target foe attacks must hit this hero |
| `thorns` | An attacker takes this much damage per hit |
| `dodge` | Avoids the next hit per stack |
| `regen` | Heals its stacks at round end, then -1 |
| `hex` | Deals 1 less damage per 2 Hex. Never fades. Spent by Hexweaver cards |
| `doom` | Never fades. Every execute check treats the unit's HP as lower by its Doom. At round end, a foe whose Doom meets its HP dies (a ruler drops a phase) |
| `fortify` | Block does not clear at round start this many rounds |
| `anchor` | Cannot be moved this many rounds |
| `tenacity` | Immune to Stun and Freeze while it lasts |
| `blight` | No healing (and, on a foe, no Block) while it lasts. Rounds |
| `neuro` | The unit's next action keeps only its first effect |
| `lockdown` | Acts last this round (a hero's cards resolve after the others') while it lasts. Rounds |
| `empower` | One-shot: the unit's next hit deals this much more, then it is spent (a loaded blow, a horn of mead) |
| `charge` | An enemy's visible counter (pressure, a boiling pool, a tolling bell). Raised by `SELF("charge", n)`, read by AI rules (`"if": "charge>=3"`), cleared by `CLR("charge")`. Shown with the creature's `charge_name` |

Words (hover text, no new syntax):

- **Ailment:** any harmful status or course stack on a hero. Quantity `ailments`.
- **Scars:** HP this hero has lost this fight; healing does not lower it. Quantity `scars`.
- **Shatter:** a Frozen unit hit by a physical attack takes bonus damage and the Freeze ends (already in the engine).
- **Spectrum:** the number of different courses on a unit. Quantity `spectrum`.
- **Conjoin:** the `REACT` effect: one Stable stack on the target becomes Volatile, so its Conjunctions happen now.
- **Finisher:** keyword on a card that spends all your Momentum (`CONS(s="momentum")`, then scale with `per="consumed"`).
- **Execute N:** `EXEC(N)`: a foe at N HP or less (after Doom) dies; a ruler with phases left drops to its next phase.
- **Fresh:** a brewed or refilled flask. It spoils at fight end.
- **Dosed:** a bonus that applies if any hero has used a flask this round before the card resolves: write it as an
  effect with `if_="flasks_used"`.
- **Omen:** the Augur's stored foresight (`OMEN(n)` gains it; spend with `CONS(s="omen")`).
- **Rite:** a card that sets a lasting effect for the rest of the fight when played (section 4). Rites Exhaust.

## 2. Card effects (`tools/content/dsl.py`)

Every effect takes these optional keys:

- `to=`: who it lands on instead of the card's target: `self`, `target`, `all_enemies`, `all_allies`,
  `allies_other`, `adjacent`, `behind`, `in_front`, `front_enemy`, `lowest_ally`, `attackers`.
- `if_=`: a condition (section 3). The effect is skipped if false.
- `per=`, `k=`, `max=`: the amount becomes `n + k * quantity`, capped at `max`.

| Helper | Effect |
|---|---|
| `D(n)` | Deal n. Extra keys: `times=` (hit that many times), `times_per=`, `pierce=True` (ignores Block), `lifesteal=` (percent healed) |
| `B(n)` | Gain n Block (on the target; use `to="self"` on an attack) |
| `AR(n)` | Armor for the fight |
| `W(n)` | Ward |
| `H(n)` | Heal |
| `ST(s, n)`, `SELF(s, n)`, `CLR(s)` | Statuses (section 1) |
| `A(e, n, attr=)` | Apply n stacks of course e, `stable` or `volatile` (defaults to the card's `attr`) |
| `AT(n)`, `AN(n)` | Apply your attuned course / the next course after it (Elementalist) |
| `AX(e)` | Apply X stacks of e (X cards) |
| `ATTUNE(n)`, `ATTUNE_TO(e)` | Step your attunement / set it |
| `REACT(n)` | Conjoin: one Stable stack on the target becomes Volatile (n stacks applied) |
| `MISSING(n)` | Apply n of every course the target lacks |
| `SPREAD(e, n)` | Copy courses from the target to its neighbours (`e="all"` for all) |
| `CONV(from, to)` | Turn every stack of one course into another |
| `CONS(s=, e=)` | Remove all of a status or course from the target; the amount becomes the quantity `consumed`. `s` may be a status, `block`, `ward`, `omen` or `elements` |
| `DBL(s=, e=)` | Double a status or course on the target (`s="largest"` for the largest course) |
| `CLEANSE(n)` | Remove n ailment stacks from the target |
| `TRANSFER(frm=)` | Move every ailment from you (or `frm="ally_most"`, the hero with the most) onto the target |
| `STRESS(n)` | n stress to a hero (negative sheds stress) |
| `TAKESTRESS(n)` | Take up to n stress from every other hero onto yourself |
| `SELFDMG(n)` | You lose n HP |
| `DRAW(n)` | The target hero draws n more next round |
| `EN(n)` | +n vigour next round |
| `ADD(card, n)` | Put a card into the target hero's next hand |
| `PUSH(n)`, `PULL(n)`, `ADV(n)`, `RET(n)`, `FRONT()`, `SWAP()` | Movement |
| `GUARD()` | Guard the target ally this round |
| `PRIME(n)` | The next action in the Ordo, from any hero, deals n more (and counts as primed) |
| `BASHSTUN()` | Stun if the target is Marked or was moved this round |
| `EXEC(n)` | Execute n |
| `DELAY()` | The target foe acts last this round; if already last, next round (once in a row per foe) |
| `TURN()` | The target foe's attack hits its neighbour instead |
| `STEAL()` | Take the target's Block |
| `OMEN(n)` | Gain Omen |
| `GRIT(n)` | Give Grit |
| `HP2BLOCK(k)` | Drop to 1 HP; gain k Block per HP lost |
| `BREW(flask, n=1)` | Put n Fresh copies of a flask card on the belt, ready next round |
| `REFILL(n=1)` | Return the n most recently emptied flasks to the belt, Fresh |
| `IMPROVE(n=1)` | Upgrade n flasks on the belt (to their `+` version) for this fight |
| `UNBIND(n)` | Take one affliction card out of the company's decks for this fight; the target foe suffers its when-drawn effect and gains n Hex |
| `DISCARD_RANDOM()` | The target hero discards a random card (enemy use) |
| `LOSE_ARMOR(n)` | The target loses n Armor (enemy use) |
| `SUMMON(key, max=2, front=True)` | Enemy only: call a creature into the rearmost empty rank, or the front with `front=True` (at most `max` per fight) |
| `TRANSFER(frm=, n=1)` | With `n`, moves only the n largest ailments (each with all its stacks) |

## 3. Quantities and conditions

A condition compares quantities: `"t.hp_pct<50"`, `"momentum>=3"`, `"t.mark>0"`, joined by `&`. A bare name is true if
above 0; `!name` is true if 0. A name reads from the actor; `t.` reads from the target; `m.` reads from the card's main
target.

Unit quantities: `hp`, `max_hp`, `missing_hp`, `hp_pct`, `block`, `armor`, `ward`, `stress`, `grit`, `omen`, `played`
(cards this hero played this round), `resolve`, `dd` (at Death's Door), `rank`, `spectrum`, `el_total`, `el_max`,
`attuned`, `attacking`, `targeting_me`, `moved`, `hand`, `draw`, `discard`, `exhaust`, `ailments`, `scars`, `delayed` (was Delayed this round), `incoming_to` (attack damage
aimed at the unit), `targeted` (foes aiming an attack at the unit), every course
key (`fire` ... `void`) and every status name.

Fight quantities: `x`, `consumed`, `dealt`, `killed`, `prime_count`, `reactions` (Conjunctions this round), `enemies`,
`allies`, `allies_dd`, `same_target` (follow-up: same target as the previous action), `round`, `incoming`,
`incoming_me`, `attackers`, `elements_all`, `total_bleed`, `total_frost`, `total_hex`, `total_doom`, `ally_hurt`,
`hero_dd`, `hero_stress`, `flasks` (flasks on the belt), `flasks_used` (flasks used this round).

## 4. Card fields

```python
card(id, name, cost, rarity, target, fx, text,
     use=[ranks it is played from], hit=[ranks it can hit], cat="physical" | course key,
     attr="stable" | "volatile", kw=[keywords], sub=path_key, flavour="...", note="...", arch="archetype",
     up={"text": "...", ...overrides}, rite={...}, on_draw=[fx], flask=False, world=None)
```

- Rarity codes: `S` starter, `C` common, `U` uncommon, `R` rare, `X` path (needs `sub`), `L` legendary (needs `sub`),
  `K` kit (path kits need `sub`), `F` flask, `N` neutral, `W` world (needs `world`), `A` affliction, `Curse`.
- Targets: `enemy`, `all_enemies`, `self`, `ally` (any hero), `ally_other`, `adjacent_ally`, `all_allies`, `none`.
- Keywords (closed list): `Exhaust`, `Retain`, `Echo` (replays at half power after your Ordo), `Rite`, `Finisher`,
  `Execute`, `Fresh`, `Dosed`, `Curse`, `Affliction`, `Flask`, `Unplayable`, `Temporary` (removed at fight end;
  used for cards foes put in a hand).
- `up`: the upgrade. Always `text`, plus whichever fields change (`cost`, `fx`, `kw`, `rite` ...).
- `flavour`: one line in the lore's voice, under 90 characters. `note`: the art note (one line: the chronicle moment the
  card art shows). `arch`: the archetype key the card serves (from your brief), or `"core"`.
- `on_draw`: for afflictions and curses: effects that fire on the drawing hero when the card is drawn (the card is then
  discarded and replaced).
- `rite`: a lasting effect, for cards with `kw=["Rite", ...]`:
  `rite={"on": trigger, "fx": [effects], "if": condition, "per_round": 1}`.
  Triggers: `round_start`, `round_end`, `play` (this hero plays a card; filter with `"kw": "Finisher"` or
  `"cat": "fire"`), `flask` (any hero uses a flask; the drinker is the target), `conjunction` (the company sets off a
  Conjunction; the foe is the target), `kill` (a foe dies), `hit` (a foe's attack hits this hero; the attacker is the
  target), `ally_hit` (a foe hits another hero; the attacker is the target), `execute` (an execute kills or breaks).
  Effects without `to` land on the trigger's target, or on the hero who owns the rite if there is none. For `play`,
  the target is the played card's target; for `kill`, `m.` reads the foe that died. `"rounds": n` ends the rite n
  rounds after it was played.

## 5. Creature fields (`tools/content/v3/creatures.py`)

```python
creature(key, name, tier, hp, armor=0, span=1, ranks=[preferred ranks], resist={"fire": "immune"|"resist"|"weak", "physical": ...},
         intents={id: I(name, kind, target, [fx])}, ai=[rules], traits=[T(on, name, text, [fx])],
         phases=[P(at_pct, text, ai=[rules], might=0, fx=[...])], personality=..., flags=[...], charge_name=None,
         lore="...", world="world key", role="attacker|defender|support|afflicter|summoner")
```

- Tiers: `foe`, `elite`, `ruler`. `span`: 1, or 2 for rulers and at most one elite per world (DECISIONS row 13).
- Intent kinds: `attack`, `defend`, `buff`, `debuff`, `heal`, `summon`, `charge` (a wind-up that shows what comes).
- Intent targets: `front`, `back`, `rank2`, `rank3`, `front2` (ranks 1 and 2), `back2` (ranks 3 and 4), `random`,
  `weakest` (lowest HP%), `most_stress`, `all_heroes`, `self`, `ally_lowest`, `all_allies`, `ally_front`, `marked`,
  `most_cards`, `heaviest` (most Block plus Armor), `healthiest`, `most_burn`, `most_played` (cards last round),
  `acted_last` (the hero who acted last), `first_actor` (the hero who led the last Ordo).
  Intent text is generated from the effects; do not write it.
- AI rules, first match wins: `{"use": id, "if": cond, "every": n, "offset": k, "not_twice": True, "once": True}`.
  Conditions use section 3 from the creature's side (`hp_pct`, `round`, `charge`, `ally_hurt`, `hero_dd`,
  `enemies` (heroes standing), `allies` ...). The last rule should have no condition.
- Trait triggers: `round_start`, `round_end`, `hit`, `death`, `ally_death`, `phase`, `moved` (it was pushed or pulled),
  `course` (a hero laid a course on it; `T(..., e="lightning")` filters by course), `lost_action` (Stunned or Frozen). Foes 0 or 1 trait, elites 1,
  rulers 1 or 2.
- Phases (rulers): `P(at, text, ai=[...], might=n, fx=[...])`, entered when HP falls to `at` percent. 2 or 3 phases.
- Personality: `mindless` (finishes heroes at Death's Door), `cruel` (targets the most stressed), `cunning` (targets
  the back), `steadfast` (default).
- Flags: `immovable` (cannot be moved), `unstunnable` (cannot be Stunned or Frozen), `swarm` (takes half damage from
  single-target attacks and 50% more from attacks that hit every foe).
- Encounters: `encounter(world, key, name, desc, [creature keys in rank order], room, tier, idea)`; tier `foe`,
  `elite` or `ruler`. Spans must fit 4 ranks. Rulers use the world's ruler room (its `*_boss` room in
  `data/rooms/`; the Drowned Kingdom's is `throne`) with `props="<rival key>"` for rivals. Other encounters use the
  world's other rooms; `python3 tools/content/v3/build_v3.py --rooms` lists them per world.

## 6. Budgets

Cards: `docs/design/GATE3_SPEC.md` (1 vigour is about 6 points at common). `build_v3.py --budget` prints each card's
points against its cost and flags anything more than 20% off; a flag is fine when the card's text explains why
(a drawback, a narrow condition) in its `arch` notes, but most cards should pass.

Points for the new pieces: Doom 1 = 1.4; Hex 1 = 1.2; Execute N = 0.4 N; Brew a basic flask = 5; Refill = 4;
Improve = 3; Focus 1 = 1; Weaken-style course on a foe follows the course stack price.

Creatures: write base numbers. The game multiplies them by Threat (at Threat 0, the first descent, HP x1.5 and damage
x1.32; more after each descent completed), so the base numbers below already land fights in the target lengths that
the Threat calibration measured:

| Tier | Base HP | Base damage a round | Lasts |
|---|---|---|---|
| Foe | 28 to 52 | about 7 (a stress move counts 1 damage per 2 stress) | 4 to 6 rounds |
| Elite | 80 to 130 | about 11 | 6 to 8 rounds |
| Ruler | 220 to 320 over its phases | about 17, split across targets | 8 to 12 rounds |

Armor 0 to 2 for foes, 2 to 4 for elites and rulers; every point of Armor counts as about 8% more HP against the
reference company. The build-aware simulator corrects all of these.

## 7. NEEDS

Each content file ends with `NEEDS = [...]`: one string per mechanic you wanted and could not express, naming the card
or creature. Keep it short; most designs fit the list above.

## 8. The Vessel (seventh calling)

Body rule: every course laid on the Vessel (by anyone, foe or hero) is **held** on its skin instead: it never harms the
Vessel, never sets off a Conjunction on it, and Ward does not stop it. Each course holds at most 6 stacks (overflow is
lost). Held stacks fall by 1 at round end like any course (not those laid this round), and all clear when the fight
ends (DECISIONS rows 10 and 11).

| Helper | Effect |
|---|---|
| `TAKE(e="largest", n=0)` | Move stacks of course `e` (or `"largest"`, or `"all"`) from the target onto the Vessel: all of them, or at most `n`. A Take from a hero cleanses it; Ward does not stop a Take. The amount moved becomes `consumed` |
| `GIVE(e="largest", n=0, attr="stable")` | Move held stacks of `e` (or `"largest"`, or `"all"`) onto the target, Stable or Volatile. The amount becomes `consumed` |
| `EVEN()` | Even out the held stacks across the courses the Vessel holds |
| Course effects aimed at the Vessel itself (`A(e, n, to="self")`) | Simply hold that course |

Quantities: `held_total`, `held_kinds` (Whole is `held_kinds>=6`), `held_max`, `held_min`, and `held_<course>`
(`held_fire` ...).
