# Battle rooms + abbey: polish round (Cole's review, 2026-11-24 11:02)

Cole's notes come first; then the director's polish list. Fix every item for your worlds, then rebuild, re-preview, re-sheet.

## Cole's notes (verbatim intent)
- **I stair (The Sea Stair):** roofs do not connect to their buildings; the buildings are far too plain and boring. Every roof must sit on walls; give the lower town real houses: gables, jetties, doors, shutters, chimneys, signs, stairs between terraces, wrecked boats, drowned laundry lines, salt and weed growth, each house different.
- **II mire_bog (The Peat Cutting):** reads as flat boring walls and a trench. Make it a PEAT BOG instead: open, wet, hummocky bog with cut turf stacks, peat hags (eroded peat banks), black pools, cotton-grass, sphagnum, a bog trackway, bodies glimpsed in the peat; no trench walls.
- **III baths_boss (Sanctum of the Waters):** the Simmering Matron figure already sits in her own tub; the room put her into a second, larger tub. Redesign the boss stage so her tub sits on a floor/dais (steps, drain channels, scalding overflow running from her tub across the floor). No second basin under her.
- **V foundry_floor (The Anvil Line):** the things on the walls are confusing, simple triangles and rectangles. Give them story: forge hoods with soot, riveted plates and chains; flues with dampers; tool racks with tongs and hammers; trip hammers with cams and water/steam drive; quench troughs; bronze castings hung to cool; chalked tallies. Every object must read as what it is.
- **VII fleet_boss (Where It Rose):** the crashed ship is too far up on land; no ship could get there. The ship must be in the sea ice at the edge of the crater the Leviathan broke open, tipped by the heave, its keel still in the ice/water. No dry land under ships.
- **VIII rime_boss (The Riven Glacier):** flip it: FIRE on the LEFT, ICE on the RIGHT, to match the Riven Jarl's own split.
- **IX barrow_mound (The Mound Field):** the grass/snow ground is boring and little is going on; some trees hover. Ground needs texture and story: frozen tussocks, snow drifts against mounds, a plague-cart track, grave markers, offerings, a dead horse, bones, crows. Every tree rooted with visible root flare into the ground.
- **XI spire_top (The Aurora Gallery):** there is no visible floor under the characters. Give the gallery a real paved/leaded floor plane in perspective under the fighters.
- **XII silence_rift (The Rift Edge):** one background mammoth is cut in half and unfinished. Finish it (or if it is meant to be cut by the void, make the void cut unmistakably a torn void edge, not a crop).
- **XIV garden_hedge (The Hedge Maze):** hedge walls are visually one pixel thick and do not read as maze walls. Hedge walls need real thickness and volume: a top plane, a lit face and a shadowed face, clipped-leaf texture, gaps, dead patches, overgrowth, with the maze walls receding in perspective.
- **ALL WORLDS, trees:** many trees have sharp jagged turns that read too geometric. Trees, branches, roots must be organic: smooth tapering curves, branching that thins, no sharp polyline kinks. (Use the shared organic tree helper in scenes/materials_v2.js when it is announced.)
- **XV sky_ruins (The Floating Stair):** random floating things read as unintentional. Anything suspended must read as deliberate: grouped, aligned to the stair's broken flights, with a clear reason (a broken flight drifting apart in sequence), never scattered junk.
- **XV sky_choir:** walls flat, undetailed, repetitive.
- **XV whole world:** for the semi-finale world it reads as the most bland; it must be the most epic and interesting world to look at. (A dedicated agent rebuilds all four XV rooms.)
- **ALL STONE (rooms and abbey):** stones read as pristine with minimal texture. Weather them (shared material upgrade in scenes/materials_v2.js).
- Abbey: title clouds have hard lines between colours (should read as smooth gradients); building tops are illogically cut off; the garth's central standing fire pit draws its fire behind the bowl, not in it.

## Director polish list (after Cole's)
I: ossuary vault reads as a wall; nave strainer arch heavy; grotto salt drips read as teeth. II: mire_boss causeway chequer slabs; mire_drown trees in an even belt. III: baths_furnace grid; cistern single texture and net cracks; baths_boss near-left columns compete with heroes. IV: stone reads as crazy-paving polygons; hewn rock and built walls must differ. V: foundry_roof bellows legibility and smoke puffs. VI: coast_cove cave mouth a smooth oval; coast_boss glare reads as a moon; old scorch on coast_cliffs reads as a tree. VII: fleet_ice splashes read as clouds, gunports regular; fleet_deck moon halo rings. VIII: rime_glacier angular mountains and lumpy steam; rime_boss concentric steam and tile floor. IX: barrow_hall dead small and alike; barrow_tomb vs barrow_boss too similar (give the boss chamber a different kind of space and light). X: hive_spires candle-like spires and Halloween orb web; hive_boss beam stripes. XI: spire_stair floating clock discs and weak helix; spire_orrery straight ribs. XII: shrine ice stripes; rift vs boss night skies too alike at thumbnail. XIII: pyre_boss centre muddled and black kite behind halo; pyre_stake humped clouds and palisade stakes. XIV: garden_grove caps a row of columns; garden_boss too many rose centres reading as eyes; branch vault straight sticks.

## Gradients
Cole wants skies to read as smooth gradients. Skies (and only skies, fog and light glows) may use smooth gradient fills under the ink and hatch. Keep cel bands for objects.

## Director's independent observations (apply across all rooms)
1. **Steam, smoke, clouds and fog** are mostly built from stacked lumps or concentric rings with hard edges. Make them soft-edged masses with varied size, wisps breaking off, and gradient falloff (allowed for atmosphere).
2. **Fighter-band floors** are often a flat dark band. Keep them low contrast but give real surface: joints and cracks in perspective, debris, puddles, frost, worn paths where feet go, contact shadows under props.
3. **Repetition:** rows of identical arches, canopies, clocks, stakes, spires, mushrooms or posts still appear. Vary size, spacing, damage and state for every repeated element; break every row at least twice.
4. **Value:** several rooms sit in one mid value (ossuary, silence_shrine, garden_heart, barrow_tomb). Each room needs a darkest dark, a lightest light near the focus, and a clear middle; check with a greyscale thumbnail.
5. **Night skies** made of stepped bands read as mountain ranges. Use smooth gradients with a few soft cloud masses and stars.
6. **Boss rooms:** the boss covers the right 45%. Put the room's grand feature where it stays visible: above the boss's head line, framing its silhouette edges, or on the left third. Check against the real boss render.
7. **Gold and gilt** (XV, holy items) reads as flat yellow when it is large. Model it: dark-to-light bands, burnish highlights toward the key light, black showing at cracks and edges.
8. **Scale cues:** add one familiar-scale object per room near the fighters (a door, a cart, a lantern, a barrel, a bench) so the size of the space reads.
9. **Edges of frame:** no room may show a straight-cut prop or crop at the frame edge unless it is a deliberate foreground framing piece.
