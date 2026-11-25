# World X: The Venom Spires (role map)

Gate 2 draft, 2026-11-25. Sources: `world_X_venom_spires.md`, `RIVAL_RULERS.md`, `afflictions.md`, Combat Rules v2, `tools/content/worlds.py`.

## 1. World

**The Venom Spires.** Courses: lightning and toxin. Conjunction: **Neurotoxin** (the next action loses its secondary effects). Door 10 (Act IV), so the reference company is level 8 to 9 with three runes and two relics. Affliction: **Venom Tremor** (this hero's next card loses its secondary effects).

Neurotoxin does not hurt; it strips. The next action keeps its main effect and loses everything else: the Hex on a hit, the Bleed, the course rider, the Prime, the draw, the Block on an attack. The hive stacks Toxin with its stings, then a jolt of lightning paralyses a hero's next card, and Venom Tremor does the same from inside the deck. Builds made of riders lose their engine one card at a time. The counter is sequencing: let a cheap filler card take the paralysis, then play the card that matters, or lean on plain damage. Turned around, Neurotoxin is the company's best answer to the hive's healers, buffers and summoners, whose moves are all secondary effects. The hive is also many small bodies and calls for more, so area damage and kill order decide fights, and its builders punish a company that never moves.

## 2. Roster

Rank footprint follows the design language: Small, Human and Large take 1 rank; "(2 ranks)" marks a body wide or long enough to fill two.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Hive Queen (`hive_queen`) | ruler | summoner | 2 to 4 (3 ranks) | A stinger strike that paralyses (Toxin, then lightning: Neurotoxin on one hero), the colony's sting on every hero, and eggs that hatch into Spire Wasps. | Royal guard: while any wasp lives, the first hit aimed at her each round strikes a wasp instead. | Immune toxin (her venom); resists lightning (the rod in her back); weak to frost (haste rule) |
| The Procession (`procession`, new) | ruler | defender | 2 to 4 (3 ranks) | The float lurches forward and tips the saint down onto the front rank (heavy hit, Stun); one burn crosses every bearer, and one lightning burn crosses the company. | Twelve backs: cannot be moved or Stunned; each quarter of its HP lost, a bearer falls and its blows weaken. | Resists lightning and toxin; weak to void (the saint and its halo are holy) |
| The Cicada Under the Road (`cicada_under_the_road`, new) | ruler | afflicter | 2 to 4 (3 ranks) | Rises from its shell over the fight; the song is a shrill that rattles the road stones and paralyses the whole company (stress and Neurotoxin on every hero). | The hum: stress on every hero at round start, rising a step each round until the Song resets it. Old shell: heavy Armor until it splits (phase 2). | Resists lightning and toxin; weak to frost (a new soft body) |
| Mantis Duelist (`mantis_duelist`) | elite | attacker | 1 to 2 | Bows, then duels: double scythe strikes, a lunge at the back with Toxin, a paralysing strike. Answer move: Praying Stance (Riposte and Block) when its opponent is about to attack. | Round start: Salute: it names one hero as its opponent (shown); it attacks only that hero and ripostes that hero's attacks. | Resists toxin and lightning; weak to frost (haste rule) |
| Brood Mother (`brood_mother`) | elite | summoner | 2 to 3 (2 ranks) | The brood bite (Toxin), webs on the rear (Anchored and stress), and spiderlings sent into empty ranks as Venom Spiders. Answer move: Hatch (Might and Regen for all) when the company has killed a spider. | On death: the brood scatters: Venom Spiders fill the empty ranks (twice at most). | Resists toxin; weak to fire (the egg sacs) |
| The Courier (`courier`, new) | elite | attacker | 1 to 2 (2 ranks) | A trampling lunge across two ranks; the broken seal on the message tube lets wasps out (Spire Wasps into an empty rank). Answer move: tramples the hero who Stunned or paralysed it. | Spasm: when it would be Stunned or lose an action, it instead lashes out at a random hero. | Resists lightning and toxin; weak to physical (the swollen nests in the horse's neck) |
| Road Centipede (`road_centipede`, new) | elite | attacker | 1 to 2 (2 ranks) | A downward strike with the venom claws (Stun and Toxin) that can reach any rank, from the reared curve over the company. Answer move: strikes the rear when the front is heavily guarded. | Fused segments: heavy Armor from the strike-welded middle. | Resists toxin and lightning; weak to fire |
| Spire Wasps (`spire_wasps`) | foe | afflicter | 1 to 2 | A cloud of stings: many small hits, each with Toxin; the swarm deals stress. Stress dealer. | Flock: single-target hits deal reduced damage; hits on every foe deal full. | Resists toxin and physical; weak to frost (haste rule) |
| Venom Spider (`venom_spider`) | foe | afflicter | 3 to 4 | Drops on its thread: a bite with heavy Toxin; webs the back rank (Anchored, no Swap). | None | Resists toxin; weak to fire |
| Puppet Host (`puppet_host`) | foe | attacker | 1 | Moves when the larvae do: jerking staff swings and spores (Toxin and stress on every hero). Stress dealer. | On death: the larvae burst out: Toxin on the heroes in ranks 1 and 2. | Resists toxin; weak to fire |
| Galvanic Beetle (`galvanic_beetle`) | foe | defender | 1 | Stores lightning in its shell: Carapace Block and a charged horn ram (Static). | On hit: lightning applied to it is stored, and its next ram releases it onto a hero. | Immune lightning (it stores it); resists physical; weak to water |
| Hive Drone (`hive_drone`) | foe | support | 3 to 4 | Feeds venom-green nectar to the most wounded ally (heal); venom dust on the rear. | None | Resists toxin; weak to physical |
| The Dowser (`dowser`, new) | foe | afflicter | 2 to 3 | The rod dips toward a hero a turn ahead (shown); then it snaps down, the ground under that hero splits and wasps pour up (Toxin and stress). Stress dealer. | None | Resists lightning; weak to water (what he sought undoes him) |
| Struck Shepherd (`struck_shepherd`, new) | foe | support | 2 | The crook hooks a hero and pulls it forward; he herds his own side, swapping a wounded foe back and a fresh one forward. | None | Resists lightning and toxin; weak to fire |
| Highwayman (`highwayman`, new) | foe | attacker | 3 to 4 | A crossbow bolt at the back rank; the trigger finger twitches, so a paralysed hero is his favourite target. | None | Resists lightning; weak to physical |
| The Tinker (`tinker`, new) | foe | defender | 1 | The fused rack of pots is a shell (Armor); he turns and swings the whole load into a hero (Stun). | On hit: wasps in the kettles: a hero who hits him in melee gains Toxin. | Resists lightning and physical (fused copper and tin); weak to water |
| Road-Warden (`road_warden`, new) | foe | defender | 1 | Stands at attention as the tallest thing on the plain: Taunt; a stiff pike thrust that reaches rank 2. | None | Resists lightning and toxin; weak to fire (the paper comb inside his brigandine) |
| Spire Termites (`spire_termites`, new) | foe | afflicter | 3 to 4 | The soldiers spray venom at a hero's legs (Toxin); the workers build round anyone who stands still. | Round start: Builders: a hero who has not moved for two rounds is encased (Stun) unless it Swaps or is moved. | Resists toxin and lightning (baked clay); weak to water (clay washes away) |
| Antlion (`antlion`, new) | foe | afflicter | 2 to 3 | A flick of sand drags a hero into the glass pit: Pulled forward and paralysed (Neurotoxin on its next action). | None | Resists lightning (fulgurite) and toxin; weak to frost (a soft larva) |

## 3. Rulers

**The Hive Queen** (`hive_boss`, with Spire Wasps in rank 1).
- Phase 1, on the Spire (full HP to about half): opens with the Drone of the Hive (stress on every hero). Then the royal sting (heavy hit, Toxin) and Neurotoxin on every hero, and eggs that hatch Spire Wasps into empty ranks. The wasps guard her (trait).
- Phase 2, She Takes Wing (to about a fifth): she leaves the spire to swarm the rear (two hits on the back rank) and lays no more eggs; Royal Jelly heals her once.
- Phase 3, the Rod (below a fifth): the lightning rod in her back draws the spire's strike. Every turn, every hero carrying Toxin is paralysed (Neurotoxin), and the royal sting follows.
- Commission: "The Tooth is embedded in her stinger. Every sting on the plain is hers, and the barrow's plague came up this road. Bring the stinger home."

**The Procession** (proposed room `hive_pilgrim_road`, the shrine road on the open plain; until it is built, `hive_spires`). A Puppet Host, a pilgrim the hive took, walks in rank 1.
- Phase 1, the Slow Sway (to about two thirds): opens with the saint tipped onto rank 1 (heavy hit, Stun). Then wasps come and go through the split in the saint's face (Spire Wasps into an empty rank, twice per fight at most), and the bearers' shared burn puts lightning on every hero.
- Phase 2, Bearers Falling (to about a quarter): the bearers falter (trait). The float lists, and the saint swings across two ranks; the comb spills Toxin on the front ranks each turn.
- Phase 3, the Saint Falls (below a quarter): the statue topples in one great blow, then the comb pours out: Toxin on every hero each turn while the last bearers hold.
- Commission: "The pilgrims were carrying their saint to the shrine when the storm broke, and the hive carries them now. A saint is not the hive's to carry. Lay the bearers down."

**The Cicada Under the Road** (proposed room `hive_broken_road`, the paving heaved up round it; until it is built, `hive_brood`, under the road's paving). Rank 1 starts empty.
- Phase 1, the Shell (to about two thirds): the nymph's shell holds heavy Armor. The spade-toothed forelegs dig at rank 1 and the hum builds stress every round (trait).
- Phase 2, the Split (to about a quarter): its back splits along the lightning scar and the pale adult pushes out: the Armor is gone. The Song (stress and Neurotoxin on every hero) every third turn, resetting the hum.
- Phase 3, Wings (below a quarter): the wings unfurl. The Song every other turn, and the shrill rattles the road stones under a random rank (Stun).
- Commission: "It went underground the year the lightning came. If it finishes coming up, it will sing the whole plain still. Put it back in the ground."

## 4. Encounter plan

Rooms: `hive_spires` (where the plain road runs into the spire forest; the web fields and the duelling ground; `hive_road` is its old name, still in `data/rooms`), `hive_comb` (inside a working spire, its brood comb), `hive_brood` (the spiders' hollow under the plain road). Creatures listed from rank 1.

| Group | Creatures (rank 1 first) | Room | Tactical idea |
|---|---|---|---|
| The Outer Spires | Puppet Host, Spire Wasps, Spire Wasps | `hive_spires` | Two flocks and a host that bursts on death; one area hit is worth three single ones. |
| The Web Fields | Galvanic Beetle, Venom Spider, Venom Spider | `hive_spires` | Webs Anchor the rear and the beetle eats lightning; use another course on the front. |
| The Comb | Puppet Host, Hive Drone, Hive Drone | `hive_comb` | Two healers keep the host up; Neurotoxin or burst on the drones first. |
| The Beetle Gallery | Galvanic Beetle, Spire Termites, Hive Drone | `hive_comb` | A slow wall while the termites build round the still; Swap every other round. |
| The Plain Road | Road-Warden, Struck Shepherd, Highwayman | `hive_spires` | The Warden Taunts while the bolts fall on the rear and the Shepherd rotates the wounded; break the Taunt, then the Shepherd. |
| Under the Road | Puppet Host, Antlion, Venom Spider | `hive_brood` | Pulls and webs fix the company in place; keep a paralysis-proof card (plain damage) for the turn after the pit. |
| The Dry Well | The Tinker, The Dowser, Spire Wasps | `hive_spires` | The Dowser shows his target a turn ahead; move that hero or Ward it. Hitting the Tinker in melee costs Toxin. |
| The Builders | Road-Warden, Spire Termites, Antlion | `hive_brood` | Taunt holds the company's attention while the termites encase the still and the antlion pulls; move or be built in. |
| The Duelling Ground (elite) | Mantis Duelist, Highwayman, Hive Drone | `hive_spires` | It duels one hero and ripostes that hero only; let the others kill it, and keep its chosen hero on defence. |
| The Brood Chamber (elite) | Venom Spider, Brood Mother, (rank 4 open for the brood) | `hive_brood` | Each dead spider feeds her Hatch and her death scatters more; kill her with the spiders low, then sweep. |
| The Courier (elite) | The Courier, Struck Shepherd, Spire Wasps | `hive_spires` | Stuns and paralysis turn into a random lash; damage it plainly instead of controlling it. |
| The Fallen Beam (elite) | Road Centipede, Puppet Host, Hive Drone | `hive_comb` | Its claws reach any rank and its middle is Armored; kill the drone, then strip or go around the Armor. |

## 5. What this world tests

- **Rider-built decks:** Hexweaver Hex on hit, Duelist Bleed, Elementalist course riders and Oracle Prime lose their engines to Neurotoxin and Venom Tremor; sequencing a throwaway card first, and plain damage cards, are the answers.
- **Control-heavy plans:** the Courier's spasm, the Procession's twelve backs and the Cicada's shell resist Stun and lock; damage beats control here.
- **Area damage and kill order:** swarms, eggs, brood and healing drones reward Elementalist and Alchemist area cards and punish single-target-only companies.
- **Movement:** termites encase the still and webs and pits fix heroes in place, so Swap use and Bulwark or Duelist repositioning are tested.
- **Duelist mirror:** the Mantis duels one hero at a time and punishes a lone striker; the rest of the company must carry the kill.
