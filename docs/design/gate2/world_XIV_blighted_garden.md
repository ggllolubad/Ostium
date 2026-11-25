# World XIV: The Blighted Garden (role map)

Gate 2, Deliverable B. Roles and ideas only; numbers come at Gate 3 and scale with Threat, not with the world.

## 1. World

**The Blighted Garden.** Toxin + void. Conjunction: **Blight** (on a foe: no healing or Block for 2 rounds; on a hero: no healing). Affliction: **The Bloom** (gain 1 Toxin and 1 Erode). Rising doom: the blooms open, and the eyes in the leaves turn toward you.

The garden shuts down sustain from both sides. On the company, Toxin cuts healing and Armor, Erode cuts Block and Ward, and Blight stops healing outright, so a company that plans to absorb a long fight cannot. On the foes' side the garden keeps growing: Renewal, Take Root, Tend the Garden, regrowing hedge and blooming beds all heal or regenerate, and the gardeners sprout new husks where allies fall. The fight is decided by who denies whose sustain: the company's own Blight (toxin plus void) and Toxin stop the regrowth, fire burns it, and burst kills before it matters. The eyes add the garden's other trick: the Lady puts the back rank to sleep and the Fool turns a hero's blow onto an ally. Almost everything here lives in or is made of the rot, so toxin builds are resisted everywhere; fire undoes every plant, fungus and straw body.

## 2. Roster

Ranks: 1 is the front. Elites of scale 2.3 and up, and every ruler, take 2 ranks.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Antlered Mother (`antlered_mother`) | Ruler | Support | 3-4 (2 ranks) | A spore exhalation stops healing for every hero; Renewal heals her and the garden; her roots raise a Root Horror. | Round start: regrows a little unless she is Blighted. | Imm toxin; res void; weak fire |
| The Lady of the Bower (`lady_of_the_bower`) (new) | Ruler | Afflicter | 3-4 (2 ranks) | Blows across her palm: spore settles over the company and puts ranks 3 and 4 to sleep (Stun). Calls a Flower-Strewer. | Round start: a bloom opens on the bed; each open bloom gives her Regen until fire burns it. | Res toxin, void; weak fire |
| The Green Lion (`green_lion`) (new) | Ruler | Attacker | 1-2 (2 ranks) | A downward swipe of the thorn claws on ranks 1 and 2; the puffball mane smokes spore (Toxin) over the company. | Round start: regains HP (clipped and grown back) unless it took fire damage last round. | Res toxin, void; weak fire |
| The Gardener (`the_gardener`) | Elite | Support | 2 | A shear cut prunes a buff off a hero; Tend the Garden heals every foe; Sow Blight on all. | On ally death: the fallen ally's rank sprouts a Fungal Husk next round (once). | Res toxin, void, physical; weak fire |
| Blight Dryad (`blight_dryad`) | Elite | Afflicter | 2-3 | Roots burst from the ground under the back rank (Anchored, Toxin); bark claws twice; Take Root below half. | Round start: gains Regen while below half HP, unless Blighted. | Imm toxin; res void; weak fire |
| The Lady's Fool (`ladys_fool`) (new) | Elite | Afflicter | 2-3 | Cartwheels to a hero and slaps with the bauble: the spores make that hero's next action strike an ally. | On hit: the puffball bells puff 1 Toxin onto the hero who hit him. | Res toxin; weak fire |
| The Truffle Boar (`truffle_boar`) (new) | Elite | Attacker | 1 | A tusking charge into the front rank leaves spore in the wound (Toxin); the snout ploughs through part of the hero's Block. | On hit: a melee attacker gains 1 Toxin from the fungal crest. | Res toxin, physical; weak fire |
| Fungal Husk (`fungal_husk`) | Foe | Afflicter | 1-2 | Lurches at the front; Spore Burst lays Toxin on every hero. The Gardener's sprout. | On death: bursts, 1 Toxin on every hero. | Imm toxin; weak fire |
| Spore Deer (`spore_deer`) | Foe | Attacker | 1 | Antler rake on the front; shakes the spores (Toxin and stress on all); bolts below half. | None | Res toxin; weak fire |
| Thorn Knight (`thorn_knight`) | Foe | Defender | 1 | Briar Guard: Block and Thorns; the thorn blade bleeds. | On hit: Thorns, punishing multi-hit attackers. | Res toxin, physical; weak fire |
| Moth Witch (`moth_witch`) | Foe | Afflicter | 3-4 | The eyes on her wings blink: stress on the back rank; void dust Erodes every hero. | None | Res void; weak physical |
| Root Horror (`root_horror`) | Foe | Attacker | 1 | A root grasp Anchors a back hero; the ring mouth bites the front. The Mother's summon. | None | Res toxin; weak fire |
| Scarecrow (`scarecrow`) (new) | Foe | Afflicter | 1-2 | Lurches forward on its pole and clubs with the crossbar arm; put up to frighten, it adds stress to the hero it faces. | None | Res toxin; weak fire |
| Blight Snails (`blight_snails`) (new) | Foe | Afflicter | 2-3 | Slide over a hero: where they touch the skin rots (Blight, no healing for 2 rounds). | On hit: the first hit each round glances off a shell (reduced). | Res toxin, void; weak fire |
| Flower-Strewer (`flower_strewer`) (new) | Foe | Support | 3-4 | Strews petals: Regen for an ally, or a flung handful that blooms on a hero (Toxin and Erode). The Lady's summon. | None | Res toxin; weak fire |
| Mole-Catcher (`mole_catcher`) (new) | Foe | Attacker | 2 | A two-handed spade stab: the ground gives way under a hero (pushed back a rank, Vulnerable). | None | Res toxin; weak fire |
| Pond Swan (`pond_swan`) (new) | Foe | Defender | 1 | Lunges and beats its wings: knocks a hero back a rank; hisses over the foe behind it (Block). | None | Res toxin, void; weak fire |
| Orchard Picker (`orchard_picker`) (new) | Foe | Attacker | 2-3 | Throws a rotten fruit that bursts in spore on the target and its neighbours (Toxin). | None | Res toxin; weak fire |
| Beekeeper (`beekeeper`) (new) | Foe | Afflicter | 2-3 | Thumps the skep: a cloud of spore pours over a hero (Toxin and Erode); the smoking torch shrouds an ally (Dodge). | None | Res toxin; weak fire |

Stress dealers among the 12 foes: Spore Deer, Moth Witch, Scarecrow.

## 3. Rulers

**The Antlered Mother** (`antlered_mother`, room `garden_boss`). Signature: Blight made large.
- Phase 1, "The heart" (full to 55%): Gore on the front, Blight Bloom (Toxin and void on all), Renewal when hurt.
- Phase 2, "All her eyes open" (55% to 20%): Hundred Eyes (stress) every round she does not bloom; her roots raise a Root Horror into an empty rank (capped).
- Phase 3, "The fungus takes her whole" (below 20%): she stops healing herself; every bloom now Blights every hero (no healing) and Erodes them. A race against a company that can no longer heal.
- Commission: the garden is spreading toward the door. The abbey wants the Tooth out of the fork of her antlers before the spores find it.

**The Lady of the Bower** (`lady_of_the_bower`, room `garden_walk`, her own rose walk; the room is the older round-1 layout of the walk, kept in the data).
- Phase 1, "Asleep": a sigh of pollen and the sleeping spore on the back rank alternate; blooms open each round and feed her Regen.
- Phase 2, "Spring keeps coming" (below 50%): she rises on her elbow; every open bloom now also gives Regen to each foe, and she calls a Flower-Strewer into an empty rank. Fire on the bed is the answer.
- Commission: she has woken enough to want her garden's heart back. The abbey would rather she slept.

**The Green Lion** (`green_lion`, room `garden_hedge`, the yew maze by the gate).
- Phase 1, "Rampant": the thorn swipe on ranks 1 and 2 and the smoking mane alternate; it regrows each round it is not burned.
- Phase 2, "Clipped through" (below 50%): the void-clipped holes widen; it loses Armor but swipes twice, and the shears left in its flank can be struck for extra damage (open: whether as a weak point or a status).
- Commission: the hedge at the gate has decided it is the garden's lion in earnest. It wants the crown in her antlers, and the company is sent to cut it back.

## 4. Encounter plan

| # | Room | Ranks 1 to 4 | Tactical idea |
|---|---|---|---|
| F1 | `garden_grove` | Root Horror, Fungal Husk, Fungal Husk | Husks burst on death; kill them with Ward up or from the back. |
| F2 | `garden_grove` | Spore Deer, Spore Deer, Moth Witch | Stress from two sides; area damage. |
| F3 | `garden_hedge` | Thorn Knight, Scarecrow, Moth Witch | Thorns punish many hits; reach rank 3. |
| F4 | `garden_heart` | Root Horror, Mole-Catcher, Blight Snails | Anchored and pushed back, then healing shut off. |
| F5 | `garden_walk` | Pond Swan, Flower-Strewer, Beekeeper | The strewer heals what the swan shields; burn the back. |
| F6 | `garden_grove` | Scarecrow, Orchard Picker, Beekeeper | Spore on clustered heroes; spread the ranks or cleanse. |
| F7 | `garden_heart` | Thorn Knight, Fungal Husk, Blight Snails, Moth Witch | A slow grind with no healing; burst through it. |
| F8 | `garden_walk` | Pond Swan, Mole-Catcher, Orchard Picker, Flower-Strewer | Rank chaos: heroes knocked back and dropped a rank. |
| E1 | `garden_hedge` | Fungal Husk, The Gardener, Flower-Strewer | Every fallen ally sprouts a husk; kill the Gardener first. |
| E2 | `garden_grove` | Spore Deer, Blight Dryad, Moth Witch | Keep Blight on the Dryad or she regrows. |
| E3 | `garden_walk` | Thorn Knight, The Lady's Fool, Flower-Strewer | His slap turns your hardest blow onto a friend; plan small. |
| E4 | `garden_heart` | The Truffle Boar, Mole-Catcher, Beekeeper | The boar ploughs, the ground gives way; Block early. |
| R1 | `garden_boss` | Thorn Knight, (empty), The Antlered Mother (3-4) | Rank 2 fills with roots; deny her Renewal. |
| R2 | `garden_walk` | Pond Swan, (empty), The Lady of the Bower (3-4) | Burn the blooms; keep the back rank awake. |
| R3 | `garden_hedge` | The Green Lion (1-2), Fungal Husk | Fire every round or it grows back. |

## 5. What this world tests

- **Sustain builds:** Alchemist Apothecary, Oracle healing and any Regen plan lose their healing to Blight; Bulwark loses Armor to Toxin and Block to Erode.
- **Anti-healing:** the company's Blight and Toxin decide fights against Renewal, Take Root and the Lady's blooms; Alchemist Plaguewright and toxin-void Hexweaver lines shine as denial, though raw toxin damage is resisted everywhere.
- **Fire** (Elementalist, Transmuter) is the common weakness; the Vessel can take the company's Toxin and Erode onto itself.
- **Back-rank and control pressure:** the Lady's sleep hits Oracle, Hexweaver and Elementalist in ranks 3 and 4; the Fool punishes single huge blows (Executioner, Last Bastion); Thorns punish multi-hit (Bladedancer).
