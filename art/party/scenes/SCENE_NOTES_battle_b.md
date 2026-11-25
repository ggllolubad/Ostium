# Battle rooms, worlds VIII to XV (Living Ink): notes (2026-11-24)

These are the first rooms for worlds VIII to XV, one per world: each world's signature place. They were made by the VIII-XV scene maker while another agent did worlds I-VII. I created only new files and edited no shared file: `lik.js`, `props_li.js`, `dress_li.js`, the frozen figure files and the I-VII files are untouched.

## Files

| What | Where |
|---|---|
| Shared kit for VIII-XV | `scenes/battle_kit_b.js` |
| Rooms | `scenes/bg_rime_breach.js` (VIII), `bg_barrow_hall.js` (IX), `bg_hive_road.js` (X), `bg_spire_dome.js` (XI), `bg_silence_camp.js` (XII), `bg_pyre_nave.js` (XIII), `bg_garden_walk.js` (XIV), `bg_sky_throne.js` (XV) |
| Build | `sh scenes/build_battle_b.sh <W> <room> <scene.js> <foe1,foe2,foe3>` runs the scene, renders far, mid and fore at 2x one at a time, makes the far PNG opaque and composes the preview |
| Preview and sheet | `scenes/battle_preview_b.py` (`<W> <room> <dir> <foes>`, or `sheet <out> <previews...>`) |
| Outputs | `out/scenes/battle/<W>/<room>_{far,mid,fore}.svg/.png`, `<room>.camera.json`, `<room>_preview.png` |
| All eight rooms on one sheet | `out/scenes/battle/battle_VIII-XV_sheet.png` |
| Foe renders for the previews | `out/scenes/battle/figs/<W>_<key>.svg/.png` (rendered with `scenes/figs.js ... right` at scale 0.594, then flipped in the preview) |

## Contract (checked for all eight rooms)

- **Size and layers.**
  - The viewBox is 1480 x 480.
  - `far` is opaque. `mid` and `fore` are transparent.
  - The PNGs are 2960 x 960.
- **Camera.** It is the nave's: horizon 300, eye 1.2 m, focal 652, cx 740. Fighters stand at 6 m with their feet on y 430, and a 1.0 human is 190 px tall. Each room writes the same `<room>.camera.json`.
- **Far edges made opaque.** The wobble filter (`wob`) leaves about 400 part-transparent edge pixels on a far layer. The pilot's `nave_far.png` has the same fault (378 pixels). For my rooms, the build fills them from the layer's own blurred colour, so these far PNGs are RGB and fully opaque. The SVGs keep the filter, so a game re-render will show the fringe again unless it flattens the same way.
- **Previews.** Each preview places four heroes (the nave preview's oracle, elementalist, duelist and bulwark) and three of the world's foes, at true scale with the feet on 860 at 2x. The contact shadows are preview-only.
- **Quiet zone.**
  - Every far layer ends with stepped, ragged murk veils over the fighters' band, with a ragged hatch (`quiet()`). There are no gradients.
  - In the White Silence the veil is pale grey, because that world's murk is white.
  - Mid layers hold only low, dark things.
  - Fore elements sit at the very frame edges, clear of hero 1 (1x x 95) and foe 3 (1x x 1320).

## Kit (`battle_kit_b.js`)

`BK(S, { murk })` wraps a `lik.js` scene and adds the following helpers.

**Screen helpers.** `line`, `pline`, `fillP`, `fillS`, `inkP`, `inkS`, `blob`, `jag`, `lump`.

**Solids.** These are lit by the key light: lit faces take nothing, middling faces a single hatch, and faces turned away a crosshatch.
- `box`, `post`, `beam`.
- `flags`: an irregular flag floor. Each row has its own depth, each stone its own width, and some stones are missing or cracked. It is never brick tiling.
- `voronoi` and `seedsIn`: irregular cells, used for the glacier facets and the lava crust.

**Course marks.**
- **Frost.** `icicles` are faceted, with a lit left facet and a shadow right facet, and hang in clusters. `rime` is a feathered crust that grows into the wind from the left.
- **Fire.** `seam` and `seamTree` make glowing cracks with charred lips; their glow is tagged `glow`. `ash` draws flakes curling upward, and `char` a burnt patch built from crosshatch.
- **Lightning, as a scar only.**
  - `burn` draws a Lichtenberg fern scarred into a surface: a dark scorch with a thin coloured core and a scorched halo. It has `branchP` and `spread` options.
  - `fused` draws a lump of molten, run metal.
  - Nothing is ever drawn in the air.
- **Toxin.** `mould` (fur), `bracket` (shelf fungus), `caps` (fruiting bodies), `pustules`.
- **Void.**
  - **`tornVoid`.** An irregular, clean-rimmed absence:
    - long tears run off across the courses, and teeth of the material are left standing into the hole;
    - slivers of the material taper to nothing at the rim, and flecks drift off and fade;
    - an optional cut through the thickness shows as a pale fresh face;
    - there is an optional `edge` line on the rim, but never a glow;
    - options `tearLen` and `eyes`.
  - It replaces the kit's `voidBite` (a cluster of round bites), which was deliberately not used anywhere.
  - **`eye`.** Used only in XII, XIII, XIV and XV.
- **Other.** `chain`, `steam` (line wisps), `quiet`, `skyBands` (stepped sky, no gradient), `pickScars`.

## The rooms: lore content

### VIII, the Sundered Rime: The Breach (`rime_breach`)

The hold's deepest working, a hall dug into the glacier where the miners met fire coming up. The room is split in two.
- **Frozen left side.**
  - The glacier face is cut into Voronoi plates of ice, each a low faceted boss lit from the upper left.
  - The dirty yearly strata of the ice sweep across it, and the miners' pick scars mark every plate.
  - The timber headframe stands over the old shaft. Its wheel is rimed, the hoist chain goes down into the shaft, and an ore bucket hangs glowing dull.
  - There is a lashed-pole ladder, the miners' tally marks cut beside an adit, and iron spikes with a hanging rope.
- **Burning right side.**
  - An obsidian flow broke out of an upper gallery and froze mid-fall. It is a crust of black-glass plates, molten between them in its upper body and dull low down.
  - Rime lies on its windward flank and icicles hang from its slumps.
  - Soot rises over the breach.
- **Between the two.** The great crack across the face glows at its root by the flow, turns into a white frosted fracture at its tips, and steams along its length.
- **Upper adits.** Timber-framed, charred inside and frosted outside, molten within. One is dead.
- **Floor.** Ice plates with cart scratches, ore-cart rails to the shaft, obsidian spatter on the burning side and rime drifts against the face.
- **Mid layer.** The tipped ore cart, ore glowing under frost, a dropped pick, obsidian boulders.
- **Fore layer.** A rimed pit prop hung with icicles on the left, an obsidian mass with a glowing seam and steam on the right, and the ice roof's lip hung with icicles (heavy on the frozen side, thin on the burning side).

### IX, the Hollow Barrow: The Sealed Hall (`barrow_hall`)

The king's timber hall, buried under the mound with the household.
- **Roof.** The roof bows under the barrow. Each bay of woven wattle sags between the rafters, and earth bulges through the breaches with frost on its edges.
- **Roots.** The barrow's roots hang through in clumps: tapering, with rootlets, some rimed.
- **The shored rafter.** One rafter is cracked and shored with a raw trunk.
- **Long wall.** Upright staves and carved posts with interlace, rimed on the left and mould-furred low down. Round shields hang high, limewash gone grey, with iron bosses, rime and mould.
- **The sealed door.** The doorway is walled up from within by the barrow mason: rough stones, mortar slopped toward us, a lime-washed plague cross with runs. The hinges of the door taken down to build the wall remain. The mason's lime bucket, trowel and the slit lime sack lie at its foot in the mid layer.
- **The dais.** The stone grave-throne stands empty, with frost lying in the seat's hollow. Grave goods surround it: a tarnished silver goblet, a silver burial mask, a chest, a sword rack with one sword gone. The King's Hawk's T-perch has its empty jesses and bell, with feathers on the dais.
- **The dead.** The household's dead lie along the wall benches in grave linen: frozen, mould-furred, with caps growing on them.
- **Mid layer.** The long hearth, cold and rimed, with its cauldron frozen on the tripod.
- **Fore layer.** A carved roof post furred with mould and brackets, rimed on its windward side. A bier with a shrouded dead whose grey arm hangs out, buboes at the wrist and icicles off the fingers.

### X, the Venom Spires: The Plain Road (`hive_road`)

The travellers' road across the plain, between the spires.
- **Sky.** A storm of heavy inked cloud and rain curtains. No bolts.
- **The spires.** Each is a tower of grey paper comb in scalloped bands, with collars, a lean and flight holes. Each has its own crown of scavenged iron: a church cross, a weathervane, a cart axle or a plain rod. The iron is fused into lumps at the tip and the base, and white-violet burns branch down the paper from it.
- **Distance.** A forest of spires runs to the horizon, with two at middle distance.
- **The taken.** Travellers bound in grey paper hang on the spire flanks, venom green soaking through in streaks, a limb hanging out.
- **The road.** Old paving with tilted and missing slabs, cart ruts, verges of dry grass. A strike scar burned across the paving: a fern of scorch with a white-violet core and the fused slabs at its heart.
- **Air.** Wasps.
- **Mid layer.** The toppled milestone, its numbers half legible, its iron waymark torn away for a crown. An overturned cart with its load wrapped in comb. A pilgrim's staff and gourd.
- **Fore layer.**
  - Left: the root of a near spire with a flight hole and wasps, and a bound traveller.
  - Right: a bent iron waypost, its finger board scorched and its top fused, a cocoon hanging from it, and dry grass stalks.

### XI, the Stilled Spire: The Dome Hall (`spire_dome`)

The observatory's round domed hall, built in true 3D as a drum of 10 m radius with a dome over it.
- **Drum and dome.** The drum is blue-grey coursed stone with frost on the beds. The dome's courses curve overhead on brass-shod ribs with icicles. The observing slit is open on a stopped night with stars and no aurora.
- **Windows.** Two tall frosted-blind windows with snow on their sills.
- **The lower clock.** This is the spire's lower clock, not the Last Hour, which is a ruler.
  - Its rings show the hours, the zodiac and the stars.
  - The hands stand at one minute to twelve.
  - It is frosted, the pivot is fused, and an aurora-green burn crosses the brass.
  - The striking jack's bell hangs on a bracket; the jack (a foe) has left.
- **The lightning conductor.** A copper strap runs down the wall from the dome. Its clamps are fused, with char at each one and short aurora-green burns branching over the ashlar.
- **The armillary sphere.** On its pedestal, frozen in a turn: rings fused at their crossings, rime and icicles.
- **The meridian line.** A brass strip set into the floor from the wall to the front, with degree ticks and the signs in roundels. Frost lies in the floor joints.
- **Mid layer.** An overturned stool, a frozen star chart, a dropped quadrant, a chained book frozen open.
- **Fore layer.** An iron telescope pier with a brass setting circle, rimed. Shutter chains hung with icicles. Dropped dividers.
- **Brass.** The brass is kept olive-brown, never gold.

### XII, the White Silence: The Silent Camp (`silence_camp`)

The herders' winter camp under the black star. It is near-white, carried by ink.
- **The Cold Star.** As the bible describes it: a perfect black disc with a thin white corona and broken rings of frost round it, with frost crystals hanging still in the rings. It is a star, a body in the sky, not a void hole. This is a judgement call; see the weak spots.
- **Tents.** Hide tents on crossed poles with sewn panels and stitching. No smoke rises from any smoke-hole. The void has torn absences out of three hides, clipped to each tent; an eye looks out of one.
- **The hearth that is gone.** A torn black absence in the snow, ringed by its hearth stones, with the cooking pot frozen to its tripod over nothing.
- **The Hearth Grandmother's masks.** Strung on a cord between two poles: eight sewn hide faces, no two alike, with eye holes and slit mouths.
- **The camp post.** A carved post whose face the void has taken.
- **Camp life.** Drying racks of frozen fish, the ring of offering stones, and a line of footprints that stops in open snow.
- **No shadows.** Nothing in the room casts a shadow.
- **Mid layer.** A lashed sledge and a broken spear shaft.
- **Fore layer.** A hide on its drying frame with rime and icicles. A sledge prow with an offering bundle. Drifts carved by the wind.

### XIII, the Black Pyre: The Burning Nave (`pyre_nave`)

The inquisition cathedral's nave.
- **The arcade.** Calcined pale stone, soot climbing in tongues from the floor and between every bay, split stones with violet-lipped seams, ash curling up.
- **Black flame.** It reads by silhouette against the pale stone, with violet edges, and it lights nothing.
- **The rose window.** Burned out in the aisle wall through the centre bay. Its tracery stands charred, with two spokes snapped and black beyond. Black flame licks its sill.
- **The great black fire.** A great black fire burns in the aisle.
- **The void's work.** Irregular absences through a spandrel, with an eye looking out of it, and through a pier.
- **The stakes.** A row of charred stakes along the nave with crosspieces and chains hanging open. Faggots at their feet burn black. Two still hold charred remains (silhouettes only).
- **The tribunal.** A raised bench under a canopy with three empty high seats. The sentence board is lettered in red rubric and burnt along its lower edge.
- **Floor.** Ledger flags scorched, ash in drifts.
- **Mid layer.** Charred bones and a dropped chain in the ash. The inquisitors' overturned brazier burning black.
- **Fore layer.** A charred pier with a void absence cut through it. An iron pricket stand whose candles burn black. A hanging chain.
- **No gold.** No gold is drawn: the Saint's halo is the world's only gold.

### XIV, the Blighted Garden: The Rose Walk (`garden_walk`)

The fey lady's rose walk.
- **Sky.** A pale lilac sky with spore hanging in it.
- **Beyond the hedge.** Great dead trees hung with bloom and shelved with fungus, and huge pale caps.
- **The great yew hedge.**
  - Shaggy, with dead black stretches furred grey-lilac and shelved with brackets.
  - The void has clipped irregular absences out of it, with eyes inside two of them.
  - Nine more eyes have opened in the foliage, of different sizes, half-lidded and out of time with each other.
  - Roses gone over climb it.
- **Rose arches.** Four willow hoops with split canes, masses of pink and lilac blooms browned at the edges (a few with an eye in the heart), mould on the posts, brackets.
- **The fountain.** The basin is full of black loam and caps. The nymph pours from a jug that pours nothing; she is shelved with fungus and has an eye in her face. Pale-yellow puffballs smoke spore.
- **The statue.** A garden lady whose face the void has clipped away.
- **The walk.** Pale gravel rotted with loam, petal drifts, the box edging dead.
- **Mid layer.** A ring of caps, dropped shears, a heap of dead clippings.
- **Fore layer.** A stone urn bursting with brackets and blooms, an eye open in one bloom. Rose canes hanging with thorns, hips and blooms.

### XV, the Torn Sky: The Throne Steps (`sky_throne`)

A floating slab of heaven's pavement before the steps of the Mother of Courses' seat.
- **The seat is gone.** Only its gilded footing is left, with sheared bolts. The Wheel of Thrones carried the seat, per its bible entry.
- **No war.** Nothing here is a battlefield.
- **The tears.** Irregular absences torn across a violet-grey storm sky, with the cloud thinning into nothing at their rims. Eyes look in through two of them.
- **Floating ruins.** Column drums, an arch fragment and a stair fragment, all gold leaf cracked over black, with violet burns and fused edges.
- **The throne steps.**
  - Five black steps with gilded risers (dimmed in the fighters' band).
  - The two Throne Lions' plinths are empty, with a fused paw outline left on each.
  - The canopy's gilded posts carry fused finials, and the canopy's black cloth is torn to strips over nothing.
- **The pavement.** Black stone with dim gold-leaf inlay bands, cracked, and a violet burn branching from a fused strike point. The far edge is broken off into the sky, with pieces drifting away below.
- **Gold.** Gold is one skin of leaf, modelled lighter toward the upper-left light (never darker), crazed by black cracks, with flakes lost to the black.
- **Mid layer.** A fallen star-lighter's lamp and a lifted slab.
- **Fore layer.** A gilded column drum, burned and fused. A torn canopy strip with a gilt hem and a scorched dove's feather caught on it.

## Rules audit

| Rule | Status |
|---|---|
| No lightning arcs or bolts | None drawn. Lightning shows only as burns on surfaces and fused metal (X, XI, XV). Storm skies are cloud only. |
| Eyes only in void worlds | Eyes appear in XII, XIII, XIV and XV only. VIII to XI were checked: no `eye()` call. |
| Void never round bites, never a glow blob | `tornVoid` everywhere; `voidBite` is not used. Rims are a clean ink line. No violet blobs. |
| Gold only on holy things | Only in XV (heaven, as leaf over black). XI's brass is olive. XIII has none (the halo is the Saint's alone). |
| Red only for blood, doom and rubric | Only XIII's sentence boards (rubric). |
| Two courses in every room | VIII frost and fire. IX frost and toxin. X lightning (scars) and toxin. XI frost and lightning (scars). XII frost and void. XIII fire and void. XIV toxin and void. XV lightning (scars) and void. |
| No flat fills, no regular tiling | Stepped tones, mottle and hatch everywhere. Floors are irregular flags or plates. Gilt plates were reworked from a brick-like grid into crazed leaf. |
| True scale | Everything is placed in metres on the shared camera (stakes 4.4 m, tents 4 to 4.6 m, steps 0.32 m rise). |

## Weak spots (honest list)

- **VIII.**
  - The ice face's Voronoi facets are bold. They read as carved glacier ice but lean toward "low-poly" at 1x.
  - The obsidian flow reads clearly as lava crust, but its silhouette is a plain tapering column (a vase or boot shape).
  - The breach above it is a small dark slab.
  - The hot crack reads a little like a glowing branch.
- **IX.**
  - The woven, sagging roof reads like shingles from afar.
  - The roots are thin twigs rather than a heavy tangle.
  - The dead on the benches are very low-contrast (by design for the quiet zone, but they barely read).
  - The fore bier overlaps foe 3's rump.
- **X.**
  - The far spires still read as a field of similar cones.
  - The two middle spires are pale and flat compared with the rest.
  - The clouds read as layered stripes.
  - The cocoons are small at 1x.
- **XI.**
  - The aurora-green burns by the conductor still have a faintly twiggy, plant-like read at 2x.
  - The dome ribs read as straight vertical poles. The dome's curvature overhead is weak; its courses look like a second wall.
- **XII.**
  - The Cold Star is a perfect round black disc, exactly as its bible entry says. If the director's "never round" void rule is meant to cover the star too, it needs a ruling.
  - Two of the tent tears are mostly hidden behind fighters.
- **XIII.**
  - The black flames read as black spikes or crystals rather than flame at 1x; the curled tips are lost at that size.
  - The stakes read partly as grave crosses.
  - The arcade is the most generic of the eight rooms (a stone arcade). Its identity rests on the stakes, the rose, the black fire, the tribunal and the eye in the void.
- **XIV.**
  - The dead trees beyond the hedge are simple Y-branching (slightly cartoon).
  - The giant caps have a stepped shadow rim.
  - The hedge's void cut-outs read as black splats at 1x.
- **XV.**
  - The lost-leaf flakes on the steps are large black blobs.
  - The right sky tear throws one long needle tear.
  - The fore column drum is a big gold block at the left edge (it clears hero 1, but it is loud).
- **All rooms.**
  - The far SVGs are large (X's is 4.4 MB) because every stroke is explicit. They render in under 2 s each.
  - The far SVG edge fringe from `wob` is fixed in the PNG only (see Contract).
  - Each room got 2 to 5 look-and-fix loops. None had a second director pass.

## Time

| Item | Agent time (approx.) |
|---|---|
| Kit and preview tools | 0.5 h |
| VIII (5 loops) | 1.2 h |
| IX to XV (2 to 4 loops each) | 0.5 to 0.8 h each |

The build and render of one room takes 5 to 8 s.
