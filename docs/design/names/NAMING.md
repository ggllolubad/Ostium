# Ostium card naming guide

The target is Slay the Spire: a short, concrete name that says what the card does or is, and sticks. The Alchemist set is the house benchmark: Alembic, Athanor, Theriac, Aqua Fortis, Calcination, Greek Fire.

## Rules

1. **Length.** One or two words by default. Three words only where they earn it, at most about 10% of a calling. Never four or more.
2. **Object first.** Prefer a name that points at one object the art can show: Millstone, Portcullis, Gibbet, Cruet, Unicorn Horn. A plain verb (Behead, Repel, Unravel) is the second choice. Avoid abstract or relational names.
   - Evidence: fresh testers matched unlabelled art to shuffled names at only 38% for the Alchemist and 44% for the Vessel.
   - Object names matched easily: Hartshorn, Beak Mask, Clean Linen, Swallow, Sponge, Six Seals.
   - Abstract names failed: The Great Work, Magnum Opus, Quintessence, Panacea, Stand Near, Return It.
   - So did plain potion names (Haste Draught, Round of Tonic) and rot names (Black Rot, Fester, Ripen).
3. **Mechanic first.** The name hints at the effect. Taunt cards provoke (Provoke, Clamour, Bristle). Execute cards end things (Behead, Last Rites, Snuff Out). Copy cards spread (Blot, Cursive, Wildfire).
4. **Spoken lines and idioms.** At most one per calling, and only if it is genuinely good. No pronoun phrases ("Bear It", "Come On, Then", "Keep Her Quiet").
5. **"The X".** At most two per calling, and only on rares or legendaries.
6. **Head nouns.** No head noun twice within a calling. A calling may keep one deliberate signature word in up to three names:
   - Bulwark: Door
   - Duelist: Cut
   - Elementalist: Ink
   - Oracle: Hour
   - Hexweaver: Bell
   - Vessel: Breath
7. **Period vocabulary.** Use the calling's own world (lists below). No modern idioms, technical terms or pop references. Examples removed: Event Horizon, Feedback, Ride the Lightning, Reaction Shield, Liquid Courage, Return to Sender.
8. **Legible over learned.** Use a Latin or trade term only if players know it (Aqua Vitae, Danse Macabre) or the art carries it (Thurible, Cruet, Monstrance). A gloss-only word fails.
9. **No puns, no gross-out.** No Barber's Trade or Bled Pale. No Spit, Retch or Gorge on a holy figure.
10. **Fit the art.** The art is the card's object or the hero doing the act. A rename should keep that object; naming the object outright is often the best fix (Yoke, Spindle, Cruet, Witch Ball). If a better name needs new art, flag it.
11. **Unique deck-wide.** Names must be unique deck-wide, case-insensitive, including worlds, neutral cards and tokens. Also avoid near-duplicates (Hold the Breath and Hold Your Breath) and exact Slay the Spire card names (Borrowed Time, Untouchable).
12. **No em dashes or double hyphens.** Single hyphens inside a compound are fine (Two-Hander, Sin-Eater).
13. **Plain kit and basic cards.** Kit and basic starter cards can stay plain (Brace, Lunge, Parry, Hasten).

### Lessons from the rename pass

- The word count was the biggest problem: most four-word names were a verb plus "the" plus a noun ("Draw the Ink Out"). Cutting to the noun or the verb alone almost always works (Siphon).
- Counting head nouns finds repeats that read as filler: Cut x7, Ink x10, Door x10, Sigil x7, Glass x5.
- Path X cards should not carry "The": The Red Work became Rubedo.
- The Alchemist's flasks are brewed items that other cards name in their text.
  - The course flasks (Fire Flask, Brine Flask, Acid Flask, Steam Flask) share the head Flask on purpose, like a potion line, and are exempt from rule 6.
  - The draughts now each name their own drink or vessel (Wineskin, Mead, Quicksilver).
- When renaming a card that another card creates, update that card's text and any token with the same name.
- A liturgical abstraction (Absolution, Compline, Intercession) is on theme but still abstract. Hang the term on its object instead: Hour Candle, Sanctuary, Bier, Reliquary, Pulpit. Keep abstract words for cards whose image is the act itself (Baptism, Benediction, Pentecost).
- A period term works when the art carries it (Alembic, Athanor, Theriac, Hartshorn, Thurible). It fails when nothing on the card shows it (Prima Materia, Quintessence).
- Check picks.json just before naming. The art agent changes objects, and a name should follow the current object.
- renames.csv has a picture column: the object the name points to, for the art agent.

## Vocabulary per calling

For future cards. Words already taken are marked *(used)*.

**Bulwark** (siege, smithing, the penitent): rampart, postern, barbican, merlon, embrasure, pavise, mantlet, buckler, boss, rivet, anvil, quench, slag, hauberk, gambeson, coif, aventail, flail, ram *(used)*, portcullis *(used)*, palisade *(used)*, discipline, cilice, sackcloth, ashes, vigil, matins, contrition, shrift, scourge *(used)*, welts *(used)*, rime, hoarfrost, sleet *(used)*, hailstone *(used)*, north wind *(used)*, longhouse, hearthguard.

**Duelist** (the salle, the headsman, the barber-surgeon): feint *(used)*, tempo *(used)*, cadence *(used)*, measure, invitation *(used)*, reprise *(used)*, disengage *(used)*, volte, flèche, bind, bout *(used)*, foible, forte, quillon, main-gauche *(used)*, salute *(used)*, gibbet *(used)*, scaffold, tumbril, gallows, headsman *(used)*, verdict *(used)*, assize, block, noose, lancet, fleam, cupping, leeches, tourniquet, ligature, strop, razor, basin, bonesaw *(used)*, pallor *(used)*.

**Elementalist** (scriptorium, ink, sigils, brass apparatus): quill, nib, reed pen, inkhorn *(used)*, gall *(used)*, vermilion, minium, lampblack, orpiment, verdigris, azure, woad, pounce, vellum, palimpsest, rubric, ligature *(used)*, cursive *(used)*, overleaf *(used)*, glyph, cipher, lintel *(used)*, brass, gauge, valve, siphon *(used)*, ballast *(used)*, retort, bellows, prism, refraction *(used)*, corona *(used)*, chime *(used)*, polychrome *(used)*.

**Alchemist** (the apothecary; already good; objects first): alembic, athanor, pelican *(used)*, retort *(used)*, cucurbit, aludel, crucible *(used)*, cauldron *(used)*, mortar, albarello, dropper *(used)*, funnel, decanter, philosopher's egg *(used)*, unicorn horn *(used)*, bezoar *(used)*, theriac, cordial *(used)*, dram *(used)*, wineskin *(used)*, mead *(used)*, small beer *(used)*, wassail bowl *(used)*, hamper *(used)*, eyebright *(used)*, rosewater *(used)*, quicksilver *(used)*, vitriol, saltpetre, quicklime, toadstool *(used)*, blowfly *(used)*, plague pit *(used)*, pomegranate *(used)*, stinkpot *(used)*, grenado.

**Oracle** (augury, clocks, thread, bones): augury *(used)*, auspices *(used)*, haruspex, portent *(used)*, omen, lots, knucklebones *(used)*, astragal, sortilege, entrails, raven, hourglass, clepsydra, gnomon, sundial, dial *(used)*, escapement, verge, mainspring *(used)*, pendulum, retrograde *(used)*, eclipse, orrery, ephemeris, spindle *(used)*, distaff, shuttle, skein, warp, weft, loom, tapestry, needlework *(used)*, tangle *(used)*, erasure *(used)*, premonition *(used)*.

**Hexweaver** (folk witchcraft, bells, mirrors, poppets): poppet, mommet, effigy *(used)*, witch bottle, witch ball *(used)*, hagstone, rowan, elder, iron nail, coffin nail *(used)*, pin, knotted cord, ill-wishing *(used)*, overlooking, evil eye, fetch *(used)*, glamour *(used)*, looking glass *(used)*, black mirror, scrying, knell, peal *(used)*, curfew *(used)*, passing bell, lych gate, corpse candle, hand of glory, mandrake, henbane, nightshade, canker *(used)*, grudge *(used)*, feud *(used)*, anathema *(used)*, cutpurse *(used)*.

**Vessel** (liturgy, relics, illumination; objects first): thurible *(used)*, cruet *(used)*, chalice *(used)*, ewer *(used)*, aspergillum, holy water *(used)*, hyssop *(used)*, reliquary *(used)*, armlet *(used)*, monstrance, pyx, paten, ciborium, chrism, oil stock, sanctus bell, clarion *(used)*, hour candle *(used)*, sanctuary lamp, chimney corner *(used)*, warming pan, brazier *(used)*, posset *(used)*, bier *(used)*, pulpit *(used)*, crosier *(used)*, cope *(used)*, lectern *(used)*, psalter, vellum, gilding *(used)*, nimbus, mandorla, laver *(used)*, winepress *(used)*, millstone *(used)*, mason's level *(used)*, scales *(used)*, manna *(used)*, libation *(used)*.
