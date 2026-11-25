# World XV: The Torn Sky (role map)

Gate 2, Deliverable B. Roles and ideas only; numbers come at Gate 3 and scale with Threat, not with the world.

Lore note: this follows the bible. Heaven was torn by the void's betrayal of the Mother of Courses; there was no war. The game's world text ("a war of gods") and the game lore lines of the Fallen Angel and the Shattered God still carry the old story, as does the Fourfold Beast's line in `RIVAL_RULERS.md` ("The war took three of them"; the world file says "The void took three of them"). They should be rewritten from the world file at Gate 3.

## 1. World

**The Torn Sky.** Lightning + void. Conjunction: **Discharge** (2x power true damage, on foes and heroes alike). Affliction: **Seen** (Vulnerable this round). Rising doom: the tears in the sky widen, and something leans closer.

Discharge is the one Conjunction that nothing absorbs: it goes through Block and Armor alike, so the only defences are HP, healing, and keeping the two courses from meeting (Ward, cleanse, or a Vessel that carries them). Static (lightning) hurts a hero every time it acts, so the heroes who play the most cards bleed the most; Erode (void) thins Block and Ward; Seen makes a hero take half again from everything that round. This is the last world, and its cast tests the company's whole kit at once: heal-blocks, lock-outs, buff-free true damage, a judge that strikes the healthiest hero and a wheel that seeks the heaviest. The cast was never human. Heaven's own (angels, lions, doves, the Wheel and the Beast) are gold over black and were undone by the void, so they resist lightning and are weak to void; the things that came in through the tears are made of void and are weak to lightning. Most fights mix the two, so a company with one damage course has to switch.

## 2. Roster

Ranks: 1 is the front. Elites of scale 2.3 and up, and every ruler, take 2 ranks.

| Creature (key) | Tier | Role | Ranks | Combat idea | Trait | Resistances |
|---|---|---|---|---|---|---|
| The Shattered God (`shattered_god`) | Ruler | Afflicter | 3-4 (2 ranks) | She wills nothing: her fragments drift, and each intent hits the rank its fragment drifts over (shown). The burns flare along every crack and open across the heroes (Discharge). | Round start: void leaks from a crack and a Rift Hound comes through into an empty rank (capped). | Imm void; res lightning; weak open (the game's toxin has no lore ground) |
| The Wheel of Thrones (`wheel_of_thrones`) (new) | Ruler | Attacker | 1-2 (2 ranks) | The rim grinds along the front; then it spins up, the hub eye opens, and a discharge leaps from every eye at once across the party. | Round start: looks for the weight; its next single-target hit goes to the hero with the most Block and Armor. | Res lightning; weak void |
| The Fourfold Beast (`fourfold_beast`) (new) | Ruler | Attacker | 1-2 (2 ranks) | Its faces turn in a fixed order: the lion's face roars (a physical blow), and from the void where the man, ox and eagle were, a discharge. | Round start: the next face in the order turns to the company (shown). | Res lightning; weak void |
| Thunder Seraph (`thunder_seraph`) | Elite | Defender | 1-2 (2 ranks) | Holds the sky together: while it strains, Hymn gives Block and Might to every foe; when it strikes down the spear, lightning hits the back. | Round start: below half HP it is losing the tear; a Rift Hound comes through every few rounds. | Res lightning; weak void |
| Rift Leviathan (`rift_leviathan`) | Elite | Attacker | 3-4 (2 ranks) | Lunges through the tear to swallow the front hero; Tear the Sky lays void on all; coils away (Block, Dodge). | Round start: surfaces at a new pair of ranks, shown in its intent, swapping with the foes there. | Imm void; weak lightning |
| The Recording Angel (`recording_angel`) (new) | Elite | Afflicter | 3 | Strikes a hero's name out: a discharge hits that hero, who cannot be healed until the turn after next. | On death: the struck names are restored; every heal-block ends. | Res lightning; weak void |
| The Weigher of Souls (`weigher_of_souls`) (new) | Elite | Attacker | 2-3 (2 ranks) | Weighs the party: the pans tip, the needle settles on the hero with the most HP, and a discharge strikes them. | Round start: shows which hero the needle points at, so the company can even its HP out. | Res lightning; weak void |
| Fallen Angel (`fallen_angel`) | Foe | Attacker | 1 | A desperate sword strike on the front; a smite lays lightning on the back. | On death: strikes once more; it has not stopped fighting. | Res lightning; weak void |
| Rift Hound (`rift_hound`) | Foe | Attacker | 1-2 | Lunges from a rift: bites the back rank with void; a heavy maul on the front. The God's and the Seraph's summon. | None | Imm void; weak lightning |
| Storm Shade (`storm_shade`) | Foe | Afflicter | 3-4 | Lightning that forgot to stop: a static shroud on every hero, then a Volatile arc that sets off Discharge. | On death: its last strike discharges into the nearest hero (lightning). | Imm lightning; res physical; weak water |
| Choir of Eyes (`choir_of_eyes`) | Foe | Afflicter | 3-4 | Sings the last hymn: stress on every hero; weeps void onto the back. | None | Res void; weak physical |
| Skywreck Knight (`skywreck_knight`) | Foe | Defender | 1 | A fused shell: Aegis gives Block to every foe; a lance charge stuns. | None | Res lightning, physical; weak void |
| Porter of Heaven (`porter_of_heaven`) (new) | Foe | Defender | 1 | Swings the key: on a hit the hero is locked and loses its next turn; the gate grille guards the foe behind. | None | Res lightning; weak void |
| Herald of Heaven (`herald_of_heaven`) (new) | Foe | Afflicter | 2-3 | Sounds the end: a discharge rolls along ranks 1 and 2 and causes stress. | None | Res lightning; weak void |
| Putto (`putto`) (new) | Foe | Attacker | 3-4 | Looses an arrow that carries a discharge into a back-rank hero. | None | Res lightning; weak void |
| Scorched Doves (`scorched_doves`) (new) | Foe | Afflicter | 3-4 | A swarm: the flock dives through a hero and discharges; the bad messages add stress. | None | Res lightning; weak void |
| Throne Lion (`throne_lion`) (new) | Foe | Attacker | 1 | A pounce: the two halves slam together on impact, a heavy single blow. | None | Res lightning; weak void |
| Rift Crawler (`rift_crawler`) (new) | Foe | Attacker | 1-2 | Eats the floor of heaven: a rearing lunge and a bite that eats the hero's Block. | None | Imm void; weak lightning |
| Star-Lighter (`star_lighter`) (new) | Foe | Support | 2-3 | Doing its best: tries to relight a star (Block and Might for an ally), or swings the caged dead star down onto a hero, where it discharges. | None | Res lightning; weak void |

Stress dealers among the 12 foes: Choir of Eyes, Herald of Heaven, Scorched Doves.

## 3. Rulers

**The Shattered God** (`shattered_god`, room `sky_boss`). Signature: Discharge made large. She has no will, so her moves read as things that happen near her, never as choices.
- Phase 1, "Slumped" (full to 60%): the fragments drift over ranks in a shown order; void seeps (Erode on the ranks below), the burns lay lightning.
- Phase 2, "The cracks open" (60% to 25%): void leaks every round and Rift Hounds come through; every second round the burns flare along every crack and Discharge every hero carrying both courses.
- Phase 3, "Shattered" (below 25%): the pieces fly apart; Discharge on every hero each round. The Tooth, floating where her heart was, is exposed and takes extra damage.
- Commission: Sister Ide keeps the Teeth and says they are warm. This is the last of them, the shard where the Mother's heart was.

**The Wheel of Thrones** (`wheel_of_thrones`, room `sky_throne`, the throne steps whose seat it carried; the room is the older round-1 layout of the steps, kept in the data).
- Phase 1, "Turning": the rim grinds the front each round; the eyes roll past and lay lightning on the hero it is weighing.
- Phase 2, "Spinning up" (below 50%): the hub eye opens every second round: a discharge from every eye across the party. The sprung tyre band strikes rank 2 between spins.
- Commission: it is still turning, looking for the weight, and it has found the Tooth. The abbey would rather it carried nothing.

**The Fourfold Beast** (`fourfold_beast`, room `sky_ruins`, among the guardians fallen at their posts).
- Phase 1, "Four winds": the faces turn in order; one physical blow, then three discharges from the empty faces, then the lion again.
- Phase 2, "Only the lion" (below 50%): it stops turning. The lion roars every round, and the three voids discharge together on three ranks every second round.
- Commission: it watched the throne from every side, and now it watches the Tooth. The abbey sends a company to be watched instead.

## 4. Encounter plan

| # | Room | Ranks 1 to 4 | Tactical idea |
|---|---|---|---|
| F1 | `sky_ruins` | Fallen Angel, Fallen Angel, Storm Shade | Kill the shade before its arc; each angel strikes once more as it falls. |
| F2 | `sky_gate` | Rift Hound, Rift Hound, Choir of Eyes | Void-immune hounds; lightning or physical, then the choir. |
| F3 | `sky_choir` | Skywreck Knight, Herald of Heaven, Choir of Eyes | A guarded stress pair. |
| F4 | `sky_throne` | Throne Lion, Throne Lion, Putto | Two heavy pounces up front, true damage from the back. |
| F5 | `sky_gate` | Porter of Heaven, Rift Crawler, Scorched Doves | Locked out, Block eaten, then the flock discharges. |
| F6 | `sky_choir` | Fallen Angel, Star-Lighter, Putto, Scorched Doves | Three back-rank threats behind one sword. |
| F7 | `sky_ruins` | Skywreck Knight, Storm Shade, Herald of Heaven | The shade feeds the herald's discharge; Ward the front. |
| F8 | `sky_gate` | Rift Crawler, Rift Hound, Storm Shade | All three resist or ignore one course; switch damage types. |
| E1 | `sky_choir` | Thunder Seraph (1-2), Fallen Angel, Choir of Eyes | Below half it lets the hounds in; burst it through the last half. |
| E2 | `sky_gate` | Rift Hound, Rift Crawler, Rift Leviathan (3-4) | It moves every round; read its intent before targeting. |
| E3 | `sky_choir` | Porter of Heaven, The Recording Angel, Putto | Healing is struck out; kill the Angel to restore it. |
| E4 | `sky_gate` | Skywreck Knight, The Weigher of Souls (2-3), Scorched Doves | Keep HP even across the company; the healthiest hero is the target. |
| R1 | `sky_boss` | Skywreck Knight, (empty), The Shattered God (3-4) | Rank 2 fills with hounds; keep the two courses apart. |
| R2 | `sky_throne` | The Wheel of Thrones (1-2), Throne Lion, Putto | It seeks the tank; spread Block and Armor. |
| R3 | `sky_ruins` | The Fourfold Beast (1-2), Herald of Heaven, Putto | Read the face order; Ward before the void faces. |

## 5. What this world tests

- **Everything at once, as the finale:** true damage tests HP and healing; Static punishes high-action builds (Duelist Momentum, Bladedancer, any many-card turn); Erode and Discharge make Block a weak plan.
- **Tank plans:** the Weigher strikes the healthiest hero and the Wheel the heaviest, so a lone Bulwark that soaks everything is punished; Bulwark must protect without holding all the HP.
- **Healing and lock-outs:** the Recording Angel blocks healing (Apothecary, Oracle), the Porter takes turns.
- **Damage switching:** void builds (Hexweaver, void Elementalist, Plaguewright) beat heaven's own; lightning builds beat the rift beasts; single-course companies stall. The Vessel, which can carry lightning and void without harm, is the natural counter to Discharge.
