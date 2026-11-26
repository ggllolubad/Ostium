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

## Checks to run before reporting

1. The build (render.js runs checks.js before rendering and pixchecks.py after, and writes checks.txt): pose limits, props, pour mouths and two-hand turns (L4, L24 to L27, rig.js on load), pose shares, block hits, grips, pose words, frame, hand FX points, face clearance, drape and joint cover (L5, L6, L24, L28 to L31, L33, check_poses.js), object counts and per-batch uniqueness (L12), layout shares, repeats and subject size (L13), hue clusters and colour roles (L14), water allow-list (L15), signature crops (L16), hook points (L17), FX source (L18), count variants (L19), act and hand shares (L20), state words (L21), void holes (L22), name nouns (L23), flatness (L3), ellipse ratios and contact (L9), visible mass (L45), object mass (L46), planks (L47), same-object silhouettes (L12), dark on cool grounds (L49), hand against object (L53), brown on brown (L54), one object (L56), and alone equals batch (L57). All must pass.
2. The unlabelled 170 px thumbnail sheet (L8), which render.js now writes as thumbs170.png on every batch with thumbs170_key.txt beside it: a fresh reviewer names each object before reading the key.
3. The Form checklist at 2x on every new or changed object (L9).
4. A review beside the hero render (L3, L10).
5. A colour check (L14).
