from dsl import *

set_class("oracle", [2, 3, 4], [1, 2, 3, 4])
ALL = [1, 2, 3, 4]
V = "void"
# ------------------------------------------------------------------ kit
card("k_foresee", "Foresee", 0, "K", "self", [W(2), DRAW(1)], "Gain 2 Ward. Next round, draw 1 more.", cat=V)
card("k_hasten", "Hasten", 1, "K", "ally", [PRIME(3), DRAW(1)], "Prime 3. Next round, the chosen hero draws 1 more.", kw=["Prime"], cat=V)
card("k_delay", "Delay", 1, "K", "enemy", [DELAY()], "The target's action moves to the end of the foes' queue; if already last, it waits until next round.", cat=V)
# ------------------------------------------------------------------ starter
card("void_glimpse", "Void Glimpse", 1, "S", "enemy", [D(4), A(V, 1)], "Deal 4. Apply 1 Void.", cat=V, attr="stable")
card("portent", "Portent", 1, "S", "self", [W(3), PRIME(2)], "Gain 3 Ward. Prime 2.", cat=V, kw=["Prime"])
card("stall", "Stall", 1, "S", "enemy", [DELAY(), D(2)], "Delay the target. Deal 2.", cat=V)
card("ill_omen", "Ill Omen", 1, "S", "enemy", [ST("vulnerable", 1), ST("mark")], "The target becomes Vulnerable and Marked.", cat=V)
card("time_shear", "Time Shear", 2, "S", "enemy", [D(9)], "Deal 9.", cat=V)
card("foreseen_blow", "Foreseen Blow", 1, "S", "ally_other", [PRIME(4)], "Prime 4.", kw=["Prime"], cat=V)
# ------------------------------------------------------------------ common
card("glimpse_ahead", "Glimpse Ahead", 0, "C", "self", [DRAW(1)], "Next round, draw 1 more.", cat=V)
card("erode", "Erode", 1, "C", "enemy", [A(V, 2), CONS("block")], "Apply 2 Void. Strip the target's Block.", cat=V, attr="stable")
card("hollow_gaze", "Hollow Gaze", 1, "C", "enemy", [STRESS(-4, to="all_allies"), ST("mark")], "Mark the target. Every hero sheds 4 stress.", cat=V)
card("fate_twist", "Twist of Fate", 1, "C", "enemy", [DELAY(), ST("vulnerable", 1)], "Delay the target. It becomes Vulnerable.", cat=V)
card("void_lance", "Void Lance", 1, "C", "enemy", [D(6), A(V, 1, attr="volatile")], "Deal 6. Apply 1 Volatile Void.", cat=V)
card("premonition", "Premonition", 1, "C", "ally", [B(6), W(1)], "A hero gains 6 Block and 1 Ward.", cat=V)
card("augury", "Augury", 1, "C", "self", [PRIME(3), W(1)], "Prime 3. Gain 1 Ward.", cat=V, kw=["Prime"])
card("starlit_ward", "Starlit Ward", 1, "C", "ally", [W(3), STRESS(-3)], "A hero gains 3 Ward and sheds 3 stress.", cat=V)
card("crack_of_doom", "Crack of Doom", 1, "C", "enemy", [D(3), ST("doom", 4)], "Deal 3. Apply 4 Doom.", cat=V)
card("hourglass", "Hourglass", 1, "C", "self", [EN(1)], "Next round, +1 vigour.", cat=V)
card("blind_spot", "Blind Spot", 1, "C", "ally", [ST("dodge")], "A hero will Dodge the next hit this round.", cat=V)
card("whisper", "Whisper of the Deep", 0, "C", "enemy", [A(V, 1)], "Apply 1 Void.", cat=V, attr="stable")
card("forewarn", "Forewarn", 1, "C", "all_allies", [B(3, to="all_allies"), B(3, to="all_allies", if_="t.dd")], "Every hero gains 3 Block; 6 at Death's Door.", cat=V)
card("unravel", "Unravel", 1, "C", "enemy", [CONS("ward"), A(V, 1), D(3)], "Strip the target's Ward. Apply 1 Void. Deal 3.", cat=V, attr="stable")
card("stargaze", "Stargaze", 1, "C", "self", [STRESS(-8), DRAW(1)], "Shed 8 stress. Next round, draw 1 more.", cat=V)
card("pull_the_thread", "Pull the Thread", 1, "C", "enemy", [PULL(1), A(V, 1)], "Pull the target forward 1. Apply 1 Void.", cat=V, attr="stable")
card("guiding_light", "Guiding Light", 1, "C", "ally_other", [PRIME(2), ST("focus", 2)], "Prime 2. Another hero gains 2 Focus.", cat=V, kw=["Prime"])
card("event_horizon", "Event Horizon", 2, "C", "all_enemies", [A(V, 1), D(2)], "Deal 2 and apply 1 Void to every foe.", cat=V, attr="stable")
card("last_moments", "Last Moments", 1, "C", "enemy", [D(4), D(6, if_="t.hp_pct<50")], "Deal 4. Deal 6 more if the target is below half HP.", cat=V)
card("bad_tidings", "Bad Tidings", 1, "C", "enemy", [ST("doom", 3), STRESS(-3, to="self")], "Apply 3 Doom. Shed 3 stress.", cat=V)
# ------------------------------------------------------------------ uncommon
card("reverse_hourglass", "Reverse the Glass", 2, "U", "all_enemies", [DELAY(if_="t.attacking")], "Delay every foe that means to attack.", cat=V)
card("certain_doom", "Certain Doom", 2, "U", "enemy", [ST("doom", 8)], "Apply 8 Doom.", cat=V)
card("prophecy", "Prophecy", 1, "U", "self", [PRIME(5)], "Retain. Prime 5.", cat=V, kw=["Retain", "Prime"])
card("time_loop", "Time Loop", 2, "U", "enemy", [D(6)], "Echo. Deal 6.", cat=V, kw=["Echo"])
card("void_tether", "Void Tether", 1, "U", "enemy", [A(V, 2), ST("anchor")], "Apply 2 Void. The target cannot be moved this round.", cat=V, attr="stable")
card("dread_vision", "Dread Vision", 1, "U", "enemy", [D(0, per="t.void", k=4)], "Deal 4 per Void on the target.", cat=V)
card("fateline", "Fateline", 1, "U", "ally", [GUARD(), W(2)], "Guard a hero (you take their hits). They gain 2 Ward.", cat=V)
card("singular_moment", "Singular Moment", 1, "U", "self", [PRIME(0, per="round", k=2)], "Prime 2 per round this fight has lasted.", cat=V, kw=["Prime"])
card("mass_omen", "Mass Omen", 2, "U", "all_enemies", [ST("doom", 3), ST("vulnerable", 1, if_="t.doom>=6")], "Apply 3 Doom to every foe. Those at 6+ Doom become Vulnerable.", cat=V)
card("bend_time", "Bend Time", 1, "U", "self", [EN(1), DRAW(1)], "Next round, +1 vigour and draw 1 more. Exhaust.", cat=V, kw=["Exhaust"])
card("unwritten", "The Unwritten", 1, "U", "enemy", [CLR("might"), CLR("riposte"), CLR("thorns"), CONS("ward")], "The target loses its Might, Riposte, Thorns and Ward.", cat=V)
card("collapse", "Collapse", 2, "U", "enemy", [CONS(e=V), D(2, per="consumed", k=5)], "Consume the target's Void. Deal 2, plus 5 per stack.", cat=V)
card("orrery", "Orrery", 1, "U", "self", [W(0, per="enemies", k=2), PRIME(0, per="enemies")], "Gain 2 Ward and Prime 1 for each foe.", cat=V, kw=["Prime"])
card("cassandra", "Cassandra's Cry", 1, "U", "enemy", [ST("doom", 0, per="incoming")], "Apply Doom equal to all the damage the foes intend this round.", cat=V)
card("stay_the_hand", "Stay the Hand", 1, "U", "enemy", [ST("stun", if_="t.doom>=t.hp")], "Stun the target if its Doom has caught up with its HP.", cat=V)
card("quiet_hour", "The Quiet Hour", 2, "U", "self", [STRESS(-10, to="all_allies"), W(1, to="all_allies")], "Every hero sheds 10 stress and gains 1 Ward.", cat=V)
# ------------------------------------------------------------------ rare
card("stop_time", "Stop Time", 3, "R", "all_enemies", [DELAY()], "Delay every foe. Exhaust.", cat=V, kw=["Exhaust"])
card("apocalypse", "Apocalypse", 3, "R", "all_enemies", [ST("doom", 10)], "Apply 10 Doom to every foe. Exhaust.", cat=V, kw=["Exhaust"])
card("closed_eye", "The Closed Eye", 2, "R", "enemy", [EXEC(0, per="t.doom", k=1.5)], "Execute the target if its HP is no more than 1.5x its Doom.", cat=V)
card("all_seeing", "All-Seeing", 1, "R", "self", [DRAW(2), EN(1)], "Next round, draw 2 more and +1 vigour. Exhaust.", cat=V, kw=["Exhaust"])
card("rewind", "Rewind", 2, "R", "ally", [H(0, per="t.missing_hp", k=0.5), CLEANSE(4)], "A hero heals half their missing HP and is cleansed of 4 afflictions. Exhaust.", cat=V, kw=["Exhaust"])
card("eclipse", "Eclipse", 2, "R", "all_enemies", [A(V, 3)], "Apply 3 Volatile Void to every foe.", cat=V, attr="volatile")
card("grand_prophecy", "Grand Prophecy", 2, "R", "self", [PRIME(10)], "Prime 10. Exhaust.", cat=V, kw=["Prime", "Exhaust"])
card("fated_end", "Fated End", 1, "R", "enemy", [DBL(s="doom")], "Double the target's Doom.", cat=V)
card("wheel_turns", "The Wheel Turns", 1, "R", "enemy", [TURN()], "The target's attack this round strikes the foe beside it instead.", cat=V)
card("void_womb", "Void Womb", 2, "R", "self", [W(6), B(6), STRESS(-6)], "Gain 6 Ward and 6 Block. Shed 6 stress.", cat=V)
# ------------------------------------------------------------------ Chronomancer
CH = "chronomancer"
card("stutter", "Stutter", 1, "X", "enemy", [DELAY(), A(V, 1)], "Echo. Delay the target. Apply 1 Void.", cat=V, kw=["Echo"], sub=CH)
card("borrowed_time", "Borrowed Time", 0, "X", "self", [EN(1), STRESS(5)], "Next round, +1 vigour. Gain 5 stress.", cat=V, sub=CH)
card("time_dilation", "Time Dilation", 2, "X", "enemy", [DELAY(), ST("stun", if_="t.lightning>0")], "Delay the target. Stun it if it carries Lightning.", cat=V, sub=CH)
card("deja_vu", "Deja Vu", 1, "X", "enemy", [D(5)], "Echo. Retain. Deal 5.", cat=V, kw=["Echo", "Retain"], sub=CH)
card("haste_all", "Quickening", 2, "X", "self", [ST("momentum", 1, to="all_allies"), DRAW(1, to="all_allies")], "Every hero gains 1 Momentum and draws 1 more next round.", cat=V, sub=CH)
card("frozen_moment", "Frozen Moment", 1, "X", "enemy", [ST("anchor"), DELAY()], "The target cannot be moved, and is Delayed.", cat=V, sub=CH)
card("accelerate", "Accelerate", 1, "X", "ally_other", [ST("momentum", 2), PRIME(2)], "Another hero gains 2 Momentum. Prime 2.", cat=V, kw=["Prime"], sub=CH)
card("epoch", "Epoch", 3, "X", "all_enemies", [DELAY(), D(5)], "Delay every foe and deal 5 to each. Exhaust.", cat=V, kw=["Exhaust"], sub=CH)
# ------------------------------------------------------------------ Augur
AU = "augur"
card("read_the_bones", "Read the Bones", 1, "X", "self", [OMEN(3), EN(1)], "Gain 3 Omen. Next round, +1 vigour.", cat=V, sub=AU)
card("omen_bolt", "Omen Bolt", 1, "X", "enemy", [D(2, per="omen", k=2)], "Deal 2, plus 2 per Omen (not spent).", cat=V, sub=AU)
card("cash_the_omen", "Fulfil the Omen", 2, "X", "enemy", [CONS("omen", to="self"), D(0, per="consumed", k=4)], "Spend all Omen. Deal 4 per Omen spent.", cat=V, sub=AU)
card("omen_ward", "Warding Omen", 1, "X", "ally", [W(1, per="omen", k=0.5), B(4)], "A hero gains 4 Block and 1 Ward per 2 Omen.", cat=V, sub=AU)
card("sacrifice_hour", "Sacrificed Hour", 0, "X", "self", [OMEN(2), SELFDMG(2)], "Gain 2 Omen. Lose 2 HP.", cat=V, sub=AU)
card("entrails", "Entrails", 1, "X", "enemy", [D(5), OMEN(2, if_="killed")], "Deal 5. If it kills, gain 2 Omen.", cat=V, sub=AU)
card("bank_the_stars", "Bank the Stars", 1, "X", "self", [EN(2), OMEN(1)], "Next round, +2 vigour. Gain 1 Omen. Exhaust.", cat=V, kw=["Exhaust"], sub=AU)
card("doomsday_clock", "Doomsday Clock", 2, "X", "all_enemies", [ST("doom", 0, per="omen")], "Apply Doom equal to your Omen to every foe.", cat=V, sub=AU)
# ------------------------------------------------------------------ Fatebinder
FB = "fatebinder"
card("bind_fate", "Bind Fate", 1, "X", "self", [PRIME(3)], "Prime 3. Retain.", cat=V, kw=["Prime", "Retain"], sub=FB)
card("thread_cutter", "Thread Cutter", 1, "X", "enemy", [D(3, per="prime_count", k=4)], "Deal 3, plus 4 per Prime spent this round.", cat=V, sub=FB)
card("woven_shield", "Woven Shield", 1, "X", "all_allies", [B(2, per="prime_count", k=2, to="all_allies")], "Every hero gains 2 Block, plus 2 per Prime spent this round.", cat=V, sub=FB)
card("knot_of_fate", "Knot of Fate", 0, "X", "self", [PRIME(2)], "Prime 2.", cat=V, kw=["Prime"], sub=FB)
card("loom", "The Loom", 2, "X", "self", [PRIME(4), DRAW(1)], "Prime 4. Next round, draw 1 more.", cat=V, kw=["Prime"], sub=FB)
card("fates_edge", "Fate's Edge", 1, "X", "enemy", [D(4), PRIME(4, if_="killed")], "Deal 4. If it kills, Prime 4.", cat=V, sub=FB)
card("tapestry", "Tapestry", 2, "X", "all_enemies", [D(2, per="prime_count", k=3)], "Every foe takes 2, plus 3 per Prime spent this round.", cat=V, sub=FB)
card("severance", "Severance", 2, "X", "enemy", [EXEC(5, per="prime_count", k=5)], "Execute the target at 5 HP, plus 5 per Prime spent this round, or less.", cat=V, sub=FB)

HERO = {"name": "Oracle", "hp": 28, "armor": 0, "grit": 2, "color": "6d5a8a", "kit": ["k_foresee", "k_hasten", "k_delay"], "attuned": 5,
        "deck": ["void_glimpse", "void_glimpse", "portent", "portent", "stall", "ill_omen", "time_shear", "foreseen_blow", "glimpse_ahead", "crack_of_doom"],
        "subclasses": {"chronomancer": "Chronomancer", "augur": "Augur", "fatebinder": "Fatebinder"},
        "blurb": "Seer of the Void. Delays the foe, Primes the company, and writes Doom."}
