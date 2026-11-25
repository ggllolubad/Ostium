# Card art: gritty pass

Run: `node cards/render.js [ids]` (no ids renders the eight samples). Output: `/home/claude/ostium/build/emblem2/<id>.jpg`
(560 x 306) and `contact.jpg`. Each card is drawn at 1120 x 612 (full PNG and SVG in `_full/`), then downscaled once
with Lanczos. `-t` writes to `emblem2/_test` instead. `node cards/posepeek.js <module> <key> '<pose>' out.png`
shows a posed hero with every joint named, for tuning poses.

Files: `card_kit.js` (grounds, ink FX, detail helpers, hero posing), `objects.js` (devices drawn with Fig),
`samples.js` (data rules, compositions per kind, per-card overrides), `render.js`, `downscale.py`.

## Style rules

1. **Same engine, same settings.** Heroes, foes and objects are all `Fig` drawings with `kit.base` (cel band, hatch,
   crosshatch, variable ink, grit, wobble, key light upper left). Objects are drawn at figure scale, about 440 figure
   px tall, and placed at 0.9 to 1.0. Heroes are placed at 1.2 to 1.45. That keeps the hatch spacing within a pixel of
   the hero renders at card size.
2. **Tilt objects through a frame, never with an SVG rotate.** A rotate would turn the key light with the object.
3. **Break big areas up into parts.** One big `f.part` reads flat. Bands, straps, labels, strips, patches and rims are
   each their own part, so each gets its own shadow band and outline. Then add `D.contour` (cross-contour hatching
   clipped to the form) and `D.wear` (pits, nicks, scratches). At least six secondary details per object (cork, pitch,
   twine, tag, cage, crack, mould, sediment; or wax, twine repair, chips, stains, star chart, bored hole).
4. **Grounds are the room, not a gradient.** The card's battle room (far + mid layers) is cropped, blurred a little,
   greyed, darkened and multiplied by the course wash. Inside the focal pool the same room is lifted rather than covered
   by a glow, so the pool keeps the room's texture. Then soot, water blots and specks, then hand-laid crosshatch
   closing in from the edges. No ray lines, no clean vignettes.
5. **FX are ink, not shapes.** Dry brush with bristles that break as the brush dries (`drybrush`); tapered flicks and a
   ragged blot for impacts (`impact`, `flick`); crescents with a broken paper edge for cuts (`slash`); hatched motion
   lines (`motionHatch`); splatter with tear-shaped drops (`splatter`); woodcut billows for gas and smoke (`billow`).
   Everything passes through a displacement filter. No stars, no perfect arcs, no soft glows.
6. **Course marks follow the bible.** Void is a clean bored hole with its wall showing (`D.hole`), never sparkles.
   Toxin is mould, pustules and grey-green woodcut mist, never neon or slime. Water ink is deep blue-black.
7. **Colour.** The course wash for the ground; the course's own ink (bible 01: vermilion, pale blue, gold, deep blue,
   sick green, violet-black) for that course's FX. Red only for blood. Gold only on holy things: bronze, brass, oak and
   pewter stand in for it on every sample.
8. **Foes are fragments.** A foe (Drowned Thrall by default) sits at the right edge, darkened by `kFoe`, so the hero
   reads first.
9. **Read at 170 px.** One subject, one focal pool, one act. If the FX hide the subject, cut FX.

## Which kinds get a hero, which get an object

`kindOf(card)` in `samples.js`, from the card data:

| Kind | Rule | Composition |
|---|---|---|
| attack | deals damage to a foe, physical course | hero, `swing` (weapon arc onto a foe's head) or `cuts` (one cut per hit) |
| cast | deals damage to a foe, any other course or the Elementalist | hero, a bead of the course's ink flung onto a foe |
| block | block, guard, ward, armour | hero behind their guard, a foe's weapon biting it |
| flask | Flask keyword, or an Alchemist card that applies or brews | object: flask |
| rite, device, curse | everything else | object chosen by calling: flask, hourglass, mirror, bell, shield |

Shared and world cards have no hero, so their hero kinds fall back to an object.

## Data-driven and hand-made

Data-driven: course (wash, ink colour, default room), calling and path (hero figure: the path variant from
`worlds/hero_paths_A/B` when the card's `arch` names one), number of hits (number of cuts), target (foe fragment),
world cards (room by world).

Needs a hand-made entry:

- **Poses** (`RIG` in `samples.js`). Tuned so far: Bulwark attack and block, Duelist attack, Elementalist cast.
  Every other calling and kind falls back to the rest pose, which renders but reads weakly (the Alchemist's block and
  the Oracle's cast in a test run were usable but plain). Tune each with `posepeek.js`: keep the face clear of the arms
  and keep the held object facing its user.
- **Rooms named in the note** (`OVR`: the belfry for Two-Step, the nave for Ink Bolt).
- **Rare and odd cards** get an `ART` entry with their own device and FX (the four object samples). The generic object
  card is plain on purpose: one calling object with a course-ink arc and splatter.
- **World cards** need their own objects: the calling table has nothing for them, so they default to the hourglass.
- **Curses and afflictions** have no object of their own yet.
