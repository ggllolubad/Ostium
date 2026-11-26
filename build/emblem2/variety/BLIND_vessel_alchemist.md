# Variety pass blind tests: Vessel and Alchemist (fresh agents, unlabelled sheets)

Scorer synonym match, then hand-checked.
- **Vessel: 82 of 88 (93%). PASS.** Hand-passed: 49 and 87 cup (read as chalice), 63 cruets (two bottles, alt cruets).
- **Alchemist: 82 of 94 (87%). FAIL.** Hand-passed: 35 and 79 bandolier (bottles in a rack), 64 roemer (goblet), 29 witch bottle (face jug).

## Misreads
| Calling | # | card | object | read as |
|---|---|---|---|---|
| Vessel | 6, 29 | ve_banked_coals, ve_warm_room | warming pan | disc on a handle, paddle |
| Vessel | 12, 80 | ve_spit, t_ve_spit | aspergillum | perforated ball on a handle (alt: holy-water sprinkler) |
| Vessel | 50 | ve_return_it | mirror | magnifying glass in a gauntlet |
| Vessel | 86 | ve_stand_near | oil lamp | flask with a flame at the tip |
| Alchemist | 1, 28 | fl_firepot, al_powder_pot | firepot | corked round flask or gourd |
| Alchemist | 25 | al_salt_spray | salt | tipped sack with a stick |
| Alchemist | 37 | al_hartshorn | antler | dead branch (alt antler) |
| Alchemist | 38 | al_quench | ewer | watering can |
| Alchemist | 49, 86 | al_leech_jar, al_theriac | albarello | bound cylinder |
| Alchemist | 70 | al_spagyric_rain | watering can | round vessel held by a hand |
| Alchemist | 75 | al_marsh_lights | oil lamp | long wooden object |
| Alchemist | 85 | al_the_physick_garden | spade | plunger or press |
| Alchemist | 88 | al_buboes_burst | lancet | wooden box or tube |
| Alchemist | 91 | al_ironbark_rub | crock | strapped mug or pitcher |

## Tester patterns
- **Held at an angle in a gauntlet:** small round or oblong objects lose their outline (warming pan, aspergillum, mirror, lamp, jugs).
- **Round brown vessels with no feature** blur together (flask, gourd, onion). A label, handle or liquid line is what makes a container read.
- **Glow flattens shape:** 14, 15, 58, 63 and 69 on the Alchemist sheet.
- **Visual look-alike groups beat the name-based reuse cap:**
  - Vessel: 4 scales, 4 bells, 2 yokes, 2 hoods, 2 horns, 2 spoons, 2 funnels, 2 monstrances.
  - Alchemist: stills, flasks, furnaces.

## Matching tests (fresh agents: unlabelled sheet plus shuffled current names)
- **Alchemist: 36 of 94 (38%).**
- **Vessel: 39 of 88 (44%).**
- Bar: 60%. Chance is about 1%.

Easy to match: names that name one pictured object, when only one card shows it (Hartshorn, Beak Mask, Clean Linen, Swallow, Sponge, Settle, Six Seals, Six Breaths, Lift).

Hard to match:
- abstract names with no object (The Great Work, Panacea, Quintessence, Stand Near, Even Breath, Lend Weight, Return It, Come to Me);
- plain potion names (Haste Draught, Second Dose, Round of Tonic);
- members of look-alike families: scales, bells, horns, pitchers, hearths, glowing flasks and furnaces.

Levers:
1. The L66 look-alike cap.
2. The rename pass favouring names that point at the pictured thing.
3. For abstract cards, objects chosen to evoke the name.

Re-test after both.

## Round 2 (2026-11-26, after the misread and look-alike fixes)

Fresh readers. The sheets are unnumbered, so the cells were counted left to right, top to bottom.

| test | Vessel (88) | Alchemist (94) |
|---|---|---|
| blind object naming | 88/88 by hand (script 85) | about 90/94, 96% (script 86) |
| matching, current names | 42/88 (47%) | 35/94 (37%) |
| matching, proposed names (renames.csv) | 42/88 (47%) | 43/94 (45%) |
| proposed names, cards with a unique object | 27/48 (56%) | 22/36 (61%) |
| proposed names, cards sharing an object | 15/40 (37%) | 21/58 (36%) |

Real blind misreads:
- Alchemist: the pitch torch (read as a mallet), the ewer (a bag on a cord), the cupping glass (a bell jar), the inkwell (a box).
- Vessel weak reads: the quill, the hand reliquary, the flameless torch.

Finding: the 3-per-calling cap passes the blind test but fails matching. Twins (the same object with a different background, hand or corner icon) get their names split at random.
- Rule L72: one object per card within a calling. A paired name may share an object only if the picture shows the difference.
- Align the picks with the picture column of the proposed names: 15 Vessel and 15 Alchemist cards differ.

Hero cards (Bulwark + Oracle, 53 cards): 11/53 (21%). The same props appear on every card and nothing points to the name. Round 11 adds a name cue placed in the scene (L67).

## Hero cards, round 11 (name cues added; matching, fresh readers, proposed names)

| calling | matched |
|---|---|
| Hexweaver | 17/17 (100%) |
| Elementalist | 19/23 (83%) |
| Alchemist | 7/10 (70%) |
| Oracle | 14/22 (64%) |
| Duelist | 26/46 (57%) |
| Bulwark | 13/31 (42%) |
| Total | 96/149 (64%), up from 21% |

Failures come from cue collisions: the Bulwark breakage family, holding versus standing, grave versus banner, and death symbols on the Duelist. Unidentifiable cues on the Duelist and Oracle also miss.

Next: L69, a text-only pretest of cue labels against names before any render. L68 brings the cue style in line with the scene (textured, hand-scaled, lit).
