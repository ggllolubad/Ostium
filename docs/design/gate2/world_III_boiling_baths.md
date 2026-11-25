# World III: The Boiling Baths (role map)

Gate 2, Deliverable B. Design brief only: no final numbers.

## 1. World

**The Boiling Baths.** Courses: Fire and Water. Conjunction: **Scald** (Fire meets Water): 2x power, and the target is Vulnerable for a round. The affliction is Fever (lose 2 HP and gain 1 Burn when drawn). Fights here are built as a three-beat combo the company can read on the intents: one foe wets a hero (towels, dunks, ladles, steam), a second lands Burn (flasks, sprinkles, coal), and a heavy hitter strikes the now-Vulnerable hero. Breaking any beat (Ward the Soak, kill the Burn-bringer, Guard or Swap the target) breaks the combo. Fever and steady Burn grind HP between fights, so this is the sustain world. By the course rebalance, creatures of heat are weak to frost: Weaken also cuts their hits, so frost is the company's best tool here. Many foes heal; the Strigil-Master scrapes protection off.

## 2. Roster

Stress dealers among the cast: Steam Nymph (sigh), Boiled Brute (dunk), Lapdog (bark).

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|-|-|-|-|-|-|-|
| The Simmering Matron `simmering_matron` | ruler | afflicter | 3-4 (2 ranks) | Seated in the great pool: sweeps waves of scalding water across the ranks (Soak all, then Burn all, Scald on everyone); tastes the broth to heal. | Simmering (round start): the pool heats one step on a visible count; at the top it boils over (Scald on every hero) and resets. | resists fire, water; weak frost |
| The Best Families `best_families` (new) | ruler | summoner | 2-4 (3 ranks) | A heap of cooked nobles hauling itself forward: a dozen arms take hold of a hero and pull them into the steam (pulled forward, Soaked, Anchored); as the heap parts, bathers fall out into empty ranks. | Complaint (round start): the patriarch complains; the hero who dealt the heap the most damage last round gains stress. | resists fire, water; weak frost |
| The Great Copper `great_copper` (new) | ruler | attacker | 3-4 (2 ranks) | The boiler under every pool: pressure builds round by round; the valve lifts and scalding steam rolls across every rank; the stokers rake burning coal at the front rank. | Pressure gauge (round start): gains pressure on a visible count, and the valve lifts at the top. Frost (Weaken) on it lowers the pressure. | resists fire, water, physical (riveted copper); weak frost |
| The Bath-Mistress `bath_mistress` | elite | support | 2-3 | Keeps the water hot and the guests clean: a ladleful of boiling water (Soak and Burn on one hero, Scald if either is already there), a scold (stress and Mark), attends a wounded foe. | Keeps the water hot: while she lives, Soak on heroes does not fade. | resists fire, water; weak frost |
| Cauldron Bearer `cauldron_bearer` | elite | attacker | 1 | Swings and empties a cauldron over the front two ranks (Soak and Burn: Scald on both). | Two cauldrons: it empties one per heavy turn; with both empty it spends a round going back to fill them (no attack). | resists fire, water; weak frost |
| The Strigil-Master `strigil_master` (new) | elite | attacker | 1 | Scrapes the nobility clean: a long raking scrape peels a hero's Block, Armor and Ward away; heavy boiled hands. | What he scrapes he keeps: Block he strips from a hero becomes his own. | resists fire, water; weak frost |
| The Invalid Countess `invalid_countess` (new) | elite | support | 1-2 (2 ranks) | Carried to be cured: the bearers ram the front pole into a hero; she throws a bottle of boiling water; her hand-bell calls her Lapdog into an empty rank. | Never put down: she cannot be moved, and hits that reach only rank 1 strike the front bearer and deal less; hits on rank 2 land in full. | resists fire, water; weak frost |
| Scalded Attendant `scalded_attendant` | foe | attacker | 1-2 | Still brings towels: a wet towel snapped like a whip (Soak); a towel hook drags a hero forward. The first beat of the combo. | none | resists fire, water; weak frost |
| Kettle Crab `kettle_crab` | foe | defender | 1 | Cooked alive: hard shell; vents steam over every hero (a little Soak and Burn, a Scald on anyone carrying one). | Steam spout (on hit): heavy hits crack the shell and it vents; the attacker gains Burn. | resists physical, fire; weak frost |
| Boiled Brute `boiled_brute` | foe | attacker | 1 | Very soft and very strong: grabs, and dunks a hero under (Soak and stress). | none | resists water; weak physical (soft as wet bread) |
| Steam Nymph `steam_nymph` | foe | support | 3-4 | Drifts and sings to the drowned: veils every foe in steam (Dodge), a sigh of stress, a scalding breath at the back. | none | immune fire, water (she is made of steam); weak frost (steam condenses) |
| Bath Leech `bath_leech` | foe | attacker | 1-2 | Grown fat on the bathers: lunges, latches and drains, healing itself. | none | resists fire, water; weak frost |
| Hypocaust Stoker `hypocaust_stoker` (new) | foe | attacker | 2 | Kept the fires under the floors: a hooked pull drags a hero forward and burns them. | none | resists fire; weak frost |
| Votive Pilgrim `votive_pilgrim` (new) | foe | support | 2-3 | Asked to walk again: a rattling crutch swing; splashes temple water on an ally (heal). | none | resists fire, water; weak frost |
| Physic of the Waters `physic_of_the_waters` (new) | foe | support | 3-4 | Prescribes the waters: flings his boiling flask at a Soaked hero (Burn, so Scald); prescribes a soak for an ally (heal over time). | none | resists fire, water; weak frost |
| Lustral Priest `lustral_priest` (new) | foe | afflicter | 2-3 | Blesses with boiling holy water: a sweeping sprinkle scalds a whole rank pair (Soak and Burn). | none | resists fire, water; weak void (holy: gilded aspergillum and stole) |
| Lapdog `lapdog` (new) | foe | attacker | 1 | Bites everyone but her: snapping ankle bites, a barking fit (stress to the front hero). | Her dog: if the Invalid Countess is in the fight, it Guards her. | resists fire, water; weak frost |
| Hypocaust Roaches `hypocaust_roaches` (new) | foe | attacker | 1-2 | Flood over a hero's feet and up the legs: many small hits and Burn. | Swarm: single-target hits deal less, hits on every foe deal more. | resists fire, water; weak frost |
| Pump Mule `pump_mule` (new) | foe | attacker | 1 | Kicks with both hind legs, then swings the broken sweep-beam across the front two ranks. | Nobody told it to stop: it cannot be Stunned, Locked down or Frozen out of its action. | resists water; weak frost |

## 3. Rulers

Each ruler's signature is Scald made large.

**The Simmering Matron** (baths_boss)
- Phase 1, bathing: waves of scalding water on the ranks; the pool heats on its count; she tastes the broth to heal.
- Phase 2 (about 55% HP), she rises from the pool, skin sloughing in sheets: each round she sheds every course stack on herself, so the company must land its Conjunctions in a single round (Volatile, not Stable).
- Phase 3 (about 20% HP), she boils over: the count is gone and every round is a Scald on every hero. A race.
- Commission: "The Tooth hangs from her neck on a chain. She has been simmering for a hundred years and is nearly ready. Take it before she is done."

**The Best Families** (baths_pool: their pool and the great colonnade)
- Phase 1, complaining: the arms pull heroes into the steam; complaints stress whichever hero hurt it most, which pushes the company to share the damage between heroes rather than lean on one carry.
- Phase 2 (about half HP), the heap parts: it shrinks to 2 ranks and a bather falls out into the empty rank every other round (summoned as a Scalded Attendant, like the towel boy caught in the mass).
- Commission: "The seventh pool's families have climbed out to complain about the water, and they mean to complain to the Matron. Stop them before they claim her pool, and her Tooth, as their due."

**The Great Copper** (baths_furnace: the praefurnium under the temple)
- Phase 1, on shift: the stokers rake coal at the front; pressure builds to the valve.
- Phase 2 (about half HP), the seams split: pressure builds twice as fast, but the glowing seams leave it Vulnerable after each valve lift.
- Phase 3 (about 20% HP), it bursts: hot water weeps from every seam; every round Soaks every hero and the valve lifts on every count.
- Commission: "Every pool in the temple boils because of one boiler. Its stokers are still on shift. Draw the fire, and the Matron's pool may cool enough to reach her."

## 4. Encounter plan

Creatures in rank order, front first.

| # | Tier | Room | Creatures | Tactical idea |
|-|-|-|-|-|
| F1 | foe | baths_pool | Scalded Attendant, Scalded Attendant, Physic of the Waters | The towels wet, the flask burns: kill the Physic or Ward the wet hero. |
| F2 | foe | baths_pool | Kettle Crab, Boiled Brute, Steam Nymph | Shell in front, the brute dunks behind it, the nymph veils both: frost cuts through all three. |
| F3 | foe | baths_furnace | Hypocaust Roaches, Hypocaust Stoker, Steam Nymph | Under the floors: the hook drags a hero forward into the roaches. |
| F4 | foe | baths_cistern | Pump Mule, Bath Leech, Bath Leech | The mule ignores control; the leeches heal off you: burst it down. |
| F5 | foe | baths_pool | Lapdog, Lustral Priest, Votive Pilgrim | The priest scalds a whole rank pair, the pilgrim heals, the dog barks: break the sprinkle with Ward. |
| F6 | foe | baths_cistern | Boiled Brute, Votive Pilgrim, Physic of the Waters | Two healers behind a soft wall: physical damage melts the brute, then reach rank 3. |
| F7 | foe | baths_furnace | Kettle Crab, Hypocaust Stoker, Lustral Priest | Pull, wet, burn, pinch: the full combo from three bodies. |
| F8 | foe | baths_cistern | Pump Mule, Hypocaust Roaches, Lapdog, Bath Leech | Four small bodies: hits on every foe win; control does not. |
| E1 | elite | baths_pool | Scalded Attendant, The Bath-Mistress, Steam Nymph | While she lives the company stays wet, and every Burn is a Scald. |
| E2 | elite | baths_furnace | Cauldron Bearer, Kettle Crab, Hypocaust Stoker | Two cauldrons, two Scalds on the front ranks, then a round to strike back while it refills. |
| E3 | elite | baths_furnace | The Strigil-Master, Lustral Priest, Physic of the Waters | He strips Block and keeps it; the priest and the Physic scald the stripped hero. |
| E4 | elite | baths_pool | Lapdog, The Invalid Countess, Votive Pilgrim | Hit her back half (rank 2), not the bearer; the dog guards her and her bell calls it back. |
| R1 | ruler | baths_boss | Votive Pilgrim, Steam Nymph, The Simmering Matron | Land Conjunctions before phase 2's sloughing; frost holds back the boil-over; the pilgrim's temple water keeps her topped up. |
| R2 | ruler | baths_pool | Scalded Attendant, The Best Families | Spread the damage to dodge complaints, then clear the bathers that fall out. |
| R3 | ruler | baths_furnace | Hypocaust Stoker, Kettle Crab, The Great Copper | A damage race against the gauge; frost buys time. |

Rooms: World III has one ruler room (`baths_boss`). The two rivals are placed in the regular rooms their lore names (the families' pool off the colonnade at `baths_pool`; the boiler at the furnace mouth in `baths_furnace`). Those rooms have no ruler stage (the right 45% kept clear), so each needs a ruler variant, or the rivals fall back to `baths_boss`.

## 5. What this world tests

- **Reading a combo.** Soak, then Burn, then a heavy hit: Oracle ordering, Bulwark Guard and Swap, and Ward (Elementalist, Alchemist, Oracle) each break a beat. Companies that only race damage eat Vulnerable hits.
- **Block builds.** The Strigil-Master steals Block and the Matron's waves come every round: a Bulwark that lives on Block alone (Last Bastion) is pressured; Armor and healing hold better.
- **Sustain.** Fever, steady Burn and Scald grind HP: Alchemist flasks and Apothecary healing carry descents here.
- **Frost.** Almost the whole roster is weak to frost: Ironwarden Bulwarks and frost-leaning Elementalists are strongest here. Fire builds do little.
- **Kill order.** Many healers (Pilgrim, Physic, Mistress, Matron, the leeches) test focus fire (Duelist, Executioner).
- **Control.** The Pump Mule ignores control, a check on Chronomancer and Lockdown plans.
- **One-carry companies.** The Best Families stress whichever hero deals the most damage, so a company built around one carry (a lone Duelist Momentum chain) pays for it; shared damage does not.
