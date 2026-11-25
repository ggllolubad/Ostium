# World IX: The Hollow Barrow (role map)

Gate 2 draft, 2026-11-25. Sources: `world_IX_hollow_barrow.md`, `RIVAL_RULERS.md`, `afflictions.md`, Combat Rules v2, `tools/content/worlds.py`.

## 1. World

**The Hollow Barrow.** Courses: frost and toxin. Conjunction: **Cryo-rot** (max HP cut by its power for the rest of the fight). Door 9 (Act III), so the reference company is level 6 to 7 with its second path passive and two runes. Affliction: **Barrow Sickness** (gain 1 Toxin; this hero cannot be healed this round).

Cryo-rot does not kill; it shrinks. Each one takes max HP away for the rest of the fight, so healing has less to give back, Death's Door comes sooner, and Barrow Sickness shuts healing off on the round it is drawn. The barrow is a war of attrition the company must not let run long: the dead here come back (the King's court, the Dead-Cart's heap, a Chaplain's rites) and the cold keeps everything fresh. Prevention beats repair: Ward against the courses, Block against the blows, and burst to end the fight. Turned around, Cryo-rot is the company's tool against the big bodies, cutting a ruler's or a thane's max HP shortens the longest fights in the game so far. Most of the cast lives in both courses and resists them. Fire is the barrow's old answer, since it thaws what the cold keeps, but thawed plague bursts: several foes spill Toxin when burned or killed.

## 2. Roster

Rank footprint follows the design language: Small, Human and Large take 1 rank; "(2 ranks)" marks a body wide or long enough to fill two.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Barrow King (`barrow_king`) | ruler | attacker | 2 to 3 (2 ranks) | Seated with the sword across his knees: a sweep that spreads rot over ranks 1 and 2, the Long Winter on every hero, and later his court wakes in their graves. | Buboes under the frost: a fire hit bursts a bubo, putting Toxin on every hero. | Resists frost and toxin and physical (mail); weak to fire (at the cost of the trait) |
| The Rat King (`rat_king`, new) | ruler | attacker | 2 to 4 (3 ranks) | The mound surges forward to bury the front rank (heavy hit, Toxin); the living rats pour over the company in many small bites. | Always hungry: whenever any unit falls, hero or foe, it heals. Plague fleas: a hero who hits it in melee gains Toxin. | Resists frost and toxin; weak to fire |
| The Dead-Cart (`dead_cart`, new) | ruler | summoner | 2 to 4 (3 ranks) | The cart rolls forward as the heap's arms seize a hero and drag them up into it (Pulled to rank 1, Anchored, Toxin); it collects fallen foes and puts them back. | Calling for the dead: each foe that falls is taken onto the heap, giving the cart Block. | Resists frost and toxin; weak to physical (the buckled wheel and the starved horse) |
| Barrow Thane (`barrow_thane`) | elite | support | 1 to 2 | The flail of chains and frozen weights, a rotting cut (frost and Toxin), and the Oath that gives his household Might and Block. Answer move: Oath when the company has just killed one of his household. | Keeps them in line: while he lives, his allies cannot be Pushed, Pulled or moved out of their ranks. | Resists frost, toxin and physical (lamellar); weak to fire |
| Rot Witch (`rot_witch`) | elite | support | 3 to 4 | Hurls plague salts (Toxin and Hex on a hero), raises the dead (heals every ally), and lays a wasting curse (stress and Volatile Toxin on all). Answer move: Embalm cleanses the courses from the ally the company has been stacking. | Embalmer: while she lives, her allies' max HP cannot be cut (no Cryo-rot on them). | Resists toxin and frost; weak to fire |
| Barrow Chaplain (`barrow_chaplain`, new) | elite | defender | 2 to 3 | Strikes the frozen holy water across the field: every ally gains Block and every hero takes Toxin. Gives the last rites again. Answer move: rites over the hero at Death's Door (heavy stress). | Last rites: when a foe falls, every hero gains stress. | Resists frost and toxin; weak to void (holy rule) |
| Pest-House Watchman (`pest_house_watchman`, new) | elite | defender | 1 | The iron door-bar pins a hero in place (Stun); he nails the sick in. Answer move: bars the hero the company is healing (Stun and no healing this round). | The watch-box: the first hit each round strikes the box (heavy Block from the oak planks). | Resists frost and physical; weak to lightning (the iron bar and the nails) |
| Barrow Draugr (`barrow_draugr`) | foe | attacker | 1 | The grave axe on rank 1; a cold grip that Weakens. | None | Resists frost and toxin; weak to physical (brittle frozen bone) |
| Plague Wolf (`plague_wolf`) | foe | attacker | 1 to 2 | A plague bite (Toxin), a pack hunt on the back rank, a howl for stress. Stress dealer. | None | Resists toxin and frost; weak to lightning |
| Frostbitten Leper (`frostbit_leper`) | foe | afflicter | 2 to 3 | Rings the bell: stress on every hero; an unclean touch puts frost and Toxin on one hero (a Cryo-rot setup). Stress dealer. | None | Resists toxin and frost; weak to physical (frostbitten fingers fall off) |
| Mould Wight (`mold_wight`) | foe | support | 2 to 3 | A spore shroud gives allies Regen; grave chill heavily Weakens rank 1; a smothering claw. | None | Immune toxin (it is made of mould); resists frost and physical; weak to fire |
| Grave Worm (`grave_worm`) | foe | attacker | 3 to 4 | Burrows up under the back rank, then feeds (damage that heals it, Toxin). | None | Resists toxin; weak to physical |
| Gravedigger (`gravedigger`, new) | foe | afflicter | 2 to 3 | Digs a grave for the most wounded hero: Marked, and foes hit it harder; the spade's edge otherwise. | None | Resists frost and toxin; weak to fire |
| The Swollen (`the_swollen`, new) | foe | afflicter | 1 to 2 | A walking hazard: the laundry beetle on rank 1, and the great bubo waiting to burst. | On death: the bubo bursts: Toxin on every hero, more if she was killed by fire. | Resists frost; weak to fire (the thaw she waits for) |
| Court Fool (`court_fool`, new) | foe | afflicter | 3 to 4 | Tells the only joke he remembers: stress on every hero, a little worse each round he is left alone. Stress dealer. | Round start: the joke builds unless he was hit last round. | Resists frost and toxin; weak to void (the joke is all he remembers) |
| The King's Hawk (`kings_hawk`, new) | foe | attacker | 3 to 4 | A bating lunge to the end of the leash: the swollen talons rake a hero (Toxin). | Hooded: it strikes the hero who acted last in the previous round. | Resists frost; weak to lightning (the silver rings and bells) |
| Sexton Beetles (`sexton_beetles`, new) | foe | afflicter | 1 to 2 | The swarm pours over a hero's feet: Toxin, and the hero is slowed (acts last this round). | Flock: single-target hits deal reduced damage; hits on every foe deal full. | Resists toxin; weak to frost (the cold has slowed them) |
| Barrow Mason (`barrow_mason`, new) | foe | defender | 1 | Walls a hero in (Stun) and lays a stone before an ally (Block); a mallet blow otherwise. | None | Resists frost and physical; weak to water (the mortar) |
| Rat-Catcher (`rat_catcher`, new) | foe | afflicter | 2 to 3 | Swings the rat pole: plague fleas shake over a hero (Toxin), and the bitten hero cannot be healed next turn. | None | Resists frost and toxin; weak to physical |

## 3. Rulers

**The Barrow King** (`barrow_boss`, with a Barrow Draugr in rank 1; rank 4 left for his court).
- Phase 1, on the Grave-Throne (full HP to about two thirds): opens with the Long Winter (frost and stress on every hero). Then the rotting sweep on ranks 1 and 2, and Barrow Shield (Block and Thorns) when hurt.
- Phase 2, the Court Wakes (to about a quarter): Summon the Court calls Barrow Draugr up from the graves into empty ranks (twice per fight at most). Plague of Kings, the signature: frost and Toxin on every hero, so Cryo-rot lands company-wide.
- Phase 3, the Flesh Splits (below a quarter): the plague pours out. Toxin on every hero each turn, and he stands to swing the royal axe at rank 1 every other turn.
- Commission: "He sealed his kingdom in to stop the plague. The Tooth is the seal on his signet; the Riven Jarl wore a copy. Unseal the barrow long enough to take it."

**The Rat King** (proposed room `barrow_nest`, the rats' nest of grave goods under the hall; until it is built, `barrow_tomb`). Sexton Beetles in rank 1.
- Phase 1, the Mound (to about half): it rolls forward to bury rank 1 (heavy hit, Toxin), and the seethe puts Toxin on every hero. Every fall feeds it.
- Phase 2, Breaking Apart (to about a fifth): the frozen dead rats fall away. It hits softer and loses its plague-flea trait, but the living rats pour over every hero in many small bites (Bleed).
- Phase 3, the Knot (below a fifth): only the plaited core of tails is left, fast and desperate: two attacks a turn, and it eats whatever falls.
- Commission: "Thousands of rats fed on the buried kingdom until they froze into one, and it is gnawing toward the Tooth. Get there first."

**The Dead-Cart** (proposed room `barrow_road`, the cart's round between the mounds; until it is built, `barrow_mound`). Rank 1 starts empty for the risen.
- Phase 1, Calling for the Dead (to about two thirds): opens with the carter's rattle (stress on every hero). Then the heap's arms seize a hero (Pull, Anchored, Toxin) and the cart takes every fallen foe onto the heap.
- Phase 2, It No Longer Waits (to about a quarter): it seizes the hero with the least HP left. Raise from the Heap puts a fallen foe back into rank 1 at low HP (twice per fight at most).
- Phase 3, the Horse Falls (below a quarter): the horse buckles and the cart stops (no more Pulls), and the heap spills: frost and Toxin on every hero each turn.
- Commission: "It went round the barrow calling for the dead. It no longer waits for them to finish dying, and it is coming for the living. Stop the cart."

## 4. Encounter plan

Rooms: `barrow_mound` (the field of grave mounds, the road, the lepers' path), `barrow_tomb` (the vault of burial niches and the witch's embalming slab), `barrow_hall` (the household's buried hall, the funeral feast still laid). Creatures listed from rank 1.

| Group | Creatures (rank 1 first) | Room | Tactical idea |
|---|---|---|---|
| The Mound Road | Barrow Draugr, Plague Wolf, Plague Wolf | `barrow_mound` | The wolves hunt the back rank and howl; the Draugr holds. Cover the rear and end it fast. |
| The Leper Path | Barrow Draugr, Frostbitten Leper, Frostbitten Leper | `barrow_mound` | Two bells of stress and two Cryo-rot touches; kill the lepers before the max HP cuts pile up. |
| The Mould Vault | Sexton Beetles, Mould Wight, Grave Worm | `barrow_tomb` | The Wight's Regen keeps the beetles and worm up; burn or burst the Wight first. |
| The Burial Hall | Barrow Draugr, Mould Wight, Court Fool | `barrow_hall` | The Fool's joke grows each round he is ignored; one cheap hit a round on him holds it back. |
| New Graves | The Swollen, Gravedigger, Rat-Catcher | `barrow_mound` | The Gravedigger Marks the weakest and the Rat-Catcher blocks its healing; kill the Swollen without fire if the company is low. |
| The Walled Door | Barrow Mason, The Swollen, Frostbitten Leper | `barrow_hall` | The Mason Stuns and shields the Swollen; Push her back before she bursts, or kill her last. |
| The Niches | Rat-Catcher, Sexton Beetles, Grave Worm | `barrow_tomb` | Slowed heroes act last and the worm heals on its bites; burst order matters more than total damage. |
| The Dais | Barrow Mason, Court Fool, The King's Hawk | `barrow_hall` | The blind hawk strikes whoever acted last; put a sturdy hero at the end of the Ordo. |
| The Thane's Barrow (elite) | Barrow Draugr, Barrow Thane, Court Fool | `barrow_hall` | His household cannot be moved, so push and pull plans fail; killing one of them triggers his Oath. |
| The Witch's Tomb (elite) | Barrow Draugr, Grave Worm, Rot Witch | `barrow_tomb` | While she lives nothing of hers can be Cryo-rotted and she heals all; she is the target. |
| The Chaplain's Rites (elite) | The Swollen, Gravedigger, Barrow Chaplain | `barrow_tomb` | Every death costs the company stress and his holy water shields his flock; kill him before the rest, with void if you have it. |
| The Pest-House (elite) | Pest-House Watchman, Frostbitten Leper, Rat-Catcher | `barrow_mound` | He bars the hero being healed and the fleas block healing too; plan defence before damage, not repair after. |

## 5. What this world tests

- **Healing and sustain:** max HP cuts, Barrow Sickness, the Rat-Catcher and the Watchman all blunt healing, so Alchemist Apothecary and other repair builds must turn to prevention (Ward, Block, cleanse).
- **Toxin builds:** almost everything here resists Toxin and the Mould Wight is immune; Alchemist Plaguewright and Toxin riders must pivot to Cryo-rot setups or other courses.
- **Self-harm builds:** Hexweaver Pactbound and any card that spends HP pays more when max HP shrinks.
- **Burst against revival:** the Dead-Cart's heap, the King's court, the Rat King's feeding and the Chaplain's rites reward ending fights over grinding them; Duelist Executioner and big finishers shine.
- **Stress:** bells, jokes, rites and howls make this the heaviest stress world of Act III; resolve tools and the Rallying virtue matter.
