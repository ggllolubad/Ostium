# World VI: The Stormwrack Coast (role map)

Gate 2 draft, 2026-11-25. Sources: `world_VI_stormwrack_coast.md`, `RIVAL_RULERS.md`, `afflictions.md`, Combat Rules v2, `tools/content/worlds.py`.

## 1. World

**The Stormwrack Coast.** Courses: lightning and water. Conjunction: **Electrocute** (2x power; chains to every Soaked unit). Door 6 (Act II), so the reference company is level 4 to 5 with a path and one rune. Affliction: **False Light** (discard a random card from this hero's hand).

Electrocute is the one Conjunction that spreads on its own: whoever is Soaked when the lightning lands pays for the whole line. Every fight here is a Soak race. The cast sprays, fogs and breaches until the company is wet, then one telegraphed lightning trigger (an eel's glow, the lens, a bolt) runs through every Soaked hero at once. The company's answers are to keep Soak off (Ward, cleanse, the Vessel taking courses onto itself), to kill the trigger before it fires, or to strike first. Most of the cast lives in the surf and resists water, so the company's own Electrocute works best on the fliers and the cliff folk. The wreckers' false lights run through the whole world: lures that drag the back rank forward, a beam that takes cards out of hands, and False Light itself, so a plan that needs one exact card or one exact rank breaks here.

## 2. Roster

Rank footprint follows the design language: Small, Human and Large take 1 rank; "(2 ranks)" marks a body wide or long enough to fill two.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Thunder Whale (`thunder_whale`) | ruler | attacker | 2 to 4 (3 ranks) | Breaches to Soak the whole company, then sings: lightning arcs harpoon to harpoon and strikes every Soaked hero. | Harpoon rods: lightning applied to it does no harm and adds power to its next Song. Cataract eye: its single-target moves never pick rank 4 (until phase 3). | Immune lightning (the storm is its song); resists water; weak to toxin |
| The Last Prize (`last_prize`, new) | ruler | summoner | 2 to 4 (3 ranks) | A broadside down the fused gun deck puts lightning on every hero; the drowned at the rail drag a hero aboard (pulled to rank 1, Anchored). | On the rocks: cannot be moved or Stunned. | Resists lightning (welded ironwork) and water; weak to frost (ice in the split seams) |
| The Wind-Seller (`wind_seller`, new) | ruler | afflicter | 3 to 4 (2 ranks) | Unties one knot per phase: gusts reorder the company, then a bolt strikes a whole rank, hardest on the Soaked. | Three knots: the knots left on her cord are shown; each phase unties one, and her moves change with it. | Resists lightning and water; weak to physical (the cord can be cut) |
| The Lighthouse Keeper (`lighthouse_keeper`) | elite | afflicter | 3 to 4 | The false beam lights one hero: Marked, and a card is knocked from their hand; the lens then flashes lightning onto the lit hero. Answer move: Sea Fog strips the company's Ward and Soaks every hero. | Round start: the beam falls on the hero holding the most cards (shown). | Resists lightning and water; weak to void (light rule) |
| Harpy Matron (`harpy_matron`) | elite | summoner | 1 to 2 (2 ranks) | Calls the brood (Storm Harpies into empty ranks), dives on the back rank with lightning, screeches for stress. | On ally death: when a harpy dies she gains Might. | Resists lightning; weak to frost (haste rule) |
| The Gibbeted Wrecker (`gibbeted_wrecker`, new) | elite | attacker | 3 to 4 (2 ranks) | The highest metal for miles: every lightning applied anywhere charges the cage; at full charge a strike on the gibbet jumps to every Soaked hero. His legs kick whoever stands in front. | Lightning rod: whenever any unit, hero or foe, gains Static, he gains a charge (shown). Cannot be moved. | Resists lightning and physical (the cage); weak to water (rust eats the irons) |
| The Strand-Wife (`strand_wife`, new) | elite | afflicter | 1 to 2 | The ringed fist discharges into a hero and takes something: one good status (Prime, Might, Riposte, Block) moves to her. Answer move: targets whoever banked the most. | On death: her salvage sack spills; everything she took returns to its owner, plus gold. | Resists water and lightning (the fused rings); weak to toxin |
| Wrecker (`wrecker`) | foe | afflicter | 2 to 3 | Waves the false lamp (stress to all; the rearmost hero is lured a rank forward), then coshes whoever stands in rank 1. Stress dealer. | None | Resists water; weak to lightning |
| Shock Eel (`shock_eel`) | foe | attacker | 3 to 4 | The world's trigger: its organs glow for a round, then a discharge puts Volatile lightning on one hero, which chains through every Soaked hero. | On hit: a hero who strikes it in melee gains Static. | Immune lightning (its organs make it); resists water; weak to toxin |
| Storm Harpy (`storm_harpy`) | foe | attacker | 1 to 2 | Rakes the back rank from the air; a storm shriek for stress. Stress dealer. | None | Resists lightning; weak to frost (haste rule) |
| Tide Crab (`tide_crab`) | foe | defender | 1 | Holds rank 1 under a scavenged lantern-housing shell and sprays brine to Soak the company for the eels. | None | Resists water and physical; weak to lightning (the metal shell conducts) |
| Drowned Bosun (`drowned_bosun`) | foe | support | 1 to 2 | The silver whistle rallies the crew: the next foe to act this round strikes harder; the boarding axe otherwise. | None | Resists water; weak to lightning |
| Lantern Cow (`lantern_cow`, new) | foe | defender | 1 | The iron lantern draws the strike: lightning aimed at her allies lands on her, and her next butt runs it down into the front rank. | Lightning rod: lightning applications on other foes go to her instead. | Resists lightning; weak to fire (the lantern oil) |
| Ship-Breaker (`ship_breaker`, new) | foe | attacker | 1 | Pries before he strikes: the crowbar strips a hero's Block, then the oak knee comes down overhead. | None | Resists physical and lightning (copper in his arms); weak to frost |
| Storm Petrels (`storm_petrels`, new) | foe | afflicter | 3 to 4 | Ride in ahead of the gale: the flock pours over one hero in many small crackling hits, each adding Static. | Flock: single-target hits deal reduced damage; hits on every foe deal full. | Resists water; weak to frost (haste rule) |
| Rock Octopus (`rock_octopus`, new) | foe | afflicter | 2 | A rigid copper-studded arm whips round a hero: Static, and the hero is held (Anchored: no Swap, cannot be moved). | None | Resists water; weak to fire |
| Drowned Drummer (`drowned_drummer`, new) | foe | summoner | 3 to 4 | Beats to quarters: a roll that deals stress with lightning on the last beat, and the crew still come (a Wrecker enters the rearmost empty rank). Stress dealer. | None | Resists water; weak to toxin |
| Cragsman (`cragsman`, new) | foe | attacker | 3 to 4 | Swings across the ranks on his rope; the fowling pole lashes two adjacent heroes, back ranks included. | On the rope: cannot be pushed, pulled or swapped. | Resists water; weak to fire (the rope) |
| Drowned Merchant (`drowned_merchant`, new) | foe | defender | 1 to 2 | Hugs the strongbox for heavy Block and guards the weakest ally; rams with the box, discharging into a hero. | On death: the strongbox bursts and the company finds gold. | Resists water; weak to physical (the bloat splits) |

## 3. Rulers

**The Thunder Whale** (`coast_boss`, with a Shock Eel in rank 1).
- Phase 1, the Breach (full HP to about two thirds): opens with Breach (damage and Soak to every hero); then Spout (heavy Soak on the back rank, pushed a rank) and Ram on rank 1. The cataract eye leaves rank 4 safe.
- Phase 2, the Song (to about a quarter): the harpoons light. Thunder Song every other turn (Volatile lightning on every hero, Electrocute on the Soaked), with a Breach between songs to re-soak.
- Phase 3, Sounding (below a quarter): it sounds for one turn (Block and Regen), then rises blind in both eyes: the cataract no longer spares rank 4, and Breach and Song alternate.
- Commission: "The Tooth is lodged in the old bull's blowhole. The wreckers hung dozens of harpoons in it and failed; finish their work, and bring home the Tooth, not the oil."

**The Last Prize** (proposed room `coast_prize`, the rocks under the point where she lies; until it is built, `coast_cove`). Rank 1 is left for her crew.
- Phase 1, Broadside (to about two thirds): opens with Broadside (lightning on every hero); then Drag Aboard (a back hero is pulled to rank 1 and Anchored) and Beat to Quarters (a Drowned Bosun climbs down into rank 1).
- Phase 2, She Lists (to about a quarter): the hold stoves in, spilling cargo. She is Soaked for the rest of the fight, so the company's lightning now Electrocutes her, but surf over the rail Soaks ranks 1 and 2 every turn.
- Phase 3, Going Down (below a quarter): the cracked bell rings each turn (stress to every hero); Drag Aboard every other turn, and a hero still Anchored aboard at round end takes a heavy hit.
- Commission: "The richest ship the coast ever took has been going down for a hundred years, and the Tooth's storm is all that keeps her on the rocks. Sink her before she claims it."

**The Wind-Seller** (proposed room `coast_stack`, the sea-stack in the surf; until it is built, `coast_cliffs`). Storm Petrels in rank 1 or 2.
- Phase 1, the first knot (to about two thirds): a breeze. Gusts Push and Pull heroes out of their ranks and Soak them; the bird-bone whistle calls Storm Petrels into an empty rank (twice per fight at most).
- Phase 2, the second knot (to about a quarter): a gale. A bolt strikes a whole rank, hardest on the Soaked, every other turn; gusts between.
- Phase 3, the third knot (below a quarter): the storm. Lightning on every hero each turn, no more gusts: a race.
- Commission: "She sold the wreckers every storm they used. She is untying the last cords now, and if the third knot comes undone the coast is hers. Cut the cord."

## 4. Encounter plan

Rooms: `coast_cliffs` (the wreckers' strand, harpy ledges, the gibbet on the headland), `coast_cove` (a sea cave with a wreck in its mouth and eel shallows), `coast_light` (the lighthouse's top gallery at night). Creatures listed from rank 1.

| Group | Creatures (rank 1 first) | Room | Tactical idea |
|---|---|---|---|
| The Lamps Are Lit | Drowned Bosun, Wrecker, Wrecker | `coast_cliffs` | The Wreckers lure the back rank forward into the Bosun's axe; kill a Wrecker first to stop the pulls. |
| The Eel Shallows | Tide Crab, Rock Octopus, Shock Eel, Shock Eel | `coast_cove` | The crab Soaks, the octopus holds a hero so it cannot Swap out of the wet, the eels close the circuit. Cleanse or Ward before the glow becomes a discharge. |
| The Harpy Rocks | Storm Harpy, Storm Harpy, Cragsman | `coast_cliffs` | Everything hits the back ranks; the front-rank wall has nothing to block. Protect the rear or kill fast. |
| The Wreck | Drowned Merchant, Drowned Bosun, Drowned Drummer | `coast_cove` | The Merchant walls the front while the Drummer keeps calling crew; reach the Drummer or the fight never ends. |
| The Riding Light | Lantern Cow, Wrecker, Storm Petrels | `coast_cliffs` | The cow soaks up every lightning card aimed past her; switch courses or kill her first. |
| The Breakers' Yard | Ship-Breaker, Wrecker, Rock Octopus | `coast_cove` | The octopus pins the front hero in place and the Ship-Breaker pries its Block away first; Block-only defence fails. |
| The Gallery Rail | Wrecker, Storm Petrels, Storm Harpy | `coast_light` | Fast fliers in a tight space; area damage pays, and the Wrecker's stress stacks if left alive. |
| Salvage | Drowned Merchant, Shock Eel, Cragsman | `coast_cove` | The Merchant guards the eel; break the guard or Ward the company before the discharge. |
| The Lighthouse (elite) | Tide Crab, Wrecker, Lighthouse Keeper | `coast_light` | The beam chooses the target and empties the richest hand; play big hands down early and keep the lit hero out of Soak. |
| The Matron's Roost (elite) | Storm Harpy, Harpy Matron, (rank 4 open for the brood) | `coast_cliffs` | Every harpy that dies feeds her Might; clear the brood with one area hit or go through it to her. |
| The Gibbet (elite) | Wrecker, Shock Eel, Gibbeted Wrecker | `coast_cliffs` | All lightning, even the eel's, charges the cage. Kill the eel, hold your own lightning, and Soak him: he is weak to water. |
| The Tideline (elite) | The Strand-Wife, Drowned Merchant, Rock Octopus | `coast_cove` | She steals what the company banks; spend Prime and Might the round you gain them. |

## 5. What this world tests

- **Course defence for the whole company:** Ward, cleanse and the Vessel's course-taking, since one Soaked line is one target. Alchemist cleanses and Elementalist Ward builds shine; a company with neither must kill the triggers first.
- **Lightning-heavy Elementalist builds (Catalyst):** the Lantern Cow, Gibbeted Wrecker and Thunder Whale all turn lightning against its caster.
- **Back-rank safety:** lures, drags, divers and the Cragsman pull and hit ranks 3 and 4, testing Bulwark cover for the rear and Swap discipline.
- **Fragile combo hands:** False Light, the Keeper's beam and the Strand-Wife punish builds that bank cards or buffs for one big turn (Oracle Prime chains, Duelist Momentum lines, Hexweaver payoffs). Retain and cheap setup are rewarded.
- **Summoners and support:** the Drummer, Bosun, Matron and Last Prize test target priority over the biggest body.
