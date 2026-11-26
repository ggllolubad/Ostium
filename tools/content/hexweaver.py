from dsl import *

set_class("hexweaver", [2, 3, 4], [1, 2, 3, 4])
ALL = [1, 2, 3, 4]
T, V = "toxin", "void"
# ------------------------------------------------------------------ kit
card("k_hex", "Hex", 1, "K", "enemy", [ST("hex", 2)], "Apply 2 Hex.", cat=V)
card("k_transfer", "Transfer", 1, "K", "enemy", [TRANSFER("ally_most")], "Lift every affliction from the most afflicted hero and lay it on the target.", cat=V)
card("k_unleash", "Unleash", 1, "K", "enemy", [CONS("hex"), D(0, per="consumed", k=3)], "Consume the target's Hex. Deal 3 per stack.", cat=V)
# ------------------------------------------------------------------ starter
card("curse_bolt", "Curse Bolt", 1, "S", "enemy", [D(4), ST("hex", 1)], "Deal 4. Apply 1 Hex.", cat=V)
card("blight_touch", "Blight Touch", 1, "S", "enemy", [A(T, 2), ST("hex", 1)], "Apply 2 Toxin and 1 Hex.", cat=T, attr="stable")
card("withering", "Withering", 1, "S", "enemy", [ST("hex", 2), CLR("might")], "Apply 2 Hex. The target loses its Might.", cat=V)
card("dark_pact", "Dark Pact", 0, "S", "self", [SELFDMG(3), PRIME(4)], "Lose 3 HP. Prime 4.", cat=V, kw=["Prime"])
card("hex_ward", "Hex Ward", 1, "S", "ally", [W(2), B(4)], "A hero gains 2 Ward and 4 Block.", cat=V)
card("malediction", "Cracked Skull", 2, "S", "enemy", [D(5), ST("hex", 3)], "Deal 5. Apply 3 Hex.", cat=V)
# ------------------------------------------------------------------ common
card("evil_eye", "Evil Eye", 0, "C", "enemy", [ST("hex", 1), ST("mark")], "Apply 1 Hex. Mark the target.", cat=V)
card("rotting_word", "Rotting Word", 1, "C", "enemy", [A(T, 3)], "Apply 3 Toxin.", cat=T, attr="stable")
card("hex_bolt", "Hex Bolt", 1, "C", "enemy", [D(3, per="t.hex", k=1)], "Deal 3, plus 1 per Hex on the target.", cat=V)
card("spite", "Spite", 1, "C", "enemy", [D(4, per="debuffs", k=1)], "Deal 4, plus 1 per affliction you carry.", cat=V)
card("bitter_tongue", "Bitter Tongue", 1, "C", "all_enemies", [ST("hex", 1)], "Apply 1 Hex to every foe.", cat=V)
card("blood_offering", "Blood Offering", 1, "C", "self", [SELFDMG(4), EN(1)], "Lose 4 HP. Next round, +1 vigour.", cat=V)
card("graveyard_dirt", "Graveyard Dirt", 1, "C", "enemy", [A(T, 2), A(V, 1)], "Apply 2 Toxin and 1 Void.", cat=V, attr="stable")
card("pin_the_doll", "Pin the Doll", 1, "C", "enemy", [ST("hex", 1), D(2, times=2)], "Apply 1 Hex. Deal 2 twice.", cat=V)
card("misfortune", "Misfortune", 1, "C", "enemy", [ST("vulnerable", 1, if_="t.hex>=2"), ST("hex", 1)], "Apply 1 Hex. A foe already at 2+ Hex becomes Vulnerable.", cat=V)
card("absorb_pain", "Absorb Pain", 1, "C", "ally_other", [CLEANSE(3), STRESS(3, to="self")], "Cleanse 3 afflictions from another hero. You gain 3 stress.", cat=V)
card("withering_glance", "Withering Glance", 1, "C", "enemy", [AR(-2, to="target"), ST("hex", 1)], "The target loses 2 Armor. Apply 1 Hex.", cat=V)
card("dirge", "Dirge", 1, "C", "all_enemies", [D(2, if_="t.hex>0"), D(2)], "Deal 2 to every foe; 4 to those with Hex.", cat=V)
card("venom_kiss", "Venom Kiss", 1, "C", "enemy", [A(T, 2, attr="volatile"), D(3)], "Deal 3. Apply 2 Volatile Toxin.", cat=T)
card("drain", "Drain", 1, "C", "enemy", [D(5, lifesteal=100)], "Deal 5. Heal the damage dealt.", cat=V)
card("black_candle", "Black Candle", 1, "C", "self", [W(3), STRESS(-4)], "Gain 3 Ward. Shed 4 stress.", cat=V)
card("tithe_of_blood", "Cut Palm", 0, "C", "self", [SELFDMG(2), SELF("might", 1)], "Lose 2 HP. Gain 1 Might.", cat=V)
card("whispered_name", "Whispered Name", 1, "C", "enemy", [ST("hex", 2), STRESS(-3, to="self")], "Apply 2 Hex. Shed 3 stress.", cat=V)
card("corpse_candle", "Corpse Candle", 1, "C", "enemy", [ST("doom", 3), A(T, 1)], "Apply 3 Doom and 1 Toxin.", cat=T, attr="stable")
card("sour_milk", "Sour Milk", 1, "C", "enemy", [A(T, 1), A(T, 1, to="adjacent")], "Apply 1 Toxin to the target and the foes beside it.", cat=T, attr="stable")
card("hex_shield", "Hexed Shield", 1, "C", "self", [B(3, per="total_hex", k=1)], "Gain 3 Block, plus 1 per Hex on all foes.", cat=V)
card("hag_finger", "Hag's Finger", 1, "C", "enemy", [PULL(1), ST("hex", 1)], "Pull the target forward 1. Apply 1 Hex.", cat=V)
card("nightshade", "Nightshade", 1, "C", "enemy", [A(T, 2), STRESS(-2, to="all_allies")], "Apply 2 Toxin. Every hero sheds 2 stress.", cat=T, attr="stable")
# ------------------------------------------------------------------ uncommon
card("rot_from_within", "Canker", 2, "U", "enemy", [D(0, per="t.toxin", k=3)], "Deal 3 per Toxin on the target.", cat=T)
card("plague_of_hexes", "Plague of Hexes", 2, "U", "all_enemies", [ST("hex", 2)], "Apply 2 Hex to every foe.", cat=V)
card("hex_spread", "Contagion", 1, "U", "enemy", [ST("hex", 0, per="t.hex", to="adjacent")], "The foes beside the target gain Hex equal to its Hex.", cat=V)
card("double_hex", "Twofold Curse", 1, "U", "enemy", [DBL(s="hex")], "Double the target's Hex.", cat=V)
card("blight_bloom", "Blight Bloom", 1, "U", "enemy", [A(T, 2, attr="stable"), A(V, 1, attr="volatile")], "Apply 2 Toxin, then 1 Volatile Void: Blight.", cat=V)
card("soul_siphon", "Soul Siphon", 2, "U", "enemy", [D(8, lifesteal=50), STRESS(-6, to="self")], "Deal 8, healing half. Shed 6 stress.", cat=V)
card("burden_shift", "Burden Shift", 1, "U", "enemy", [TRANSFER("self"), D(0, per="consumed", k=2)], "Lay your own afflictions on the target. Deal 2 per affliction moved.", cat=V)
card("bone_charm", "Bone Charm", 1, "U", "ally", [W(3), ST("regen", 2)], "A hero gains 3 Ward and Regen 2.", cat=V)
card("wither_armor", "Unmake Iron", 2, "U", "enemy", [AR(-4, to="target"), A(T, 2)], "The target loses 4 Armor. Apply 2 Toxin.", cat=T, attr="stable")
card("curse_of_weakness", "Curse of Frailty", 1, "U", "enemy", [ST("vulnerable", 2), ST("hex", 1)], "The target is Vulnerable for 2 rounds. Apply 1 Hex.", cat=V)
card("hollow_pact", "Hollow Pact", 1, "U", "self", [SELFDMG(6), SELF("might", 2)], "Lose 6 HP. Gain 2 Might.", cat=V)
card("weeping_sores", "Weeping Sores", 1, "U", "enemy", [ST("bleed", 0, per="t.toxin"), A(T, 1)], "Apply Bleed equal to the target's Toxin, then 1 Toxin.", cat=T, attr="stable")
card("unleash_all", "Unleash All", 2, "U", "all_enemies", [CONS("hex"), D(0, per="consumed", k=2)], "Consume Hex from every foe. Each takes 2 per Hex consumed so far.", cat=V)
card("mourners_veil", "Mourner's Veil", 1, "U", "self", [W(2, to="all_allies"), STRESS(-3, to="all_allies")], "Every hero gains 2 Ward and sheds 3 stress.", cat=V)
card("blood_moon", "Blood Moon", 2, "U", "enemy", [D(6, per="missing_hp", k=0.5)], "Deal 6, plus 1 per 2 HP you are missing.", cat=V)
card("hex_lock", "Hex Lock", 1, "U", "enemy", [ST("stun", if_="t.hex>=5")], "Stun the target if it has 5+ Hex.", cat=V)
# ------------------------------------------------------------------ rare
card("grand_malediction", "Grand Malediction", 3, "R", "all_enemies", [ST("hex", 4)], "Apply 4 Hex to every foe. Exhaust.", cat=V, kw=["Exhaust"])
card("death_curse", "Death Curse", 2, "R", "enemy", [EXEC(0, per="t.hex", k=3)], "Execute the target if its HP is 3x its Hex or less.", cat=V)
card("plaguebringer", "Plaguebringer", 2, "R", "all_enemies", [A(T, 3), ST("hex", 1)], "Apply 3 Toxin and 1 Hex to every foe.", cat=T, attr="stable")
card("soul_rend", "Soul Rend", 2, "R", "enemy", [D(6, true=True), D(0, per="t.hex", k=2, true=True)], "Deal 6 true damage, plus 2 per Hex, ignoring Block and Armor.", cat=V)
card("pact_of_bones", "Crow Skull", 1, "R", "self", [SELFDMG(8), EN(2)], "Lose 8 HP. Next round, +2 vigour. Exhaust.", cat=V, kw=["Exhaust"])
card("blackest_night", "Blackest Night", 2, "R", "all_enemies", [A(V, 2), STRESS(-8, to="all_allies")], "Apply 2 Void to every foe. Every hero sheds 8 stress.", cat=V, attr="stable")
card("scapegoat", "Scapegoat", 2, "R", "enemy", [TRANSFER("ally_most"), TURN()], "Transfer the worst-afflicted hero's afflictions to the target, and turn its attack on its ally.", cat=V)
card("witching_hour", "Witching Hour", 1, "R", "self", [DBL(s="hex", to="all_enemies")], "Double the Hex on every foe. Exhaust.", cat=V, kw=["Exhaust"])
card("lich_mark", "Lich's Mark", 2, "R", "enemy", [ST("doom", 0, per="t.hex", k=3)], "Apply Doom equal to 3x the target's Hex.", cat=V)
card("devour", "Devour", 2, "R", "enemy", [D(10, lifesteal=100), STRESS(5, to="self")], "Deal 10, healing all of it. Gain 5 stress.", cat=V)
# ------------------------------------------------------------------ Pactbound
PB = "pactbound"
card("signed_in_blood", "Signed in Blood", 0, "X", "self", [SELFDMG(5), EN(2)], "Lose 5 HP. Next round, +2 vigour.", cat=V, sub=PB)
card("pain_engine", "Pain Engine", 1, "X", "enemy", [D(0, per="missing_hp")], "Deal damage equal to your missing HP.", cat=V, sub=PB)
card("the_price", "The Price", 1, "X", "self", [SELFDMG(4), PRIME(8)], "Lose 4 HP. Prime 8.", cat=V, kw=["Prime"], sub=PB)
card("tormented", "Tormented", 1, "X", "self", [STRESS(10), SELF("might", 3)], "Gain 10 stress. Gain 3 Might.", cat=V, sub=PB)
card("sanguine_pact", "Sanguine Pact", 1, "X", "enemy", [D(6, lifesteal=100)], "Deal 6, healing all of it.", cat=V, sub=PB)
card("martyrs_hex", "Martyr's Hex", 1, "X", "enemy", [SELFDMG(3), ST("hex", 4)], "Lose 3 HP. Apply 4 Hex.", cat=V, sub=PB)
card("open_the_door", "Open the Door", 2, "X", "enemy", [D(10, if_="!dd"), D(25, if_="dd")], "Deal 10; 25 if you are at Death's Door.", cat=V, sub=PB)
card("unholy_vigour", "Unholy Vigour", 1, "X", "self", [ST("regen", 4, to="self"), STRESS(6)], "Gain Regen 4. Gain 6 stress.", cat=V, sub=PB)
# ------------------------------------------------------------------ Doomsayer
DS = "doomsayer"
card("prophet_of_doom", "Raven", 1, "X", "enemy", [ST("doom", 6)], "Apply 6 Doom.", cat=V, sub=DS)
card("knell", "Bell-Cote", 1, "X", "all_enemies", [ST("doom", 3)], "Apply 3 Doom to every foe.", cat=V, sub=DS)
card("hasten_doom", "Hasten the End", 1, "X", "enemy", [D(0, per="t.doom", k=0.5)], "Deal half the target's Doom.", cat=V, sub=DS)
card("deaths_ledger", "Death's Ledger", 2, "X", "enemy", [ST("doom", 0, per="t.missing_hp")], "Apply Doom equal to the HP the target is missing.", cat=V, sub=DS)
card("final_hour", "Snuff Out", 2, "X", "enemy", [EXEC(0, per="t.doom")], "Execute the target if its Doom has met its HP.", cat=V, sub=DS)
card("dooms_ward", "Doomward", 1, "X", "self", [B(0, per="enemies", k=3)], "Gain 3 Block per foe.", cat=V, sub=DS)
card("harbinger", "Harbinger", 2, "X", "enemy", [ST("doom", 4), ST("hex", 2), ST("vulnerable", 1)], "Apply 4 Doom, 2 Hex and Vulnerable.", cat=V, sub=DS)
card("toll_of_bells", "Peal", 3, "X", "all_enemies", [DBL(s="doom")], "Double the Doom on every foe. Exhaust.", cat=V, kw=["Exhaust"], sub=DS)
# ------------------------------------------------------------------ Mirrorhex
MH = "mirrorhex"
card("mirror_mirror", "Looking Glass", 1, "X", "enemy", [TURN()], "The target's attack this round strikes the foe beside it instead.", cat=V, sub=MH)
card("reflect_pain", "Reflect Pain", 1, "X", "self", [SELF("thorns", 4), W(1)], "Gain 4 Thorns and 1 Ward.", cat=V, sub=MH)
card("borrowed_curse", "Borrowed Curse", 1, "X", "enemy", [TRANSFER("self"), ST("hex", 1)], "Lay your afflictions on the target. Apply 1 Hex.", cat=V, sub=MH)
card("glass_ward", "Glass Ward", 1, "X", "ally", [ST("riposte", 3), W(2)], "A hero gains Riposte 3 and 2 Ward.", cat=V, sub=MH)
card("cracked_mirror", "Cracked Mirror", 2, "X", "enemy", [D(0, per="t.might", k=4), D(4)], "Deal 4, plus 4 per Might the target holds.", cat=V, sub=MH)
card("echo_hex", "Echoing Hex", 1, "X", "enemy", [ST("hex", 2)], "Echo. Apply 2 Hex.", cat=V, kw=["Echo"], sub=MH)
card("silver_lie", "Silver Lie", 1, "X", "enemy", [STEAL()], "Take the target's Block as your own.", cat=V, sub=MH)
card("hall_of_mirrors", "Hall of Mirrors", 3, "X", "all_enemies", [TURN()], "Every foe's attack this round strikes its neighbour instead. Exhaust.", cat=V, kw=["Exhaust"], sub=MH)

HERO = {"name": "Hexweaver", "hp": 30, "armor": 0, "grit": 2, "color": "62804f", "kit": ["k_hex", "k_transfer", "k_unleash"], "attuned": 4,
        "deck": ["curse_bolt", "curse_bolt", "blight_touch", "blight_touch", "withering", "dark_pact", "hex_ward", "malediction", "evil_eye", "drain"],
        "subclasses": {"pactbound": "Pactbound", "doomsayer": "Doomsayer", "mirrorhex": "Mirrorhex"},
        "blurb": "Curse-weaver of Toxin and Void. Lays Hex, shifts the company's afflictions onto the foe."}
