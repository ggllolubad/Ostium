# Interaction pass check: Bulwark, Duelist, Elementalist, Alchemist (independent checker, 2026-11-25)

## Engine fixes already made (do not work around them)
- **Where an attack lands:** one rule, `Combat.strikes(s, foe, hero)`, now decides whether a foe's attack lands on a hero. It honours Taunt, Guard, front2/back2 and all_heroes. `attackers` (as a target list and as a quantity), `targeting_me`, `targeted`, `incoming_me` and `incoming` all use it. `incoming` now counts `times`.
- **Bonus damage:** a dmg effect with `"bonus": True` folds into the hit just before it, so Armor and Block are paid once. Write "Deal N more ..." bonuses as `DMG(n, bonus=True, if_=...)` placed directly after their hit. Without the flag, a second dmg is a second hit; say so in the text ("hit again for N").
- **Zero damage:** a hit that comes to 0 (after Prime) does not land. No Might, no Dodge spent, no Thorns or Riposte.
- **Bank:** no longer lowers `vigour_left`, so "vigour left unspent" now means exactly that. Bank keeps at most the unspent vigour that no earlier Bank kept.
- **Echo:** keeps its Ordo place and spend (`ordo_pos`, `spent_before`), reads `cost`, and halves negative amounts (sheds) too.
- **Round start:** the Ordo ledger is reset, so round_start and round_end rites no longer read last round's values.
- **Thrift:** spent only when it was applied at plan time. A card that `cost_less` made free keeps the Thrift.
- **TRANSFER:** keeps stack sizes; the mover's Focus is no longer applied or spent.
- **Play rites:** a play rite whose effect is aimed at "that foe" no longer fires on its owner when the card has no foe target.

## bulwark
- [bug] bw_rime_coat, bw_deep_winter, bw_breath_of_the_north, bw_the_long_night: `to="attackers"` ignored Taunt and front2. FIXED in the engine; recheck the text.
- [bug] bw_hold_through_the_night, bw_bound_with_rope, bw_pine_and_iron: these read `vigour_left`, which Bank used to lower. FIXED; recheck values.
- [bug] bw_scar_tissue, bw_toll_of_the_tower, bw_undying_watch, bw_come_and_finish_it, bw_scourged_back: k=0.34 for "every 3 Scars" overpays from 50 Scars. Use k=0.3334.
- [balance] bw_cold_iron: a common giving 4 Block plus total Frost, up to 14. Cap it at 10 (12 upgraded).
- [balance] bw_shield_rim: Hex is uncapped, so this common reaches 11 or more Block. max=7 (9 upgraded).
- [balance] bw_toll_of_the_tower: a 2-cost common at 2 plus Scars/3 is far below rate. Make it cost 1 or deal 4.
- [balance] bw_dig_in: X takes the whole shared pool; at X 8 it gives 64 Block. Replace the doubling with a flat +6 at X 4 or more.
- [balance] bw_crown_of_iron_thorns: the `ally_hit` rite is uncapped. per_round 3.
- [balance] bw_hair_shirt: 0 cost for 4 Thorns, always correct. Make it cost 1, or give it Exhaust.
- [depth] bw_barbs_left_in, bw_barbed_haft, bw_iron_maiden: two cards make Bleed and one reads it, against DECISIONS row 3 (one bridge card). Keep Iron Maiden; turn Barbs Left In into a Thorns-to-damage or Vulnerable card.
- [depth] bw_shield_rim, bw_break_the_ice: commons with two reads. Move one read to the upgrade.
- [depth] bw_vengeance: needing 5 exhausted cards is rarely reachable. Use 3, or a Scars threshold.
- [depth] bw_hedge_of_spikes, bw_aegis_of_the_door: rares with no cross-read. Add one.
- [depth] bw_keep_the_back_rank: the relayed Brace stays permanently. Make the relayed card Exhaust, or Temporary.
- [style] bw_shoulder_their_burden: drop the cap text "up to 4/8"; it is the natural maximum.
- [style] bw_numbing_cold, bw_frostbite_bash: say "Soak" while others name the course. Name courses by their course name everywhere (Water, Frost, Fire, Lightning, Toxin, Void).
- [style] bw_k_bank_the_cold: set cat to physical, since it has no Frost effect.

## duelist
- [bug] du_the_endless_measure, du_serrated_rhythm: hit or Bleed the Duelist on his own self-target cards. FIXED in the engine; recheck.
- [balance] du_bloodmist: at X 8, 16 Bleed on every foe. Replace "X more at 4 or more" with "+2 at 4 or more".
- [balance] du_the_long_sentence: Mark 99 inflates `ailments` (Grave Cold deals 101). Use a smaller Mark that refreshes, or another tag.
- [balance] du_catch_the_rhythm: 0 cost, no drawback, always correct. Make it cost 1, or give it Exhaust.
- [balance] du_feather_cut: a 0-cost Retain common, always played. Drop Retain.
- [balance] du_red_hands, du_heavy_sentence: uncapped Bleed and Doom scaling. Cap at 20.
- [depth] du_fall_back_in_guard: the relayed Feather Cut does nothing for a non-Duelist and stays in their deck. Relay Prime or Thrift, or a Temporary card.
- [depth] du_quick_hands, du_hundred_touches: the arch says "alchemist_might" but they read vigour. Relabel.
- [depth] du_open_the_vein: the self-relayed Lancet stays permanently. Make it Temporary or Exhaust.
- [style] du_red_tide: say "equal to the dead foe's Bleed".
- [style] du_shatter_point: "Weaken" should be "Frost".

## elementalist
- [bug] el_double_flick: its own second application sets off the Conjunction, so the condition is always true. Move the Thrift effect first, so it reads only earlier Conjunctions.
- [bug] el_lend_the_nib: it relays a ranks-2-to-4 card that a rank-1 ally cannot play, and the card stays in their deck. Make the relayed card ranks 1 to 4 and Temporary or Exhaust.
- [bug] el_stopper_the_jar (kit), el_tip_the_vessel, el_stored_breath, el_brass_bands, el_pressure, el_weight_of_the_vessel: the `vigour_left` readers. FIXED by the Bank change; recheck values.
- [balance] el_reaction_shield, el_feedback, el_warding_sigil, el_backdraft, el_sigils_on_the_skin, el_steady_nerves: `per=reactions` is uncapped, and 6 to 8 Conjunctions a round is normal. Add a max to each (for example Reaction Shield up to 16).
- [balance] el_spark, el_spark_shower: any kit use meets "already acted", so both are free nearly every round. Read `others` (another hero already acted).
- [balance] el_full_measure: at X 8, 24 damage and 32 stacks. Drop the doubling, or cap X at 5.
- [balance] el_conflux: uncapped. Cap at 40.
- [depth] el_gall_ink, el_strip_the_plate: arch says duelist_flurry but they read Armor. Relabel.
- [depth] el_sulphur_match: the arch says alchemist_toxin, but the card punishes Toxin. Flip it to a bonus with Toxin, or relabel.
- [style] el_stopper_the_jar: cut "(this uses your Focus), so it does not fall this round".

## alchemist
- [bug] al_measured_dose: it relays Chaser (ranks 2 to 4) that a rank-1 ally cannot play, and it stays in their deck. Make the relayed card ranks 1 to 4 and Temporary or Exhaust.
- [bug] al_steady_hand: blank when not Dosed, with two conditions on a common. Make "Improve 1" unconditional plus "Dosed: Improve 1 more". (Thrift on free cards is FIXED.)
- [balance] al_buboes_burst: an uncapped area hit. max=21.
- [depth] al_magnum_opus: "cost less than printed" is reachable only through Tincture's Thrift. Give it a reachable `cost_less`, or read `flasks_used`.
- [depth] al_black_work, al_miasmatic_cloud: "first" works against their own Water read. Use Handoff or heroes_before.
- [depth] al_alembic ("bulwark_taunt"), al_liquid_courage ("duelist_strike"): they don't read what their arch names. Add the read or relabel.
- [depth] No X card, no `vigour_spent` reader, and Bank only on Restock. Add an X card or a big-turn card.
- [style] al_powder_charge: say "for each primed action this round".
- [style] al_greek_fire, al_boiling_flood, al_miasmatic_cloud: unify course naming (see bulwark).

## Relay rule for every module
A relayed card should be `Temporary` (gone at the end of the fight), or Exhaust, and usable from ranks 1 to 4, so relays never snowball a deck or land unplayable.
