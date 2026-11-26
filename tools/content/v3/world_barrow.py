"""World IX: The Hollow Barrow (frost + toxin, Cryo-rot). Role map: docs/design/gate2/world_IX_hollow_barrow.md.
Bible: art/party/bible/world_IX_hollow_barrow.md. Base numbers at Threat 0.

A war of attrition the company must not let run long: the dead come back, healing is blunted, and Cryo-rot shrinks
max HP. Most of the cast resists frost and toxin; fire thaws them, and thawed plague bursts."""
from dsl import *
from creatures import *
WARD = W  # dsl's Ward helper; W below is the world key
W = "barrow"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])
F, TX, FI = "frost", "toxin", "fire"
BOTH = {F: "resist", TX: "resist"}

# ================================================================== cards foes put in a hand
card("t_barrow_fleas", "Plague Fleas", 0, "Curse", "none", [A(TX, 1, attr="stable"), ST("blight", 1)],
     "Unplayable. On arrival and each time it is drawn: gain 1 Toxin and Blight (no healing this round). When drawn, draw a replacement. Removed at fight end.",
     use=[], kw=["Temporary", "Unplayable", "Curse"], on_draw=[A(TX, 1, attr="stable"), ST("blight", 1)],
     flavour="He was paid by the tail. The fleas came free.",
     note="The Rat-Catcher's pole swings over a hero, and a dark dust of fleas falls from the rats.")

# ================================================================== world cards (Cryo-rot; any calling)
card("w_barrow_grave_cold", "Grave Cold", 1, "W", "enemy", [D(2, per="t.ailments", k=1), A(TX, 1, attr="stable")],
     "Deal 2, plus 1 per ailment stack on the target. Apply 1 Toxin.", cat=TX, world=W, arch="world",
     up={"text": "Deal 3, plus 1 per ailment stack on the target. Apply 2 Toxin.",
         "fx": [D(3, per="t.ailments", k=1), A(TX, 2, attr="stable")]},
     flavour="The cold kept everything in the barrow fresh. The plague too.",
     note="A hero's blade comes away from a Draugr furred with grey-green mould.")
card("w_barrow_burial_axe", "Burial Axe", 1, "W", "enemy", [D(3), EXEC(4, per="heroes_before", k=2)],
     "Deal 3. Execute 4, plus 2 per other hero who has acted before this card this round.", kw=["Execute"], world=W,
     arch="world",
     up={"text": "Deal 4. Execute 6, plus 2 per other hero who has acted before this card this round.",
         "fx": [D(4), EXEC(6, per="heroes_before", k=2)]},
     flavour="Buried with its axe so it could keep fighting. Borrow it, and end that.",
     note="A hero wrenches a bearded axe from a grave niche and swings it at a rising Draugr.")
card("w_barrow_vinegar_rag", "Vinegar Rag", 1, "W", "ally",
     [CLEANSE(2), WARD(0, per="t.ailments", k=1, max=3)],
     "A hero removes 2 ailment stacks, then gains 1 Ward per ailment stack it still has (up to 3).", world=W,
     arch="world",
     up={"text": "A hero removes 3 ailment stacks, then gains 1 Ward per ailment stack it still has (up to 4).",
         "fx": [CLEANSE(3), WARD(0, per="t.ailments", k=1, max=4)]},
     flavour="The pest-house watch tied vinegar over their mouths. It kept out the smell.",
     note="A hero ties a vinegar-soaked rag over a sick companion's mouth among the mounds.")
card("w_barrow_the_long_winter", "The Long Winter", 2, "W", "all_enemies", [A(F, 2, attr="stable"), REACT(1)],
     "Apply 2 Frost to every foe. Conjoin every foe.", cat=F, world=W, arch="world",
     up={"text": "Apply 3 Frost to every foe. Conjoin every foe.", "fx": [A(F, 3, attr="stable"), REACT(1)]},
     flavour="He sealed his kingdom in to stop the plague. The winter came in with it.",
     note="Rime spreads across the barrow hall, whitening the funeral feast and its guests.")

# ================================================================== foes
creature("barrow_draugr", "Barrow Draugr", "foe", 40, armor=2, ranks=[1], world=W, role="attacker",
         resist=dict(BOTH, physical="weak"),
         intents={"axe": I("Grave Axe", "attack", "front", [D(10)]),
                  "grip": I("Cold Grip", "attack", "front", [D(5), A(F, 2, attr="stable")]),
                  "stand": I("Stand Its Ground", "defend", "self", [B(8)])},
         ai=[{"use": "grip", "every": 3}, {"use": "stand", "if": "hp_pct<50", "not_twice": True}, {"use": "axe"}],
         lore="Buried with its axe so it could keep fighting. It does.")
creature("plague_wolf", "Plague Wolf", "foe", 32, ranks=[1, 2], world=W, role="attacker",
         resist=dict(BOTH, lightning="weak"),
         intents={"bite": I("Plague Bite", "attack", "front", [D(6), A(TX, 2, attr="stable")]),
                  "pack": I("Pack Hunt", "attack", "back", [D(8)]),
                  "howl": I("Howl", "debuff", "all_heroes", [STRESS(5)])},
         ai=[{"use": "howl", "every": 4, "offset": 3}, {"use": "pack", "every": 2}, {"use": "bite"}],
         lore="The barrow wolves carry the old plague in their teeth.")
creature("frostbit_leper", "Frostbitten Leper", "foe", 30, ranks=[2, 3], world=W, role="afflicter",
         resist=dict(BOTH, physical="weak"),
         intents={"bell": I("Leper's Bell", "debuff", "all_heroes", [STRESS(6)]),
                  "touch": I("Unclean Touch", "attack", "front", [D(4), A(F, 1, attr="stable"), A(TX, 2, attr="stable")]),
                  "rot": I("The Rot Spreads", "debuff", "random", [A(TX, 1, attr="volatile")])},
         ai=[{"use": "bell", "every": 3}, {"use": "rot", "every": 3, "offset": 1}, {"use": "touch"}],
         lore="It rings its bell to warn you. You should have listened.")
creature("mold_wight", "Mould Wight", "foe", 36, ranks=[2, 3], world=W, role="support",
         resist={TX: "immune", F: "resist", "physical": "resist", FI: "weak"},
         intents={"spores": I("Spore Shroud", "buff", "all_allies", [ST("regen", 2)]),
                  "chill": I("Grave Chill", "debuff", "front", [A(F, 3, attr="stable")]),
                  "claw": I("Smothering Claw", "attack", "front", [D(7), A(TX, 1, attr="stable")]),
                  "fur": I("Fur Over", "defend", "self", [B(8), me("regen", 2)])},
         ai=[{"use": "fur", "if": "hp_pct<50", "not_twice": True}, {"use": "spores", "every": 3},
             {"use": "chill", "every": 3, "offset": 1}, {"use": "claw"}],
         lore="The mould grew a shape in the dark, and the shape grew hungry.")
creature("grave_worm", "Grave Worm", "foe", 38, ranks=[3, 4], world=W, role="attacker",
         resist={TX: "resist", "physical": "weak"},
         intents={"burrow": I("Burrow Up", "attack", "back", [D(11)]),
                  "feed": I("Feed", "attack", "back", [D(6, lifesteal=100), A(TX, 1, attr="stable")]),
                  "sink": I("Sink into the Grave", "defend", "self", [B(8), me("dodge", 1)])},
         ai=[{"use": "burrow", "if": "round==1"}, {"use": "sink", "if": "hp_pct<50", "not_twice": True},
             {"use": "burrow", "every": 4}, {"use": "feed"}],
         lore="It eats the dead. It has eaten so many that it has started to look like them.")
creature("gravedigger", "Gravedigger", "foe", 36, ranks=[2, 3], world=W, role="afflicter",
         resist=dict(BOTH, fire="weak"),
         intents={"dig": I("Dig a Grave", "debuff", "weakest", [ST("mark", 1), ST("vulnerable", 2)]),
                  "spade": I("Spade's Edge", "attack", "front", [D(9)]),
                  "clods": I("Frozen Clods", "attack", "back", [D(5), A(F, 1, attr="stable")])},
         ai=[{"use": "dig", "every": 3}, {"use": "clods", "every": 3, "offset": 1}, {"use": "spade"}],
         lore="He dug graves in the barrow until there was no floor left. Then he started on the walls.")
creature("the_swollen", "The Swollen", "foe", 40, ranks=[1, 2], world=W, role="afflicter",
         resist={F: "resist", FI: "weak"},
         intents={"beetle": I("Laundry Beetle", "attack", "front", [D(9)]),
                  "sheet": I("Frozen Sheet", "attack", "front", [D(5), A(F, 2, attr="stable")]),
                  "creak": I("The Bubo Creaks", "debuff", "front2", [A(TX, 1, attr="stable")])},
         ai=[{"use": "creak", "every": 3}, {"use": "sheet", "every": 3, "offset": 1}, {"use": "beetle"}],
         traits=[T("death", "The Bubo Bursts",
                   "When she dies the bubo bursts: 2 Toxin on every hero, and 2 more if she carries Fire.",
                   [A(TX, 2, attr="stable", to="all_enemies"), A(TX, 2, attr="stable", to="all_enemies", if_="fire>0")])],
         lore="The plague sores kept growing in the cold. They are waiting for the thaw.")
creature("court_fool", "Court Fool", "foe", 30, ranks=[3, 4], world=W, role="afflicter", charge_name="Joke",
         resist=dict(BOTH, void="weak"),
         intents={"joke": I("The Only Joke", "debuff", "all_heroes", [STRESS(4), SELF("charge", 1)]),
                  "punch": I("The Punchline", "debuff", "all_heroes", [STRESS(10), CLR("charge")]),
                  "slap": I("Slapstick", "attack", "random", [D(5)])},
         ai=[{"use": "punch", "if": "charge>=3"}, {"use": "slap", "every": 4, "offset": 3}, {"use": "joke"}],
         traits=[T("hit", "Heckled", "A hit makes him lose his place: his Joke starts again.", [CLR("charge", to="self")])],
         lore="He kept the court laughing while the doors were sealed. It is the only joke he remembers.")
creature("kings_hawk", "The King's Hawk", "foe", 30, ranks=[3, 4], world=W, role="attacker",
         resist={F: "resist", "lightning": "weak"},
         intents={"bate": I("Bate to the Leash", "attack", "acted_last", [D(7), A(TX, 2, attr="stable")]),
                  "rake": I("Swollen Talons", "attack", "acted_last", [D(4, times=2)]),
                  "mantle": I("Mantle", "defend", "self", [B(4), me("dodge", 1)])},
         ai=[{"use": "mantle", "if": "hp_pct<50", "not_twice": True}, {"use": "rake", "every": 3}, {"use": "bate"}],
         lore="It was buried hooded on its block at the king's right hand, so he would not ride out alone. It is still waiting for the hood to come off.")
creature("sexton_beetles", "Sexton Beetles", "foe", 32, ranks=[1, 2], world=W, role="afflicter", flags=["swarm"],
         resist={TX: "resist", F: "weak"},
         intents={"pour": I("Pour Over the Feet", "attack", "front", [D(3), A(TX, 2, attr="stable"), ST("lockdown", 1)]),
                  "bury": I("Bury", "attack", "front2", [D(3), A(TX, 1, attr="stable")])},
         ai=[{"use": "bury", "every": 3}, {"use": "pour"}],
         lore="They bury what they eat. In the barrow they never run short of either.")
creature("barrow_mason", "Barrow Mason", "foe", 48, armor=2, ranks=[1], world=W, role="defender",
         resist={F: "resist", "physical": "resist", "water": "weak"},
         intents={"wall": I("Wall Them In", "attack", "front", [D(4), ST("stun", 1)]),
                  "stone": I("Lay a Stone", "defend", "ally_lowest", [B(10)]),
                  "mallet": I("Mallet", "attack", "front", [D(10)])},
         ai=[{"use": "stone", "if": "ally_hurt", "not_twice": True}, {"use": "wall", "every": 4, "offset": 2},
             {"use": "mallet"}],
         lore="He laid the last stone from the inside. He is still laying them.")
creature("rat_catcher", "Rat-Catcher", "foe", 34, ranks=[2, 3], world=W, role="afflicter",
         resist=dict(BOTH, physical="weak"),
         intents={"pole": I("Rat Pole", "attack", "front", [D(5), A(TX, 2, attr="stable"), ADD("t_barrow_fleas")]),
                  "pot": I("Poison Pot", "debuff", "back", [A(TX, 3, attr="stable")]),
                  "trap": I("Cage-Trap", "attack", "front", [D(8)])},
         ai=[{"use": "pole", "every": 3}, {"use": "pot", "every": 3, "offset": 1}, {"use": "trap"}],
         lore="He was paid by the tail. There is no one left to pay him, and he has not stopped.")

# ================================================================== elites
creature("barrow_thane", "Barrow Thane", "elite", 110, armor=4, ranks=[1, 2], world=W, role="support",
         resist=dict(BOTH, physical="resist", fire="weak"),
         intents={"flail": I("Flail of Chains", "attack", "front", [D(12)]),
                  "rot": I("Rotting Cut", "attack", "front", [D(7), A(F, 2, attr="stable"), A(TX, 2, attr="stable")]),
                  "weights": I("Frozen Weights", "attack", "front2", [D(7)]),
                  # answer: the company has just killed one of his household
                  "oath": I("Oath of the Barrow", "buff", "all_allies", [ST("might", 1), B(6)])},
         ai=[{"use": "oath", "if": "allies<3", "not_twice": True}, {"use": "rot", "every": 3},
             {"use": "weights", "every": 4, "offset": 2}, {"use": "flail"}],
         traits=[T("round_start", "Keeps Them in Line", "At round start his household is Anchored: no hero can move them.",
                   [ST("anchor", 1, to="all_allies")])],
         lore="A lord buried with his household. He still keeps them in line.")
creature("rot_witch", "Rot Witch", "elite", 90, armor=2, ranks=[1, 3, 4], world=W, role="support",
         resist={TX: "resist", F: "resist", FI: "weak"},
         intents={"salts": I("Plague Salts", "debuff", "back", [A(TX, 3, attr="stable"), ST("hex", 2)]),
                  "raise": I("Raise the Dead", "heal", "all_allies", [H(8)]),
                  "curse": I("Wasting Curse", "debuff", "all_heroes", [STRESS(6), A(TX, 1, attr="volatile")]),
                  "nail": I("Frost Nail", "attack", "front", [D(9), A(F, 2, attr="stable")]),
                  # answer: the company has been stacking courses on one of hers
                  "embalm": I("Embalm", "heal", "ally_lowest", [CLEANSE(4), B(8)])},
         ai=[{"use": "embalm", "if": "ally_hurt", "not_twice": True}, {"use": "raise", "every": 4, "offset": 2},
             {"use": "curse", "every": 3}, {"use": "salts", "every": 2}, {"use": "nail"}],
         traits=[T("round_start", "Embalmer", "At round start each of her allies sheds 1 ailment stack.",
                   [CLEANSE(1, to="all_allies")])],
         lore="She keeps the barrow's dead from rotting, and their plague from dying.")
creature("barrow_chaplain", "Barrow Chaplain", "elite", 105, armor=3, ranks=[1, 2, 3], world=W, role="defender",
         resist=dict(BOTH, void="weak"),
         intents={"asperges": I("Asperges", "defend", "all_allies", [B(7)]),
                  "water": I("Frozen Holy Water", "debuff", "all_heroes", [A(TX, 2, attr="stable")]),
                  "cross": I("Processional Cross", "attack", "front", [D(11)]),
                  # answer: a hero at Death's Door hears the last rites
                  "rites": I("The Last Rites Again", "debuff", "weakest", [STRESS(14)])},
         ai=[{"use": "rites", "if": "hero_dd", "not_twice": True}, {"use": "asperges", "every": 3},
             {"use": "water", "every": 3, "offset": 1}, {"use": "cross"}],
         traits=[T("ally_death", "Last Rites", "When a foe falls, he says the rites: every hero gains 5 stress.",
                   [STRESS(5, to="all_enemies")])],
         lore="He gave the last rites to everyone in the barrow. He is giving them again.")
creature("pest_house_watchman", "Pest-House Watchman", "elite", 115, armor=3, ranks=[1], world=W, role="defender",
         resist={F: "resist", "physical": "resist", "lightning": "weak"},
         intents={"bar": I("Door-Bar", "attack", "front", [D(13)]),
                  # answer: he bars the hero the company is trying to keep alive
                  "nail": I("Nail Them In", "attack", "weakest", [D(5), ST("stun", 1), ST("anchor", 2), ST("blight", 1)]),
                  "padlock": I("Padlock and Chain", "attack", "back", [D(8), PULL(1)]),
                  "plea": I("The Plea on the Box", "debuff", "all_heroes", [STRESS(6)])},
         ai=[{"use": "nail", "every": 3}, {"use": "padlock", "every": 3, "offset": 1}, {"use": "plea", "every": 4, "offset": 3},
             {"use": "bar"}],
         traits=[T("round_start", "The Watch-Box", "At round start the oak box takes the first blows: he gains 10 Block.",
                   [B(10, to="self")])],
         lore="He nailed the sick into their houses. Then someone nailed him into his watch-box.")

# ================================================================== rulers
creature("barrow_king", "The Barrow King", "ruler", 290, armor=3, span=2, ranks=[2, 3], world=W, role="attacker",
         resist=dict(BOTH, physical="resist", fire="weak"),
         intents={"winter": I("The Long Winter", "debuff", "all_heroes", [A(F, 2, attr="stable"), STRESS(6)]),
                  "sweep": I("Rotting Sweep", "attack", "front2", [D(9), A(TX, 2, attr="stable")]),
                  "shield": I("Barrow Shield", "defend", "self", [B(18), me("thorns", 3)]),
                  "court": I("Summon the Court", "summon", "self", [SUMMON("barrow_draugr", max=2)]),
                  "plague": I("Plague of Kings", "attack", "all_heroes",
                              [D(4), A(TX, 2, attr="stable"), A(F, 1, attr="volatile")]),
                  "pour": I("The Plague Pours Out", "debuff", "all_heroes", [A(TX, 2, attr="stable"), STRESS(4)]),
                  "axe": I("Royal Axe", "attack", "front", [D(18)])},
         ai=[{"use": "winter", "if": "round==1"}, {"use": "shield", "if": "hp_pct<80", "once": True},
             {"use": "winter", "every": 3}, {"use": "sweep"}],
         traits=[T("hit", "Buboes Under the Frost", "While he carries Fire, every hit on him bursts a bubo: 1 Toxin on every hero.",
                   [A(TX, 1, attr="stable", to="all_enemies", if_="fire>0")])],
         phases=[P(66, "The King's court wakes in their graves.",
                   ai=[{"use": "court", "if": "allies<3", "not_twice": True}, {"use": "plague", "every": 3},
                       {"use": "sweep"}], might=1),
                 P(25, "The King's flesh splits. The plague pours out.",
                   ai=[{"use": "axe", "every": 2}, {"use": "pour"}], might=2)],
         lore="He sealed his kingdom in the barrow to stop the plague. The plague was already inside.")
creature("rat_king", "The Rat King", "ruler", 280, armor=2, span=2, ranks=[3, 4], world=W, role="attacker",
         resist=dict(BOTH, fire="weak"),
         intents={"bury": I("Bury the Front", "attack", "front", [D(14), A(TX, 2, attr="stable")]),
                  "seethe": I("The Seethe", "debuff", "all_heroes", [A(TX, 2, attr="stable")]),
                  "rot": I("Cold Plague", "debuff", "all_heroes", [A(F, 1, attr="stable"), A(TX, 1, attr="volatile")]),
                  "roll": I("Roll Forward", "defend", "self", [B(14)]),
                  "pour": I("The Living Pour Over", "attack", "all_heroes", [D(2, times=3), ST("bleed", 1)]),
                  "knot": I("The Knot", "attack", "front", [D(8, times=2)])},
         ai=[{"use": "roll", "if": "hp_pct<70", "once": True}, {"use": "rot", "every": 4},
             {"use": "seethe", "every": 3}, {"use": "bury"}],
         traits=[T("ally_death", "Always Hungry", "Whenever another foe falls, it eats: it heals 12.", [H(12, to="self")]),
                 T("hit", "Flea-Ridden", "A hero who hits it gains 1 Toxin.", [A(TX, 1, attr="stable")])],
         phases=[P(50, "The frozen dead rats fall away. The living pour out.",
                   ai=[{"use": "pour", "every": 2}, {"use": "rot", "every": 4}, {"use": "bury"}]),
                 P(20, "Only the knot of tails is left.",
                   ai=[{"use": "knot"}], might=2)],
         lore="The barrow rats froze together at the tails. There is one of them now, and it is always hungry.")
creature("dead_cart", "The Dead-Cart", "ruler", 270, armor=3, span=2, ranks=[3, 4], world=W, role="summoner",
         resist=dict(BOTH, physical="weak"),
         intents={"rattle": I("The Carter's Rattle", "debuff", "all_heroes", [STRESS(8)]),
                  "seize": I("The Heap Reaches", "attack", "back",
                             [D(6), PULL(3), ST("anchor", 2), A(TX, 2, attr="stable")]),
                  "hook": I("Carter's Hook", "attack", "front", [D(12)]),
                  "raise": I("Raise from the Heap", "summon", "self", [SUMMON("barrow_draugr", max=2, front=True)]),
                  "take": I("It No Longer Waits", "attack", "weakest",
                            [D(9), PULL(3), ST("anchor", 2), A(TX, 2, attr="stable")]),
                  "spill": I("The Heap Spills", "attack", "all_heroes",
                             [D(4), A(F, 2, attr="stable"), A(TX, 1, attr="volatile")])},
         ai=[{"use": "rattle", "if": "round==1"}, {"use": "seize", "every": 3}, {"use": "hook"}],
         traits=[T("ally_death", "Calling for the Dead", "Each foe that falls is taken onto the heap: the cart gains 8 Block.",
                   [B(8, to="self")])],
         phases=[P(66, "It no longer waits for them to finish dying.",
                   ai=[{"use": "raise", "if": "allies<3", "not_twice": True}, {"use": "take", "every": 2}, {"use": "hook"}],
                   might=1),
                 P(25, "The horse buckles. The heap spills.",
                   ai=[{"use": "spill", "every": 2}, {"use": "rattle", "every": 3}, {"use": "hook"}], might=1)],
         lore="It went round the barrow calling for the dead. It no longer waits for them to finish dying.")

# ================================================================== encounters
E = lambda *a, **k: encounter(W, *a, **k)
E("barrow_f1", "The Mound Road", "Wolves among the grave mounds.",
  ["barrow_draugr", "plague_wolf", "plague_wolf"], "barrow_mound", "foe",
  "The wolves hunt the back rank and howl; the Draugr holds. Cover the rear and end it fast.")
E("barrow_f2", "The Leper Path", "Bells in the snow.",
  ["barrow_draugr", "frostbit_leper", "frostbit_leper"], "barrow_mound", "foe",
  "Two bells of stress and two Cryo-rot touches; kill the lepers before the max HP cuts pile up.")
E("barrow_f3", "The Mould Vault", "Beetles, mould and a worm in the grave-rot.",
  ["sexton_beetles", "mold_wight", "grave_worm"], "barrow_tomb", "foe",
  "The Wight's Regen keeps the beetles and worm up, and the beetles push a hero to the end of the Ordo; burn the Wight first.")
E("barrow_f4", "The Burial Hall", "The household, still at the table. The fool is on the dais steps.",
  ["barrow_draugr", "mold_wight", "court_fool"], "barrow_hall", "foe",
  "The Fool's joke grows each round he is left alone; one cheap hit a round on him starts it over.")
E("barrow_f5", "New Graves", "Fresh graves in frozen earth, and the people who fill them.",
  ["the_swollen", "gravedigger", "rat_catcher"], "barrow_mound", "foe",
  "The Gravedigger makes the weakest Vulnerable and the Rat-Catcher fills hands with fleas; kill the Swollen without fire if the company is low.")
E("barrow_f6", "The Walled Door", "A mason laying stones across a doorway, from this side.",
  ["barrow_mason", "the_swollen", "frostbit_leper"], "barrow_hall", "foe",
  "The Mason Stuns and shields the Swollen; burst her when the company can carry the Toxin, never with fire on her.")
E("barrow_f7", "The Niches", "Burial niches from floor to vault, some of them empty.",
  ["rat_catcher", "sexton_beetles", "grave_worm"], "barrow_tomb", "foe",
  "Slowed heroes act last and the worm heals on its bites; burst order matters more than total damage.")
E("barrow_f8", "The Dais", "The king's empty dais, his hawk on its block.",
  ["barrow_mason", "court_fool", "kings_hawk"], "barrow_hall", "foe",
  "The Mason walls in the front while the Fool's joke builds and the hawk rakes anyone; reach the back rank or heckle the Fool.")
E("barrow_e1", "The Thane's Barrow", "A lord with his household, and his fool.",
  ["barrow_thane", "barrow_draugr", "court_fool"], "barrow_hall", "elite",
  "His household cannot be moved, so push and pull plans fail; killing one of them triggers his Oath.")
E("barrow_e2", "The Witch's Tomb", "She is tending the dead on her slab.",
  ["rot_witch", "barrow_draugr", "grave_worm"], "barrow_tomb", "elite",
  "She strips courses from her allies every round and heals them all; she is the target.")
E("barrow_e3", "The Chaplain's Rites", "A procession of one, his cross held high.",
  ["barrow_chaplain", "the_swollen", "gravedigger"], "barrow_tomb", "elite",
  "Every death costs the company stress and his holy water shields his flock; kill him before the rest, with void if you have it.")
E("barrow_e4", "The Pest-House", "The sick nailed in, and the man who nailed them.",
  ["pest_house_watchman", "frostbit_leper", "rat_catcher"], "barrow_mound", "elite",
  "He Stuns the weakest hero and the fleas clog hands; plan defence before damage, not repair after.")
E("barrow_r_barrow_king", "The Barrow King", "The king of the sealed kingdom, on his grave-throne.",
  ["barrow_draugr", "barrow_king", "grave_worm"], "barrow_boss", "ruler",
  "Fire thaws him but bursts his buboes on every hero; burn him in short bursts and Ward before the Plague of Kings.")
E("barrow_r_rat_king", "The Rat King", "A mound of rats three men high, among the grave goods.",
  ["sexton_beetles", "rat_catcher", "rat_king"], "barrow_boss", "ruler",
  "Every fall feeds it and every melee hit gives fleas; leave its escorts standing until it breaks, and hit it from range.",
  props="rat_king")
E("barrow_r_dead_cart", "The Dead-Cart", "A cart under a heap of the dead, coming round again.",
  ["barrow_draugr", "gravedigger", "dead_cart"], "barrow_boss", "ruler",
  "It drags a hero up to rank 1 and Anchors it, and takes every fallen foe onto the heap; set ranks so the seized hero can stand there.",
  props="dead_cart")

NEEDS = [
    "rot_witch: Embalmer should stop her allies' max HP being cut (no Cryo-rot on them); written as shedding 1 ailment stack each round.",
    "dead_cart: Raise from the Heap should return a fallen foe of this fight at low HP; written as a Barrow Draugr called into rank 1.",
    "rat_king: Always Hungry should also heal when a hero falls; Flea-Ridden should end in phase 2.",
]
