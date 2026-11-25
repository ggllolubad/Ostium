"""World IV: The Sulphur Pits (Fire + Toxin, Combust). Role map: docs/design/gate2/world_IV_sulphur_pits.md.

Fuel and spark: gas-bearers lay Toxin, igniters land Volatile Burn the round after. Many foes are full of gas and burst
when Burned. Countdowns (fuses, lamps, the mill's quarter turns) punish slow decks."""
import dsl
from dsl import *
from creatures import *

W = "pits"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

# ================================================================== cards foes put in a hand
card("t_pits_lamp", "Lit Lamp", 0, "Curse", "none", [A("fire", 2, attr="stable")],
     "Unplayable. When drawn: gain 2 Burn.", use=[], kw=["Temporary", "Unplayable", "Curse"],
     on_draw=[A("fire", 2, attr="stable")], cat="fire",
     flavour="She hands every miner his lamp at the start of the shift. Everyone takes one.",
     note="The Lamp-Room Girl holds out one more lit lamp from her yoke toward the hero.")

# ================================================================== world cards (Combust)
card("w_pits_gas_pocket", "Gas Pocket", 1, "W", "enemy",
     [D(0, per="t.el_total", k=1, max=12), A("fire", 1, attr="volatile")],
     "Deal 1 for each course stack on the target (max 12). Apply 1 Volatile Burn.", cat="fire", world=W, arch="world",
     flavour="The air itself became fuel, and every poison is a fuse.",
     note="A hero tosses a lamp into a yellow drift of gas round a foe; the gallery flashes lamp orange.",
     up={"text": "Deal 2, plus 1 for each course stack on the target (max 14). Apply 1 Volatile Burn.",
         "fx": [D(2, per="t.el_total", k=1, max=14), A("fire", 1, attr="volatile")]})
card("w_pits_blasting_charge", "Blasting Charge", 2, "W", "enemy",
     [CONS(e="toxin"), D(2, per="consumed", k=2, max=14), D(0, per="consumed", k=1, max=7, to="adjacent")],
     "Remove all Toxin from the target. Deal 2, plus 2 per Toxin removed (max 14). Each foe beside it takes 1 per "
     "Toxin removed (max 7).", cat="fire", world=W, arch="world",
     flavour="It ground the brimstone for the world's powder.",
     note="A powder keg wedged against a gas-swollen foe goes up, the blast throwing its neighbours aside.",
     up={"text": "Remove all Toxin from the target. Deal 4, plus 2 per Toxin removed (max 16). Each foe beside it takes "
                 "1 per Toxin removed (max 8).",
         "fx": [CONS(e="toxin"), D(4, per="consumed", k=2, max=16), D(0, per="consumed", k=1, max=8, to="adjacent")]})
card("w_pits_throw_it_back", "Throw It Back", 1, "W", "enemy",
     [TRANSFER(frm="ally_most", n=1), D(2), A("fire", 1, attr="volatile")],
     "Move the largest ailment of the most afflicted hero onto the target. Deal 2. Apply 1 Volatile Burn.", cat="fire",
     world=W, arch="world",
     flavour="Its lungs are full of yellow gas. Keep it away from the lamp.",
     note="A coughing hero spits the yellow gas back into a Gas-Lung Miner's face as the lamp swings in.",
     up={"text": "Move the largest ailment of the most afflicted hero onto the target. Deal 4. Apply 1 Volatile Burn.",
         "fx": [TRANSFER(frm="ally_most", n=1), D(4), A("fire", 1, attr="volatile")]})
card("w_pits_wet_hood", "Wet Hood", 1, "W", "ally",
     [CONS(e="fire"), dsl.W(1), B(2, per="consumed", k=1, max=8)],
     "Remove all Burn from a hero. They gain 1 Ward and 2 Block, plus 1 per Burn removed (max 8).", world=W, arch="world",
     flavour="Somebody had to go in first with the flame. He wore the hood soaked.",
     note="A hero pulls a steaming, water-soaked sacking hood over a burning companion's head.",
     up={"text": "Remove all Burn from a hero. They gain 1 Ward and 3 Block, plus 2 per Burn removed (max 13).",
         "fx": [CONS(e="fire"), dsl.W(1), B(3, per="consumed", k=2, max=13)]})

# ================================================================== foes
RES_PIT = {"fire": "resist", "toxin": "resist", "frost": "weak"}

creature("gas_miner", "Gas-Lung Miner", "foe", 38, armor=1, ranks=[1, 2], role="attacker",
         resist={"toxin": "resist", "fire": "weak"},
         intents={"pick": I("Pick Swing", "attack", "front", [D(9)]),
                  "cough": I("Wet Cough", "debuff", "all_heroes", [A("toxin", 1, attr="stable")]),
                  "heavy": I("Wheezing Swing", "attack", "front", [D(6), A("toxin", 2, attr="stable")])},
         ai=[{"use": "cough", "every": 3}, {"use": "heavy", "every": 3, "offset": 1}, {"use": "pick"}],
         traits=[T("hit", "Keep It from the Lamp", "Struck while it Burns, its chest bursts: it takes 10, and the hero "
                   "who struck it and the foes beside it gain 2 Burn.",
                   [D(10, to="self", if_="fire>0"), A("fire", 2, attr="stable", if_="fire>0"),
                    A("fire", 2, attr="stable", to="self_adjacent", if_="fire>0")])],
         lore="Its lungs are full of yellow gas. Keep it away from the lamp.", world=W)

creature("brimstone_toad", "Brimstone Toad", "foe", 36, ranks=[2, 3], role="afflicter",
         resist={"toxin": "immune", "fire": "resist"},
         intents={"spit": I("Burning Slime", "attack", "back", [D(3), A("toxin", 2, attr="stable"), A("fire", 1, attr="stable")]),
                  "flare": I("Brimstone Sweat", "attack", "back", [D(2), A("fire", 1, attr="volatile")]),
                  "tongue": I("Tongue", "attack", "back", [D(5), PULL(1)])},
         ai=[{"use": "flare", "every": 3, "offset": 2}, {"use": "tongue", "every": 3, "offset": 1}, {"use": "spit"}],
         lore="Its skin sweats brimstone. Do not lick it.", world=W)

creature("fuse_imp", "Fuse Imp", "foe", 28, ranks=[3, 4], role="afflicter", charge_name="Fuse",
         resist={"fire": "immune", "water": "weak"},
         intents={"torch": I("Throw the Torch", "attack", "back", [D(3), A("fire", 1, attr="volatile")]),
                  "blow": I("Blow Up", "attack", "all_heroes", [D(6), A("fire", 2, attr="stable"), SELFDMG(999)]),
                  "scamper": I("Scamper", "defend", "self", [SELF("dodge", 1)])},
         ai=[{"use": "blow", "if": "charge>=3"}, {"use": "scamper", "if": "hp_pct<50", "not_twice": True}, {"use": "torch"}],
         traits=[T("round_start", "Burning Fuse", "Its tail fuse burns down each round; at 3 it blows up. Soak or "
                   "Weaken on it puts the fuse out for that round.",
                   [SELF("charge", 1, if_="!water&!frost")])],
         lore="It carries a lit torch into a gas mine. On purpose.", world=W)

creature("pit_crawler", "Pit Crawler", "foe", 46, armor=2, ranks=[1], role="attacker",
         resist={"physical": "resist", "toxin": "resist"},
         intents={"bite": I("Venom Mandibles", "attack", "front", [D(6), A("toxin", 2, attr="stable")]),
                  "coil": I("Coil", "attack", "front", [D(7), ST("anchor", 2)]),
                  "legs": I("Legs Like Picks", "attack", "front2", [D(4)])},
         ai=[{"use": "coil", "every": 3}, {"use": "legs", "every": 3, "offset": 1}, {"use": "bite"}],
         personality="mindless", lore="A centipede as long as a mine cart, and much hungrier.", world=W)

creature("canary_priest", "Canary Priest", "foe", 32, ranks=[3, 4], role="afflicter",
         resist={"toxin": "resist", "void": "weak"},
         intents={"hymn": I("Hymn to the Gas", "debuff", "all_heroes", [STRESS(6), A("fire", 1, attr="volatile")]),
                  "censer": I("Yellow Censer", "debuff", "all_heroes", [A("toxin", 1, attr="stable")]),
                  "cage": I("Swing the Cage", "attack", "back", [D(6)]),
                  "bless": I("Bless the Flock", "heal", "all_allies", [CLEANSE(2)])},
         ai=[{"use": "bless", "if": "total_hex>=4", "not_twice": True}, {"use": "hymn", "every": 3, "offset": 2},
             {"use": "censer", "every": 3}, {"use": "cage"}],
         lore="They sing to the gas the way miners once listened to canaries. The gas listens.",
         world=W)

creature("gas_burner", "Gas-Burner", "foe", 36, ranks=[2], role="afflicter",
         resist={"fire": "resist", "toxin": "resist", "frost": "weak"},
         intents={"flame": I("Lift the Flame", "attack", "front", [D(4), A("fire", 1, attr="volatile")]),
                  "shuffle": I("Shuffle Forward", "defend", "self", [ADV(1), B(6)]),
                  "jab": I("Pole Jab", "attack", "front", [D(7)])},
         ai=[{"use": "flame", "every": 2}, {"use": "shuffle", "if": "rank>1", "not_twice": True}, {"use": "jab"}],
         lore="He went in first each morning with a flame on a pole to burn off the gas. Somebody had to.", world=W)

creature("pit_boy", "Pit Boy", "foe", 28, ranks=[3, 4], role="attacker", resist=RES_PIT,
         intents={"ore": I("Burning Ore", "attack", "back", [D(4), A("fire", 2, attr="stable")]),
                  "lump": I("Hurl a Lump", "attack", "front", [D(7)]),
                  "hitch": I("Hitch the Sack", "defend", "self", [B(7)])},
         ai=[{"use": "hitch", "if": "hp_pct<50", "not_twice": True}, {"use": "ore", "every": 2}, {"use": "lump"}],
         traits=[T("death", "Still Seven", "When he dies, every hero gains 8 stress.", [STRESS(8, to="all_enemies")])],
         lore="He carried ore up the stairs on his back from the age of seven. He is still seven.", world=W)

creature("timberman", "Timberman", "foe", 50, armor=1, ranks=[1], role="defender",
         resist={"toxin": "resist", "frost": "weak"},
         intents={"sweep": I("Sweep of the Beam", "attack", "front2", [D(5)]),
                  "prop": I("Set a Prop", "defend", "ally_lowest", [B(10), ST("fortify", 2)]),
                  "maul": I("Timber Maul", "attack", "front", [D(9)])},
         ai=[{"use": "prop", "if": "ally_hurt", "not_twice": True}, {"use": "sweep", "every": 2}, {"use": "maul"}],
         lore="He set the props that held the roof up. He still carries one everywhere, in case.", world=W)

creature("gallery_rats", "Gallery Rats", "foe", 40, ranks=[1, 2], role="attacker", flags=["swarm"],
         resist={"toxin": "resist", "fire": "weak"},
         intents={"pour": I("Pour Over", "attack", "front", [D(2, times=3)]),
                  "burst": I("Swollen Rat Bursts", "attack", "front", [D(3), A("fire", 2, attr="stable")])},
         ai=[{"use": "burst", "every": 3}, {"use": "pour"}],
         personality="mindless", lore="They ate the miners' bread, then the miners' candles. What they ate burns.",
         world=W)

creature("weighman", "Weighman", "foe", 34, ranks=[3, 4], role="support",
         resist={"toxin": "resist", "frost": "weak"},
         intents={"short": I("Found It Short", "debuff", "front", [STEAL(), D(3)]),
                  "dock": I("Dock the Pay", "debuff", "all_heroes", [STRESS(5)]),
                  "swing": I("Steelyard Swing", "attack", "back", [D(7)]),
                  "weigh": I("Weigh the Load", "buff", "all_allies", [B(4)])},
         ai=[{"use": "dock", "every": 3, "offset": 1}, {"use": "short", "every": 2}, {"use": "weigh", "if": "ally_hurt", "not_twice": True},
             {"use": "swing"}],
                  lore="He weighed every load that came up and found it short. He has never once been wrong.", world=W)

creature("lamp_room_girl", "Lamp-Room Girl", "foe", 30, ranks=[3, 4], role="support",
         resist={"fire": "resist", "water": "weak"},
         intents={"hand_foe": I("Lamp for the Shift", "buff", "ally_front", [ST("empower", 4)]),
                  "hand_hero": I("Everyone Takes One", "debuff", "random", [ADD("t_pits_lamp")]),
                  "throw": I("Thrown Lamp", "attack", "back", [D(4), A("fire", 2, attr="stable")])},
         ai=[{"use": "hand_hero", "every": 3}, {"use": "hand_foe", "every": 3, "offset": 1}, {"use": "throw"}],
         lore="She hands every miner his lamp at the start of the shift. Everyone takes one.", world=W)

creature("tub_hurrier", "Tub Hurrier", "foe", 44, ranks=[1, 2], role="attacker", flags=["immovable"],
         resist={"fire": "resist", "frost": "weak"},
         intents={"drag": I("Drag the Burning Tub", "attack", "front2", [D(4), A("fire", 1, attr="stable")]),
                  "heave": I("Heave", "attack", "front", [D(9)]),
                  "rest": I("Rest on the Chain", "defend", "self", [B(8)])},
         ai=[{"use": "rest", "if": "hp_pct<40", "not_twice": True}, {"use": "drag", "every": 2}, {"use": "heave"}],
         lore="Chained to the tub at the waist, she dragged it from the face to the shaft. She drags it full or empty.",
         world=W)

# ================================================================== elites
creature("powder_ogre", "Powder Ogre", "elite", 120, armor=2, ranks=[1], role="attacker", charge_name="Fuse",
         resist={"fire": "resist", "toxin": "resist", "water": "weak"},
         intents={"smash": I("Smash", "attack", "front", [D(17)]),
                  "belch": I("Fiery Belch", "attack", "front2", [D(6), A("fire", 2, attr="stable")]),
                  "eat": I("Eat Powder", "buff", "self", [SELF("might", 2), H(8)]),
                  "bash": I("Keg Bash", "attack", "front", [D(13, pierce=True)]),
                  "keg": I("The Keg Goes Off", "attack", "all_heroes",
                           [D(9), A("fire", 2, attr="volatile"), SELFDMG(20), CLR("charge")])},
         ai=[{"use": "keg", "if": "charge>=4"}, {"use": "eat", "if": "hp_pct<50", "not_twice": True},
             {"use": "bash", "every": 3, "offset": 1}, {"use": "belch", "every": 3}, {"use": "smash"}],
         traits=[T("round_start", "Lit Fuse", "The fuse on its wrist burns down each round; at 4 the keg goes off "
                   "and tears into the ogre too. Soak on it puts the fuse out for that round.",
                   [SELF("charge", 1, if_="!water")])],
         lore="It eats blasting powder. It burps fire.", world=W)

creature("miasma_matriarch", "Miasma Matriarch", "elite", 96, armor=2, ranks=[3, 4], role="afflicter",
         resist={"toxin": "immune", "fire": "weak"},
         intents={"breath": I("Choking Breath", "attack", "all_heroes", [D(3), A("toxin", 2, attr="stable")]),
                  "gaze": I("Swollen Gaze", "debuff", "back", [STRESS(12), ST("vulnerable", 1)]),
                  "choke": I("Choke", "attack", "weakest", [D(8, pierce=True), A("toxin", 2, attr="stable")]),
                  "veil": I("Gas Veil", "defend", "all_allies", [B(7)])},
         ai=[{"use": "veil", "if": "ally_hurt", "not_twice": True}, {"use": "gaze", "every": 3, "offset": 1},
             {"use": "choke", "every": 3, "offset": 2}, {"use": "breath"}],
         traits=[T("hit", "Swollen with Gas", "Struck while she Burns, she bursts in a cloud: she takes 12 and every "
                   "hero gains 2 Toxin.",
                   [D(12, to="self", if_="fire>0"), A("toxin", 2, attr="stable", to="all_enemies", if_="fire>0")])],
         lore="A head swollen with gas, drifting through the galleries.", world=W)

creature("mounted_overseer", "The Mounted Overseer", "elite", 110, armor=3, ranks=[1], role="support",
         resist={"fire": "resist", "toxin": "resist", "frost": "weak"},
         intents={"lash": I("Whip Lash", "debuff", "back", [D(6), ST("mark", 1)]),
                  "barge": I("Pony Barges", "attack", "marked", [D(12)]),
                  "drive": I("Drive the Shift", "buff", "all_allies", [ST("might", 1)]),
                  "cudgel": I("Cudgel", "attack", "front", [D(10), PUSH(1)])},
         ai=[{"use": "lash", "every": 3}, {"use": "barge", "every": 3, "offset": 2}, {"use": "drive", "every": 4, "offset": 1},
             {"use": "cudgel"}],
         traits=[T("ally_death", "Counting Heads", "When another foe dies he pegs the tally: every foe gains 1 Might.",
                   [ST("might", 1, to="all_allies")])],
         lore="He rode the galleries on a pit pony, counting heads. Neither of them has lost count.", world=W)

creature("shrine_bearer", "The Shrine-Bearer", "elite", 106, armor=3, ranks=[2], role="afflicter",
         charge_name="Votive Lamps", resist={"fire": "resist", "toxin": "resist", "void": "weak"},
         intents={"bless_gas": I("Bless the Gas", "attack", "front2",
                                 [D(10), A("fire", 2, attr="volatile"), CLR("charge")]),
                  "bless_powder": I("Bless the Powder", "defend", "all_allies", [B(9), CLR("charge")]),
                  "smoke": I("Holy Smoke", "heal", "all_allies", [CLEANSE(2)]),
                  "staff": I("Cross-Lamp Staff", "attack", "front", [D(9)]),
                  "pray": I("Mumbled Blessing", "debuff", "all_heroes", [STRESS(5)])},
         ai=[{"use": "bless_gas", "if": "charge>=4"}, {"use": "smoke", "if": "el_total>=4", "not_twice": True},
             {"use": "bless_powder", "if": "charge>=2&ally_hurt"}, {"use": "pray", "every": 3}, {"use": "staff"}],
         traits=[T("round_start", "Votive Lamps", "Lights one more lamp each round; a blessing spends them all.",
                   [SELF("charge", 1)])],
         lore="He carried the little chapel down every shaft to bless the powder. He was carrying it when the powder "
              "answered.", world=W)

# ================================================================== rulers
creature("burning_lung", "The Burning Lung", "ruler", 300, armor=2, span=2, ranks=[3, 4], role="afflicter",
         charge_name="Gas Sac", resist={"toxin": "immune", "fire": "resist", "frost": "weak"},
         intents={"inhale": I("Inhale", "charge", "all_heroes", [CONS(e="toxin"), SELF("charge", 2), B(10, to="self")]),
                  "exhale": I("Exhale", "attack", "all_heroes",
                              [D(6), A("toxin", 2, attr="stable"), A("fire", 1, attr="volatile"), CLR("charge")]),
                  "crush": I("Crushing Bulk", "attack", "front", [D(17)]),
                  "swallow": I("The Tongue", "attack", "back", [D(9), PULL(3), STRESS(6)]),
                  "burn": I("Burning Breath", "attack", "all_heroes",
                            [D(3), A("toxin", 1, attr="stable"), A("fire", 1, attr="stable")]),
                  "deep": I("The Last Inhale", "charge", "all_heroes", [CONS(e="toxin"), SELF("charge", 2), B(14, to="self")]),
                  "last": I("The Last Breath", "attack", "all_heroes",
                            [D(10), A("toxin", 2, attr="stable"), A("fire", 2, attr="volatile"), CLR("charge")])},
         ai=[{"use": "exhale", "if": "charge>=1"}, {"use": "inhale", "every": 3}, {"use": "crush"}],
         phases=[P(55, "The skin splits and the gas inside catches. It burns itself, and it breathes fire every round.",
                   ai=[{"use": "exhale", "if": "charge>=1"}, {"use": "swallow", "every": 3}, {"use": "burn"}], might=2),
                 P(20, "The last breath. It draws in the whole gallery.",
                   ai=[{"use": "last", "if": "charge>=4"}, {"use": "deep"}], might=1)],
         traits=[T("hit", "Gas Sac", "While the sac holds gas, a hit while it Burns sets the sac off: it takes 14 and the "
                   "sac empties.",
                   [D(14, to="self", if_="charge>=1&fire>0"), CLR("charge", to="self", if_="charge>=1&fire>0")]),
                 T("round_start", "Split Skin", "Below about half HP its skin is split, and it gains 4 Burn every round (2 after its resistance).",
                   [A("fire", 4, attr="stable", if_="hp_pct<55")])],
         lore="The mine's first breath, grown into a toad the size of a chapel. Every breath it takes is fire.", world=W)

creature("owner", "The Owner", "ruler", 280, armor=3, span=2, ranks=[3, 4], role="summoner", flags=["immovable"],
         resist={"fire": "resist", "toxin": "resist", "frost": "weak"},
         intents={"grab": I("Lift to the Chest", "attack", "random", [D(8), ST("anchor", 2), A("fire", 3, attr="stable")]),
                  "swat": I("Backhand", "attack", "front", [D(14)]),
                  "shift": I("Call the Shift", "summon", "self", [SUMMON("gas_miner", max=2)]),
                  "ledger": I("The Owner's Due", "debuff", "all_heroes", [STRESS(6), A("toxin", 1, attr="stable")]),
                  "reach": I("Both Hands Down", "attack", "front2", [D(9), A("fire", 1, attr="stable")]),
                  "lamp": I("The Lamp Drops", "attack", "all_heroes", [D(4), A("fire", 2, attr="volatile")])},
         ai=[{"use": "shift", "if": "allies<3", "once": True}, {"use": "grab", "every": 3},
             {"use": "ledger", "every": 4, "offset": 2}, {"use": "swat"}],
         phases=[P(55, "The timbers creak. He slips lower, and his hands reach the front two ranks at once.",
                   ai=[{"use": "shift", "if": "allies<3", "once": True}, {"use": "grab", "every": 3},
                       {"use": "reach"}], might=2),
                 P(20, "He drops the lamp into the gas.",
                   ai=[{"use": "grab", "every": 3}, {"use": "lamp"}], might=1)],
         traits=[T("lost_action", "Lamp in His Fist", "If he is Stunned or Frozen, he drops the lamp into the gas: every "
                   "hero gains 2 Volatile Burn.", [A("fire", 2, attr="volatile", to="all_enemies")])],
         lore="He came down the shaft once, to see the gas for himself. He has swollen too fat to go back up.", world=W)

creature("powder_mill", "The Powder Mill", "ruler", 300, armor=4, span=2, ranks=[3, 4], role="attacker",
         flags=["immovable", "unstunnable"], charge_name="Quarter Turns",
         resist={"physical": "resist", "fire": "resist", "water": "weak"},
         intents={"kick": I("The Horse Kicks", "attack", "front", [D(13)]),
                  "dust": I("Powder in the Air", "debuff", "all_heroes", [A("toxin", 2, attr="stable")]),
                  "sparks": I("Sparks off the Tyre", "attack", "all_heroes", [D(4), A("fire", 1, attr="stable")]),
                  "brace": I("Lean into the Collar", "defend", "self", [B(16)]),
                  "crush": I("The Full Turn", "attack", "front", [D(26), A("fire", 1, attr="volatile"), CLR("charge")]),
                  "flash": I("The Trough Flashes", "attack", "front2", [D(15), A("fire", 2, attr="volatile"), CLR("charge")])},
         ai=[{"use": "crush", "if": "charge>=4"}, {"use": "dust", "every": 3}, {"use": "sparks", "every": 3, "offset": 1},
             {"use": "kick"}],
         phases=[P(55, "The harness burns into the hide. The count drops to two, and each crush flashes the trough under "
                       "the second rank.",
                   ai=[{"use": "flash", "if": "charge>=2"}, {"use": "dust", "every": 2}, {"use": "kick"}], might=1),
                 P(20, "The horse goes down in the traces, and the stone runs free.",
                   ai=[{"use": "flash", "if": "charge>=1"}, {"use": "brace", "not_twice": True}, {"use": "sparks"}])],
         traits=[T("round_start", "Quarter Turns", "The stone grinds a quarter turn each round; on the full turn the mill "
                   "rolls forward and crushes the front hero. Soak on it slows it for a round.",
                   [SELF("charge", 1, if_="!water")]),
                 T("hit", "Iron Tyre", "Hits on the iron tyre throw sparks: the attacker gains 1 Burn.",
                   [A("fire", 1, attr="stable")])],
         lore="It ground the brimstone for the world's powder. The horse has never been unhitched.", world=W)

# ================================================================== encounters
E = encounter
# foe groups
E(W, "pits_f1", "The Upper Gallery", "Two miners coughing at the seam, and the girl with the lamps.",
  ["gas_miner", "gas_miner", "lamp_room_girl"], "pits_shaft", "foe",
  "The coughs lay the fuel and her lamps light it; Burn one miner and it bursts into the hero facing it.")
E(W, "pits_f2", "Toad Pool", "A crawler in front, a toad in the sulphur, an imp on the ledge.",
  ["pit_crawler", "brimstone_toad", "fuse_imp"], "pits_vent", "foe",
  "The toad stacks Toxin on the back; the imp's torch lights it before the fuse runs out.")
E(W, "pits_f3", "The Canary Chapel", "The priest sings to the gas.",
  ["gas_miner", "canary_priest", "fuse_imp"], "pits_chapel", "foe",
  "Two sparks behind one fuel: kill the priest before his hymn, Soak the imp.")
E(W, "pits_f4", "The Deep Seam", "Rats, a crawler and a toad, and no lamp yet.",
  ["gallery_rats", "pit_crawler", "brimstone_toad"], "pits_vent", "foe",
  "Toxin piles up with no spark: the danger is the next fight, and Black Lung.")
E(W, "pits_f5", "The Pithead", "The timberman, the weighman and a carrying boy.",
  ["timberman", "weighman", "pit_boy"], "pits_shaft", "foe",
  "A two-rank sweep, docked Block, and a child who costs stress to kill.")
E(W, "pits_f6", "The Lamp Room", "All flame and no gas.",
  ["tub_hurrier", "gas_burner", "lamp_room_girl"], "pits_shaft", "foe",
  "All spark and no fuel, unless the company brought Black Lung in with it.")
E(W, "pits_f7", "The Propped Chapel", "A timberman props the chapel roof while the priest sings.",
  ["timberman", "canary_priest", "pit_boy"], "pits_chapel", "foe",
  "The prop keeps Block on whoever is hurt; reach rank 2 or burn them down slowly.")
E(W, "pits_f8", "The Low Gallery", "Rats, a tub, a flame on a pole and an imp.",
  ["gallery_rats", "tub_hurrier", "gas_burner", "fuse_imp"], "pits_vent", "foe",
  "Four bodies, two igniters, one swarm: hits on every foe and fast kills.")
# elite groups
E(W, "pits_e1", "The Powder Store", "An ogre among the kegs, the weighman counting them, an imp beside.",
  ["powder_ogre", "weighman", "fuse_imp"], "pits_shaft", "elite",
  "Two fuses on the count: Soak the keg, then the imp, or kill fast; the weighman takes the Block you hide behind.")
E(W, "pits_e2", "The Choking Chapel", "The matriarch drifts over the altar.",
  ["miasma_matriarch", "gas_miner", "canary_priest"], "pits_chapel", "elite",
  "All fuel and one hymn: Burning the Matriarch is a gamble on the gas cloud.")
E(W, "pits_e3", "The Count", "The overseer rides the gallery, counting heads.",
  ["mounted_overseer", "tub_hurrier", "pit_boy"], "pits_vent", "elite",
  "The whip Marks the back hero and the pony follows it; every death drives the rest harder: Guard the Mark.")
E(W, "pits_e4", "The Feast-Day Procession", "The shrine comes down the shaft behind its timberman.",
  ["shrine_bearer", "timberman", "canary_priest"], "pits_chapel", "elite",
  "The lamps count up while the timberman props whoever is hurt: break the shrine before the blessing.")
# rulers
E(W, "pits_r_burning_lung", "The Burning Lung", "The mine breathes.",
  ["gas_miner", "gas_miner", "burning_lung"], "pits_boss", "ruler",
  "The miners are its fuel and yours: their bursts and your Burn set off the full sac.")
E(W, "pits_r_owner", "The Owner", "He hangs through the shaft mouth, the lamp still in his fist.",
  ["pit_boy", "gas_miner", "owner"], "pits_boss", "ruler",
  "Free the held hero by damage, not control: a Stun drops the lamp.", props="owner")
E(W, "pits_r_powder_mill", "The Powder Mill", "The horse leans into the collar and the stone turns.",
  ["tub_hurrier", "gas_burner", "powder_mill"], "pits_boss", "ruler",
  "A countdown fight: Soak the mill to slow its turn, and keep the front hero's HP high for the crush.",
  props="powder_mill")

NEEDS = [
    "t_pits_lamp: the Lit Lamp should be throwable at a foe, Burning its holder only if still held at round end (no "
    "held-card round-end trigger); written as an Unplayable card that Burns whoever draws it.",
    "lamp_room_girl Lamp for the Shift: the lamp should make the foe's next attack add Burn; written as Empower 4.",
    "weighman Dock the Pay and Purse of Fines (gold theft, postponed by row 14): stress only, no death trait.",
    "burning_lung The Tongue: swallows the rearmost hero (postponed by row 14); written as a pull to the front plus stress.",
    "burning_lung Inhale/Exhale: the sac should hold what Inhale took and size Exhale by it; intents show fixed numbers, "
    "so Exhale is fixed and the sac drives timing and the Gas Sac trait.",
    "mounted_overseer Drive the Shift: every foe's next attack should go at the Marked hero (redirecting other foes' "
    "attacks); written as Might to every foe, with his own barge on the Marked hero.",
    "miasma_matriarch: her gas-head young drift into empty ranks (no bible entry for the young, so no summon).",
    "powder_mill The Full Turn: the mill rolls forward; the 3-rank stone is redesigned to 2 ranks (row 13).",
]
