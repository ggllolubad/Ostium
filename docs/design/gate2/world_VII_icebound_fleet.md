# World VII: The Icebound Fleet (role map)

Gate 2 draft, 2026-11-25. Sources: `world_VII_icebound_fleet.md`, `RIVAL_RULERS.md`, `afflictions.md`, Combat Rules v2, `tools/content/worlds.py`.

## 1. World

**The Icebound Fleet.** Courses: frost and water. Conjunction: **Freeze** (a foe loses its next action, and the next physical hit shatters it for bonus damage; a hero has only its kit skill for 1 round). Door 7 (Act III), so the reference company is level 6 to 7 with its second path passive and two runes. Affliction: **Frostbite** (gain 2 Weaken).

Freeze is action denial. The fleet's crews Soak and chill the company, then land Freeze on the hero who matters most that round, leaving it a kit skill and nothing else. Weaken comes from every direction (the cast, the rulers, Frostbite in the deck), and Weaken costs a point on every hit, so many small hits suffer most. Turned around, Freeze is the company's best tool here: a frozen foe loses its turn and the next physical blow shatters it, so a course hero sets up and a Bulwark or Duelist cashes in. The fleet is also a crew: boys load guns, cooks feed, surgeons patch, officers command. Kill order decides most fights.

## 2. Roster

Rank footprint follows the design language: Small, Human and Large take 1 rank; "(2 ranks)" marks a body wide or long enough to fill two.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Leviathan in the Ice (`leviathan_ice`) | ruler | attacker | 2 to 4 (3 ranks) | The eye follows one hero under the ice; White Breath Soaks and chills the company, then the jaw breaks up through the ice and swallows a frozen hero. | The eye follows: at round start it fixes one hero (shown), and its single-target moves go to that hero. | Immune frost (it froze the sea); resists water; weak to lightning |
| The Broadside (`the_broadside`, new) | ruler | attacker | 2 to 4 (3 ranks) | Ice in the barrels drives the shot out port by port: a ripple of frost-bursts down the company. | Ripple fire: its broadside hits every hero, rank 1 hardest, less at each rank behind. | Resists frost and water; weak to fire (thaw the ice that fires the guns) |
| The Shrouds (`the_shrouds`, new) | ruler | summoner | 2 to 4 (3 ranks) | Topmen let go and drop onto a hero, marlinspike first, then are hauled back up; later the lowest are cut loose to fight on the ice. | Hanging web: cannot be moved or Stunned. | Resists frost and water; weak to physical (ropes frozen brittle as glass) |
| The Ice-Wed Captain (`icewed_captain`) | elite | support | 2 to 3 | Commands the crew (All Hands), cuts with the icicle sabre, keelhauls the rear hero forward. Answer move: Belay That removes the company's strongest buff. | Round start: Command: allies next to him keep their Block (Fortify). | Resists frost and water; weak to lightning |
| Frost Selkie (`frost_selkie`) | elite | afflicter | 1 to 2 | The sealskin song deals heavy stress; lunge and bite; slips the stolen skin to heal and dodge. Answer move: sings louder against a hero at high stress. | Stolen skin: the first hit each round against her deals reduced damage. | Resists water and frost; weak to lightning |
| The White Bear (`white_bear`, new) | elite | attacker | 1 to 2 (2 ranks) | A lunge and a downward forepaw that drives a hero into the ice (heavy hit, Anchored). Answer move: swipes the hero who froze it. | Climbed out anyway: the first time each fight it is Frozen, it breaks free at once and gains Might. | Resists frost and water; weak to fire |
| The Ship's Surgeon (`ships_surgeon`, new) | elite | afflicter | 2 to 3 | Saws at the hero with the most Weaken: Bleed, and Freeze if that hero is Soaked; ties a tourniquet on a wounded ally. Answer move: targets the hero the company is healing. | On ally death: he heals the most wounded remaining ally. | Resists frost and water; weak to toxin (his bottle of spirit) |
| Frozen Whaler (`frozen_whaler`) | foe | attacker | 2 to 3 | The harpoon on its line drags the rearmost hero forward a rank; the flensing knife waits for whoever arrives. | None | Resists frost; weak to fire |
| Rime Gulls (`rime_gulls`) | foe | afflicter | 3 to 4 | Peck the eyes of the back rank in many small hits; the mob adds stress and Vulnerable. Stress dealer. | Flock: single-target hits deal reduced damage; hits on every foe deal full. | Resists frost; weak to physical |
| Ice Eel (`ice_eel`) | foe | attacker | 2 to 3 | Strikes from a hole in the ice (Weaken), wraps (Soak), dives when hurt. Sets up Freeze for others. | None | Resists frost and water; weak to lightning |
| Drowned Deckhand (`deck_hand`) | foe | attacker | 1 | Cutlass cuts; the shanty lifts the crew (Might) and unsettles the company (stress). Stress dealer. | None | Resists water; weak to fire |
| Walrus Brute (`walrus_brute`) | foe | defender | 1 | A wall of blubber: Block and Taunt; the cutlass-tusk lunge; a belly crush that Stuns. | None | Resists frost and physical; weak to fire |
| Powder Monkey (`powder_monkey`, new) | foe | support | 3 to 4 | Never attacks: runs a cartridge to an ally, which loads its next attack (shown on that ally's intent). | None | Resists frost; weak to physical |
| Sea Lice (`sea_lice`, new) | foe | afflicter | 1 to 2 | The heap surges over a hero's legs and strips them (Bleed). | On death: the lice scatter: Bleed on the heroes in ranks 1 and 2. | Resists frost and water; weak to toxin |
| Capstan Gang (`capstan_gang`, new) | foe | attacker | 1 to 2 (2 ranks) | Heaves round: the bars sweep ranks 1 and 2, harder every round while the fiddler keeps time. | Round start: Heave: gains Might each round; loses it all when Stunned or Frozen. | Resists frost and water; weak to physical |
| The Sailmaker (`sailmaker`, new) | foe | summoner | 2 | The needle stitches a hero in place (Stun); he drops the sewn hammock from his shoulder and it splits into Sea Lice (once per fight). | None | Resists frost and water; weak to fire |
| Fleet Marine (`fleet_marine`, new) | foe | defender | 1 | Keeps order on deck: guards the ally behind him and meets melee with a bayonet riposte; a lunge otherwise. | None | Resists frost and water; weak to physical |
| The Galley Cook (`galley_cook`, new) | foe | support | 2 to 3 | Feeds an ally from the frozen pot (heal) and shows the company what is in the broth (stress); a cleaver chop. Stress dealer. | None | Resists frost and water; weak to toxin |
| Ice-Edge Orca (`ice_edge_orca`, new) | foe | attacker | 1 to 2 (2 ranks) | Slides up onto the ice edge: a bite that Soaks and drags a hero toward the water (Pull). | None | Resists frost and water; weak to lightning |

## 3. Rulers

**The Leviathan in the Ice** (`fleet_boss`, with a Frozen Whaler in rank 1).
- Phase 1, Under the Ice (full HP to about half): opens with White Breath (Soak and Weaken on every hero). Then the jaw breaks up under the fixed hero (heavy hit, Freeze if Soaked) and Sound the Depths when hurt. Only the eye shows.
- Phase 2, the Ice Cracks (to about a fifth): it rises. Breach every other turn (damage and Soak to all), Thrash on the back rank, and Swallow Whole on any Frozen hero (a very heavy hit and stress).
- Phase 3, Down with the Fleet (below a fifth): the ice breaks under one rank each turn (that hero Soaked and Weakened), and Swallow Whole comes every other turn.
- Commission: "The fleet sailed north to kill it and froze in the trying. Its one stone tooth is the Tooth. Finish the fleet's work."

**The Broadside** (proposed room `fleet_line`, on the ice alongside her hull; until it is built, `fleet_ice`). Rank 1 is left for boarders.
- Phase 1, Loaded Since the Battle (to about half): opens with a full broadside on turn 1 (the ice has kept her loaded since the sea froze). Then she reloads for a turn (shown) and fires again; between broadsides the frozen boarder on the entry ladder drops into rank 1 (a Drowned Deckhand or a Fleet Marine).
- Phase 2, Every Gun at Once (below half): no more reloading. A lighter ripple every turn, but the ice in her barrels bursts them: each broadside costs her HP. The company can outlast her behind Block, or race her.
- Commission: "Her guns still face the leviathan's water, and the Tooth is in range. Silence her before she fires the broadside she has been holding."

**The Shrouds** (proposed room `fleet_mast`, the foot of the mainmast on the ice; until it is built, `fleet_deck`). Rank 1 starts empty.
- Phase 1, a Dozen Aloft (to about two thirds): topmen drop onto heroes (one heavy hit, then hauled back up); icicles fall on a random rank (small hits and Weaken).
- Phase 2, Cut Loose (to about a quarter): the lowest topmen let go for good. Cut Loose sends a Drowned Deckhand into the rearmost empty rank (twice per fight at most); drops continue.
- Phase 3, the Web Parts (below a quarter): the rigging comes down across ranks 1 to 3: every hero there is hit and Anchored (tangled), every other turn.
- Commission: "The topmen were aloft when the sea froze, and no one has called them down. Call them down, and the lookouts of the Tooth go with them."

## 4. Encounter plan

Rooms: `fleet_deck` (the flagship's weather deck among the masts), `fleet_hold` (the orlop: hammocks of the sewn dead, the surgeon's cockpit, the stove-in hull), `fleet_ice` (the sea ice between the ships, eel holes, a lead of black water). Creatures listed from rank 1.

| Group | Creatures (rank 1 first) | Room | Tactical idea |
|---|---|---|---|
| The Frozen Deck | Drowned Deckhand, Frozen Whaler, Frozen Whaler | `fleet_deck` | The harpoons drag the back rank forward into the cutlass; put the dragged hero back with Swap or keep it covered. |
| Gull Rookery | Fleet Marine, Rime Gulls, Rime Gulls | `fleet_deck` | The Marine ripostes melee while the gulls stress the rear; area damage beats both flocks. |
| The Ice Holes | Walrus Brute, Ice Eel, Ice-Edge Orca | `fleet_ice` | The walrus taunts, the eel and orca Soak and drag; Freeze the walrus and shatter it, or ignore it for the biters. |
| The Gun Deck | Fleet Marine, Frozen Whaler, Powder Monkey | `fleet_hold` | The boy loads the whaler's next harpoon. Kill him first, or Freeze the loaded whaler so the load is wasted. |
| Weighing Anchor | Capstan Gang, Powder Monkey, Rime Gulls | `fleet_deck` | The capstan grows every round and the boy loads it; Stun or Freeze it to reset the Might. |
| The Galley | Drowned Deckhand, Fleet Marine, The Galley Cook | `fleet_hold` | The cook heals and stresses behind two bodies; reach him or the fight drags. |
| Burial Detail | The Sailmaker, Sea Lice, Frozen Whaler | `fleet_hold` | The Sailmaker stitches a hero in place and drops more lice; kill lice where their death Bleed lands on the fewest. |
| The Lead | Ice-Edge Orca, Ice Eel, Ice Eel | `fleet_ice` | Three Soakers and Weakeners; Freeze risk is high every round. Ward or keep the key hero dry. |
| The Captain's Cabin (elite) | Drowned Deckhand, Fleet Marine, The Ice-Wed Captain | `fleet_hold` | His flank keeps its Block and he strips the company's best buff; kill the crew from the side he cannot cover, or burst him. |
| The Selkie's Floe (elite) | Frost Selkie, Rime Gulls, Ice Eel | `fleet_ice` | Heavy stress from song and gulls; open each round on her with a cheap hit to spend the stolen-skin cut. |
| The White Bear (elite) | The White Bear, Rime Gulls | `fleet_ice` | It breaks its first Freeze and gains Might; Weaken it or bait the first Freeze with a cheap card. |
| The Cockpit (elite) | Sea Lice, Fleet Marine, The Ship's Surgeon | `fleet_hold` | He saws the most Weakened hero and heals on every death; kill him before the crew, or stop healing the hero he is hunting. |

## 5. What this world tests

- **Action denial:** Freeze leaves a hero only its kit for a round, a direct test of whether the kits (worth about 70% of a common) carry a turn, and of decks that need one hero's hand to function.
- **Multi-hit damage under Weaken:** Duelist Bladedancer and other many-small-hit builds lose a point on every hit; Hexweaver Hex and cleanse help.
- **Physical payoff for course setup:** Freeze and shatter reward an Elementalist or Alchemist who sets up and a Bulwark (Last Bastion) or Duelist (Executioner) who cashes in.
- **Kill order and support crews:** the Powder Monkey, Galley Cook, Surgeon and Captain test target choice; Oracle delay and reorder effects shine.
- **Rear pulls:** harpoons, keelhauls and the orca drag the back rank forward, so Swap and rank discipline matter.
