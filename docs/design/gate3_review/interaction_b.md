# Interaction pass check: Oracle, Hexweaver, Vessel, neutral and world cards (independent checker, 2026-11-25)

## Engine fixes already made
See the top of interaction_a.md:
- one landing rule for attacks (`strikes`);
- `bonus=True` damage folds into the previous hit;
- 0 hits do not land;
- Bank leaves `vigour_left`;
- Echo keeps its place and spend, and halves sheds;
- the ledger is reset at round start;
- Thrift is spent only where applied;
- TRANSFER keeps stack sizes;
- foe-aimed play rites never hit their owner.

Also: the Ordo preview now prices each card with the plan before it. That stays true. Cards that grant Thrift or Bank from a "last" or `vigour_left` read can still be wrong in the preview when later cards are added, so prefer reads that do not change when cards are appended after them.

## Cross-cutting
- [bug] Bonus damage written as a separate hit: Time Shear "last +3", Balanced Hands "+2", Shoulder Aside, Ladle, Ice Breaker, Blasting Charge "+3 if last" and others. Use `bonus=True` right after the hit, or print "hit again for N".
- [bug] dmg with a base of 0 in some branches: The Weighing, Unheeded Warning, Return to Sender, Bitter Gift, Glass Splinters, Heavy Air, Illuminated Initial, Paralysing Sting, Blasting Charge, Struck Out, Weight of the World. They no longer land, but check the text still reads true.
- [bug] Readers of "no vigour left unspent" (Pendulum, Bandage Roll, Penitent's Lash): FIXED by the Bank change. Recheck.

## oracle
- [bug] or_deja_vu: uncapped, and Echo now reads its real place. max 10 (12 upgraded).
- [bug] or_broken_pendulum: FIXED (Echo keeps its spend). Recheck.
- [bug] or_bind_fate: "per other card in your hand" counts the cards you keep. Write "per card you keep in hand this round". Remove the stale NEEDS line.
- [balance] or_gathering_thread: uncapped Prime (13 or more). max 10 (12 upgraded).
- [balance] or_woven_mantle: 36 Block for 2 vigour. k=1 (2 upgraded), or max 6 each.
- [balance] or_the_bone_pouch: 32 Block and 16 Ward a round at 8 Omen. max 5 Block and 2 Ward.
- [balance] or_cassandra: the ally_hit rite is uncapped. per_round 2.
- [balance] or_knot: a 0-cost Prime 4 Handoff that is always arrangeable. Prime 3 (4 upgraded).
- [balance] or_wring_the_bird: 0 cost, 2 Omen for 1 HP, always played. Exhaust, or 2 HP.
- [depth] or_skipped_tooth: "cost 1 or less" is dead in most decks. Give it `cost_less`.
- [depth] or_written_ahead: a rare with no cross-read. Add one.
- [depth] or_stopped_clock, or_spill_the_ink: path cards with no read. Add one.

## hexweaver
- [bug] signed_in_blood: the play rite landed on the owner. FIXED in the engine; check the text.
- [balance] toll_the_hour: uncapped Execute 3 × place. max 15 (20 upgraded).
- [balance] deaths_ledger: Doom equal to missing HP kills any foe at half HP. k=0.5, max 15.
- [balance] blood_offering: the upgrade gives +1 vigour for 1 HP at 0 cost. Keep "lose 2 HP".
- [balance] take_their_wounds: relays a 0-cost Tithe (+1 Might) that stacks. Relay a Temporary empower token, or Exhaust.
- [depth] twist_the_pin: a common with two reads. Drop the same_target line.
- [depth] knock_at_the_door: Death's Door rarely happens. Read hp_pct<=25.
- [style] blood_offering: the upgrade keeps Dosed with no Dosed effect.
- [style] return_to_sender: the same card as Oracle's Unheeded Warning. Read incoming_me or Thorns.
- [style] signed_in_blood: "plus 1 per HP lost" pads a fixed 5. the_witchs_glass has a stale NEEDS line.

## vessel
- [bug] ve_warm_room: grants Thrift from a read that can change after it. Use a read that later cards cannot change.
- [balance] ve_spit + ve_gorge: Gorge adds permanent free Spits. Make Gorge's token Temporary.
- [balance] ve_illumination: 0-cost Prime up to 4 on a Handoff. Add 1 stress, or cost 1.
- [balance] ve_stoke: 0 cost, up to 6 Block. 2 Block each.
- [balance] ve_whole_conjunction: the upgrade makes every play Whole. Thrift to one hero only.
- [balance] ve_weight_of_it: a common reaching 12 damage. max 9 (12 upgraded).
- [depth] The Whole path has eight "hold 1 of each course you do not hold" cards (a straight line). Turn two into Take-based or foe-based inputs.
- [depth] ve_pass_through: the relayed Bear It stays and reads the ally's held courses (0). Use a Temporary token written for any hero.
- [style] Stale NEEDS: rite context has no handoff, cost or heroes_before. It does now; remove the line.
- [style] ve_shoulder_it: "it gains" should be "they gain".
- [style] ve_second_mouthful: the common's text is too long.

## neutral
- [bug] change_of_watch: grants Thrift from a "last" read that can change after it. Use a read later cards cannot change.
- [bug] fenns_alms: double-dips with Bank. Write it as Bank 2 plus EN 1, or similar.
- [depth] into_the_gap: a common with two reads. Drop the Handoff push.
- [style] candle_bundle: "2 or more other cards".

## worlds
- [bug] w_garden_nothing_regrows, w_pyre_fire_unending, w_sky_something_leans_closer: target "none" makes them unplayable. Use target "self".
- [bug] w_garden_take_the_rot, w_pits_throw_it_back: `ally_most` never picks the caster. The text should say "another hero".
- [bug] w_coast_lash_it_down: "per card in your hand" counts the cards you keep; say so.
- [balance] w_foundry_quench: permanent Armor every play. Exhaust.
- [balance] w_foundry_out_of_the_splash: strictly better than the Swap kit. Cost 1, 2 Ward.
- [depth] w_baths_open_valve, w_hive_spire_storm: "6 or more vigour spent" is impossible with 2 heroes. Scale it with the pool (`vigour_spent >= vigour_pool`), or use a lower number.
- [style] Unify course names: say Water, Lightning, Fire (not Soak, Static, Burn).
- [style] w_spire_second_hand repeats the Oracle kit's name; w_garden_take_the_rot nearly repeats Hexweaver's Take the Rot.
- [style] w_garden_nothing_regrows and w_sky_something_leans_closer reuse affliction flavour lines. World rites should say "Rite:".
- [style] w_spire_stop_the_watch: say "Delay it."

## Relay rule for every module
A relayed card should be `Temporary`, or Exhaust, and usable from ranks 1 to 4.
