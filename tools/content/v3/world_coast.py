"""World VI: The Stormwrack Coast (Lightning + Water, Electrocute). Role map: docs/design/gate2/world_VI_stormwrack_coast.md.

Every fight is a Soak race: the cast sprays, fogs and breaches until the company is wet, then one telegraphed lightning
trigger runs through every Soaked hero. False lights lure the back rank forward and knock cards out of hands."""
import dsl
from dsl import *
from creatures import *

W = "coast"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

# ================================================================== world cards (Electrocute)
card("w_coast_breaking_sea", "Breaking Sea", 1, "W", "all_enemies",
     [A("water", 1, attr="stable"), A("water", 2, attr="stable", if_="t.lightning>0")],
     "Apply 1 Soak to every foe, and 2 more to each foe that carries Static.", cat="water", world=W, arch="world",
     flavour="The storm never ends, and the sea comes over the rocks with it.",
     note="A wave breaks over the wreckers on the strand; the ones already crackling drown in the spray.",
     up={"text": "Apply 2 Soak to every foe, and 2 more to each foe that carries Static.",
         "fx": [A("water", 2, attr="stable"), A("water", 2, attr="stable", if_="t.lightning>0")]})
card("w_coast_wreckers_lamp", "Wreckers' Lamp", 1, "W", "enemy",
     [PULL(1), A("water", 2, attr="stable"), A("lightning", 1, attr="volatile", if_="t.mark>0")],
     "Pull the target forward 1 and apply 2 Soak. If it is Marked, apply 1 Volatile Static.", cat="water", world=W,
     arch="world",
     flavour="It lights a lamp on the cliff and waits for the ships to come in.",
     note="A hero swings a wrecker's storm lantern on the cliff; a Storm Harpy drops toward it into the surf.",
     up={"text": "Pull the target forward 1 and apply 3 Soak. If it is Marked, apply 1 Volatile Static.",
         "fx": [PULL(1), A("water", 3, attr="stable"), A("lightning", 1, attr="volatile", if_="t.mark>0")]})
card("w_coast_call_the_bolt", "Call the Bolt", 2, "W", "all_enemies",
     [D(4), A("lightning", 1, attr="volatile", if_="t.water>0")],
     "Deal 4 to every foe. Apply 1 Volatile Static to each Soaked foe.", cat="lightning", world=W, arch="world",
     flavour="The false lights became true lightning.",
     note="A bolt comes down on the wet rocks and runs through every soaked body on the strand.",
     up={"text": "Deal 6 to every foe. Apply 1 Volatile Static to each Soaked foe.",
         "fx": [D(6), A("lightning", 1, attr="volatile", if_="t.water>0")]})
card("w_coast_lash_it_down", "Lash It Down", 1, "W", "self", [B(1, per="hand", k=2, max=11)],
     "Retain. Gain 1 Block, plus 2 per card in your hand (max 11).", kw=["Retain"], world=W, arch="world",
     flavour="On this coast the sea takes whatever is not tied down.",
     note="A hero lashes a satchel to their belt with tarred line as a false beam sweeps the gallery.",
     up={"text": "Retain. Gain 3 Block, plus 2 per card in your hand (max 13).", "fx": [B(3, per="hand", k=2, max=13)]})

# ================================================================== foes
creature("wrecker", "Wrecker", "foe", 34, ranks=[2, 3], role="afflicter",
         resist={"water": "resist", "lightning": "weak"},
         intents={"lamp": I("Wave the False Lamp", "debuff", "back", [STRESS(7), PULL(1)]),
                  "cosh": I("Cosh", "attack", "front", [D(9)]),
                  "hook": I("Wrecking Hook", "attack", "rank2", [D(5), A("water", 1, attr="stable")])},
         ai=[{"use": "lamp", "every": 3}, {"use": "hook", "every": 3, "offset": 1}, {"use": "cosh"}],
         personality="cunning", lore="It lights a lamp on the cliff and waits for the ships to come in.", world=W)

creature("shock_eel", "Shock Eel", "foe", 32, ranks=[3, 4], role="attacker", charge_name="Glow",
         resist={"lightning": "immune", "water": "resist", "toxin": "weak"},
         intents={"glow": I("Organs Glow", "charge", "self", [SELF("charge", 1), B(5)]),
                  "discharge": I("Discharge", "attack", "weakest", [D(4), A("lightning", 2, attr="volatile"), CLR("charge")]),
                  "bite": I("Bite", "attack", "front", [D(7)])},
         ai=[{"use": "discharge", "if": "charge>=1"}, {"use": "glow", "every": 2}, {"use": "bite"}],
         traits=[T("hit", "Live Flesh", "Whoever strikes it gains 1 Static.", [A("lightning", 1, attr="stable")])],
         lore="It lives in the shallows where the wrecks are. It is why there are no survivors.", world=W)

creature("storm_harpy", "Storm Harpy", "foe", 30, ranks=[1, 2], role="attacker",
         resist={"lightning": "resist", "frost": "weak"},
         intents={"rake": I("Rake", "attack", "back", [D(4, times=2)]),
                  "shriek": I("Storm Shriek", "debuff", "all_heroes", [STRESS(5)]),
                  "dive": I("Dive", "attack", "back", [D(6), A("lightning", 1, attr="stable")])},
         ai=[{"use": "shriek", "every": 3, "offset": 1}, {"use": "dive", "every": 3}, {"use": "rake"}],
         personality="cunning", lore="It rides the storm down onto the wrecks.", world=W)

creature("tide_crab", "Tide Crab", "foe", 40, armor=2, ranks=[1], role="defender",
         resist={"water": "resist", "physical": "resist", "lightning": "weak"},
         intents={"pinch": I("Pinch", "attack", "front", [D(8)]),
                  "spray": I("Brine Spray", "debuff", "all_heroes", [A("water", 1, attr="stable")]),
                  "shell": I("Shell Up", "defend", "self", [B(12)])},
         ai=[{"use": "shell", "if": "hp_pct<50", "not_twice": True}, {"use": "spray", "every": 2}, {"use": "pinch"}],
         lore="It picks the wrecks clean. You are a wreck.", world=W)

creature("drowned_bosun", "Drowned Bosun", "foe", 44, armor=1, ranks=[1, 2], role="support",
         resist={"water": "resist", "lightning": "weak"},
         intents={"whistle": I("Silver Whistle", "buff", "all_allies", [ST("might", 1)]),
                  "axe": I("Boarding Axe", "attack", "front", [D(10)]),
                  "haul": I("Haul Away", "attack", "back", [D(4), PULL(1)]),
                  "belay": I("Belay", "defend", "ally_lowest", [B(10)])},
         ai=[{"use": "belay", "if": "ally_hurt", "not_twice": True}, {"use": "whistle", "every": 3},
             {"use": "haul", "every": 3, "offset": 1}, {"use": "axe"}],
         lore="The wreckers' last catch. He signed on.", world=W)

creature("lantern_cow", "Lantern Cow", "foe", 50, ranks=[1], role="defender",
         resist={"lightning": "resist", "fire": "weak"},
         intents={"light": I("Riding Light", "defend", "self", [{"t": "guard_weakest"}, B(6)]),
                  "butt": I("Lumbering Butt", "attack", "front", [D(8), A("lightning", 2, attr="stable")]),
                  "step": I("Hobbled Step", "attack", "front2", [D(4)])},
         ai=[{"use": "light", "if": "ally_hurt", "not_twice": True}, {"use": "step", "every": 3}, {"use": "butt"}],
         lore="They tied a lamp to her horns and walked her slowly along the cliff. Ships took her for a harbour.",
         world=W)

creature("ship_breaker", "Ship-Breaker", "foe", 50, ranks=[1], role="attacker",
         resist={"physical": "resist", "lightning": "resist", "frost": "weak"},
         intents={"pry": I("Crowbar", "debuff", "front", [STEAL(), D(4)]),
                  "knee": I("Oak Knee", "attack", "front", [D(14)]),
                  "strip": I("Strip the Hull", "attack", "front", [LOSE_ARMOR(1), D(5)])},
         ai=[{"use": "pry", "every": 2}, {"use": "strip", "every": 4, "offset": 1}, {"use": "knee"}],
         lore="He broke every wreck down to timber and nails. He does not stop at the wreck.", world=W)

creature("storm_petrels", "Storm Petrels", "foe", 32, ranks=[3, 4], role="afflicter", flags=["swarm"],
         resist={"water": "resist", "frost": "weak"},
         intents={"pour": I("The Flock Pours Over", "attack", "weakest", [D(1, times=4), A("lightning", 2, attr="stable")]),
                  "patter": I("Patter on the Surf", "attack", "back", [D(2, times=3), A("lightning", 1, attr="stable")])},
         ai=[{"use": "pour", "every": 2}, {"use": "patter"}],
         personality="mindless",
         lore="Sailors call them the storm's chickens and pray not to see them. On this coast, nobody has to wait.",
         world=W)

creature("rock_octopus", "Rock Octopus", "foe", 36, ranks=[2], role="afflicter",
         resist={"water": "resist", "fire": "weak"},
         intents={"wrap": I("Copper Arm", "attack", "front", [D(5), A("lightning", 2, attr="stable"), ST("anchor", 2)]),
                  "beak": I("Beak", "attack", "front", [D(8)]),
                  "swell": I("Swell", "defend", "self", [B(10)])},
         ai=[{"use": "swell", "if": "hp_pct<50", "not_twice": True}, {"use": "wrap", "every": 2}, {"use": "beak"}],
         lore="It walled its den with whatever the wrecks gave up. The lightning found the copper.", world=W)

creature("drowned_drummer", "Drowned Drummer", "foe", 34, ranks=[3, 4], role="summoner",
         resist={"water": "resist", "toxin": "weak"},
         intents={"roll": I("Beat to Quarters", "debuff", "all_heroes", [STRESS(6), A("lightning", 1, attr="stable")]),
                  "crew": I("The Crew Still Come", "summon", "self", [SUMMON("wrecker", max=2)]),
                  "rap": I("Stick Rap", "attack", "back", [D(6)])},
         ai=[{"use": "crew", "if": "allies<3", "not_twice": True}, {"use": "roll", "every": 2}, {"use": "rap"}],
         personality="cruel",
         lore="He beat to quarters as she struck. He is beating still, and the crew still come.", world=W)

creature("cragsman", "Cragsman", "foe", 36, ranks=[3, 4], role="attacker", flags=["immovable"],
         resist={"water": "resist", "fire": "weak"},
         intents={"lash": I("Fowling Pole", "attack", "back2", [D(6)]),
                  "swing": I("Swing Across", "attack", "random", [D(9)]),
                  "noose": I("Horsehair Noose", "attack", "back", [D(4), PULL(1)])},
         ai=[{"use": "noose", "every": 3}, {"use": "lash", "every": 2}, {"use": "swing"}],
         lore="He went over the cliff on a rope for the harpies' eggs. Neither he nor the rope came back up.", world=W)

creature("drowned_merchant", "Drowned Merchant", "foe", 48, ranks=[1, 2], role="defender",
         resist={"water": "resist", "physical": "weak"},
         intents={"hug": I("Hug the Strongbox", "defend", "self", [B(14)]),
                  "guard": I("Shield the Goods", "defend", "self", [{"t": "guard_weakest"}, B(6)]),
                  "ram": I("Ram with the Box", "attack", "front", [D(8), A("lightning", 2, attr="stable")])},
         ai=[{"use": "guard", "if": "ally_hurt", "not_twice": True}, {"use": "hug", "every": 3}, {"use": "ram"}],
         lore="He would not let go of the strongbox when she struck. The lightning saw to it that he never will.",
         world=W)

# ================================================================== elites
creature("lighthouse_keeper", "The Lighthouse Keeper", "elite", 96, armor=2, ranks=[3, 4], role="afflicter",
         resist={"lightning": "resist", "water": "resist", "void": "weak"},
         intents={"beam": I("False Beam", "debuff", "front", [DISCARD_RANDOM(), A("lightning", 1, attr="stable")]),
                  "flash": I("The Lens Flashes", "attack", "front", [D(10), A("lightning", 1, attr="volatile")]),
                  "fog": I("Sea Fog", "debuff", "all_heroes", [CONS(s="ward"), A("water", 2, attr="stable")]),
                  "signal": I("Signal the Wreckers", "buff", "all_allies", [ST("might", 1)])},
         ai=[{"use": "fog", "every": 3}, {"use": "flash", "every": 3, "offset": 2}, {"use": "signal", "every": 5, "offset": 4},
             {"use": "beam"}],
         traits=[T("round_start", "The Beam Falls", "Each round the beam falls on the front hero: Marked.",
                   [ST("mark", 1, to="front_enemy")])],
         lore="He keeps the light burning in the wrong place.", world=W)

creature("harpy_matron", "Harpy Matron", "elite", 100, armor=2, ranks=[2], role="summoner",
         resist={"lightning": "resist", "frost": "weak"},
         intents={"brood": I("Call the Brood", "summon", "self", [SUMMON("storm_harpy", max=2)]),
                  "dive": I("Dive from the Storm", "attack", "back", [D(10), A("lightning", 2, attr="stable")]),
                  "screech": I("Screech", "debuff", "all_heroes", [STRESS(7)]),
                  "talons": I("Talons", "attack", "front", [D(6, times=2)])},
         ai=[{"use": "brood", "if": "allies<3", "not_twice": True}, {"use": "dive", "every": 2},
             {"use": "screech", "every": 4, "offset": 1}, {"use": "talons"}],
         traits=[T("ally_death", "Brood Mother", "When a foe dies she gains 2 Might.", [SELF("might", 2)])],
         lore="The mother of the storm harpies, crowned with a drowned queen's circlet.", world=W)

creature("gibbeted_wrecker", "The Gibbeted Wrecker", "elite", 124, armor=3, span=2, ranks=[3, 4], role="attacker",
         flags=["immovable"], charge_name="Charge in the Irons",
         resist={"lightning": "resist", "physical": "resist", "water": "weak"},
         intents={"kick": I("Dangling Kick", "attack", "front", [D(10)]),
                  "rattle": I("Rattle the Cage", "debuff", "all_heroes", [STRESS(6)]),
                  "creak": I("Creak in the Wind", "defend", "self", [B(12), SELF("charge", 1)]),
                  "struck": I("The Gibbet Is Struck", "attack", "all_heroes",
                              [D(5), A("lightning", 2, attr="volatile"), CLR("charge")])},
         ai=[{"use": "struck", "if": "charge>=4"}, {"use": "rattle", "every": 3}, {"use": "creak", "every": 3, "offset": 1},
             {"use": "kick"}],
         traits=[T("round_start", "Lightning Rod", "The highest metal for miles: the irons take 1 charge each round; at "
                   "4 the strike jumps to every hero.", [SELF("charge", 1)])],
         lore="Hanged in irons on the headland as a warning to the coast. The irons are the highest metal for miles.",
         world=W)

creature("strand_wife", "The Strand-Wife", "elite", 106, armor=2, ranks=[1, 2], role="afflicter",
         resist={"water": "resist", "lightning": "resist", "toxin": "weak"},
         intents={"rings": I("Ringed Fist", "attack", "front", [STEAL(), D(7), A("lightning", 2, attr="stable")]),
                  "hook": I("Boat Hook", "attack", "back", [D(5), PULL(1)]),
                  "pockets": I("Go Through the Pockets", "debuff", "random", [DISCARD_RANDOM(), D(4)]),
                  "fist": I("Heavy Fist", "attack", "front", [D(13)])},
         ai=[{"use": "pockets", "if": "flasks>=2", "not_twice": True}, {"use": "rings", "every": 2},
             {"use": "hook", "every": 3, "offset": 1}, {"use": "fist"}],
         traits=[T("death", "Salvage Sack", "When she dies her sack spills: every hero gains 5 Block.",
                   [B(5, to="all_enemies")])],
         personality="cunning",
         lore="After every wreck she walked the tideline and took what the drowned no longer needed. Their rings will "
              "not come off.", world=W)

# ================================================================== rulers
creature("thunder_whale", "The Thunder Whale", "ruler", 310, armor=3, span=2, ranks=[3, 4], role="attacker",
         resist={"lightning": "immune", "water": "resist", "toxin": "weak"},
         intents={"breach": I("Breach", "attack", "all_heroes", [D(6), A("water", 2, attr="stable")]),
                  "spout": I("Spout", "debuff", "rank3", [A("water", 3, attr="stable"), PUSH(1)]),
                  "ram": I("Ram the Cliff", "attack", "front", [D(16)]),
                  "song": I("Thunder Song", "attack", "all_heroes", [D(4), A("lightning", 1, attr="volatile")]),
                  "sound": I("Sound", "defend", "self", [B(20), SELF("regen", 6)]),
                  "tail": I("Blind Fluke", "attack", "back", [D(14)])},
         ai=[{"use": "breach", "every": 3}, {"use": "spout", "every": 3, "offset": 1}, {"use": "ram"}],
         phases=[P(66, "The harpoons light. It sings, and the storm answers.",
                   ai=[{"use": "song", "every": 2}, {"use": "breach"}], might=1),
                 P(25, "It sounds, and rises blind in both eyes.",
                   ai=[{"use": "sound", "every": 4}, {"use": "song", "every": 2}, {"use": "tail", "every": 3},
                       {"use": "breach"}], might=2)],
         traits=[T("hit", "Harpoon Rods", "The storm runs back up the harpoons: whoever strikes it gains 1 Static.",
                   [A("lightning", 1, attr="stable")]),
                 T("round_start", "Cataract Eye", "Its single-target moves never pick the rearmost hero until it is blind "
                   "in both eyes.", [])],
         lore="The storm on the coast is its song.", world=W)

creature("last_prize", "The Last Prize", "ruler", 300, armor=4, span=2, ranks=[3, 4], role="summoner",
         flags=["immovable", "unstunnable"], resist={"lightning": "resist", "water": "resist", "frost": "weak"},
         intents={"broadside": I("Broadside", "attack", "all_heroes", [D(4), A("lightning", 2, attr="stable")]),
                  "drag": I("Drag Aboard", "attack", "back", [D(6), PULL(3), ST("anchor", 2)]),
                  "quarters": I("Crew to the Rail", "summon", "self", [SUMMON("drowned_bosun", max=2)]),
                  "surf": I("Surf Over the Rail", "attack", "front2", [D(4), A("water", 2, attr="stable")]),
                  "bell": I("The Cracked Bell", "debuff", "all_heroes", [STRESS(8)]),
                  "aboard": I("Aboard at Last", "attack", "front", [D(18)])},
         ai=[{"use": "broadside", "every": 3}, {"use": "quarters", "if": "allies<3", "not_twice": True},
             {"use": "drag", "every": 3, "offset": 1}, {"use": "surf"}],
         phases=[P(66, "She lists. The hold stoves in and the sea comes over the rail.",
                   ai=[{"use": "quarters", "if": "allies<3", "not_twice": True}, {"use": "broadside", "every": 3},
                       {"use": "surf"}], might=1),
                 P(25, "She is going down. The bell rings, and the drowned drag the living down with her.",
                   ai=[{"use": "drag", "every": 2}, {"use": "aboard", "every": 2, "offset": 1}, {"use": "bell"}], might=2)],
         traits=[T("phase", "Taking Water", "Each time she lists further the sea floods in: she gains 3 Soak, and the "
                   "company's lightning finds her.", [A("water", 3, attr="stable", to="self")])],
         lore="The richest ship the coast ever took. It has been going down for a hundred years and has not finished.",
         world=W)

creature("wind_seller", "The Wind-Seller", "ruler", 270, armor=2, span=2, ranks=[3, 4], role="afflicter",
         charge_name="Knots Untied", resist={"lightning": "resist", "water": "resist", "physical": "weak"},
         intents={"push": I("Offshore Gust", "attack", "front", [D(4), A("water", 2, attr="stable"), PUSH(2)]),
                  "pull": I("Onshore Gust", "attack", "back", [D(3), A("water", 2, attr="stable"), PULL(2)]),
                  "whistle": I("Bird-Bone Whistle", "summon", "self", [SUMMON("storm_petrels", max=2)]),
                  "lash": I("Knotted Cord", "attack", "front", [D(12)]),
                  "bolt": I("A Bolt on the Rank", "attack", "random", [D(9), A("lightning", 2, attr="volatile")]),
                  "storm": I("The Third Knot", "attack", "all_heroes", [D(5), A("lightning", 1, attr="volatile")])},
         ai=[{"use": "whistle", "if": "allies<3", "not_twice": True}, {"use": "push", "every": 3},
             {"use": "pull", "every": 3, "offset": 1}, {"use": "lash"}],
         phases=[P(66, "The second knot comes undone. A gale.",
                   ai=[{"use": "bolt", "every": 2}, {"use": "push", "every": 4}, {"use": "pull"}], might=1),
                 P(25, "The third knot. The storm.", ai=[{"use": "storm"}], might=2)],
         traits=[T("phase", "Three Knots", "Each phase unties a knot on her cord, and her moves change with it.",
                   [SELF("charge", 1)])],
         lore="She sold sailors their winds tied up in knotted cord. On this coast she only ever sold the one kind.",
         world=W)

# ================================================================== encounters
E = encounter
E(W, "coast_f1", "The Lamps Are Lit", "The bosun on the strand and two wreckers with their lamps.",
  ["drowned_bosun", "wrecker", "wrecker"], "coast_cliffs", "foe",
  "The Wreckers lure the back rank forward into the Bosun's axe; kill a Wrecker first to stop the pulls.")
E(W, "coast_f2", "The Eel Shallows", "Things that bite, things that hold and things that shock.",
  ["tide_crab", "rock_octopus", "shock_eel", "shock_eel"], "coast_cove", "foe",
  "The crab Soaks, the octopus holds a hero so it cannot Swap out of the wet, the eels close the circuit.")
E(W, "coast_f3", "The Harpy Rocks", "They ride the storm down, and the cragsman swings below them.",
  ["storm_harpy", "storm_harpy", "cragsman"], "coast_cliffs", "foe",
  "Everything hits the back ranks; the front-rank wall has nothing to block. Protect the rear or kill fast.")
E(W, "coast_f4", "The Wreck", "The merchant, the bosun and the drummer who calls the crew.",
  ["drowned_merchant", "drowned_bosun", "drowned_drummer"], "coast_cove", "foe",
  "The Merchant walls the front while the Drummer keeps calling crew; reach the Drummer or the fight never ends.")
E(W, "coast_f5", "The Riding Light", "A lantern on a cow's horns, and the flock ahead of the gale.",
  ["lantern_cow", "wrecker", "storm_petrels"], "coast_cliffs", "foe",
  "The cow guards whoever is hurt and the petrels feed Static to the eel-less line: switch targets or kill her first.")
E(W, "coast_f6", "The Breakers' Yard", "A ship-breaker at work with his crowbar.",
  ["ship_breaker", "wrecker", "rock_octopus"], "coast_cove", "foe",
  "The octopus pins the front hero and the Ship-Breaker pries its Block away first; Block-only defence fails.")
E(W, "coast_f7", "The Gallery Rail", "Fliers round the lighthouse gallery.",
  ["wrecker", "storm_petrels", "storm_harpy"], "coast_light", "foe",
  "Fast fliers in a tight space; area damage pays, and the Wrecker's stress stacks if left alive.")
E(W, "coast_f8", "Salvage", "The merchant hugs his box over the eel's pool.",
  ["drowned_merchant", "shock_eel", "cragsman"], "coast_cove", "foe",
  "The Merchant guards the eel; break the guard or Ward the company before the discharge.")
E(W, "coast_e1", "The Lighthouse", "The keeper tends the false light.",
  ["tide_crab", "wrecker", "lighthouse_keeper"], "coast_light", "elite",
  "The beam empties the front hero's hand and the fog strips Ward: play cards early and keep the lit hero dry.")
E(W, "coast_e2", "The Matron's Roost", "The crowned harpy and her brood.",
  ["storm_harpy", "harpy_matron"], "coast_cliffs", "elite",
  "Every harpy that dies feeds her Might; clear the brood with one area hit or go through it to her.")
E(W, "coast_e3", "The Gibbet", "A cage on the headland, swinging in the storm.",
  ["wrecker", "shock_eel", "gibbeted_wrecker"], "coast_cliffs", "elite",
  "The irons count to the strike: kill the eel, stay dry, and Soak him, since rust eats the irons.")
E(W, "coast_e4", "The Tideline", "She walks the strand after the wreck.",
  ["strand_wife", "drowned_merchant", "rock_octopus"], "coast_cove", "elite",
  "She takes the Block the company banks and goes through full belts: spend what you gain the round you gain it.")
E(W, "coast_r_thunder_whale", "The Thunder Whale", "The storm sings.",
  ["shock_eel", "tide_crab", "thunder_whale"], "coast_boss", "ruler",
  "Breach soaks the line and the Song runs through it: Ward and cleanse before the Song, and use rank 4.")
E(W, "coast_r_last_prize", "The Last Prize", "The carrack lies heeled over on the rocks.",
  ["drowned_bosun", "wrecker", "last_prize"], "coast_boss", "ruler",
  "Her crew holds the rail: once she lists, she is Soaked and the company's lightning finds her.",
  props="last_prize")
E(W, "coast_r_wind_seller", "The Wind-Seller", "She stands on the sea-stack, worrying at the next knot.",
  ["storm_petrels", "cragsman", "wind_seller"], "coast_boss", "ruler",
  "The gusts break the formation and Soak it; each knot is worse, so race her before the third.",
  props="wind_seller")

NEEDS = [
    "lighthouse_keeper The Beam Falls: the beam should fall on the hero holding the most cards (needs target "
    "'most_cards'); written as the front hero.",
    "lighthouse_keeper Sea Fog: intent text reads 'consume' for CONS(s=ward); it should read 'strips their Ward'.",
    "gibbeted_wrecker Lightning Rod: should gain a charge whenever any unit gains Static (needs an on-course-applied "
    "trigger); written as 1 charge a round.",
    "lantern_cow Lightning Rod: lightning applied to her allies should land on her (needs course redirection); written "
    "as guarding the weakest foe.",
    "strand_wife: should move one good status (Prime, Might, Riposte, Block) from a hero to herself and target "
    "whoever banked the most; written as taking Block, and her death spill as Block for every hero.",
    "strand_wife Salvage Sack and drowned_merchant strongbox: gold on death (postponed by row 14).",
    "thunder_whale Harpoon Rods: lightning applied to it should add power to its next Song (needs an on-course-applied "
    "trigger); written as Static on whoever strikes it. Cataract Eye is kept by its move targets (no fx).",
    "thunder_whale and last_prize: 3-rank bodies redesigned to 2 ranks (row 13).",
]
