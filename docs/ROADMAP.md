# Ostium roadmap and to-do (from 2026-11-26)

The running to-do list. Phases run in Cole's order. Each item is marked Cole or Claude, and [x] means done.
Decisions still open are under "Open questions".

## 0. Playtest pipeline (in place)
- [x] GitHub builds the Windows exe on every push to `living-ink` and publishes the release "Ostium playtest (latest)" (Claude)
- [x] README download link; Debug mode unlocks every calling and world (Claude)
- [x] Saves persist across closing and new builds, with versioned migration (Claude)
- [ ] Add playtesters as repo collaborators; set the default branch to `living-ink` (Cole)
- [ ] Confirm the Mobile renderer (anti-aliasing) launches and looks right on Cole's laptop (Cole)
- [ ] Optional: smaller download (full quality on card art and UI only); own save folder `%APPDATA%\Grey Lantern Productions\Ostium` (Claude)

## 1. Card art (finish)
- [x] Hero cards: 152, matching test 78%, every calling passes
- [x] Elements: fire, frost, lightning, water, toxin, void drawn as shapes; attuned cards follow the hero's element
- [x] Vessel and Alchemist object cards pass matching (69% and 67%)
- [ ] Object cards, round 13: render the re-picked objects for Hexweaver, Bulwark, shared, Oracle, Duelist and Elementalist (text pretest passed 96%); picture-matching test; install (Claude)
- [ ] Missing variants: el_ring_turn frost and lightning (Claude)
- [ ] Hero card polish fixes rendered in the final install (Brunt, Transmute, Interpose and others) (Claude)
- [ ] Card text tightening: 41 cards. Needs Cole's answers on dropping "Exhaust." from Rite cards and on the three new phrasings (Cole, then Claude)
- [ ] Remaining flat UI pieces textured: hand plates, Ordo summary, intent tags, camp screen (Claude)

## 2. Animations
- [ ] Per-calling motion sets in Godot bone rigs: idle, attack, hit and cast exist in basic form; build per-card timing and effects (Claude)
- [ ] Card effects: element impacts, block, buffs and debuffs, Conjunctions (Claude)
- [ ] Enemy intents and abilities animated, rulers' signature moves (Claude)
- [ ] The Elementalist's hand sign changes with attunement (Claude)

## 3. Sound
- [ ] Sound effects for cards, hits, elements, UI, map and hub (sourcing plan to be agreed with Cole: library, commissioned or generated)
- [ ] Music: hub, map, combat, rulers (same decision)

## 4. Options menu
- [ ] Display: fullscreen or windowed, resolution, UI scale (Claude)
- [ ] Audio: master, music and effects volume (Claude)
- [ ] Gameplay: text speed, combat speed, Debug mode moved here (Claude)

## 5. Tutorial
- [ ] First descent guidance: Ordo, vigour, Conjunctions, Swap, kit skills (Claude, with Cole's review of wording)
- [ ] Hover help everywhere (keywords already in place)

## 6. Balance pass
- [ ] Simulator pass against the 50% clear target; fix company F, the outlier at 17% (Claude)
- [ ] Fold in Cole's and friends' playtest notes (Cole, then Claude)
- [ ] No dominant deck, no dead cards (redesign plan exit criteria)

## 7. Steam release
- [ ] Steamworks account, app fee, App ID (Cole)
- [ ] CI upload to Steam: beta branch per push, default branch on approval (Claude, after Cole adds credentials)
- [ ] Steam Playtest for friends (removes the SmartScreen warning); Steam Cloud saves
- [ ] Store page: capsule art, screenshots, trailer, description; live as Coming Soon at least 2 weeks before release
- [ ] Optional code signing (Azure Artifact Signing, about $10 a month) for copies downloaded outside Steam

## Open questions
- Card text: drop "Exhaust." from Rite cards? Approve "attuned Volatile", "each course you lack", "belt flask"?
- Company F (Thornguard, Prismatic, Transmuter) clears 17%: leave or tune?
- Claude's suggested order changes (see the 2026-11-26 chat): a first options pass now; a card-locking balance pass before animations.
