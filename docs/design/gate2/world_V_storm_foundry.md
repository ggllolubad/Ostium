# World V: The Storm Foundry (role map)

Gate 2, Deliverable B. Design brief only: no final numbers.

## 1. World

**The Storm Foundry.** Courses: Fire and Lightning. Conjunction: **Plasma** (Fire meets Lightning): 2x power that ignores Block, and Burn splashes to the neighbours. The affliction is Ringing (gain 2 Static when drawn). Plasma goes straight through Block, so heroes here live on Armor, Ward, healing and killing fast; a wall of Block buys little. Burn splashing to the neighbours makes adjacency matter: a Plasma on the hero in rank 2 also burns ranks 1 and 3, and Swap can move a hero out of a splash. Foes come as two halves again: Static-layers (the storm side: arcs, sparks, cats, horses) and Burn-layers (the forge side: slag, coke, salamanders, imps), plus machines that resist physical hits and ignore lightning. By the course rebalance, creatures of heat and haste are weak to frost; machines are weak to water.

## 2. Roster

Stress dealers among the cast: Guild Warden (fine), Mould-Sitter (silent scream). The elite Sparkblind Smith bellows too.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|-|-|-|-|-|-|-|
| The Anvil Titan `anvil_titan` | ruler | attacker | 3-4 (2 ranks) | Built to strike the anvil forever, and it found something softer: a rhythmic tap counting to the full hammer blow, with a strike arcing from the back spike through the hammer into the hero (Plasma through Block); becomes the anvil (Block it keeps). | Rhythm (round start): taps on a count of three; the third beat is the full blow. Something softer: its full blow falls on the hero it struck last unless a Taunt or Guard turns it. | resists physical, fire, lightning; weak water (a bronze machine) |
| The Crucible `crucible` (new) | ruler | attacker | 3-4 (2 ranks) | Tipped to pour the great bell: a wave of molten bronze over the front ranks (Burn), with sparks cracking down the stream (Static): Plasma on the front line; the pourers' bucket steams. | The pour (round start): bronze runs into the bell pit on a visible count toward the finished bell; frost or water on the Crucible stops one pour. | resists fire, lightning; weak frost (fireclay cracks) |
| The Storm-Catcher `storm_catcher` (new) | ruler | afflicter | 3-4 (2 ranks) | Holds the spire's two cables: marks heroes with Static ferns, then heaves on the cables and the storm strikes every marked hero (Plasma through Block on any that carry Burn). | Grounded: his feet are fused into the footing; he cannot be moved. The cables (round start): marks one hero (visible); Ward on a marked hero clears the mark. | resists fire, lightning; weak frost |
| The Sparkblind Smith `cyclops_smith` | elite | attacker | 1-2 | Works by the ring of the iron: a hammer blow that brands (Burn and Mark); turns a hot bar in the tongs so the next brand burns deeper; a bellow (stress). | By ear: he targets the hero who played the most cards last round. | resists fire, lightning (spark pits and scars); weak frost |
| Talos Sentinel `talos_sentinel` | elite | defender | 1 | Hollow bronze full of ichor: round shield (Block), spear thrust that grips (Anchored), stomp on every hero. | One vein: a single nail plugs the heel; Bleed on it is doubled and it cannot heal. | immune fire (molten ichor); resists physical, lightning; weak frost |
| The Wire-Drawer `wire_drawer` (new) | elite | attacker | 2 | Draws bronze into wire: a length of live wire whipped round a hero and hauled tight (pulled forward, Anchored, Static). | Draw-plate (round start): draws a fresh length; his whip reaches one rank further each round (rank 2, then 3, then 4). | resists fire, lightning; weak frost |
| The Dray Horse `dray_horse` (new) | elite | attacker | 1 | Rears and crashes both forehooves on the front hero, throwing sparks across the rank (Static and Burn on the hero beside it). | Storm-shod (round start): stamps and sparks; the front hero gains Static. | resists fire, lightning; weak frost (heat and haste) |
| Slag Slave `slag_slave` | foe | attacker | 1 | Chained to the anvil line: a chain swing; throws slag at the back (Burn). | none | resists fire; weak frost |
| Bronze Automaton `bronze_automaton` | foe | defender | 1 | Does not tire: piston punch; discharges its core (Static on every hero). | Clockwork (round start): its key turns down a notch; at the last notch it stops for a round unless it is wound. | immune lightning (the storm coil); resists physical; weak water |
| Arc-Smith `arc_smith` | foe | attacker | 1-2 | Welds with you: a hammer strike throws an arc into the hero (Static); an arc weld lands Volatile Burn, so Plasma on a hero who already carries Static. | none | resists fire, lightning; weak frost |
| Bellows Imp `bellows_imp` | foe | support | 3-4 | Keeps the forges breathing: fans the flames (every hero's Burn grows by 1, new effect close to the existing double); pecks at the back; flits (Dodge). | none | immune fire (hot air); weak physical (a punctured bellows) |
| Spark Swarm `spark_swarm` | foe | attacker | 1-2 | Struck from the anvil and never cooled: a burst of stinging sparks, short arcs jumping to the hero (Static and Burn in small doses). | Swarm: single-target hits deal less, hits on every foe deal more. | immune lightning; resists fire; weak water (sparks die) |
| Salamander `salamander` (new) | foe | attacker | 1-2 | The fire's own creature: a darting bite, and its blotches flare so the bitten hero burns. | none | immune fire (it lives in the fire now); weak frost |
| Mould-Sitter `mould_sitter` (new) | foe | defender | 1 | Cast from life: a heavy, stiff-armed blow with molten bronze dripping from the funnel (Burn); the bronze face's open mouth screams without sound (stress). | Clay mould: starts with Armor, and every hit cracks a piece away (it loses Armor per hit). Many small hits beat one big one. | resists fire, physical; weak frost (cold cracks hot clay) |
| Coke-Heaver `coke_heaver` (new) | foe | attacker | 1 | Feeds the furnaces: a shovel swing throws burning coke across the front two heroes (Burn). | none | resists fire, lightning; weak frost |
| Nail-Wife `nail_wife` (new) | foe | attacker | 1-2 | A swing of the bristling arm; nails break off and stay in the hero (Bleed). | Bristling (on hit): melee attackers take damage from the nails (Thorns). | resists fire, lightning; weak frost |
| Guild Warden `guild_warden` (new) | foe | afflicter | 2-3 | Keeps the guild's true measure: raps a guild mark into a hero (Mark and Burn); fines a hero (stress); checks a machine ally and restores its Armor. | none | resists fire, lightning; weak frost |
| Automaton Tender `automaton_tender` (new) | foe | summoner | 3-4 | Winds the automata every morning: winds a machine ally (it acts twice next round); winds a fallen Bronze Automaton back into an empty rank (once per fight); swings the crank key. | none | resists fire, lightning; weak frost |
| Hearth Cat `hearth_cat` (new) | foe | attacker | 1-2 | A spitting leap at the back and a scratch that discharges (Static). | Static coat (on hit): melee attackers gain Static. | resists fire, lightning; weak frost (haste) |

## 3. Rulers

Each ruler's signature is Plasma made large.

**The Anvil Titan** (foundry_boss)
- Phase 1, at the anvil: the count of three; the full blow on its chosen anvil; becomes the anvil (Fortified Block) every few rounds.
- Phase 2 (about half HP), the core splits and lightning spills from the seams: a plasma furnace (Static and Volatile Burn on every hero) every other round; rivets a back hero in place (Anchored).
- Phase 3 (about 20% HP), it leaves the anvil: the count is gone and every blow is Plasma, falling on the hero it struck last.
- Commission: "The Tooth is riveted into its chest as a maker's seal. The guild built it to strike forever. The Prior would like it to stop."

**The Crucible** (foundry_mould: the bell-casting hall, its crane chains fused)
- Phase 1, pouring: bronze waves on the front ranks; the bell fills on its count.
- Phase 2 (about half HP), it tips further: the wave reaches rank 3, and the fused chains spark (Static on every hero).
- Phase 3 (when the count completes, or about 20% HP), the bell is cast: the half-cast bell in the pit rings every round (stress to all) on top of the pour. Stopping pours early delays this phase.
- Commission: "It has been pouring the great bell since the storm struck, and the bell is not finished. Stop the pour before it is, and before the Crucible claims the Titan's Tooth for its own."

**The Storm-Catcher** (foundry_roof: the spire and its cables over the lead flats)
- Phase 1, holding on: marks one hero a round and strikes every other round.
- Phase 2 (about half HP), the cables sing: marks two heroes a round; sparks run down into his fists, and hits on him give the attacker Static.
- Phase 3 (about 20% HP), he lets go of one cable: the free cable whips across every rank each round, and the storm strikes all marks at once.
- Commission: "He caught the storm for the forges, and now it drifts out over the coast. Make him let go of it, and of his claim on the Titan's Tooth."

## 4. Encounter plan

Creatures in rank order, front first.

| # | Tier | Room | Creatures | Tactical idea |
|-|-|-|-|-|
| F1 | foe | foundry_floor | Slag Slave, Spark Swarm, Slag Slave | Static and Burn from every side: Plasma ignores Block, so Armor and Ward hold the line. |
| F2 | foe | foundry_floor | Bronze Automaton, Arc-Smith, Automaton Tender | Kill the Tender or the machine is wound back up; water cracks the machine. |
| F3 | foe | foundry_roof | Arc-Smith, Bellows Imp, Bellows Imp | The imps grow every Burn, the smith arcs it into Plasma: reach rank 3. |
| F4 | foe | foundry_mould | Mould-Sitter, Spark Swarm, Guild Warden | Multi-hit cracks the clay; the warden brands and fines from behind it. |
| F5 | foe | foundry_floor | Coke-Heaver, Nail-Wife, Hearth Cat | Thorns, Static and burning coke: melee heroes pay to hit; reach and courses do not. |
| F6 | foe | foundry_mould | Coke-Heaver, Salamander, Bellows Imp | Feeding the furnace: Burn stacks fast; frost the salamander and Ward the splash. |
| F7 | foe | foundry_roof | Nail-Wife, Salamander, Guild Warden | Brands and nails: the Mark tells you where the next Plasma lands. |
| F8 | foe | foundry_roof | Bronze Automaton, Hearth Cat, Bellows Imp, Automaton Tender | Four bodies and a rewind: hits on every foe, then the Tender. |
| E1 | elite | foundry_mould | The Sparkblind Smith, Mould-Sitter, Arc-Smith | He hits whoever played the most cards: split the work across heroes or Guard the loud one. |
| E2 | elite | foundry_roof | Talos Sentinel, Guild Warden, Bellows Imp | Bleed the heel: the vein doubles Bleed and stops its healing; the warden keeps its Armor up. |
| E3 | elite | foundry_roof | Nail-Wife, The Wire-Drawer, Spark Swarm | The whip reaches further each round: kill him before it reaches the back rank. |
| E4 | elite | foundry_floor | The Dray Horse, Slag Slave, Arc-Smith | Sparks off the hooves Static the front pair, and the smith's weld lands the Plasma: Swap the pair apart. |
| R1 | ruler | foundry_boss | Bronze Automaton, Automaton Tender, The Anvil Titan | The Tender winds the Titan too: kill her first; Taunt and Guard turn its blow off the hero it has chosen. |
| R2 | ruler | foundry_mould | Mould-Sitter, Spark Swarm, The Crucible | Frost and water stop pours and delay the bell; the front line takes every wave. |
| R3 | ruler | foundry_roof | Hearth Cat, Bellows Imp, The Storm-Catcher | Ward the marked heroes, Swap them away from Burned neighbours, and race him before he lets go. |

Rooms: World V has one ruler room (`foundry_boss`). The two rivals are placed in the regular rooms their lore names (the casting crane and bell pit in `foundry_mould`; the spire and its cables on `foundry_roof`). Those rooms have no ruler stage (the right 45% kept clear), so each needs a ruler variant, or the rivals fall back to `foundry_boss`.

## 5. What this world tests

- **Block builds.** Plasma ignores Block: a Bulwark that lives on Block (Last Bastion) fails here, while Armor (Ironwarden), Thorns (Thornguard) and Taunt still work. Alchemist healing and Ward (Elementalist, Oracle, Alchemist) carry the defence.
- **Formation.** Burn splash punishes clusters of Burned heroes; Swap and Bulwark Guard move heroes out of the splash, and the Storm-Catcher's marks are a pure positioning puzzle.
- **Momentum chains.** The Sparkblind Smith strikes whoever played the most cards: a Duelist chain (Momentum, Bladedancer) draws every blow, while Oracle Prime and spread plays dodge him.
- **Bleed and target priority.** Talos rewards the Bloodletter; the Automaton Tender rewards Duelist focus and Executioner finishers.
- **Course choice.** Machines ignore lightning and resist physical; water and frost undo most of the roster, so a company that brings only fire or lightning stalls.
- **Melee punishment.** Nail-Wife thorns and the Hearth Cat's Static coat favour reach, courses and Hexweaver curses over front-rank blades.
- **The Vessel** can take Static and Burn onto itself before they meet, defusing Plasma for the whole line.
