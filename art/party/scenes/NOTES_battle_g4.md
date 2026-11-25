# Battle rooms round 2, worlds X, XI, XII (group g4): notes (2026-11-24)

12 rooms: 3 regular rooms and 1 boss room per world. Room 1 of each world was rebuilt under its game name. The old outputs were left in place, nothing was deleted: `hive_road`, `spire_dome`, `silence_camp` (their scripts and their `out/` files are untouched).

## Files

| What | Where |
|---|---|
| Shared helpers (new, mine) | `scenes/battle_kit_g4.js`: `air` (recession), `pool`, `shaft`, `frame` (light and value), `joints`, `puddle` (floors), `cloud` (billowed masses), `spire` (5 kinds), `comb`, `web`, `eggSac`, `roots`, `stars`, `gear`, `aurora`, `sastrugi` |
| Build | `sh scenes/build_battle_g4.sh <W> <room> <scene.js> <foes> [boss=<figkey>[@x]]` runs the scene, renders at 2x, runs `opaque_far.py`, then composes the preview |
| Preview and sheet | `scenes/battle_preview_g4.py`. Boss mode places the ruler canvas at true scale (0.594 at 2x, ground line on feet 860, centred at 2x x 2330) and the companion at 1640. It also writes `<room>_preview_1x.png` for 0.5x review |
| Rooms | `scenes/bg_hive_spires.js`, `bg_hive_comb.js`, `bg_hive_brood.js`, `bg_hive_boss.js`, `bg_spire_orrery.js`, `bg_spire_stair.js`, `bg_spire_top.js`, `bg_spire_boss.js`, `bg_silence_tundra.js`, `bg_silence_shrine.js`, `bg_silence_rift.js`, `bg_silence_boss.js` |
| Outputs | `out/scenes/battle/<W>/<room>_{far,mid,fore}.svg/.png`, `<room>.camera.json`, `<room>_preview.png` (and `_preview_1x.png`) |
| Sheets | `out/scenes/battle/X/world_X_rooms.png`, `XI/world_XI_rooms.png`, `XII/world_XII_rooms.png` |
| New foe renders (for the previews) | `out/scenes/battle/figs/`: X `spire_wasps`, `hive_drone`, `mantis_duelist`, `brood_mother`, `hive_queen`, `hive_queen_nospire`; XI `gear_spider`, `horologist`, `aurora_moth`, `rime_colossus`, `the_last_hour`; XII `rime_shade`, `starless_eye`, `void_mammoth`, `pale_hunter`, `cold_star`, `cold_star_noroot` |

Contract, checked for all 12 rooms:
- viewBox 1480 x 480, PNGs 2960 x 960.
- The far PNG is RGB (opaque), and the far SVG has the `<!--backstop-->` rect.
- Mid and fore are transparent.
- The camera is the nave's (horizon 300, eye 1.2, focal 652, cx 740; feet 430 at 6 m).
- Boss rooms also write `boss_stage` into their camera.json.

## Plan tables (written before building, checked after on the sheets)

### X, the Venom Spires

| Room | Place (bible) | Kind of space | Light | Shapes | Palette key |
|---|---|---|---|---|---|
| hive_spires | Where the plain road runs into the spire forest; web fields; the duelling ground | Open exterior, vast; the road runs straight into depth | Storm dusk; a pale white-violet band under the cloud base on the horizon | Verticals of many kinds (bulb, tiered, broken, twin, flared); webs strung between them | Cool violet-grey; dark overhead, light at the horizon |
| hive_comb | Inside a working spire, in its brood comb (drones feeding the hosts, beetles in the comb) | Enclosed, close and low; comb tiers hang overhead, cells opening down | One cold breach in the back wall, a slanting daylight beam onto the floor comb | Horizontals (tiers, paper bands) and hexes; the curve of the round wall | Warm dark paper ochre-brown, with venom-green accents |
| hive_brood | Under the plain road, the spiders' brood hollow | Underground, low and deep; the road's paving is the ceiling | Darkness with one lamp: a carter's lantern hooked on a root | Hanging curves: silk catenaries, egg-sac clusters, roots | The darkest of the world, warm (earth, amber, pale silk) |
| hive_boss (Hive Queen) | The mother spire, built round the first struck tower (the village church tower) | The vastest interior: a hollow rising out of sight, galleries of brood comb ringing it | A hard white-violet beam down the hollow from the crown onto the queen's stage | The tower's hard verticals against the hollow's curves and gallery arcs | Chitin black, highest contrast |

### XI, the Stilled Spire

| Room | Place | Kind of space | Light | Shapes | Palette key |
|---|---|---|---|---|---|
| spire_orrery | The dome hall with the great orrery and the gear loft | Vast round interior under a dome | Cold night shaft through the observing slit onto the orrery's sun | Circles and curves: converging ribs, orbit rings in depth, planets | Dark, cold night blue; brass catches the light |
| spire_stair | A landing on the great stair; the Horologist's study | A tall narrow shaft; the stair climbs the wall in a helix | One warm oil lamp hung from the soffit | Diagonals (the helix and its soffit) against verticals (the pendulum, the weights); many round clock faces | The warm side: lamp amber on brass, cold blue above |
| spire_top | The open gallery round the crown; the founder's empty plinth | Open exterior, high; the parapet sweeps away; the world below | The stopped aurora, cold green-white; the lightest room of the world | Horizontals: the parapet, the aurora bands, the horizon; one vertical mass (the crown) | Light and cold: snow, aurora green, violet, teal sky |
| spire_boss (Last Hour) | The clock chamber behind the great outer dial, at the top of the spire | The highest interior; the back wall is the glass dial seen from behind | The backlit dial, the boss standing in front of it like an eclipse; bar shadows thrown toward us | The great circle and its radial bars against the bell frame's timbers | Highest contrast: silver-blue light, black silhouettes |

### XII, the White Silence

| Room | Place | Kind of space | Light | Shapes | Palette key |
|---|---|---|---|---|---|
| silence_tundra | The open tundra at the camp's edge, on the herd's trail | Open, the widest and flattest | White-out daylight, sourceless, no shadows; the Cold Star high on the right | Long low horizontals; a few small verticals; the one perfect round | Near-white, the highest key |
| silence_shrine | The tundra folk's shrine cut into a glacier | Enclosed ice cave, banded vault, niches, an inner chamber | One thin blade of daylight through a fissure onto the saint in the ice | Curves and verticals: vault, icicle curtains, ice columns, niches; black halos | Mid to dark grey with the faintest cold blue |
| silence_rift | Where the void tore the tundra open; the last herd on the far rim | Open and deep: the land stops at a clean rim; the far side is a cut plateau face | Polar night; a pale twilight band behind the far rim | One long diagonal (the rift) through horizontals; strata; tusk curves | Dark: black sky, grey snow, absolute black absence |
| silence_boss (Cold Star) | The frozen lake below the camp, with the drum-dance ring of whale-jaw arches | Open, flat as a mirror | Inverted: the star has drunk the sky dark; the land is white; the corona and rings are the brightest things | Circles (the rings and their mirror) over one long flat; bone arches | Black sky, white ice |

Distinctness check (the sheets): the three regular rooms of each world differ in all five ways (place, space, light, shapes, key), and the boss rooms are their own spaces. One near miss: silence_rift and silence_boss are both night skies over snow. They are told apart by the plateau face and herd versus the disc, the mirror lake and the arches, but at thumbnail size the two skies read alike.

## Lore per room (what is placed)

- **hive_spires**
  - The near spires of five kinds, each crowned with scavenged iron (cross, vane, wheel, rod, or broken off and leaning), with burns down the paper from the crown.
  - Bound travellers hung on the flanks.
  - The web field across the road with burned prey, and webs between the middle spires.
  - The road straight into depth: kerbs, ruts with puddles catching the light, a strike scar with fused slabs.
  - The duelling ground's ring of stones and the fencing school's notched practice post (mid).
  - The toppled milestone, the overturned cart, the staff and gourd (mid).
  - Fore: a spire root with a flight hole and wasps; the bent waypost with a cocoon and a torn web.
- **hive_comb**
  - The paper wall in scalloped bands.
  - Brood comb patches with capped cells, larvae and nectar.
  - Hosts sealed head-down into great cells, a hand and cloak hanging out.
  - Two comb tiers on stalks, seen from below.
  - The spire's iron core rod with a burn clipped to the iron and a fused foot.
  - The breach with the storm and far spires beyond it, and the beam onto the floor comb.
  - Dead drones and larvae on the trodden floor comb.
  - Mid: a fallen comb fragment, a dead drone on its back, a nectar ball, a pack and staff.
  - Fore: the near tier's broken underside overhead, a stalk pillar, wall comb close up.
- **hive_brood**
  - The road's slabs as the ceiling, with a cart wheel come through and roots in the joints.
  - Earth piers with egg-sac clusters (some swollen green).
  - Silk sheets in catenaries, cocooned prey (a traveller with a burn, a mule's leg), and a web with strike-burned prey.
  - Tunnel mouths and an earth face with strata.
  - The carter's lantern, still burning.
  - Mid: a fallen slab with a rut, a cocooned dog, an empty shoe and a split pack.
  - Fore: the paving close overhead with roots; an earth bank with sacs; a hung cocoon.
- **hive_boss**
  - The church tower in rubble stone, with its west door choked with comb, the gutted belfry lancet, and burns down the stones from the top.
  - The tower's iron cross dragged down the hollow as the first rod, arms fused, hanging to where the queen's back is.
  - Four tiers of brood galleries round the hollow.
  - Church floor slabs with incised crosses under drones' dead and spent comb.
  - Mid: a drone heap, a lifted cross slab, a pilgrim's hat with a lead badge.
  - Fore: a hanging comb tier, the tower's buttress, a paper column with the rod's guy chain.
- **spire_orrery**
  - The dome seen from inside: courses narrowing up, twelve brass ribs converging, the open slit with stopped stars.
  - The gear loft: a timber gallery round the drum under ten stopped wheels, one with a new brass tooth (the spiders' repair).
  - The conductor with fused clamps and aurora burns on the stone.
  - The orrery: a drive drum, the column (burn clipped to it), five orbit rings as ellipses in depth, planets with Saturn's ring and the moon, and the brass sun lit by the shaft. All rimed and icicled.
  - The zodiac ring in the floor.
  - Mid: a fallen planet, a pilgrim's staff and badge, a gear spider's oil can.
  - Fore: the telescope pier, shutter chains, the dome rim.
- **spire_stair**
  - The helix of treads on the shaft wall, with soffit, rail and icicles, and treads worn hollow by pilgrims.
  - The study wall of 34 clocks, every one at one minute to twelve, frosted.
  - The empty sentry niche with its brass bracket.
  - Three weights on chains coming down from the Last Hour above.
  - The pendulum stopped at the end of its swing, not plumb.
  - The Horologist's lamp.
  - Mid: his bench with a dismantled movement, a candle and a basket of wheels; a fallen halberd.
  - Fore: the soffit of the next turn, the newel, a long-case clock with its door open and pendulum gone.
- **spire_top**
  - The crown wall with its frosted lancet.
  - The parapet sweeping away, with balusters, rimed coping and burns along it, and pilgrims' votive ribbons frozen stiff.
  - A brass transit instrument, fused.
  - The founder's plinth, empty: snapped dowels, the inscription plate, the ice feet left standing, shards, and the drag of the statue's first steps toward the front.
  - The hive plain far below with its spires as specks and the storm on the horizon.
  - Frozen stars and the stopped aurora.
  - Mid: a fallen finial, a frosted lantern, the key's crate.
  - Fore: the crown buttress, a parapet pinnacle with a gargoyle spout and a long icicle (blank sockets, no eye).
- **spire_boss**
  - The outer dial from behind: frosted glass lit from outside, reversed numerals, the outer hands' shadows at one minute to twelve, the armature, the arbor with its fused collar.
  - The drive shaft from the movement, fused.
  - The going train in its iron cage.
  - The bell frame with the hour bell and its hammer drawn back and frozen; the bell rope.
  - The stairhead from the Clockwork Stair.
  - The dial's light thrown across the floorboards, with the bars' shadows.
  - Mid: a spare wheel, an oil can, the hourglass on its side with its sand mid-fall.
  - Fore: the tie beam, a frame post, a chain.
- **silence_tundra**
  - The Cold Star: a perfect disc, a corona and frost rings.
  - The herd stopped on the far rise, facing the star.
  - The herd trail, and footprints that stop.
  - Two slumped hide domes (no cones), one with a torn void absence and an eye.
  - The Grandmother's masks on a cord.
  - The marker cairn with its offering, and a reindeer frozen kneeling.
  - No shadows anywhere.
  - Mid: a spear, a mitten, a fish.
  - Fore: a drift; a herder's pole with a frozen hide strip and bone charms.
- **silence_shrine**
  - Banded glacier ice.
  - The saint frozen in clear ice behind the altar, kneeling with hands raised, a halo of black frost crystals.
  - Five niches with kneeling dead votaries under black halos.
  - Void absences in the ice with eyes looking out.
  - The altar of ice and stone with a bone top: offerings and prayer strips frozen stiff.
  - The fissure and its blade of light.
  - Meltwater runs converging on the altar.
  - Mid: a broken ice column, a bowl, prayer strips.
  - Fore: ice columns and the vault edge with its icicle curtain.
- **silence_rift**
  - The plateau's cut face: strata, bones of old herds, slivers reaching off and fading, black below.
  - The near rim with slivers and drifting flecks.
  - The last herd on the far rim, one mammoth cut clean in half by the rim.
  - Shades lying flat on the snow, cast by nothing.
  - Starless patches in the sky.
  - Mid: a tusk, a broken crook.
  - Fore: a drift with a sledge runner; a snow cornice whose end the void took.
- **silence_boss**
  - The dark slate sky round the star, with frost crystals hanging still.
  - The mirror lake: it reflects the rings but not the disc; a faint dotted ring marks where the disc's reflection should be.
  - Fishing holes torn through the ice (void).
  - The drum-dance ring of four whale-jaw arches with offerings; the trodden ring; the singers' two hollows.
  - The camp tiny on the far shore, its smoke cut off clean.
  - Mid: the drum-seer's drum dropped flat, a clean absence through its painted skin, its beater; a fish spear; frozen fish each with a clean hole.
  - Fore: a jaw-arch foot with beads and a bundle. The stage is kept clear.

## Rules audit

- **Lightning:**
  - No arcs or bolts anywhere.
  - Burns are clipped to the surface they mark: the core rod, orrery column, sun, bob, bell, waypost board and pinnacle are clipped explicitly; the burns on spires, dome, walls and paving lie on those planes.
  - The burns that had branched off free-standing rods into the air were removed in the last pass.
- **Eyes:** only in XII: the shelter tear, the masks, the shrine absences. X and XI have no `eye()` call.
- **Void:**
  - Every void mark is a `tornVoid` or an irregular clean-rimmed absence (the rift, the cornice, the cut mammoth, the drum skin). No circle clusters, no glow.
  - The Cold Star is a perfect round disc, per Cole's ruling.
- **Gold:** none. Brass is olive-brown.
- **Red:** none drawn.
- **Stone:** no brick tiling. Stone is rough ashlar or rubble, courses of mixed height with split stones, and irregular flags.
- **Scale:** everything is placed in metres on the shared camera. Bosses are at true scale in the previews.

## Weak spots (honest list)

- **Boss figures bring their own staging.**
  - The Hive Queen's rig has a `spire` bone: a paper wall slab and a floor strip, cut square at its left edge. In the preview, and so in the game, it covers most of the right stage, and its floor strip ends in a hard vertical seam about 2x x 1855.
    - The room's own stage behind it (the beam, the iron cross coming down to her back) is mostly hidden.
    - Recommendation: the game drops the `spire` bone in this room. `X_hive_queen_nospire.png` exists to try it.
  - The Cold Star's `root` bone (a tundra ground plane and a tiny camp) was dropped in the preview (`XII_cold_star_noroot`). If the game draws it, it will cover the lake.
  - The Last Hour brings its own beam and stone plinth, which sit on the clock-chamber floor acceptably.
- **hive_spires.**
  - The spires read better than round 1 (kinds, crowns, dark against the light band), but still a little like melted candles or stalagmites.
  - The big orb web over the road is close to a Halloween cobweb.
  - The duelling-ground stone ring is too small to read.
- **hive_comb.**
  - The breach's torn paper flaps read a little like teeth.
  - The comb patches on the wall are regular hex grids (as comb is), so they read slightly tiled.
  - The host cells read as pointed niches.
- **hive_brood.**
  - The lantern is small. The piers are low-contrast.
  - The tunnel mouths at the back are nearly invisible.
  - The overall amber haze is close to uniform near the centre.
- **hive_boss.**
  - The beam is built from nested bands, so its steps show as stripes.
  - The church tower is still a fairly flat facade parallel to the picture plane, though darkened and turned at its right flank.
  - It shares a breach-and-beam device with hive_comb, so the two rooms are related, though different in scale, key and palette.
- **spire_orrery.**
  - The dome ribs still lean only slightly. The curvature reads mostly from the cornice smile and the converging courses, not from rib curvature.
  - The orrery column and its plain box base read a little like a lamp post.
  - The sun's rays are iconic, close to cartoon.
- **spire_stair.**
  - The helix reads as one diagonal flight, not a full spiral (the next turn is only the fore soffit).
  - The 34 clocks are small and a little like floating discs.
  - The study is only implied (the bench is in the low mid layer).
- **spire_top.**
  - The crown wall is a big flat-ish stone mass.
  - The aurora's lower bands and the sky steps read slightly as stripes.
  - The far world below is a thin strip.
  - The ice feet on the plinth are small.
- **spire_boss.**
  - The hour bell is still a stiff, lampshade-like profile.
  - The left half (going train, bell frame) is dark and low in detail compared with the dial.
  - The floor light is weak.
- **silence_tundra.**
  - The hide shelters are partly behind the heroes.
  - The sky haze shapes read as faint clouds, which a white-out sky would not have.
- **silence_shrine.**
  - The ice bands are still horizontal stripes across the back wall.
  - The niches' black halos read a little like round windows.
  - The overall value is still close to mid grey outside the light blade.
- **silence_rift.**
  - The half mammoth cut by the rim reads as a white block until you look.
  - The sky's stepped bands look like distant mountains.
  - The gulf's black band is narrow at thumbnail size.
- **silence_boss.**
  - The mirrored rings are subtle at 1x, so the "nothing reflects from it" idea needs a second look.
  - The fore jaw-arch at the left edge reads as a pale strip.
- **All.**
  - Each room got 2 to 4 look-and-fix loops and no second director pass.
  - Far SVGs are 0.2 to 6 MB (X's comb rooms are the heaviest).
  - The wobble-fringe fix lives in the PNG (plus the SVG backstop), as before.

## Polish round (Cole's review and the director's list)

All 12 rooms were rebuilt, re-previewed and re-sheeted (same output paths).

### Cole's notes

- **XI spire_top: no visible floor.** The gallery now has a real floor plane in perspective under the fighters:
  - stone flags laid in courses (`B.flags`), with lead strips in the joints running into depth;
  - snow blown off the middle of the walk, lying in the joints, in thin drifts and in a carved bank at the parapet foot;
  - a worn path and debris in the fighters' band.
  - The old walk polygon was self-intersecting, which had left the left half bare; that is fixed.
- **XII silence_rift: half-cut mammoth.** The cut mammoth is gone. The herd is now five whole mammoths, each its own size and stance: a cow, a calf beside her, one turned back toward the others, and the bull at the rim.
- **Trees, all worlds.** Worlds X to XII have no trees. The only tree-like forms are the hanging roots in hive_brood. `G.roots` now smooths and tapers them (fillS/inkS), with smaller kinks and rootlets drawn as smooth three-point curves.

### Director's list

- **hive_spires.**
  - `G.spire` now gives lumpier, termite-mound silhouettes: noise at three frequencies plus 6 to 12 random lumps, vertical flutes, and side turrets (paper chimneys with flight holes) on the large spires.
  - The big orb web is smaller and irregular: uneven radial lengths, sagging spiral, 18% of segments missing, more torn sectors, and loose strands hanging from its lower edge.
- **hive_boss.**
  - The beam is now a soft gradient with blurred edges; the stripes are gone.
  - The grand feature now stays visible:
    - the tower's iron cross hangs on its chain in the beam, above the head line, left of the queen;
    - its rod runs on into the dark to her back;
    - the rent in the crown, the beam's source, shows at the top as torn paper edges against a white glare.
- **spire_orrery.**
  - The dome is now a low saucer (4.6 m rise), so the twelve ribs visibly curve over and converge inside the frame.
  - The courses follow the saucer, and the slit widens toward the crown.
- **spire_stair.**
  - The clocks are no longer floating discs:
    - four shelves on iron brackets carry bracket clocks, lantern clocks and dismantled movements;
    - five wall clocks hang on nails by cords;
    - every clock is a different size and make.
  - The helix reads now: the next turn overhead is a stepped soffit whose treads rise across the frame top, against the back flight rising the other way.
- **silence_shrine.**
  - The ice stripes are replaced by one mass of glacier ice, shaded smoothly (darkening to the frame sides, lightest at the saint), with:
    - a few folded dust layers that bend and pinch out;
    - clear lenses;
    - frozen meltwater runs.
  - The niches vary in width and height.
  - Value range: darker frame edges; the focus is now the brightest area.
- **rift vs boss skies.**
  - The rift's night is now clouded: soft low overcast over a gradient, with a twilight band.
  - The lake's sky is a clear gradient with the star.

### Across all rooms

- **Atmosphere.** Changed in `battle_kit_g4.js`, so it applies to every room:
  - `pool` is a smooth radial gradient;
  - `shaft` is a blurred gradient beam;
  - `cloud` is soft overlapping billows with lit caps, wisps and only broken ink strokes;
  - `aurora` is gradient curtains with blurred rays;
  - new `sky()` (smooth gradient skies) and `softMass()` (fog, haze, scud).
- **Gradient skies.** Every stepped sky is now a gradient: hive_spires, spire_top, silence_tundra, silence_rift, silence_boss. The tundra's wind streaks and hive_spires' scud are soft masses.
- **Fighter-band floors.** New `G.bandFloor()` adds a worn path along the fighters' depth, scuffs, debris with contact shadows, and cracks running into depth. It is in all 12 rooms.
- **Repetition broken.**
  - hive_comb host cells: varied size and width, some without a hand, one torn open and empty.
  - spire_stair clocks: as above.
  - silence_shrine niches: varied.
  - silence_boss arches: three of different heights; the fourth has fallen, one jaw standing and its fellow lying on the ice.
  - silence_rift herd: as above.
- **Scale cues added.**
  - spire_orrery: a pilgrims' oak bench (seat 0.45 m).
  - spire_boss: a ladder up the bell frame (rungs a foot apart).
  - silence_tundra: a herder's sledge in the gap between the lines.
  - silence_shrine: a whalebone kneeling bench and a seal-oil lamp.
  - The cart (hive_spires), packs and staves, bench and crates elsewhere remain.
- **spire_boss bell.** It has a true bell profile (crown, shoulder, concave waist, swelling sound bow) and is lowered into the frame. The hammer and ladder were re-aligned.
- **Value.** The far layers were checked for range: 1st/99th percentile luminance spreads from about 13–90 (hive_brood, dark by design) to about 16–242 (silence_tundra).

### materials_v2 (not READY when this round finished)

`scenes/materials_v2.js` exists, but `scenes/materials_v2.READY` does not, so no calls were swapped yet. Calls to swap:

| Room | Current call | Swap to |
|---|---|---|
| hive_spires | `B.flags` (road) | `MV.weatherFloor` |
| hive_spires | milestone `cel` | `MV.stoneMarks` |
| hive_spires | fore thistles (`line`) | `MV.strand` |
| hive_brood | ceiling-slab `cel` loop | `MV.begin(...).stone` + `end` |
| hive_brood | `G.roots` ×3 and fore roots | `MV.hangRoots` |
| hive_brood | earth piers, earth bank | `MV.rockSkin` |
| hive_boss | `S.ashlar` (tower) | `MV.weatherWall` on the same plane |
| hive_boss | `S.ashlar` (fore buttress) | `MV.weatherWall` |
| hive_boss | `B.flags` (church floor) | `MV.weatherFloor` |
| spire_orrery | `S.ashlar` (drum) | `MV.weatherWall` |
| spire_orrery | dome-stone `cel` loop | `W.stone` on a vault plane |
| spire_orrery | `B.flags` | `MV.weatherFloor` |
| spire_stair | shaft-wall stone `cel` loop | `MV.begin` / `W.stone` + `weatherWall` |
| spire_stair | `B.flags` (landing) | `MV.weatherFloor` |
| spire_stair | newel | `MV.stoneMarks` |
| spire_top | `S.ashlar` (crown) | `MV.weatherWall` |
| spire_top | `B.flags` (walk) | `MV.weatherFloor` |
| spire_top | parapet `cel`, plinth boxes | `MV.stoneMarks` |
| spire_boss | `S.ashlar` (dial wall) | `MV.weatherWall` |
| spire_boss | dial-ring voussoir `cel` | `MV.stoneMarks` |
| silence_tundra | cairn `lump` | `MV.stoneMarks` (wx `silence`) |
| silence_rift | plateau cut face | optionally `MV.hewnRock` / `rockSkin` (it is a void cut, so keep it fresh) |

### Weak spots after polish

- **hive_boss.** The Hive Queen's own `spire` bone still covers the right stage and leaves a hard seam. Dropping the bone in this room is recommended; `X_hive_queen_nospire.png` exists to try it.
- **hive_spires.** The spires are better but remain a family of tapering towers. The side turrets can read as fins.
- **spire_top.** The crown wall is still a flat, blocky mass. The lead in the floor joints is subtle at 1x.
- **spire_stair.** The shelves are thin.
- **silence_shrine.** The dust layers in the ice read as scratchy streaks near the top. The vault band is still mid grey.
- **silence_rift.** Stars still show through the overcast, so the two night skies are distinct but not opposite.
- **silence_tundra.** The sledge is partly behind the duelist.
- **All.** Stone is not yet weathered with materials_v2 (see the table above).

## materials_v2 swap (after materials_v2.READY)

- **Automatic weathering.** `lik.js` ashlar/masonry and `battle_kit_b.flags` now weather themselves, so these pick it up on rebuild:
  - hive_boss: tower and buttress;
  - spire_orrery: drum;
  - spire_top: crown;
  - spire_boss: dial wall;
  - every `B.flags` floor (hive_spires road, hive_boss floor, spire_orrery floor, spire_stair landing, spire_top walk).
  - `G.roots` in my kit already draws through `MV.hangRoots` (the materials agent's edit).
- **Explicit swaps (`const MV = require('./materials_v2')(S)` in each room):**
  - **spire_stair:** shaft-wall stones go through `MV.begin(wall).stone(...)` + `end()`, so they get runs, frost and cracks on the wall plane.
  - **spire_orrery:** dome stones go through `MV.begin(dome).stone(...)` + `end({ plane: false })`.
  - **hive_brood:** ceiling slabs go through `MV.begin(ceiling).stone(...)` + `end({ plane: false })`.
  - **`MV.stoneMarks`:**
    - hive_spires milestone;
    - spire_top: every third parapet stone and the plinth face;
    - spire_boss: dial-ring voussoirs;
    - silence_tundra: cairn stones.
  - **`MV.strand`:** the hive_spires thistles (smooth tapering stems).
- **Tried and removed.**
  - `MV.stoneMarks` on spire_stair's newel: one frame-tall polygon gave a cluster of white bubble marks.
  - `MV.rockSkin` on hive_brood's earth piers: it washed the pier into a pale funnel against the dark.
- **Not swapped (on purpose).** silence_rift's plateau cut face is a void cut, so it stays fresh, with no weathering.
- **Rebuild everything:** `sh scenes/rebuild_g4.sh` (or `sh scenes/rebuild_g4.sh X|XI|XII`). It does the layers, the opaque far, the previews (and `_preview_1x`) and the three sheets in about 4 minutes.

## Final touch-up (2026-11-25): spire_top crown
- The crown is two stages. Lower: moulded plinth, string course with icicles, three buttresses with snow-laden set-offs
  and coursed fronts, a corbel table, a crenellated parapet of irregular merlons (snow caps, windward rime, one lowered),
  a ruined stretch broken to stumps with its stones on the string course and at the foot. Upper (set back): its own
  string course, the frosted lancet, and its top broken down on the right against the aurora.
- Weak spots: merlons have no visible thickness (seen from below); the parapet band is evenly lit.
