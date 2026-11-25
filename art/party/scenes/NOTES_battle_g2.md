# Battle rooms, round 2: worlds IV, V, VI (group g2)

Brief: `scenes/BATTLE_ROOMS_BRIEF.md`. Kit: `scenes/battle_kit_g2.js` (new; `lik.js`, `battle_li.js`, `battle_kit_b.js` untouched).
Build: `sh scenes/build_g2.sh <roman> <room> <scene.js> <foe.png[@x]> ...`; preview and sheets: `scenes/comp_g2.py`.

## Plan tables (written before building)

### World IV, the Sulphur Pits (palette: sulphur yellow, ochre smoke, lamp orange)

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `pits_shaft` (upgrade) | The shaft bottom and upper gallery: where the cage came down, the lamp room, the weighman's platform, the powder store behind its timber gate | Enclosed timbered chamber, middle scale, low roof | Cold grey daylight falling down the winding shaft (a beam, centre) against warm oil lamps on the sets | Rectilinear timber: verticals of sets and props, horizontals of caps and lagging; rails | Mid key, the cool side (grey daylight on ochre) |
| `pits_vent` | The deep natural sulphur cavern under the workings where the gas breathes: vents, the yellow toad pool, the deep seam | Underground natural cavern, vast and deep, water level | Firelight from below: burning gas vents and the hot pool glowing up; no daylight | Curves: flowstone, rimstone terraces round the pool, vent chimneys, crystal crusts; natural, no timber | Hot light key: yellow-orange |
| `pits_chapel` | The miners' rock-cut chapel (the canary priests' chapel): carved pillars, the altar with its gilded figure, canary cages hung by the hundred | Enclosed carved interior, tall nave axis, apse | Candlelight: a blaze of votive candles and a hanging lamp-crown at the altar (warm focus, centre back); yellow gas pooled under the vault | Round rock-cut arches, carved columns, hanging cages; built, symmetrical axis | Dark key, warm amber |
| `pits_boss` | The First Breach: the main gallery's end where the miners broke into the first gas pocket; the pocket is a vast blistered cavity, and the Burning Lung fills it | Gallery opening into a vast domed cavity (grand scale) | Backlight: the cavity glows orange from inside, smoke lit against it; the gallery dark | A ragged breach in the gallery face framing the boss; ribbed, lung-like blistered vault; broken sets and twisted rails as leading lines | Highest contrast: black against orange |

### World V, the Storm Foundry (palette: bronze, white-gold burns and sparks, soot)

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `foundry_mould` (upgrade) | The bell-casting hall: the bell pit with the half-cast great bell, the crane with its fused chains, the cupola furnace, a finished bell hung on its frame | Big interior hall, wall parallel but now with a side aisle and a far end | Mixed: wet storm glare through tall windows (cold) and the cupola's white-gold door (hot) | Tall arched windows of varied state, the bell silhouette, crane diagonals | Dark key, cold-and-hot split |
| `foundry_floor` | The forging floor: the long anvil line where the slaves are chained, trip hammers driven by line shafts and belts, hearths down both sides | Long deep interior, one-point perspective running away from the camera, low roof | Firelight: rows of hearths receding, each a hot pool; the far door open on the rainy yard (a cold slot at the vanishing point) | Converging diagonals: line shafts, belts, hammer helves in rhythm | Warm, mid-dark (orange-white) |
| `foundry_roof` | The foundry roofs of the guild-city: lead flats between chimney stacks, the great bellows house, the Storm-Catcher's spire and cables; the city wall and its gate beyond | Open exterior, high, vast | Storm light: the thunderhead's wet daylight glare, rain sheets, smoke; cold | Verticals of chimneys and the spire, pitched roof diagonals, the bellows' pleats | Cold, light key (grey-blue, bronze accents) |
| `foundry_boss` | The Great Anvil: the guild's first forge, a round smithy where the Titan was built and set to work; the great hearth behind, the rod spire through the roof oculus | Vast round interior (cathedral scale) | Most dramatic: the great hearth's white-gold blaze behind the boss + a cold column of rain through the oculus | An apse-like hearth arch framing the giant, radial roof ribs, a stepped anvil plinth | Black, white-gold and cold blue; highest contrast |

### World VI, the Stormwrack Coast (palette: slate grey, white surf, lamp yellow)

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `coast_cliffs` (upgrade) | The wreckers' strand under their cliff: the false lamp, the harpies' roost ledges, a wrecked ship on the sand, the gibbet on the headland | Open exterior beach, wide | Grey storm daylight, a pale glare on the sea | Cliff masses, the wreck's angular frames and stern, horizontals of sea | Light key, cold grey |
| `coast_cove` | The wreck cove: a sea cave at the foot of the cliff where a Drowned Kingdom ship lies jammed in the mouth; eel shallows inside | Under-structure: a cave at water level, enclosed and dark | Contre-jour: the cave mouth's storm glare behind the wreck; inside dark, wet glints | The cave arch (curves), the hull's sweep, flat water | Dark key, cold green-grey |
| `coast_light` | The false lighthouse: its top gallery round the lantern room, at night | High exterior, tight (a ledge in the sky) | Night; the great lamp blazing lamp-yellow behind the fighters, its beams thrown through the rain | Radial and curved: the lantern's glazing bars, the round gallery rail and corbels | Warm lamp yellow in a black-slate key |
| `coast_boss` | The whale's roads: the wreckers' old whaling slip at the foot of the point, where they harpooned the bull and failed; two sea stacks make a gate to the open sea | Open exterior at sea level, vast | Most dramatic: a break in the storm behind the stacks, white glare on the surf, sheets of rain | The stacks framing the giant, the slipway's timber ramp, harpoon racks and try-pots | Black slate against white surf |

## Files

- Kit: `scenes/battle_kit_g2.js` (new): `stoneCells` (Voronoi rock or rubble in strata, replaces the round-1 triangle facets), `rockMass`, `smoothRock` (flowstone, sea-worn slate, cliffs: ribbons of tone, no cells), `timber`, `oilLamp`, `fireAt` (the figure engine's real fire from `props_li.fire`, at a world point), `sparks`, `cage`, `keg`, `lantern`, `cloudMass`, `veil` (recession), `frameDark` (stepped dark frame round a light focus), `floorCracks`, `puddle`, `sea`, `lightTint` (stepped light colour on stone near a light).
- Preview and sheets: `scenes/comp_g2.py` (same compositing as `comp_battle.py`, but each foe takes an x: `foe.png@x2`, so a ruler can stand in the boss stage; `sheet` makes the 2 x 2 world sheet). Build: `sh scenes/build_g2.sh <roman> <room> <scene.js> <foe.png[@x]> ...`.
- Rooms (all write to `out/scenes/battle/<roman>/`: `<room>_{far,mid,fore}.svg/png`, `<room>.camera.json`, `<room>_preview.png`):
  - IV: `bg_pits_shaft.js` (rewritten), `bg_pits_vent.js`, `bg_pits_chapel.js`, `bg_pits_boss.js`
  - V: `bg_foundry_mould.js` (upgraded in place), `bg_foundry_floor.js`, `bg_foundry_roof.js`, `bg_foundry_boss.js`
  - VI: `bg_coast_cliffs.js` (upgraded in place), `bg_coast_cove.js`, `bg_coast_light.js`, `bg_coast_boss.js`
- Sheets: `out/scenes/battle/IV/world_IV_rooms.png`, `V/world_V_rooms.png`, `VI/world_VI_rooms.png`.
- No renames were needed in IV to VI (room 1 keys already match the game). Round-1 copies of the two scripts upgraded in place are in the session scratchpad only; the round-1 outputs were overwritten by the same keys.
- Camera contract unchanged (horizon 300, eye 1.2, focal 652, cx 740; fighters 6 m, feet 430; far opaque, checked alpha 255 on all 12). Boss rooms add `boss_stage` to their camera json (informational).
- Previews: bosses at true scale (figure scale 0.594 at 2x, like every foe): Burning Lung at x2 2500 with a gas-lung miner; Anvil Titan at 2420 with a bronze automaton; Thunder Whale at 2440 with a shock eel.

## After-build check of the distinctness tables

Thumbnail test (`comp_g2.py thumbs`): each world's four rooms are told apart at 370 px wide by value key and silhouette alone.
- IV: shaft = cold grey beam down the middle of timbered rectangles; vent = hot yellow-orange cavern with hanging flowstone and a standing flame; chapel = dark nave axis with a warm apse and cages; boss = black gallery with an orange breach at the right. Shared: ochre/sulphur palette, timber, crystal crusts.
- V: mould = parallel wall with tall varied windows and a hung bell; floor = one-point perspective tunnel of hearth glows; roof = light-key grey rain exterior with stacks and spire; boss = round hall, white-gold apse hearth, cold rain column.
- VI: cliffs = light grey day beach, wreck and cliff; cove = black cave frame round a bright mouth; light = black night, yellow lantern drum; boss = storm glare between sea stacks, white surf.

## Lore placed (beyond the header of each script)
- pits_shaft: the Owner's burnt hat in the daylight beam under the shaft; the powder store with kegs, barred gate, a chalked no-flame slate and its lamp hung well away; lamp room with missing lamps; the shrine's gilded figure (only gold).
- pits_vent: the deep seam's adit high in the wall, its ladder broken and a lamp still lit; a miner's cap and cold lamp, a crushed canary cage on the shelf.
- pits_chapel: dozens of canary cages hung at every height, every bird dead; gas haze pooled under the vault; offerings (lamps, tally tokens, prayer slips) on the piers; miners' grave slabs with chalked names; gilded holy figure holding up a lamp (holy, gold).
- pits_boss: the breach the miners' picks made, the last shift's tally struck through, the warning board, sets snapped and rails curled into the pocket.
- foundry_mould: the finished bell in its frame with an inscription band and a burn down its waist; the cupola's runner glowing to the pit; walled-up, open, barred and burst windows onto the guild-city.
- foundry_floor: the slaves' chain from ring to ring down the anvil line; cold, banked and roaring hearths; the fused line-shaft coupling; rain through the broken roof.
- foundry_roof: the great bellows under the lean-to with its rocking beam; the Storm-Catcher's spire and copper cables to the foundry; the city wall's bronze gate (Talos's post); a welded weathervane.
- foundry_boss: the guild's first round forge; the great hearth as an apse; the Titan's spare bronze hand and a helm mould in the bays; the broken binding chains; a breastplate and helm hammered flat with old blood ("it found something softer").
- coast_cliffs: the harpies' nests on the ledges (bones, rope, feathers, guano); the wreck now a ship; ripple marks, runnels, shells, the wreckers' tracks to the salvage.
- coast_cove: a Drowned Kingdom ship (verdigris bronze wale, crowned figurehead) jammed in the cave mouth with the bosun's lantern; the eel shallows; the wreckers' cache.
- coast_light: the false light's lantern room (drum lens of prism bands, diagonal astragals), the beams in the rain, a ship standing in for the reef far below, the fused rail joint.
- coast_boss: the wreckers' whaling slip, cold try-pots, a half-empty harpoon rack (the rest are in the whale), the flensing gantry, a lesser whale's jawbone arch, the sea-stack gate with the wreckers' lamp.

## Rules audit
- No lightning arcs or bolts drawn in any of the 12 rooms. Storm shows by rain, wet light, glare, scorch burns clipped to surfaces, fused metal. (The Thunder Whale and Spark Swarm renders carry baked arcs of their own; those are figure files, not room art.)
- No eyes. Gold only on holy figures (pits_shaft shrine, pits_chapel altar saint). No red except old blood (foundry_boss). No regular brick tiling (stone is Voronoi rubble, coursed rubble with pinning, or dressed piers).
- Quiet zone: every far layer steps toward murk from y 230 to 352; mid layers hold only low dark props.

## Weak spots (honest)
- **All rooms:** the stone (`stoneCells`) still reads as big rubble or crazy-paving polygons in places, especially at near depth (pits_shaft roof, foundry_floor side walls, chapel arcades). It is no longer low-poly, but hewn rock and coursed walls look alike.
- **Foundry SVG sizes:** the rooms that use the figure-engine fire (`fireAt`) embed its defs in every layer: foundry_floor 11.3 MB and foundry_boss 9.9 MB for three SVGs. Trim defs per layer if size matters.
- **pits_shaft:** the near fore cap and lagging sit above the frame, so the top framing is only a split board and a hanging rope; the powder store's kegs are mostly hidden behind the foes in the preview.
- **pits_vent:** the fumarole mound sits low in the quiet band and barely reads; the flame on it carries the focus. The shelf floor is still large flat polygons. Curtains read as flowstone but a little stiff.
- **pits_chapel:** the side-aisle walls and arcade faces use the same rubble cells as the floor; the fore candles at the left are small.
- **pits_boss:** the smoke along the roof has a wavy lit edge that reads a little like a zigzag line. The cavity's ribs are drawn arcs; fine behind the toad but graphic where they show.
- **foundry_mould:** the cupola is hidden behind the elite in the preview; the bell in the pit still reads as a dome (the hung bell now carries the read).
- **foundry_floor:** the hood shapes are still near-pyramids, and the flue stacks read a little like hanging boards. Trip hammers are hard to read at game size.
- **foundry_roof:** the bellows read as a pleated wedge under a beam; a viewer may not get "bellows" without the imps. The stacks' smoke is small dark puffs.
- **foundry_boss:** the Titan render ends at the canvas bottom; the plinth's near step in the fore hides the cut, so he reads as standing behind the step. The hearth arch sits a little left of his head.
- **coast_cliffs:** the old scorch fern at the top left still reads a little like a bare tree; the nests are small at game size; ledges are thin.
- **coast_cove:** the cave mouth is still a fairly smooth oval; the figurehead is small.
- **coast_light:** the sea far below is very dark; the lured ship is tiny.
- **coast_boss:** the glare reads a little like a moon; the near breaking wave is graphic (a band of foam over a dark face); the shock eel and whale renders sit on their own flat water discs, which the wave hides only for the whale.

## Polish round (Cole's review, BATTLE_POLISH_BRIEF.md)

All 12 rooms were rebuilt, re-previewed and re-sheeted (the same output paths; the sheets are titled "(polish)").

### Kit (`battle_kit_g2.js`) additions
- `hewnRock`: worked living rock with bedding planes of uneven thickness, joints across the beds, an undercut shadow under each bed with a lit lip, spalls, pick-mark scars in sets, hairline cracks, seep patches, speckle and weathering streaks. No cells. Used for all the world IV rock (shaft wall and roof, the working face, the chapel's rock-cut apse, chancel, aisles, arcades and vault, the breach gallery, and the vent shelf with its beds running into depth).
- `builtWall`: coursed rubble masonry (lik `ashlar`, rough, pinning slips) plus weathering (a damp foot, run streaks, bloom patches). Used for every built wall in world V (the hall, shop and forge walls, the chimney breasts, piers, the bricked window, the parapet). So hewn rock (IV) and built walls (V) are now different materials.
- Soft atmosphere: `softMass` (lobed masses, blurred, with a lit crown, a dark belly and torn-off wisps), `steam` and `bank` (blurred replacements with the same signatures as battle_li's). Every `BK.steam`/`BK.bank` call in IV to VI was switched, and `cloudMass` now maps to the soft version.
- Smooth gradients for skies, glows and fog: `skyGrad` and `radial`.
- `trim_defs_g2.py` (run by `build_g2.sh`) trims each layer's `<defs>` to what that layer references. Measured: the fire defs were only a few KB per layer. The 10 MB came from the Voronoi stone cells on the long side walls, so replacing the stone is what shrank the files. foundry_floor 11.3 MB went to 7.6 MB for 3 layers (far 6.0 MB, because of the masonry on the long side walls and the chimney breasts); foundry_boss 9.9 MB went to 5.1 MB.
- materials_v2 hook: the kit uses `materials_v2` automatically once `materials_v2.READY` exists (`G2_MV=1` forces it for a test). With it, `hewnRock` calls `MV.hewnRock` and adds the room's light tint, `builtWall` adds `MV.weatherWall`, and `smoothRock` adds `MV.rockSkin`. A forced test before READY drew pale parallelogram outlines over the shaft's rock, so look at one room after READY before trusting it.

### Room by room (before → after)
- **foundry_floor (Cole):** the hearth bays were pyramids and boxes; now there are three kinds of bay in an uneven rhythm.
  - Hearths: a stone hearth with an ash-pit arch, a tuyere and a fire. The riveted iron hood has plate seams, rivet rows, a rolled lip lit by the fire, soot, a chalk tally and two hanging chains. The iron flue pipe is banded and riveted, with a damper lever and its pull-chain and ring. The chimney breast is masonry. An anvil and a quench trough (steaming at the live hearths) stand in front.
  - Tilt hammers seen side-on: the cam wheel face-on with spokes, four iron tappets and the belt to the line shaft; trunnion posts; an iron-hooped helve; the head over its anvil; sparks.
  - Tool racks: tongs hung by their reins, hammers by their heads, pokers, a chalked tally board, and a steaming quench trough.
  - Bronze castings hung to cool on chains: three bells and a cast grille.
  - Other fixes: the walls are built masonry, the yard sky has a gradient, there is a near pier and a hoist hook in the fore, the smoke is soft, and the light at the door and fires is brighter.
- **IV (all four):** the crazy-paving rock is now hewn rock in strata. The chapel floor is laid flags. The fore boulders are smooth weathered rock. pits_boss's roof smoke is now soft rolling masses. pits_vent got a scale cue (an ore barrow). The shaft beam and the chapel apse got brighter highlights (value range).
- **foundry_roof:** the bellows are stood on edge so the classic pear-shaped board faces the camera, with iron straps, the valve flap, deep leather pleats round the rim, an iron-shod nozzle into the stack, a cradle, and the lever and taut chain. The sky is a smooth gradient with soft cloud; the stack smoke is soft; the parapet is rough masonry.
- **foundry_mould, foundry_boss:** built masonry replaces the cells. The boss hearth glow is now a smooth radial gradient. The window clouds are soft.
- **coast_cliffs:** the old burn fern that read as a tree is gone (a small burn sits on the lamp ledge instead). The sky is a gradient with six large soft cloud masses.
- **coast_cove:** the mouth outline is now ragged (bigger jitter and notches). A rock fin stands at the mouth's foot and rock teeth hang from its lip. The sky is a gradient with soft cloud.
- **coast_light:** the night sky is a smooth gradient with soft clouds lit faintly; the beams are soft gradient wedges.
- **coast_boss:** the stepped "moon" is replaced by a tall soft rent of light with light shafts falling to the sea and torn soft cloud crossing it. The stacks' rim lines are softer.

### Weak spots after polish
- materials_v2 is not marked READY yet. The world V masonry still reads as fairly regular coursed blocks (better than the cells, but still the main stone weak spot) and will change when the shared weathering lands.
- foundry_floor: the far 6.0 MB (masonry on the long walls and the chimney breasts). The hearth hoods at the far bays are small and dark. The hammers' cam wheels are partly behind the fighters.
- foundry_roof: the bellows board reads big and plain at thumbnail size (a pear-shaped board); the imps sell it.
- coast_cliffs: the soft clouds are a little even in size. coast_boss: the glare still sits round behind the whale, though now it is a rent rather than a disc.
- pits_chapel and foundry_floor are dark-key rooms; their lightest values (about 185 of 255) sit only at the apse and the fires.
- Trees: none in IV to VI (the only tree-like shape, the cliff burn, is removed).

### materials_v2 switch-over
- `materials_v2.READY` exists, so the kit uses materials_v2 for `hewnRock`, `builtWall` and the rock skin. pits_shaft checked at 1x and 2x: the parallelogram artefact is gone.
- `materials_v2`'s rockSkin left pale hard ovals inside very large rock outlines (seen on the coast_cove cave walls). Both cases are fixed:
  - The materials agent's rockSkin call in `smoothRock` now skips outlines over 90,000 px² unless a room passes `wx` itself.
  - The cave's small rocks pass a cave preset (no lichen, little salt).
  - My own duplicate rockSkin call was removed.
- `frameDark` is now a smooth radial vignette; the old stepped ellipses also drew hard edges.
- foundry_floor: the hood fronts are lifted out of the haze, and the fire's light is laid on every live hood.
- One command rebuilds all 12 rooms and the three sheets: `sh scenes/rebuild_g2.sh` (about 4 minutes).

## Final touch-up (2026-11-25): foundry_floor
- Values lifted: the air colour is now a lighter warm smoke (`#4e3626`, was `#2a1c14`), so far hoods recede to a lit haze
  instead of going black; lighter stone, floor plates and sand; lighter veils, frame darkening and quiet band. Far mean
  luminance 34 -> 50 (95th percentile 63 -> 85).
- Fire light: lighter hood plates, a stronger two-part warm gradient up every live hood and its flue, warm side faces;
  firelight washes on the walls round each live hearth; warm light pools thrown across the floor plates.
- The yard door: a layered rainy exterior (storm sky gradient, the guild-city's roofs and smoking stacks, the casting shed
  across the yard with its door open on a working hearth and two lit windows, the yard crane's gantry, wet setts with the
  shed's warm light streaked in them and sky puddles, three rain depths, splashes, mist); the door's reveal and threshold;
  half the yard view is laid again over the quiet band so the focus survives it.
- Weak spot: at 1x the doorway is ~74 px wide; the city beyond reads only as a grey roofline.
