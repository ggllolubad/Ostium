# Gate 3 check: the 15 world modules

Scope: `tools/content/v3/world_*.py` (285 creatures, 226 encounters, 60 world cards, 6 foe-made curses), read against
`scripts/combat.gd` and `scripts/enemy_ai.gd`. The build runs clean ("validation problems: none"); every finding below
passes the validator. Order of work: broken intents and traits, stuck AI, world cards, budget, rank rules.

Engine facts the findings rest on (all in `combat.gd`):

- A round runs: `start_round` (Block cleared unless Fortified, intents chosen, round-start traits), every hero action,
  every foe action, `end_round` (Dodge, Tenacity, Taunt and Guard cleared; Mark, Anchor, Lockdown, Blight,
  Vulnerable fall by 1; Thorns halved). Foes always act after every hero.
- An effect without `to` lands on the intent's target. `CLR` is not one of the self-only effects in `_exec`, so
  `CLR("charge")` in an intent aimed at heroes clears the heroes' charge, not the creature's.
- Hero `stun` is never read (`check_action` only checks Freeze). `_delay` returns for anything that is not a foe.
  Foe `taunt` is never read when heroes pick targets.
- A trait's effects without `to` land on the creature itself for `round_start`, `round_end`, `course`, `moved`,
  `phase`, `death`; on the hitting hero for `hit`. `hit` and `course` traits fire up to 5 times a round
  (`TRIGGER_LIMIT`), not once.
- Course immunity returns before `course` traits fire. `elements_all` and `total_frost` always read the foes' side.
- Foe-made cards (`ADD`) go to `next_hand`; an `on_draw` card fires at round start, then goes to the discard pile and
  fires again on every reshuffle for the rest of the fight. Nothing in the engine reads `Temporary`.

## Cross-cutting (fix once, in the engine or the DSL)

- [bug] X1 charge loops: `CLR("charge")` sits in an intent aimed at heroes in 31 creatures, so the charge never resets and the payoff rule (always first in the list) fires every round once reached. Worst cases: powder_mill.crush (26 to the front hero every round from round 5), old_heron.spear (22 to the rear hero every round from round 4), skald.last and court_fool.punch (9 and 10 stress to every hero every round after the third Verse or Joke), anvil_titan.blow (14 through Block every round from round 3). Per-module lists below. Fix: `CLR("charge", to="self")` everywhere (or make `clear` of `charge` self-only in `_exec`).
- [bug] X2 foe Block, Dodge and Guard from intents are inert against heroes: 154 intent Block effects without Fortify, 35 self-Dodge intents and 12 Guard intents resolve in the foe phase and are wiped before the next hero phase (Block at `start_round`, Dodge and Guard at `end_round`). Thorns from intents arrive halved. Only Burn ticks and Thorns/Riposte meet that Block. Every "defend" turn is a lost turn, and fights run shorter than the budget assumes. Fix in the engine: clear a foe's Block, Dodge and Guard at the start of its own next action instead of at the round boundary (the Ice-Wed Captain's Command trait, which Fortifies its neighbours, is the content-side version).
- [bug] X3 short statuses from intents expire before a hero acts: Mark 1 (15 intents), Anchor 1 (9), Lockdown 1 (2) and Blight 1 (1) land in the foe phase and fall to 0 at `end_round`. All 10 intents aimed at `marked` therefore fall back to `heroes[0]` (the front hero), and "Mark, then strike the Marked" pairs never connect. Fix: apply these at 2, or decay hero statuses at the start of the next foe phase.
- [bug] X4 hero Stun does nothing: 16 creatures stun heroes (list per module), including the Great Refractor's whole signature. Text says "Stun". Fix in the engine (a Stunned hero's first card fizzles, then Tenacity) or switch the content to `lockdown` 2.
- [bug] X5 `DISCARD_RANDOM` is near-inert: foes act after every hero, and `end_round` discards the hand anyway, so it only removes Retain cards (abbess.seal, lighthouse_keeper.beam, strand_wife.pockets). Fix: `ADD` a curse instead, or have it hit the next hand.
- [bug] X6 summon turns wasted: summon rules gated only by `allies<N` keep firing after the summoner's `max` is spent or while the ranks are full, so the intent shows "calls X" and does nothing (with `not_twice`, every other round). Worst: hearth_grandmother (no `not_twice`: every remaining turn), confessor.call, hive_queen.eggs, procession.split (phase 1, `every` with full ranks from the start). Fix: AI skips a summon that cannot happen (engine), or add `"once"`/`every` gates.
- [balance] X7 foe-made curses recycle: Plague Fleas, Ship's Broth, Hag's Offering, Fool's Spore and Written into the Table fire on arrival, then sit in the discard pile and fire again every reshuffle, and each further cast adds another copy. Intent text says only "puts X in their hand". Either intended (say so in the hover text) or give `on_draw` curses Exhaust on draw. Their "draw a replacement" text is false on arrival (start-of-round arrival draws nothing extra).
- [style] X8 hit traits whose text says "the first hit each round" fire up to 5 times a round: pale_hunter, void_mammoth, silent_singers, unspoken_bear, tinker, hive_queen.The Rod, stilled_college.Out of Order, gin_ox, speculum_bearer (course). Fix the text or add a once-a-round trait option (already in "Still not in the engine").
- [style] X9 25 creatures are `cruel` or `cunning` but have no `random` intent, the only target those personalities change (for example abbess, pearl_diver, siren, scold, clock_jack). Their personality does nothing.
- [style] X10 intent text puts the creature's own effects after the target prefix: burning_lung.inhale "Every hero: strips their Toxin, builds 2 Gas Sac, gains 10 Block"; fleet_marine.order and musk_ox.herd "The most wounded foe: guards an ally, gains 6 Block"; sin_eater.eat "...cleanses 4, gains 1 Might" (the Might is the Sin-Eater's). `humanize` turns `t.hp_pct>=100` into "their HP above 100%" (pale_hunter.arrow). Fix in `text_of`.
- [style] X11 courses are named two ways: world cards say Water, Void, Frost, Fire, Lightning; intents and some world cards say Soak, Erode, Weaken, Burn, Static (for example w_coast_breaking_sea "Soak" beside w_drowned_undertow "Void"). Pick one per surface.
- [style] X12 elite groups: 33 of 60 lead with a foe in rank 1 (GATE3_WORLD_AGENT: "Elite groups lead with an elite"). No row 13 breach: spans fit, rulers fill 4 ranks, each world has at most one two-rank elite in one group with companions, no creature is unused.

## world_drowned

- [bug] bell_below.toll: X1, from round 4 the Toll (6 stress and 1 Soak to every hero) fires every round in every phase; swing, reach, hum, knell and clapper are never used again. Fix X1.
- [bug] hookline.net, mother_of_brine.embrace: Anchored 1 (X3). Anchor 2.
- [bug] abbess.seal: discard is near-inert (X5); the move is 5 stress. Fix X5.
- [depth] drowned_king.gorge, mother_of_brine.eat: phase text and the encounter idea say he "eats his court" and she "devours her own", but neither harms an ally; killing the escorts first only switches the heal off (`allies>=2`). Heal per ally (`per="allies"`) and NEEDS a self-kill-ally effect.
- [balance] abbess Salt Crust: Ward never fades, so 2 Ward a round stacks (12 after six rounds without a course laid). Gate it with `if_="ward<2"` to match "the first course stacks".
- [style] drowned_king.breath is kind `charge` but no move follows it. Use `defend`.

## world_rime

- [bug] fire_setter.bucket, skald.last, ore_hauler.swing, snow_hare.drum, pit_adder.cold, sleeper_under_the_hold.gust: X1. Skald: 9 stress to every hero every round after its third Verse (18 per round of stress budget on a 32 HP foe); Sleeper: gust every round once Heat reaches 3 (P1) or 2 (P2). Fix X1.
- [bug] riven_jarl Two Halves: text "turns the first course laid on him", but 1 Ward cancels one stack, and unspent Ward stacks a point a round. `if_="ward<1"` and say "1 Ward".
- [balance] w_rime_the_glacier_splits: "1, plus 1 per Armor" is cancelled by that Armor, so every foe takes 1 (2 upgraded) for 2 vigour. Add `pierce=True` or base 3.

## world_foundry

- [bug] anvil_titan.blow: X1, Plasma (14 through Block, Static, Volatile Burn) every round from round 3 in P1 and P2; anvil and rivet rarely or never. The "count of three" never restarts. Fix X1.
- [bug] crucible.bell: no `CLR` at all, so from 6 the bell rings every other round (`not_twice`) for the rest of the fight (30 value a ring). If it rings once per 6, add `CLR("charge", to="self")`.
- [bug] talos_sentinel One Vein: `D(0, per="bleed", to="self")` is an attack on itself, so its own Armor 4 and physical resist cut 3 Bleed to 0. Use `SELFDMG(0, per="bleed", k=1)`.
- [bug] cyclops_smith.quench: `elements_all>=6` counts distinct courses across all foes and needs all six; never chosen. Use `spectrum>=3` or `el_total>=4`.
- [bug] cyclops_smith.hammer and By Ear, storm_catcher.heave "6 (if Marked)": X3, the Mark is gone before the hammer picks its target and before the heave lands; the hammer always hits the front hero and the +6 never applies. Mark 2.
- [bug] wire_drawer.whip2/3/4: Anchored 1 (X3).
- [balance] mould_sitter: Armor 4 plus physical resist on a foe (band 0 to 2); a 10-damage physical hit deals 3 until the mould cracks. Armor 3.
- [style] automaton_tender.wind: "spends its charge" while it clears the front foe's Clockwork (already in NEEDS).

## world_baths

- [bug] simmering_matron.boil, great_copper.valve and split: X1. Matron: boil-over (2 Soak, 2 Volatile Burn on every hero, a Scald each) every round from round 5. Copper: the valve every round once Pressure reaches 4, so Weaken on the boiler only delays it once. Fix X1.
- [bug] steam_nymph.veil and drift: Dodge for every foe and for itself is wiped before heroes act (X2); veil does nothing.
- [bug] best_families.arms: Anchored 1 (X3). best_families.fall keeps firing every 2 rounds after its 3 summons (X6).

## world_pits

- [bug] powder_mill.crush and flash, powder_ogre.keg, shrine_bearer.bless_gas, burning_lung.exhale and last: X1. Mill: 26 to the front hero every round from round 5, then flash (15 and 2 Volatile Burn to the front pair) every round in P2 and P3. Ogre: keg every round from round 5 (and 20 self-damage each). Lung: exhale every round after the first inhale unless a hit pops the sac while it Burns. Fix X1.
- [bug] shrine_bearer.smoke: `elements_all>=6` never true. Use `spectrum>=3`.
- [bug] mounted_overseer.barge: X3, lash's Mark expires, barge hits the front hero, not the lashed rear one. Mark 2.
- [bug] burning_lung Split Skin: "gains 2 Burn" on itself, halved to 1 by its fire resist. Apply 4 or say 1.
- [depth] lamp_room_girl.hand_hero: Lit Lamp is a playable 1-cost card that Burns a foe for 2 and Exhausts; the company can ignore it or profit. Make it Unplayable with an on_draw Burn on the holder.
- [balance] fuse_imp.blow: 9 and 2 Burn to every hero (36 value, five rounds of a foe's budget) at round 4 unless Soaked or Weakened. Base 6.
- [balance] w_pits_throw_it_back (and w_garden_take_the_rot): 1 vigour moves every ailment off the most afflicted hero (often 6 to 12 stacks) onto a foe; Throw It Back then adds Volatile Burn, which sets off a Conjunction with each course moved. Well above the 1.06 the budget tool prices. `TRANSFER(frm="ally_most", n=1)` or cost 2.
- [style] w_pits_firedamp shares its name with al_firedamp (Alchemist).

## world_pyre

- [bug] questioner.irons: X1, from round 5 every round (6, 2 Erode, 2 Volatile Burn to the front pair). Fix X1.
- [bug] unburnt_inquisitor The Accused: reads Marked heroes at round start, but accuse's Mark 1 expired at the round end before; never triggers (X3). Mark 2.
- [bug] w_pyre_fire_unending: `SELFDMG(1, to="all_allies")` hurts the rite's owner once per hero (4 HP to the owner, nothing to the others); text says every hero loses 1. Make the drawback "you lose 3 HP" or NEEDS a hero-wide HP loss.
- [bug] confessor.call: every 3 rounds in P1 into full ranks (X6). Gate with `allies<3`.
- [bug] saint_unending.chains: Anchored 1 (X3).

## world_spire

- [bug] great_refractor: Stun is inert (X4) and sight4 never clears the Drive (X1), so P1 runs sight1, sight2, sight3, then sight4 (6 to the rear hero) every round; swing only in round 1. P2 and P3 use lensb every round; lensf and swing are dead. P1 deals about 6 a round against a ruler budget of 17. Fix X1 and X4.
- [bug] clock_sentry.tock, clock_jack.strike, rodwarden.strike: X1. Sentry tocks 11 every round from round 2; the Jack strikes 10 stress every round from round 4. Fix X1.
- [bug] speculum_bearer Face-Out: a `course` trait's effects land on the mirror itself, and its lightning resist halves 1 Static to 0; the hero never gains Static. NEEDS a `to` for the hero who laid the course.
- [bug] stilled_college Aye: `total_frost` sums Weaken on the foes, so it grows Might when the company Weakens the college, the opposite of the text. NEEDS a company-side quantity.
- [bug] last_hour.midnight: nothing clears the Minute Hand, so from round 10 Midnight (8, Weaken, Volatile Static to every hero) fires every round in P1 and P2. If one strike at 10 is meant, `CLR("charge", to="self")`.
- [bug] college_tortoise.bite, horologist.click: Lockdown 1 (X3). Lockdown 2.
- [bug] patroness_monkey.steal, ephemeris_clerk.quill, gate_mastiff.snap: aimed at `marked`; the monkey picks its target before the Patroness's spyglass lands, and that Mark is gone next round (X3); all hit the front hero.
- [balance] w_spire_second_hand: 0 cost, Prime up to 4 (5 upgraded), no drawback; always correct before an attack. Cost 1 or Exhaust.
- [style] gin_ox The Dome Has Stopped: gives 8 Block when both conditions hold; text says 4.

## world_fleet

- [bug] leviathan_ice.freeze, the_broadside.full: X1. Leviathan: freeze every round in P2 and P3 after the first draw; breach and swallow never. Broadside: full broadside (6 to every hero, 3 more to the front pair, 2 Volatile Weaken) every round after the first reload. Fix X1.
- [bug] walrus_brute.blubber "taunts": foe Taunt is never read; crush Stun inert (X4). Make blubber Guard the weakest with Fortify.
- [bug] sailmaker.needle: Stun inert (X4).
- [bug] galley_cook broth rule `flasks_used>0`: intents are chosen after `flasks_used` resets, so it never fires.
- [bug] ice_eel.dive, powder_monkey.duck, frost_selkie.slip: Dodge inert (X2).
- [style] leviathan_ice The Eye Follows: a trait with no effects. Give it one or drop it.

## world_barrow

- [bug] court_fool.punch: X1; only Heckled (a hit) resets the Joke, so an unhit Fool deals 10 stress to every hero every round after its third Joke. Fix X1.
- [bug] sexton_beetles.pour "delays them": `DELAY` does nothing to a hero. Lockdown 2.
- [bug] barrow_mason.wall, pest_house_watchman.nail: Stun inert (X4); nail's Blight 1 expires before the hero acts (X3).
- [balance] w_barrow_burial_axe: Doom counts twice (once by the Execute rule, once by `per="t.doom"`); at 10 Doom it executes at 24 HP for 1 vigour. Drop the per, or say so in the arch note.
- [style] rat_king trait Plague Fleas shares its name with t_barrow_fleas in the same world, with a different effect.

## world_silence

- [bug] hearth_grandmother.call: no `not_twice`; once her 3 summons are spent, every P1 and P2 turn with fewer than 3 foes is an empty Call (X6).
- [bug] silent_singers.full: X1; reset only by a hit, so an unhit pair gives 9 stress and 1 Erode to every hero every round.
- [bug] voiceless_chief.baton, snow_house_builder.drop: aimed at `marked`, Mark 1 from point expires (X3); both hit the front hero.
- [bug] silence_stag.stamp, snow_house_builder.bury: Stun inert (X4).
- [balance] pale_hunter Into the Snow: every damaging hit grants a Dodge (up to 5 a round), so every other hit misses; hard-counters multi-hit and Echo builds. Needs a once-a-round trait (X8).
- [style] cold_star P2 text "Every hero carrying Frost is drained at once": no effect does this.

## world_coast

- [bug] shock_eel.discharge, gibbeted_wrecker.struck: X1. The eel discharges every round after its first Glow; the Wrecker strikes every hero every round once the irons hold 4. Fix X1.
- [bug] thunder_whale Harpoon Rods: a lightning `course` trait on a creature immune to lightning; immunity returns before the trait, so it never fires. Resist instead, or NEEDS.
- [bug] lighthouse_keeper.flash: aimed at `marked`; beam's and Glare's Mark 1 expire (X3), so it hits the front hero. beam's discard is near-inert (X5).
- [bug] strand_wife.pockets: discard near-inert (X5); 4 damage on a `debuff` intent skips Taunt and Guard.
- [bug] last_prize Taking Water: "3 Soak" on itself, halved to 1 by its water resist.

## world_hive

- [bug] dowser.snap, cicada_under_the_road.song: X1. The Dowser snaps every round after its first Dip.
- [bug] galvanic_beetle: immune to lightning, so Stores the Strike never fires and release is never used.
- [bug] courier.spasm: `tenacity>0` is cleared at round end before intents are chosen; never used.
- [bug] tinker.swing, spire_termites.build, road_centipede.strike, procession.tip, cicada.shrill: Stun inert (X4). road_warden.attention Taunt inert.
- [bug] hive_queen.eggs, procession.split: fire on `every` in P1 with all 4 ranks full (X6).
- [balance] cicada_under_the_road The Hum: +1 a round and 2 stress per step (max 10) to every hero; P1 has no song, and the song's CLR misses (X1). From round 5 every hero takes 10 stress a round. Reset the Hum in P1 too, cap at 6.
- [balance] mantis_duelist Salute: +2 Riposte every round, no cap; by round 6 a five-hit round returns 12+11+10+9+8. `if_="riposte<4"`.
- [balance] w_hive_lightning_rod: does nothing unless the most wounded hero carries Static (n=0 is skipped). Use the upgrade's base 1 on the base card.
- [balance] w_hive_take_the_sting: 0 cost, up to 6 Block with no drawback whenever the player is afflicted. Cost 1 with a higher cap.
- [style] brood_mother The Brood Scatters: the dying mother still fills her rank while her death trait runs, so "fill up to two empty ranks" places one fewer than the text when she held the last free space.

## world_sky

- [bug] wheel_of_thrones.hub: X1; after the first Spin, hub every round in P2 and P3; spin, tyre and crush are dead. Fix X1.
- [bug] porter_of_heaven.key, skywreck_knight.lance: Stun inert (X4); the Porter's role-map move ("loses its next turn") does nothing.
- [balance] w_sky_something_leans_closer: "plus 1 per Conjunction already set off" counts the triggering one (the first deals 3); no `per_round` cap, so 5 Conjunctions in a round deal 3+4+5+6+7 = 25 through Block for 1 vigour. Add `per_round` 3 and fix the wording.

## world_mire

- [bug] old_heron.spear: X1; P1 is three idle rounds (still gives only inert Block, X2) then 22 to the rear hero every round in P1 and P2; lift and gulp are never used. Fix X1.
- [bug] coven_mother.knot: X1; Anchor 3 and 6 stress every round from round 4.
- [bug] eel_catcher.jab, stilt_hall.reach: Anchored 1 (X3).
- [bug] frog_catcher.sack: keeps firing every 3 rounds after both toads are out (X6).
- [style] w_mire_fen_water shares its name with al_fen_water (Alchemist).

## world_garden

- [balance] lady_of_the_bower The Bed Blooms: each round adds Regen equal to the open blooms while Regen falls only 1 a round, so it grows triangularly: she heals 7 at round 4, 16 at round 6, 29 at round 8, 46 at round 10. A company without fire, Blight or a Regen strip cannot win the long fight. Set Regen to the bloom count (`CLR("regen")` first) instead of adding to it.
- [bug] lady_of_the_bower.sleep: Stun on the two rear heroes is inert (X4); her P1 is sigh and canes only.
- [bug] beekeeper.smoke (Dodge to a foe), pond_swan.hiss (Guard): inert (X2).
- [style] t_garden_fools_spore lacks the Curse keyword the other foe-made cards carry.
- [style] w_garden_nothing_regrows: the upgrade adds only Retain. Cost 0 or add a clause.

## Summary

Counts: 99 findings: bug 66, balance 15, depth 2, style 16 (the 12 cross-cutting items count once each; per-module lines that point to them count again).

1. Charge loops (X1): 31 creatures put `CLR("charge")` on the heroes, so their charge never resets and the payoff fires every round. Worst cases: Powder Mill (26 to the front hero each round), Old Heron (22 to the rear hero), Skald (9 stress to every hero), Great Refractor. One-line fix: `to="self"`.
2. Foe-phase timing (X2, X3): Block, Dodge and Guard from 200+ foe intents, and Mark, Anchor, Lockdown and Blight at 1, expire before any hero acts. Every "defend" turn is lost, and all 10 "strike the Marked" intents hit the front hero. Needs an engine decision.
3. Hero Stun is never read (X4): 16 creatures' stuns do nothing, including the Great Refractor's signature and the Porter of Heaven's. Add hero Stun to the engine or move these to Lockdown 2.
