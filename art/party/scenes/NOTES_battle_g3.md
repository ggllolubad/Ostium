# Battle rooms round 2, worlds VII, VIII, IX (group g3): notes

Brief: `scenes/BATTLE_ROOMS_BRIEF.md`. Contract unchanged (1480 x 480, far opaque / mid / fore transparent, PNGs at 2x,
battle camera horizon 300, eye 1.2 m, focal 652, cx 740, fighters at 6 m with feet on y 430, `<room>.camera.json`).

## Files

| What | Where |
|---|---|
| Kit (new, this group) | `scenes/battle_kit_g3.js` (requires `battle_kit_b.js` and `battle_li.js`, edits neither) |
| Build | `sh scenes/build_battle_g3.sh <W> <room> <scene.js> <foe[@x],...> [quarter.png]` |
| Preview and sheet | `scenes/battle_preview_g3.py` (boss rooms: companion and boss at given x; sheet: 2 columns) |
| Rooms | `scenes/bg_<room>.js` for the twelve rooms below |
| Outputs | `out/scenes/battle/<W>/<room>_{far,mid,fore}.svg/.png`, `<room>.camera.json`, `<room>_preview.png` |
| Sheets | `out/scenes/battle/<W>/world_<W>_rooms.png` |
| Foe renders used | `out/scenes/battle/figs/<W>_<key>.png` (figs.js right, render.js 0.594, flipped in the preview) |

## World VII, the Icebound Fleet: plan (written before building)

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `fleet_ice` (upgrade) | the sea ice between the ships of the battle line; the frozen shot-splashes of the first broadside, a lead of black water, eel holes | open exterior, vast, ground level | noon under a high thin overcast; the focus is the bright sky where the sun stands behind cloud, over the gap between the ships, its glare lying on the far ice | long horizontals (the ice, the hulls, the line to the horizon), mast verticals far off | light key, white and pale grey |
| `fleet_deck` | the weather deck of the flagship among the masts; whalers at the rails, gulls nesting in the rigging | elevated exterior, mid scale, bounded by the bulwarks | night: a moon through a break in the cloud high over the mainmast, rigging black against the lit cloud, snow falling | verticals and diagonals (masts, shroud fans, ratline ladders), the deck planks converging | dark key, slate blue and black with moon-white |
| `fleet_hold` | the orlop deck below the waterline: the cable tier, hammocks of the sewn dead, the surgeon's cockpit, and the hull stove in by the ice | enclosed interior, tight, low (beams just over the heads), looking along the ship | darkness with one grey shaft down the hatchway and a cold blue-green glow through the ice where the sea burst in | low horizontal beams converging, curved ribs and knees | darkest key, black and blue-black, the cold glow the only light |
| `fleet_boss` | where the leviathan rose: a crater of upheaved sea ice, a ship of the line crushed and lifted on edge behind it, the fleet ringed round | vast exterior, the largest scale in the world | storm: a black overcast with one tear of cold low sun breaking behind the boss's head | jagged upthrust plates radiating from the stage, the tilted hull and splayed masts as a broken gate | dark storm key with one white break |

## World VIII, the Sundered Rime: plan (written before building)

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `rime_crevasse` (upgrade of `rime_breach`, renamed) | a crevasse the heat split in the glacier under the hold; the vent at its foot where the magma hounds nest; the miners' ropes, spikes and ladders down its walls; their winch at the lip far above | deep natural slot, tight and tall, walls on both sides closing overhead, looking along it | cold blue daylight from the strip of sky high overhead, glowing down through the ice walls; the vent's orange at the far end, its steam rising up the slot | soaring curved verticals: banded, fluted, undercut and overhanging glacier walls (smooth, not faceted), converging | mid-dark cold key (glacier blue), one hot accent far down |
| `rime_glacier` | the glacier's surface over the hold: the thralls' cutting across a cracked floe, something moving under the ice, steam vents, the seeress's rune-stone, the hold's turf roofs far off under the mountains | open exterior, vast, ground level | dusk under an ash plume: the fire beneath lights the plume's underside orange over the mountains, the snow pale and blue in shadow | long horizontals (the floe, the mountain chain), tilted seracs, rising steam columns | light key below, split sky (orange-lit ash over cold) |
| `rime_hall` | the jarl's mead-hall: the long hearth burning, the floor split down its length (frozen side and burning side), carved posts, shields, the Glass Gate (the great doors fused to black obsidian) | enclosed interior, mid scale, a high roof | firelight: the long hearth and the glowing split are the key; the frozen side dim and cold | timber posts and raking roof trusses (diagonals), the hearth's long horizontal, round shields | the world's warm key (orange and black) against a cold side |
| `rime_boss` | the riven glacier: the chasm where the glacier tore in two under the hold, the jarl's glacier throne at its brink | vast exterior, the largest scale in the world | night; the chasm floor pours molten light upward between a cliff of white ice and a cliff of black obsidian, ash and steam in it | a giant V of two leaning cliffs framing the boss, the jagged crack radiating from it | darkest sky, brightest fire |

## World IX, the Hollow Barrow: plan (written before building)

| Room | Place (bible) | Kind of space | Light and time | Dominant shapes | Palette key |
|---|---|---|---|---|---|
| `barrow_hall` (upgrade) | the household's timber hall buried under the mound: the funeral feast still laid on the high table, the household seated at it frozen; the doorway walled up from within by the barrow mason | enclosed interior under earth, mid scale, long and low | darkness lit only by the funeral candles on the high table, frozen mid-flame: a cold bone-white glow | heavy split-log roof sloping in over us, upright staves, the long horizontal of the dais and table with the row of seated dead | dark key, grey-green and bone, the candles' cold white |
| `barrow_mound` | outside: the field of grave mounds round the Hollow Barrow, the road between them, the lepers' path with its warning post and bell, dead yews | open exterior, vast, rolling | winter dusk in freezing fog; a pale sun disc low in the fog behind the great barrow | soft curves (the mounds), a few uprights (standing stones, twisted yews), the road converging | light key, pale grey-green fog, white snow |
| `barrow_tomb` | the vault under the mound where the dead were laid in niches, and the rot witch's embalming slab | underground, tight, low, stone | darkness with one tallow lamp hung on a chain over the embalming slab | corbelled stone: courses stepping in to a narrow roof, rows of burial niches (round-headed holes), curved | darkest key, grey-green stone and mould, one dim bone-yellow light |
| `barrow_boss` | the king's burial chamber at the heart of the mound: a great corbelled chamber, its orthostats carved with spirals, the light-box over the passage, the grave goods heaped | vast enclosed chamber, the largest space in the world | the winter-solstice beam: one shaft of low sun down the passage through the roof-box, crossing the dark chamber to the king's recess | the dome's concentric stepped courses, the great upright slabs, the beam's straight diagonal | darkest key with the brightest single beam |



## Checked after building (the one-line test on the world sheets)

- **VII** (`out/scenes/battle/VII/world_VII_rooms.png`): white noon ice plain / night deck under the moon among masts /
  black low orlop with one grey hatch / black storm with one white tear and the leviathan. Told apart at thumbnail size;
  all four keep black hulls, ice white and grey-blue, no warm colour.
- **VIII** (`world_VIII_rooms.png`): blue glacier slot with a hot vent at its end / pale glacier under an orange-lit ash
  plume / orange firelit timber hall in perspective / night chasm with a lit steam pillar framing the jarl. All four keep
  ice white, orange seams and black obsidian.
- **IX** (`world_IX_rooms.png`): buried log hall with the seated dead under frozen candles / pale fog field of mounds /
  tight corbelled vault under one tallow lamp / great chamber with the solstice beam on the king. All four grey-green,
  bone and mould. Closest pair: the tomb and the boss chamber are both dark stone looking along the room; they differ in
  scale, light (lamp vs beam), shape (niches and corbel steps vs great slabs and spirals) and key.

## Lore per room

### VII
- `fleet_ice` (upgrade): the sea ice between the ships of the line. Two near ships rebuilt with the new `ship()` (curved
  sheer rising aft, a raised stern, tumblehome tone grading, wales standing proud with shadow strips, rime and icicles,
  channels with deadeyes and chain plates breaking the port rows, ports in every state: closed with hinge straps, lid
  raised and icicled, lid hanging, gone; muzzles, a burst gun, frozen gunners; quarter gallery, figurehead, bowsprit;
  pressure ice heaped at the waterline). The line going to the horizon; tabular bergs; the frozen shot-splashes as merged
  burst towers; the lead of black water (the selkie's floe); eel holes; the drowned sailor under clear ice; sastrugi and
  cracks converging. Fore: bowsprit and frozen jib, frozen hawser, broken mast stump and heaped plates.
- `fleet_deck`: the flagship's weather deck at night. The mainmast with hoops, guano, harpoons racked and the fife rail
  with frozen coils; the far shrouds and ratlines with roosting gulls; the larboard bulwark with a gun at its port, the
  hammock nettings under snow (one burst, a drowned hand hanging out); a whaleboat in its davits with harpoons; the rest
  of the line's rigging in rows beyond the rail; the moon in a cloud break. Deck planks glazed, a grating, gun-slide
  tracks converging, snow drifts. Mid: line tubs, a block, fallen frozen gulls. Fore: the mizzen foot at the left, the
  main course broken from its gaskets and frozen as it fell, with the rookery on it.
- `fleet_hold`: the orlop looking aft. Deck beams just over the heads converging aft, hanging knees, ribs and lining;
  the hatchway's lit well (the light), the grey shaft and the snow heaped under it, the companion ladder; the starboard
  hull stove in by a wall of glowing sea ice with splintered planks and a snapped rib, the frozen bilge with an eel hole;
  the sailmaker's dead sewn in hammocks hanging from the beams (two shot at the feet); the cable tier; the surgeon's
  cockpit (sea-chest table, bucket, saw on a nail); casks. Fore: the nearest beam with icicles and an iced lantern, a
  rib, a stanchion with a frozen rope.
- `fleet_boss`: where the leviathan rose. Black storm deck, one tear of low sun behind the boss's head; a ship of the
  line crushed and tipped on end at the crater's rim with its masts splayed (left post of the gate); heaved plates three
  and four storeys high and a great tipped slab at the right edge (right post); the fleet ringed round in the dark; cracks
  radiating from the stage toward the company. Fore: an upthrust slab with a harpoon and its line at the left, plates
  banked at the boss's left edge and along the bottom (see weak spots), driven snow.

### VIII
- `rime_crevasse` (upgrade of `rime_breach`, renamed; `rime_breach_*` outputs left in place): smooth glacier walls with
  strata, flutes, undercuts and overhangs, rime and icicles at every lip, glowing blue from within; the vent at the far
  end under a slumped obsidian tongue (lobes, not a vase), steam up the slot; the miners' spikes, knotted rope and rope
  ladder down the walls, their winch chain and bucket from the lip; the hounds' bed of warm ash and gnawed bones; fallen
  snow-bridge blocks; boot and paw prints converging. Fore: a snow-bridge remnant arching overhead, the near wall's edge
  with a rope, an obsidian boulder with one seam.
- `rime_glacier`: dusk on the glacier; the ash plume from a fissure behind the mountains with its underside lit orange
  (the light); mountains (two ridges), the hold's turf roofs and headframe on an outcrop, seracs, steam columns with
  orange roots; the floe in plates with sastrugi and cracks, a warm seam; the thralls' cutting (trench, pick scars, stacked
  blocks, picks left in it), a sledge; the fissure worm's shape and glowing wake under a clear patch; the seeress's
  rune-stone, frosted face and charred face with glowing runes, her ring of stones and cold fire. Fore: a serac, a loaded
  sledge, a drift.
- `rime_hall`: the jarl's mead-hall down its length: carved posts (left row rimed, right row charred and seamed), tie
  beams, rafters into smoke, shields; tapestries frozen stiff on the left and burnt to the rod on the right; the long
  hearth burning with its cauldron (one rim boiling, one frozen); the split glowing the hall's length with rime on its
  cold lip; the Glass Gate at the far end (doors fused into black glass, seams glowing, steam at its foot). Mid: a burst
  mead cask with frozen mead, dropped horns, a charred bench. Fore: the near cold-row post, the nearest tie-beam (rimed
  half, burning half), a charred bench end with a fur.
- `rime_boss`: the riven glacier at night: the white ice cliff (left post) and the black glass cliff (right post), the
  split running away to the horizon glowing from below, the pillar of steam and ash lit orange standing between the ice
  cliff and the throne (the light); the far plain with the hold's ruin split in two; the ground frozen on the left and
  burned on the right, a crack running from the throne toward the company and forking. Fore: the hold's frozen standard
  at the left, obsidian shards at the stage's foot.

### IX
- `barrow_hall` (upgrade): the empty grave-throne is gone (the king's resting place is `barrow_boss`). The centrepiece
  is now the funeral feast: the dais and high table along the back wall with the household seated at it frozen (heads
  fallen, thrown back, one cup raised), the thane's high seat empty at the middle with the boar's head before it, the
  funeral candles frozen mid-flame as the hall's only light; the household's banners above them. The roof is now heavy
  split logs running toward us with earth and roots between (no more shingle read). The sealed door (mason's stones, the
  lime cross) moved to the left; the old hearth kerb on the floor; a fallen cauldron, an overturned bench. Fore: the
  carved post with fungus, a fallen dead in grave linen with buboes, log ends and roots across the top.
- `barrow_mound`: the field of grave mounds in freezing fog at dusk; the great barrow on the rise with its walled
  portal and crest stones, the sun's pale disc over it (the light); rows of mounds paling into the fog, standing stones
  with worn serpent bands, dead yews (twisted, irregular, no Y forks), crows; the road with its ruts and a dry-stone dyke;
  the lepers' warning post with its bell, rags and their path through the snow; wolf tracks; a wolf-killed sheep. Fore: a
  dead yew and its limb with a crow, a leaning carved stone, the snow crust.
- `barrow_tomb`: the vault of the dead: straight dry-stone walls lined with arched niches (each with its dead in linen,
  or a skull and bones), corbelled courses stepping in, capstones, roots; the rot witch's embalming slab under the one
  tallow lamp (a body under a stained sheet, bowls of cold salts steaming, bone needles, herbs drying on a cord); mould
  carpeting the floor, a grave worm's burrow broken up through the flags with bones in the spoil. Fore: the near
  capstone with icicles and roots, an orthostat with a skull niche, a heap of bones in the corner.
- `barrow_boss`: the king's chamber: corbelled courses rising into the dark, great slabs carved with spirals and
  lozenges, the king's recess framed by tall slabs and a carved lintel, grave goods heaped (chests, shields, a sheaf of
  spears, a cauldron, tarnished silver cups), the household seated along the left wall in the dark; the midwinter beam
  from the light-box crossing the chamber onto the king's head (the brightest single light in the world), spores lit in
  it. Fore: the carved slab at the passage mouth, a faint wash and motes of the beam over the king, grave goods spilled
  across the throne's foot.

## Rules audit

| Rule | Status |
|---|---|
| Contract | All twelve: 1480 x 480 viewBox, PNGs 2960 x 960, far opaque (alpha 255 everywhere; SVG backstop added by `opaque_far.py`), mid and fore transparent, `<room>.camera.json` = the nave's battle camera. |
| Quiet zone | Every far layer ends in stepped murk veils over y 236-360; the mid layers hold only low, dark things. |
| No lightning | None in these worlds; nothing drawn as arcs or bolts. |
| Eyes | None as motifs (not void worlds). Skulls and the dead have dark sockets only. |
| Void | Not used. |
| Gold | None. Silver is tarnished grey; brass none; the barrow beam is pale sun. |
| Red | None. |
| VII no warm colour | Checked: no warm hex in the four VII files; the one brownish muzzle tone in the kit was changed to grey. |
| No flat fills, no regular tiling | Mottle, hatch and stepped tones on every large area; stone is rough coursed rubble (`ashlar` rough) or irregular flags; the deck and roof planks are `boards`. |
| Kits | No kit file edited. New helpers only in `battle_kit_g3.js`. Frozen figure files untouched. |
| Layers | Boss rooms use the same far/mid/fore. |

## Weak spots (honest)

- **Boss figures carry hard canvas edges.** The leviathan render fills its whole 1600 canvas, so at true scale its left
  canvas edge and bottom edge cut straight lines into the room. `fleet_boss` hides them with plates in the fore layer
  banked against its left side and along the bottom; that only works with the boss at x 2470 (2x). The riven jarl and
  barrow king renders have straight-edged throne bases at the bottom; the fore plates and grave goods cover them at the
  same x. If the game places bosses elsewhere, those fore heaps will not line up.
- **Boss backdrops are mostly hidden by the bosses.** At 3.5x scale the rulers fill the right 45 % top to bottom, so the
  framing (the leviathan's tipped ship and ice slab, the jarl's ice and glass cliffs and steam pillar, the king's recess)
  reads only round their silhouettes. The light focus in each was moved to where it shows (the tear left of the
  leviathan's jaw, the lit pillar between the ice cliff and the jarl, the beam ending on the king's head).
- **fleet_ice:** the frozen splashes now read as burst towers of lumps but are still a little like stacked clouds; the
  gunport rows are much less boxy but still regular at 0.5x (ships are); clouds still have a light-rim cartoon edge.
- **fleet_deck:** the moon's stepped halo is visible as rings; the whaleboat in its davits reads weakly against the dark.
- **fleet_hold:** the breach (the room's second light) is mostly behind the foes; the nearest beam is a flat dark band.
- **rime_crevasse:** the walls close overhead, so no sky strip is visible; the light reads as ice glowing from within
  and the pale far end. The floor plates are a little tile-like.
- **rime_glacier:** the mountains are faceted (cleaner than the old breach, still geometric); the steam columns are
  stacked lobes; the near floe is plain.
- **rime_hall:** the hearth fire reads as a flame mass (inked, papery) rather than a long low fire; the Glass Gate is
  small at the far end; the split's front is a wide flat orange band.
- **rime_boss:** the steam pillar's rolls are concentric lumps; the floor's frozen half still shows tile edges.
- **barrow_hall:** the seated dead are small (0.6 m busts at 13 m) and similar in build; the cloth on the table is a
  long pale band.
- **barrow_mound:** the mounds are faint in the fog behind the fighters; the great barrow is small.
- **barrow_tomb:** the corbel courses still read slightly as stripes; the capstone roof is a flat pale area.
- **barrow_boss:** the vault's corbel bands read as stripes; the round shields among the grave goods are plain discs.
- **Process:** each room had 2 to 4 look-and-fix loops; none had a second director pass. The far SVGs are 0.3 to 5.7 MB.

## Time (approx.)

| Item | Agent time |
|---|---|
| Kit, preview and build tools, foe renders | 0.5 h |
| VII (4 rooms) | 1.6 h |
| VIII (4 rooms) | 1.3 h |
| IX (4 rooms) | 1.3 h |

Build and render of one room: about 6 s.

## Polish round (Cole's review, BATTLE_POLISH_BRIEF.md)

Before/after sheet: `out/scenes/battle/g3_polish/before_after_VII-IX.png`. World sheets rebuilt. All twelve rooms rebuilt
(the shared kits now weather stone through `materials_v2.js`, so every room's stone changed even where its script did not).

### Kit additions (`battle_kit_g3.js`)
`skyGrad` and `radGlow` (smooth gradients: skies, fog and light glows only), `softMass` / `softCloud` / `softSteam`
(soft-edged masses with wisps, no stacked rings), `mountains` (smooth silhouette, soft snow and shade, no facets),
`tree` (organic: tapering ribbons, smooth bends, root flare into the ground), and the materials-v2 switch: `treeV2`,
`stoneV2`, `rockV2` use `materials_v2.js` (MV.tree, MV.stoneMarks, MV.rockSkin) only when `scenes/materials_v2.READY`
exists. The READY marker did not exist at the end of this round, but the kits were already calling materials_v2 and the
switch was tested against it; the last builds ran without the marker (see the report).

### Cole's notes
- **fleet_boss:** the ship is no longer on land. It sits in the sea ice at the crater's edge, rolled 9 degrees by the
  heave: stern down in a black lead of open water the leviathan broke, bow lifted on heaved plates, keel in the ice,
  plates and floes shoved up along its whole waterline. The storm sky is a smooth gradient with soft cloud masses; the tear
  is a smooth glow. Cracks toward the company now wander (they read as cracks, not rails).
- **rime_boss:** flipped to FIRE LEFT, ICE RIGHT, matching the jarl. Left: the black-glass cliff with glowing seams, the
  burned ground with seams and ash, the hold's standard burnt to a smouldering rag. Right: the glacier cliff, rime and
  icicles, the frozen ground under the throne, ice plates at the stage's foot. The split's lips swapped too. Night sky is
  now a gradient with stars; the steam pillar is soft billows lit from below (no concentric lumps).
- **barrow_mound:** ground story: the plague cart (broken wheel, its shrouded load of dead, the split lime sack, the
  shafts on the snow: also the scale cue), its track's ruts curving in between the mounds, grave boards on the near
  mounds and a skull on a stake, an offering ring with a cup and a rag stake, a dead horse frozen with legs out, crows,
  frozen tussocks all over the near snow, lee drifts behind every mound. Every tree rooted (materials-v2 trees with root
  flare and snow banked at the foot). Fog sky is a gradient; fog banks are soft masses.
- **Trees:** the near yew limb in barrow_mound is now smooth tapering ribbons; all yews use the organic tree.

### Director's list for VII-IX
- fleet_ice: the splashes are now glass-ice columns flaring into curled crowns with flow lines and icicle fringes (not
  cloud lumps); the gunport rows are broken by frozen spray sheets draped over the side, drifts over the lower tier,
  planked-over ports and jittered spacing. Sky: gradient and soft clouds.
- fleet_deck: the moon halo is a smooth glow (no rings); soft clouds; stars.
- rime_glacier: mountains smooth (no facets); the plume and steam columns are soft billows; gradient sky.
- rime_boss: soft steam, the tile floor replaced by broad soft-jointed crust and snow.
- barrow_hall: the dead are larger and every one different (hood, conical helm, headcloth, bare, a child), spacing varied.
- barrow_tomb vs barrow_boss: barrow_boss redesigned as a different kind of space and light: the king's chamber with its
  roof fallen in, open to a midwinter dawn sky inside a crater of frozen earth with roots hanging from the turf lip; the
  carved slabs stand in a ring with capstones fallen against them and long shadows toward us; the low sun stands in the
  notch where the passage was cut (left third, never covered by the boss) and its light runs across to the king.
  barrow_tomb keeps the enclosed vault and got a real value range (black corners, bright lamp and its pool of light).
- Observations: soft steam/cloud/fog everywhere it appeared in these worlds (crevasse vent, hall cauldron, tomb salts);
  gradient skies in every exterior; the rime_hall split's near part has a slag crust; the hold's near beam has grain, a
  check and a carved tally; scale cues (cart, boat, casks, table, slab, standard) in every room.

### Weak spots after polish
- barrow_tomb's far SVG is 13.5 MB (materials-v2 weathering per stone on the many corbel courses); it once crashed
  Chromium under memory pressure and rendered on retry. barrow_mound's SVG grows by about 1.2 MB per materials-v2 tree.
- barrow_boss: the sun in the notch is soft (the bank strata and roots on the crater wall read as tick marks at 1x).
- fleet_boss: the tipped ship sits well, but the boss still covers the crater's right side; the frozen whaler stands
  in front of the ship's waterline plates.
- fleet_hold: the breach glow remains mostly behind the foes.
- rime_crevasse: no sky strip is visible; the far end is the light.
- barrow_hall: the seated dead are still small busts at 13 m.

## Polish round 2 (coordinator review)

Before/after: `out/scenes/battle/g3_polish/before_after_round2.png` (barrow_mound and fleet_deck).

- **barrow_mound** pushed hard. The field is brought close: big grave mounds at three depths (Z 15, 21, 30, plus a pale
  far row at 55) with dark turf showing through rounded snow caps and lee drifts; fog now only thickens with distance
  (air from 18 m). Centre: an opened mound, its stone-lined passage black between upright slabs and a lintel, its kerb
  stones tumbled onto the snow, its spoil heaped. The plague cart is large in the gap between the lines (good wheel with
  spokes and iron tyre, broken wheel lying flat, shrouded load with an arm hanging out, chalked tally of the dead, shafts
  on the snow, split lime sack with lime spilt white, its ruts). A line of leaning grave boards marches along the road to
  the great barrow. A gibbet-like marker with crows on its arm and a frozen rope end, offerings at its foot. The dead horse
  is a clear dark shape in the gap. Trees: new organic helper kinds, wind-bent yews (thick leaning trunk, limbs swept
  downwind, dark foliage masses with snow on them) and bare thorns (crooked limbs, soft fans of fine twigs, no spikes),
  every one rooted with a flare and snow banked at the foot.
- **fleet_deck**: one moon and one smooth halo; the clouds are long layered banks with silvered tops and dark bellies,
  fewer and thinner toward the horizon; nothing else round in the sky (the soft round masses and stars are gone).

Weak spots: the yew foliage masses read a little like stacked cushions; the opened mound's passage is small at 0.5x;
the fleet_deck cloud banks are flat in silhouette (form comes from the lit tops and dark bellies, not from billows).

## materials_v2 READY (rebuild)

- `scenes/rebuild_g3.sh` rebuilds all twelve g3 rooms (layers, opaque far, previews) and the three world sheets in one
  command; `sh scenes/rebuild_g3.sh <room> ...` rebuilds only those rooms, then the sheets. It retries a room once if
  Chromium crashes under memory pressure, and exits non-zero naming any room that still failed.
- With READY present, `battle_kit_g3` routes trees through `MV.tree` (thorns as `windswept`; yews as `yew` with foliage)
  and its custom stone through `MV.stoneMarks` / `MV.rockSkin`. The MV yew was compared with the g3 yew side by side: the
  MV yew's foliage is small organic clumps on the limbs, while the g3 yew's masses read as flat cushions, so the MV yew is
  used. `G3_MV_YEW=0` falls back to the g3 yew.
- All twelve rooms rebuilt (3 min 52 s); every far PNG is fully opaque. barrow_tomb's far SVG is back down to 6.0 MB.
