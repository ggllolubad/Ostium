# World IV: The Sulphur Pits (role map)

Gate 2, Deliverable B. Design brief only: no final numbers.

## 1. World

**The Sulphur Pits.** Courses: Fire and Toxin. Conjunction: **Combust** (Fire meets Toxin): 3x power, the highest multiplier in the game. The affliction is Black Lung (gain 1 Toxin and 1 Burn when drawn): a hero who breaks here carries both halves of a Combust in one card. Fights split into fuel and spark. Gas-bearers (miners, the Matriarch, toads, rats) lay Toxin on the company; igniters (the Fuse Imp, the Canary Priest's hymn, the Gas-Burner, the lamps) land Volatile Burn on the turn after. The intents show which foes are which, so killing or blanking the spark is the core decision, and Ward or cleansing a hero's Toxin turns a Combust into nothing. The trick runs both ways: many foes are full of gas and burst when Burned, hurting their own neighbours. Timers (fuses, lamps, the mill's quarter turns) punish slow decks. By the course rebalance, creatures of heat are weak to frost.

## 2. Roster

Stress dealers among the cast: Pit Boy (on death), Canary Priest (hymn), Weighman (docked).

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|-|-|-|-|-|-|-|
| The Burning Lung `burning_lung` | ruler | afflicter | 3-4 (2 ranks) | The mine's first breath: Inhale draws the Toxin off every hero into its glowing sac; Exhale breathes it back as burning gas (Combust on every hero, sized by what it took); crushing bulk on the front; the tongue swallows from the back. | Gas sac: while the sac is full, fire on it detonates its own gas (Combust on itself). | immune toxin (it is gas); resists fire; weak frost |
| The Owner `owner` (new) | ruler | summoner | 3-4 (2 ranks) | Hangs head-down through the shaft mouth: a two-handed grab lifts a hero against his burning chest (held, Burn each round); tally tokens spill and he calls a shift (Gas-Lung Miner or Pit Boy into an empty rank). | Wedged in the shaft: cannot be moved. Lamp in his fist: if he is Stunned, Frozen or loses an action, he drops the lamp into the gas (Volatile Burn on every hero). | resists fire, toxin; weak frost |
| The Powder Mill `powder_mill` (new) | ruler | attacker | 2-4 (3 ranks) | Edge-runner stone and blind horse: the stone grinds a quarter turn each round; on the full turn the mill rolls forward and crushes the front hero, and the powder in the trough flashes. The horse kicks between turns. | Quarter turns (round start): a visible count of four; the full turn is the crush. Sparks (on hit): physical hits on the iron tyre throw sparks; the attacker gains Burn. | resists physical (stone), fire; weak water (wet powder will not burn) |
| Powder Ogre `powder_ogre` | elite | attacker | 1 | Eats blasting powder: eating from the keg gives it Might; a fiery belch over the front two ranks; a heavy smash. | Lit fuse (round start): the fuse on its wrist burns down a visible count; at zero the keg goes off (Combust on every unit carrying Toxin, foes included, and heavy damage to itself). Soak on it puts the fuse out for a round. | resists fire, toxin; weak water |
| Miasma Matriarch `miasma_matriarch` | elite | afflicter | 3-4 | A head swollen with gas: choking breath (Toxin on every hero), a swollen gaze (stress, Vulnerable); her gas-head young drift into an empty rank (summon; the young have no bible entry: open). | Swollen with gas (on hit): fire on her Combusts her, but she bursts in a cloud and every hero gains Toxin. | immune toxin (made of gas); weak fire |
| The Mounted Overseer `mounted_overseer` (new) | elite | support | 1 | Rides the galleries counting heads: a whip lash Marks a hero and the pony barges after it; drives the shift (every foe's next attack goes at the Marked hero). | Counting heads (on ally death): pegs the tally; every other foe gains Might. | resists fire, toxin; weak frost |
| The Shrine-Bearer `shrine_bearer` (new) | elite | afflicter | 2 | Carries the miners' chapel: blesses the gas (the lamps flare and burning gas rolls out of the windows over the front ranks); blesses the powder (an ally gains Block). | Votive lamps (round start): lights one more lamp each round (visible count); a blessing spends them all and grows with each lamp. | resists fire, toxin; weak void (holy: the gilt figure and cross-lamp) |
| Gas-Lung Miner `gas_miner` | foe | attacker | 1 | Pick swings and a wet cough (Toxin); the fuel of the world. | Keep it from the lamp (on hit): if it is Burned, its chest bursts: Combust on itself and Burn on the units beside it (foes and the hero facing it). | resists toxin; weak fire |
| Brimstone Toad `brimstone_toad` | foe | afflicter | 2-3 | Sweats brimstone: spits burning slime (Toxin and Burn on one back hero, a Combust if it already carries either); the tongue pulls. | none | immune toxin (sweats it); resists fire; weak open |
| Fuse Imp `fuse_imp` | foe | afflicter | 3-4 | A spark that learned to walk: throws its torch (Volatile Burn, igniting any Toxin), then blows itself up. | Burning fuse (round start): its tail fuse burns down a visible count; at zero it blows up on every hero and dies. Soak or Weaken on it puts the fuse out for a round. | immune fire (a spark); weak water |
| Pit Crawler `pit_crawler` | foe | attacker | 1 | A centipede as long as a mine cart: venom mandibles (Toxin); coils round a hero (Anchored). | none | resists physical (plates), toxin; weak open |
| Canary Priest `canary_priest` | foe | afflicter | 3-4 | Sings to the gas: a hymn ignites it (Volatile Burn on every hero carrying Toxin) and unsettles the company (stress); the yellow censer lays Toxin. | none | resists toxin; weak void (holy chaplain) |
| Gas-Burner `gas_burner` (new) | foe | afflicter | 2 | Goes in first with a flame on a pole: lifts the flame into the gas over the front rank (Volatile Burn, Combust on any hero carrying Toxin); shuffles forward a rank. | none | resists fire (soaked hood), toxin; weak frost |
| Pit Boy `pit_boy` (new) | foe | attacker | 3-4 | Still seven: tips the sack and hurls a burning lump of ore at the back (Burn). | Still seven (on death): every hero gains stress. | resists fire, toxin; weak frost |
| Timberman `timberman` (new) | foe | defender | 1 | Sets the props: a sweep of the beam across two ranks; sets a prop for an ally (Block that keeps, Fortify). | none | resists toxin; weak frost |
| Gallery Rats `gallery_rats` (new) | foe | attacker | 1-2 | Pour over a hero; a swollen rat bursts into flame (Burn). | Swarm: single-target hits deal less, hits on every foe deal more. | resists toxin; weak fire (what they ate burns) |
| Weighman `weighman` (new) | foe | support | 3-4 | Weighs every load and finds it short: steals a share of Block from the hero with the most; docks the company's pay (a little gold, new effect) and the shame stresses. | Purse of fines (on death): drops what he docked this fight. | resists toxin; weak frost |
| Lamp-Room Girl `lamp_room_girl` (new) | foe | support | 3-4 | Everyone takes one: hands a lit lamp to a foe (its next attack adds Burn) or to a hero (a Lamp card in hand that Burns its holder at round end unless thrown at a foe; uses the add-card effect). | none | resists fire; weak water (douse the lamps) |
| Tub Hurrier `tub_hurrier` (new) | foe | attacker | 1-2 | Drags the burning ore tub through a rank: hits the front two heroes in turn with Burn. | Chained to the tub: cannot be moved. | resists fire; weak frost |

## 3. Rulers

Each ruler's signature is Combust made large.

**The Burning Lung** (pits_boss)
- Phase 1, breathing: alternates Inhale and Exhale; crushing bulk between. The counterplay is to Burn its full sac on an Inhale round.
- Phase 2 (about half HP), the skin splits and the gas inside catches: it Burns itself every round but exhales every round too; the tongue swallows the rearmost hero (pulled to the front).
- Phase 3 (about 20% HP), the last breath: one enormous Inhale telegraphed over two rounds, then an Exhale on everyone. Ward and cleanse before it lands.
- Commission: "The Tooth is set in its brow. The mine will not be safe to work while the first breath still breathes."

**The Owner** (pits_vent: he hangs through a shaft mouth in the roof of the cavern where the gas breathes)
- Phase 1, inspecting: grabs and holds a hero; calls a shift into the empty rank.
- Phase 2 (about half HP), the timbers creak: he slips lower and his hands reach the front two ranks at once.
- Phase 3 (about 20% HP), he drops the lamp: the gallery's gas ignites every round (Volatile Burn on every hero). Stopping his action earlier also drops it, so control is a trap here.
- Commission: "He came down to see the gas for himself, and he means to have the Tooth as well. Cut him down before he swells enough to choke the shaft."

**The Powder Mill** (pits_shaft: the shaft bottom, by the powder store)
- Phase 1, grinding: the quarter-turn count to the crush; the horse kicks.
- Phase 2 (about half HP), the harness burns into the hide: the count drops to two, and each crush also flashes the trough under the second rank.
- Commission: "It ground the brimstone for every powder cart that went up to the foundry. Stop the wheel, and the carts stop with it."

## 4. Encounter plan

Creatures in rank order, front first.

| # | Tier | Room | Creatures | Tactical idea |
|-|-|-|-|-|
| F1 | foe | pits_shaft | Gas-Lung Miner, Gas-Lung Miner, Lamp-Room Girl | Coughs lay the fuel, her lamps light it; Burn one miner and it bursts into the other. |
| F2 | foe | pits_vent | Pit Crawler, Brimstone Toad, Fuse Imp | The toad stacks Toxin on the back; the imp's torch lights it before the fuse runs out. |
| F3 | foe | pits_chapel | Gas-Lung Miner, Canary Priest, Fuse Imp | Two sparks behind one fuel: kill the priest before his hymn, Soak the imp. |
| F4 | foe | pits_vent | Gallery Rats, Pit Crawler, Brimstone Toad | Toxin piles up with no spark: the danger is the next fight, and Black Lung. |
| F5 | foe | pits_shaft | Timberman, Weighman, Pit Boy | The pithead staff: a two-rank sweep, docked Block and pay, and a child who costs stress to kill. |
| F6 | foe | pits_shaft | Tub Hurrier, Gas-Burner, Lamp-Room Girl | All spark and no fuel, unless the company brought Black Lung in with it. |
| F7 | foe | pits_chapel | Timberman, Canary Priest, Pit Boy | The prop keeps the Timberman's Block; reach rank 2 or burn him down slowly. |
| F8 | foe | pits_vent | Gallery Rats, Tub Hurrier, Gas-Burner, Fuse Imp | Four bodies, two igniters, one swarm: hits on every foe and fast kills. |
| E1 | elite | pits_shaft | Powder Ogre, Weighman, Fuse Imp | Two fuses on the count: Soak the keg, then the imp, or kill fast. The keg hurts its own side too. |
| E2 | elite | pits_chapel | Gas-Lung Miner, Canary Priest, Miasma Matriarch | All fuel and one hymn: Burning the Matriarch is a gamble on the gas cloud. |
| E3 | elite | pits_vent | The Mounted Overseer, Tub Hurrier, Pit Boy | Every foe hits the Marked hero, and every death drives the rest harder: Guard the Mark. |
| E4 | elite | pits_chapel | Timberman, The Shrine-Bearer, Canary Priest | The lamps count up behind a propped wall: break through before the blessing. |
| R1 | ruler | pits_boss | Gas-Lung Miner, Gas-Lung Miner, The Burning Lung | The miners are its fuel and yours: their bursts Burn the full sac. |
| R2 | ruler | pits_vent | Pit Boy, (rank 2 empty: his shift arrives here), The Owner | Free the held hero by damage, not control: a Stun drops the lamp. |
| R3 | ruler | pits_shaft | Tub Hurrier, The Powder Mill | A countdown fight: Soak the mill to slow its flash, and keep the front hero's HP high for the crush. |

Rooms: World IV has one ruler room (`pits_boss`). The two rivals are placed in regular rooms: the Powder Mill by the powder store in `pits_shaft`, the Owner in `pits_vent` (open: his bible entry puts him in a gallery roof, and no room shows a pithead or his shaft). Those rooms have no ruler stage (the right 45% kept clear), so each needs a ruler variant, or the rivals fall back to `pits_boss`.

## 5. What this world tests

- **Course hygiene.** Combust at 3x punishes a company that lets Toxin sit: Ward and cleansing (Elementalist, Alchemist Apothecary, Oracle) and the Vessel taking Toxin onto itself are the core defence. Black Lung makes a broken hero a walking Combust.
- **Kill order by role.** Fuel versus spark is readable on the intents: Duelist and Executioner focus on igniters wins fights.
- **Elementalist Catalyst and Plaguewright combos.** The company can Combust gas-filled foes and chain their bursts; a Plaguewright plus fire pairing shines, while Toxin-only damage meets a roster that resists it.
- **Speed.** Fuses, lamps and the mill's count punish slow scaling (Hexweaver Hex build-up, Accumulator Focus banking).
- **Control as a trap.** The Owner drops his lamp when Stunned or Frozen: Chronomancer and Lockdown plans must read the fight first.
- **Block hoarding.** The Weighman steals from the hero with the most Block; the Overseer's Mark tests Bulwark Guard and Taunt.
- **Hits on every foe.** Swarms and four-body groups test area damage; adjacency matters because bursts hit neighbours.
