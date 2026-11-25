# World VIII: The Sundered Rime (role map)

Gate 2 draft, 2026-11-25. Sources: `world_VIII_sundered_rime.md`, `RIVAL_RULERS.md`, `afflictions.md`, Combat Rules v2, `tools/content/worlds.py`.

## 1. World

**The Sundered Rime.** Courses: fire and frost. Conjunction: **Thermal Shock** (damage equal to power, and it strips Armor). Door 8 (Act III), so the reference company is level 6 to 7 with its second path passive and two runes. Affliction: **The Split** (lose 1 Armor for the rest of the fight).

Every body here is split, one side rimed and one side burning, and the crack between them is the world's mechanic. Thermal Shock is plain damage that also strips Armor, and the cast can trigger it on its own: hounds and fire-setters burn, thralls and seeresses rime, and the next opposite course cracks the hero. Several foes do both halves themselves over two turns, telegraphed. Together with The Split, this is the world that unmakes Armor: an Armor-stacking company loses its footing as the fight goes on and must lean on Block, Ward and healing. Turned around, Thermal Shock is the company's key to the armoured foes (the Shieldmaiden, the Musk Ox, the Jötun). But most bodies here live in both courses and resist them, so the cracks are the weak point: water (the quench that splits hot rock), physical blows, and the frost or fire a single-sided creature lacks.

## 2. Roster

Rank footprint follows the design language: Small, Human and Large take 1 rank; "(2 ranks)" marks a body wide or long enough to fill two.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Riven Jarl (`riven_jarl`) | ruler | attacker | 2 to 3 (2 ranks) | An axe blow that splits the ranks: fire on one hero, frost on the hero beside it, so the next blow cracks both. | Two halves: each turn one half leads (shown); he resists that half's course and not the other. | Resists fire and frost (by half, see trait) and physical; weak to water (the crack) |
| The Sleeper Under the Hold (`sleeper_under_the_hold`, new) | ruler | summoner | 2 to 4 (3 ranks) | Asleep at first: her breath vents steam from the adits and miners come out of them. Waking, the hanging hand comes down across two ranks and every adit gusts burning air. | Ground itself: cannot be moved or Stunned. The galleries: fire applied to her feeds the adits, and her next gust is stronger. | Immune frost (old glacier ice); weak to fire (the fire in her galleries is undoing her) |
| The Firstbreaker (`firstbreaker`, new) | ruler | attacker | 3 to 4 (2 ranks) | A pick blow from over the shaft rim onto rank 1, heat rolling up behind it; he hauls himself higher each phase, and each part that comes up cracks as it freezes. | The rim line: each phase change cracks him for a slice of his own HP. Holds the rim: cannot be moved. | Resists fire and frost; weak to physical (break his grip on the rim) |
| Jötun Thane (`jotun_thane`) | elite | attacker | 1 to 2 (2 ranks) | The ice club smashes rank 1; a quake hits every hero with frost. Melting: weaker each round in HP, stronger in blows. Answer move: Brace (Block and Might) when the company holds back to let him melt. | Round start: Melting: loses a little HP and gains Might. | Immune frost (a giant of the old ice); weak to fire |
| Twinflame Seeress (`twin_seeress`) | elite | afflicter | 3 to 4 | Twin bolts put fire on one hero and frost on another, then she swaps them (Thermal Shock on both); heals the most wounded ally. Answer move: Two Faces heals when the company focuses one foe. | On hit: Two faces: a fire hit is answered by her frost face (the attacker gains frost), a frost hit by her fire face. | Resists fire and frost; weak to void (a seer) |
| Berserker (`berserker`, new) | elite | attacker | 1 | A spinning double-axe sweep across ranks 1 and 2; he walked into the fire on purpose and fights harder the more he is hurt. Answer move: charges the hero who hit him most last round. | On hit: gains Might each time he is hit (fades at round end). | Resists fire and frost; weak to physical (he wears no armour) |
| Musk Ox (`musk_ox`, new) | elite | defender | 1 to 2 (2 ranks) | The horn-boss charge knocks a hero back a rank (Push) and wrecks the company's rank plan; guards the herd behind it. Answer move: charges whoever the company moved last. | Frozen curtain: heavy Armor from its iced coat, which Thermal Shock strips. | Resists frost and physical; weak to fire (the burnt belly) |
| Rimeburnt Thrall (`rime_thrall`) | foe | attacker | 1 | Chips at rank 1 with the pick and leaves it Vulnerable; shivers frost onto the back rank. | None | Resists frost; weak to fire |
| Magma Hound (`magma_hound`) | foe | attacker | 1 to 2 | A burning bite (Burn), a lunge at the back rank, and a steam howl for stress. Stress dealer. | None | Immune fire (molten inside); weak to frost (heat rule) |
| Obsidian Shieldmaiden (`obsidian_maiden`) | foe | defender | 1 | Shield wall for her allies; the glass edge cuts (Bleed); a shield bash Pushes. | Glass edges: Thorns. | Resists physical and fire (volcano glass); weak to water (quench shatters hot glass) |
| Steam Wraith (`steam_wraith`) | foe | afflicter | 2 to 3 | A scalding embrace (Burn), the breath of the deep ice (frost and stress on every hero), and it dissipates when hurt (Dodge). Stress dealer. | Vapour: physical hits deal reduced damage. | Resists fire, frost and physical; weak to lightning |
| Fissure Worm (`fissure_worm`) | foe | attacker | 3 to 4 | Bursts from the ice under the back rank on its first turn; gnaws (Bleed); burrows for Block. | None | Resists frost; weak to physical (a soft worm) |
| Fire-Setter (`fire_setter`, new) | foe | afflicter | 2 | The burning bundle (fire on a hero), then the bucket thrown after it next turn (frost): the hero cracks. A whole Conjunction from one foe, telegraphed over two turns. | None | Resists fire and frost; weak to toxin (the smoke he lives in) |
| The Skald (`skald`, new) | foe | afflicter | 3 to 4 | Adds a verse each round: stress to every hero, a little more each verse, and the saga lends his allies Might. Stress dealer. | None | Resists fire and frost; weak to void (silence ends a song) |
| Mead-Bearer (`mead_bearer`, new) | foe | support | 2 to 3 | Gives an ally the horn: it heals and strikes harder next turn. Never attacks. | None | Resists frost; weak to fire |
| Ore-Hauler (`ore_hauler`, new) | foe | attacker | 1 | Heaves the sledge round: burning ore spills over ranks 1 and 2 (damage and Burn); slow, shown a turn ahead. | On death: the load spills: Burn on the heroes in ranks 1 and 2. | Resists frost; weak to water (quench the burning stripe) |
| Snow Hare (`snow_hare`, new) | foe | afflicter | 3 to 4 | Listens, then drums: a crack runs under one hero and burning steam bursts up (fire and frost together, a small Thermal Shock). | None | Resists frost and fire; weak to physical |
| Pit Adder (`pit_adder`, new) | foe | attacker | 2 | The bite burns, then freezes: Bleed and both courses on one hero across two turns. | Coiled: strikes back at any hero who hits it in melee (Riposte). | Resists fire; weak to frost (it came up warm, and the cold is killing it) |
| Glacier Wolverine (`glacier_wolverine`, new) | foe | attacker | 1 | A lunging bite that tears (Bleed). It keeps coming back. | On death: once per fight, it returns next round at low HP. | Resists frost; weak to water (the crack at its collar) |

## 3. Rulers

**The Riven Jarl** (`rime_boss`, with an Obsidian Shieldmaiden in rank 1).
- Phase 1, On the Throne (full HP to about two thirds): opens with Riven Cleave across ranks 1 and 2 (fire on one, frost on the other). Then the halves take turns: Hoarfrost Crown (frost and stress on every hero) on frozen turns, Open the Fissure (fire on every hero) on burning turns. The company times its courses to the half that does not lead.
- Phase 2, the Frozen Half Cracks Away (to about a quarter): fire pours out. The two-halves trait ends: he no longer resists frost. Open the Fissure every other turn and Shatter on the back rank (Vulnerable).
- Phase 3, Burns and Freezes at Once (below a quarter): every blow carries both courses, so each hit is a Thermal Shock, and he cracks himself a little each turn. A race.
- Commission: "The Tooth is set in the pommel of his axe. He rules the split; close it."

**The Sleeper Under the Hold** (proposed room `rime_galleries`, the miners' adits cut into her chest; until it is built, `rime_crevasse`). Rank 1 is left for the miners.
- Phase 1, Asleep (to about two thirds): she never strikes. One slow breath a turn vents steam from the adits (small fire and frost on every hero), and Rimeburnt Thralls climb out of an adit into rank 1 (twice per fight at most).
- Phase 2, Stirring (to about a third): the hanging hand comes down across two ranks (heavy, frost) and the adits gust burning air on every hero, so the company carries both courses and Thermal Shock is always one hit away.
- Phase 3, Waking (below a third): hand and gust every turn; her breath now Weakens. Fire on her still feeds the gust.
- Commission: "The hold is built on the glacier, and the glacier on her. If she wakes the hold falls; put her to rest for good."

**The Firstbreaker** (proposed room `rime_shaft`, the deep shaft head under its headframe; until it is built, `rime_glacier`). Ranks 1 and 2 start empty.
- Phase 1, at the Rim (to about two thirds): opens by sending the two thralls on his back down into ranks 1 and 2 (once per fight). Then a pick blow onto rank 1 with heat rolling up (Burn on every hero), and the hoist chain swung to pull a back hero forward.
- Phase 2, Hauling Higher (to about a quarter): the rim line cracks him (the trait), and his chest comes up into the wind: the pick now hits two ranks, frost from the rim and fire from below on the same blow.
- Phase 3, Out of the Shaft (below a quarter): whatever is still down the shaft comes up burning. Fire on every hero each turn and the pick on rank 1.
- Commission: "He swung the pick that let the fire in, and he is climbing out. If he climbs out, the fire climbs with him. Send him back down."

## 4. Encounter plan

Rooms: `rime_glacier` (the glacier's surface, the cracked floe, steam vents), `rime_crevasse` (the crevasse with the hounds' vent at its foot; `rime_breach` is its old name, still in `data/rooms`), `rime_hall` (the jarl's mead-hall, its floor split down its length). Creatures listed from rank 1.

| Group | Creatures (rank 1 first) | Room | Tactical idea |
|---|---|---|---|
| The Cracked Floe | Rimeburnt Thrall, Rimeburnt Thrall, Fissure Worm | `rime_glacier` | The thralls make rank 1 Vulnerable while the worm bursts under the rear; cover the back on round 1. |
| Vent Hounds | Magma Hound, Magma Hound, Fire-Setter | `rime_crevasse` | The hounds Burn, the bucket quenches: Thermal Shock on whoever is burning. Ward or move the burnt hero before the bucket. |
| The Glass Gate | Obsidian Shieldmaiden, Steam Wraith, Snow Hare | `rime_hall` | Thorns on the wall, Dodge and physical cut on the wraith; soak the maiden (weak to water) and use courses on the wraith. |
| The Long Table | Glacier Wolverine, Mead-Bearer, The Skald | `rime_hall` | The mead keeps the wolverine coming and the saga builds stress; kill the Skald early. |
| The Shaft Head | Ore-Hauler, Fire-Setter, Rimeburnt Thrall | `rime_glacier` | Two telegraphed fire turns; Ward and spacing beat raw HP. Kill the Hauler where its spill hits least. |
| The Snake Pit | Pit Adder, Pit Adder, Steam Wraith | `rime_crevasse` | Adders riposte melee and the wraith shrugs physical; frost and ranged courses win. |
| Scavengers | Glacier Wolverine, Magma Hound, Snow Hare | `rime_crevasse` | Fast hitters and a foe that returns once; save a finisher for the second wolverine. |
| Steam and Stone | Rimeburnt Thrall, Steam Wraith, Fissure Worm | `rime_glacier` | Stress from the wraith, burst from the worm; a balanced test of front and back cover. |
| The Thane's Hall (elite) | Obsidian Shieldmaiden, Jötun Thane | `rime_hall` | He melts but grows stronger every round; burst him through the wall, or out-guard him, but not halfway. |
| Two-Faced Oracle (elite) | Magma Hound, Rimeburnt Thrall, Twinflame Seeress | `rime_glacier` | She answers every course with its opposite; hit her with physical, void or water, not fire or frost. |
| The Berserker (elite) | Berserker, Mead-Bearer, The Skald | `rime_hall` | Mead and saga feed him and every hit feeds him Might; few heavy hits beat many light ones. |
| The Ore Sledges (elite) | Musk Ox, Ore-Hauler, Fire-Setter | `rime_crevasse` | The ox Pushes the company out of rank and its curtain holds the Armor; crack it with Thermal Shock, then the rest. |

## 5. What this world tests

- **Armor-based defence:** Bulwark Ironwarden and Armor gear lose ground to The Split and every Thermal Shock; Block, Ward and healing must carry the late rounds.
- **Course choice for Elementalists:** most foes resist fire and frost, and the Seeress punishes them; water, lightning, void and physical are the answers, and Thermal Shock is the tool against the Armored few.
- **Telegraphed two-step threats:** Fire-Setter, Pit Adder, Snow Hare and the rulers show their crack a turn ahead, rewarding Ward, Swap and Oracle delay.
- **Many-hit builds against on-hit punishment:** the Berserker's Might, the Adder's riposte and the Shieldmaiden's Thorns tax Duelist Bladedancer and multi-hit cards.
- **Rank plans:** the Musk Ox's Push and the Firstbreaker's chain disrupt companies that rely on exact ranks.
