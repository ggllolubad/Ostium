# World XIII: The Black Pyre (role map)

Gate 2, Deliverable B. Roles and ideas only; numbers come at Gate 3 and scale with Threat, not with the world.

## 1. World

**The Black Pyre.** Fire + void. Conjunction: **Hollow Flame** (Burn that cannot fade or be dampened, on foes and heroes alike). Affliction: **Ash-Mark** (take 2 damage that ignores Block and Armor). Rising doom: the black flame climbs the walls, and the candles stop giving light.

Here damage does not stop. Burn normally falls by 1 each round and Soak dampens it; Hollow Flame does neither, so every stack laid on a hero is a clock that runs to the end of the fight unless a cleanse takes it (Gate 3 to confirm that cleanse removes it). Ash-Mark and the Burn tick both go round Block and Armor, so a wall of plate buys less here than anywhere. Every fight is a race: burst kills the appliers, cleanse and healing stretch the clock, and long, slow plans lose. The cathedral mirrors the abbey, so its clergy work on the company's own tools: the Confessor strips buffs, the Ash Pardoner sells pardons that lift Hex and Mark off his allies, the Inquisitor accuses. Nearly everything here is made of or lives in fire, so fire builds are blunted; water, the thing that puts a fire out, is the common weakness, and holy things are weak to void.

## 2. Roster

Ranks: 1 is the front. Elites of scale 2.3 and up, and every ruler, take 2 ranks.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Saint Unending (`saint_unending`) | Ruler | Afflicter | 3-4 (2 ranks) | She prays while she burns: black fire spreads to a hero and cannot be put out; chains drag the back hero to the stake. | Round start: every Hollow Flame on the field, hers and the company's, burns 1 hotter. | Imm fire; res void; weak water |
| The Iron Bull (`iron_bull`) (new) | Ruler | Afflicter | 1-2 (2 ranks) | The bellow: the nostril pipes blast black fire carrying every voice inside at once, Hollow Flame and stress on every hero together. | Round start: the hearth heats it (Might each round); water applied to it resets the heat. | Res fire, void, physical; weak water |
| The Confessor (`confessor`) (new) | Ruler | Summoner | 3-4 (2 ranks) | The charred hand draws a hero to the grille (pulled to rank 1): the hero confesses, loses a buff and catches Hollow Flame. Calls a Recanter into an empty rank. | On hit: the first hero to strike it each round loses a buff. | Res fire, void; weak water |
| The Unburnt Inquisitor (`unburnt_inquisitor`) | Elite | Afflicter | 2-3 | Reads a sentence: Accuse (stress, Mark), then fire lands on the accused; Absolve heals his allies. | Round start: the hero he has Marked gains 1 stress. | Imm fire (never caught alight); weak void |
| Pyre Seraph (`pyre_seraph`) | Elite | Attacker | 1-2 (2 ranks) | A dive of black fire through the front; ash wings strike every hero; below half it rises out of reach (Dodge). | On death: its ash scatters, 1 Hollow Flame on every hero. | Res fire, physical; weak void (holy) |
| The Questioner (`questioner`) (new) | Elite | Afflicter | 1-2 | Presses a black-burning iron to a hero: Hollow Flame that will not go out, more for every iron he has heated. | Round start: heats one more iron in the brazier (shown as a counter). | Res fire, void; weak water |
| The Bellows Sister (`bellows_sister`) (new) | Elite | Support | 2-3 | A hard pump: black fire across ranks 1 and 2, and every Hollow Flame on the field burns hotter (the company's fire on foes too). | On death: the fire burns low for the first time; every Hollow Flame on heroes halves. | Res fire, void; weak water |
| Ash Penitent (`ash_penitent`) | Foe | Attacker | 1 | Chain flail twice at the front; Penance lays stress and void on the back rank. | Round start: whips itself, losing HP and gaining Might. | Res fire; weak water |
| Cinder Hound (`cinder_hound`) | Foe | Attacker | 1-2 | Smells the dying: bites the hero lowest on HP or at Death's Door, wherever it stands. | None | Imm fire; res void; weak water |
| Censer Deacon (`censer_deacon`) | Foe | Support | 2-3 | Black incense lays void and stress on every hero; Last Rite heals the most wounded foe. | None | Res fire, void; weak water |
| Candle Wraith (`candle_wraith`) | Foe | Afflicter | 3-4 | A flare of black fire on the back rank; a hollow glow lays void on all. | On death: lights again next round at half HP, once, unless water was on it. | Imm fire; res physical; weak water |
| Pyre Knight (`pyre_knight`) | Foe | Defender | 1 | Guards the pyre (Block for all foes); the mace sets Hollow Flame. | None | Res fire, physical; weak water |
| Recanter (`recanter`) (new) | Foe | Afflicter | 2-3 | Tips the candle: black wax runs onto a hero and lights. The Confessor's summon. | On hit: shuffles back one rank, afraid to arrive. | Res fire; weak water |
| Belfry Bats (`belfry_bats`) (new) | Foe | Attacker | 3-4 | A swarm: the swirl dives through the back rank and the bites spread Hollow Flame. | None | Res fire, void; weak physical |
| The Familiar (`familiar`) (new) | Foe | Attacker | 1-2 | A rearing butt knocks a hero back a rank and sets Hollow Flame. | None | Res fire; weak water |
| Faggot-Bearer (`faggot_bearer`) (new) | Foe | Defender | 1-2 | Tips the burning top bundles onto a hero; the stack on his back shields the foe behind him. | On hit: a melee attacker catches 1 Burn from the load. | Res fire; weak water |
| The Scold (`scold`) (new) | Foe | Afflicter | 2 | A choked cry through the mask: black flame bursts from the slot over a hero (Hollow Flame and stress). | On death: he finally says it; every hero sheds some stress. | Res fire, void; weak water |
| Ash Pardoner (`ash_pardoner`) (new) | Foe | Support | 3-4 | Sells a pardon: lifts Hex, Mark or a course from an ally; flings a pinch of saint's ash that burns black in a hero's face. | None | Res fire; weak water |
| Charred Destrier (`charred_destrier`) (new) | Foe | Attacker | 1 | Rears and strikes down with both forehooves; it knows the way to the stake, so it charges the hero with the most Hollow Flame. | None | Res fire, void; weak water |

Stress dealers among the 12 foes: Ash Penitent, Censer Deacon, The Scold.

## 3. Rulers

**The Saint Unending** (`saint_unending`, room `pyre_boss`). Signature: Hollow Flame made large.
- Phase 1, "Praying" (full to 60%): Pyre of the Faithful (fire on every hero), Martyr's Gaze (stress), Hollow Flame on the front.
- Phase 2, "The flame turns black" (60% to 25%): every Burn she lays is Hollow Flame; Chains of Devotion pull the back hero forward to the stake.
- Phase 3, "Nothing left but the fire" (below 25%): black fire on every hero every second round; her trait now heats the company's Hollow Flame on her too, so a fire build that has kept pace finishes her.
- Commission: she preached that heaven was a garden and a woman kept it, and burned for it. Prior Aldric came out of this cathedral with his scars; he asks for the Tooth at her throat.

**The Iron Bull** (`iron_bull`, room `pyre_stake`, the burning ground where the condemned were put to death).
- Phase 1, "Heating": rams the front, bellows every third round; the hearth adds Might each round unless the company quenches it with water.
- Phase 2, "The seams split" (below 50%): the violet seams open; the bellow comes every second round, and the voices inside add stress to every hero it hits.
- Commission: the bull has walked out to the burning ground to claim the Saint's Tooth. The heretics inside are still being heard; the abbey would like them to rest.

**The Confessor** (`confessor`, room `pyre_nave`).
- Phase 1, "Confess, and be forgiven": draws one hero to the grille each round it does not summon (buff lost, Hollow Flame); calls Recanters into empty ranks (capped).
- Phase 2, "Then burn, to be certain" (below 50%): every hero who has confessed (lost a buff to it) catches Hollow Flame at each round start; the penitents' whispering adds stress.
- Commission: the confessional has begun hearing the company's sins from across the nave. It wants the Saint's Tooth for its poor-box.

## 4. Encounter plan

| # | Room | Ranks 1 to 4 | Tactical idea |
|---|---|---|---|
| F1 | `pyre_nave` | Ash Penitent, Ash Penitent, Censer Deacon | The penitents grow stronger by hurting themselves; kill them before the Might stacks. |
| F2 | `pyre_stake` | Cinder Hound, Cinder Hound, Ash Penitent | Hounds hunt the weakest hero; keep no one low. |
| F3 | `pyre_crypt` | Pyre Knight, Candle Wraith, Candle Wraith | Wraiths relight; water them or kill them twice. |
| F4 | `pyre_nave` | Pyre Knight, The Scold, Censer Deacon | A guarded stress engine; reach rank 3. |
| F5 | `pyre_stake` | Charred Destrier, The Familiar, Recanter | The Familiar knocks a hero back into the Recanter's wax. |
| F6 | `pyre_crypt` | Faggot-Bearer, Ash Pardoner, Belfry Bats | The pardoner lifts your Hex and Mark; kill him first. |
| F7 | `pyre_nave` | The Scold, Recanter, Ash Pardoner, Belfry Bats | Four small fires; cleanse or race. |
| F8 | `pyre_stake` | Faggot-Bearer, Cinder Hound, Belfry Bats | The bearer shields the hound; melee pays a Burn toll. |
| E1 | `pyre_crypt` | Pyre Knight, The Unburnt Inquisitor, The Scold | The tribunal: the accused is Marked and burned; fire does nothing to him. |
| E2 | `pyre_stake` | Pyre Seraph (1-2), Candle Wraith | Kill it with Ward up: its death scatters Hollow Flame. |
| E3 | `pyre_crypt` | The Questioner, Recanter, Ash Pardoner | Every round adds an iron; burst him early. |
| E4 | `pyre_nave` | Ash Penitent, The Bellows Sister, Censer Deacon | She heats every flame, the company's too; a fire build can ride her pumps. |
| R1 | `pyre_boss` | Faggot-Bearer, Censer Deacon, The Saint Unending (3-4) | Feed the race or cleanse it; the bearer and deacon keep her burning. |
| R2 | `pyre_stake` | The Iron Bull (1-2), The Familiar | Water resets its heat; the Familiar disrupts the ranks. |
| R3 | `pyre_nave` | Pyre Knight, (empty), The Confessor (3-4) | Rank 2 fills with Recanters; buffs are spent, not stored. |

## 5. What this world tests

- **Attrition and armour-piercing damage:** Hollow Flame and Ash-Mark go round Block and Armor, so Bulwark builds that live on Armor and Block (Last Bastion, Thornguard) must kill or cleanse, not wall up.
- **Cleanse and healing** (Alchemist Apothecary, Oracle sustain), and the Vessel, which can carry the company's flame on its own skin.
- **Buff economy:** the Confessor and the Pardoner punish stored buffs and laid Hex or Mark (Hexweaver, Oracle Fatebinder, Duelist Momentum held for later).
- **Fire builds** are blunted almost everywhere; water rewards Elementalist and Alchemist course play. Burst (Executioner, Accumulator) beats slow engines.
