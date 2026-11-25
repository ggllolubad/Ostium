# Battle rooms, round 2: brief (director, 2026-11-24)

## What Cole asked for
- The first rooms' vibe and art direction are OK. Detail and finish will rise; that is expected of you.
- Each world gets **3 regular battle rooms that are distinctly different from one another and explore different parts of the world**.
- Plus **1 boss room per boss**, unique, **special, grand, and fitting the boss's lore**. (World I has 3 bosses, so 3 boss rooms.)

## Room names (the game loads rooms by these names; keep them exact)
The game data (`data/worlds.json`, `data/encounters.json`) already names 3 rooms per world. The regular rooms keep those names. Each boss gets a new boss room. The full table, with the encounters each room hosts, is in `scenes/_rooms_table.md` (encounter text = what the player is told is in that room: design the room so those fights make sense there). Room 1 was built last round; where its name differs from the game's name, rename it (rebuild with the new key; delete nothing, leave the old outputs in place and note it).

## Distinctness (the main ask). For each world, the 3 regular rooms must differ in ALL of:
1. **Place:** a different part of the world, from the world's bible (`bible/world_<roman>_*.md`): its history, its people, its places. Not three views of the same building.
2. **Kind of space:** e.g. one enclosed interior, one open exterior, one underground/under-structure, or water-level vs high vs deep. Different scale of space (tight vs vast).
3. **Light and time:** different light source and key (daylight, dusk, firelight, cold glow, storm light, darkness with one lamp). Different weather/air where the world allows.
4. **Dominant shapes:** different architecture or terrain silhouettes and rhythm (verticals vs horizontals vs curves; built vs natural).
5. **Palette key:** stay inside the world palette, but shift the key (warm vs cold side, light vs dark key).
A one-line test: shown the three rooms as thumbnails, a player should tell them apart instantly and still know they are the same world.
Write a table per world (room, place, kind of space, light, shapes, palette key) in your notes BEFORE you build, and check it after.

## Boss rooms: special and grand
- The boss room is the place in the world where that boss belongs by its lore (read the boss's bible entry and lore line; the boss's figure is in the bestiary and `out/worlds/`). It should feel like the climax of the world: larger scale architecture or terrain, a strong centrepiece tied to the boss, the most dramatic light in the world, a deliberate composition that frames the boss.
- **Composition for a huge boss:** rulers are drawn at 3.5x to 5x human scale and are cropped by the frame. Keep the right 45% of the frame as the boss's stage: a backdrop that frames a giant (an apse, a gate, a cliff, a throne recess, a void tear), uncluttered behind its silhouette. Heroes still stand left at the normal fighter band (feet y 430). Check with the real boss render placed at true scale.
- The boss room must not look like a reskinned regular room. Different space, different light, its own unique props.
- Boss rooms use the same three layers (far/mid/fore) as every room; do not add layers.

## Director notes on the first 15 rooms (apply to the upgrades AND to every new room)
1. **They read as flat stage sets:** one wall parallel to the picture plane with a floor band. Every room needs at least three readable depth planes in the far layer (near structure, middle, distance) with overlaps, and atmospheric recession (farther = lower contrast, shifted toward the world's air colour).
2. **Value plan:** one clear light focus above or behind the fighter band (a lit opening, fire, sky glow, a beam), dark frame edges. No uniform mid grey.
3. **Shapes:** break simple geometric silhouettes (low-poly faceted rock, cone spires, perfect cone tents, Y-fork trees, disc mushroom caps, identical repeated arches or windows). Vary size, spacing, rhythm.
4. **Fore layer:** each room gets a foreground framing element on at least one side and/or the top, different per room.
5. **Floors:** perspective cues (cracks, puddles, joints, debris converging to the horizon), not flat horizontal bands.
Per-room notes for upgrading room 1:
- I nave: arches all identical; deepen the view through the arcade into the aisle and beyond. II mire_hut: huts flat and parallel, clouds repeat, boardwalk flat. III baths_pool: least dramatic, flat pink; steam depth, pool edge in perspective, the apse as the light focus. IV pits_shaft: low-poly rock, murky, weak lamp warmth. V foundry_mould: the bell crown reads as a dome, brick wall flat, windows repeat. VI coast_cliffs: wreck reads as whale ribs, ledges linear, plain sand. VII fleet_ice: hulls boxy, gunports read as boxes. VIII (to rime_crevasse): low-poly facets, the obsidian flow is a vase shape, crack reads as a glowing branch. IX barrow_hall: roof reads as shingles, the dead on the benches invisible. X (to hive_spires): spires a field of similar cones, clouds as stripes. XI (to spire_orrery): dome curve weak, ribs straight poles. XII (to silence_tundra): tents perfect cones (keep the minimal near-white world). XIII pyre_nave: generic arcade; black flames read as spikes. XIV (to garden_hedge): Y-fork trees, disc caps, void cut-outs as splats. XV (to sky_ruins): lost-leaf flakes as black blobs, loud gold column at left.

## Rules (unchanged)
Contract of `out/scenes/pilot/nave.camera.json`: 1480 x 480 viewBox, `<room>_far.svg` opaque (flatten with `scenes/opaque_far.py`), `<room>_mid.svg`, `<room>_fore.svg` transparent, PNGs at 2x (2960 x 960), the battle camera (horizon 300, eye 1.2 m, focal 652, cx 740, fighters at 6 m, feet y 430, a 1.0 human 190 px at 1x), `<room>.camera.json`. Quiet zone y 230-430 (far steps toward murk, mid only low dark low-contrast things). No lightning arcs or bolts drawn anywhere (scorch, fused metal, rain, wet light instead). Eye motifs only in void worlds (I, XII, XIII, XIV, XV). Void = irregular clean-rimmed absence, never circle clusters or glow blobs (use `tornVoid`). Gold only on holy things and money. Red only for blood, doom and rubric. No flat fills; no regular brick tiling. True scale. XV: Void's betrayal of the Mother of Courses tore the sky; there was NO war of gods (no battlefield imagery, no armies). The abbey's church bell is the Bell Below (World I belfry boss room is where it hangs/rings).
Do not edit frozen figure files (engine.js, body.js, gear.js, kit.js, render.js at party root, render_rig.js, posetest.py) or `lik.js` behaviour. Kits: `battle_li.js` (I-VII author) and `battle_kit_b.js` (VIII-XV author) may be required by anyone; do NOT edit a kit file you did not create in this round. Put new shared helpers in your own new file `scenes/battle_kit_<yourgroup>.js`. Only write room files for your own worlds.

## Process per room
Plan table first. Build, render, compose a preview with 4 heroes and 3 of the room's actual encounter foes (boss rooms: the boss at true scale plus its companion from the encounter) at true scale. Look at it with the Read tool at full width and at 0.5x, critique as a strict art director (lore at a glance? depth planes? light focus? distinct from the world's other rooms? cartoon shapes, repeats, flat areas?), fix, repeat until it holds. Then a per-world sheet showing all of the world's rooms side by side (to judge distinctness) at `out/scenes/battle/<roman>/world_<roman>_rooms.png`.
Outputs: `out/scenes/battle/<roman>/<room>_{far,mid,fore}.svg/png`, `<room>.camera.json`, `<room>_preview.png`. Notes: `scenes/NOTES_battle_<yourgroup>.md` (plan tables, lore per room, weak spots). Report back with paths and an honest weak-spot list. Do not upload anything.

### World I (drowned)
- Room 1 (built, upgrade it): nave (bg_drowned_nave.js)
- Room `stair`: [foe] The Flooded Stair: Two drowned thralls shamble up from the nave. (thrall, thrall); [foe] The Eel Pools: Things that bite, and keep biting. (eelkin, lamprey, eelkin); [elite] The Grasping Deep: The floor gives way to something enormous. (kraken_arm, eelkin)
- Room `belfry`: [foe] The Drowned Belfry: A boy still singing, a ringer still ringing. (bellringer, choirboy, thrall)  [BOSS ROOM: [boss] The Bell Below: Boss. The bell that rings for the drowned. (bell_below)]
- Room `nave`: [elite] The Sunken Nave: The Tidewarden keeps the Siren's song. (warden, siren); [foe] The Barnacle Gate: A knight of the drowned order and what lives in his shadow. (barnacle_knight, crab); [elite] The Abbess Holds Court: Salt sermon in a drowned chapter house. (abbess, weeping_nun)
- Room `ossuary`: [foe] The Ossuary Tide: Bones, a swollen body, and a fisherman. (bloated, thrall, hookline); [foe] The Weeping Cloister: The sisters mourn. The brute keeps the door. (anchor_brute, weeping_nun, choirboy); [elite] The Pearl Diver: It goes for the ones at the back. (hookline, pearl_diver)
- Room `throne`: (only boss fights here now)  [BOSS ROOM: [boss] Mother of Brine: Boss. The siren-matriarch and her daughter. (siren, mother_of_brine); [boss] The Drowned King: Boss. The king, and his last loyal knight. (barnacle_knight, drowned_king)]
- Boss room(s): drowned_king -> boss room "throne" | bell_below -> boss room "belfry" | mother_of_brine -> NEW boss room "brine_grotto"

### World II (mire)
- Room 1 (built, upgrade it): mire_hut (bg_mire_hut.js)
- Room `mire_bog`: [foe] The Sunken Path: Bodies in the peat. (bog_body, bog_body, leech_swarm); [foe] The Peat Cutting: The hags put their dead to work. (bog_body, fen_hag, mire_toad); [elite] Under the Bridge: Something heavy in the mud. (leech_swarm, bog_troll)
- Room `mire_hut`: [foe] The Hag's Porch: A hag and her pets. (mire_toad, fen_hag); [elite] The Coven: The hags gather. (fen_hag, coven_mother)
- Room `mire_drown`: [foe] The Still Water: A log in the water. (fen_lurker, leech_swarm)  [boss fights moving out: [boss] The Mire Mother: Boss. The fen's mother. (bog_body, mire_mother)]
- Boss room(s): mire_mother -> mire_boss

### World III (baths)
- Room 1 (built, upgrade it): baths_pool (bg_baths_pool.js)
- Room `baths_pool`: [foe] The Tepidarium: Attendants still tending guests who will not leave. (scalded_attendant, scalded_attendant, bath_leech); [foe] The Hot Pools: Crabs boiling in the shallows, a brute in the deep end. (kettle_crab, boiled_brute); [elite] The Mistress Receives: The Bath-Mistress and her attendant. (scalded_attendant, bath_mistress)  [boss fights moving out: [boss] The Simmering Matron: Boss. The matron in her great pool. (steam_nymph, simmering_matron)]
- Room `baths_furnace`: [foe] The Steam Rooms: Nymphs in the steam. You hear them before you see them. (steam_nymph, scalded_attendant, steam_nymph); [elite] The Furnace Stair: The bearer comes up from the furnace. (kettle_crab, cauldron_bearer)
- Room `baths_cistern`: [foe] The Drained Cistern: Leeches in the sludge, and the brute who fed them. (bath_leech, boiled_brute, bath_leech)
- Boss room(s): simmering_matron -> baths_boss

### World IV (pits)
- Room 1 (built, upgrade it): pits_shaft (bg_pits_shaft.js)
- Room `pits_shaft`: [foe] The Upper Gallery: Miners still working the seam. (gas_miner, gas_miner, pit_crawler); [elite] The Powder Store: An ogre among the kegs. (fuse_imp, powder_ogre)
- Room `pits_vent`: [foe] Toad Pool: Toads in the sulphur, and an imp with a torch. (brimstone_toad, fuse_imp); [foe] The Deep Seam: Crawlers in the dark, toads in the vents. (pit_crawler, brimstone_toad, pit_crawler)  [boss fights moving out: [boss] The Burning Lung: Boss. The mine breathes. (gas_miner, burning_lung)]
- Room `pits_chapel`: [foe] The Canary Chapel: The priests sing to the gas. (canary_priest, gas_miner, fuse_imp); [elite] The Choking Chapel: The matriarch hangs over the altar. (canary_priest, miasma_matriarch)
- Boss room(s): burning_lung -> pits_boss

### World V (foundry)
- Room 1 (built, upgrade it): foundry_mould (bg_foundry_mould.js)
- Room `foundry_floor`: [foe] The Anvil Line: Slaves at the hammers, sparks everywhere. (slag_slave, spark_swarm, slag_slave); [foe] Bronze Watch: An automaton and the smith who keeps it running. (bronze_automaton, arc_smith)  [boss fights moving out: [boss] The Anvil Titan: Boss. The foundry's first and worst work. (bronze_automaton, anvil_titan)]
- Room `foundry_roof`: [foe] The Bellows Roof: Imps working the great bellows under the storm. (bellows_imp, bellows_imp, arc_smith); [elite] Talos at the Gate: A bronze giant, with its heel to the wall. (bellows_imp, talos_sentinel)
- Room `foundry_mould`: [foe] The Casting Pit: Molten bronze and the things that tend it. (spark_swarm, bronze_automaton, slag_slave); [elite] The Master Smith: The cyclops at its great anvil. (arc_smith, cyclops_smith)
- Boss room(s): anvil_titan -> foundry_boss

### World VI (coast)
- Room 1 (built, upgrade it): coast_cliffs (bg_coast_cliffs.js)
- Room `coast_cliffs`: [foe] The Wreckers' Cliff: The lamps are lit. (wrecker, wrecker, drowned_bosun); [foe] The Harpy Rocks: They ride the storm down. (storm_harpy, storm_harpy, wrecker); [elite] The Matron's Roost: The crowned harpy and her brood. (storm_harpy, harpy_matron)
- Room `coast_cove`: [foe] The Eel Shallows: Things that bite and things that shock. (shock_eel, tide_crab, shock_eel); [foe] The Wreck: The bosun and his new crew. (drowned_bosun, tide_crab)  [boss fights moving out: [boss] The Thunder Whale: Boss. The storm sings. (shock_eel, thunder_whale)]
- Room `coast_light`: [elite] The Lighthouse: The keeper tends the false light. (wrecker, lighthouse_keeper)
- Boss room(s): thunder_whale -> coast_boss

### World VII (fleet)
- Room 1 (built, upgrade it): fleet_ice (bg_fleet_ice.js)
- Room `fleet_deck`: [foe] The Frozen Deck: Whalers at their stations, frozen to the rails. (frozen_whaler, deck_hand, frozen_whaler); [foe] Gull Rookery: The gulls have the rigging. (rime_gulls, rime_gulls, deck_hand)
- Room `fleet_ice`: [foe] The Ice Holes: Eels under the ice, a walrus on top. (ice_eel, walrus_brute); [elite] The Selkie's Floe: She is singing on the ice. (rime_gulls, frost_selkie)  [boss fights moving out: [boss] The Leviathan in the Ice: Boss. The sea itself is frozen around it. (frozen_whaler, leviathan_ice)]
- Room `fleet_hold`: [foe] The Orlop Deck: Down in the hold, the crew is still at work. (deck_hand, ice_eel, frozen_whaler); [elite] The Captain's Cabin: The captain and his wife, the sea. (deck_hand, icewed_captain)
- Boss room(s): leviathan_ice -> fleet_boss

### World VIII (rime)
- Room 1 (built, upgrade it): rime_breach -> RENAME to rime_crevasse
- Room `rime_glacier`: [foe] The Cracked Floe: Thralls hacking at the ice. Something moves beneath it. (rime_thrall, fissure_worm); [elite] Two-Faced Oracle: She speaks in fire and frost. (magma_hound, twin_seeress)
- Room `rime_crevasse`: [foe] Vent Hounds: The hounds nest where the magma breathes. (magma_hound, magma_hound, rime_thrall); [foe] Steam and Stone: Rising heat, falling ice. (steam_wraith, rime_thrall, fissure_worm)
- Room `rime_hall`: [foe] The Glass Gate: A shieldmaiden holds the hall. The steam behind her is watching. (obsidian_maiden, steam_wraith); [elite] The Thane's Hall: A giant at the hearth, and his shieldmaiden. (obsidian_maiden, jotun_thane)  [boss fights moving out: [boss] The Riven Jarl: Boss. The lord of the split glacier. (obsidian_maiden, riven_jarl)]
- Boss room(s): riven_jarl -> rime_boss

### World IX (barrow)
- Room 1 (built, upgrade it): barrow_hall (bg_barrow_hall.js)
- Room `barrow_mound`: [foe] The Mound Road: Wolves among the grave mounds. (plague_wolf, plague_wolf, barrow_draugr); [foe] The Leper Path: Bells in the snow. (frostbit_leper, barrow_draugr, frostbit_leper)
- Room `barrow_tomb`: [foe] The Mould Vault: Wights and worms in the grave-rot. (mold_wight, grave_worm); [elite] The Witch's Tomb: She is tending the dead. (grave_worm, rot_witch)
- Room `barrow_hall`: [foe] The Burial Hall: The household, still at the table. (barrow_draugr, mold_wight, frostbit_leper); [elite] The Thane's Barrow: A lord with his household. (barrow_draugr, barrow_thane)  [boss fights moving out: [boss] The Barrow King: Boss. The king of the sealed kingdom. (barrow_draugr, barrow_king)]
- Boss room(s): barrow_king -> barrow_boss

### World X (hive)
- Room 1 (built, upgrade it): hive_road -> RENAME to hive_spires
- Room `hive_spires`: [foe] The Outer Spires: Wasps drifting between the towers. (spire_wasps, puppet_host, spire_wasps); [foe] The Web Fields: Spiders wait where the lightning falls. (venom_spider, venom_spider, galvanic_beetle); [elite] The Duelling Ground: The mantis bows. (hive_drone, mantis_duelist)
- Room `hive_comb`: [foe] The Comb: Drones and the hosts they feed. (hive_drone, puppet_host, hive_drone); [foe] The Beetle Gallery: Beetles crackling in the comb. (galvanic_beetle, venom_spider)
- Room `hive_brood`: [elite] The Brood Chamber: Something enormous with something small on its back. (venom_spider, brood_mother)  [boss fights moving out: [boss] The Hive Queen: Boss. The heart of the hive. (spire_wasps, hive_queen)]
- Boss room(s): hive_queen -> hive_boss

### World XI (spire)
- Room 1 (built, upgrade it): spire_dome -> RENAME to spire_orrery
- Room `spire_orrery`: [foe] The Observatory Floor: Pilgrims stand frozen before the orrery. (stopped_pilgrim, stopped_pilgrim, gear_spider); [foe] The Gear Loft: Spiders mending the works. (gear_spider, clock_sentry, gear_spider)
- Room `spire_stair`: [foe] The Clockwork Stair: Sentries mark time on every landing. (clock_sentry, frozen_halberdier); [elite] The Horologist's Study: He has been waiting for you, for ever. (frozen_halberdier, horologist)
- Room `spire_top`: [foe] Aurora Gallery: Moths drawn to the frozen stars. (aurora_moth, aurora_moth, stopped_pilgrim); [elite] The Founder Stands: Someone wound up the statue. (aurora_moth, rime_colossus)  [boss fights moving out: [boss] The Last Hour: Boss. One minute to midnight. (clock_sentry, last_hour)]
- Boss room(s): last_hour -> spire_boss

### World XII (silence)
- Room 1 (built, upgrade it): silence_camp -> RENAME to silence_tundra
- Room `silence_tundra`: [foe] The Open Tundra: Wanderers in the snow. (hollow_wanderer, hollow_wanderer, rime_shade); [foe] The Stag's Path: It makes no sound. (silence_stag, hollow_wanderer); [elite] The Hunt: It found you first. (silence_stag, pale_hunter)
- Room `silence_shrine`: [foe] The Frozen Shrine: Saints and the eyes that watch them. (frozen_saint, starless_eye, frozen_saint)  [boss fights moving out: [boss] The Cold Star: Boss. The black star comes down. (frozen_saint, cold_star)]
- Room `silence_rift`: [foe] The Rift Edge: Shades at the edge of the rift. (rime_shade, starless_eye, rime_shade); [elite] The Last Herd: The mammoth and its shade. (rime_shade, void_mammoth)
- Boss room(s): cold_star -> silence_boss

### World XIII (pyre)
- Room 1 (built, upgrade it): pyre_nave (bg_pyre_nave.js)
- Room `pyre_nave`: [foe] The Penitents' Walk: They flog themselves down the nave. (ash_penitent, ash_penitent, censer_deacon); [foe] The Black Choir: The deacon swings its censer; the knight keeps time. (pyre_knight, censer_deacon)  [boss fights moving out: [boss] The Saint Unending: Boss. She is still burning. (censer_deacon, saint_unending)]
- Room `pyre_stake`: [foe] The Stake Field: Hounds sniff the ashes of the burned. (cinder_hound, cinder_hound, ash_penitent); [elite] The Fallen Seraph: It came to put out the fire. (candle_wraith, pyre_seraph)
- Room `pyre_crypt`: [foe] Candle Crypt: A knight keeps the candles burning. (candle_wraith, pyre_knight, candle_wraith); [elite] The Tribunal: The inquisitor reads your names aloud. (pyre_knight, unburnt_inquisitor)
- Boss room(s): saint_unending -> pyre_boss

### World XIV (garden)
- Room 1 (built, upgrade it): garden_walk -> RENAME to garden_hedge
- Room `garden_grove`: [foe] The Overgrown Path: Husks among the mushrooms. (fungal_husk, fungal_husk, root_horror); [foe] The Deer Glade: They graze on the spores. (spore_deer, spore_deer, moth_witch); [elite] The Dead Oak: Her oak is dead. She is not. (spore_deer, blight_dryad)
- Room `garden_hedge`: [foe] The Hedge Maze: A knight guards the turning. (thorn_knight, moth_witch); [elite] The Gardener's Shed: He is pruning. (fungal_husk, the_gardener)
- Room `garden_heart`: [foe] The Root Cellar: The roots have mouths. (root_horror, fungal_husk, thorn_knight)  [boss fights moving out: [boss] The Antlered Mother: Boss. The garden's heart. (thorn_knight, antlered_mother)]
- Boss room(s): antlered_mother -> garden_boss

### World XV (sky)
- Room 1 (built, upgrade it): sky_throne -> RENAME to sky_ruins
- Room `sky_ruins`: [foe] The Floating Steps: Angels guard what is left of the stair. (fallen_angel, storm_shade, fallen_angel); [foe] The Host's Last Stand: A knight and the lightning he serves. (skywreck_knight, storm_shade, fallen_angel)  [boss fights moving out: [boss] The Shattered God: Boss. A god, broken. (skywreck_knight, shattered_god)]
- Room `sky_gate`: [foe] The Tear: Hounds come through the rift. (rift_hound, rift_hound, choir_of_eyes); [elite] Between the Stars: Something swims through the tear. (rift_hound, rift_leviathan)
- Room `sky_choir`: [foe] The Broken Choir: The eyes are singing. (choir_of_eyes, skywreck_knight); [elite] The Seraph's Watch: It is holding the sky together. (fallen_angel, thunder_seraph)
- Boss room(s): shattered_god -> sky_boss