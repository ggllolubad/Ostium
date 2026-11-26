# Card art: lessons (read before any card art work; add to it after every review)

Every piece of feedback becomes a rule here, so the next input starts from it instead of repeating the mistake. Each lesson names:
- what went wrong, with a card example;
- the cause;
- the rule that prevents it;
- the check that catches it, automated where possible.

## How the loop works

1. **Before work:** read this file, NOTES.md (style rules and the Form checklist) and the brief. Run the checks listed in the Checks section on your output before you report.
2. **After any review** (Cole, the lead, or the independent reviewer): add every new finding as a lesson below, in the format of the existing ones. A finding that repeats an existing lesson means that lesson's check failed: strengthen the check, do not just fix the card.
3. **Prefer checks in code over checks by eye.** A rule that can be measured (an angle, a count, a share, a size) becomes an assertion in the build that fails loudly. Leave a rule to the eye only when it cannot be measured, and then add it to the review checklist.
4. **Report what you learned,** not just what you fixed: which lessons you added and which checks you automated.

## Lessons

### Direction (Cole)
- **L1. Symbol over scene.** The first renders were literal battle scenes. Cause: the art notes were copied as scenes. Rule: show the act, not the exact moment ("a depiction of the act but not EXACTLY it every time", StS2). Check: a card whose note names a foe must not draw that foe.
- **L2. No foes.** The gritty pass added a Drowned Thrall to every hero card, so the cards read as scenes, and the same foe repeated on every one. Rule: hero cards show only the hero mid-act plus ink FX (Cole: "exclude the foes"). Check: in code, no creature rig is drawn on a card.
- **L3. Match the game's grit.** The first passes were clean vector clip-art, flat fills and tidy gradients. Rule: everything is drawn with the figure kit (`kit.base`: cel band, crosshatch, variable outline, wear), on room art, with ink FX. Check: review beside `rigs_li/bulwark/full.webp`; anything cleaner or flatter fails.

### Hero poses
- **L4. Ergonomic grips.** Hook and Drag's swing rotated `hand_n` by 160 degrees, so the Bulwark held the mace with a wrenched wrist. Cause: the weapon was aimed with the wrist. Rule: aim with the shoulder and elbow, keep the wrist within about 45 degrees of the forearm, bend elbows one way only, thumb toward the weapon head. Check: automated. rig.js validates every pose on every figure when it loads (wrist within 45, elbow fold sign and 150 limit, shoulder range, measured per figure in `ARMS`) and throws.
- **L5. Pose variety.** All three Alchemist cards used the same throw, and the four Hexweaver cards were near-identical. Rule: at least 3 act and 2 block poses per calling, chosen by card words, then by id hash. Check: automated. check_poses.js (run first by render.js -all) fails when a calling uses one pose on more than 40% of its hero cards.
- **L6. Blocks read as blocks.** The Alchemist block reused the throw pose, and the Oracle block hit landed on her face. Rule: block poses show a guard, and the hit lands on the guard, never on the face. Check: automated. rig.js fails a block whose hit bone is not in `GUARD`; check_poses.js fails a block hit within 120 figure px of the head joint on any figure.
- **L7. Facing figures.** The Vessel faces the viewer, so its acts read flat. Rule: turn the act across the body and crop tight on the arms. Check: in review, every Vessel card must read at 170 px.

### Objects
- **L8. Read as the thing.** These misread at card size:
  - the bandage end-on read as a cheese wheel and later as "a cylinder with a tail";
  - the suture as a loaf;
  - the stinger as a club;
  - the hood as a rock;
  - the shard as a grey blob;
  - the bellows as a ruler;
  - the cord as scattered bits;
  - the votive hand as a glove on a stick.

  Cause: objects judged at full size only. Rule: an object must be identifiable in a 170 px thumbnail by someone who has not been told what it is. Check: render a thumbnail sheet of every object at 170 px with no labels, and name each one before reading the labels. Any miss fails.
- **L9. Form and perspective** (Cole: "the book's backing is flat even though the pages are tilted up"). Rule: the Form checklist in NOTES.md: one viewpoint, matching ellipses, visible thickness, connected parts, form shading, an agreeing cast shadow. Check: run the Form checklist on every new or changed object, at 2x.
- **L10. Density.** The inkpot, stinger, salt and bowl were plainer than the hourglass. Rule: at least 6 secondary details, plus D.dress wear, on every object. Check: count the details in code where possible (parts beyond the base form); review the rest by eye against the hourglass.
- **L11. Fit and counts.** Wet Hood got a bandage, and "two blades" drew one knife. A note's "Two heroes" also turned a book into two books. Rule: the object follows the card's name, then its note. Counts come from the name or a hand override, never from incidental note words. Check: devices.csv is read row by row after any mapping change.
- **L12. Spread.** The bandage landed on 3 of 40 cards, and the inkpot on 31 of 744. Rule: no object on more than about 20 cards unless the cards are near-identical; object families share their cards. Check: the build prints object counts and fails above the cap without an override.

### Composition and colour
- **L13. Fill the frame.** Objects floated small in an empty lit oval, and half of review3 drew the ledge layout. Rule: StS2 framing (the subject fills the frame, crops off an edge, varies camera and layout); no layout on more than about 30% of object cards; no two cards with the same object and the same framing. Check: the build prints the layout share, and flags the same object with the same layout.
- **L14. No rainbows.** Strike the Ring's five daubs, and later Turn the Ring's gems, read as a rainbow. Rule: course colours pulled toward the course inks, used as marks rather than saturated colour; red only for blood, doom and rubric; gold only on money and holy things. Ruling (Cole, 2026-11-25: "the vessel should be holy yes"): every Vessel card counts as holy, so worn, aged gold is allowed on it (the hand, its bands, the gold hairline), never bright yellow. Check: automated (see Strengthened checks); `GOLD_OBJECTS` plus `card.cls === 'vessel'` is the gold allow-list in objcomp.js.
- **L15. Water layout only for heavy things.** The stinger and the bowl looked wrong half-submerged. Rule: water only for anchor, skull, bell, keg and other heavy objects. Check: an allow-list in code.

### From review 3 (independent reviewer, 43 fails on 46 cards)
- **L16. Crops keep the signature shape.** The anchor lost its crown and read as a cross; the handbell lost its mouth; the brine flask, the alembic's receiver and the bolt rod's base were cropped. Cause: layouts crop by bounding box. Rule: each object declares a `sig` box, and layouts may crop only the rest. Check: the build asserts at least 95% of `sig` is inside the frame with a 20 px margin.
- **L17. Hung things hang.** The chain ended in mid-air on t_coast_glare, bw_k_scourge and or_augury_of_birds, and or_bind had two hang points. Cause: the beam and chain are drawn apart from the object. Rule: only objects with a `hook` anchor may hang, and the chain ends on it. Check: SUITS allows hang only with `hook`; the build asserts the chain end is within 3 px of the hook. Reference: al_red_work.
- **L18. Object FX are ink FX.** Sine-wave steam (hood, broth, staunch, alembic), cartoon flames (brazier, candle, lantern), twig lightning and flat fog. Cause: objects carry their own quick FX. Rule: objects draw FX only through card_kit's ink FX. Check: the build fails if objects*.js emits a constant-width periodic stroke or an FX path not made by K.fx.
- **L19. Counted copies differ.** Magnum Opus drew three identical flasks for three different brews. Rule: copies take their contents from the card text, or at least differ in seed, fill and tilt. Check: the build asserts distinct variants within a count.
- **L20. Show the act, sometimes with a hand.** 44 of 46 object cards were still lifes, and the two hand cards used the same hand. Rule: every object card shows its object mid-act (pouring, cracking, unspooling, flung, bound, swung, pressed), and about a quarter include a hand or forearm from card_figure, with varied entry edges and angles. Check: comps record `act` and `hand`; the build fails if act is under 80% or hand under 20%, or if two hand cards share an edge and an angle within 15 degrees.
- **L21. Art never contradicts the card's state words.** Frozen broth that steams, bloodstained Clean Linen, a freezing sea that stays liquid. Rule: state words set or forbid FX. Check: a table in code (frozen/frost forbids steam and requires rime; clean forbids stains; broken/cracked requires a crack; empty forbids contents); the build fails on a conflict.
- **L22. Void holes vary and show their wall.** All 8 void cards had the same three floating dots. Rule: holes are seeded per card, drawn with D.hole with the wall showing, 1 or 2 of them, in the object or the ground. Check: no two void cards share a hole centre within 40 px; each hole overlaps the object or floor mask.
- **L23. Pick by the card's own noun.** Handbell got a tower bell, Frost Phial a wine bottle, Gold Leaf coins, Augury of Birds a feather, Rat Bag no rats, Hartshorn no horn. Cause: scoring on note nouns. Rule: a noun in the card name wins, and a forced-noun table runs before scoring. Check: the build fails when a name noun from the table or library disagrees with the pick, unless overridden.

### Strengthened checks (after review 3 showed L3, L8, L9 and L11 to L15 failing)
- **L3:** a flatness metric. The share of 16 x 16 tiles in the object mask with luminance std under a threshold calibrated on bulwark/full.webp must not exceed the hero's share plus a margin.
- **L8:** the build writes an unlabelled thumbs170.png. The lead has a fresh reviewer name each object, and a script diffs the names against the object keys. Any miss fails the batch.
- **L9:** per-object ellipse ratios are recorded and asserted (max/min no more than 1.3); ledge contact and a contact shadow are asserted; the book has a single board path.
- **L12 and L13:** checked per batch, not only over 744 cards: a unique (object, variant, layout), at most 2 cards per object, no layout over 30%, the same hand and angle counted as one layout, and the subject bbox at least 35% of the frame.
- **L14:** automated. Saturated hue clusters (S > 0.45, V > 0.35, each over 0.3% of the area): fail at 4 or more. Colour roles are tagged on parts; red or gold in an untagged part fails.
- **L15:** the water allow-list is asserted in SUITS.

### Automated in round 5 (checks.js before rendering, pixchecks.py after; render.js stops on any FAIL and writes checks.txt)
- **Metadata checks** (checks.js, on what every object card records in objcomp.js):
  - L12: at most 2 cards per object and a unique (object, variant, layout) per review batch; at most 20 per object in a full run.
  - L13: layout shares, with each hand edge and 15-degree angle counted as its own layout; subject size.
  - L14: colour roles on every red and gold fill.
  - L15: the water allow-list.
  - L16: signature box inside the frame.
  - L17: hook gap.
  - L18: a scan of objects*.js for the old FX colours.
  - L19: distinct copies.
  - L20: act share, hand share, hand clashes.
  - L21: the state-word table.
  - L22: hole present, and hole centres apart.
  - L23: name noun against the pick.
  - L9: ellipse ratios, and surface contact with a contact shadow.
- **Pixel checks** (pixchecks.py, on the render and on a mask of the `#subj` layer with the hand hidden):
  - L3: flatness against bulwark/full.webp.
  - L14: hue clusters on the card and on the object.
- **Thumbnails:** render.js writes the unlabelled thumbs170.png and its key for L8 on every batch.
- **Left to the eye:** L8 still needs a fresh reviewer to name the thumbnails, and the Form checklist (L9) still needs a review at 2x.
- **Not enforced:** the L20 act check proves that an act FX group was drawn, not that the act reads. A drip counts, and it is the weakest act.

### Hero poses, rig pass (2026-11-25; found while fixing L4 to L7)
- **L24. Two-handed holds stay two-handed.** The Executioner's far hand left the greatsword grip on every pose that moved the sword arm, and the first high parry raised both fists across the hood. Cause: path variants share the calling's rotations, which move one arm only. Rule: a two-handed weapon solves the far arm per pose (`pose.vary`) so the far hand stays on its rest place on the grip and both hands turn together; keep the hands off the face. Check: automated. rig.js fails if the two hands' total turns differ by more than 3 degrees (`TWO_HANDED`); check_poses.js fails if the far hand sits more than 4 px off the grip.
- **L25. Same rotations, different arms.** The base throw values put the Plaguewright's flask at the hip and bent the Apothecary's pour elbow backward; the base book raise lifted the Catalyst's tucked book. Cause: the variants rest their arms at different angles (measured: the Alchemist far upper arm rests at -29, 52 and -11 degrees). Rule: design a pose as target angles, then give each variant whose rest arm differs its own values in `pose.vary`. Check: automated. The L4 validator runs every pose on every figure key with that figure's measured rest arms (`ARMS`, `FIGURES` in rig.js).
- **L26. A pour tips the mouth down.** The flasks are held by the neck, mouth up. The old pour held them level, so nothing could pour, and the base underarm fling pointed the mouth straight down (it would empty before the throw). Cause: the flask was posed by eye with no idea where its mouth pointed. Rule: the mouth's angle is the far forearm's plus a measured offset (+42 base and Transmuter, -51 Apothecary, -73 Plaguewright) plus the wrist; a pour keeps it at least 10 degrees below level, a fling keeps it forward. Check: automated. Poses carry `mouth: [lo, hi]`, which rig.js asserts per variant.
- **L27. Held props stay plumb.** The Transmuter's crucible chain would stand up in the air, and the Chronomancer's and Doomsayer's staffs swung diagonally across body and face. Cause: a prop rigid on the hand bone turns with the whole arm. Rule: the wrist keeps hanging and standing props (crucible, staffs, the hourglass on its ring) near plumb, within the wrist limit; a prop raised on purpose as a guard (the Plaguewright's cane) is listed as free. Check: automated. `PLUMB` in rig.js caps each listed prop's total tilt.
- **L28. Raised arms and props clear the face.** The Elementalist's ward palm, the book lifted to read, the Hexweaver's poppet ward and the Oracle's raised hourglass all crossed the face; the Vessel's reach drew a sleeve across it; after the first fix, Hook and Drag's raised arm and gauntlet still covered most of the great helm (lead review). Cause: the near arm is drawn in front of the head, and in profile the near shoulder sits behind and below the face, so a level arm at shoulder height crosses the chin and an overhead arm crosses the helm unless it is vertical. Rule: a raised near arm comes up ahead of the face from a lowered elbow, or goes straight up behind the face line; props are held ahead of or below the face. Check: automated. check_poses.js records each figure's part polygons per bone, poses them, and fails when any arm, hand or held-prop polygon drawn in front of the head comes within 32 figure px of the figure's face point (`FACE`, read off gridded head renders; 32 is a third of the 94 px head unit, and the closest approved rest drawing sits at 40).
- **L29. Pose words match words, not names.** One cut pose took 57% of Duelist cards: "Executioner" contains "cut", "Bladedancer" contains "dance", "two-handed" matched "two", "boil" matched "oil", "Mirrorhex" matched "mirror", "apothecary" matched "pot", and "set" matched "settle". Cause: pose words were bare substrings tested against notes, which name the paths. Rule: short words use word starts or boundaries, and lookaheads exclude path names. Check: automated. check_poses.js fails if any pose regex matches a calling or path name, and the L5 share check runs before every full render.
- **L30. The act fits the frame at hero scale.** The first overhead mace stood vertical and ran off the top of the card at scale 1.2; the Vessel's raised hand and the Executioner's parry hit also left the frame. Cause: placement tuned on one figure, by eye. Rule: the FX anchor and the head land inside the card on every figure; tall acts lean the trunk into the act instead of shrinking the hero below 1.2. Check: automated. check_poses.js maps each pose on each figure the way placeHero does and fails on any anchor or head within 24 px of the edge.
- **L31. FX points live on the variant's own hand.** The Elementalist flick hung its ink on a fingertip point measured on the base figure, so on the Accumulator the stream started 59 px off the hand. Cause: rest-space points copied across figures whose hands sit elsewhere. Rule: anchor FX on a joint, or on a point of the prop's own bone. Check: automated. check_poses.js fails when a point given on a hand bone sits more than 45 figure px from that hand on any variant.
- **L32. Prop drawings limit poses.** The Elementalist's book is drawn closed with its cover to the camera, so any pose that lifts it to read shows a cover at the face (the "faces the viewer" fault), and 2D rotation cannot turn it. Rule: pose a prop only in ways its drawing supports; a pose that needs another view of the prop (an open book, a book edge-on) needs a figure change first. Ruling (lead, after review): this is a figure logic error, not a card limit; the book is to be redrawn edge-on or open toward its reader in the figure modules, and the rig layers re-exported. Cole approved the fix (2026-11-25, relayed by the coordinator). The edge-on, spine-to-camera book is staged in cards/pending/elementalist_book_fix.py and verified on a copy of the figures; the pose agent did not apply it, because its permission system denied edits to the frozen figure modules and a relayed approval does not change that. Check: by eye until the figure is fixed; the fix is pending until the script is run by someone permitted to edit dirAC.js and worlds/hero_paths_A.js, followed by the render_rig.js exports listed in it.
- **L33. Parts stay joined, and cloth keeps hanging.** On ve_draw_it_out the Vessel's near forearm and hand hung off the belly like a detached piece and the raised far arm became one rectangular sleeve slab with the hand bent at its end; at card size it read as torn limbs. Cause: the Vessel's forearms and far upper arm carry wide sleeves drawn hanging 2.6 to 2.7 times the bone's length below it, and the poses turned those bones 77 to 156 degrees, swinging the hanging cloth up into slabs. Rule: a bone whose drawing hangs well below it turns little in total (parents, torso and lean included): 25 degrees when the cloth hangs a bone length or more, 45 when it hangs half a bone length; on the Vessel one arm acts, the other rests, and the hands carry the gesture. Check: automated, by a geometry proxy on the figure's own part polygons in check_poses.js: the drape limit above, plus a joint cover guard (the share of a 16 px disc at each elbow and wrist covered by the two parts' own drawing may not drop more than 15 points below rest). A screen-length test was not used: a rigid 2D rotation never changes a part's length, so it cannot fail. The cover guard never fires on the current figures, because every joint overlaps round caps (GUIDE section 4); it is there for figures that do not.
- **L34. An overhead blow is shown landing.** Hook and Drag's raised overhead swing either covered the great helm (arm forward of vertical) or ran off the card (arm vertical, mace above it at hero scale). Cause: the swing composition puts the impact on the weapon head, so the head must sit ahead of the figure and inside the frame. Rule: overhead swings are drawn at the end of the chop, weapon driven down ahead of the body, with the swing arc trailing over the top from behind to carry the overhead path. Check: automated through L28 (face) and L30 (frame).

### From round 5 (building the checks: what the checks themselves got wrong)
- **L35. A signature box lives in figure space.** objects4 declared `sig` in each object's own frame, and the composition read it as a figure box. Tilted objects were therefore placed against the wrong box: the rapier held from below filled 6% of the frame. Rule: declare `sig: SB(F, [x0, y0, x1, y1])`; the composition clamps every `sig` to the drawing's own bbox. Check: automated (SB in every objects file; the clamp in objcomp.js).
- **L36. A bounding box must see stroke-drawn bodies.** The ring, the cuffs and the ropes are thick strokes, but `measuredFig` measured polygons only. Turn the Ring was therefore sized on its bezel alone and filled 1% of the frame. Rule: strokes 6 px or wider (opacity at least 0.5) count in the bbox and the parts list. Check: automated in `measuredFig`.
- **L37. Hand out only the layouts an object can fill.** Fixing the 35% rule after placement made tall and thin objects fail on every surface, and the first fix (14% default signature inset, grow until full) cropped the lids off jars and kegs. Rules:
  - allocation offers only layouts whose estimated fill passes (`fillOf`);
  - placement grows toward the fill only while the signature fits;
  - the default signature inset is 6%;
  - a thin subject passes when it runs edge to edge (90% span) and covers 20%, because a bottle or a chain cannot cover 35% without losing its signature (L16).

  Check: automated (L13 in checks.js).
- **L38. One hole, never two, and none drawn into an object.** Two seeded holes side by side, and the hand mirror's own bullet hole, read as a pair of eyes on The Witch's Glass and the handbell. Rules: one seeded hole per card, and objects draw no holes of their own; in a full run only cards with the same object must keep their hole centres 48 px apart. Check: automated (L22).
- **L39. Glare is a halo behind, not a veil over.** The glare act laid pale rays over the reliquary, which read as a cartoon sun and flattened the object below the L3 limit. Rule: glare is a soft bloom with faint dry rays, drawn behind the object. Check: automated through L3.
- **L40. The hand stays at hero scale.** The calling's hand was scaled with the object, so a 1.9x flask got a gauntlet the size of the flask, covering its neck. Rule: hand scale is capped at 3.3. Check: by eye on the hand cards.
- **L41. Forced names come first.** Name nouns still misfired: Wax the Mouth took the candle (wax), Ink Band took the inkpot ("ink" matched first), Steady Hand took the votive hand, and Lens Glare took the beacon. Rule: a forced-name row at the top of NOUNS. Check: automated (L23) plus the devices audit.
- **L42. A full run spreads over families.** The votive hand and the vial each reached 23 of 744 cards. Rule: past 20 cards, an object hands its extra cards to its family (`FAMILY` in objcomp.js); a family swap counts as an override for L23. Check: automated (L12 on the full run).
- **L43. Flatness ignores ink black.** The bell's mouth, holes and door gaps are near-black on purpose, and the first flatness metric counted them as flat fills. Rule: tiles darker than 45 are skipped on the hero and on the cards alike. Recalibrated: hero share 0.13, limit 0.23. Check: pixchecks.py.
- **L44. A hue check must be tested on a known failure.** The L14 spec (S > 0.45, V > 0.35, 0.3% of the card) passed ve_ink_band's six-colour bands, because translucent bands lose saturation. Rule: also test the object mask with S > 0.3, V > 0.25 and bins over 1% of the mask. Calibrated on review 3, it flags the ink bands, the candy bellrope, the three-hue brews and the blue-and-ochre brine flask, and no card the reviewer passed. Check: pixchecks.py.

### From the review-4 blind test (a fresh tester named 38 of 66 thumbnails, 58%; L8 failed)
- **L45. The subject stands off its ground.** The anchors (8, 65), the rapier (27) and the brush (31) sank into the dark blue and purple grounds, and the tester could not see them. Cause: dark iron and ink drawn on dark course washes, with nothing measuring the difference. Rule: a lit rim or a lit value on the subject, or a lighter sky behind a black one (the rooks). Check: automated in pixchecks.py, on a 280 px copy:
  - measure the subject mask, object and hand together;
  - take the mean over the frame of |luminance minus the median of a 7 px ring of ground round the subject|;
  - this "visible mass" must be at least 2.4.

  Calibrated on review 4: it fails 8, 27, 31 and 65, plus the thin misreads. It also fails two cards the tester read: the sword, whose hand was not yet in the mask, and the thin scales.
- **L46. A subject needs mass, not a stick.** The brush (twice), the rapier, the rod, the bell rope, the tongs and the scourge were named "a stick", a "spear", a "pendant" or a "broom". Cause: a long thin object covers almost none of the frame, however long it is. Rule: show the head, guard, bell or ball big, or crop closer (the rapier is now cropped on its swept hilt), or replace the object (L48). Check: automated in pixchecks.py: the object mask alone must cover at least 7% of the frame. On review 4 the misread sticks covered 4 to 6%, and every object that was read covered more.
- **L47. A plank is a board, whatever is on it.** The suture, the wrapped arm, the ink arm and the gold leaf were all a long slab across the frame, and the tester saw a plank, a ruler and a cutting board. Rule: no subject spans the frame as a horizontal slab unless it really is long (blades, staves); give it a distinctive end or shape, or stand it up (the Vessel's palm, raised). Check: automated in pixchecks.py. It fails an object mask that:
  - touches both sides (95% of the width);
  - is 1.8 times as wide as it is tall;
  - fills 40% of its box.

  It catches exactly the four planks of review 4.
- **L48. Replace an object that will not read.** The bandage was read as toilet paper on two cards, the bellows as a broom, the tongs as a pendant, the reliquaries as gravestones, and the stinger as a drill bit or a beehive. Rule: after one honest redraw, if an object still cannot be named at 170 px, replace it for that card with one that reads; the card's meaning decides, not the first choice. Examples:
  - Bandage Roll became surgeon's shears cutting linen.
  - Clean Linen became linen drying on a line.
  - Aff. Hive became the wasp, seen whole.
  - Cauterize became the irons in a brazier.
  - Call the Bolt became the raised hammer.
  - Scatter Ink became ink flung across a scroll.

  The replacements are listed in `READS` in samples.js. Check: the blind test on thumbs170.png, plus L45 to L47 in code.
- **L12, strengthened. Same object, same silhouette.** Six pairs looked identical at thumbnail size: the clocks, the jars, the reliquaries, the bandages, the brushes and the anchors. The (object, variant, layout) uniqueness check passed every one. Rule: two cards with the same object in one batch must differ in silhouette; better, cards that land side by side get different objects. Check: automated in pixchecks.py: same-object masks must have an IoU under 0.5. Review 4's identical pairs measured 0.61 to 0.98, and the check catches 4 of the 6. The brush and anchor pairs differed in layout and failed on L45 and L46 instead.
- **Vessel objects** (Cole: most Vessel cards become object cards; holy, worn gold allowed):
  - **Held courses:** the Vessel's own raised palm, from its figure, with the six inks banded at the wrist and a gilt hairline.
  - **Take:** an offering bowl with the six inks pooled.
  - **Give and the Mouth:** a pouring ewer.
  - **Mouth:** a gilt chalice.
  - **Even:** a balance with six seal-stamped weights.
  - **Whole:** an illuminated initial; a seal matrix beside its fresh seal; a reliquary casket.
  - **Hearth:** a stone hearth with fire; an hour candle; the mantle (hood).

  The Vessel's cards pick these by their words (`VESSEL_WORDS` in objcomp.js). vessel_hero_ids.txt (from the pose agent) lists the cards that stay hero cards.

### From the review-5 blind test (29 of 41, 71%)
- **L49. Dark on a dark cool ground.** The held vial on blue (13), the crossed mirrors (21) and the two bells (22) on purple sank into the ground, yet passed L45: their visible mass was large enough, but their mean value sat within 3 to 20 of the ground. Rule: on the cool grounds (water, frost, void, lightning), the light pool is lifted and the subject is back-lit. The back-light is a soft pale glow round its silhouette (`kBack` in objcomp.js), and it is left out of the masks the checks measure. Check: automated in pixchecks.py. Where the ground ring is blue or purple (hue 170 to 320), the subject's mean luminance must differ from the ring's median by 22 or more. On review 5 it fails 13, 21 and 22. It also failed the birds and the hourglass, both read but dark, which are lit since.
- **L50. A hand on a long thin thing is still a stick.** The gauntlet holding the rapier read as a poker or a syringe, and holding the scourge as needles or a brush: the hand adds mass but not a name. Rule: show the distinctive part close, with no hand. The rapier is now the swept hilt alone, cropped close (`zoom`); the scourge is now its weighted thongs fanning out. Or choose another subject. Check: L46 on the object without the hand, plus the blind test.
- **L51. Sets read worse than one.** Two mirrors, two bells, a set of seals and a bowl of six pools were read as pans, boots, a pepper and a palette. Rule: draw one object and show the count as marks on it (six seals hanging from one charter), or two objects clearly separated and lit. Toll of Bells and Crossed Glass now draw one. Check: the blind test; L12's silhouette check covers same-object pairs across cards only.
- **L52. Retire a misread object for the whole deck.** The blind tests replaced objects card by card, but 70 more cards still drew the bandage, brush, rod, stinger, offering bowl and others. Rule: an object retired after a blind test redirects every card that picks it to its replacement. The table is `RETIRED` in objcomp.js: bandage to shears, wrapped to basin, suture to knife, stinger to wasp, bell rope to handbell, tongs to brazier, rod to hammer, brush to scroll, offering bowl to chalice, alembic to vial, urn to flask, bellows to flask, brass vessel to jar, seal to charter, lens to spectacles, and the splint and tourniquet to the knife and basin. A retirement counts as an override for L23, and family spreading never hands a card to a retired object. Check: automated (the pick); the full run's L12 cap.
- **Fixed in place:**
  - broth: no icicles, which read as fangs; an ice skin and rime on the rim instead
  - anchor: a short thick stock and spade flukes, which had read as a crossbow
  - handbell: held upright, never turned (`NO_TURN`)
  - brazier: a deep basket, not a grill
  - initial: a page with a rolled foot, not a tile
  - the Vessel's palm: comes out of a sleeve, with dark ink bands, so it no longer looks severed
  - inkpot: a squat inkwell with a big white quill
  - cord: one thick knot with tassels and a red binding
  - feather: a solid vane with two splits
  - rope: a thick, light coil
  - purse and boot: leather grain, for L3

### From the review-6 blind test (26 of 32, 81%)
- **L53. The held object outweighs the hand.** A gauntlet holding the flask (Saint's Ash) and the vial (Refill) read as "a gauntlet holding a sack or bag"; the hand took the card. Rules:
  - small round or squat things are never held: the flask, vial, phial and jar have no grip;
  - a hand card's object must show at least as much area as the hand.

  Check: automated in pixchecks.py. render.js writes a hand-only mask (`_hand.png`), and the object's visible area (its mask minus the hand) must be at least the hand's. Not yet calibrated on the two failures, because those objects can no longer be held; on review 7 it passes every hand card.
- **L54. Brown on brown reads worst.** The purse, sack and boot, and the held flask and vial, were near-unreadable on the sepia ground. Rule: an object whose mean fill is a warm brown gets the cool slate ground on the physical, fire and toxin courses, with the lifted pool and back-light of L49. A pale subject (paper, linen) keeps a dark ground, because lifting the pool behind it sinks it. Check: automated in pixchecks.py. Where the ground ring is warm (hue 8 to 55) and so is the subject (within 25 degrees), the subject's mean must clear the ground by 30. On review 6 it fails the five brown-on-brown cards, and eight cards the tester still read. The slate ground fixes all of them.
- **L55. A silhouette reads as its best-known object.**
  - A squat dark pot with a feather above read as a helm with a plume.
  - A coil read as a whip unless its end shows (a hook, a knot).
  - A small round brown thing read as a sack; a scored square brown one as a loaf.
  - Three cords ending in balls read as bolas.

  Rule: before drawing, name the object the silhouette most resembles; if it is not the intended one, change the silhouette. Examples: the rope is now a grappling hook lying on its coil, the purse a drawstring pouch with a frilled mouth, the inkpot is retired to the scroll, and the scourge to the barbs. Check: the blind test (not automatable).
- **L56. One object per card.** The beads under the charter, the coins under the purse, the star-chart card tied to the hourglass, the key's paper tag and the hammer's wedge split attention as a second object. Rule: no secondary props; a count is shown on the object itself (the charter's seals now sit on its foot). Check: automated in pixchecks.py. The object mask is closed by one pixel, so thin cords and bridges still join; any parts apart from the largest must hold under 5% of it. The bone, drawn snapped in two, would fail this and needs a joined drawing before it is used again.
- **L12, again: repeats in a batch.** The redirected cards bring pairs of the same object into one batch. In review batches (not full runs), a repeat is turned (where it stands on nothing), set off-centre, cropped closer and mirrored on a surface; the charter's repeat is the tall sheet. Silhouette IoU must stay under 0.5. Caveat: this variety depends on the batch, so a full run (-all) draws repeats unvaried, as the rest of the per-batch allocation already does.

### Before the review-7 blind test
- **L57. Review art is production art.** Since round 5 the allocator handed out layouts, variants, hand angles, hole positions and (in round 8) repeat framing per batch. The same card therefore rendered differently alone, in a review batch and in the full `-all` run, so a blind score measured art that would not ship. Cause: uniqueness and shares were enforced by changing cards to fit the batch. Rules:
  - every object card's plan comes from a hash of its own id and object (`planOf` in objcomp.js): layout, variant, hand angle and one of eight framing styles (offset, crop, turn, mirror);
  - void holes are seeded by the card alone;
  - the family spread (L42) is computed once over the whole deck, never over a batch;
  - the batch checks verify the result and change nothing. Where two same-object cards in a review batch still come out alike, the fix is a per-card override (`style`, `layout`) in samples.js, which is the same in every batch.
  - As a result, two checks are narrowed to cards with the same object: the hand-clash check (L20; angles are hashed per card) and the hole-centre check (L22, review batches only; a full run checks only that each void card has a hole).

  Check: automated. check_determinism.js rebuilds a sample of the batch, each card alone in a fresh node process, and compares the SVG byte for byte with the one the batch render wrote; render.js runs it on every review batch, which fails on any difference. On review 7: 10 of 10 match in the render's own check, and all 30 match when run by hand.

### The variety pass (object-variety agent, 2026-11-25; objects6.js to objects11.js, picks.json)
- **L58. Legible is not enough: each card needs its own picture.** After review 7 the deck read at 93%, but 466 object cards drew on 68 objects: 20 Alchemist vials, 20 Vessel chalices, 16 Elementalist scrolls, 11 Hexweaver bells, 25 Bulwark doors once the hero cards were re-routed. Two cards of one calling with one object look like the same picture at 162 x 86. Cause: objects were picked by family default (a calling's object, a course's object) and the cap (L12) was 20 per object across the deck. Rules:
  - within a calling, the shared pool and each world, no object on more than 3 object cards; a calling's listed signature object (`SIGNATURE` in checks.js: chalice, flask, poppet, hourglass, shield) may take 4;
  - pick each card's object from the card itself, its name first ("Tasting Spoon" gets the spoon, "Pass Through" the funnel, "Keep Her Quiet" the padlock, "Skipped Tooth" a cog with a missing tooth), so the name can be guessed from the picture; per-card picks live in picks.json;
  - grow the library from the game's world (abbey, apothecary, scriptorium, reliquary, foundry, crypt) rather than reusing a near fit: 151 new objects;
  - leave headroom for re-routed cards: aim at 1 or 2 uses.

  Check: automated. checks.js L58 counts every object card in the deck by `card.cls` on every run (a review batch answers for its own callings; a full run for all). Before: 31 objects over the cap. After: 590 object cards (with the 127 re-routed hero cards) on 411 calling-objects, used 266 x1, 114 x2, 28 x3, 3 x4 (signatures), none over.
- **L59. A process-wide counter breaks L57.** ve_even_breath rendered differently alone and in its batch: `billow()` in card_kit.js named its clip path from a module-level counter, so the id depended on how many billows the process had drawn before (it showed up when the variety objects started using the `blow` act). Rule: an SVG id is derived from the thing it names (the billow's own phase and centre), never from a running count; any helper with module state is a determinism bug. Check: automated by L57 (check_determinism.js); also `grep -n "N++" card_kit.js` before adding an id helper.
- **L62. A per-card layout drops the per-card style.** picks with both `layout` and `style` silently lost the style (objcomp keeps only layout, variant and hand angle when `layout` or `zoom` is set), so two held books still came out alike. Rule: to separate two same-object cards that share a forced layout, use `flip` (honoured with any layout) or a different layout, not `style`. Check: by the L12 uniqueness check (it caught deaths_ledger/blood_debt); the variety pass lists any pick carrying both.
- **L63. Hands come from grips, and walls have none.** Each calling still needs 20% of object cards in a hand (L20), and several new objects are wall-like (door hardware, portcullis, icicles) or furniture, so the Bulwark fell to 9% hands and 45% close-ups. Rule: carried things get a `grip` where a hand would really hold them (a bucket's bail, a basket's handle, a censer's ring, a stem, a cuff, a staff), a held pick only goes on an object with a grip and with `held` in its layouts, and NO_TURN objects (handbell, lantern, candle) are held on at most one card per calling, since every held copy enters at the same angle (L20 clash). Check: automated by L20 and L13 per calling batch.
- **L64. Big smooth fills read flat, even when hatched on the shadow side.** The cauldron, kettle, glass vessels, the dropper, the bandolier and the diptych's panels failed L3 (0.24 to 0.42): their bodies were single fills with hatching only down one side. Rule: every large part carries an even ground of fine dashed grain over its whole area (`grain()` in objects6.js), dark ink on light parts and pale lines on dark ones, besides the form arcs (`arcs()`) and shadow hatching (`shadeR()`). Glass keeps a low texture so it still reads as glass. Check: automated by L3 (pixchecks.py).
- **L65. The brown-subject test misses brown things with grey parts.** The flash pan (bronze with grey powder) and the roemer averaged to a grey mean fill, so they kept the warm ground and failed L54 at 1 to 3. Rule: a per-card `slate: true` in picks.json forces the cool slate ground (objcomp honours `o.slate`); a `ground` override does not, because it switches the slate off. Check: automated by L54.
- **L68. A shared module is load-bearing for every agent.** A precedence slip in objcomp.js (`a ?? b || c`) was a syntax error for about a minute, and every render started in that window, this agent's queued batches and possibly the hero agent's, died on load. Rule: edit a shared module (card_kit.js, objcomp.js, samples.js, checks.js, render.js) with a script, then run `node -e "require('./samples')"` at once, before any render or long job; use explicit parentheses when mixing `??` with `||`. Check: the require smoke test after every shared edit (by hand; a render fails loudly, but late).
- **L69. Attuned object cards carry their course as a shape, large.** el_scatter_ink's six variants differed by 7 in colour and 0.01 to 0.06 in greyscale: the object (a scroll) ignores the course, and its course marks were small specks, so the variants differed only in tint. Rules (with L60 and L61):
  - on an attuned object card the course leaves the object and lands beside it as its element (element_fx `stroke` and `impact` at R 104, in the `.cfx` layer);
  - on void the landing is the card's one hole (L38);
  - the slate ground keeps half the course wash, and a pale subject gets a darker, fully tinted ground;
  - prefer objects that hold or throw ink (nib, quill, shell, sigil stone, inkhorn, inkwell, reservoir).

  Also, render.js hid the `.cfx` layer while it masked an object, so every object card's `_fx.png` came out empty and L61 read "no FX layers"; the FX capture now shows `.cfx` again. Check: automated by attuned_check.py (L60, L61). el_scatter_ink: closest colour pair 12.3, FX greyscale min 0.42.
- **L70. Look-alikes under different names count together** (the coordinator's "L66, visual look-alikes"; renumbered, since L66 is the hero agent's). The variety blind tests read Vessel 93% and Alchemist 87%, but the matching tests read only 44% and 38%. The testers could name each object, yet could not tell which of four scales, four bells, two horns, three pitchers, the glowing round flasks, the furnaces or the stills went with which name. The name-based cap (L58) counted weights and scales, bell and handbell, still and retort as different things. Rules:
  - objects that read alike at card size form a family (`FAMILIES` in checks.js: scales, bell, horn, cup, furnace, still, round flask, slim bottle, pot, pitcher, knife, sword, bowl, book, sheet, lamp, torch, door);
  - per calling, at most 3 cards per family (4 when it holds the calling's signature), and at most 2 cards of one rarity in any family or object;
  - lookalike.py is a pixel backstop: bounding-box-aligned silhouettes at 48 x 48 with IoU 0.9 or more and a matching aspect ratio and hue are clustered, with the same caps. Calibrated on the variety sheets: the clones the testers named (two yokes 0.97, two handbells 0.98, the weights 0.90) reach 0.9. At 0.85, round things of different kinds (an initial, an eye, a wheel, an astrolabe) chained together, and at 0.5 every round object chained into one cluster of 71 to 88 cards. A silhouette metric cannot see kinds, so the family table carries the rule and the pixels only catch clones.

  Check: automated (checks.js L70 deck-wide; lookalike.py on every review batch).
- **L71. What made the blind misreads** (variety tests, Vessel and Alchemist):
  - a small round or oblong object held at an angle in a gauntlet loses its outline (warming pan, aspergillum, mirror read as a magnifying glass, oil lamp);
  - round brown vessels with no feature blur together (fire pot, gourd, onion bottle): a label, handle, liquid line or flame is what makes a container read;
  - a glare halo flattens the shape (ampoule, decanter, athanor);
  - an object read as its best-known neighbour (L55): the albarello as a bound cylinder, a clay watering pot as a plain pot, a flat clay lamp as a wooden thing, a single antler as a dead branch, the spade as a plunger, the crock as a mug, a ewer as a watering can.

  Rules:
  - draw the best-known silhouette: the watering can with spout and rose, the brass lamp with spout and lid, antlers on their skull plate, a fire pot as an open pot full of flame, a powder pot as a black bomb with a fuse;
  - drop the hand, or show the object large and upright;
  - no glare act on glass;
  - for abstract names, picture the meaning, not the calling's default: Panacea a unicorn horn, Quintessence a fifth phial apart from four, Second Dose a measuring spoon with two scored lines, The Great Work the philosophers' egg, Haste Draught an hourglass, Clarity Draught spectacles, Stand Near the hearth.

  Check: the blind and matching tests (fresh agents); L70 for the look-alikes.
- **L72. One object per card within a calling** (matching tests after the variety re-render, 2026-11-26). The blind test passed: Vessel 88 of 88, Alchemist about 90 of 94. Matching still failed: Vessel 47% and Alchemist 37% on the current names, and 47% and 45% on the proposed names. Split by object:
  - cards whose object no other card in the calling used matched at 56% (Vessel) and 61% (Alchemist);
  - cards that shared an object matched at only 37% and 36%.

  Both readers said the same thing. Twins are one object on two cards, differing only in ground, hand or the corner element icon, and readers split their names by coin flip. 40 of 88 Vessel cards and 58 of 94 Alchemist cards were twins under the cap of 3.

  Rules:
  - within a calling, the shared pool and each world, every object card shows its own object. The cap is 1 and there is no signature exception.
  - Two cards may share an object only as declared twins whose names are a pair and whose pictures show the difference (Tasting Spoon, one spoon, against Spoonful, two spoons for the second dose; Hourglass, upright, against Turned Glass, caught mid-turn).
    - picks.json marks both cards with `twin` (the other id) and `shows` (the difference in words).
    - The two picks must differ in `objOpt`, `count`, `act` or `ang`.
    - Ground, room, hand, framing and the corner element icon are not differences.
  - A token that copies a card (`t_<id>` beside `<id>`) is that card.
  - Draw to the name. Where the proposed name (renames.csv, picture column) names an object, the card shows that object (Pentecost tongues of flame, Last Rites the oil stock, Plague Pit the lime pit, Blowfly the fly).
    - The old pick stays in picks.json as `_was`, so a pick is easy to switch back if a rename is refused.
  - Objects are shared across callings freely: the bellows serve the Vessel's Draw Breath and the Alchemist's Foul Bellows, the spigot the Vessel's Conduit and the Elementalist's Sluice.
  - The look-alike families (L70) stay at 3 per calling, each card on its own object. alembic joins the stills, greatbell the bells, and hand and palm form a family. The fire pot left the pots once it was drawn as an open pot of flame.
  - A drawn flame is part of the object (objects12.js `flame`), with a pale core. A fxReq flame is a dry-brush wisp and did not show on the Vessel's torch at card size. A saturated yellow core counts as gold (L14).
  - Object files load in numeric order (objects6.js before objects12.js). A later part's redraw of a key wins; lexical order had let objects7's torch override its redraw in objects12.
  - Reaching into the old library for more objects shows why some were never picked. Several were scattered sets that fail L56: knucklebones, a pile of coins, a flock of birds, an anvil with its hammer apart, a wax seal beside its stamp. Others were thin sticks that fail L46: chain, needle, bell rope, rowan cross, tongs. The fixes:
    - draw one connected object: knucklebones heaped on a cloth, one raven, manacles, the stamp standing in its seal;
    - or redraw an old key that no card uses (crucible, alembic, coal pan).
  - Twins must differ at thumbnail size, not just in the data. The first spoon twin, empty against two scored lines, read as two plain spoons. A brimming spoon then broke L21, since the card text says the flask is empty. Spoonful now shows two spoons (`objOpt `pair`, two spoons crossed in one object; two loose copies failed L56).

  Check: automated (checks.js L72, deck-wide on every run, failing the batch on its own groups); then the matching test.

### Hero cards, round 9 (hero-card agent, 2026-11-25; hero_routes.js, hero_staging.js, hero_comp.js, element_fx.js)
- **L66. Each hero card is its own picture.** All 280 hero cards rendered as one figure per calling in three act and two block poses, small in the left third of the same room, with the same ink stream and splat. bw_aegis_of_the_door, bw_brace, bw_close_ranks, bw_dig_in and bw_draw_their_eyes were one image; bw_bound_with_rope showed no rope. At 162 x 86 a calling read as one picture repeated 50 times. Cause: the hero went on every attack, cast and block, and the pose table decided the picture. Rules:
  - A card earns its hero only when the act is the point. 127 of the 280 cards went to objects (hero_routes.OBJ, each with its reason, listed in reroutes.json), so 152 heroes remain (20.4% of 746). Attacks stay heroes, except where the name names the object (Drain the Bowl, Weigh the Wound, Lancet, the Illuminated Initial).
  - Every hero card carries its own motif from its name or note (rope, barbs, tally, threads, bones, sand, frost, a ringing bell), drawn as the prop or the FX, and one FX per mechanic, never a stray blob.
  - Five framings (full, three-quarter, close on hand and weapon, low angle, over the shoulder), a placement, a pose and a room view are allocated once over the whole deck (hero_alloc.json, so L57 holds). The allocation is greedy plus repair on a 64 x 35 raster of the figure's own part polygons, which tracks the rendered masks closely (r 0.997, mean difference -0.02). Pairs a render shows to read alike go on the separation list (hero_separate.json) and are kept out of one framing.
  - 31 new poses (hero_staging.POSES) pass every rig check on every figure. Two new checks cover them: a leg rule (a knee bends one way, 0 to 140 degrees; the hip stays in range) and a frame rule (each framing must offer a placement that keeps the act on the card and the face whole or wholly out).

  Check: automated, herosim.py (render.js runs it on every batch with hero cards). Hero pairs of a calling fail when their figure masks overlap at IoU 0.5 or more (the L12 bar), or when their band-pass grey pictures at 64 x 35 come within 0.55 of each other. Calibrated on build/emblem2/all: the five cards above measured IoU 0.76 to 1.00 across all ten pairs, and every one of the 279 hero cards had a twin. No two object cards that passed blind tests 5 to 7 come closer than 0.514. The L5 pose shares now count the pose each staged card is drawn in.

  Three things the loop itself taught:
  - A predictor must be checked against the render it predicts. The allocator's raster tested only pixel centres and under-read overlaps by about 0.06 on small figures. Pairs it placed at 0.44 rendered at 0.52. Counting a cell when any of five sample points falls inside brought it to r 0.998 against the rendered masks.
  - Measured feedback beats hand tuning. Pairs a render shows alike go to hero_separate.json, measured FX cover goes to hero_fxscale.json (`attuned_check.py --fxscale`), and both feed the next allocation and drawing.
  - Packing has a price. The Bulwark's door fills any close crop, so 23 of its 31 hero cards ended up in full framing, at varied heights on a stone ledge.
- **L60. An attuned card shows its element, and its six variants must read apart.** The game now loads `<id>_<element>.jpg` for the element the hero is attuned to. Rules:
  - `<id>~<course>` builds the base card under its base id, with only the course changed, so it is deterministic under L57; render.js writes it as `<id>_<course>.jpg`.
  - The base art is the starting element (data/heroes.json, which is fire), and an attuned card's room follows its course.
  - The Elementalist's course ink pulls only 0.3 toward black (`K.courseInk(course, { attuned: true })`, `ATTUNED_PULL`), not rule 7's 0.6 to 0.74. At 0.62 the ink is near-black and frost and water read alike; at 0.25 to 0.3 the element's colour shows and still reads as ink.

  Check: automated, attuned_check.py (render.js runs it on batches with variants or element cards). The six variants must differ pairwise by CIE76 12 or more, either in ground colour (the median) or in ink colour (the 4% most chromatic pixels), at 162 x 86. Calibrated on el_ink_bolt, el_heavy_pour and el_scatter_ink: at pull 0.62 el_ink_bolt frost/water measured 10.1 and failed; at 0.25 it passed at 13.6. el_scatter_ink failed at every pull (fire/void 6.5), because its slate ground (L54) erased the course, which is the object agent's fix.
- **L61. An element is a shape, not a hue.** Cole on the attuned strips: "fire reads more like blood, i want them to look like that ELEMENT not just that color". Cause: every course FX was the same ink stroke and splat, recoloured. A first fix (ink for the first third of the stroke, the element after) was corrected by Cole: "the WHOLE projectile should be the elemental effect, so the fire should look like it's shooting out bits of flame and fire and the ice should look like a stream of ice shards". Rule: from the moment it leaves the hand or nib, the projectile is the element; the ink lives in the drawing (woodcut line and hatching), never in a liquid stroke leading in. Pours, breath, sprays and rays follow the same rule (element_fx.js `stroke`, `impact`, `pour`). No glows:
  - fire: a gout of flame tongues and fire bits along the path, thickest at the hand, with a smoke trail and embers; it lands as an orange-ochre flame mass with a lighter core and woodcut strokes in each tongue, a dark smoke plume and a char ring, and the pour lands as a burning pool; never a round splat;
  - frost: a stream of angular ice splinters with cold vapour and specks, landing as an irregular shard cluster with a rime crust and icicles, never a radial snowflake (rule 8: no clean crystals);
  - lightning: the bolt itself, forked, from the hand to the target, with a burnt branching scar;
  - water: a jet with a dark underside, a light core and droplets, cresting as it hits, and a pooled spill;
  - toxin: a rolling dark-edged grey-green fume cloud with spatters along the whole path, with mould blotches where it lands (a ring and dot read as an eye);
  - void: a ragged dark rift travelling along the path, its lips lit and the air hatched in toward it, ending in one bored hole with its wall showing.

  The element takes 15 to 25% of the frame on a cast, sized by the frame (not the figure), so it reads at 162 x 86. It never lands on the face (L28): the impact moves clear, and the build throws if it cannot (it caught el_ink_dart).

  Check: automated, attuned_check.py:
  - FX layer: each card's FX layer is rendered alone (`_fx.png`, the `.cfx` groups) and compared in greyscale between variants, by band-pass distance at 64 x 35, which must be 0.33 or more. The old recolour fell to 0.06 (a fire pour and a water pour are one shape); the whole-projectile element shapes measure 0.37 and up (median 0.98) on the hero strip cards.
  - Whole card: whole-card greyscale cannot carry this test, because the figure and room dominate it. It is used only for cards with no FX layer, at 0.12.
  - Size: a cast card's element layer must cover 15 to 30% of the frame. At the first roll-out it measured 5 to 22% and failed; one pass later the void hole took half the frame (up to 48% on close crops); it now sits at 16 to 27%.
  - Symmetry, a floor only. Each impact is rendered alone (`_imp.png`, the `.cimp` groups). Its main mass must not match itself flipped, turned half a turn or turned by 360/n at IoU 0.7 or more. Void is exempt, because its hole is an ellipse by rule. This caught a toxin cloud built as a symmetric row of billows (0.75; the cloud now rolls with its travel). It would not have caught the two mistakes Cole's review found, so these two were made into checks:
    - Fire evenness: the first fire impact was a row of even triangles (a picket fence, a crown). Over the largest flame mass, a top edge with 3 or more peaks must vary in peak height (CV 0.25 or more) and in spacing (CV 0.25 or more). The picket measured 0.21 and 0.23 and fails; the redrawn licking flames pass. On the first roll-out it also failed four flames that ran off the top of a close crop, where the frame edge cut them to one height. An impact now keeps room above for its tongues.
    - Frost rays: the first frost impact was a starburst. Its ice spikes (peaks of the radial extent of the pale ice round the centroid) must vary in length (CV 0.2 or more), and with 5 or more rays their angular gaps must be uneven (CV 0.3 or more). The starburst measured a length CV of 0.17 and fails. Its gaps were already uneven (0.70), so the angular-gap test proposed first would have missed it.
  - The habit this lesson records: when an eye finds a mistake that the checks passed, calibrate a measure on the kept bad render and on the fix, and keep it only if it fails the one and passes the other.
  - A measure can be wrong too. The first fire measure read a column with no flame as a peak the height of the frame (numpy's argmax of an empty column is 0), and it flagged good fires at random for three rounds. It was found by drawing the mask with the detected peaks over it. Rule: look at what a new measure sees on one card before trusting its numbers. The flames are now placed by their tips (what the measure and the eye read), not by their bases.
  - Round 10 (the coordinator's eye review of the strips): the element shapes were still emblems of the element. What changed, and what each fix taught:
    - Fire was a row of standing teardrops. It is now a jet that widens from the hand with licks peeling off its top, and a burst thrown out in a fan from a hot core (element_fx `flameJet`, `fireBurst`). The fan leans the way the throw went and its far tongues run longer: a fan centred straight up is its own mirror, and Strike Across measured 0.70 on the symmetry floor until it leaned. Fire evenness is information only now: there is no row of standing flames left for it to read.
    - Water was a crown of cones, as pointed as the frost. It is now a wave curl with a foam edge, a low crown whose tips end in round beads, and round droplets (`waterCurl`). The coordinator asked for a water against frost greyscale check; L61 already compares all 15 element pairs, water and frost included, and they passed at 0.41 or more, so the missing check was a shape one. Water roundness: over the impact's top edge, peaks are scored by prominence over their width at half prominence, and water fails with 2 or more peaks of 1.5 or more. Calibrated on the kept cones in `_heroes/elem_r9` (Heavy Pour 2 spikes at 3.7 and 4.6, Ink Bolt 2 at 4.2 and 1.7, both fail) against the curl (no peak over 1.5).
    - Toxin was a bushy outlined cloud. It is now a see-through fume with no outline, read by long dry-brush wisps of a sickly lit green drifting off it and a darker belly, with ooze hanging from it, dropping, and pooling on the floor (`fumeCloud`, `ooze`). Two wrong turns: the dark fume alone vanished on the green rooms at strip size, and lighter blob crowns on each lobe read as bushes. Wisps carry the tone without an outline. The pool was drawn under the hit, so a high hit left it floating; it now lands on the floor line.
    - Frost: the splinters keep clear of the face by the spread of the whole heap, not its centre. A frost heap at the frame edge was the hardest case. A splinter the edge cuts ends at the edge, and cut tips read as rays of one length (Heavy Pour, length CV 0.07). What failed, in order:
      - setting the lengths by hand made the heap swallow the figure;
      - turning cut splinters until they fit sent every long one straight up on a floor hit, and Backdraft's heap became two even spikes (0.76 on the symmetry floor);
      - shortening alone left an edge heap small and even (Ink Bolt cover 0.09).

      What holds now:
      - the impact keeps 1.5 R of room from the frame sides and top (hero_comp);
      - a splinter turns up to 7 steps, either way first at random, then is shortened by a random share of its room;
      - a hit on the floor sends half its splinters up and half skidding forward low;
      - the long tier is set uneven (one long, the rest stepping down) and springs from near the hit;
      - the rime crust lies see-through under the heap (as solid white it measured as two more rays along the floor).

      The ray measure stays noisy on heaps of 4 or 5 rays: it sits near its 0.2 floor on some heaps that read as heaps by eye.
    - Void: a purple-black tendril from the hand into the hole, not a red line, on every calling (the Oracle's red thread is its own doom, not void).
    - Water, second pass (the coordinator's eye): the foam marks were paired arcs ("m" chevrons) and read as seagulls, and the body was one flat blue tube that could read as a tentacle or a slide. Foam is now broken single crests curling over along the lip with spray dots, and the body carries a lighter band and thin streaks running with the flow. Rule: never draw foam, spray or sparks as a repeated paired mark; a pair of arcs is a bird.
    - Water, third pass (round 12): five frayed strands fanned from one point at the jet's end drew a little stick figure at the wave's tip, and pale flow lines crossing the white foam drew more. The strands are gone, flow lines are mid-blue, and crest curls go only where the crest runs across, never on top of each other. Check (attuned_check.py): a pale spray component that fails has all of these:
      - 4 or more skeleton ends and a branch point;
      - strokes 12 px wide or less;
      - 40 px or more across;
      - no more than 1.8 times as long as wide.
      Bead clumps and hooked crests pass.
    - The "spark" motif drew an ink bolt from the act point, outside the element's face margin, and on Sigil Flick it left the mouth. On an element card the element is the spark; elsewhere the motif keeps 120 px from the face. A flicked lightning bolt goes straight.
    - Lightning keeps the face margin by its forks, not its line: its spread is 4.5 stroke widths (it was 1.6), because Sigil Flick's bolt started at the mouth.
    - Size: a cast with its act at the right edge had no room to throw (Spend the Breath at 4%, even with a 1.6 size factor). The allocator now charges a cast whose act sits within 330 px of the right edge. The measured size factors are kept per variant (`<id>~<course>`) as well as per card.
- **L67. Every hero card carries a name cue, and the cue lives in the scene.** The first hero matching test read 11 of 53 (21%). Every Bulwark card had the mace and the door, and every Oracle card had the hourglass and the hole, so nothing in a picture pointed at its name.
  - Rule: each hero card carries one cue a reader can tie to its final name. It can be an object, a state, a setting or an action. The cues are kept in hero_cues.json as `{name, cue, mode, why}`, and no two cards of a calling share one.
  - Where the cue lives (the coordinator's rule): it is part of the scene, never a badge. The first pass drew every cue in a lit disc in the clearest corner, and the discs read as UI stickers pasted on the picture.
  - A cue now has one of five modes (hero_cues.js `stage`):
    - held in the hero's off hand (the inkpot for Ink Bolt, the jug for Full Measure);
    - part of the act's effect at the hand (two streams meeting for Conflux, the cast bouncing back at the caster for Backlash);
    - standing on the floor line behind the figure (the furnace for Backdraft, the bell tower for Alarum, cracks under the blow for Brunt);
    - hanging from the top of the frame (a noose, a pendulum, a curtain);
    - weather across the scene (rain for Deluge, hail for Hailstone, a falling star reaching the ground for Cold Star).
  - Architecture is drawn at its own size, not a token's: the first bell tower was a pale pill. A dark object takes a crisp lit edge up and to the left. This is an offset copy with no blur, so it reads as an edge and never as a halo.
  - Names with no drawable object use the action or the effect, and hero_cues.json says why. Symbols that read as creatures were replaced, because there are no foes: the viper (Spite) became nettles, the floating eye (Sighting Cut) became the aim line from the eye to the mark, the eye in the dark (Void Glimpse) became a rift in the wall, and the ram's head became a ram log.
  - Check: automated, cue_check.py on every hero batch. render.js writes `<fn>_cue.png`. The check fails a cue that:
    - has a halo filter, or a large, filled, roundish see-through patch in its layer (a flat floor shadow is not one);
    - does not touch the hero (within 10 px), the floor line (within 16 px), the frame top, or half the frame's width;
    - covers under 1.2% of the frame at 162 x 86;
    - stands off its surround by under 0.22;
    - shows under 60% of itself from behind the figure.
  - The contrast floor was set by eye on an 18-card test. A bell tower (0.26), an inkpot (0.26) and a ram log (0.27) read; a red moon behind the figure (0.14) did not, and the moon now goes to the side of the sky the figure leaves open.
  - The matching test uses the final names (renames.csv, through hero_cues.json). It is packaged one calling per sheet.
- **L68. A cue is drawn as the scene is drawn, and to the figure's scale.** Round 11's cues were flat single-fill cutouts with a plain outline and no ink texture, shading or wear. They read as stickers or clip art (a grey inkpot blob as big as the torso, a house-shaped furnace icon, a jug cutout, a computer mouse), and most were oversized against the figure.
  - Rules (hero_cues.js `stage`):
    - Where the object library has the thing, the cue is the library object, drawn by objcomp's own renderer (58 kinds, some as two objects together).
    - Anything else is a kit drawing passed through the cueInk filter: mottled texture, grain, and soft shading from the upper left.
    - Sizes come from the figure, measured on each card from its own polygons:
      - a held thing is about 1.25 head heights, and a long one about a forearm;
      - an effect is 1.5 head heights, or 2.6 for an effect shape;
      - a room object is a set share of the figure's height.
    - A setting cue stands a little back from the floor line, behind the figure, seen through the room's air (cueHaze).
    - Effect cues are drawn in the element FX style. Conflux is two element streams; Strike Across is a stroke of the card's own element.
    - Never draw a billow as a small cloud: its curls drew a face.
  - Check: automated, cue_check.py.
    - Flat fill: over the inside of the cue alone against the figure alone, the cue fails when its share of dead-flat pixels (local standard deviation under 0.006 in 5 px, a pure single fill) passes the figure's by 0.3. The first setting (under 0.02 in 9 px, a 0.25 margin) caught the round 11 cutouts (median 0.50 against the figure's 0.24). On the full round 12 render it also failed library objects the coordinator had passed (a pendulum, a plumed hat): painted areas and the room's haze are smooth but not flat. At the dead-flat setting the library objects reach 0.25 at most. Dark fills stayed flat under a multiplied texture, so the cueInk filter also screens on a faint light speck.
    - Small things at room scale were specks at 162 px on the first full render: a tortoise, a black cat, two effigy dolls, a door knocker. A small room object (under 0.36 of the figure's height) now comes forward to the picture's front plane, as a still life does. It is larger (up to 2.4 times, at most 0.42 of the frame's height), stands at the frame's foot partly cut by the frame, sits in front of the figure but off it and the face, and has no haze.
    - Contrast is waived for a cue covering 3% of the frame or more: a big shape reads in the room's dimness (a hanging pendulum at 0.06 read), and a speck does not.
    - A setting cue's floor line is its own depth line (3% of the figure's height above the front floor); the touch test reads that line.
    - Size cap: a held cue's height is at most 1.35 head heights, or its length at most 1.35 forearms for a long thing.
    - Area and contrast floors go by mode, set by eye on the round 12 sheet.
  - The coordinator's eye check of the first L68 sheet found four more:
    - A held name carrier may reach 1.8 head heights; at 1.25, the Ink Bolt pot was a dark speck.
    - An action in the label must be drawn: the ink leaving the pot and feeding the element at the hand, flames blasting out of the furnace door, the cast stream curving back in its own element, ink running through the siphon's tube. cue_check fails a cue whose label says blasting, leaping, bouncing or drawing and whose SVG has no `cueact` group.
    - No arrow glyphs: a rebound, a returned blow or an overhead swing is an effect stroke, and a stride is a scuffed drag, never a triangle-headed arrow. The golden rebound arrow was a sticker in a new shape.
    - A thin effect stroke is judged like a hazed cue for contrast (0.15), and it is exempt from the flat-fill test: a brush stroke is solid ink by nature, like the act's own FX.
  - The cue box measure (`bbox`) skips clip paths and what they clip: a billow's hatching runs far past the billow, and it once put a vent pipe in mid-air.
- **L69. Pretest the cue words before drawing.** Round 11's pictures read at 64% overall, and Bulwark (42%) and Duelist (57%) failed. Most misses were cues that two names could own: four breakage cues (a crack star, an ice burst, a split shield, an ice sheet), a grave against a banner, a lily against a snuffed candle.
  - Rule: for each calling, write every cue as plain words, shuffle them with the calling's names, and have a fresh text-only reader match them. Any label that misses, ties, or wins only by elimination is re-picked before anything is drawn. Pictures read worse than words.
  - Strong picks name the word in the name (a rake for Rake, a set-square for Square Tip, a hitch knot for Hitch, a barber's pole for Letting Cut) or its most common image (a tortoise drawn in for Hunker, a black cat for Portent).
  - No second figure: no foes and no extra people, so Interpose shelters a dropped helm, not a child.
  - Keep the tone: a broom read as slapstick against the grim ink, and a white flag means surrender, not a coup de grace.
  - Check: the text pretest, packaged per calling by the hero-card agent (labels.txt and names.txt; keys only in the scratchpad) and run by the coordinator. Round 12: 152 of 152, then 27 of 27 on the strengthened labels.

## Checks to run before reporting

1. The build (render.js runs checks.js before rendering and pixchecks.py after, and writes checks.txt): pose limits, props, pour mouths and two-hand turns (L4, L24 to L27, rig.js on load), pose shares, block hits, grips, pose words, frame, hand FX points, face clearance, drape and joint cover (L5, L6, L24, L28 to L31, L33, check_poses.js), object counts and per-batch uniqueness (L12), layout shares, repeats and subject size (L13), hue clusters and colour roles (L14), water allow-list (L15), signature crops (L16), hook points (L17), FX source (L18), count variants (L19), act and hand shares (L20), state words (L21), void holes (L22), name nouns (L23), flatness (L3), ellipse ratios and contact (L9), visible mass (L45), object mass (L46), planks (L47), same-object silhouettes (L12), dark on cool grounds (L49), hand against object (L53), brown on brown (L54), one object (L56), and alone equals batch (L57). All must pass.
2. The unlabelled 170 px thumbnail sheet (L8), which render.js now writes as thumbs170.png on every batch with thumbs170_key.txt beside it: a fresh reviewer names each object before reading the key.
3. The Form checklist at 2x on every new or changed object (L9).
4. A review beside the hero render (L3, L10).
5. A colour check (L14).
6. Hero cards and attuned variants (render.js runs all three on any batch that has them):
   - herosim.py: one picture per hero card in a calling (L66).
   - attuned_check.py: the six element variants read apart in colour, in greyscale shape and in size (L60, L61).
   - cue_check.py: each hero card's name cue is in the scene, drawn with the scene's texture and to the figure's scale, and reads at game size (L67, L68).
   Before drawing new cues: the L69 text pretest.
   - `node hero_staging.js`: legs and framings for the staged poses (also run by check_poses.js on `-all`).
   Then the matching test (L66, L67): a fresh reader gets one calling's hero cards unlabelled (`herosheet.py --blind`) and the shuffled final names; 60% is the bar.
