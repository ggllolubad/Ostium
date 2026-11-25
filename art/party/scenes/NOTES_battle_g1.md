# Battle rooms round 2, group g1 (worlds I, II, III): notes

Kit: `scenes/battle_kit_g1.js` (new; shared helpers for this group, built on `lik.js` + `battle_li.js`, neither edited).
Preview / sheet: `scenes/comp_g1.py` (imports `comp_battle.fig`; adds per-room foe positions and ruler placement).
Contract: as `nave.camera.json` (1480 x 480, far opaque via `opaque_far.py`, mid/fore transparent, PNGs at 2x, horizon 300,
eye 1.2 m, focal 652, cx 740, fighters at 6 m, feet y 430, human 190 px). Three layers per room, boss rooms included.

## Plan tables (written before building)

### World I, the Drowned Kingdom (palette: blue-black, verdigris, drowned gold; air colour: sea murk)

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `nave` (upgrade) | the cathedral nave: the north arcade, the aisle, and through a burst aisle wall the drowned close and chapels beyond | enclosed tall interior, mid scale, three planes (arcade 15 m, aisle 22 m, the close 40-90 m) | cold water light through the aisle lancets and the burst wall (focus: the breach behind centre-left) | pointed arches, varied (one wider bay, one collapsed, rings of uneven voussoirs) | mid-dark, cold grey-verdigris |
| `stair` | the sea stair: the processional stair from the cathedral's west door down through the drowned lower town to the harbour trench (thralls come up it; eel pools stand on its landings; the deep reaches up through a breach) | open exterior, vast, high above a descent | diffuse daylight from the surface far above (a pale bright "window" upper left), the trench black below | horizontals and diagonals: stair treads, terraces of drowned roofs stepping down, mooring columns | lightest key of the world, cold blue |
| `ossuary` | the charnel crypt under the cloister walk, where the tide still comes and goes; bones of the drowned stacked by the sisters | underground, tight and low | darkness with one beam: green-white light down a drain grating from the cloister above | low round barrel vaults (curves), walls of stacked long bones and skull courses, broken by slumps | darkest key, warm side (bone ochre, drowned gold reliquary) |
| `belfry` (boss: The Bell Below) | the drowned cathedral's bell tower: the abbey's bell, dropped through the first door, hangs here on its chain out of a tear in the tower's vault | vertical, vast: a round tower shaft seen from its foot, its ringing floors fallen | the most dramatic: hard cold shafts from the louvred bell openings high left, crossing the shaft; the toll rings in the silt | the tower's curved walls, broken floor beams, hanging ropes; the bell's stage an open recess at right | cold, high contrast: black shaft, pale shafts |
| `throne` (boss: The Drowned King) | the king's hall in the sunken palace: the throne apse, the cloth of estate, coral over everything | grand interior, wide hall ending in an apse | backlight: a great round window over the throne, its light falling down the dais | round apse, tall shafts, the window's ring, a stepped dais | deep blue velvet, verdigris, drowned gold on the window's holy tracery |
| `brine_grotto` (boss: Mother of Brine) | the harbour's sea cave where the fishwife-midwife delivered the kingdom's children; cradles, nets, the black birthing pool | natural cave, curved, the pool open to the right | a cold glow down a sea-chimney in the cave roof onto the black pool | organic curves: cave mouths, salt drips, kelp curtains; no built shapes but cradle boats and net poles | blue-grey, kelp black, coins in drowned gold |

### World II, the Rotmire (palette: peat brown, bile green, lantern amber; air: fen mist)

| Room | Place | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `mire_hut` (upgrade) | the stilt village's landing stage, the moot-hall's empty piles across the water | open exterior, village scale, water level | dusk overcast, the horn lanterns at the doors | thatch roofs and piles (houses turned in perspective, gable ends showing), stage boards converging | mid key, olive-brown with amber points |
| `mire_bog` | the peat cuttings out on the open moss: the hags' dead set to cut turf, a timber trackway bridge across the cutting | sunk trench (under the ground line), long one-point recession | pale foggy daylight, the bright fog at the far end of the cutting beyond the bridge | stratified horizontal peat banks converging, spade-cut steps, turf stacks, the bridge trestle | light key, grey-green and peat |
| `mire_drown` | the drowning mere where the fen folk gave their offerings: still black water in a dead alder carr | open, deep, at the water's skin; the company on a sunken hurdle trackway | night: a low cold moon in the mist, its glade on still water | gnarled dead alders (crooked, many-stemmed), their mirror reflections, the long flat waterline | darkest key, cold green-grey |
| `mire_boss` (boss: The Mire Mother) | the Mother's mere at the heart of the fen, ringed by the hags' offering posts hung with lanterns | vast open water, a ring of carved bog-oak posts with a lintel gate framing her | the most dramatic: a lurid bile-green afterglow low behind her and scores of amber lanterns round the ring | the post ring and its gate, reed crowns, offering poles | dark with the world's only warm notes massed |

### World III, the Boiling Baths (palette: pink-white marble, steam white, boiled red; gold only holy)

| Room | Place | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `baths_pool` (upgrade) | the great pool and its colonnade, the sacred spring in the apse | enclosed grand interior, the pool in perspective (copings and steps converging) | afternoon daylight down an oculus in the apse onto the spring (the light focus); steam layers in depth | Ionic columns, the apse curve, the pool's receding copings | mid key, warm pink |
| `baths_furnace` | the praefurnium: the furnace stair under the temple, the hypocaust pilae stacks, the steam rooms' floors above leaking | under-structure, tight, low ceiling | firelight from the furnace mouth at the foot of a stair behind the fighters | squat rows of pilae stacks, low segmental arches, the descending stair diagonal | dark key, hot (orange and soot, boiled red) |
| `baths_cistern` | the temple's great open reservoir, drained: its sludge bed, high walls with tide marks, the aqueduct that fed it | open exterior, vast, below the ground line (in the empty basin) | white steam-hazed noon sky, cool and flat; light focus the bright haze over the aqueduct arches | aqueduct arches against sky, buttressed walls, the sludge's curving runnels | light key, cool grey-green with scale white |
| `baths_boss` (boss: The Simmering Matron) | the inner sanctum: the matron's great pool under the temple dome, the cult exedra of the waters | grand domed interior, the exedra framing her | the most dramatic: a vertical column of light from the dome's oculus straight down into her steam | the dome's coffers and ring, the exedra's half-dome, the colonnade curving round | warm, high contrast: lit steam against dark coffers, holy gilt in the exedra |

## Files

| World | Room | Script | Kind |
|---|---|---|---|
| I | `nave` | `bg_drowned_nave.js` (upgraded in place) | regular |
| I | `stair` | `bg_drowned_stair.js` | regular |
| I | `ossuary` | `bg_drowned_ossuary.js` | regular |
| I | `belfry` | `bg_drowned_belfry.js` | boss (The Bell Below); also hosts "The Drowned Belfry" |
| I | `throne` | `bg_drowned_throne.js` | boss (The Drowned King) |
| I | `brine_grotto` | `bg_drowned_grotto.js` | boss (Mother of Brine) |
| II | `mire_hut` | `bg_mire_hut.js` (upgraded in place) | regular |
| II | `mire_bog` | `bg_mire_bog.js` | regular |
| II | `mire_drown` | `bg_mire_drown.js` | regular |
| II | `mire_boss` | `bg_mire_boss.js` | boss (The Mire Mother) |
| III | `baths_pool` | `bg_baths_pool.js` (upgraded in place) | regular |
| III | `baths_furnace` | `bg_baths_furnace.js` | regular |
| III | `baths_cistern` | `bg_baths_cistern.js` | regular |
| III | `baths_boss` | `bg_baths_boss.js` | boss (The Simmering Matron) |

Outputs: `out/scenes/battle/<roman>/<room>_{far,mid,fore}.svg/.png` (2960 x 960), `<room>.camera.json` (boss rooms add a
`boss_stage` note: x 814 to 1480 at 1x), `<room>_preview.png` and `<room>_preview_q.png` (0.5x game size, for review).
Sheets: `out/scenes/battle/I/world_I_rooms.png`, `II/world_II_rooms.png`, `III/world_III_rooms.png`.
Build: `sh scenes/build_g1.sh <room> <script> <outDir> <foe.png>[@x] ...` (x at 2x; a ruler is placed at true scale, ground
on the fighters' line). No room needed a rename in I to III (all three room-1 keys match the game). Nothing was deleted.
Shared helpers: `scenes/battle_kit_g1.js` (generic: fogger, bands, shaft, edges, arch, holedWall, ring, soffit, flags,
puddle, rubble, rockMass, hang; world kits I (kelp, barnacles, bubbles, motes, house), II (reeds, hornLantern, post,
peatBody), III (marble, column, votive, pipe: lifted unchanged from `bg_baths_pool.js`)). `lik.js`, `battle_li.js` and
`battle_kit_b.js` were not edited; no figure files were touched.

## Check after building (thumbnails on the world sheets)

All three sheets pass the one-line test at thumbnail size: each world's regular rooms are told apart at once (value key,
space and silhouette differ) and still read as one world (palette and course marks).
- **I:** nave = mid-dark grey arcade with a bright breach at centre; stair = the lightest, cyan, open water over a stepping
  town; ossuary = near-black with one green-white beam. Bosses: belfry = curved tower and crossing shafts; throne = one-point
  hall to a lit round window; brine_grotto = black cave with a white chimney of light.
- **II:** mire_hut = olive dusk village; mire_bog = pale grey-green daylight trench converging to a bridge; mire_drown =
  near-black night, moon and dead trees. Boss: bile-green afterglow and massed amber lanterns round a post gate.
- **III:** baths_pool = warm pink interior with a sun shaft to the apse; baths_furnace = dark hot underworld with the
  furnace mouth; baths_cistern = light-key open basin under a white sky. Boss: domed rotunda with a vertical light column.

## Lore per room (what was placed)

- **nave (upgrade):** uneven bays (spans 3.0 to 3.8 m, so every arch apex differs); the aisle wall burst behind the fourth
  bay, and through it the drowned close in the sea's light (chapter house with a torn void in its gable, a run of the
  cloister arcade, far town and tower, kelp): third depth plane and the light focus; a segmental strainer arch thrown
  across the nave between the fore piers (top frame), kelp from its joints; floor cracks and silt runnels converging.
  The tomb now sits silhouetted against the breach. Everything from v3 kept (void spandrel, lancets, ship, lamp, rope).
- **stair:** the top landing of the processional stair from the west door; two gothic pinnacles on the newels (the left
  bitten by a torn void, the right snapped); the drowned lower town on four terraces falling away (roofs shrink and haze),
  the parish church's broken spire (a torn void through it), the fleet's masts and the harbour towers far off; the
  surface "window" with caustics and shafts; eel holes where flags have dropped; the breach at the landing's edge for the
  Grasping Deep; fore: the west porch arch, a fallen crowned statue head, an iron lamp standard.
- **ossuary:** the cloister's charnel crypt: bays of bones stacked by the sisters (long-bone ends in courses, skull rows),
  one stack slumped onto the floor, a torn void cut clean through a bone wall, a drowned-gold reliquary casket (holy),
  the tide line and wrack on the arcade and floor, the drain grating in the vault with kelp through it and its beam;
  a bier left by the sisters; fore: a skull niche pier, the charnel's iron grille (the brute keeps the door), the near rib.
- **belfry (Bell Below):** the abbey's bell (lore change) hangs in the drowned cathedral's tower; the round tower's curved
  ashlar wraps the stage; the sockets of the fallen ringing floors with snapped joists; ringers' ropes cut at every height
  (one with its sally, one cut clean by a small void); a ladder to nowhere; a torn absence high behind the bell's
  shoulders, the way it came; hard shafts from the louvres high left; the toll's rings pressed into the silt round its lip.
- **throne (Drowned King):** the hall in one-point recession: round piers on the left (one bitten by a torn void), realm
  banners rotted to rags, the apse at the end with the great round window (plate tracery, lights broken out, the holy
  cross boss in drowned gold) backlighting the king's crown, the cloth of estate in deep blue velvet strips, a coral-
  crusted dais lit by the window's shafts; a torn void in a floor slab; fore: a coral-crusted near pier.
- **brine_grotto (Mother of Brine):** the harbour sea cave; the black birthing pool under a sea-chimney of cold light;
  the rock shelf of wet shingle and tide pools; a cradle-boat and a wicker cradle stranded, nets drying on poles; an
  offerings ledge of small shoes and a string of drowned gold coins (money); a line of swaddling across the cave mouth;
  salt drips, kelp curtains, a torn void in the cave wall.
- **mire_hut (upgrade):** each house now shows its gable end turned toward the middle (daub panels, posts, the thatch
  verge, piles under it), so the houses have depth; clouds are three kinds (stratus streaks, towering heads, torn banks);
  the landing-stage planks run away from us, joints converging. Everything else as round 1.
- **mire_bog:** the turf-cutters' cutting on the open moss: stepped peat faces with strata, spade marks, roots and bog-oak
  ends; the dead in the faces (tanned faces and hands); turfs laid to dry in rows, a sledge, a barrow, a spade in the face;
  a drainage channel with bile scum; the hurdle-railed trackway bridge on its trestle with one hags' lantern (Under the
  Bridge); the troll's churned wallow under it (mid); the pale sun in the fog at the cutting's end.
- **mire_drown:** the drowning mere in a dead alder carr: coppiced, crooked, many-stemmed alders with their reflections;
  offering posts with braided cords and weighted bundles; a holed drowning stone hanging on its rope; the hurdle trackway
  just under the water; a sunk punt and a hags' wicker cage; bile scum; the moon and its glade; fore: a great dead alder.
- **mire_boss (Mire Mother):** the ring of carved bog-oak offering posts round her mere, garlands of cords and lanterns
  between them; the two great gate posts and lintel with lanterns, cords and bundles; every lantern doubled in the water;
  the stone causeway of slabs with offerings (antlers, a pot, bound bundles, carved wooden dolls, toadstools); the bile
  afterglow; fore: an offering pole and a lantern garland with frog-bone charms.
- **baths_pool (upgrade):** the pool now narrower than the hall, with side surrounds and copings receding in perspective
  and three steps down into the water; afternoon sun down the apse's oculus onto the spring (the light focus) and its
  glade on the water; steam banks layered by depth; darker frame edges.
- **baths_furnace:** the hypocaust under the steam rooms: uneven rows of stone stacks (some slumped), segmental relieving
  arches, the cracked sooted floor-slabs above leaking steam and scalding scale drips, the parapeted stair lane down to
  the praefurnium's arch with the fire roaring and its iron door hanging; coal heap, rake, cinders; a cracked cauldron;
  fore: the near slab, a near stack catching the fire, a bearer's yoke with a steaming copper cauldron.
- **baths_cistern:** the temple's open reservoir drained: buttressed walls with the tide marks (the boiling line cooked
  red-brown, scale white below), the dry outfall with its frozen cascade of scale, the keepers' stair down the left
  wall, empty statue plinths on the right wall; the aqueduct over the far wall with three broken spans; the sludge bed
  with baked crust, runnels to the sump, sky-filled puddles, leech trails; the brute's feeding trough with bones, a fallen
  sluice gate; fore: the stair foot with a bronze sluice wheel, a dredged sludge heap with an amphora.
- **baths_boss (Simmering Matron):** the rotunda: coffered dome (rings converging), drum frieze with the rubric meander,
  the ring of Ionic columns (tide lines, peeling), the round pool with its coping and boiled-red line, the cult exedra
  behind her with its gilded wave half-dome (holy), the spring's bronze mouth and two bronze basins on tripods; the
  oculus's column of light into her steam; the floor laid in marble rings round the pool, crazed and wet.

## Rules audit

- Lightning: none anywhere. Eyes: none added in II and III; in I only skulls (not an eye motif). The figures' own eyes are theirs.
- Gold: holy or money only (ossuary reliquary, throne window boss, grotto coins (money), the Baths' conch and exedra waves).
- Red: only the Baths' boiled red (cooked tide lines, meander rubric), and the figures' own blood.
- Void (I): torn, clean-rimmed absences only (`tornVoid`), never circles or glows; every World I room has one or more.
- No new layers in boss rooms; all far layers opaque; mid/fore transparent; camera unchanged.

## Weak spots (honest)

- **Generic.** Value grading in the new rooms is done with stepped murk veils cut back round the light (as in the hub
  rooms), so the unlit PNGs carry the darkness; the game's lit pass does not drop them (they are not tagged `glow`), only
  the shafts and painted glows are tagged `glow`. Check the lit look in-engine.
- **Boss renders' own grounds.** The Mire Mother's render carries a hard-edged rectangle of black water at its foot, and
  the Matron's carries her pool's front wall: both sit on the room fine at true scale, but the Mother's black box edge
  reads as a box against the causeway (a figure issue, not fixable in the room).
- **stair:** the lower town reads partly as a street seen level rather than terraces falling away (the camera hides
  everything below the landing's edge); the fleet's masts are too faint; the fallen statue head reads as a spiky rock.
- **ossuary:** the vault reads more like a wall than a barrel vault; the far passage glimmer at the right is lost in the
  dark; the floor flags are a little regular.
- **nave:** the strainer arch is heavy at the top; the breach's far buildings are small at game size.
- **belfry:** the torn absence is mostly hidden by the bell (it shows as a dark lobe left of the crown); the shaft-struck
  patches on the wall read a little like smoke.
- **throne:** the king and his throne slab hide most of the apse; the window shows only as a ring behind his crown; the
  coral tips read a little like bone sticks.
- **brine_grotto:** salt drips still read slightly like teeth along the overhang; the swaddling line is small; the mid
  rock rib under the chimney is a flat grey shape.
- **mire_hut:** clouds still lobed (less repetitive); the gable ends are plain.
- **mire_bog:** the bog bodies in the faces are small at game size; the bile scum in the channel reads as a row of lily
  pads; the bank tops are thin lines of sedge.
- **mire_drown:** the mid alders stand as an even belt; reflections are faint; the moon glade is modest.
- **mire_boss:** the causeway slabs read as a chequer of stepping stones; garlands are thin.
- **baths_pool:** still the most even of the three Baths rooms in value; the pink remains, though the shaft now leads.
- **baths_furnace:** the ceiling slabs and stack rows are regular in plan (deliberate, but close to a grid); fire tongues
  in the furnace mouth are simple.
- **baths_cistern:** the far wall and side walls share one ashlar texture; the sludge crust polygons read as a net.
- **baths_boss:** the near-left columns are large and compete a little with the heroes; the exedra is mostly behind her.
- **Mid layers** stay sparse and dark (quiet zone), so most low lore props there read only up close.

## Polish round (Cole's review, 2026-11-24): what changed, before and after

**Kit additions (`battle_kit_g1.js`):**
- `sky`: smooth gradient skies (allowed for skies, fog and glows only).
- `softSteam` and `softBank`: soft gradient lobes with wisps. They take the same arguments as `battle_li`'s `steam` and `bank`, and every g1 room now calls the soft versions.
- `softCloud` and `stars`.
- `limb`, `otree` and `reflect`: organic tapered trees, smooth curves, roots that flare into the ground.
- `solid` and `box`: convex solids, culled and shaded by the key light. The lower town's houses are built from them.
- `barrel`: the scale-cue prop.

**Cole's notes:**
- **I `stair`.**
  - Before: flat wall cut-outs with roofs floating free.
  - After: about 40 solid houses on four terraces. Each roof sits on its walls, gable to the street or eaves to the street. Each house is its own:
    - storeys 1 to 3, some with jettied upper storeys;
    - limewash, stone, tarred boards or timber frame;
    - arched or boarded doors, windows with shutters (one hanging);
    - shop signs on brackets (fish, boot, cup, anchor, shears);
    - chimneys, some capped and some broken; slipped slates with the rafters showing; salt on the ridges; weed and barnacles.
  - Around the houses:
    - drowned laundry lines between upper windows, the washing streaming upward in the water;
    - stairs between the terraces;
    - one boat lodged on a roof, one capsized in the street;
    - the parish church now has a nave and roof under its broken spire.
  - Near houses are darker and far ones lift into the water's light, so the descent reads.
- **II `mire_bog`.**
  - Before: a trench between peat walls.
  - After: an open bog to a low horizon:
    - eroded peat hags with overhanging sward, a tanned face and hand in two of them;
    - black pools holding the sky (bile scum, a body under one);
    - turf clamps;
    - the trackway winding out on its posts, with a small bridge over a channel and the troll's wallow beside it;
    - hummocks, cotton-grass, sedge, distant stunted birches and marker posts;
    - a gradient sky, soft clouds and a hazy sun.
- **III `baths_boss`.**
  - Before: her tub stood inside a second round pool.
  - After: the second pool is removed. Her tub stands on the floor at the foot of a stepped round dais (three scale-crusted steps up to the exedra). Three drain channels run from the tub's foot to bronze-grated drains, the scalding overflow runs in wet tongues across the floor with steam, and the floor's marble rings are centred on her tub. The light column now falls onto her.
- **Trees.**
  - `mire_drown`: every alder is now organic `otree`, unevenly spread (clusters, gaps, saplings, one fallen in the water) with broken reflections.
  - The far treeline is a smoothed silhouette (it read as a mountain range).
  - `mire_bog`'s distant birches use the same helper.

**Director list:**
- **ossuary:** curved groin ribs spring from each pier and sweep up over the room, so it reads as a vault.
- **nave:** the heavy dark band over the strainer arch is removed; the ring and soffit are thinner.
- **brine_grotto:** salt drips are fewer, thinner and irregular, some with a drop at the tip (they read as teeth before).
- **mire_boss:**
  - the causeway is now about 70 stones of their own size, laid at random, some tilted (it was a chequer);
  - the afterglow is a smooth gradient;
  - the clouds are soft masses lit from below.
- **mire_drown:** organic trees, an even belt broken up, a gradient night sky with stars, a smooth moon halo and soft clouds.
- **mire_hut:** a gradient dusk sky and soft clouds.
- **baths_furnace:** the stone stacks are jittered in depth and position with more gaps; the ceiling slabs vary in size, with a few missing.
- **baths_cistern:** each wall has its own stone:
  - the left wall is small rough rubble;
  - the right wall is large ashlar with a low revetment of pink marble;
  - the far wall is unchanged.
  The crack net now appears only in patches by the walls.
- **baths_boss:** the near-left columns are removed (they competed with the heroes).
- **Boss feature placement:**
  - belfry: the void tear moved beside the bell's left shoulder, above the heroes' heads, where it stays visible;
  - throne: the apse and its round window moved left of the king, above the knight's head.
- **Scale cues:** a cask near the fighters in stair, throne, brine_grotto, mire_boss, baths_furnace (quench barrel), baths_cistern and baths_boss (attendants' tub). The other rooms already had one: nave pews, ossuary bier, belfry ladder, mire_hut creel and punt, mire_bog turf barrow, mire_drown punt, baths_pool amphora and clogs.
- **stair:** the fallen statue head's crown points are shorter and rounded; the surface "window" is a smooth glow.

**Materials v2:** `scenes/materials_v2.js` exists but `materials_v2.READY` does not, so nothing was swapped yet. Calls to swap when it is ready:
- **Built stone** (every g1 room) goes through `MV.begin(at, Ls, Lt, world)`, `W.stone(...)` and `W.end()`:
  - `S.ashlar` calls: direct ones, and inside `G.holedWall`;
  - `T.marble` (III).
- **Floors:** `G.flags` cels go through `W.stone` on the floor plane, plus `MV.weatherFloor`.
- **Loose stone:** `G.rockMass`, `G.rubble` cels and the `G.solid` house faces (stair) go through `MV.rockSkin` or `MV.stoneMarks`.
- **Natural rock:** cave walls in `brine_grotto` go through `MV.hewnRock` or `MV.rockSkin`.
- **Trees, kelp, roots:**
  - `G.otree` becomes `MV.tree` with `kind: 'alder'`, `'birch'` or `'dead'` (mire_drown, mire_bog);
  - `I.kelp` becomes `MV.kelp` or `MV.strand` (all World I rooms);
  - peat-face roots become `MV.hangRoots` (mire_bog).
- **Presets:** `drowned` for I, `mire` for II, `baths` for III.

**Weak spots after polish:**
- **stair:** the houses' wall faces are still plain until the stone weathering lands. The laundry lines and boats are small at game size.
- **mire_bog:** the hags' faces are simple, and the near bog floor is mostly texture with few objects.
- **mire_drown:** the alders are slender and bare rather than gnarled. Materials v2's `alder` kind should help.
- **ossuary:** still mostly one dark-mid value away from the beam.
- **baths_pool:** the soft steam is now a heavy white haze across the colonnade.
- **throne:** the window is cut by the frame top.
- **Boss renders' own grounds:** the Mire Mother's black-water box is unchanged (a figure issue).

## Polish round, second pass (coordinator's review)

- **mire_bog: built up.**
  - Peat hags now stand at real height (0.9 to 1.9 m), with overhanging turf lips and hanging roots, at many depths:
    - a big hag left of centre sits behind the heroes' back line;
    - a half-dug bank shows its spade-cut face with a tanned face and hand;
    - a far hag sits at Z 52.
  - Ten black pools of very different sizes reflect the sky.
  - Turf clamps stand in rows along the track.
  - A peat-cutter's abandoned sledge with turves and its spade lies near the fighters, beside the turf barrow.
  - Bog-cotton grows in dense patches in the hollows.
  - Six stunted birches stand in the middle distance, curved and rooted.
  - Mist lies in the hollows at several depths.
- **Clouds (kit `softCloud`):**
  - Before: horizontal smears with hard ends.
  - After: masses with form: a dark flat underside, round lobes domed toward the middle, and light caps toward the key light.
  - Used in mire_bog, mire_hut, mire_drown and mire_boss.
- **Trees (kit `otree`):**
  - Before: straight segments.
  - After: limbs curve with an accumulating bend plus a slow sine wobble, controlled by `o.gnarl`. Branches leave at different heights and taper.
  - mire_drown uses gnarl 1.6. The far treeline is smoothed.
  - When `materials_v2.READY` appears, these switch to `MV.tree({ kind: 'alder' })`; still pending.

## Materials v2 swap (2026-11-24)

**Swapped in:**
- **Stone, automatic.** The materials agent hooked `lik.js` ashlar/masonry and this kit's `flags`, `ring`, `rubble` and `rockMass`. World presets come from the script names: drowned, mire, baths.
- **Stone, added by me:**
  - `G.solid` takes `{ stone: true }` and puts `MV.stoneMarks` on every non-roof face. The stair's house walls use it.
  - `T.marble` (World III) puts `MV.stoneMarks` on every slab.
- **Trees.** `G.otree` now draws through `MV.tree`. The default kind is `alder`; `o.mv` passes skeleton overrides. The old grower is kept as `otreeOld`.
  - mire_drown:
    - the alders are gnarled `alder` with overrides: non-excurrent, gnarl 1.5, 1 to 3 stems;
    - the far treeline is `dead`;
    - the fore tree is a `dead` tree at the left edge.
  - mire_bog: the birches are `birch`.
- **Kelp.** `I.kelp` draws through `MV.strand`. This covers all World I rooms.
- **Peat roots.** The mire_bog hag lips use `MV.hangRoots`.

**Tools:**
- **`scenes/rebuild_g1.sh`**: rebuilds every g1 room (layers, opaque far, previews, half-size copies), then the three world sheets.
  - Run `sh scenes/rebuild_g1.sh` for all 14 rooms, or `sh scenes/rebuild_g1.sh stair mire_bog` for named rooms.
  - It prints `FAILED: <rooms>` and exits non-zero on a failure. Each room's log is in `/tmp/rebuild_g1_<room>.log`.
- **`scenes/build_g1.sh`**: now renders each layer on its own and retries up to 3 times. Chromium had timed out under shared load.

**Sizes:** the largest g1 far SVGs are now stair 6.1 MB, ossuary 5.4 MB and cistern 4.2 MB.

## Final touch-ups (2026-11-25)
- throne: the rose window lowered (centre 10.2 m -> 7.6 m) and reduced (3.3 m -> 2.55 m) so it reads whole under the
  vault; the far transverse rib that crossed it removed; the cloth of estate's rail lowered to 4.7 m so it hangs below it.
- baths_pool: steam thinned: two thin layers under the vault (was five heavy banks), three narrower columns (was four at
  double opacity), fainter wisps off the pool and low banks; the colonnade, frieze and apse now read.
