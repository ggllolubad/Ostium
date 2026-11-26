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
- **L4. Ergonomic grips.** Hook and Drag's swing rotated `hand_n` by 160 degrees, so the Bulwark held the mace with a wrenched wrist. Cause: the weapon was aimed with the wrist. Rule: aim with the shoulder and elbow, keep the wrist within about 45 degrees of the forearm, bend elbows one way only, thumb toward the weapon head. Check: assert in rig.js that every hand angle is within limits and every elbow bends the right way, for every calling and path variant. The build fails otherwise.
- **L5. Pose variety.** All three Alchemist cards used the same throw, and the four Hexweaver cards were near-identical. Rule: at least 3 act and 2 block poses per calling, chosen by card words, then by id hash. Check: on a full render, no calling uses one pose for more than about 40% of its cards.
- **L6. Blocks read as blocks.** The Alchemist block reused the throw pose, and the Oracle block hit landed on her face. Rule: block poses show a guard, and the hit lands on the guard, never on the face. Check: the block FX anchor lies on the guard part, not on the head bone.
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
- **L14. No rainbows.** Strike the Ring's five daubs, and later Turn the Ring's gems, read as a rainbow. Rule: course colours pulled toward the course inks, used as marks rather than saturated colour; red only for blood, doom and rubric; gold only on holy things. Check: in review, any card with four or more saturated hues fails.
- **L15. Water layout only for heavy things.** The stinger and the bowl looked wrong half-submerged. Rule: water only for anchor, skull, bell, keg and other heavy objects. Check: an allow-list in code.

## Checks to run before reporting

1. The build: pose limits (L4), object counts (L12), layout shares and repeats (L13), water allow-list (L15). All must pass.
2. The unlabelled 170 px thumbnail sheet (L8): name each object before reading the labels.
3. The Form checklist at 2x on every new or changed object (L9).
4. A review beside the hero render (L3, L10).
5. A colour check (L14).
