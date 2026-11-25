"""World V: The Storm Foundry (Fire + Lightning, Plasma). Role map: docs/design/gate2/world_V_storm_foundry.md.

Plasma ignores Block and splashes Burn to the neighbours, so the company lives on Armor, Ward, healing, position and
killing fast. Static-layers (the storm side) and Burn-layers (the forge side), plus machines that shrug off
lightning and physical hits and crack under water."""
import dsl
from dsl import *
from creatures import *

W = "foundry"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

# ================================================================== world cards (Plasma)
card("w_foundry_arc_weld", "Arc Weld", 1, "W", "enemy",
     [D(3), A("lightning", 2, attr="stable"), A("fire", 1, attr="volatile", if_="same_target")],
     "Deal 3. Apply 2 Static. If the action before this one hit the same foe, apply 1 Volatile Burn.",
     cat="lightning", world=W, arch="world",
     flavour="It welds with its hammer. It welds with you, too.",
     note="Two heroes strike the same Arc-Smith in turn; the second blow closes the arc in a white-gold flash.",
     up={"text": "Deal 4. Apply 3 Static. If the action before this one hit the same foe, apply 1 Volatile Burn.",
         "fx": [D(4), A("lightning", 3, attr="stable"), A("fire", 1, attr="volatile", if_="same_target")]})
card("w_foundry_melt_down", "Melt Down", 1, "W", "enemy",
     [CONS(s="block", to="self"), D(3, per="consumed", k=1, max=15)],
     "Spend all your Block. Deal 3, plus 1 per Block spent (max 15).", world=W, arch="world",
     flavour="Plasma goes through Block like a pour through wax.",
     note="A hero's shield glows white at the rim and the hero drives the molten edge into a Slag Slave.",
     up={"text": "Spend all your Block. Deal 5, plus 1 per Block spent (max 18).",
         "fx": [CONS(s="block", to="self"), D(5, per="consumed", k=1, max=18)]})
card("w_foundry_quench", "Quench and Temper", 1, "W", "self",
     [CONS(e="fire", to="self"), AR(1, if_="consumed>0"), B(3)],
     "Remove all Burn from yourself. If you removed any, gain 1 Armor for the fight. Gain 3 Block.", world=W, arch="world",
     flavour="The smiths quench what the fire has softened. It comes out harder.",
     note="A burning hero plunges an arm into the slack tub; steam bursts up white round the anvil line.",
     up={"text": "Remove all Burn from yourself. If you removed any, gain 1 Armor for the fight. Gain 6 Block.",
         "fx": [CONS(e="fire", to="self"), AR(1, if_="consumed>0"), B(6)]})
card("w_foundry_out_of_the_splash", "Out of the Splash", 0, "W", "adjacent_ally", [SWAP(), dsl.W(1, to="self")],
     "Swap with an adjacent hero. Gain 1 Ward.", world=W, arch="world",
     flavour="Burn runs along the line. Do not stand in the line.",
     note="A hero shoulders a companion aside as a gout of burning bronze splashes where they stood.",
     up={"text": "Swap with an adjacent hero. Gain 2 Ward.", "fx": [SWAP(), dsl.W(2, to="self")]})

# ================================================================== foes
FORGE = {"fire": "resist", "lightning": "resist", "frost": "weak"}

creature("slag_slave", "Slag Slave", "foe", 40, ranks=[1], role="attacker",
         resist={"fire": "resist", "frost": "weak"},
         intents={"chain": I("Chain Swing", "attack", "front", [D(9)]),
                  "slag": I("Throw Slag", "attack", "back", [D(4), A("fire", 2, attr="stable")]),
                  "drag": I("Drag the Chain", "attack", "front2", [D(5)])},
         ai=[{"use": "slag", "every": 3}, {"use": "drag", "every": 3, "offset": 1}, {"use": "chain"}],
         lore="Chained at the neck to the anvil line. The cage on its head is for its own protection, they say.", world=W)

creature("bronze_automaton", "Bronze Automaton", "foe", 46, armor=2, ranks=[1], role="defender", charge_name="Clockwork",
         resist={"lightning": "immune", "physical": "resist", "water": "weak"},
         intents={"piston": I("Piston Punch", "attack", "front", [D(10)]),
                  "discharge": I("Discharge the Core", "attack", "all_heroes", [D(2), A("lightning", 1, attr="stable")]),
                  "stop": I("Wound Down", "defend", "self", [CLR("charge")])},
         ai=[{"use": "stop", "if": "charge>=4"}, {"use": "discharge", "every": 3}, {"use": "piston"}],
         traits=[T("round_start", "Clockwork", "Its key turns down a notch each round; at the last notch it stops for a "
                   "round unless it is wound.", [SELF("charge", 1)])],
         lore="Wound by hand, powered by storm. It does not tire, and it does not stop.", world=W)

creature("arc_smith", "Arc-Smith", "foe", 38, armor=1, ranks=[1, 2], role="attacker", resist=FORGE,
         intents={"strike": I("Charged Strike", "attack", "front", [D(6), A("lightning", 2, attr="stable")]),
                  "weld": I("Arc Weld", "attack", "front", [D(5), A("fire", 1, attr="volatile")]),
                  "hammer": I("Hammer", "attack", "front", [D(9)])},
         ai=[{"use": "strike", "every": 3}, {"use": "weld", "every": 3, "offset": 2}, {"use": "hammer"}],
         lore="It welds with its hammer. It welds with you, too.", world=W)

creature("bellows_imp", "Bellows Imp", "foe", 28, ranks=[3, 4], role="support",
         resist={"fire": "immune", "physical": "weak"},
         intents={"fan": I("Fan the Flames", "debuff", "all_heroes", [A("fire", 1, attr="stable")]),
                  "peck": I("Peck", "attack", "back", [D(3, times=2)]),
                  "flit": I("Flit", "defend", "self", [SELF("dodge", 1)]),
                  "stoke": I("Stoke", "buff", "ally_front", [ST("might", 1)])},
         ai=[{"use": "flit", "if": "hp_pct<50", "not_twice": True}, {"use": "fan", "every": 2},
             {"use": "stoke", "every": 3, "offset": 1}, {"use": "peck"}],
         lore="Small, winged and full of hot air. They keep the forges breathing.", world=W)

creature("spark_swarm", "Spark Swarm", "foe", 34, ranks=[1, 2], role="attacker", flags=["swarm"],
         resist={"lightning": "immune", "fire": "resist", "water": "weak"},
         intents={"sting": I("Stinging Sparks", "attack", "front", [D(2, times=3), A("lightning", 1, attr="stable")]),
                  "burst": I("Burst of Sparks", "attack", "random", [D(2), A("lightning", 1, attr="stable"), A("fire", 1, attr="stable")])},
         ai=[{"use": "burst", "every": 2}, {"use": "sting"}],
         personality="mindless", lore="Struck from the anvil and never cooled.", world=W)

creature("salamander", "Salamander", "foe", 32, ranks=[1, 2], role="attacker",
         resist={"fire": "immune", "frost": "weak"},
         intents={"bite": I("Darting Bite", "attack", "front", [D(7), A("fire", 1, attr="stable")]),
                  "flare": I("Blotches Flare", "attack", "front", [D(3), A("fire", 3, attr="stable")]),
                  "dart": I("Dart Aside", "defend", "self", [SELF("dodge", 1), B(4)])},
         ai=[{"use": "dart", "if": "hp_pct<50", "not_twice": True}, {"use": "flare", "every": 3}, {"use": "bite"}],
         lore="The smiths swore it lived in the fire. Now it does.", world=W)

creature("mould_sitter", "Mould-Sitter", "foe", 38, armor=4, ranks=[1], role="defender",
         resist={"fire": "resist", "physical": "resist", "frost": "weak"},
         intents={"blow": I("Stiff-Armed Blow", "attack", "front", [D(8), A("fire", 1, attr="stable")]),
                  "scream": I("Silent Scream", "debuff", "all_heroes", [STRESS(7)]),
                  "drip": I("Bronze Drips", "attack", "front2", [D(3), A("fire", 1, attr="stable")])},
         ai=[{"use": "scream", "every": 3, "offset": 1}, {"use": "drip", "every": 3}, {"use": "blow"}],
         traits=[T("hit", "Clay Mould", "Every hit cracks a piece of the mould away: it loses 1 Armor.",
                   [LOSE_ARMOR(1, to="self")])],
         lore="He sat for the guild's statue of a working man. The guild was short of time, and cast from life.", world=W)

creature("coke_heaver", "Coke-Heaver", "foe", 46, ranks=[1], role="attacker", resist=FORGE,
         intents={"shovel": I("Shovel of Coke", "attack", "front2", [D(5), A("fire", 1, attr="stable")]),
                  "swing": I("Shovel Swing", "attack", "front", [D(11)])},
         ai=[{"use": "shovel", "every": 2}, {"use": "swing"}],
         lore="He fed the furnaces one basket at a time. The furnaces are still hungry.", world=W)

creature("nail_wife", "Nail-Wife", "foe", 36, ranks=[1, 2], role="attacker", resist=FORGE,
         intents={"swing": I("Bristling Arm", "attack", "front", [D(8)]),
                  "nails": I("Nails Break Off", "attack", "front", [D(4), ST("bleed", 3)]),
                  "header": I("Hammer a Nail", "defend", "self", [B(6), SELF("thorns", 2)])},
         ai=[{"use": "header", "if": "hp_pct<50", "not_twice": True}, {"use": "nails", "every": 2}, {"use": "swing"}],
         traits=[T("hit", "Bristling", "The nails bite back: whoever strikes her takes 2.", [D(2)])],
         lore="She made nails by the thousand at her little hearth. When the storm came through, they all came back to her.",
         world=W)

creature("guild_warden", "Guild Warden", "foe", 36, ranks=[2, 3], role="afflicter", resist=FORGE,
         intents={"mark": I("Guild Mark", "attack", "random", [D(4), ST("mark", 1), A("fire", 2, attr="stable")]),
                  "fine": I("Fine", "debuff", "most_stress", [STRESS(9)]),
                  "check": I("True Measure", "buff", "ally_front", [AR(1)])},
         ai=[{"use": "check", "every": 3, "offset": 2}, {"use": "fine", "every": 2}, {"use": "mark"}],
         personality="cruel",
         lore="He kept the guild's true measure and fined anyone short of it. He has fined the storm twice.", world=W)

creature("automaton_tender", "Automaton Tender", "foe", 34, ranks=[3, 4], role="summoner",
         resist=FORGE,
         intents={"wind": I("Wind the Machine", "buff", "ally_front", [CLR("charge"), ST("might", 2)]),
                  "rewind": I("Wind It Back Up", "summon", "self", [SUMMON("bronze_automaton", max=1)]),
                  "oil": I("Oil the Joints", "heal", "ally_lowest", [H(8)]),
                  "crank": I("Crank Key", "attack", "rank2", [D(7)])},
         ai=[{"use": "rewind", "if": "allies<3", "not_twice": True}, {"use": "oil", "if": "ally_hurt", "not_twice": True},
             {"use": "wind", "every": 3}, {"use": "crank"}],
         lore="She wound the automata every morning and oiled them every night. They have stopped needing either, and "
              "she has not noticed.", world=W)

creature("hearth_cat", "Hearth Cat", "foe", 28, ranks=[1, 2], role="attacker", resist=FORGE,
         intents={"leap": I("Spitting Leap", "attack", "back", [D(7)]),
                  "scratch": I("Discharging Scratch", "attack", "front", [D(4), A("lightning", 2, attr="stable")]),
                  "arch": I("Arch the Back", "defend", "self", [SELF("dodge", 1)])},
         ai=[{"use": "arch", "if": "hp_pct<50", "not_twice": True}, {"use": "leap", "every": 2}, {"use": "scratch"}],
         traits=[T("hit", "Static Coat", "Whoever strikes it gains 1 Static.", [A("lightning", 1, attr="stable")])],
         personality="cunning", lore="It slept on the warm anvil every night. Every night is warm now.", world=W)

# ================================================================== elites
creature("cyclops_smith", "The Sparkblind Smith", "elite", 116, armor=3, ranks=[1, 2], role="attacker", resist=FORGE,
         intents={"brand": I("Brand", "attack", "random", [D(9), A("fire", 2, attr="stable"), ST("mark", 1)]),
                  "bar": I("Turn the Bar", "buff", "self", [SELF("might", 2)]),
                  "bellow": I("Bellow", "debuff", "all_heroes", [STRESS(8)]),
                  "hammer": I("Hammer Blow", "attack", "front", [D(15)]),
                  "quench": I("Quench", "defend", "self", [B(14), CLEANSE(3)])},
         ai=[{"use": "quench", "if": "elements_all>=6", "not_twice": True}, {"use": "brand", "every": 3},
             {"use": "bar", "every": 3, "offset": 1}, {"use": "bellow", "every": 4, "offset": 2}, {"use": "hammer"}],
         traits=[T("hit", "By Ear", "He hears whoever strikes him: the attacker is Marked.", [ST("mark", 1)])],
         lore="The master smith watched the fire until the sparks took his eyes. He works by the ring of the iron now.",
         world=W)

creature("talos_sentinel", "Talos Sentinel", "elite", 112, armor=4, ranks=[1], role="defender",
         resist={"fire": "immune", "physical": "resist", "lightning": "resist", "frost": "weak"},
         intents={"shield": I("Round Shield", "defend", "self", [B(16)]),
                  "thrust": I("Spear Thrust", "attack", "front", [D(12), ST("anchor", 2)]),
                  "stomp": I("Stomp", "attack", "all_heroes", [D(5)]),
                  "ichor": I("Ichor Spray", "attack", "back", [D(6), A("fire", 3, attr="stable")]),
                  "plug": I("Plug the Vein", "defend", "self", [CLEANSE(4), B(8)])},
         ai=[{"use": "plug", "if": "total_bleed>=4", "not_twice": True}, {"use": "shield", "if": "hp_pct<50", "not_twice": True},
             {"use": "stomp", "every": 3}, {"use": "ichor", "every": 3, "offset": 1}, {"use": "thrust"}],
         traits=[T("round_start", "One Vein", "A single nail plugs the heel: at round start it loses HP equal to its "
                   "Bleed, so Bleed hurts it twice.", [D(0, per="bleed", k=1, to="self")])],
         lore="A guardian of hollow bronze, filled with molten ichor. One vein in the heel holds it all.", world=W)

creature("wire_drawer", "The Wire-Drawer", "elite", 102, armor=2, ranks=[2], role="attacker", resist=FORGE,
         charge_name="Draw-Plate",
         intents={"whip2": I("Live Wire", "attack", "rank2", [D(7), PULL(1), ST("anchor", 1), A("lightning", 2, attr="stable")]),
                  "whip3": I("Longer Wire", "attack", "rank3", [D(7), PULL(1), ST("anchor", 1), A("lightning", 2, attr="stable")]),
                  "whip4": I("Wire to the Back", "attack", "back", [D(8), PULL(2), ST("anchor", 1), A("lightning", 2, attr="stable")]),
                  "haul": I("Haul Tight", "attack", "front", [D(13)]),
                  "coil": I("Coil the Wire", "defend", "self", [B(12)])},
         ai=[{"use": "whip4", "if": "charge>=3", "every": 2}, {"use": "whip3", "if": "charge>=2", "every": 2},
             {"use": "whip2", "every": 2}, {"use": "coil", "if": "hp_pct<40", "not_twice": True}, {"use": "haul"}],
         traits=[T("round_start", "Draw-Plate", "He draws a fresh length each round: his wire reaches one rank further "
                   "(rank 2, then 3, then the back).", [SELF("charge", 1)])],
         lore="He drew bronze into wire for the automata. The storm runs down every inch he ever made.", world=W)

creature("dray_horse", "The Dray Horse", "elite", 122, armor=3, ranks=[1], role="attacker",
         resist={"fire": "resist", "lightning": "resist", "frost": "weak"},
         intents={"rear": I("Rear and Crash", "attack", "front", [D(14), PUSH(1)]),
                  "sparks": I("Sparks Across the Rank", "attack", "front2",
                              [D(4), A("lightning", 1, attr="stable"), A("fire", 1, attr="stable")]),
                  "trample": I("Trample", "attack", "front2", [D(7)]),
                  "snort": I("Wild Eye", "debuff", "all_heroes", [STRESS(6)])},
         ai=[{"use": "sparks", "every": 3}, {"use": "snort", "every": 4, "offset": 2}, {"use": "trample", "every": 3, "offset": 1},
             {"use": "rear"}],
         traits=[T("round_start", "Storm-Shod", "It stamps and sparks: the front hero gains 1 Static each round.",
                   [A("lightning", 1, attr="stable", to="front_enemy")])],
         personality="mindless",
         lore="It hauled the bells out of the pits on a sledge. The storm shod it, and it will not be unshod.", world=W)

# ================================================================== rulers
creature("anvil_titan", "The Anvil Titan", "ruler", 300, armor=4, span=2, ranks=[3, 4], role="attacker",
         charge_name="Rhythm", resist={"physical": "resist", "fire": "resist", "lightning": "resist", "water": "weak"},
         intents={"tap": I("Tap the Anvil", "attack", "front", [D(9), A("lightning", 1, attr="stable")]),
                  "blow": I("The Full Blow", "attack", "front",
                            [D(14, pierce=True), A("lightning", 2, attr="stable"), A("fire", 1, attr="volatile"), CLR("charge")]),
                  "anvil": I("Become the Anvil", "defend", "self", [B(22), SELF("fortify", 2)]),
                  "furnace": I("Plasma Furnace", "attack", "all_heroes",
                               [D(3), A("lightning", 1, attr="stable"), A("fire", 1, attr="volatile")]),
                  "rivet": I("Rivet", "attack", "back", [D(10), ST("anchor", 2)]),
                  "plasma": I("Every Blow Is Plasma", "attack", "front",
                              [D(12, pierce=True), A("lightning", 1, attr="stable"), A("fire", 1, attr="volatile")])},
         ai=[{"use": "blow", "if": "charge>=2"}, {"use": "anvil", "every": 5, "offset": 3}, {"use": "tap"}],
         phases=[P(55, "The core splits and lightning spills from the seams.",
                   ai=[{"use": "blow", "if": "charge>=2"}, {"use": "furnace", "every": 2}, {"use": "rivet", "every": 3},
                       {"use": "tap"}], might=2),
                 P(20, "It leaves the anvil. There is no count now, and every blow is Plasma.",
                   ai=[{"use": "furnace", "every": 3}, {"use": "plasma"}], might=1)],
         traits=[T("round_start", "Rhythm", "It taps on a count of three; the third beat is the full blow, Plasma "
                   "through Block.", [SELF("charge", 1)])],
         lore="The foundry's first work. Its makers built it to strike the anvil forever. It found something softer.",
         world=W)

creature("crucible", "The Crucible", "ruler", 290, armor=3, span=2, ranks=[3, 4], role="attacker",
         flags=["immovable"], charge_name="The Bell", resist={"fire": "resist", "lightning": "resist", "frost": "weak"},
         intents={"wave": I("Wave of Bronze", "attack", "front2", [D(7), A("fire", 2, attr="stable")]),
                  "skim": I("Skimming Rod", "attack", "back", [D(10)]),
                  "swing": I("Swing on the Chains", "defend", "self", [B(18)]),
                  "plasma": I("Sparks Down the Stream", "attack", "front2",
                              [D(5), A("fire", 2, attr="stable"), A("lightning", 1, attr="volatile")]),
                  "chains": I("The Fused Chains Spark", "debuff", "all_heroes", [A("lightning", 1, attr="stable")]),
                  "bell": I("The Bell Rings", "debuff", "all_heroes", [D(3), STRESS(9)])},
         ai=[{"use": "bell", "if": "charge>=6", "not_twice": True}, {"use": "skim", "every": 3, "offset": 1},
             {"use": "swing", "every": 4, "offset": 3}, {"use": "wave"}],
         phases=[P(55, "It tips further. The wave reaches deeper, and the fused chains spark.",
                   ai=[{"use": "bell", "if": "charge>=6", "not_twice": True}, {"use": "chains", "every": 3},
                       {"use": "plasma"}], might=2),
                 P(20, "The bell is cast. The half-cast bell in the pit rings every round.",
                   ai=[{"use": "plasma", "every": 2}, {"use": "bell"}], might=1)],
         traits=[T("round_start", "The Pour", "Bronze runs into the bell pit each round; at 6 the bell rings. Frost or "
                   "Soak on the Crucible stops that round's pour.", [SELF("charge", 1, if_="!frost&!water")])],
         lore="It was tipped to pour the great bell when the storm struck. It has been pouring ever since, and the bell "
              "is not finished.", world=W)

creature("storm_catcher", "The Storm-Catcher", "ruler", 280, armor=3, span=2, ranks=[3, 4], role="afflicter",
         flags=["immovable"], resist={"fire": "resist", "lightning": "resist", "frost": "weak"},
         intents={"fern": I("Fern the Skin", "debuff", "random", [ST("mark", 1), A("lightning", 2, attr="stable")]),
                  "heave": I("Heave on the Cables", "attack", "all_heroes", [D(4), A("fire", 1, attr="volatile")]),
                  "spark": I("Spark Down the Cable", "attack", "back", [D(10), A("fire", 1, attr="stable")]),
                  "lean": I("Lean Back", "defend", "self", [B(16)]),
                  "ferns": I("The Cables Sing", "debuff", "back2", [ST("mark", 1), A("lightning", 2, attr="stable")]),
                  "let_go": I("He Lets Go", "attack", "all_heroes",
                              [D(6), A("lightning", 1, attr="stable"), A("fire", 1, attr="volatile")])},
         ai=[{"use": "heave", "every": 2}, {"use": "lean", "if": "hp_pct<75", "every": 5}, {"use": "fern", "every": 2, "offset": 1},
             {"use": "spark"}],
         phases=[P(55, "The cables sing. He marks two heroes a round, and sparks run down into his fists.",
                   ai=[{"use": "heave", "every": 2}, {"use": "ferns"}], might=2),
                 P(20, "He lets go of one cable. It whips across every rank, and the storm strikes every mark at once.",
                   ai=[{"use": "let_go"}], might=1)],
         traits=[T("hit", "Sparks in the Fists", "Below about half HP, whoever strikes him gains 1 Static.",
                   [A("lightning", 1, attr="stable", if_="hp_pct<55")])],
         lore="He built the spire that caught the storm for the forges. He is still holding on to it.", world=W)

# ================================================================== encounters
E = encounter
E(W, "foundry_f1", "The Anvil Line", "Slaves at the hammers, sparks everywhere.",
  ["slag_slave", "spark_swarm", "slag_slave"], "foundry_floor", "foe",
  "Static and Burn from every side: Plasma ignores Block, so Armor and Ward hold the line.")
E(W, "foundry_f2", "Bronze Watch", "An automaton, the smith beside it and the woman who winds it.",
  ["bronze_automaton", "arc_smith", "automaton_tender"], "foundry_floor", "foe",
  "Kill the Tender or the machine is wound back up; water cracks the machine.")
E(W, "foundry_f3", "The Bellows Roof", "Imps working the great bellows under the storm.",
  ["arc_smith", "bellows_imp", "bellows_imp"], "foundry_roof", "foe",
  "The imps grow every Burn and the smith arcs it into Plasma: reach rank 3.")
E(W, "foundry_f4", "The Casting from Life", "A man in a mould, sparks round him, the warden behind.",
  ["mould_sitter", "spark_swarm", "guild_warden"], "foundry_mould", "foe",
  "Many small hits crack the clay; the warden brands and fines from behind it and restores its Armor.")
E(W, "foundry_f5", "The Back Streets", "Coke, nails and a cat on the warm anvil.",
  ["coke_heaver", "nail_wife", "hearth_cat"], "foundry_floor", "foe",
  "Nails and a Static coat: melee heroes pay to hit; reach and courses do not.")
E(W, "foundry_f6", "Feeding the Furnace", "The heaver, the fire's own creature and an imp.",
  ["coke_heaver", "salamander", "bellows_imp"], "foundry_mould", "foe",
  "Burn stacks fast: frost the salamander and Ward against the splash.")
E(W, "foundry_f7", "Brands and Nails", "The guild's mark and a nail-maker's arm.",
  ["nail_wife", "salamander", "guild_warden"], "foundry_roof", "foe",
  "Bleed from the nails, Burn from the salamander, and the Mark tells you where the next blow lands.")
E(W, "foundry_f8", "The Morning Winding", "Four bodies and a rewind.",
  ["bronze_automaton", "hearth_cat", "bellows_imp", "automaton_tender"], "foundry_roof", "foe",
  "Hits on every foe, then the Tender before she winds the machine back up.")
E(W, "foundry_e1", "The Master Smith", "The Sparkblind Smith at his anvil, listening.",
  ["cyclops_smith", "mould_sitter", "arc_smith"], "foundry_mould", "elite",
  "He hears whoever strikes him and his brands follow: split the work across heroes or Guard the loud one.")
E(W, "foundry_e2", "Talos at the Gate", "A bronze giant, with its heel to the wall.",
  ["talos_sentinel", "guild_warden", "bellows_imp"], "foundry_roof", "elite",
  "Bleed the heel: the vein takes Bleed twice, until it plugs the vein; the warden keeps its Armor up.")
E(W, "foundry_e3", "The Wire Walk", "Live wire strung across the roof.",
  ["nail_wife", "wire_drawer", "spark_swarm"], "foundry_roof", "elite",
  "The wire reaches further each round and drags the back forward: kill him before it reaches the back rank.")
E(W, "foundry_e4", "The Sledge Road", "The dray horse rears in its broken traces.",
  ["dray_horse", "slag_slave", "arc_smith"], "foundry_floor", "elite",
  "Sparks off the hooves Static the front pair and the smith's weld lands the Plasma: Swap the pair apart.")
E(W, "foundry_r_anvil_titan", "The Anvil Titan", "The foundry's first and worst work.",
  ["bronze_automaton", "automaton_tender", "anvil_titan"], "foundry_boss", "ruler",
  "The Tender keeps the automaton coming; the Titan's third beat goes through Block: Armor and Ward the front.")
E(W, "foundry_r_crucible", "The Crucible", "The great pot hangs tilted over the bell pit.",
  ["mould_sitter", "spark_swarm", "crucible"], "foundry_boss", "ruler",
  "Frost and Soak stop pours and delay the bell; the front line takes every wave.", props="crucible")
E(W, "foundry_r_storm_catcher", "The Storm-Catcher", "He holds the storm by two cables.",
  ["hearth_cat", "bellows_imp", "storm_catcher"], "foundry_boss", "ruler",
  "Ward the marked heroes, Swap them away from Burned neighbours, and race him before he lets go.",
  props="storm_catcher")

NEEDS = [
    "cyclops_smith By Ear: should target the hero who played the most cards last round (needs intent target "
    "'most_played'); written as a trait that Marks whoever strikes him, with a random-target brand.",
    "anvil_titan Something Softer: the full blow should fall on the hero it struck last unless Taunt or Guard turns it "
    "(needs intent target 'last_struck'); written on the front hero.",
    "automaton_tender Wind the Machine: the wound machine should act twice next round; written as clearing its "
    "Clockwork and 2 Might.",
    "bellows_imp Fan the Flames: should raise only Burn a hero already carries by 1; written as 1 Burn on every hero.",
    "storm_catcher The Cables: Ward on a marked hero should clear the mark; Ward already cancels the Static his strike "
    "needs, so the Plasma fails, but the Mark stays.",
    "crucible: phase 3 should also begin when the bell count completes, not only at 20% HP; written as the bell ringing "
    "at 6 in every phase.",
    "bronze_automaton Wound Down: the intent text reads 'spends its Clockwork' for a round in which it does nothing.",
    "automaton_tender Wind the Machine: the intent text reads 'spends its charge' but the charge cleared is the "
    "machine's Clockwork (text should read 'winds it').",
]
