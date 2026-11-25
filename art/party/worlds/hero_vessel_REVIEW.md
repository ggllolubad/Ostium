# The Vessel (secret seventh calling): review (worlds/hero_vessel.js)

**Sources.** Built from `bible/hero_vessel.md`, including its "Director note 2026-11-23" (Cole: "more holy and significant, not like a lowly peasant with some special magic"), which governs where it conflicts with the older entry. Also used: `LORE_CHANGES_2026-11-23.md` item 3, `GUIDE.md`, `LOGIC_CHECKLIST.md` and `bible/00_design_language.md`.

**History.** This is the fourth pass.
- The first pass was a poor scholar in a patched robe.
- The coordinator rejected it as stiff, with inks that read as painted gloves.
- Cole then redirected the figure to a living icon.
- The fourth pass fixed four close-up faults the coordinator found at 2x: the neck, the hands, the face, and the portrait's cowl and shoulders.

**Settings.**
- `kit.base(seed)` with no overrides, as the six heroes use. Faces right, no flip, groundY = canvas h - 30.
- Cloth and skin parts pass `grime: false`, a per-part option, so the bare feet stay clean as directed.
- Helpers live in `worlds/kit_vessel.js`. `kit_keepers.js` is required read-only, for `split`/`side`/`elb`/`fr2`/`glow`.

**How it was checked.**
- Full renders over a mid-dark ground.
- 2x to 3x zooms on the head, neck, nimbus, both hands and the garth hand on the breast.
- Roster size against the Elementalist and the Oracle: `out/worlds/vessel/roster.png`, and the same image at 0.3x.
- Game size: `out/worlds/vessel/sil.png`, 190 px per human.

"Fixed" means the item failed during this pass and passes on the current render.

## Deliverables

| Figure | Key | Seed | Canvas | Bones | Layers | Rig check diff | Pose test |
|---|---|---|---|---|---|---|---|
| The Vessel (battle idle, orans) | vessel | 7000 | 600 x 820, ground 790 | 29 | 40 | 0.0005 | card play: far open palm pushed toward the foe, sleeve bell counter-rotated plumb (`vessel_pose.png`) |
| Guesthouse rest (asleep standing) | vessel_rest | 7001 | 600 x 820, ground 790 | 28 | 39 | 0.0005 | breath: head settles, hands ease, cord tails sway (`vessel_rest_pose.png`) |
| Garth (hand on the breast) | vessel_garth | 7002 | 600 x 820, ground 790 | 29 | 40 | 0.0004 | head lifts, far orans hand rises, sleeve plumb (`vessel_garth_pose.png`) |
| Portrait | vessel_portrait | 7003 | 600 x 600 (ground 570) | 12 | 13 | 0.0007 | none (still image) |

**Outputs.**
- Renders: `out/worlds/hero_vessel_<key>.png` and `_sil.png`.
- Rigs: `out/rig/worlds/hero_vessel_<key>/`. No export reported MISSING JOINTS, and no grip warnings were printed (the Vessel grips nothing).
- Roster: `out/worlds/vessel/roster.png`, the six heroes and the Vessel from existing renders, at one pixel scale on one ground line.
- Silhouettes: `out/worlds/vessel/sil.png`, the six heroes and the three Vessel poses at 190 px.

**Bones** (standard humanoid set plus these):

| Bone | Purpose |
|---|---|
| `nimbus` | Parented to `head`, so the engine can pulse it. |
| `hood` | The cowl's hood lying back. |
| `skirt` | The vestment and scapular, cut at the cord. |
| `cord_tails` | The cord's two long tails. |
| `badge` | The lead badge on its cord. |
| `rubric` | The wrist strip. |
| `sleeve_n`, `sleeve_f` | The hanging sleeve bells, pivoted at the sleeve mouth, so the engine can keep them plumb. |
| `stack_*` | One per course stack, so the idle in-breath can brighten each seal. |

The rest pose has no `stack_toxin`: its olive band sits inside the sleeve.

## What the director note changed, and how it is drawn

- **Vestment.**
  - **Shape:** full-length undyed robe in a natural cream-grey fleece; long wide sleeves whose bells hang to the thigh; a cowl lying back over the shoulders with the hood bunched behind the neck; a long scapular of darker undyed fleece, with stitched edges, down the front over the cord.
  - **Folds:** heavy vertical folds, drawn as carved valleys. Each valley is a tapered trough in shadow, crosshatched, with its crease inked and a lit ridge on the side toward the light (upper left).
  - **Worn thin:** shows only as a soft, light translucent edge at the hem, cowl and sleeve mouths. The bare feet show faintly through the hem's thin edge.
  - **Removed:** the patches, darns, frayed hem, threadbare holes, road dust and ink spots.
  - **Cord:** plain, knotted once, with two long even tails ending in small knots.
- **Inks as illumination.** The six inks are translucent deep pigments: vermilion, cold pale blue, burnished ochre-gold, indigo, sick olive, violet-black.
  - The skin is drawn and modelled first: shading, hatching, knuckles, tendons, nails, pads, palm mounts and creases.
  - Each ink is then laid over the skin as a dye, clipped between its rings, at 34 to 50 percent. The palm side takes 0.72 of that, because palm skin holds dye faintly.
  - The form shows through every band, and the skin's light rises back through the dye on lit planes (finger tops, knuckle caps, palm mounts).
  - Every rule line wraps the form as a ring (bowed by the finger's or arm's turn) and is edged with a hairline of gold leaf, with a hair of bare skin under it.
  - Faint script (minims with word gaps) runs within the bands at 1x and disappears at game size.
  - Ink bleeds into the finger-joint creases and the palm lines.
  - Nothing is brighter than the Elementalist's fire.
- **Nimbus.** Behind the head, six arcs, one per ink, in spec order, each broken once more along its length. Each arc is a thin band of dye between gold hairlines, at about 60 percent. There is no glow and there are no rays.
- **Stacks as seals.** Each stack rests on its own band with a gilt seal ring, a soft contact shadow, its own light from the upper left and an ink edge:
  - fire: a bead of fire on a vermilion fingertip
  - frost: rime on the pale-blue finger roots
  - lightning: a raised branching spark on the gold heel of the hand
  - water: a bead of water on the indigo
  - toxin: a ripe swelling on the olive
  - void: a clean-rimmed hole set like a stone low on the violet-black throat. It has no gold ring, so it cannot read as an eye.
- **Pose.** Hieratic: almost frontal at three-quarter, the spine plumb over even, bare, clean feet, shoulders level, head level with the chin a touch raised. Both forearms come out from the elbows at waist height, the hands open with the palms turned out (orans), and the sleeves hang. The silhouette is a tall, still, near-symmetric column with a ringed head and two open hands.
- **Face (pass 4).** Ageless and serene: no gaunt hollows or age lines, the head cropped close like a tonsure.
  - Planes are modelled with soft transitions (radial falloffs held inside the face, no hard flats): forehead, brow ridge, eye socket, cheekbone, the turn from cheek to jaw, the jaw's side plane, a soft nasolabial fold, the upper lip in shade, the chin's lit pad.
  - The mouth is a calm, closed, defined line, with a lit lower lip and a soft crease beneath.
  - The figure's face shade is 0.72; the portrait's is 0.5, so its large face has no hard patch. The eyes have no colour (the iris is the white of the eye with a fine ink rim). A warm (vermilion/gold) and cool (pale blue) light rises into the face from below and in front, clipped to the face. The violet-black stain stops on a gilded rule just under the jaw.
- **Neck (coordinator fix, pass 4).** Shorter, with the head 4 px lower. It is modelled in its own skin first: the lit side, the sternocleidomastoid's lit ridge and shadow, the larynx, the tendon under the jaw, the collarbone notch.
  - The violet-black is then a 45 percent stain over that modelling, not a collar.
  - Its top edge is a ruled, gold-hairlined line just under the jaw; the face and the jaw's underside are bare.
  - The void stack now sits on the side of the neck as a small dark seal with a violet rim lit from the upper left, a clean-rimmed hole and a soft contact shadow.
- **Hands (coordinator fix, pass 4).** `hand6`, a new hand built like the siblings'. It is drawn element by element as skin with the dye laid over each element, so knuckle shading, tendon lines and nail plates show through every band. It has:
  - three tapered phalanges per finger with joint bulges, at different bends finger by finger, each finger with a lit side
  - vermilion fingertips that read as stained skin with nail plates (back view) or pads and the nail's free edge (palm view)
  - band boundaries drawn as ellipses wrapping the finger, thumb or hand, each gold-ruled, with ink pooled in the joint and palm creases
  - knuckle caps with their shadows, extensor tendons and a vein
  - nails on the back view; finger pads and palm creases on the palm view
  - a thenar mound and a thick two-joint thumb
  - in the garth pose, the hand on the breast shows the back view

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| vessel | fixed | pass | fixed | pass | fixed | pass |
| vessel_rest | pass | pass | pass | pass | pass | pass |
| vessel_garth | pass | pass | pass | pass | fixed | pass |
| vessel_portrait | fixed | pass | fixed | n/a | pass | pass |

**1. Head and spine.**
- The spine is plumb from the neck base [298, 284] to the pelvis [298, 474].
- The head centre is 6 px ahead of the neck base (8 px in rest, where the head bows 7 degrees).
- **Fixed:** the neck first rose long behind a high head. The head was lowered 8 px and the neck widened and modelled.
- **Fixed (portrait):** the head was lowered 22 px for the same reason.

**2. Gaze.** Level and forward; nothing is read or held. The badge hangs plumb on its cord over the cowl.

**3. Hands.**
- All hands are open and grip nothing.
- Palms turned out at waist height: the near (right) hand's thumb points toward the body (mirrored), and the far hand's thumb points toward the body as well.
- In the garth pose the near hand lies flat on the breast beside the badge, back toward us, thumb toward the throat.
- **Fixed:** the thumbs first read as fifth fingers. They are now rooted in the thenar, thicker (0.2 of hand length) and shorter.
- **Fixed:** the fingers read spidery. They are now 14 percent thicker and 6 percent shorter, and the hands grew from 74 to 82 px.

**4. Weight.** Even, over both bare feet. The cord's tails and the rubric strip's ends hang plumb, and the sleeve bells hang plumb at rest.

**5. Contact.**
- **Fixed:** the sleeve bells were on the forearm bone and swung out stiff in the pose test. They now have their own bones pivoted at the mouth, and a counter-rotation keeps them plumb, as the pose test shows.
- **Fixed:** the hem covered the feet. It is lifted over the toes, and the feet are planted on the ground line.

**6. Facing and light.** All four face right with kit.base's key light from the upper left.

## Gate 2: style and detail

| Figure | Signature at 190 px | Course marks / Never absent | Grit (need 12) | Layers | Palette | Section 9 | Result |
|---|---|---|---|---|---|---|---|
| vessel | yes. The lightest, tallest, most still figure in the company: a near-symmetric column with a ringed head and two open palms, and hanging sleeves. It reads at once as the most significant figure (`roster.png` at 0.3x, `sil.png`), unlike every hunched sibling. | Six bands in spec order on hands and wrists, the violet-black on the throat to the jaw, six stacks as seals on their bands. No wounds under the stacks, no lightning arcs in the air (the spark lies in the skin), no eye motif. The void seal was moved low and its gilt ring dropped after it read as an eye (fixed). | 16 (list below) | inked skin; linen undertunic (throat, near inner cuff); vestment; cowl and hood; scapular; cord, badge and rubric | Undyed fleece and linen, the six course inks, ink, bone, grey and lead. Gold leaf only on the band rules, the jaw rule, the seal rings and the nimbus edges (holy, per the director note). Red only in the rubric strip; vermilion is the fire ink. | **Remnant:** the Elementalist's face, inks and order, now worn as office instead of burden. **Pushed:** the course mark is the inked skin and the nimbus, which the lore gives her (she holds what the Mother held); no distortion. **Outline:** closed and still, deliberately, for the one hero who carries courses instead of suffering them. **Taken from section 9:** nothing Bloodborne-specific; clergy and relic weight come from Ostium's own abbey. | fixed |
| vessel_rest | yes: the same column and ring, head bowed, lids closed, hands lowered open | five stacks (toxin inside the sleeve) | 15 | same | same | same | pass |
| vessel_garth | yes: the column and ring, one hand on the breast, the other open | six stacks | 16 | same | same | same | pass |
| vessel_portrait | the head in the upper half framed by the nimbus; the near palm raised to us at chest height; all six inks and six stacks read; the cowl a thick rolled edge, pinched where it gathers, casting its shadow onto the breast and shoulders over modelled shoulders (the near one lit, the far one turning into shade) | as the figure | cowl, hood edge, linen, scapular stitching, badge cord knot, badge, loose collar thread, seals, script, gold rules (10 in frame) | skin, linen, vestment, cowl, scapular | same | same | fixed |

**Grit on the figure (16):**
1. The cowl with its thin, soft edge.
2. The hood bunched behind the neck.
3. The scapular with stitched edges.
4. The linen undertunic at the throat.
5. The linen inner cuff at one wrist.
6. The plain cord knotted once.
7. The cord's two even tails with knotted ends.
8. The lead badge.
9. The badge cord, knotted where it once broke.
10. The faded rubric strip with hanging ends.
11. The gilded rules.
12. Script in the bands.
13. Six seals.
14. The six-arc nimbus.
15. The pale ring scar on the far ring finger.
16. The hem's translucency, with the feet faintly through it.

**Fails found and fixed in passes 3 and 4**
- **Hands read as candy gloves.** Fix: deep pigments at 58 to 64 percent, dye mottle, gilded ring rules with a skin gap, ink in the creases, and real hand anatomy.
- **The robe read as a flat tube.** Fix: carved fold valleys with hatching and lit ridges, light and shade pools, the cowl and scapular, and a hem breaking over the feet.
- **The pose read as a coat on a stand.** Fix: replaced by the director's hieratic orans stance.
- **The neck read as a turtleneck.** Fix: shortened, widened, modelled, and turned into a stain.
- **The void stack read as an eye.** Fix: set low, no gilt ring, drawn as a set stone with its own light.
- **Sleeves read as thin cones.** Fix: broad bells with rounded, weighted hems and carved folds.
- **Pass 4 (coordinator, at 2x):**
  - The neck read as an opaque turtleneck with a hole. Fix: skin modelled first, a 45 percent stain with a gold-ruled top under the jaw, and the void as a seal on the side.
  - The hands read as stacked colour-block gloves with tube fingers and red caps. Fix: dye over modelled skin, tapered fingers, nails and pads through the dye, palm mounts and creases, ellipse rules, and skin light through the dye.
  - The face read as flat blotches. Fix: soft-falloff planes, a defined calm mouth with a lit lower lip, and a softer face shade in the portrait.
  - The portrait's cowl and shoulders were a flat cloth area. Fix: a rolled, pinched cowl edge with a cast shadow, and modelled shoulders.
- **The portrait had a long neck, a poncho cowl and a dirty, hatched face.** Fix: lowered head, a smaller cowl with a U front, face hatching off, a bigger raised palm, and forearm shading capped.

## Notes for animation and open items

- **Holds needing IK:**
  - The garth near hand rests flat on the breast. It is a contact hold, so pin it if the torso breathes.
  - The sleeve bells (`sleeve_n`, `sleeve_f`) need a counter-rotation (or a hang constraint) whenever an arm moves, so they stay plumb. The battle pose test uses +28 degrees on `sleeve_f` for a 28-degree arm lift.
- **Idle:** a slow breath. Pulse `nimbus` opacity and the `stack_*` layers on the in-breath; the nimbus is an ink ring, so pulse it as ink, not glow.
- **Attack:** the far open palm pushes toward the foe while the stance holds (pose test). The course crossing to the foe is an engine effect.
- **Pronoun:** "he", the same person as the Elementalist (confirmed by the coordinator, 2026-11-23).
- **Still open:**
  - Path variants (Hearth, Mouth, Whole) are not designed yet; the bible leaves them open.
  - The 14 cards' art was not part of this batch.
  - The garth near sleeve hangs as a narrower bell than the orans sleeves; widen it if Cole wants more mass on that side.
