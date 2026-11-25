# Notes for the animation phase

Collected while rigging; each needs handling when the Godot rigs and AnimationPlayer tracks are built.

- **Two-handed holds need IK.** The Drowned Thrall's boat hook is parented to the near hand; the far hand must follow the
  pole with a two-bone IK target (Skeleton2D modification stack, or a small script). Same for any two-handed weapon.
- **Draw order changes per animation.** Big reaches can cross the body the wrong way in the rest layer order (the
  Alchemist's throw wind-up puts his far arm over his face). Key the layer z-index in those animations.
- **Hanging objects swing from their top.** The Oracle's hourglass hangs from its chain; turning it over needs a
  position key as well as a rotation.
- **Rigid bibs and aprons have small limits.** Mother Hild's bib apron stays within about 5 degrees of swing or it pulls
  off its neck strap.
- **Boots at the ankle** show a faint seam beyond about 15 degrees of foot turn (Duelist); keep foot rotation small or
  add a cuff overlap.
- **Robes to the floor** hide the legs (Elementalist, Oracle): their thigh and shin bones exist but only the feet are
  drawn; animate the robe hem bones for steps instead.
- **The Elementalist's sign** is a swappable layer on bone `sign` (pivot at its centre); six variants are exported, one
  per course. Swap on attunement; it can spin.
- **Foe rigs are exported mirrored** (facing left) with pivots mirrored to match; author their animations in that space.

## Cards rework (added by Cole, 2026-11-23)
- ORDER CHANGE (Cole, 2026-11-23): card art is no longer an animation-phase task. The card list is defined and balanced first, then card art is made, then animation and effects. See the PHASE ORDER section in CONSISTENCY_TODO.md.
After the card list is locked and balanced: redo all card art (513 card scenes) in the Living Ink style, composed from the Living Ink hero rigs (posed per the calling's motion set), the reviewed Living Ink creatures and Living Ink rooms, with per-card effect layers; review the card frame and text layout against the same style. The current card art is the old grim pipeline (grim/cards2.js + cards2.py in /home/claude/ostium-art) and is replaced, not patched.

## From Cole's lore changes (2026-11-23, bible/LORE_CHANGES_2026-11-23.md)
- Cards rework also covers: the Vessel's 14 cards (Open Hand, Bear It, Take Into Me, Give Back, Six Breaths, Exhale, Spit, Swallow, Sponge, Mantle, The Weighing, Keep Her Quiet, Unclench, The Whole Conjunction) and 15 Affliction cards, one per world (Drowning, Fen Rot, Fever, Black Lung, Ringing, False Light, Frostbite, The Split, Barrow Sickness, Venom Tremor, Stillness, The Hush, Ash-Mark, The Bloom, Seen): wounds and fears, never abstract penalties.
- Vessel motion set: calm and upright (the only hero not hunched); course stacks sit on the skin and do not hurt it.

## Hero path variants (2026-11-24)
- Rigs in out/rig/worlds/hero_paths_A_<key>/ and hero_paths_B_<key>/; bone names match the bases.
- IK needed: Executioner two-hand sword; Doomsayer and Chronomancer staffs are planted but parented to the hand.
- Retarget: Chronomancer/Fatebinder hourglass bone hangs from forearm_n (base idle turns it in the hand).
- Z-order: Plaguewright far arm draws before the head (reverse of base throw overrides).
- Accumulator: new 'vessel' bone (child of torso); top of vessel above the head line, check battle frame margin.
- Unused declared joints: Doomsayer pin/poppet, Mirrorhex pin.
- Elementalist paths carry the fire sign; per-course sign versions not yet exported (same 'sign' bone swap as base).
- Base rig: Oracle robe_front swings like a blade at large rotations; clamp it.
