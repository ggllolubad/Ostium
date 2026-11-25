# Gate 2 decisions (Cole, 2026-11-25)

Cole approved Gate 3 on the recommendations in the Gate 2 review doc, and answered the four items flagged for him.
Every row below is binding for Gate 3.

| # | Area | Decision |
|---|---|---|
| 1 | Doom | Moves from the Oracle to the Hexweaver's Doomsayer. Doom does not fade. Every execute check treats a foe's HP as lower by its Doom. At round end a foe whose Doom meets its HP dies (Toll). Cole: approved. |
| 2 | Riposte | The Duelist's alone; the Bulwark answers blows with Thorns. |
| 3 | Bleed and Lightning | Bleed leaves the Thornguard (one bridge card stays). The Duelist keeps about 5 lightning cards. |
| 4 | Elementalist starter | 5 starters apply the attuned course. Focus can be given to another hero for course cards. |
| 5 | Ailment | Shared word for a harmful status or course stack on a hero, kept apart from affliction cards. |
| 6 | Keywords | Scars, Shatter, Finisher, Execute, Conjoin, Spectrum, Fresh, Dosed, Omen, Rite get hover text, as do Thorns, Fortify, Anchor, Dodge and Attuned. The list is closed for Gate 3 (see `../GATE3_VOCAB.md`). |
| 7 | Execute on rulers | Execute, Absolute Zero and Doom kills drop a ruler to its next phase, never kill it outright. |
| 8 | Belt | Using a flask costs no vigour, at most one per hero per round, fixed slots; brewed flasks are Fresh and spoil at fight end. |
| 9 | Delay limit | A foe can be pushed into the next round only once in a row. |
| 10 | Vessel stacks | Cole, 2026-11-25: held courses follow the normal course rule (fall by 1 at round end), capped at 6 per course, and everything held clears when a fight ends, so nothing carries into the next fight. Paths Hearth, Mouth and Whole approved as proposed. The Vessel is drafted last. |
| 11 | Vessel unlock | Cole, 2026-11-25: the Vessel is an additional calling. The Elementalist and its Prismatic path stay on the roster. The Vessel works like every other calling: its own level, gear and progression from its unlock. |
| 12 | Rival ruler rooms | Rivals fight in their world's ruler room with a rival-specific prop layer for the playable build; full rooms later. Cole: approved. |
| 13 | Rank footprint | Foes 1 rank. Elites 1 rank; at most one elite per world takes 2 ranks, in at most 1 of its 4 elite groups, always with companions. Rulers 2 ranks, and every ruler fight starts with the other ranks filled (escorts or summons). Nothing takes 3 ranks. Cole: approved, with the instruction not to "nullify the complexity of rank by having one massive enemy often". |
| 14 | New enemy mechanics | Countdowns (the `charge` counter), Swarm and adding cards to a hero's hand are in. Gold theft and swallowing a hero wait until after the playable build. |
| 15 | Holy creatures | Heaven's creatures, the Frozen Saint and the Pyre Seraph are weak to void. |
| 16 | Lore fixes | Torn Sky text loses "a war of gods" (4 places; the bible says betrayal). The Drowned Choirboy resists void. |

## Difficulty and scaling (Cole, 2026-11-25)

- Err on the side of harder: real players will out-play the simulator.
- Enemies scale with descents completed (Threat), never with which world is rolled. Creature numbers in Gate 3 are
  written at Threat 0; `Run.THREAT_HP` and `Run.THREAT_DMG` scale them.
