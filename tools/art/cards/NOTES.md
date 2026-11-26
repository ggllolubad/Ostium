# Card art: gritty pass (approved look, 2026-11-25)

Run: `node cards/render.js [ids]`. With no ids it renders the eight samples to `/home/claude/ostium/build/emblem2/`;
`-r` writes to `emblem2/review/`, `-t` to `emblem2/_test/`. Each card is drawn at 1120 x 612 (full PNG and SVG in
`_full/`), downscaled once with Lanczos to 560 x 306, plus a `contact.jpg` (review and test sheets are labelled with
the id and what the card got). Test ids `@<calling>/<kind>[/<course>]` render a rig without a real card.
Tools: `posepeek.js` (a posed hero with every joint named), `objsheet.js <out.png> [course]` (the object library).

Files: `card_kit.js` (grounds, ink FX, detail helpers, hero posing), `objects.js` (flask, hourglass, robe scrap,
mirror, bell, shield), `objects2.js` (the rest of the library), `samples.js` (data rules, rigs, compositions,
object picking, overrides), `render.js`, `downscale.py`.

## Style rules

1. **Same engine, same settings.** Heroes and objects are `Fig` drawings with `kit.base` (cel band, hatch,
   crosshatch, variable ink, grit, wobble, key light upper left). Objects are drawn about 360 to 440 figure px tall and
   placed at 0.95 to 1.2; heroes at 1.2 to 1.45. Hatch spacing then matches the hero renders at card size.
2. **No foes.** A hero card shows the hero mid-act and the ink FX only. The blow lands on empty air: the smash, the cut
   marks hanging in space, the splatter carry the impact (Cole, 2026-11-25).
3. **Tilt objects through a frame, never an SVG rotate**, so the key light stays put.
4. **Break big areas into parts, then dress them.** Each band, strap, label or rim is its own `f.part`. `D.dress`
   lays contour hatching on the shadow side and clipped wear and grime over a part. At least six secondary details
   per object (twine, wax, labels, chips, cracks, rust, stains, rivets, holes).
5. **Grounds are the room**: the card's battle room, greyed, darkened and multiplied by the course wash; the focal pool
   lifts the same room instead of glowing over it; soot, blots, specks and hand-laid crosshatch toward the edges.
6. **FX are ink**: dry brush that breaks as it dries, tapered flicks, ragged smashes, cuts with a broken light edge,
   hatched motion lines, tear-drop splatter, woodcut billows. All roughened. No stars, perfect arcs or glows.
7. **Course ink** for a course's FX is its bible ink pulled most of the way to the game's ink (0.6 to 0.74 toward
   near-black), so it reads as ink, not as paint. Physical FX are plain ink, with dark blood flecks on blows.
8. **Course marks**: void is a clean bored hole with its wall showing (`D.hole`); toxin is mould and grey-green
   hatched mist; frost falls as pale specks and rimes the floor; lightning burns branch along the floor; fire throws
   ash and embers. Never sparkles, neon, slime or clean crystals.
9. **Colour**: red only for blood (and the rubric on a powder keg's warning); gold only on holy things (the
   reliquary) and money (the purse).
10. **Read at 170 px**: one subject, one focal pool, one act.

## What gets a hero and what gets an object

`kindOf(card)` from the card data:

| Kind | Rule | Composition |
|:-|:-|:-|
| attack | damage to a foe by the Bulwark or Duelist; physical damage by the Alchemist, Oracle, Hexweaver, Vessel | hero: `swing` (Bulwark), `cuts` (Duelist, one cut per hit), `strike` (Hexweaver, Vessel); callings with no attack rig throw instead (cast) |
| cast | damage to a foe by the Elementalist, or any other course's damage | hero: the course's ink (or a flask) flung from the hand, bursting in the air |
| block | block, guard, ward, armour | hero behind their guard, an unseen blow smashing on it |
| flask | Flask keyword, or an Alchemist card that applies or brews | object: flask, vial, jar or keg |
| curse | Curse rarity or the Affliction keyword | object |
| rite, device | everything else | object |

Shared, world and foe-added cards have no hero, so their hero kinds become objects.

## Pose variety and object framing (second review, 2026-11-25)

- Every calling has three act poses (attacks and casts) and two block poses (`RIG[calling].act` and `.block`). A card
  takes the first pose whose `words` match its name, then its note, else one by a hash of its id. Styles: `swing`,
  `cuts`, `strike`, `cast` (with `spray` for a wide fling), `pour` (a stream to the floor, fumes); block styles: guard
  (default), `pour` (a poured barrier of fumes), `salt` (a salt line the blow stops at).
- Object cards use one of five layouts, picked by hash among those that suit the object (`SUITS`): `close` (scaled up
  to crop off an edge), `ledge` (resting on a stone stair edge), `hang` (from an iron hook in a beam), `water` (the
  lower part under dark water), `held` (a gloved hand from the frame edge closes on the object's grip; objects that
  return a `grip`). The light pool moves and changes shape with the layout and the seed.
- Counts: two, twin, pair, both, double draw two copies (long things crossed, round things side by side); three or
  thrice draw three.
- Families share cards by hash unless the name names the object: bandage, suture, tourniquet, splint; brazier, coal
  pan, tongs; vial, jar; candle, lantern.
- Test ids: `@<calling>/<kind>/<course>/<pose index>` for poses, `<card id>!<layout>` to force a layout.

## Form checklist (every object, Cole, 2026-11-25)

1. **One viewpoint per object**: three-quarter from slightly above unless the object hangs high (a bell, seen from
   below) or lies flat (a scroll, seen from the front). Do not mix front-on parts with tilted parts.
2. **Ellipses agree**: tops, rims, openings and bases are ellipses at one ratio for the object (about 0.2 for a
   vessel seen from a little above). A turned profile closes with the front arc of its base (`turned()` does it).
3. **Thickness shows** wherever the material has it: rims, lids, covers, boards, blades, straps, doors, frames.
   `D.slab` gives a flat-fronted thing its depth: the outline pushed back and down-right, darker, drawn first.
4. **Parts connect**: handles attach into the body, hinges sit on both leaves, cords wrap round (pass behind and come
   back) instead of lying on top, a strip leaves a roll from its outer turn.
5. **Covers follow pages**: a book's boards and spine curve under the fanned page block, with the block's thickness
   at the near and fore edges and the board's own thickness below.
6. **Shading follows the form** under the upper-left key light (the cel band falls lower right on every part); a cast
   shadow agrees with the surface the object rests on (ledge, water line, floor).
7. **Nothing reads cut-out**: if a part looks like a paper shape, give it an edge, a rim, a fold or a second plane.
8. **Check at card size and at 2x** (`objsheet.js <out> <course> <keys> <scale> <cols>`).

## Data-driven

- **Hero**: the calling's figure, or the path variant from `worlds/hero_paths_A/B` when the card's `arch` names one.
  The Vessel has no path figures, so its path cards use the base Vessel.
- **Rigs** (`RIG` in `samples.js`): attack, cast and block poses for all seven callings, tuned by eye. Path variants
  share their calling's rig. FX anchor on named bones (`mace`, `rapier`, `flask`, `hourglass`, `poppet`, hands) and
  fall back to the near hand when a variant lacks the bone.
- **Room**: world cards, foe-added cards and afflictions use their own world's room (from the cls or the id);
  everything else uses the course's room.
- **Object**: `pickObject` scores about 40 word lists against the card's name (weight 3), note (1) and rules text
  (0.3). Flask cards choose only among flask, vial, jar and keg. Eyes only on void cards. If nothing matches:
  flask for flasks, chain for curses, then the calling's object, then the course's object.
- **Course** sets the wash, the FX ink and the course marks round an object.

## Needs a hand-made override

- Rare and odd cards that deserve their own scene: an `ART` entry (the four object samples are examples).
- Rooms named in a note that the course does not give (`OVR`: belfry for Two-Step, nave for Ink Bolt).
- Pose and FX anchor fixes for any path variant whose weapon sits away from the base figure's.
- A card whose words pick the wrong object: set `OVR[id].device`.
