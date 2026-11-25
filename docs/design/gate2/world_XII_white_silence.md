# World XII: The White Silence (role map)

Gate 2, Deliverable B. Roles and ideas only; numbers come at Gate 3 and scale with Threat, not with the world.

## 1. World

**The White Silence.** Frost + void. Conjunction: **Absolute Zero** (on a foe: killed outright at 2x power HP or less, rulers drop to their next phase; on a hero: loses 2x power HP through Block). Affliction: **The Hush** (gain 2 Erode). Rising doom: the sound leaves, footsteps first, then voices, then heartbeats.

Every defence the company owns is thinned here. Erode cuts the Block and Ward a hero gains, the Hush adds more of it, and Absolute Zero ignores Block entirely. A hero carrying stable frost (Weaken) and void (Erode) is a hit waiting to happen: one Volatile frost or void touch turns both into HP loss. The way through is to keep stacks off (Ward early, before Erode builds; cleanse), kill the appliers, and carry enough HP and healing to absorb the cash-in. The company's own Absolute Zero is the world's lure: nearly every creature resists or is immune to frost or void, so it lands half-strength at best, but it can still knock a ruler into its next phase. It is also the heaviest stress world of the five: silence is the threat, and four of the twelve foes deal stress. Heat undoes almost everything here: fire is the common weakness, and holy things (the Frozen Saint) are weak to void.

## 2. Roster

Ranks: 1 is the front. Elites of scale 2.3 and up, and every ruler, take 2 ranks.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Cold Star (`cold_star`) | Ruler | Afflicter | 3-4 (2 ranks) | The eye opens and warmth drains from a hero: Absolute Zero scaled by that hero's frost and void. | Round start: the warmest hero (most HP) gains 1 frost. On hit: hits land harder in rounds when the eye is open. | Imm void; res frost; weak lightning |
| The Unspoken Bear (`unspoken_bear`) (new) | Ruler | Attacker | 1-2 (2 ranks) | Two-pawed downward blow on ranks 1 and 2, then a roar with no sound that fills the company with dread (stress). | On hit: each hero who strikes her gains 1 stress (the hunters' rule). | Res frost, void; weak fire |
| The Hearth Grandmother (`hearth_grandmother`) (new) | Ruler | Summoner | 3-4 (2 ranks) | Calls the faceless who come to be fitted (Hollow Wanderers) into empty ranks; her stitch blanks a hero's face: no kit skill and no Swap for a round. | Round start: each Hollow Wanderer on the field gains Block while it waits to be fitted. | Res frost, void; weak fire |
| The Pale Hunter (`pale_hunter`) | Elite | Attacker | 2-3 | Hunts the warm: arrows at the hero with the most HP; marks prey (Vulnerable); tracks (Dodge, Might). | Round start: takes the hero with the most HP as its prey; a hero at full HP takes more from it. | Res frost, void; weak fire |
| Void Mammoth (`void_mammoth`) | Elite | Attacker | 1-2 (2 ranks) | Tramples the front, tusks one hero, trumpets stress and void over everyone. | On hit by Stun: ignores it ("it did not notice"). | Res frost, void, physical; weak fire |
| The Drum-Seer (`drum_seer`) (new) | Elite | Summoner | 2-3 | One hard beat: the cold goes out through the hole in the drum and weakens ranks 1 and 2 (frost). He calls the herd: a Silence Stag enters an empty rank. | On death: the herds stop coming; summoned Stags flee. | Res frost, void; weak fire |
| The Voiceless Chief (`voiceless_chief`) (new) | Elite | Support | 2 | The baton points at one hero: every foe acts against that hero first, over any Taunt. Between orders he directs an ally (Might). | Round start: points at the hero who dealt the most damage last round. | Res frost, void, physical; weak fire |
| Hollow Wanderer (`hollow_wanderer`) | Foe | Attacker | 1-2 | Crook blow that reaches the back; Emptiness lays void and stress on the front. | None | Res void, frost; weak fire |
| Silence Stag (`silence_stag`) | Foe | Attacker | 1 | A silent antler charge on the front; a stamp that stuns. The Drum-Seer's herd beast. | None | Res frost; weak fire |
| Starless Eye (`starless_eye`) | Foe | Afflicter | 3-4 | A stare that causes stress and void on the back rank; blinks out of a hit. | On death: its torn void edge spills 1 void on the hero who killed it. | Imm void; weak lightning |
| Frozen Saint (`frozen_saint`) | Foe | Support | 2-3 | Silent prayer heals allies; a cold blessing weakens (frost). | None | Res frost; weak void (holy) |
| Rime Shade (`rime_shade`) | Foe | Attacker | 1-2 | A shadow peeling off the snow: rises and envelops with a Volatile frost touch that cashes in the hero's void. | None | Imm void; res frost, physical; weak fire |
| Ice-Fisher (`ice_fisher`) (new) | Foe | Afflicter | 3-4 | Jerks the line: something unseen pulls a hero forward a rank, toward the hole; a hero dragged to rank 1 gains void. | None | Res frost, void; weak fire |
| Hush-Child (`hush_child`) (new) | Foe | Afflicter | 3-4 | A long silent cry: stress across the whole company every round it lives. | On death: the cry stops; every hero sheds some stress. | Res frost, void; weak fire |
| Lemming Drift (`lemming_drift`) (new) | Foe | Attacker | 1-2 | A swarm: pours over a hero and gnaws, many small bites that strip Block. | On hit: single-target hits deal less, hits on every foe deal more. | Res frost; weak fire |
| Lead Dog (`lead_dog`) (new) | Foe | Attacker | 1 | Lunge, bite and drag: pulls the bitten hero forward, as if the team were still pulling. | None | Res frost; weak fire |
| Sledge Hauler (`sledge_hauler`) (new) | Foe | Defender | 1 | Leans into the strap as a wall (Block for the foes behind), then lets it go slack and swings the sledge into ranks 1 and 2. | None | Res frost; weak fire |
| The Silent Singers (`silent_singers`) (new) | Foe | Afflicter | 2-3 | A song no one can hear: stress and Erode on every hero, louder each round neither of them is hit. | None | Res frost, void; weak fire |
| Snow-House Builder (`snow_house_builder`) (new) | Foe | Attacker | 1-2 | Brings the block down on a hero and buries them: that hero loses its next action but cannot be targeted while buried. | None | Res frost, void; weak fire |

Stress dealers among the 12 foes: Hollow Wanderer, Starless Eye, Hush-Child, The Silent Singers.

## 3. Rulers

**The Cold Star** (`cold_star`, room `silence_boss`). Signature: Absolute Zero made large.
- Phase 1, "High over the lake" (full to 60%): Black Gaze (stress on all) and Stop the Warmth (stable frost on all); every third round the eye opens and drains the warmest hero.
- Phase 2, "It opens wider" (60% to 25%): the eye opens every second round and drains every hero carrying both frost and void at once; Star Lance hits the back.
- Phase 3, "It comes down" (below 25%): the disc fills the sky; Collapse on the front each round, and the pale moon (the Tooth) passes low enough to strike, taking extra damage.
- Commission: the camp's last fire went out the night the star came down. The abbey wants the small pale moon that circles it before the star notices the door.

**The Unspoken Bear** (`unspoken_bear`, room `silence_tundra`, on the herd's trail).
- Phase 1, "Reared": the two-pawed blow and the soundless roar alternate; every strike against her costs the striker stress, so few large hits beat many small ones.
- Phase 2, "No throat" (below 50%): the black mouth opens: a bite that is Absolute Zero on one hero, and the roar now also lays void on every hero.
- Commission: the hunters never said her name, and the ones who did are in her flank. She has come down to claim the star's Tooth. The company is asked not to speak of her on the way.

**The Hearth Grandmother** (`hearth_grandmother`, room `silence_camp`, where her dead hearth and strung masks are drawn; the room is the older round-1 camp, kept in the data beside `silence_tundra`).
- Phase 1, "Sewing": calls Hollow Wanderers into empty ranks (capped); the stitch takes one hero's kit skill and Swap for a round.
- Phase 2, "None of them fit" (below 50%): she cuts the failed masks loose: each Wanderer that falls gives her Might, and the stitch takes two heroes.
- Commission: the faceless of the camp are walking toward the door to be fitted. The commission is to end the fitting where it starts.

## 4. Encounter plan

| # | Room | Ranks 1 to 4 | Tactical idea |
|---|---|---|---|
| F1 | `silence_tundra` | Rime Shade, Hollow Wanderer, Hollow Wanderer | Wanderers lay void; the shade's Volatile frost cashes it in. Ward the front. |
| F2 | `silence_tundra` | Lead Dog, Sledge Hauler, Hollow Wanderer | The team: the dog drags heroes forward into the sledge's swing. |
| F3 | `silence_shrine` | Frozen Saint, Starless Eye, Frozen Saint | Heals and stress; the saints are the one target here weak to void. |
| F4 | `silence_rift` | Rime Shade, Starless Eye, Rime Shade | Void-immune shadows; fire or physical only. |
| F5 | `silence_camp` | Snow-House Builder, The Silent Singers, Hush-Child | The stress camp: kill the child first, hit the singers to quiet them. |
| F6 | `silence_camp` | Lemming Drift, Lead Dog, Ice-Fisher | Block is gnawed away while heroes are pulled into rank 1. |
| F7 | `silence_rift` | Silence Stag, Lemming Drift, Starless Eye | Area damage for the drift, single burst for the stag. |
| F8 | `silence_shrine` | Sledge Hauler, Frozen Saint, The Silent Singers, Hush-Child | A wall, a healer and two voices: a stress race. |
| E1 | `silence_tundra` | Silence Stag, The Pale Hunter, Hollow Wanderer | The tank at full HP is the prey; spread the damage. |
| E2 | `silence_rift` | Void Mammoth (1-2), Rime Shade | Stuns do not stop the trample; Block and heal through it. |
| E3 | `silence_camp` | Lead Dog, The Drum-Seer, (empty), Hush-Child | Rank 3 is left for the herd; kill the seer and the stags run. |
| E4 | `silence_tundra` | Sledge Hauler, The Voiceless Chief, Snow-House Builder, Starless Eye | His orders override Taunt; the builder buries your guard. |
| R1 | `silence_boss` | Frozen Saint, Ice-Fisher, The Cold Star (3-4) | Strip stacks before each open eye. |
| R2 | `silence_tundra` | The Unspoken Bear (1-2), Lemming Drift | Hit her hard and seldom; clear the drift with area damage. |
| R3 | `silence_camp` | Hollow Wanderer, (empty), The Hearth Grandmother (3-4) | Rank 2 fills each round; reach the back ranks. |

## 5. What this world tests

- **Block and Ward defence** (Bulwark Block, Elementalist Catalyst Ward): Erode thins it and Absolute Zero goes through it. HP, healing and stack removal carry the fights.
- **Stress management:** the heaviest stress world; tests Oracle and any stress-relief build, and the Bear's on-hit stress punishes multi-hit Bladedancer and Bloodletter play in favour of Executioner-style single blows.
- **Frost and void builds** (Elementalist Absolute Zero, void Hexweaver and Plaguewright lines) are blunted by resistance; fire builds are rewarded. The Vessel, which carries courses without harm, is strong here.
- **Target priority** (Hush-Child, Drum-Seer, Grandmother's summons) and **back-rank reach**; the Chief and the Hunter test Taunt and tank plans.
