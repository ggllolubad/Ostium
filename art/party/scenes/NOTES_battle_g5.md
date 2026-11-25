# Battle rooms round 2, worlds XIII, XIV, XV (group g5): notes

Plan tables were written before building, then checked after (see "Check after" under each world).

## World XIII, the Black Pyre: plan

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `pyre_nave` (upgrade) | The cathedral nave down which the penitents walk to the pyre; the choir burning black at its far end | Enclosed interior, tall and long: the camera looks DOWN the nave, arcades on both sides receding to the crossing | Cold grey daylight slanting through the left clerestory in shafts onto the right wall and the floor; the far crossing dark with black fire | Verticals in a receding rhythm: piers, lancets, vault ribs converging | Cold mid-grey, mid key; dark left wall, lit right wall |
| `pyre_stake` (new) | The burning ground outside the cathedral, where the condemned were burned in rows; the cathedral on the horizon; the place where the seraph fell | Open exterior, vast and flat, low horizon | Dusk: a low sallow sun behind ash haze on the horizon, black-fire smoke columns crossing it | Horizontals (ash plain, smoke banks, horizon) cut by irregular rows of thin stakes | Warm bone/ash side, light key (pale sky), dark ground |
| `pyre_crypt` (new) | The undercroft beneath the choir: the ossuary crypt where the candles are kept burning and the inquisition's tribunal sat | Underground, low and tight: squat round piers, groin vaults just over head height | Darkness with one source: a shaft of grey daylight down through a floor grating above onto the tribunal desk | Curves: round arches, barrel and groin vaults, skull niches, rounded squat columns | Cold dark key, near black with one pale pool |
| `pyre_boss` (new) | The crossing and apse where the Saint was burned and still burns: her pyre under the burned-out crossing tower, the apse behind her | Interior, the grandest scale in the world: a 30 m apse and the open crossing tower | The most dramatic light in the world: the apse's tall lancets blaze with white ash-light behind her, silhouetting her pyre; the crossing tower open to a pale sky above | A great semicircle of tall lancets (radiating verticals) framing the right 45%, the tower's shaft above | Highest contrast: white-ash glare against black |

## World XIV, the Blighted Garden: plan

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `garden_hedge` (upgrade, renamed from `garden_walk`) | The yew maze by the formal walk, a knight at the turning, the gardener's shed at a clearing in the maze | Exterior but enclosed by 3.5 m hedge walls: a corridor receding to a lit turning | Flat overcast noon, lilac-white sky; the bright turning at the end of the corridor is the focus | Rectilinear clipped walls gone shaggy, topiary, the shed's gable; horizontals of the hedge tops in perspective | Cold-green black hedges under a pale lilac sky; mid key |
| `garden_grove` (new) | The wild garden past the walls: the deer glade among giant caps and dead oaks, the dryad's dead oak in the middle | Open, vast woodland glade; tall trunks, high canopy of caps | Late afternoon: low pale-yellow sun through spore haze from the upper left, beams through gaps in the caps | Organic curves: gnarled trunks, domed caps, drooping gills, bracken | Warm side: pale yellow and pink, light key in the distance |
| `garden_heart` (new) | Under the garden: the old house's root cellar broken open by the roots of the heart; roots with mouths | Underground, tight: a brick-vaulted cellar collapsed into a cave of roots | Darkness with cold foxfire: pale lilac-white caps on the central root knot give a dim cold light | Tangled curving roots, hanging root curtains, the broken barrel vault | Cold dark key, lilac-grey glow on black |
| `garden_boss` (new) | The heart of the garden: the white hind's glade, a cathedral of colossal trees whose roots converge on her | Exterior, grandest scale: two colossal trunks arching into a gate of roots over the right 45% | Sunset behind her: a low pale-yellow and pink glare through the root arch, backlighting the antlers | A giant pointed root arch, radiating roots on the ground, verticals of the colossal trunks | Pink-yellow glare against black loam; highest contrast in the world |

## World XV, the Torn Sky: plan

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `sky_ruins` (upgrade, renamed from `sky_throne`) | The processional stair of heaven, broken into floating flights; the host's guardians fallen at their posts (kneeling statues and dead sentinels, no battlefield) | Open, high: floating stair segments climbing into the storm | Storm light: violet-grey cloud with a rent of pale light high at upper left; wet sheen | Diagonals of the stair flights, floating slabs, kneeling winged guardians | Violet-grey mid key, cold |
| `sky_gate` (new) | The gate of heaven at heaven's rim, its leaves torn; beyond it the great tear in the sky through which the hounds and the leviathan come | Vast open threshold over the drop; the gate's posts frame an enormous absence | Cold high sunlight above the clouds, silver-white, from the upper left; the tear the dark focus | One huge irregular void shape, the gate's verticals, a flat cloud sea below | Light, cold silver-blue key |
| `sky_choir` (new) | The choir of heaven where the eyes sing: stalls, a fused organ, the hymnal lectern; the vault split, a seraph's post under the split | Enclosed interior: a choir hall with gilt stalls receding | Warm: pale gold light falling from a high lantern above the choir; dark aisles | Verticals: organ pipes and stall canopies; the lantern's dome curve | Warm gold-on-black, mid-dark key |
| `sky_boss` (new) | The seat of the Mother of Courses: the throne apse at the summit of heaven, its mandorla of gold, torn open behind where the betrayal came through | Interior-exterior: a vast apse open to the storm | The most dramatic: a column of white-violet light falling through the shattered dome onto the empty mandorla behind her | A colossal almond mandorla and its rays, framing the right 45%; the apse's ribs | Gold and white against black void; highest contrast |

## Files (all new in this round unless noted)

| What | Where |
|---|---|
| Group kit (new shared helpers) | `scenes/battle_kit_g5.js` (requires `lik.js`, `battle_kit_b.js`; neither edited) |
| Build | `sh scenes/build_battle_g5.sh <W> <room> <scene.js> <foe1,foe2,foe3 \| companion,@boss>` (scene, 3 layers at 2x, `opaque_far.py`, preview) |
| Preview and sheets | `scenes/battle_preview_g5.py` (boss slot `@key` at x 2330 at 2x, companion at 1700; `sheet` = 2 x 2 grid plus a thumbnail strip) |
| XIII rooms | `bg_pyre_nave.js` (rewritten in place: same key), `bg_pyre_stake.js`, `bg_pyre_crypt.js`, `bg_pyre_boss.js` |
| XIV rooms | `bg_garden_hedge.js` (renamed from `garden_walk`; `bg_garden_walk.js` and `out/.../XIV/garden_walk_*` left in place), `bg_garden_grove.js`, `bg_garden_heart.js`, `bg_garden_boss.js` |
| XV rooms | `bg_sky_ruins.js` (renamed from `sky_throne`; `bg_sky_throne.js` and `out/.../XV/sky_throne_*` left in place), `bg_sky_gate.js`, `bg_sky_choir.js`, `bg_sky_boss.js` |
| Outputs | `out/scenes/battle/<W>/<room>_{far,mid,fore}.svg/png`, `<room>.camera.json`, `<room>_preview.png`; sheets `out/scenes/battle/<W>/world_<W>_rooms.png` |
| Figure renders added for previews | `out/scenes/battle/figs/XIII_{cinder_hound,candle_wraith,unburnt_inquisitor,pyre_seraph,saint_unending}.png`, `XIV_{root_horror,spore_deer,blight_dryad,the_gardener,antlered_mother}.png`, `XV_{rift_hound,choir_of_eyes,rift_leviathan,thunder_seraph,shattered_god}.png` (figs.js ... right, at 0.594; bosses from the same world modules as `out/worlds/`) |

Kit (`battle_kit_g5.js`): `blackFlame` (broad licking tongues with S-curves, a curled hook at the tip, detached licks, violet rim on the edges only, no glow), `cloud` (envelope of overlapping masses of different sizes, ledges, dark underside), `smoke` (a continuous plume that rises, slows and drifts downwind), `shaft` (light as 3-4 nested translucent steps), `tree` (kinked trunk with a modest flare, tapering limbs of uneven count/angle, broken stubs), `bigCap` (leaning fibrous stem, torn veil, tall asymmetric dome, torn drooping margin, gills seen from below), `gilt` (round-1 gilt with the shadow band capped to the plate's thickness, and small angular lost flakes instead of blobs), `pointed`, `write`.

Contract (checked for all 12): 1480 x 480 viewBox; far PNG RGB fully opaque (opaque_far.py also adds the SVG backstop), mid and fore RGBA transparent; 2960 x 960 PNGs; each `<room>.camera.json` is the nave camera (horizon 300, eye 1.2, focal 652, cx 740, fighters at 6 m, feet 430, human 190 px).

Previews: 4 heroes plus 3 of the room's own encounter foes; boss rooms: the boss at true scale (figure scale 0.594 at 2x, ground line canvas h - 30) plus the companion from its boss encounter.

| Room | Preview foes |
|---|---|
| pyre_nave | ash_penitent, censer_deacon, pyre_knight |
| pyre_stake | cinder_hound, ash_penitent, pyre_seraph |
| pyre_crypt | candle_wraith, pyre_knight, unburnt_inquisitor |
| pyre_boss | censer_deacon + saint_unending |
| garden_hedge | thorn_knight, fungal_husk, the_gardener |
| garden_grove | spore_deer, root_horror, blight_dryad |
| garden_heart | root_horror, fungal_husk, thorn_knight |
| garden_boss | thorn_knight + antlered_mother |
| sky_ruins | fallen_angel, storm_shade, skywreck_knight |
| sky_gate | rift_hound, choir_of_eyes, rift_leviathan |
| sky_choir | choir_of_eyes, fallen_angel, thunder_seraph |
| sky_boss | skywreck_knight + shattered_god |

## Check after (against the plan tables)

- **XIII:** holds. Nave = tall receding interior, verticals, cold shafts from the left clerestory, mid-grey. Stake = flat open plain, horizon and thin stakes, sallow dusk sun, light key. Crypt = low round vaults, one grey shaft through a grating, near black. Boss = blazing apse lancets behind the Saint, the axial lancet unmade by the void so her gold halo stands on black, a shaft from the crossing tower. Thumbnails separate instantly. Deviation from plan: the nave's light falls on the floor in patches more than on the right wall.
- **XIV:** holds. Hedge = hedge corridor to a lit turning, rectilinear, lilac noon, mid key. Grove = open glade of caps and dead oaks, warm low sun with beams, light key. Heart = root cave, foxfire, dark key. Boss = colossal trunks leaning into a gate, sunset glare behind the antlers.
- **XV:** holds. Ruins = stair climbing into the storm, violet mid key. Gate = light cold silver threshold, the huge tear framed by the gate posts. Choir = warm gold interior receding to the organ. Boss = black void behind her broken gold, the mandorla's band, a light column. The choir and the boss are the two gold-heavy rooms; the choir reads by its receding stalls and organ, the boss by the mandorla and void.

## Lore per room

- **pyre_nave.** Looking down the nave to the crossing: penitents' blood drops run in a wavering trail down the middle; ash drifted against every pier; the choir at the far end burns black against the pale apse lancets (the Saint's fire, seen from afar); chapels in the aisles burn black against lit aisle walls; heat-split seams with violet lips; a void absence through a vault cell (eye in it), a pier and the crossing spandrel (eye); a dropped scourge and a dead censer (mid); the inquisition's banner with the black flame stitched on it, a hanging censer trailing black smoke, the near pier with a violet seam (fore). No gold.
- **pyre_stake.** The burning ground: irregular rows of charred stakes (iron neck collars, chains hanging open, remains on some, rubric placards on some, faggots, a few still burning black), the hounds' ashprints wandering between them, cart ruts to the cathedral on the horizon (its north tower's top unmade by the void, the crossing tower pouring the Saint's black smoke); the seraph's fall: a furrow ploughed through the stakes, snapped stakes along it, a crater, its burned wing lying half buried with violet-edged pinions, its halo ring burned black. Fore: a near stake with a rubric placard and chain; a toppled bundle burning black. No gold.
- **pyre_crypt.** The undercroft: round piers with cushion capitals, groin vaults; the grating; burial niches with skulls and candle stubs; ossuary stacks of long bones and skulls; the tribunal in the light: dais, three high seats, the desk, the book of judgements open, the roll of names spilling to the floor (rubric), sentence boards in rubric, black candles; candle-trees in the aisles (the knight's charge); a pier's drum unmade by the void with an eye in it; wax heaps, a fallen skull, an iron candle-ring (mid); the near arch and piers with black candles on a capital (fore).
- **pyre_boss.** The Saint's sanctuary: the apse's seven lancets (two-light tracery, burned out to the leads, white glare), the axial one unmade; the dark choir arcade receding on the left, the ambulatory's dim lancets; the clustered crossing pier with a void absence and an eye turned toward her; the sanctuary steps with banks of votive candles burning black; the sanctuary floor's inlay circle and scorch rings round her pyre; the fallen corona of the crossing; ash heaps where the crowd stood, a charred rosary (mid); the charred rood beam with its cross gone, the chancel jamb, a hearse of black candles (fore). The only gold is her own halo.
- **garden_hedge.** A maze corridor: shaggy yew walls (left in shade, right lit), dead stretches furred grey-lilac with brackets, eyes of different sizes in the foliage, roses gone over climbing them, void-clipped absences through the hedge (eyes in them); a clipped hedge archway over a hidden iron frame; a topiary peacock on the far corner; the turning lit; the clearing with the head gardener's potting shed (door open, rake and hoe, straw hat, pots, mossed roof with caps), a dead apple tree; stepping flags converging; box edging dead; clippings and dropped shears, a fairy ring (mid); the hedge's near end with a lead plant label, a yew ball on its stem with an eye (fore).
- **garden_grove.** The deer glade: the dead oak in the middle (void absence in its heartwood, eye in it, brackets, mould, pustules, blooms hanging from its crown), gnarled dead oaks and giant caps round the glade (gills seen from below), three steps of wood fading into the haze; the deer path with hoof prints; spore drifts; a shed antler grown with coral fungus, a fairy ring (mid); the underside of a giant cap overhead with its stem at the left edge and eyes in its gills; bracken and puffballs smoking spore (fore).
- **garden_heart.** The root cellar: the old stone barrel-vaulted tunnel going on into the dark, roots through its crown; the loam cave with foundation stones; the heart's knot at the tunnel mouth (a mouth of thorn teeth, three eyes, foxfire caps, pustules); roots running across the floor toward us; a burst cask and a fallen shelf of jars; puddles holding the foxfire; the earth overhead with rootlets; a root clutching a skull (mid); a root curtain with a mouth and an eye, a root as thick as a man arching in (fore).
- **garden_boss.** The hind's glade: two colossal trunks (furrowed bark, burls, moss, brackets, eyes) leaning into a gate whose branches meet over her in a pointed arch hung with blooms; the low sun behind her antlers; the far ring of trees in the pink haze; roots running from where she stands toward us with eyes in them; petal drifts; the dark vault of branches over the heroes with moss and roses hanging; a colossus behind them; a shed antler tine with coral fungus, a dead hare under blooms (mid); a buttress root with brackets and an eye, hanging canes with roses (fore).
- **sky_ruins.** The processional stair: flights hanging apart in the storm with gaps between them, black steps with gilt nosings; kneeling guardian statues of the host on plinths along both balustrades, wings folded, spears upright (one has fallen across the steps, one is cracked open onto black, one has lost its spear), and one of the host itself dead at its post, slumped against a plinth with its spear and cracked halo; the summit's silhouette and almond glory far up; floating column drums and a lone stair flight; the rent of pale light; sky tears with an eye; the landing slab with gilt inlay, a violet burn and a fused strike point; one dropped spear and a cracked halo (mid); a balustrade post with a dimmed gilt coping (no loud gold column) and the folded wing of a near guardian (fore). No battlefield.
- **sky_gate.** Heaven's rim: the cloud sea below, a high cold sun; the gate's two posts (gilt over black, carved niches with wings, sheared tops, violet burns), the arch's springer, one leaf hanging from a fused hinge, one fallen flat; heaven's wall running off in broken runs with the clouds through its breaches; the tear filling the gate (clean-rimmed, slivers and flecks drawn into it, fragments of gate and wall drifting in, four eyes); the threshold with gilt bands and a burn; the hounds' prints as small clean holes in the paving (mid); a wall pier and a drifting arch fragment (fore).
- **sky_choir.** Two ranks of stalls (gilt backs, seats, ogee hoods with finials, some broken and fused, eyes opened in a few carved roundels), the organ with fused pipe mouths and a burn, the vault's gilt ribs, the tear through the vault over the seraph's post (eyes in it); the eagle lectern with the hymnal open (rubric initial) under the lantern's column of light; black marble with gilt lines converging; fallen hymnals (mid); the near stall end with a kneeling-angel finial, a near colonnette (fore).
- **sky_boss.** Heaven's summit: the shattered dome's ribs and floating shell fragments; the column of white-violet light; her mandorla's gilt band framing the stage, its heart torn into a clean-rimmed void behind her; the colonnade on the left (some columns broken, a fallen drum, burns); the dais; six dry gilt-lined courses radiating toward us; gold leaf fallen in drifts (mid); a near column with a fused strike and a hanging dome rib (fore). No war.

## Rules audit

| Rule | Status |
|---|---|
| No lightning drawn in the air | None. Burns are clipped to surfaces or lie on them; light shafts are pale stepped light, not bolts. |
| Eyes only in void worlds | All three are void worlds; eyes used in every room. |
| Void = irregular clean-rimmed absence | `tornVoid` everywhere; no circle clusters, no glow. Hedge voids reduced to fewer teeth so they no longer read as splats. |
| Gold only on holy things | XIII: none drawn (the Saint's halo, on her figure, is the only gold). XIV: none. XV: heaven's gilt over black, modelled lighter toward the light. |
| Red only for blood, doom, rubric | XIII: penitents' blood, rubric placards, sentence boards, the roll of names. XV: the hymnal's rubric initial. XIV: none. |
| No flat fills / no regular brick tiling | Mottle, hatch and cel on every plane; walls are rough ashlar; the gate's wall is coursed rubble with a gilt string. |
| True scale | Everything placed in metres on the shared camera (stakes 3-4 m, hedge 3.6 m, stair rise 0.3 m, crypt vault 4-5 m, gate posts 11.5-15 m). |
| XV: no war of gods | No armies, no strewn weapons, no banners, no siege; guardians fallen at their posts, one spear dropped. |

## Weak spots (honest list)

- **pyre_nave.** The left near aisle wall is a large plain grey area at the top left; the clerestory light shafts overlap into one broad beam rather than a row of distinct beams; the far choir's black flames are small and partly washed by the beam.
- **pyre_stake.** The cloud masses are better than round 1 but still read as a row of flat-bottomed humps; the stake tops (split points) give the near rows a slight palisade look; the seraph's burned wing in the crater is small at 1x; the black-burning faggot heaps along the hero line read as dark lumps with violet rims more than as fire.
- **pyre_crypt.** The vault cells are large flat facets (a slight low-poly look); the round arches, though now varied (sag, dropped voussoir), are still a regular grid; the floor flags read even. The pool of light is the focus but modest.
- **pyre_boss.** The middle of the frame (crossing pier, shaft, choir) is muddled in value; the left arcade's openings are so tall that the arcade wall itself barely shows; the void behind her head reads as a large black kite. The Saint figure's own black flames dominate her pyre; the room's sanctuary circle is hidden behind her.
- **garden_hedge.** The shed is small and only its upper half clears the heroes; the hedge archway is a flat face parallel to the picture plane; the far dead trees are faint and still thin.
- **garden_grove.** The giant caps all sit at similar heights in a row; their stems read a little like columns; the dead oak's crown is mostly out of frame, so it reads as a big grey trunk with straight limbs; the fore cap overhead reads like a slab roof.
- **garden_heart.** Dark overall; the foxfire focus is modest; the back loam wall is a large flat dark area; the old cellar tunnel is barely visible.
- **garden_boss.** Many roses with dark hearts read as eyes (allowed, but busy); the branch vault on the left is still a set of long straight sticks; her own render's framing trees overlap my right gate trunk.
- **sky_ruins.** The gaps between flights do not open onto cloud clearly (the next flight's underside shows); the guardian statues repeat a similar silhouette up both balustrades; the rent of light reads as a soft lilac blot.
- **sky_gate.** The gate posts are still loud flat gilt slabs; the wall is plain coursed stone; the fallen gate leaf on the threshold is hard to read.
- **sky_choir.** The stall canopies are a regular rhythm (as a choir is), but read as repeated spikes at 1x; the tear over the seraph's post is mostly hidden behind the Thunder Seraph in the preview.
- **sky_boss.** Gold-on-gold where her lap meets the dais; the light column is a grey band over the black; the colonnade columns read as flat planks; the six courses are faint at 1x.
- **All.** No second director pass; 2 to 6 look-and-fix loops per room. The far SVGs are 0.4 to 5.9 MB (the nave's is the largest). Kit changes made while working (flame, tree, cap, cloud, gilt band) were followed by rebuilding every room that uses them, so the outputs match the scripts.

## Polish round (Cole's review, BATTLE_POLISH_BRIEF.md): XIII and XIV only (XV is with a dedicated agent; no sky_* file touched)

| Room | Before | After |
|---|---|---|
| garden_hedge (Cole) | Hedge walls were flat vertical faces, one pixel thick, not maze walls | Rebuilt as a sunken maze seen from a terrace 3 m above it. Every wall is a solid 2.1 m tall and 1 m thick, with a lit clipped top plane, a front face, and a lit or shadowed side (crosshatched). Each face has clipped-leaf texture laid in its own plane, plus shaggy sprigs along the clipped edges, gaps, dead stretches (black, mould-furred, iron frame showing), roses and eyes. The walls recede in perspective in rows and returns. One void absence (with an eye) cuts through a wall. A tall yew outer wall with topiary closes the back. The archway (now with thickness and a top) and the gardener's shed stand inside the maze, and a dead heart-oak rises from its middle. The company stands on the terrace: gravel with trodden ruts, petals and a weathered stone kerb, with stair newels (stone balls) at the head of the steps down. The soft gradient sky and soft clouds replace the stepped bands and stripes. Scale cues: the kerb, the newels and the tipped wheelbarrow. |
| garden_grove | The caps stood as a row of columns; Y-ish trees; stepped sky; flat stepped beams | The caps vary in size, lean and spacing: a giant one far right, small clusters, one fallen across the glade with its gills up. Trees use the new organic tree (see kit). Gradient sky, a soft sun glow and soft clouds. The beams fade toward their foot. Scale cue: an overgrown stone garden bench. |
| garden_heart | One mid value | A dark gradient vignette makes the darkest darks at the edges, and a brighter soft foxfire glow with whiter caps gives the lightest light at the knot. The fighter-band floor now has stones and puddles catching the foxfire. |
| garden_boss | Rose centres read as eyes; the branch vault was straight sticks; stepped sun rings | Rose hearts are petal swirls, and the petal layers are offset rather than concentric. Fewer eyes in the bark and less moss. The branch vault is smooth tapering limbs that fork and thin. Gradient sky, a soft sun glow, a fading shaft and soft clouds. Scale cue: the hind's offering stone, a bowl on a knee-high pillar. |
| pyre_stake | Humped clouds; the stakes read as a palisade; hard smoke | Soft cloud masses with wisps. The rows are broken (gaps, doubled stakes, heavy leans, short and tall stakes, burnt rounded tops instead of points). Soft smoke plumes, a gradient sky and a soft sun. The fighter-band floor has ash ridges with lit crests, crust cracks converging, and charred sticks and bone. Scale cue: the tumbril (cart) tipped on its tail. |
| pyre_boss | Muddled centre; a black kite behind the halo | The void is narrowed to the axial lancet, a smaller torn absence, so her halo sits on black without a kite shape. The crossing is darkened with a soft gradient so the apse is the one focus. The shaft is a soft fading beam. The flat ambulatory wall is now rough ashlar with the burned choir screen silhouetted against it. A charred pew is knocked over. |
| pyre_nave, pyre_crypt | (no item on the director's list) | Scale cues added: a penitents' bench in the nave and the stair door in the crypt. Both are mostly hidden behind the fighters, so they read only partly. |

Kit changes (`battle_kit_g5.js`):
- `tree` is rewritten as organic tubes. The trunk is one smooth tapering tube with root tubes that flare into the ground. Limbs curve and thin as tubes, with a shade band and hatch on the side away from the key light and a lit edge. There are no polyline kinks.
- New atmosphere helpers: `tube`, `gradSky` (a smooth gradient for skies only), `glow`, `shaftG`, `softCloud`, `softSmoke` and `radGrad`.
- Roses now have petal-swirl hearts.

All changed XIII and XIV rooms were rebuilt, re-previewed and re-sheeted.

### materials_v2 swap list
`scenes/materials_v2.READY` did not exist when this round finished. `materials_v2.js` is on disk but not announced.

When it is ready:
- **Stone:**
  - Wrap the `S.ashlar` planes with `MV.begin(at, Ls, Lt, 'pyre')` / `W.end()`, or add `MV.weatherWall(at, Ls, Lt, 'pyre' | 'garden')`:
    - `bg_pyre_nave.js`: 3 calls (crossing wall, aisle walls, arcade walls)
    - `bg_pyre_crypt.js`: 1 call (back wall)
    - `bg_pyre_boss.js`: 4 calls (apse bays, choir arcade, ambulatory wall, aisle wall)
    - `bg_garden_heart.js`: 1 call (cellar tunnel)
  - Add `MV.weatherFloor` over each room's `B.flags` floor (nave, crypt, boss: 1 each).
  - Add `MV.stoneMarks` on the crypt piers and voussoirs, and on the hedge kerb blocks.
- **Trees:**
  - Replace `G.tree(...)` with `MV.tree(x, y, h, Z, { kind: 'dead' | 'oak' })`: 3 calls in `bg_garden_hedge.js` (distant trees, the apple tree by the shed, the heart-oak) and 3 in `bg_garden_grove.js` (distant wood, mid wood, the dead oak).
  - `bg_garden_heart.js` `root()` (8 calls) and `bg_garden_boss.js` `root()` / `colossus()` (9 calls) could become `MV.strand`, `MV.hangRoots` and `MV.surfaceRoots`.

### Polish weak spots
- **garden_hedge:** the gardener stands in front of the right hedge-ball fore piece. The maze walls sit low in the frame behind the heroes, so most of them read in the far third. The archway is still a frontal face (it now has depth and a top).
- **garden_grove:** the dead oak's crown is still out of frame. The fore cap overhead still reads as a slab. The bench is behind the heroes.
- **garden_heart:** the bright foxfire puddle lines near the foes' feet are thin purple strokes.
- **garden_boss:** the colossus trunks are still broad flat shapes. Her own render's tree frame overlaps the right trunk.
- **pyre_stake:** the clouds are soft but still sit in horizontal rows.
- **pyre_boss:** the beam has hard straight sides (a light, kept stepped and fading). The left arcade blocks are large and clean until materials_v2 weathers them.
- **pyre_nave:** the clerestory light is still one broad beam.
- **pyre_crypt:** the arch grid is still regular.
- **All:** the stone looks pristine until the materials_v2 swap.

### materials_v2 swap (done after materials_v2.READY)
- **Stone that weathers automatically:** stone drawn through `lik.js` ashlar/masonry and `battle_kit_b.flags` now weathers with no change to my scripts. The `pyre` and `garden` presets are picked from the script names. This covers the XIII walls, crypt and apse, and every flag floor.
- **Added explicitly:** `MV.stoneMarks` on the crypt pier drums and every crypt voussoir (`bg_pyre_crypt.js`), and on the maze terrace kerb blocks, top and face (`bg_garden_hedge.js`).
- **Trees:** `G.tree` already draws through `MV.renderTree` (kit change by the materials agent), so the hedge and grove trees are organic.
- **Roots:** the `root()` helpers in `bg_garden_heart.js` and `bg_garden_boss.js` now draw through `MV.strand`, a smooth shaded tube with bark. The heart's cold foxfire rim and the boss room's sunset rim are kept on top.
- **One-command rebuild:** `sh scenes/rebuild_g5.sh` rebuilds all 8 XIII and XIV rooms (layers at 2x, opaque far, previews) and both world sheets. It takes about 2.5 min.
- **Far SVG sizes after weathering:**
  - pyre_nave 5.7 MB and pyre_boss 5.4 MB: over the ~5 MB guide.
  - The other six rooms: 0.5 to 2.8 MB.
