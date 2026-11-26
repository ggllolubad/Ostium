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
9. **Colour**: red only for blood, doom (the Fatebinder's thread) and rubric (a powder keg's warning); gold only on
   holy things (the reliquary, gold leaf) and money (the purse, coins). **The Vessel is holy** (Cole, 2026-11-25: "the
   vessel should be holy yes"): gold is allowed on every Vessel card (the hand, its bands, the gold hairline), as worn,
   aged gold (`#9a8450`), never bright yellow. Course colours appear as ink, never as rainbow daubs.
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
- **Rigs** (`RIG` in `rig.js`): attack, cast and block poses for all seven callings. Path variants share their
  calling's rig; a variant whose rest arm differs gets `pose.vary[<figure key>]` (merged by `card_kit.hero`). rig.js
  checks every pose on every figure when it loads (wrist, elbow fold, shoulder range, plumb props, flask mouth,
  two-handed turn) and throws; `check_poses.js` (run first by `render.js -all`) checks pose shares, block hits, grips,
  pose words and the frame. FX anchor on named bones (`mace`, `rapier`, `flask`, `hourglass`, `poppet`, `pin`, hands)
  or joints, and fall back to the near hand when a variant lacks the bone.
- **Room**: world cards, foe-added cards and afflictions use their own world's room (from the cls or the id);
  everything else uses the course's room.
- **Object**: see "Object cards and the build checks" below (the old word scoring is gone).
- **Course** sets the wash, the FX ink and the course marks round an object.

## Object cards and the build checks (round 5)

- **objcomp.js** composes every object card (device, rite, curse, flask), and records the metadata the checks read.
  - **Picking:** `pickObject` takes the per-card `o.device`, then the forced-name and noun table `NOUNS` (the name
    first), then `audit.json`, then the note nouns, then the calling or the course. In a full run, objects past 20 cards
    spread over `FAMILY`.
  - **The card's plan** (`planOf`, L57): layout, variant, hand angle and framing style come from a hash of the card's id
    and object, never from the batch, so review art is production art; only layouts the object can fill (`fillOf`).
    Grip objects go to a hand 80% of the time; close is weighted down. The batch checks verify the result.
  - **Layouts:** close, ledge, table, floor, niche, hang (hook only), water (anchor, skull, bell, keg), held (grip only)
    and scene (whole-frame objects: the door, birds, the anvil, the bandaged arms, gold leaf, the ink arm).
  - **Placement:** scale to fill, keep `sig` 95% inside with a 20 px margin, then grow toward the fill while the
    signature fits. Every object on a surface gets a contact shadow.
  - **Acts:** taken from the name's words, then the object's default. Every FX goes through card_kit's ink FX
    (`inkFlame`, `inkSteam`, `inkBolt`, `inkRime`, `inkDrip`, `drybrush`, `splatter`, `impact`, `billow`).
  - **State words** (frozen, clean, broken, empty) set or forbid FX (`STATE_RULES`).
- **Object contract** (objects4.js header): `{ focus, sig, hook?, grip?, mouth?, feat, ells }`, with `sig` given as
  `SB(F, box)`. Objects never draw FX or void holes themselves: they call `K.fxReq`.
- **The calling's hand:** the bulwark and duelist forearm and hand from card_figure, turned onto the grip, capped near
  hero scale. Other callings borrow one of the two (a known gap).
- **checks.js** (before rendering) and **pixchecks.py** (after) implement every measurable lesson. render.js:
  - stops on any FAIL;
  - writes checks.txt, the unlabelled thumbs170.png and its key;
  - takes `-r4` for build/emblem2/review4, and `-force` to render a failing batch for a look.

## Read at 170 px (round 6, after the review-4 blind test)

- Draw for the thumbnail first: one big silhouette the eye can name, a lit value or rim against the dark grounds, mass
  rather than a stick, never a horizontal plank across the frame. render.js enforces this with L45 to L47 and the
  same-object silhouette check (pixchecks.py).
- Replace an object that will not read after one honest redraw. The per-card replacements are in `READS` in samples.js,
  and the new objects are in objects5.js (wasp, shears, laundry, urn, and the redrawn door, anchor, broth, scourge,
  rat sack, bell, reliquary casket and gold-leaf book).
- On the cool grounds (water, frost, void, lightning) the pool is lifted and the subject back-lit (L49).
- A long thin object is shown by its distinctive part, close, with no hand (L50). A count is shown as marks on one object,
  not as a set (L51).
- Retired objects (`RETIRED` in objcomp.js) redirect every card that would draw them (L52). In round 8 the scourge
  went to the barbs and the inkpot to the scroll.
- Warm brown objects get the slate ground (L54); pale paper keeps a dark one. Small round things are never held (L53).
  One object per card, with no secondary props (L56).
- **Vessel cards** are object cards, except the ids in vessel_hero_ids.txt. They draw from the Vessel's own set (palm,
  offering bowl, ewer, chalice, weights, initial, seal, hearth, reliquary, candle, mantle), picked by `VESSEL_WORDS`.
  Gold on them is worn gilt (`#9a8450`).

## Variety pass (L58 to L65, 2026-11-25)

- **Every object card has its own pick** in `picks.json` (id to object key, or id to `{ device, layout, flip, zoom, act,
  count, slate, objOpt }`), chosen from the card's name first. The block marked VARIETY PASS in samples.js loads it and
  the new libraries; it runs before the pick logic, so a pick overrides the family defaults, READS and VESSEL_WORDS.
- **New libraries**, each `{ O, META }` with META holding an object's defaults (tilt, act, allowed layouts, gold, no-turn):
  objects6.js (the Vessel's holy things and the shared helpers `tube`, `oval`, `ring`, `sweep`, `arcs`, `shadeR`,
  `grain`), objects7.js (the Alchemist's vessels and tools, `glass()` with a liquid level), objects8.js (the
  Elementalist's ink carriers), objects9.js (Hexweaver), objects10.js (Oracle), objects11.js (Bulwark and Duelist).
  `varsheet.js <out.png> [course] [keys|-] [scale] [cols]` draws them on tiles.
- **One object per card (L72, replacing the L58 cap of 3)**: within a calling, the shared pool or a world every object
  card shows its own object. Declared twins are the one exception: both picks carry `twin` and `shows`, and differ in
  objOpt, count, act or ang. checks.js counts the whole deck on every run. objects12.js to objects16.js (2026-11-26) hold
  the objects this needed, drawn to the proposed names in docs/design/names/renames.csv; a pick changed for a rename
  keeps the old object as `_was`. Object files load in numeric order, so a later part's redraw wins.
- **Separating two same-object cards** of a calling: a different layout, or `flip: true`; `style` is dropped when a
  `layout` is set (L62). A held pick needs a grip and `held` in the object's layouts (L63).
- **Attuned object cards** write their course: ink leaves the object and lands, large, as the element (element_fx.js,
  L61); on void the landing is the card's one hole. Their slate ground keeps half the course wash (L60).
- Review batches: `node cards/render.js -rv=<name> ids...` writes to emblem2/variety/<name>/.

## Hero cards, round 9 (L60, L61, L66, 2026-11-25)

- **Who gets a hero** (hero_routes.js): a card earns its hero only when the act is the point. `HERO` lists the 152 hero cards (20.4% of the deck), each with a framing, an act mechanic, a motif and a room. `OBJ` lists the 127 re-routed cards with a suggested object and the reason; the object agent's picks.json makes the final pick, and reroutes.json carries the list. `node hero_routes.js` asserts every hero card is routed once. This replaces the hero rule in "What gets a hero and what gets an object" above, which now applies only to test ids.
- **Staging** (hero_staging.js, hero_comp.js):
  - Five framings: full, three-quarter, close on hand and weapon, low angle, over the shoulder.
  - The rig's poses plus 31 new ones, tagged by mechanic. The Executioner's grip is solved exactly (`solveGrip`).
  - A deck-level allocation (hero_alloc.json, cached by a hash of its inputs) gives each card a pose, framing, placement and room view, so no two hero cards of a calling share a silhouette (IoU under 0.5) or a view of a room.
  - Pairs a render shows to read alike go into hero_separate.json (`python3 herosim.py <out> <list> --separate hero_separate.json`) and are kept out of one framing.
- **Elements** (element_fx.js): on a course card the whole projectile is the element from the hand (L61). `stroke(r, course, pts, w)`, `impact(r, course, point, R, { floorY, dir })` and `pour(r, course, mouth, floor, w)` are shared with objcomp.
  - Element FX cover 15 to 30% of the frame on a cast, sized by the frame, and never land on the face (the build throws).
  - The figure is `<g id="hero">`, the FX layers are `<g class="cfx">` and impacts are `<g class="cimp">`, so render.js can write `_hero.png`, `_fx.png` and `_imp.png` for the checks.
- **Attuned cards** (L60): `<id>~<course>` is the base card in another course (render.js writes `<id>_<course>.jpg`, which the game loads for the hero's current element).
  - The base is the starting element (fire, from data/heroes.json), and the room follows the course.
  - Their ink pulls 0.3 toward black (`K.courseInk(course, { attuned: true })`).
- **Run:**
  - `node render.js -h -heroes[=bulwark,duelist]` renders the staged heroes to emblem2/_heroes.
  - `-h=<name>` writes to a subfolder of _heroes.
  - `-dry` checks without rendering (`-h=dry -all -dry` is the full-deck dry run).
  - `python3 herosheet.py <out>` makes labelled contact sheets per calling, and `--blind <dir> <calling...> --key <file>` makes the matching test.
  - render.js runs herosim.py (L66) and attuned_check.py (L60, L61) on any batch that has hero or variant cards.

## Hero cards, rounds 10 and 11 (element shapes, name cues; 2026-11-26)

- **Round 10** (element_fx.js): fire is a jet (`flameJet`) and a burst (`fireBurst`, leaning with the throw); water is a curl with beads (`waterCurl`); toxin is a see-through fume of wisps (`fumeCloud`) with ooze dropping to a pool on the floor (`ooze`); frost splinters keep inside the frame; void is a dark tendril into the hole. The API is unchanged; `fireBurst` takes an optional `dir`. attuned_check.py adds water roundness (L61) and keeps fire evenness as information only.
- Size factors (`attuned_check.py <out> <list> --fxscale hero_fxscale.json`) are read per variant (`<id>~<course>`) before per card. The allocator (VERSION 15) charges a cast whose act sits within 330 px of the right edge.
- **Round 11, name cues** (L67): every hero card carries one cue a reader can tie to its final name.
  - The table is hero_cues.json: `{id: {name, cue, why}}`, built from docs/design/names/renames.csv. No cue repeats within a calling; `node hero_cues.js` checks the table and every drawer.
  - hero_cues.js stages each cue in the scene by its mode (hero_cues.json `mode`): held in the off hand, part of the act's effect, on the floor line behind the figure, hanging from the frame top, or weather across the scene. Never a badge or halo. It is drawn outside `.cfx`, in `<g class="cue" data-mode data-floor data-layer>`; setting cues are spliced in behind the figure, just after the room.
  - render.js writes `_cue.png`. cue_check.py fails a halo, a cue that touches neither the hero, the floor line, the frame top nor half the frame's width, and a cue under 1.2% of the frame or 0.22 contrast at 162 x 86.
  - The matching test now uses the final names (herosheet.py reads them from hero_cues.json).
- **Round 12 (L68, L69):**
  - hero_cues.json carries a plain `label` per card, the words of the L69 text pretest. Packages are in `_heroes/pretest12*/<calling>/`, with keys only in the scratchpad.
  - `LIBCUE` maps a cue kind to library objects (objcomp `LIB`, after samples.js has registered objects6+), with optional second objects and `OVER` overlays.
  - Other cues are kit drawings through the `cueInk` filter. Setting cues go through `cueHaze`.
  - Sizes come from the figure: heroCard passes `headH`, `foreL` and `FH`.
  - cue_check.py adds the flat-fill share against the figure, the held size cap, and floors by mode.

## Needs a hand-made override

- Rare and odd cards that deserve their own scene: an `ART` entry (the four object samples are examples).
- Rooms named in a note that the course does not give (`OVR`: belfry for Two-Step, nave for Ink Bolt).
- Pose and FX anchor fixes for any path variant whose weapon sits away from the base figure's.
- A card whose words pick the wrong object: set `OVR[id].device`.
