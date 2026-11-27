# Ostium roadmap and to-do (from 2026-11-26)

The running to-do list. Phase order agreed 2026-11-26: card art, a quick display options pass, a card-locking balance pass, animations, sound, the full options menu, tutorial, final balance, Steam release. Each item is marked Cole or Claude, and [x] means done.
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

## 2. Display options (quick pass)
- [ ] Fullscreen or windowed, resolution, UI scale, on the doors screen or the pause menu (Claude)

## 3. Card-locking balance pass
- [ ] Simulator pass against the 50% clear target; fix company F, the outlier at 17% (Claude)
- [ ] Fold in Cole's and friends' playtest notes; cut or rework cards now, so no animation work is wasted (Cole, then Claude)
- [ ] No dominant deck, no dead cards (redesign plan exit criteria); card list locked at the end

## 4. Animations
- [ ] Per-calling motion sets in Godot bone rigs: idle, attack, hit and cast exist in basic form; build per-card timing and effects (Claude)
- [ ] Card effects: element impacts, block, buffs and debuffs, Conjunctions (Claude)
- [ ] Enemy intents and abilities animated, rulers' signature moves (Claude)
- [ ] The Elementalist's hand sign changes with attunement (Claude)

## 5. Sound
- [ ] Sound effects for cards, hits, elements, UI, map and hub (sourcing plan to be agreed with Cole: library, commissioned or generated)
- [ ] Music: hub, map, combat, rulers (same decision)

## 6. Full options menu
- [ ] Audio: master, music and effects volume (Claude)
- [ ] Gameplay: text speed, combat speed, Debug mode moved here (Claude)

## 7. Tutorial
- [ ] First descent guidance: Ordo, vigour, Conjunctions, Swap, kit skills (Claude, with Cole's review of wording)
- [ ] Hover help everywhere (keywords already in place)

## 8. Final balance
- [ ] A lighter tuning pass after animations, sound and tutorial, from fresh playtests (Cole, then Claude)

## 9. Release decision (later, once the game is finished)
- [ ] Decide whether to sell it at all: market check (comparable games, wishlists or interest from a free playtest), price, effort to launch. Until then, playtests go through the public GitHub link (Cole and Claude)
- [ ] Only if selling: business setup (individual or LLC, accountant check), then the Steam steps below

## 10. Steam release (only if the decision above is yes)
- [ ] Steamworks account, app fee, App ID (Cole)
- [ ] CI upload to Steam: beta branch per push, default branch on approval (Claude, after Cole adds credentials)
- [ ] Steam Playtest (removes the SmartScreen warning); Steam Cloud saves
- [ ] Store page: capsule art, screenshots, trailer, description; live as Coming Soon at least 2 weeks before release
- [ ] Optional code signing (Azure Artifact Signing, about $10 a month) for copies downloaded outside Steam

## Open questions
- Card text: drop "Exhaust." from Rite cards? Approve "attuned Volatile", "each course you lack", "belt flask"?
- Company F (Thornguard, Prismatic, Transmuter) clears 17%: leave or tune?
