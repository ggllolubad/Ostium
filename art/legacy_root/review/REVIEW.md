# Ostium art review

Standard: realistic, gritty engraving-ink base with fantastical flair. Nothing that reads as a mannequin, box, blob, sticker or clip-art. Judged at 1:1 and at in-game size (~330 px tall).

## Batch 1: door-world creature archetypes (grim/kit.js, grim/kit2.js, new grim/anatomy.js)

### Humanoids (about 60 creatures)
**Problems found**
- Mannequin construction. The torso was a straight slab only about 1.4 head-widths across the shoulders (real shoulders are about 2). Limbs were uniform tubes, and the deep shadow band put long pin-stripes down each one. There was no stance, and both legs dropped straight down.
- The head was a flat profile mask. A dark wedge under the jaw read as a second mouth. Every head grinned with bared teeth, so the cast looked the same.
- The neck was a separately coloured tube that showed under helmets.
- Hands were open mitts and never gripped anything. Weapons floated in front of the fingers, and the sword guard sat in the palm.
- Weapons in the raised pose ran off the top of the canvas. The staff passed straight through the seeress's face.
- Element decals read as stickers. Fire cracks crossed into symmetric X shapes, and one on a shield read as a swastika-like glyph. Frost was scattered white blotches and sparkles.
- Armour was one rounded bib with no plate logic.
- Hats were modern fedoras.

**Fixes made**
- New `grim/anatomy.js`:
  - Torso: sculpted 3/4 view that leans toward the heroes, with trapezius slope, chest, waist pinch and hip flare. Shoulders are now about 2 head-widths. Bare torsos get pec, rib and abdominal shadow planes, the iliac line and a navel.
  - Limbs: deltoid, biceps, forearm swell and wrist taper on the arms; quadriceps, knee, calf and ankle on the legs. Shadow depth is reduced so forms read round.
  - Head: modelled from brow ridge, nose bridge, nose, lips, chin, jaw angle, ear and occiput. Eye socket and cheek-hollow planes are engraved lines. The jaw hinges at the ear, and only specs with jaw >= 0.45 open the mouth. Skull variant has nasal cavity and tooth rows. Hair falls in strands; optional beard.
  - Neck: tendons and the pit of the throat.
  - Hands: closed fists wrap the grip, with knuckles, finger breaks and a thumb over the haft. Open hands are four jointed fingers plus thumb, with optional curved claws.
  - Feet: boot, bare, sabaton or talon.
  - Armour: lamed pauldron, ridged breastplate with rivets and a three-lame fauld, tassets, gorget, greaves with poleyn, bracers.
- humanoid() rebuilt on the new kit:
  - Contrapposto stride, with the weight on the far leg and the near leg striding forward.
  - Weapons sit in the fist (weapon first, fist drawn over it). Raised weapons are cocked back over the shoulder, so they stay in frame.
  - Forward hands sit clear of the face.
  - Robes flare to a ragged hem, with folds and a rope cincture.
  - Apron is tied, sized to the body and capped for giants.
  - Fur mantle is drawn in strands.
- Fire on skin is now `D.crack`: one meandering fissure with short forks, dark lips, an orange core and a hot thread. It never crosses itself.
- Frost on skin is now `D.rime`: a pale blue crust with clustered needle crystals. Aura frost is rime plus icicles and cold breath, not paper spikes. Aura fire is a heat glow, embers and smoke, not a candle on the back.
- `D.flame` now draws several licking tongues of uneven height in three temperature layers, with thin smoke threads.
- Hat is now a capotain: tall tapering crown, buckle band and a drooping brim.

### Wings
- **Problem:** blocky slabs, then rows of straw-like quills.
- **Fix:** a jointed wing bone (shoulder, wrist, hand). Feathered wings have a solid planform with scalloped primary and secondary tips, feather shafts, and a covert row along the leading edge. Bat wings are membrane stretched between finger bones, with a thumb claw.

### Beasts
**Problems:** rectangular bodies on pillar legs. Heads were triangles. The toad was a box with no head, and the walrus was a box with floating flippers.

**Fixes**
- Canines and deer: deep chest, tucked flank, higher withers, croup, scapula and thigh landmarks. Hind legs have stifle and hock angles. The canine head has occiput, stop, muzzle, nose leather, lips, gum line, interlocking teeth and two-layer ears. Deer get a short white scut instead of a dog tail, and stand lower.
- Toad: dedicated squat build. Low wide body, big folded thighs, splayed forefeet, bulging eyes with slit pupils, a wide mouth line, warts and a pale belly.
- Walrus: dedicated hauled-out build. Raised fore-body, heavy hide folds, planted fore-flippers, whisker pad and long tusks.

### Constructs (bronze automaton, talos, anvil titan, clock sentry, rime colossus, last hour)
- **Problem:** stacked boxes that read as toy robots.
- **Fix:** golems are now cast or carved men built on the anatomy kit, giant-build and hunched. They have plate seams, rivet rows, a visor slit with an inner glow, and an inner core where specced. Cracks vent the element, with fire fissures only on fire constructs. Each one is differentiated: the titan raises a hammer, talos and the sentry carry spears, the colossus grows ice spikes and icicles, and the last hour has a clock-face head.

### Wraiths
- **Problem:** a hooded tube with a box arm.
- **Fix:** hooded robe figures with skull faces, skeletal clawed hands, sleeves and a ragged floating hem.

### Crawlers
- **Problems:** legs were straight bars. The spider abdomen was a hexagon, the crab claw looked like a neck, the centipede legs were long sticks, and the crab was cropped off the canvas.
- **Fixes:** legs have coxa, femur, a high knee, tibia and a hooked tarsus, with spines on spider and crab legs. The spider has a round abdomen and an oval cephalothorax. The crab has a domed, spiny carapace, eye stalks, feeding mouthparts and a heavy toothed claw held low and forward, all re-centred in frame. Centipede legs are short and placed along the body.

### Floaters and swarms
- **Problems:** the wisp was a skull floating in a glow. Head floaters were a bald mannequin head. Moths had pillow wings. Gulls were paper triangles, leeches were boomerangs, and sparks looked like tadpoles.
- **Fixes**
  - Wisps: a roughened teardrop of fire around a burning skull, with licking tongues and embers. Recoloured black-violet for void and white-gold with arcs for lightning.
  - Head floaters: a swollen anatomy head with veins, bruising, eyes erupting from the skin, sores and a gash.
  - Moths: long forewings with a scalloped margin, banded pattern and discal spot; rounded hindwings with eyespots; veins; a furred thorax; a ringed abdomen; feathered antennae; jointed legs.
  - Gulls: teardrop bodies and crescent wings with dark scalloped tips, in mixed wingbeat.
  - Leeches: a ringed, glistening heap on the floor, rearing up with sucker mouths.
  - Sparks: crackling points of light with forked tails.
- The bellows imp was a box bird. It is now a gaunt horned imp with bat wings and claws, which matches its name.

**Still open in batch 1:** spider legs are still a little straight. Golems share one silhouette family. Serpent heads are serviceable but plain. Cold Star and Antlered Mother need more boss presence.

## Batch 2: door-world rooms (grim/bg_worlds.js, 42 rooms)
**Problems found**
- Walls and floors were one flat fill under a large-scale mottle filter, so every surface read as camouflage blotches with no material.
- Mountains were flat jagged polygons with no snow, faceting or depth.
- Steam was translucent soap-bubble circles.
- The horizon had no atmospheric depth.
- Light sources cast nothing onto the floor.
- Far statues were grey capsules.

**Fixes**
- Interior walls are coursed ashlar masonry. Every block is individually toned and chipped, mortar is shadowed underneath, top edges catch the light, the occasional crack runs through, and soot and damp streaks plus a top-down shadow gradient sit over it.
- Cave walls are fractured rock strata: overlapping angular slabs with lit upper faces and hatched undersides. The ceiling mottle was removed.
- Ground floors carry a fine hatch and about 260 shaded stones that shrink toward the horizon, plus hairline cracks.
- Mountains are faceted peaks in two hazed ranges, with snowcaps, ridge lines and hatched shadow faces.
- Steam is rough-edged drifting wisps.
- Every room gets a haze band at the horizon (stronger outdoors) and light pools on the floor in the room's glow colour.
- Far statues are hooded, head-bowed saints on plinths, with robe folds and hatched shadow.

All 42 rooms were re-rendered at 2x and copied to the game.

**Still open:** mid props are thin in a few rooms (sky_gate, coast_cove), and the fore framing masses are plain.

## Batch 3: hub and icons (grim/hub.js, grim/icons.js, new grim/surfaces.js)

### Hub chamber
**Problems found**
- One flat wall with a camouflage mottle and two rows of identical arches.
- No focal point and no sense of the curve of a rotunda.
- The floor was flat concentric rings.
- The oculus was a pale disc.

**Fixes**
- The wall is coursed ashlar, darkened toward both ends so it reads as turning away. Pilasters and niches are spaced by angle, so they narrow toward the edges. Each niche has voussoirs, a hooded saint and candles.
- Focal point: the great Ostium door at the centre, under three receding orders of arch. It has iron-bound plank leaves, two chains and a padlock, a seam leaking cold light, and the six sigils set in the archivolt.
- A ribbed dome rises to an oculus, and a shaft of light falls on the well.
- The floor is radial flagstones in seven rings, with a brass ring inlaid with sigils and a well with rising mist.
- Candle clusters cast light pools; there are bone piles and dark framing pillars.

### Door art
- **Problem:** the frames were mottled slabs and the leaves were flat boards.
- **Fix:** frames are ashlar clipped to each door's silhouette. Leaves are vertical planks with iron straps, studs and a ring pull. The pyre glimpse flame is recoloured black-violet.

### Icons (17 rebuilt)
**Problems found**
- The armour icons were modern T-shirt silhouettes.
- s_might and i_buff read as a flesh-coloured pipe.
- s_stress was a cartoon frowny face, and s_dodge was a cloth blob.
- i_debuff was a plain skull, and quick was a flat leaf.
- iron_hide, shaken and s_taunt were vague.
- a_shroud and rl_mourning_veil were dark blobs.

**Fixes**
- Garments are period cut: stand collar, sloped shoulders, sleeves angled to the elbow, a long flared skirt with side slits, a laced front and folds.
- a_saints_plate is a real breastplate: ridge, gilt cross, fauld lames, pauldron and a blade scar.
- i_buff and s_might are a front-view clenched fist with knuckle ridges, the thumb locked across, veins and a wrist wrap.
- s_stress is a gaunt head with an open mouth and milky eye, split by a crack, with black fumes rising.
- s_dodge is a cloak whipped aside with a blade passing through where the body was.
- i_debuff is a skull with a nail driven in and black drips.
- quick is a flight feather with rachis, split barbs and down.
- iron_hide is riveted plates laced over scarred hide.
- shaken is a trembling reaching hand with tremor marks.
- s_taunt is a war horn on its baldric.
- a_shroud is an empty hooded shroud with two faint lights inside.
- rl_mourning_veil is black lace on a pinned comb with a jet bead.

All 132 icons and all hub art were re-rendered and exported.

## Batch 4: older art

### Drowned Kingdom enemies
- **Problem:** the old bespoke figures read as mannequins and were below the new kit. The bloated corpse was an egg, the warden had a cartoon fish face, the king and the mother were blob bodies, and the kraken arm had floating eyes.
- **Fix:** `grim/drowned_kit.js` rebuilds 17 of the 19 on the anatomy kit. Keys, canvases and anims are unchanged. Additions:
  - Barnacle crust and weed on hulls and armour.
  - Siren and Mother of Brine have a scaled fish tail with fluke, barnacles and a wound, and no belt or loincloth.
  - Bloated has a distended, bruised, split belly with veins.
  - Kraken arm is a real tentacle with a curling tip and a sucker row following the arm.
  - The Drowned King has a coral crown, a trident, a pauldron and a beard.
  - The weeping nun's sewn eyes weep blood.
  - Bell Below and the lamprey mound keep their bespoke drawings, which hold up.
- The old renders are backed up in `review/old/`.

### Drowned rooms
- **Problem:** the arcade walls and the belfry wall used the camouflage mottle, and the fore masses were blotchy.
- **Fix:** coursed masonry with damp streaks, mottle reduced on the belfry and ossuary walls, and flat dark fore masses. All 5 rooms were re-rendered and exported.

### Heroes (not changed, by design)
- **Critique:** the oracle and hexweaver arms are thin uniform tubes, and the bulwark's mace hangs below the frame line.
- **Why not changed:** heroes.json face-crop rectangles (tools/content/build.py FACES) are tied to the current drawings, and that file is outside this agent's ownership. Fixing them needs the main agent to update FACES in the same change.

### Card scenes
- All 513 were re-rendered against the new foes and rooms.

## Batch 5: heroes and the remaining items

### Heroes (grim/bulwark.js, duelist, elementalist, alchemist, oracle, hexweaver)
**Problems found**
- The hands were mitten blobs: the elementalist's splayed paddle, the alchemist's leather blobs, the oracle's and hexweaver's knobs.
- Sleeves were uniform tubes (alchemist, elementalist, hexweaver), and the oracle's arms were 18-12 px sticks.
- The duelist's main-gauche hand did not grip.

**Fixes** (new `A.sleeve` in anatomy.js)
- Robe sleeves now hang from the shoulder, bend at the elbow and open to a bell cuff, with folds and a ragged hem. Used on the elementalist (both arms), the alchemist (both) and the hexweaver (both).
- Elementalist: the conjuring hand is a real open hand, palm up, with frostbite and burn marks. The staff hand is a closed fist.
- Alchemist: gloved fists close on the vial and on the firepot neck.
- Oracle: still emaciated, but the arms now have elbows, forearm swell and wrist taper, with ritual cuts. One hand grips the hourglass and the other hangs open.
- Hexweaver: the flame hand is clawed and cupped. Two fists drive the nail into the poppet.
- Duelist: the far arm has a doublet sleeve and a fist round the main gauche, and a new gloved fist wraps the rapier grip.
- Bulwark: unchanged. Its articulated plate arm, couter, gauntlet and pauldron already meet the bar.
- Heads, layer names, pivots and canvases are unchanged, so the FACES crop boxes in build.py stay correct and did not need an update. Rigs were re-rendered at 2x and exported, and `assets/art/<class>.png` was refreshed at the same sizes (880/1040/920 x 1400).
- Originals are backed up in `review/old/heroes/`.

### Remaining items
- **Spider and beetle legs:** real arachnid arches, with a high knee, a long tibia down to a mid-height ankle and a splayed tarsus. The body is re-centred so no leg leaves the frame.
- **Golem variety:**
  - Bronze automaton: heavy build, furnace grate in the belly.
  - Talos: shield and spear, crest.
  - Clock sentry: normal build, birdcage head, spear.
  - Anvil titan: raised hammer, crown spikes.
  - Rime colossus: ice spikes and icicles.
  - Last hour: clock head.
- **Cold Star:** a black sun with a corona of alternating ice and void spikes, a violet halo, four lesser eyes in orbit, drifting motes and icicles.
- **Antlered Mother:** exposed ribs through rot, a fungal crust, seven eyes opening along the flank, hanging moss, spore cloud. Vast forked antlers hung with moss and fungus, and eyes on the face.
- **Rooms:**
  - sky_gate gains statues, and its floating isles (shared with sky_ruins) are now torn rock with jagged roots, rubble and a fallen colonnade on top.
  - coast_cove gains a wreck and whale ribs.
- All 513 card scenes were re-rendered with the final heroes.
