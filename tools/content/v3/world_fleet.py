"""World VII: The Icebound Fleet (frost + water, Freeze). Role map: docs/design/gate2/world_VII_icebound_fleet.md.
Bible: art/party/bible/world_VII_icebound_fleet.md. Base numbers at Threat 0."""
from dsl import *
from creatures import *
WARD = W  # dsl's Ward helper; W below is the world key
W = "fleet"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])
F, WA = "frost", "water"

# ================================================================== cards foes put in a hand
card("t_fleet_broth", "Ship's Broth", 0, "Curse", "none", [A(F, 1, attr="stable"), STRESS(3)],
     "Unplayable. On arrival and each time it is drawn: gain 1 Frost and 3 stress. When drawn, draw a replacement. Removed at fight end.",
     use=[], kw=["Temporary", "Unplayable", "Curse"], on_draw=[A(F, 1, attr="stable"), STRESS(3)],
     flavour="The stores ran out in the second month. The pot did not.",
     note="The Galley Cook ladles frozen broth into a hero's bowl; something in it has a knuckle.")

# ================================================================== world cards (Freeze; any calling)
card("w_fleet_ice_breaker", "Ice Breaker", 1, "W", "enemy", [D(5), D(4, if_="t.frost>0")],
     "Deal 5. If the target has Frost, deal 4 more.", world=W, arch="world",
     up={"text": "Deal 7. If the target has Frost, deal 5 more.", "fx": [D(7), D(5, if_="t.frost>0")]},
     flavour="The ice holds them still. It holds them brittle too.",
     note="A hero's blow breaks a rimed Deckhand off the rail in white shards.")
card("w_fleet_keelhaul", "Keelhaul", 1, "W", "enemy",
     [D(2), PULL(1), PULL(1, if_="handoff"), A(WA, 2, attr="stable", if_="t.rank<=1")],
     "Deal 2. Pull the target forward 1, or 2 on a Handoff. If it is now in rank 1, apply 2 Water.", cat=WA, world=W,
     arch="world",
     up={"text": "Deal 3. Pull the target forward 1, or 2 on a Handoff. If it is now in rank 1, apply 3 Water.",
         "fx": [D(3), PULL(1), PULL(1, if_="handoff"), A(WA, 3, attr="stable", if_="t.rank<=1")]},
     flavour="Under the keel and up the other side, if the ice allows.",
     note="A hero hauls a Frozen Whaler across the deck on his own harpoon line.")
card("w_fleet_frozen_to_the_rail", "Frozen to the Rail", 1, "W", "self", [B(3, per="frost", k=2)],
     "Gain 3 Block, plus 2 per Frost on you.", cat=F, world=W, arch="world",
     up={"text": "Gain 5 Block, plus 2 per Frost on you.", "fx": [B(5, per="frost", k=2)]},
     flavour="The marine was posted to keep order on deck. The cold kept him there.",
     note="A hero braces against a rimed rail, frost locking the shield in place.")
card("w_fleet_the_sea_freezes", "The Sea Freezes", 2, "W", "all_enemies",
     [D(3), A(WA, 1, attr="stable"), REACT(1, if_="t.frost>0")],
     "Deal 3 to every foe. Apply 1 Water to every foe. Conjoin every foe that has Frost.", cat=WA, world=W,
     arch="world",
     up={"text": "Deal 4 to every foe. Apply 2 Water to every foe. Conjoin every foe that has Frost.",
         "fx": [D(4), A(WA, 2, attr="stable"), REACT(1, if_="t.frost>0")]},
     flavour="The fleet sailed north to kill it. The sea closed over them all.",
     note="Black water floods across the floe and whitens round the crew's ankles.")

# ================================================================== foes
creature("frozen_whaler", "Frozen Whaler", "foe", 38, armor=1, ranks=[2, 3], world=W, role="attacker",
         resist={F: "resist", "fire": "weak"},
         intents={"harpoon": I("Harpoon on a Line", "attack", "back", [D(7), PULL(1)]),
                  "flense": I("Flensing Knife", "attack", "front", [D(8), ST("bleed", 2)]),
                  "coil": I("Coil the Line", "defend", "self", [B(8)])},
         ai=[{"use": "harpoon", "every": 2}, {"use": "coil", "if": "hp_pct<50", "not_twice": True}, {"use": "flense"}],
         lore="It still hunts whales. Anything large and slow will do.")
creature("rime_gulls", "Rime Gulls", "foe", 28, ranks=[3, 4], world=W, role="afflicter", flags=["swarm"],
         resist={F: "resist", "physical": "weak"},
         intents={"peck": I("Peck the Eyes", "attack", "back", [D(2, times=3)]),
                  "mob": I("Mob", "debuff", "back", [STRESS(7), ST("vulnerable", 1)])},
         ai=[{"use": "mob", "every": 3}, {"use": "peck"}],
         lore="They followed the fleet out and froze with it. They thawed first.")
creature("ice_eel", "Ice Eel", "foe", 34, ranks=[2, 3], world=W, role="attacker",
         resist={F: "resist", WA: "resist", "lightning": "weak"},
         intents={"strike": I("Strike from the Hole", "attack", "front", [D(6), A(F, 2, attr="stable")]),
                  "wrap": I("Wrap", "attack", "front", [D(4), A(WA, 2, attr="stable")]),
                  "dive": I("Dive Under the Ice", "defend", "self", [me("dodge", 2)])},
         # it dives when Marked or hurt: Mark setups lose their target for a round
         ai=[{"use": "dive", "if": "mark>0", "not_twice": True}, {"use": "dive", "if": "hp_pct<50", "not_twice": True},
             {"use": "wrap", "every": 2}, {"use": "strike"}],
         lore="It hunts through holes in the ice.")
creature("deck_hand", "Drowned Deckhand", "foe", 36, ranks=[1], world=W, role="attacker",
         resist={WA: "resist", "fire": "weak"},
         intents={"cutlass": I("Cutlass", "attack", "front", [D(9)]),
                  "shanty": I("Shanty", "buff", "all_allies", [ST("might", 1)]),
                  "chorus": I("Sing Louder", "debuff", "all_heroes", [STRESS(5)])},
         ai=[{"use": "shanty", "every": 4, "offset": 1}, {"use": "chorus", "every": 3}, {"use": "cutlass"}],
         lore="Still ready to board. Still singing.")
creature("walrus_brute", "Walrus Brute", "foe", 50, armor=2, ranks=[1], world=W, role="defender",
         resist={F: "resist", "physical": "resist", "fire": "weak"},
         intents={"blubber": I("Wall of Blubber", "defend", "self", [B(10), me("fortify", 1), {"t": "guard_weakest"}]),
                  "tusk": I("Cutlass Tusk", "attack", "front", [D(10)]),
                  "crush": I("Belly Crush", "attack", "front", [D(6), ST("stun", 1)])},
         ai=[{"use": "blubber", "every": 3}, {"use": "crush", "every": 4, "offset": 2}, {"use": "tusk"}],
         lore="It hauled out on the ice beside the ships and never left.")
creature("powder_monkey", "Powder Monkey", "foe", 28, ranks=[3, 4], world=W, role="support",
         resist={F: "resist", "physical": "weak"},
         intents={"run": I("Run a Cartridge", "buff", "ally_front", [ST("empower", 5)]),
                  "shot": I("Hand Up the Shot", "defend", "all_allies", [B(5)]),
                  "spare": I("A Spare Cartridge", "buff", "ally_lowest", [ST("empower", 3), B(4)]),
                  "duck": I("Duck Behind the Guns", "defend", "self", [B(6), me("dodge", 1)])},
         ai=[{"use": "duck", "if": "hp_pct<50", "not_twice": True}, {"use": "run", "every": 2},
             {"use": "shot", "every": 3}, {"use": "spare"}],
         lore="He was sent below for powder as the sea froze. He is still bringing it.")
creature("sea_lice", "Sea Lice", "foe", 30, ranks=[1, 2], world=W, role="afflicter", flags=["swarm"],
         resist={F: "resist", WA: "resist", "toxin": "weak"},
         intents={"strip": I("Strip to the Bone", "attack", "front", [D(4), ST("bleed", 3)]),
                  "surge": I("Surge Over the Legs", "attack", "front2", [D(3), ST("bleed", 1)])},
         ai=[{"use": "surge", "every": 3}, {"use": "strip"}],
         traits=[T("death", "The Lice Scatter", "When the heap dies, the lice scatter over the two front heroes: 3 Bleed each.",
                   [ST("bleed", 3, to="front2")])],
         lore="Sailors are sewn into their hammocks for burial. The lice do not mind the stitching.")
creature("capstan_gang", "Capstan Gang", "foe", 46, armor=1, ranks=[1, 2], world=W, role="attacker",
         resist={F: "resist", WA: "resist", "physical": "weak"},
         intents={"heave": I("Heave Round", "attack", "front2", [D(4), SELF("might", 1)]),
                  "walk": I("Walk the Drum Forward", "attack", "front", [D(8), SELF("might", 1)]),
                  "brace": I("Brace the Bars", "defend", "self", [B(10)])},
         ai=[{"use": "brace", "if": "hp_pct<40", "not_twice": True}, {"use": "walk", "every": 3}, {"use": "heave"}],
         traits=[T("lost_action", "Lose the Count", "When it is Stunned or Frozen, the fiddler loses the time: it loses all its Might.",
                   [CLR("might", to="self")])],
         lore="They were weighing anchor when the sea froze. They have not stopped pushing.")
creature("sailmaker", "The Sailmaker", "foe", 40, ranks=[2], world=W, role="summoner",
         resist={F: "resist", WA: "resist", "fire": "weak"},
         intents={"needle": I("Stitch in Place", "attack", "front", [D(5), ST("stun", 1)]),
                  "drop": I("Drop the Hammock", "summon", "self", [SUMMON("sea_lice", max=1)]),
                  "sew": I("Sew Them Shut", "debuff", "back", [ST("anchor", 2)]),
                  "stab": I("Palm and Needle", "attack", "front", [D(8)])},
         ai=[{"use": "drop", "if": "round>=2&allies<4", "once": True}, {"use": "needle", "every": 3},
             {"use": "sew", "every": 4, "offset": 1}, {"use": "stab"}],
         lore="He sews the dead into their hammocks. The last stitch goes through the nose, to be sure.")
creature("fleet_marine", "Fleet Marine", "foe", 44, armor=2, ranks=[1], world=W, role="defender",
         resist={F: "resist", WA: "resist", "physical": "weak"},
         intents={"order": I("Close Order", "defend", "ally_lowest", [GUARD(), B(6, to="self")]),
                  "ready": I("Bayonet Ready", "defend", "self", [B(6), me("thorns", 3)]),
                  "lunge": I("Bayonet Lunge", "attack", "front", [D(10)])},
         ai=[{"use": "order", "if": "ally_hurt", "not_twice": True}, {"use": "ready", "every": 3}, {"use": "lunge"}],
         traits=[T("hit", "Order Kept", "A hero who moved this round and then strikes him meets the bayonet: it takes 3.",
                   [D(3, if_="t.moved>0")])],
         lore="He was posted to keep order on deck. Order has been kept.")
creature("galley_cook", "The Galley Cook", "foe", 42, ranks=[2, 3], world=W, role="support",
         resist={F: "resist", WA: "resist", "toxin": "weak"},
         intents={"feed": I("From the Frozen Pot", "heal", "ally_lowest", [H(10)]),
                  "broth": I("What Is in the Broth", "debuff", "all_heroes", [STRESS(6)]),
                  "ladle": I("Ladle Out", "debuff", "random", [ADD("t_fleet_broth")]),
                  "cleaver": I("Cleaver", "attack", "front", [D(8)])},
         ai=[{"use": "feed", "if": "ally_hurt", "not_twice": True}, {"use": "broth", "every": 3}, {"use": "ladle", "every": 4, "offset": 2}, {"use": "cleaver"}],
         lore="The stores ran out in the second month. The pot did not.")
creature("ice_edge_orca", "Ice-Edge Orca", "foe", 48, armor=1, ranks=[1, 2], world=W, role="attacker",
         resist={F: "resist", WA: "resist", "lightning": "weak"},
         intents={"drag": I("Slide and Bite", "attack", "back", [D(7), A(WA, 2, attr="stable"), PULL(1)]),
                  "snap": I("Snap", "attack", "front", [D(10)]),
                  "rock": I("Rock on the Edge", "defend", "self", [B(8)])},
         ai=[{"use": "drag", "every": 2}, {"use": "rock", "if": "hp_pct<50", "not_twice": True}, {"use": "snap"}],
         lore="It learned to slide onto the ice for seals. Sailors stand closer to the edge.")

# ================================================================== elites
creature("icewed_captain", "The Ice-Wed Captain", "elite", 105, armor=3, ranks=[1, 2, 3], world=W, role="support",
         resist={F: "resist", WA: "resist", "lightning": "weak"},
         intents={"sabre": I("Icicle Sabre", "attack", "front", [D(12), A(F, 2, attr="stable")]),
                  "hands": I("All Hands", "buff", "all_allies", [ST("might", 1), B(5)]),
                  "keelhaul": I("Keelhaul", "attack", "back", [D(8), PULL(2), A(WA, 2, attr="stable")]),
                  # answer: the company stacks Block behind a front hero; he takes it
                  "belay": I("Belay That", "attack", "front", [D(6), STEAL()])},
         ai=[{"use": "hands", "every": 4, "offset": 1}, {"use": "belay", "if": "round>=2", "every": 3},
             {"use": "keelhaul", "every": 3, "offset": 1}, {"use": "sabre"}],
         traits=[T("round_start", "Command", "At round start the allies beside him keep their Block this round.",
                   [ST("fortify", 1, to="adjacent")])],
         lore="Married to the sea, and the sea froze at the wedding.")
creature("frost_selkie", "Frost Selkie", "elite", 90, armor=2, ranks=[1, 2], world=W, role="afflicter",
         resist={WA: "resist", F: "resist", "lightning": "weak"},
         intents={"song": I("Sealskin Song", "debuff", "all_heroes", [STRESS(9)]),
                  "lunge": I("Lunge and Bite", "attack", "front", [D(9), ST("bleed", 2)]),
                  "slip": I("Slip the Skin", "heal", "self", [H(12), me("dodge", 2)]),
                  # answer: a hero already near breaking hears her best
                  "louder": I("Sing Louder", "debuff", "most_stress", [D(4), STRESS(14)])},
         ai=[{"use": "slip", "if": "hp_pct<50", "not_twice": True},
             {"use": "louder", "if": "hero_stress>=50", "not_twice": True},
             {"use": "song", "every": 3}, {"use": "lunge"}],
         traits=[T("round_start", "Stolen Skin", "At round start she gains 6 Block: the first blow glances off the stolen skin.",
                   [B(6, to="self")])],
         lore="She lost her skin to a sailor. She took his in return.")
creature("white_bear", "The White Bear", "elite", 125, armor=3, span=2, ranks=[1, 2], world=W, role="attacker",
         resist={F: "resist", WA: "resist", "fire": "weak"},
         intents={"lunge": I("Lunge", "attack", "front", [D(9)]),
                  "paw": I("Forepaw", "attack", "front", [D(15), ST("anchor", 2)]),
                  # answer: once the company has Frost on it, it turns on the course-setters behind
                  "swipe": I("Swipe at the Rear", "attack", "back", [D(12)]),
                  "shake": I("Shake Off the Sea", "defend", "self", [B(12), CLEANSE(3, to="self")])},
         ai=[{"use": "swipe", "if": "frost>=2", "not_twice": True}, {"use": "shake", "if": "hp_pct<50", "not_twice": True},
             {"use": "paw", "every": 3}, {"use": "lunge"}],
         traits=[T("lost_action", "Climbed Out Anyway", "When it is Stunned or Frozen, it climbs out angrier: it gains 2 Might.",
                   [SELF("might", 2)])],
         lore="It crossed the ice to eat the frozen crews. It fell through where the ice was thin, and climbed out anyway.")
creature("ships_surgeon", "The Ship's Surgeon", "elite", 95, armor=2, ranks=[1, 2, 3], world=W, role="afflicter",
         resist={F: "resist", WA: "resist", "toxin": "weak"},
         intents={"saw": I("Bow Saw", "attack", "front", [D(9), ST("bleed", 3), A(F, 1, attr="volatile")]),
                  "tourniquet": I("Screw Tourniquet", "heal", "ally_lowest", [H(14), B(6)]),
                  "douse": I("Spirit on the Wound", "debuff", "front2", [A(WA, 2, attr="stable")]),
                  # answer: he works on the hero the company is trying to save
                  "amputate": I("Take the Arm", "attack", "weakest", [D(14), STRESS(6)])},
         ai=[{"use": "tourniquet", "if": "ally_hurt", "not_twice": True}, {"use": "douse", "every": 3, "offset": 1},
             {"use": "amputate", "every": 3}, {"use": "saw"}],
         traits=[T("ally_death", "Save the Rest", "When an ally falls, he heals the most wounded ally 12.",
                   [H(12, to="lowest_ally")])],
         lore="He took the frozen fingers to save the hand, and the hand to save the arm. He has not finished saving anyone.")

# ================================================================== rulers
creature("leviathan_ice", "The Leviathan in the Ice", "ruler", 290, armor=3, span=2, ranks=[3, 4], world=W,
         role="attacker", flags=["immovable"], charge_name="Breath", personality="mindless",
         resist={F: "immune", WA: "resist", "lightning": "weak"},
         intents={"breath": I("White Breath", "debuff", "all_heroes", [A(WA, 2, attr="stable"), A(F, 1, attr="stable")]),
                  "jaw": I("The Jaw Breaks Through", "attack", "marked", [D(15), A(F, 2, attr="volatile")]),
                  "sound": I("Sound the Depths", "defend", "self", [B(20), me("regen", 5), CLEANSE(3, to="self")]),
                  "breach": I("Breach", "attack", "all_heroes", [D(7), A(WA, 2, attr="stable")]),
                  "swallow": I("Swallow Whole", "attack", "marked", [D(22), STRESS(10)]),
                  "draw": I("Draw Breath", "charge", "self", [SELF("charge", 1)]),
                  "freeze": I("The Sea Freezes", "attack", "all_heroes",
                              [D(5), A(WA, 1, attr="stable"), A(F, 2, attr="volatile"), CLR("charge")])},
         # Hex stacked on it is shaken off when it sounds
         ai=[{"use": "breath", "if": "round==1"}, {"use": "sound", "if": "hex>=4", "not_twice": True},
             {"use": "sound", "if": "hp_pct<70", "once": True}, {"use": "breath", "every": 3}, {"use": "jaw"}],
         traits=[T("hit", "The Eye Follows", "A hero who hits it is Marked: the eye under the ice follows them, and its single blows go there.",
                   [ST("mark", 1)])],
         phases=[P(50, "The ice cracks. The Leviathan rises out of the sea.",
                   ai=[{"use": "freeze", "if": "charge>=1"}, {"use": "draw", "every": 4},
                       {"use": "breach", "every": 2}, {"use": "swallow"}], might=1),
                 P(20, "It drags the whole fleet down with it.",
                   ai=[{"use": "freeze", "if": "charge>=1"}, {"use": "draw", "every": 3},
                       {"use": "swallow", "every": 2}, {"use": "breath"}], might=2)],
         lore="The fleet sailed to kill it. It froze the sea around them all.")
creature("the_broadside", "The Broadside", "ruler", 270, armor=4, span=2, ranks=[3, 4], world=W, role="attacker",
         flags=["immovable"], charge_name="Load",
         resist={F: "resist", WA: "resist", "fire": "weak"},
         intents={"full": I("Full Broadside", "attack", "all_heroes",
                              [D(6), D(3, to="front2"), A(F, 2, attr="volatile"), CLR("charge")]),
                  "reload": I("Reload", "charge", "self", [SELF("charge", 1), B(14)]),
                  "port": I("Port Battery", "attack", "front2", [D(9), A(WA, 2, attr="stable")]),
                  "swivel": I("Swivel Gun", "attack", "back", [D(10), ST("vulnerable", 1)]),
                  "ripple": I("Every Gun at Once", "attack", "all_heroes",
                                [D(4), D(2, to="front2"), D(2, to="front_enemy"), A(F, 1, attr="stable"), SELFDMG(8)]),
                  "plug": I("Plug the Shot-Holes", "defend", "self", [B(18)])},
         ai=[{"use": "full", "if": "round==1"}, {"use": "full", "if": "charge>=1"}, {"use": "reload", "every": 3},
             {"use": "swivel", "every": 2}, {"use": "port"}],
         traits=[T("round_start", "Boarders on the Ladder",
                   "At round start, a frozen boarder drops from the entry ladder into an empty rank (twice per fight).",
                   [SUMMON("deck_hand", max=2)])],
         phases=[P(50, "Every gun at once. The ice in her barrels bursts them.",
                   ai=[{"use": "ripple"}]),
                 P(20, "Her seams split along the waterline. The gunners keep firing.",
                   ai=[{"use": "plug", "once": True}, {"use": "swivel", "every": 3}, {"use": "ripple"}], might=1)],
         lore="She fired the first broadside of the battle. The ice has kept her loaded ever since.")
creature("the_shrouds", "The Shrouds", "ruler", 250, armor=2, span=2, ranks=[3, 4], world=W, role="summoner",
         flags=["immovable", "unstunnable"],
         resist={F: "resist", WA: "resist", "physical": "weak"},
         intents={"drop": I("A Topman Drops", "attack", "random", [D(14)]),
                  "icicles": I("Icicles Fall", "attack", "random", [D(3, times=3), A(F, 2, attr="stable")]),
                  "sight": I("Sail Ho", "debuff", "back", [ST("vulnerable", 1), STRESS(5)]),
                  "haul": I("Haul Taut", "defend", "self", [B(16)]),
                  "cut": I("Cut Loose", "summon", "self", [SUMMON("deck_hand", max=2)]),
                  "yard": I("The Lower Yard Swings", "attack", "front2", [D(9)]),
                  "web": I("The Web Parts", "attack", "all_heroes", [D(7), ST("anchor", 2)])},
         ai=[{"use": "haul", "if": "hp_pct<80", "once": True}, {"use": "icicles", "every": 3},
             {"use": "sight", "every": 4, "offset": 2}, {"use": "drop"}],
         traits=[T("phase", "The Web Shudders", "Each time it enters a phase, icicles fall: 1 Frost on every hero.",
                   [A(F, 1, attr="stable", to="all_enemies")])],
         phases=[P(66, "The lowest topmen let go for good.",
                   ai=[{"use": "cut", "if": "allies<3", "not_twice": True}, {"use": "yard", "every": 3},
                       {"use": "icicles", "every": 4}, {"use": "drop"}]),
                 P(25, "The web parts. The rigging comes down.",
                   ai=[{"use": "web", "every": 2}, {"use": "drop"}], might=2)],
         lore="The topmen were aloft when the sea froze. No one has called them down.")

# ================================================================== encounters
E = lambda *a, **k: encounter(W, *a, **k)
E("fleet_f1", "The Frozen Deck", "Whalers at their stations, frozen to the rails.",
  ["deck_hand", "frozen_whaler", "frozen_whaler"], "fleet_deck", "foe",
  "The harpoons drag the back rank forward into the cutlass; put the dragged hero back with Swap or keep it covered.")
E("fleet_f2", "Gull Rookery", "The gulls have the rigging. A marine keeps order under it.",
  ["fleet_marine", "rime_gulls", "rime_gulls"], "fleet_deck", "foe",
  "The Marine punishes heroes who move in on him while the gulls stress the rear; area damage beats both flocks, and Thorns bite every peck.")
E("fleet_f3", "The Ice Holes", "Holes in the floe, and things in the holes.",
  ["walrus_brute", "ice_eel", "ice_edge_orca"], "fleet_ice", "foe",
  "The walrus guards the weakest, the eel and orca Soak and drag; Freeze the walrus and shatter it, or ignore it for the biters.")
E("fleet_f4", "The Gun Deck", "A boy runs between the guns with a cartridge case.",
  ["fleet_marine", "frozen_whaler", "powder_monkey"], "fleet_hold", "foe",
  "The boy loads the front man's next blow. Kill him first, or Freeze what he loads.")
E("fleet_f5", "Weighing Anchor", "The capstan turns. The fiddler keeps time.",
  ["capstan_gang", "powder_monkey", "rime_gulls"], "fleet_deck", "foe",
  "The capstan grows every round and the boy loads it; kill it fast or keep the front two behind Block.")
E("fleet_f6", "The Galley", "The pot is still on. Something is in it.",
  ["deck_hand", "fleet_marine", "galley_cook"], "fleet_hold", "foe",
  "The cook heals and stresses behind two bodies and ladles broth into hands; reach him or the fight drags.")
E("fleet_f7", "Burial Detail", "Hammocks sewn shut, laid in rows. One is moving.",
  ["sea_lice", "sailmaker", "frozen_whaler"], "fleet_hold", "foe",
  "The Sailmaker stitches heroes in place and drops more lice; kill lice when the front hero can take the Bleed.")
E("fleet_f8", "The Lead", "A channel of black water between the floes.",
  ["ice_edge_orca", "ice_eel", "ice_eel"], "fleet_ice", "foe",
  "Three Soakers and chillers, and the orca drags a fresh hero into them; Ward or rotate the front, and do not Mark an eel you cannot kill.")
E("fleet_e1", "The Captain's Cabin", "The captain at his frozen wheel, his crew at his flanks.",
  ["icewed_captain", "deck_hand", "fleet_marine"], "fleet_hold", "elite",
  "His flank keeps its Block and he takes yours; kill the crew from the side he cannot cover, or burst him.")
E("fleet_e2", "The Selkie's Floe", "She is singing on the ice. The gulls are listening.",
  ["frost_selkie", "rime_gulls", "ice_eel"], "fleet_ice", "elite",
  "Heavy stress from song and gulls; open each round on her with a cheap hit to spend the stolen-skin Block.")
E("fleet_e3", "The White Bear", "It came across the ice for the crews.",
  ["white_bear", "rime_gulls"], "fleet_ice", "elite",
  "It sheds courses every round and turns on the rear once it carries Frost; Freeze it in one round or hit it plainly.")
E("fleet_e4", "The Cockpit", "The surgeon's table, and the lice under it.",
  ["ships_surgeon", "fleet_marine", "sea_lice"], "fleet_hold", "elite",
  "He saws the weakest hero and heals on every death; kill him before the crew, or stop leaving one hero low.")
E("fleet_r_leviathan_ice", "The Leviathan in the Ice", "The sea itself is frozen around it. The eye is open.",
  ["frozen_whaler", "ice_eel", "leviathan_ice"], "fleet_boss", "ruler",
  "White Breath soaks the company, then the jaw finds whoever struck it; once it rises, Ward before every Sea Freezes.")
E("fleet_r_the_broadside", "The Broadside", "A wall of black hull, every port open.",
  ["fleet_marine", "powder_monkey", "the_broadside"], "fleet_boss", "ruler",
  "Her broadside Freezes every Soaked hero; stay dry when she is loaded, then outlast her ripple or race it.",
  props="the_broadside")
E("fleet_r_the_shrouds", "The Shrouds", "The rigging hangs over the ice, full of men.",
  ["deck_hand", "rime_gulls", "the_shrouds"], "fleet_boss", "ruler",
  "Topmen drop on anyone; the web hits physical hard, and when it parts it Anchors the company, so set ranks early.",
  props="the_shrouds")

NEEDS = [
    "leviathan_ice: Swallow Whole should swallow a Frozen hero (postponed, row 14); written as a heavy hit and stress on the Marked hero.",
    "white_bear: Climbed Out Anyway should also break its first Freeze at once (self-unfreeze); written as 2 Might each time it loses an action.",
]
