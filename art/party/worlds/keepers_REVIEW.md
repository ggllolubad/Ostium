# Abbey keepers: review (worlds/keepers.js)

Eight keepers built to `GUIDE.md`, `LOGIC_CHECKLIST.md`, `bible/00_design_language.md`, the keepers table and the "shop keepers in full" entries of `bible/01_company.md`, and `bible/hub_spec.md`. Reference keeper: Mother Hild (`dirAC2.js`, key `smith`). All use `KB(seed)` = `kit.base(seed, { keyTint: '#ffd8a0', shadowTint: '#2e1e1a' })`, face right, canvas 600 x 820, ground 790, seeds 1601 to 1608. Shared helpers are in `worlds/kit_keepers.js`.

Checked on full renders over a warm mid-dark ground, zoomed 2x to 4x on heads, hands, held objects and feet, at game size (`out/worlds/keepers/sil.png`, 190 px per 1.0 human), and on the rig exports and pose tests. "Fixed" means the item failed during the build and passes on the current render.

## Deliverables

| Keeper | Key | Seed | Scale | Bones | Layers | Rig check diff | Furniture bone | Pose test |
|---|---|---|---|---|---|---|---|---|
| Prior Aldric | aldric | 1601 | 1.05 | 21 | 32 | 0.0004 | lectern | near hand drops from the ledger to the key ring (`aldric_pose.png`) |
| The Abbot | abbot | 1602 | 1.0, kneeling | 19 | 26 | 0.0005 | altar_rail | praying bow: torso and head forward, prayer hands stay on the rail |
| Brother Lucan | lucan | 1603 | 1.0 | 21 | 32 | 0.0004 | desk | writing stroke: forearm and hand move the quill along the page |
| Sister Wenna | wenna | 1604 | 1.0 | 21 | 33 | 0.0004 | table | lifting the vinegar cloth: near arm raised to the face, torso back |
| Brother Fenn | fenn | 1605 | 0.95 | 20 | 31 | 0.0004 | counter | counting: near hand lifts and turns over the ledger, head cocked |
| Sister Ide | ide | 1606 | 0.95 | 21 | 33 | 0.0003 | relic_case | listening: head tilted back, veil follows, fingertips trace the glass |
| Godric | godric | 1607 | 1.0 | 21 | 34 | 0.0003 | tally_board | counting a notch: forearm and finger move down the board, head nods |
| The Hosteller | hosteller | 1608 | 1.0 | 20 | 29 | 0.0002 | (book and lantern bones) | lantern raised, lantern counter-rotated so it still hangs plumb |

Renders: `out/worlds/keepers_<key>.png` and `_sil.png`. Rigs: `out/rig/worlds/keepers_<key>/`. Poses: `out/worlds/keepers/<key>_pose.png`. Sheet: `out/worlds/keepers/sheet.png` (all eight plus Hild, one pixel scale, shared ground line). Silhouettes: `out/worlds/keepers/sil.png`. No render printed a grip warning; no rig export reported missing joints.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine; 2 objects face the user and gaze; 3 grips and hands; 4 weight and balance; 5 contact and attachment; 6 facing and light.

| Keeper | 1 Head | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Prior Aldric | pass | pass | fixed | pass | pass | pass |
| The Abbot | fixed | pass | fixed | fixed | pass | pass |
| Brother Lucan | pass | fixed | pass | pass | pass | pass |
| Sister Wenna | pass | pass | fixed | pass | pass | pass |
| Brother Fenn | pass | pass | fixed | pass | pass | pass |
| Sister Ide | pass | pass | pass | pass | pass | pass |
| Godric | fixed | pass | pass | pass | pass | pass |
| The Hosteller | pass | pass | fixed | pass | fixed | pass |

Measurements behind the passes:
- Head over neck: head centre ahead of the neck base by 18 (Aldric), 44 (Lucan, stooped), 42 (Wenna, leaning), 38 (Fenn), 28 (Ide), 40 (Godric), 22 (Hosteller) px. Every head centre sits behind the front of its own chest, and every hunch (Lucan, Godric, the Abbot) is built into the curve of the upper back.
- Gaze: Lucan's eye to the nib is 71 degrees down and his head axis is 57 degrees, so they are 14 degrees apart. Godric's eye to his fingertip on the notch is 28 degrees and his head is 29 degrees. Wenna, Fenn and the Hosteller look out at the customer; nothing in their hands is being read. Ide is blind: her head inclines toward the case. The Abbot's hood is bowed toward the rail and the sealed door.
- Objects face the user: the charter (Aldric), the Codex (Lucan) and the ledger (Fenn) all face the keeper and show the viewer only an edge or a sliver of page. Aldric's oxblood ledger is closed and shows its cover. The tally board's chalked face is turned to Godric, so we see its notched edge.
- Grips: the knife (Lucan), bell (Ide), candle bundle (Godric) and lantern ring (Hosteller) all go through `B.grip`, with no warnings. The quill is a pinch, not a fist, so it uses `penHand`: the index lies along the shaft, the thumb is on the far side and the quill runs back over the web of the hand. Resting hands use `restHand`. Hands counted: two per keeper. The Abbot's far hand shows as the sliver behind the near one in the prayer clasp.
- Plumb: keys, rope ends, the red cord, wimple ties, eye-band ties, the bell, the lantern, the ribbons over desk ledges and the belt candle bundles all hang straight down whatever the torso does. The Abbot's key ring hangs plumb while his back leans.

What failed and how it was fixed:
- Abbot 1/4: at first he knelt bolt upright with the robe falling straight, and read as a standing man. He now sits back on his heels with his bare soles under the rump, the back bowed into a hump, a lower rail, and thighs running forward to the knees. That reads as kneeling at game size.
- Abbot 3: fists gripping the rail read as two raised fists, and the first far grip was 59 degrees off square. He now has prayer hands with the wrists resting on the rail (`prayerHands`), the far hand palm to palm with the near one.
- Abbot 1: the bared side of the head read as a face with spectacles, against "seen mostly from behind". Now only the linen pad shows, pressing out under the hood's lifted edge, with its strip tied under the jaw and a dried blood spot.
- Lucan 2: the head was at 24 degrees while the page was 84 degrees below the eye. The desk was raised 48 px, the head bowed to 57 degrees and the nib moved up the slope. The knife arm was re-solved so the forearm meets the knife within 35 degrees of square.
- Lucan, Cole's note: the neck must not read as a second head. It is drawn without a cap at its base, runs straight into the jaw, and is covered by a high cowl collar. On the zoom it reads as a neck.
- Godric 1: the wide neck tube stuck out behind the stooped head as a pink round shape, a second head at game size. The neck is narrower and the knitted shawl is wound high round it.
- Wenna and Fenn 3: resting hands were thin strips, with fingertips rendered black. The cause was a bug: a tip colour string was indexed per character. Fingers are now one continuous tube each with a rounded tip, the hands are wider, and the frost-scarred tips show grey-green.
- Aldric 3: gloved fingers read as robotic segments. They are now single tubes, held together.
- Hosteller 5: the guest book was hidden behind the arm. It is now clamped horizontally under the arm, sticking out in front, with the forearm under it and the hand cupping its front end.
- Hosteller pose test: the lantern stayed at rest when its counter-rotation summed its chain to exactly zero. `posetest.py` composites a zero-total layer at rest without translating it. The test now uses 19.5 degrees; the rig itself was correct.
- Fenn: the tonsure's side hair sat over the ear and read as an earmuff. It now sits above and behind the ear.

## Gate 2: style and detail (GUIDE.md, design bible, keeper entries)

| Keeper | Bible fields | Silhouette at 190 px | Grit (12 or more) | Layers 3 or more | Palette rules | Light | Scale |
|---|---|---|---|---|---|---|---|
| Prior Aldric | pass | pass | pass (15) | pass | pass | pass | pass |
| The Abbot | pass | pass | pass (14) | pass | pass | pass | pass |
| Brother Lucan | pass | pass | pass (18) | pass | pass | pass | pass |
| Sister Wenna | pass | fixed | pass (17) | pass | pass | pass | pass |
| Brother Fenn | fixed | pass | pass (17) | pass | fixed | pass | pass |
| Sister Ide | fixed | pass | pass (13) | pass | pass | pass | pass |
| Godric | pass | pass | fixed (18) | pass | pass | pass | pass |
| The Hosteller | pass | fixed | pass (13) | pass | pass | fixed | pass |

Grit inventory (secondary details):
- **Aldric:** master key ring (7 keys), pectoral cross and chain, red cord of office with tassels, badge, rope belt knot and ends, oxblood ledger with brass corners and a tooled line, signet ring on the glove, glove seams, cowl stitching, stitched scapular edges, side seam, pressed folds, the charter's rubric ribbon.
- **Abbot:** six candles (lit, guttered, smoking) with pooled wax, the bandage and pad with a stain, the hood's lifted edge, a patch, keys, badge, rope belt, cowl stitching, cracked soles, age spots, scapular stitching.
- **Lucan:** ink horn with a red-tipped quill on the desk, lines of text, a rubric initial and a gold glint in the Codex, a ribbon marker, ink horn on a thong, pen-knife sheath, pumice, wax tablet, keys, badge, reading lenses with a rivet, quill behind the ear, oversleeve ties, ink spatter, a darn, ink-black fingertips.
- **Wenna:** wimple with ties, vinegar cloth knot, rust-brown stains and a smear on the apron, apron neck strap, bone saw, two herb bundles, bandage roll, the Barrow beak mask (glass eyes, rivets, stitching), keys, badge, pinned sleeve rolls, grey-green fingertips, blood at the hem, table stains, folded linen.
- **Fenn:** fat purse with a lead token pressing through, counting board of bone beads, spectacles on a cord, seal ring, ink-stained thumb, fur cuffs with tufts, keys, badge, belt knot, ledger with red entries, dish of lead ostia, alms slot, lock plate, iron strap, crown shine, double chin.
- **Ide:** veil, eye band and ties, frost on the lashes, frost breath, white glove, sanctus bell, candle snuffer, keys, badge, gilt relic case, glass streaks, the Teeth with a warm glint, frost bloom under her fingertips.
- **Godric:** ribbed knit cap, tally stick behind the ear, white stubble, red nose, ribbed shawl with a loose end, apron stains and wax drips, candle bundle with ties, two candle bundles at the belt, the 9-key store ring, badge, a patch, cross-gartered leggings, under-tunic hem, gloves with the empty fingers sewn shut, the notched tally board and hanging tally sticks.
- **Hosteller:** sooted and riveted lantern with vents, guest book (corners, clasp, cord, tooled lines), keys, badge, pouch, polishing rag, apron ties and hem stitching, bone buttons, plain collar, iron buckle, combed parting, shoe straps. The face is plain on purpose; the clothes carry the detail.

What failed and how it was fixed:
- Wenna, silhouette: the bone saw hung inside the apron and was lost among the keys. It now hangs from the back of the belt with an ink-cased iron bow, past the habit's edge, so it shows in silhouette with the beak mask on the hip.
- Wenna: the vinegar cloth read as a banana. It is now a muted, twisted band with a knot and two short ends.
- Fenn, palette: his seal ring was a yellow brass that read as gold on a man who is not holy. It is now pewter. Gold appears only on Ide's relic case and Lucan's gold-leaf book knife and Codex glint, all holy; the bible names the last two.
- Ide: the frost breath was straight lines that read as spitting. It is now three soft tapered wisps. The frost streak on the glass is now small blooms at her fingertips.
- Godric: the under-tunic hem read as a blue-grey tyre round the knees. It is now warm grey and straight-sided, with folds.
- Hosteller, light: the lantern's glow was a hard-edged orange disc. It is now a radial gradient (`glow()`), which candle flames use too.
- Aldric: the cropped hair read as a knit cap, and pale irises read as blank eyes. The hair is now a soft stippled crop with no outline, and the irises are grey-blue.

## Still open

- **Habit colours.** Each keeper follows the bible's "in full" entry where it differs from the common habit: Ide wears the bleached near-white habit, Fenn's is a shade darker in better wool, and the Hosteller is not a monk (grey servant's tunic and apron, with the order's key ring and badge). All keep the black scapular except the Hosteller.
- **Facing.** The bible says keepers face left toward the door; this brief says face right with no flip. They face right. A mirror at runtime would need the key light kept upper left, as foes do.
- **Aldric is clean by Cole's note.** Wear is limited to the hem shadow and the shoes, which deliberately breaks "wear on every surface".
- **Oxblood ledger.** Kept dark and desaturated (#4a221e). The red cord of office is the one strong red on him, as the bible asks.
- **Glow in silhouettes.** Lantern and candle light pools register as soft grey halos in the brightness(0) silhouettes, the same as Hild's forge bar.
- **posetest.py.** A layer whose chain rotations sum to exactly zero is not translated. A shared-tool fix would be to skip the early return when the pivot has moved.
- **Wenna's saw** hangs about 15 degrees off plumb where it rests against her rump.
- **Animation.** The Abbot's prayer hands, Wenna's flat hands and Fenn's hands need IK to stay on their surfaces under large torso moves. In Godric's count, the candle bundle rides on the near hand.
- **Ide's Teeth.** The bible says their warm glint is "behind her"; the hub spec keeps the Teeth in the relic case, so the glint is in the case in front of her.

## Independent review (art director and logic audit, 2026-11-22)

Second pass by a reviewer who did not build the keepers. Checked on full renders over a mid-dark ground at 2x to 6x on heads, hands, held objects and contact points, on a head-by-head grid against Mother Hild, on the sheet and on the 190 px silhouettes. Only `worlds/keepers.js` and `worlds/kit_keepers.js` were changed. Every keeper was re-rendered, its rig re-exported (no missing joints, no grip warnings) and re-posed; `sheet.png` and `sil.png` were rebuilt in the same layout (Hild first, one pixel scale, shared ground at 790, 64 px ticks, labels under the ground).

### Findings, ranked

| # | Keeper | Gate | Finding | Fix | Status |
|---|---|---|---|---|---|
| 1 | Lucan | Logic 2, 3, 5 | Not writing. The far fist with the knife hovered at chest height about 40 px above the page; the quill's vane rose into his chin, so the hands read as raised with the quill pointing up. The page showed as a single edge-on line, so nothing showed it faced him. | Both forearms now lie on the desk. The near hand rests its heel on the desk's lower edge with the nib on the page (`pg(446)`); the quill is a stripped scribe's quill running back toward the shoulder, with a paler, thicker barrel so it reads at game size. The far hand lies flat on the upper page with the gilt book knife under its palm, blade toward the nib; its forearm rises from his side behind the desk, so only the wrist shows above the page block. The open Codex shows a sliver of both pages tilted toward him (gutter, text lines, a wet line ending at the nib, rubric and gold). The spare quill in the ink horn now lies back away from him. | fixed |
| 2 | Lucan | Logic 2 | Gaze: with the new nib, eye to nib is 66 degrees. | Head re-seated at `hA` 0.92 (53 degrees, 13 apart), eyes drawn lowered (heavy upper lid, iris at the lower front). The neck is thinner and longer (32/27) with a tendon and Adam's apple, still hidden at its base by the cowl. Head centre 40 px ahead of the neck base. | fixed |
| 3 | Wenna, Fenn | Logic 2, 5; Guide 8 | The hands "spread on" the table and ledger were top-down hand shapes standing in the picture plane, the full back of the hand facing us while the table top is seen almost edge-on. They read as puppet hands floating in front of the table. | New `tableHand` (kit_keepers): a hand lying palm-down seen from the side at eye height: palm on the surface line, the back of the hand arching to a knuckle ridge, fingers lying flat with the deeper ones stacked slightly higher, nails, joint creases, a contact shadow, near or far thumb by hand. Wenna's (frost tips, veins, thick fingers) press flat on the scrubbed top; Fenn's lie on the ledger, the seal ring on the near hand and the ink-stained thumb toward us on the far hand. | fixed |
| 4 | Ide | Logic 5 | The bare hand hovered above the top glass as a flat top-down shape. | `tableHand` with the fingertips just touching the glass; the frost bloom is placed at the actual fingertips. | fixed |
| 5 | Ide | Style, face | The frost on her breath was a grey squiggle with hard edges: at game size it read as smoke or a grey moustache hooked from the mouth. | A faint vapour cloud of four soft radial puffs leaving the lips and spreading forward, no strokes. | fixed |
| 6 | Ide | Style, palette | A grey halo surrounded the relic case: the glass quads were smoothed into rounded blobs bulging past the case. | Glass quads drawn sharp. | fixed |
| 7 | All but Hild | Light | Faces were lit much flatter than Hild (`faceShade` 0.35 to 0.55 against her 0.85), so the keepers looked pasted beside the reference. | Raised to 0.7 to 0.85 (the Hosteller 0.7, still the plainest), jaw shade to match; the front of every face now falls into the same shadow band as Hild's. | fixed |
| 8 | Aldric | Face, silhouette | "Close-cropped silver hair" read as a grey knitted cap (an inked, crosshatched hair shape), the same cap read as the Hosteller's; the neck was a thick column for a lean man in his sixties. | The back of the skull is now scalp with silver stubble, a translucent crop over the crown with a soft hairline and no outline; neck 35/31 with two cords; gaunt cheeks, hollow temple, long philtrum, paler eyes. | fixed |
| 9 | Fenn | Face | The double chin was a separate pink sausage with a red underside under the jaw, reading as a neck roll or a pink scarf; the crown shine was a hard white bar. | One dewlap drawn under the head so the jaw line creases over it, merging into the throat; a second-chin crease, a round cheek pushed up by the smile and a smile fold; the crown shine is a soft gradient. | fixed |
| 10 | Fenn | Style | The fur cuffs were hard grey discs with radial hatching (they read as saw blades or wooden plates). | An uneven soft roll with a dark sleeve mouth and short ruffled pile. | fixed |
| 11 | Abbot | Logic 3, style | The prayer hands were a mitten: four identical parallel finger tubes, pearl-like knuckle dots and a pale lit rectangle on the back of the hand. A large ink X crossed the near sleeve where the sharply bent sleeve's edges crossed. | `prayerHands`: uneven finger lengths and widths bowing toward the far hand, knotted joints with creases, low bony knuckles, tendons fanning from the wrist, a raised vein, the back of the hand toned into the same light as the fingers. The heel of the hands still rests on the rail. A shadowed crease patch fills the crook of the elbow. | fixed |
| 12 | Wenna, Godric, Hosteller | Face | Same face template as the others. | Wenna: inner brows lifted, laugh lines, a broad heavy cheek (tired and kind), deeper light. Godric and the Hosteller: light only; Godric already carries the cap, red nose, stubble and worried knot, and the Hosteller is plain by the bible. | fixed (see open) |
| 13 | Ide, Aldric | Silhouette | Ide, Aldric and the Hosteller were three tall straight habit columns at 190 px. | Ide's fine veil now falls plumb to the waist behind her, a long pale taper no one else has. Aldric is set apart by the lectern and the cropped skull, the Hosteller by the lantern held out. | fixed |

Passes re-confirmed: Godric's fingertip is on a notch of the board's edge (eye to tip 28 degrees, head 29); the candle bundle passes through his near fist. Aldric's gloved hands lie on the ledger. Ide's gloved hand grips the bell handle. The Hosteller's lantern bail runs through his fist and the lantern hangs plumb. Head sizes against Hild (H 94 at 0.9): Aldric 104 at 1.05, Lucan 98, Wenna 96, Fenn 98 at 0.95, Ide 94 at 0.95, Godric 100, Hosteller 98: all within 6.4 heads for their scale.

### Pose tests (re-run on the new rigs)

| Keeper | Pose | Result |
|---|---|---|
| Lucan | writing stroke: forearm_n -7, hand_n 5, head 4, torso 2 | hand and quill stay on the page; far hand stays on the upper page |
| Abbot | bow: torso 6, head 8, arm adjusted | hands stay on the rail; elbow patch follows the forearm |
| Wenna | vinegar cloth: upperarm_n -55, forearm_n -75, hand_n 20 | near hand to the face, far hand still flat on the table |
| Fenn | counting: forearm_n -18, hand_n -12, head -7 | near hand lifts off the ledger cleanly |
| Ide | listening: head -10, hand slides | veil follows the head, fingertips stay on the glass |
| Aldric | key: upperarm_n 14, forearm_n 30 | near hand drops from the ledger |
| Godric | counting: forearm_f 9, hand_f 6, head 5 | finger moves down the board |
| Hosteller | lantern raised, lantern 19.5 counter-rotation | lantern still hangs plumb |

### Still open

- **Shared face base.** Every face is still built on `B.head` (body.js is frozen). Distinctness now comes from age, build and light overlays per keeper; a face shape per keeper would need a shared-tool change.
- **Hosteller's near hand** cups the guest book from below with an open palm; it touches, but reads as presenting the book rather than clamping it.
- **Wenna's wrists** carry a dark red-brown shading band where the forearm turns down to the table; it can read as blood or cuffs. She is also nearly upright, short of the bible's "weight forward".
- **Lucan's tonsure** fringe, seen on a head bowed 53 degrees, reads at 4x as a grey band over the brow.
- **Cowl collars** on Aldric and Ide are lens-shaped discs under the chin at zoom.
- **IK.** Lucan's two hands on the desk, Wenna's and Fenn's flat hands and Ide's fingertips need IK under large torso moves. Lucan's far forearm is drawn behind the desk, so a lifted far arm shows behind the desk until it clears it.
- **Sheet width** is now 3918 px (was 3834) because the new renders are slightly wider; the order, scale, ground and labels are unchanged.

## Lore changes 2026-11-23

Cole's lore changes (bible/LORE_CHANGES_2026-11-23.md, items 6 and 9): optional props on four keepers, as hints only,
never stated. Changed only in `worlds/keepers.js` (`kit_keepers.js` unchanged). Each keeper keeps the reviewed pose,
face, head and hands; the additions are small and sit inside the silhouette.

- **Prior Aldric** (came out of the Black Pyre): an old burn on the side of the neck, glossy and puckered, running up
  under the jaw and down under the collar; a glimpse of the same scarred skin at the near wrist between the sleeve and
  the glove (the gloves are why). No fire colour: healed scar tissue only.
- **Brother Fenn** (a ledger clerk in the Sulphur Pits): his oldest ledger lies closed at the far end of the counter,
  thick, its corners worn through to the board, the page edges soaked sulphur yellow in patches with a tide line and a
  few crystals; the dish of ostia now sits on it. His working ledger, red entries and hands are unchanged.
- **Brother Lucan** (a scribe at the Stilled Spire): a brass pocket watch hangs on its chain from the ring of the
  desk's book cupboard, stopped at one minute to twelve, frost creeping round the inside of the glass, a hairline crack.
- **The Hosteller** (secretly the First Porter, never stated): a mason's hands (both hands larger and knotted at the
  knuckles, yellow calluses, an old split healed white, the first finger of the book hand broken long ago and healed
  stiff and straight); the guest book is now far older than the abbey's books (bare oak boards with the leather almost
  gone, a crack through the board, a chipped corner, raised bands, leaves of uneven size and colour standing proud, two
  worn leather clasps with iron catches, one torn off and frayed); and a heavy old hand-forged iron key on its own
  greasy thong at the belt, apart from the order's ring (pitted, rusted, the bow worn bright, a heavy warded bit). New
  bone `old_key` (parent pelvis) so it can swing.

Also, from the eye audit: the lead ostia in Fenn's dish had a centred dark square doorway that read at zoom as a pupil;
the doorway is now arched and open to the token's foot (the badge's own shape).

Renders `out/worlds/keepers_{aldric,fenn,lucan,hosteller}.png` (+ `_sil`, `.svg`); rigs re-exported; poses re-run;
`out/worlds/keepers/sheet.png` and `sil.png` rebuilt with the reviewer's composer (scratch `kr/sheet.py`, unchanged:
3918 x 880 and 1310 x 273, same layout).

### Gate 1: logic audit (changed keepers)

| Keeper | 1 Head | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Prior Aldric | pass | pass | pass | pass | pass: the scar lies on the neck and runs under the collar; the wrist patch fills the gap between sleeve and glove | pass |
| Brother Fenn | pass | pass: the old ledger is closed, edge-on, on the counter; nothing faces the camera | pass | pass | pass: the old ledger rests on the counter top, the dish rests on the ledger | pass |
| Brother Lucan | pass | pass | pass | pass | pass: the watch hangs plumb on its chain from the cupboard's iron ring | pass |
| The Hosteller | pass | pass | pass: the lantern fist (`B.grip`, no warning) and the cupping hand keep their reviewed geometry; only scale (fist 22 to 24, hand 28 to 30) and surface changed, and the stiff finger stays on the book's corner | pass | pass: the old key's thong is tied to the belt and the key hangs plumb over the apron's edge; the clasps run from the board over the fore-edge | pass |

### Gate 2: style and detail (changed keepers)

| Keeper | Item | Result | Note |
|---|---|---|---|
| All four | Hint, not statement | pass | Each prop is a background detail at sheet size; nothing labels it, and no keeper gains a course colour on the body (Aldric's scar is skin-toned, not fire) |
| Prior Aldric | Neck scar readable | fixed | First pass was too faint to see at 4x; the scar colour and rim were strengthened |
| Brother Fenn | Stain | fixed | First pass was one even yellow band along the whole fore-edge (read as yellow paper); now patchy with an uneven tide line |
| Brother Lucan | Stopped clock | pass | Hands at one minute to twelve, the Stilled Spire's hour; brass, frost and a crack, no gold |
| The Hosteller | Ancient book | pass | Reads older than every other book on the sheet (bare boards, crack, uneven leaves, torn clasp) |
| The Hosteller | Mason's hands | pass | Knuckles and the straight stiff finger read at 2x; at game size the hands are slightly larger, still within the reviewed size range against Hild |
| All four | Palette | pass | Keeper habit colours plus brass (Lucan's watch, already present as `P.brass`), sulphur yellow only as a stain on paper, iron and rust |
| All four | Silhouette | pass | Unchanged at 190 px (`sil.png`) |

### Pose tests (re-run)

| Keeper | Pose | Result |
|---|---|---|
| Prior Aldric | key: upperarm_n 14, forearm_n 30 | the wrist scar travels with the hand; attached |
| Brother Fenn | counting: forearm_n -18, hand_n -12, head -7 | the old ledger stays on the counter (counter bone); attached |
| Brother Lucan | writing stroke: forearm_n -7, hand_n 5, head 4, torso 2 | the watch stays on the desk bone; attached |
| The Hosteller | lantern raised: upperarm_f -14, forearm_f -6, lantern 19.5 | lantern plumb; old key on its own bone; attached (21 bones, 30 layers) |

No rig export reported missing joints; no grip warnings.
