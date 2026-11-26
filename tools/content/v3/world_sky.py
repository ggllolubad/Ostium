"""World XV: The Torn Sky (lightning + void, Discharge). Role map: docs/design/gate2/world_XV_torn_sky.md.
Bible: art/party/bible/world_XV_torn_sky.md and RIVAL_RULERS.md. Base numbers at Threat 0.
DECISIONS row 16: heaven was torn by the void's betrayal; no line here speaks of a war."""
from dsl import *
from creatures import *

WARD = W  # the Ward helper; W is the world key below
W = "sky"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

# Discharge on a hero: a Stable Erode, then a Volatile Static that sets it off (2x power, true damage).
def DIS(n=1):
    return [A("void", n, attr="stable"), A("lightning", n, attr="volatile")]

HEAVEN = {"lightning": "resist", "void": "weak"}   # gold over black, undone by the void (DECISIONS row 15)
RIFT = {"void": "immune", "lightning": "weak"}     # things that came in through the tears

# ================================================================== rulers
creature("rift_hound", "Rift Hound", "foe", 34, ranks=[1, 2], role="attacker", resist=RIFT,
         intents={
             "phase": I("Lunge From a Rift", "attack", "back", [D(6), A("void", 1, attr="stable")]),
             "maul": I("Maul", "attack", "front", [D(9)]),
             "blink": I("Blink", "defend", "self", [SELF("dodge", 1)]),
         },
         ai=[{"use": "blink", "every": 4, "offset": 3}, {"use": "phase", "every": 2}, {"use": "maul"}],
         lore="It comes through the tears in the sky. Things that should not be followed it.",
         world=W)

creature("shattered_god", "The Shattered God", "ruler", 310, armor=2, span=2, ranks=[3, 4], role="afflicter",
         resist={"void": "immune", "lightning": "resist"},
         intents={
             "seep": I("Void Seeps", "debuff", "rank2", [A("void", 2, attr="stable")]),
             "burns": I("The Burns", "attack", "rank3", [D(8), A("lightning", 2, attr="stable")]),
             "veil": I("The Veil Slips", "debuff", "back", [A("void", 1, attr="stable"), STRESS(10)]),
             "hand": I("An Open Hand Falls", "attack", "front", [D(14)]),
             "flare": I("The Burns Flare", "attack", "all_heroes", DIS(1)),
             "shatter": I("Shattered", "attack", "all_heroes", [D(4)] + DIS(1)),
         },
         ai=[{"use": "seep", "every": 4}, {"use": "burns", "every": 4, "offset": 1}, {"use": "veil", "every": 4, "offset": 2},
             {"use": "hand"}],
         phases=[
             P(60, "The cracks open. Void leaks out of her, and the burns begin to flare.", might=1,
               ai=[{"use": "flare", "every": 2}, {"use": "seep", "every": 4, "offset": 1}, {"use": "burns"}]),
             P(25, "Shattered. The pieces fly apart, and the Tooth hangs bare where her heart was.", might=1,
               fx=[SELF("vulnerable", 3)], ai=[{"use": "shatter"}]),
         ],
         traits=[T("round_start", "Through the Cracks", "Round start: void leaks from a crack, and a Rift Hound comes through into an empty rank (3 a fight).",
                   [SUMMON("rift_hound", max=3)])],
         lore="She held all six courses in one body, and the world was whole. The void betrayed her, and now it is all that runs out of her.",
         world=W)

creature("wheel_of_thrones", "The Wheel of Thrones", "ruler", 290, armor=4, span=2, ranks=[1, 2], role="attacker",
         charge_name="Spin", resist=HEAVEN,
         intents={
             "grind": I("The Rim Grinds", "attack", "heaviest", [D(13)]),
             "eyes": I("The Eyes Roll Past", "debuff", "front2", [A("lightning", 2, attr="stable")]),
             "spin": I("Spinning Up", "charge", "self", [B(12), SELF("charge", 1)]),
             "hub": I("The Hub Eye Opens", "attack", "all_heroes", [D(4), CLR("charge")] + DIS(1)),
             "tyre": I("Sprung Tyre", "attack", "rank2", [D(10)]),
             "crush": I("The Weight Is Found", "attack", "heaviest", [D(18)]),
         },
         ai=[{"use": "eyes", "every": 2}, {"use": "grind"}],
         phases=[
             P(50, "It spins up. The hub eye stirs.", might=1,
               ai=[{"use": "hub", "if": "charge>=1"}, {"use": "spin", "every": 3}, {"use": "tyre"}]),
             P(20, "It has found the weight.", might=1,
               ai=[{"use": "hub", "if": "charge>=1"}, {"use": "spin", "every": 2}, {"use": "crush"}]),
         ],
         traits=[T("hit", "Turning Rims", "A hero who strikes it gains 1 Static, every hit.", [A("lightning", 1, attr="stable")])],
         lore="It carried the god's seat. It is still turning, looking for the weight.",
         world=W)

creature("fourfold_beast", "The Fourfold Beast", "ruler", 290, armor=3, span=2, ranks=[1, 2], role="attacker",
         resist=HEAVEN,
         intents={
             "roar": I("The Lion Roars", "attack", "front", [D(14)]),
             "man": I("Where the Man Was", "attack", "rank2", DIS(2)),
             "ox": I("Where the Ox Was", "attack", "rank3", DIS(2)),
             "eagle": I("Where the Eagle Was", "attack", "back", DIS(2)),
             "voids": I("Three Voids", "attack", "all_heroes", DIS(1)),
             "wings": I("Wings Full of Eyes", "attack", "all_heroes", [D(5), STRESS(5)]),
         },
         ai=[{"use": "roar", "every": 4, "offset": 3}, {"use": "man", "every": 4, "offset": 2},
             {"use": "ox", "every": 4, "offset": 1}, {"use": "eagle"}],
         phases=[
             P(50, "Only the lion. It stops turning.", might=1,
               ai=[{"use": "voids", "every": 2}, {"use": "roar"}]),
             P(20, "The wings open, and every eye in them turns to the company.", might=1,
               ai=[{"use": "voids", "every": 2}, {"use": "wings", "every": 3}, {"use": "roar"}]),
         ],
         traits=[T("hit", "It Watches", "A hero who strikes it gains 3 stress.", [STRESS(3)])],
         lore="It had a face for each wind, to watch the throne from every side. The void took three of them.",
         world=W)

# ================================================================== elites
creature("thunder_seraph", "Thunder Seraph", "elite", 120, armor=3, ranks=[1, 2], role="defender", resist=HEAVEN,
         intents={
             "hymn": I("Hold the Sky", "buff", "all_allies", [ST("might", 1), B(6)]),
             "spear": I("Strike Down the Spear", "attack", "back", [D(10), A("lightning", 2, attr="stable")]),
             "judgement": I("Judgement", "attack", "front", [D(6)] + DIS(1)),
             "wings": I("Broken Wings", "attack", "front2", [D(6)]),
         },
         ai=[{"use": "hymn", "every": 4, "offset": 3}, {"use": "judgement", "every": 3}, {"use": "spear", "every": 2},
             {"use": "wings"}],
         traits=[T("round_start", "Losing the Tear", "Round start: below half HP it is losing the tear; a Rift Hound comes through into an empty rank (2 a fight).",
                   [SUMMON("rift_hound", max=2, if_="hp_pct<50")])],
         lore="It holds the sky together with its spear. It is losing.",
         world=W)

creature("rift_leviathan", "Rift Leviathan", "elite", 115, armor=2, span=2, ranks=[3, 4], role="attacker", resist=RIFT,
         intents={
             "lunge": I("Lunge Through the Tear", "attack", "front", [D(16)]),
             "tear": I("Tear the Sky", "attack", "all_heroes", [D(4), A("void", 2, attr="stable")]),
             "teeth": I("Gold Teeth", "attack", "rank2", [D(9), A("void", 1, attr="stable")]),
             "coil": I("Coil Away", "defend", "self", [B(12), SELF("dodge", 1)]),
         },
         ai=[{"use": "coil", "if": "hp_pct<50", "not_twice": True}, {"use": "tear", "every": 3},
             {"use": "teeth", "every": 3, "offset": 1}, {"use": "lunge"}],
         traits=[T("round_start", "Between the Stars", "Round start: it slips through the tear and surfaces again; the first hit each round misses it.",
                   [SELF("dodge", 1)])],
         lore="It swims in the space between the stars.",
         world=W)

creature("recording_angel", "The Recording Angel", "elite", 95, armor=2, ranks=[3], role="afflicter", resist=HEAVEN,
         intents={
             "strike": I("Strike the Name", "attack", "weakest",
                         [ST("blight", 2)] + DIS(1)),
             "quill": I("The Quill", "attack", "front", [D(10)]),
             "ink": I("Black Ink", "debuff", "all_heroes", [A("void", 1, attr="stable")]),
             "close": I("Close the Book", "defend", "self", [B(12)]),
         },
         ai=[{"use": "close", "if": "hp_pct<50", "not_twice": True}, {"use": "strike", "every": 2},
             {"use": "ink", "every": 3, "offset": 1}, {"use": "quill"}],
         traits=[T("death", "The Names Restored", "On death: the struck names are restored; every hero's heal-block (Blight) ends.",
                   [CLR("blight", to="all_enemies")])],
         lore="It wrote down every soul. It has started crossing them out.",
         world=W)

creature("weigher_of_souls", "The Weigher of Souls", "elite", 115, armor=3, ranks=[2, 3], role="attacker", resist=HEAVEN,
         intents={
             "weigh": I("Weigh the Soul", "attack", "healthiest", DIS(2)),
             "pans": I("The Pans Swing", "attack", "front2", [D(7)]),
             "ash": I("Ash of Souls", "debuff", "all_heroes", [A("void", 1, attr="stable"), STRESS(4)]),
             "balance": I("Even the Scales", "heal", "all_allies", [H(6)]),
         },
         ai=[{"use": "balance", "if": "ally_hurt75", "not_twice": True}, {"use": "weigh", "every": 2},
             {"use": "ash", "every": 3, "offset": 1}, {"use": "pans"}],
         traits=[T("round_start", "The Needle", "Round start: the needle swings over the two front heroes; each gains 1 Static.",
                   [A("lightning", 1, attr="stable", to="front2")])],
         lore="It weighed every soul against a feather. It has lost the feather.",
         world=W)

# ================================================================== foes
creature("fallen_angel", "Fallen Angel", "foe", 40, armor=1, ranks=[1], role="attacker", resist=HEAVEN,
         intents={
             "sword": I("Desperate Strike", "attack", "front", [D(10)]),
             "smite": I("Smite", "attack", "back", [D(5), A("lightning", 2, attr="stable")]),
             "guard": I("Broken Guard", "defend", "self", [B(8)]),
         },
         ai=[{"use": "guard", "if": "hp_pct<50", "not_twice": True}, {"use": "smite", "every": 3}, {"use": "sword"}],
         traits=[T("death", "It Has Not Stopped Fighting", "On death: it strikes the hero who felled it once more for 7.",
                   [D(7, to="killer")])],
         lore="It fell when the void tore the sky, and it has not stopped fighting.",
         world=W)

creature("storm_shade", "Storm Shade", "foe", 30, ranks=[3, 4], role="afflicter",
         resist={"lightning": "immune", "physical": "resist", "water": "weak"},
         intents={
             "shroud": I("Static Shroud", "debuff", "all_heroes", [A("lightning", 1, attr="stable")]),
             "arc": I("Arc", "attack", "back", [D(3), A("lightning", 1, attr="volatile")]),
             "fork": I("Forked Strike", "attack", "front2", [D(4)]),
         },
         ai=[{"use": "shroud", "every": 2}, {"use": "arc", "every": 3, "offset": 1}, {"use": "fork"}],
         traits=[T("death", "The Last Strike", "On death: its last strike discharges into the front hero (1 Volatile Static).",
                   [A("lightning", 1, attr="volatile", to="front_enemy")])],
         lore="Lightning that forgot to stop.",
         world=W)

creature("choir_of_eyes", "Choir of Eyes", "foe", 32, ranks=[3, 4], role="afflicter",
         resist={"void": "resist", "physical": "weak"},
         intents={
             "hymn": I("The Last Hymn", "debuff", "all_heroes", [STRESS(6)]),
             "weep": I("Weep", "debuff", "back", [A("void", 2, attr="stable")]),
             "blink": I("Blink Shut", "defend", "self", [SELF("dodge", 1)]),
         },
         ai=[{"use": "blink", "if": "hp_pct<50", "not_twice": True}, {"use": "weep", "every": 2}, {"use": "hymn"}],
         lore="The eyes of the dead god, singing its last hymn.",
         world=W)

creature("skywreck_knight", "Skywreck Knight", "foe", 50, armor=2, ranks=[1], role="defender",
         resist={"lightning": "resist", "physical": "resist", "void": "weak"},
         intents={
             "aegis": I("Aegis", "defend", "all_allies", [B(6)]),
             "lance": I("Lance Charge", "attack", "front", [D(7), ST("stun", 1)]),
             "bash": I("Fused Shell", "attack", "front", [D(10)]),
         },
         ai=[{"use": "aegis", "if": "ally_hurt", "not_twice": True}, {"use": "lance", "every": 4, "offset": 2}, {"use": "bash"}],
         lore="A knight of the heavenly host, his armour fused in the fall.",
         world=W)

creature("porter_of_heaven", "Porter of Heaven", "foe", 46, armor=2, ranks=[1], role="defender", resist=HEAVEN,
         intents={
             "key": I("Swing the Key", "attack", "front", [D(8), ST("stun", 1)]),
             "grille": I("The Gate Grille", "defend", "self", [B(6), GUARD(to="behind")]),
             "ring": I("Ring of Keys", "attack", "front2", [D(5)]),
         },
         ai=[{"use": "grille", "if": "ally_hurt", "not_twice": True}, {"use": "key", "every": 3}, {"use": "ring"}],
         lore="It kept the gate. The gate is gone. It still has the key.",
         world=W)

creature("herald_of_heaven", "Herald of Heaven", "foe", 34, ranks=[2, 3], role="afflicter", resist=HEAVEN,
         intents={
             "sound": I("Sound the End", "attack", "front2", [STRESS(5)] + DIS(1)),
             "note": I("The Long Note", "debuff", "all_heroes", [STRESS(5)]),
             "proclaim": I("Proclamation", "debuff", "all_heroes", [A("void", 1, attr="stable")]),
         },
         ai=[{"use": "sound", "every": 2}, {"use": "note", "every": 3, "offset": 1}, {"use": "proclaim"}],
         lore="It was sent to sound the end of the world. It is still sounding it. This is how long that takes.",
         world=W)

creature("putto", "Putto", "foe", 28, ranks=[3, 4], role="attacker", resist=HEAVEN,
         intents={
             "arrow": I("Loosed Arrow", "attack", "back", [D(3)] + DIS(1)),
             "bow": I("Little Bow", "attack", "random", [D(7)]),
             "bob": I("Bob Away", "defend", "self", [SELF("dodge", 1)]),
         },
         ai=[{"use": "bob", "if": "hp_pct<50", "not_twice": True}, {"use": "arrow", "every": 2}, {"use": "bow"}],
         lore="Heaven kept them for decoration. They have found other work.",
         world=W)

creature("scorched_doves", "Scorched Doves", "foe", 32, ranks=[3, 4], role="afflicter", flags=["swarm"], resist=HEAVEN,
         intents={
             "dive": I("The Flock Dives", "attack", "random", [D(2, times=2)] + DIS(1)),
             "messages": I("Bad Messages", "debuff", "all_heroes", [STRESS(5)]),
         },
         ai=[{"use": "messages", "every": 2}, {"use": "dive"}],
         lore="The doves of heaven carried its messages. The messages are bad now.",
         world=W)

creature("throne_lion", "Throne Lion", "foe", 46, armor=2, ranks=[1], role="attacker", resist=HEAVEN,
         intents={
             "pounce": I("Pounce", "attack", "front", [D(12)]),
             "settle": I("The Haunches Resettle", "defend", "self", [B(9)]),
         },
         ai=[{"use": "settle", "every": 3}, {"use": "pounce"}],
         lore="Twelve lions stood on the steps of the throne. The steps fell. The lions did not.",
         world=W)

creature("rift_crawler", "Rift Crawler", "foe", 42, armor=1, ranks=[1, 2], role="attacker", resist=RIFT,
         intents={
             "lunge": I("Rearing Lunge", "attack", "front", [D(9)]),
             "bite": I("Eat the Floor", "attack", "front", [D(5), STEAL()]),
             "feed": I("Gnaw", "heal", "self", [H(8)]),
         },
         ai=[{"use": "feed", "if": "hp_pct<50", "not_twice": True}, {"use": "bite", "every": 2}, {"use": "lunge"}],
         lore="It came in through a tear and has been eating the floor of heaven ever since. Heaven is mostly floor.",
         world=W)

creature("star_lighter", "Star-Lighter", "foe", 34, ranks=[2, 3], role="support", resist=HEAVEN,
         intents={
             "relight": I("Relight a Star", "buff", "ally_front", [ST("might", 1), B(8)]),
             "swing": I("The Dead Star", "attack", "random", [D(4)] + DIS(1)),
             "trim": I("Trim the Wick", "defend", "all_allies", [B(4)]),
             "tinder": I("Tinderbox", "attack", "front", [D(6), A("lightning", 1, attr="stable")]),
         },
         ai=[{"use": "trim", "if": "ally_hurt", "not_twice": True}, {"use": "relight", "every": 3},
             {"use": "swing", "every": 2}, {"use": "tinder"}],
         lore="It lit the stars every evening. Most of them have gone out. It is doing its best.",
         world=W)

# ================================================================== encounters
E = lambda *a, **k: encounter(W, *a, **k)
E("sky_f1", "The Floating Steps", "Angels guard what is left of the stair.", ["fallen_angel", "fallen_angel", "storm_shade"],
  "sky_ruins", "foe", "Kill the shade before its arc; each angel strikes once more as it falls.")
E("sky_f2", "The Tear", "Hounds come through the rift.", ["rift_hound", "rift_hound", "choir_of_eyes"],
  "sky_gate", "foe", "Void-immune hounds; lightning or physical, then the choir.")
E("sky_f3", "The Broken Choir", "The eyes are singing, and the trumpet answers.", ["skywreck_knight", "herald_of_heaven", "choir_of_eyes"],
  "sky_choir", "foe", "A guarded stress pair.")
E("sky_f4", "The Throne Steps", "Two lions, and something small with a bow.", ["throne_lion", "throne_lion", "putto"],
  "sky_throne", "foe", "Two heavy pounces up front, true damage from the back.")
E("sky_f5", "The Gate", "The gate is gone. The porter is not.", ["porter_of_heaven", "rift_crawler", "scorched_doves"],
  "sky_gate", "foe", "Locked out, Block eaten, then the flock discharges.")
E("sky_f6", "The Ceiling of Heaven", "The decorations have found other work.", ["fallen_angel", "star_lighter", "putto", "scorched_doves"],
  "sky_choir", "foe", "Three back-rank threats behind one sword.")
E("sky_f7", "The Last Stand", "A knight, a herald, and lightning that forgot to stop.", ["skywreck_knight", "storm_shade", "herald_of_heaven"],
  "sky_ruins", "foe", "The shade feeds the herald's discharge; Ward the front.")
E("sky_f8", "Things From Outside", "They came in through the tears, all of them.", ["rift_crawler", "rift_hound", "storm_shade"],
  "sky_gate", "foe", "All three resist or ignore one course; switch damage types.")
E("sky_e1", "The Seraph's Watch", "It is holding the sky together.", ["thunder_seraph", "fallen_angel", "choir_of_eyes"],
  "sky_choir", "elite", "Below half it lets the hounds in; burst it through the last half.")
E("sky_e2", "Between the Stars", "Something swims through the tear.", ["rift_leviathan", "rift_hound", "rift_crawler"],
  "sky_gate", "elite", "The first hit each round misses it; open with a small blow, then the big one.")
E("sky_e3", "The Book of Names", "It has started crossing them out.", ["recording_angel", "porter_of_heaven", "putto"],
  "sky_choir", "elite", "Healing is struck out; kill the Angel to restore it.")
E("sky_e4", "The Scales", "It has lost the feather.", ["weigher_of_souls", "skywreck_knight", "scorched_doves"],
  "sky_gate", "elite", "Keep HP even across the company and Ward the front; the needle points at the healthiest.")
E("sky_r_shattered_god", "The Shattered God", "The last Tooth floats where the Mother's heart was.",
  ["skywreck_knight", "rift_hound", "shattered_god"], "sky_boss", "ruler",
  "Rank 2 refills with hounds; keep the two courses apart.")
E("sky_r_wheel_of_thrones", "The Wheel of Thrones", "It is still turning, and it has found the Tooth.",
  ["wheel_of_thrones", "throne_lion", "putto"], "sky_boss", "ruler",
  "Every blow on the rims costs Static; spread Block and plan fewer, harder hits.", props="wheel_of_thrones")
E("sky_r_fourfold_beast", "The Fourfold Beast", "It watched the throne from every side. Now it watches the Tooth.",
  ["fourfold_beast", "herald_of_heaven", "putto"], "sky_boss", "ruler",
  "Read the face order; Ward before the void faces.", props="fourfold_beast")

# ================================================================== world cards (Discharge: glue, each reads or converts state)
card("w_sky_struck_out", "Struck Out", 2, "W", "enemy", [CONS(e="void"), D(0, per="consumed", k=3, pierce=True)],
     "Remove all Void from the foe. Deal 3 per Void removed, ignoring Block.", cat="void", world=W, arch="world",
     flavour="It wrote down every soul. It has started crossing them out.",
     note="A hero draws the Recording Angel's quill through a foe; the void in it burns out along the stroke.",
     up={"text": "Remove all Void from the foe. Deal 4 per Void removed, ignoring Block.",
         "fx": [CONS(e="void"), D(0, per="consumed", k=4, pierce=True)]})
card("w_sky_gold_leaf", "Gold Leaf", 1, "W", "ally", [WARD(2, per="t.spectrum", k=1)],
     "A hero gains 2 Ward, plus 1 per different course on them.", world=W, arch="world",
     flavour="Gold leaf cracked over black. It still holds, for a while.",
     note="A hero presses a flake of heaven's gold over a companion's crackling burns.",
     up={"text": "A hero gains 3 Ward, plus 2 per different course on them.", "fx": [WARD(3, per="t.spectrum", k=2)]})
card("w_sky_through_the_tear", "Through the Tear", 1, "W", "enemy",
     [A("void", 1, per="heroes_before", k=1, max=4), REACT(1)],
     "Apply 1 Void, plus 1 per other hero who has acted before this card this round (max 4), then Conjoin.",
     cat="void", attr="stable", world=W, arch="world",
     flavour="Something leans in through the tear. Show it where to look.",
     note="A hero pulls a foe through a rent in the sky; violet burns branch across it as it passes.",
     up={"text": "Deal 3. Apply 1 Void, plus 1 per other hero who has acted before this card this round (max 4), then "
                 "Conjoin.", "fx": [D(3), A("void", 1, per="heroes_before", k=1, max=4), REACT(1)]})
card("w_sky_something_leans_closer", "Something Leans Closer", 1, "W", "none", [],
     "Rite. Up to 3 times a round, when the company sets off a Conjunction, deal 1 to that foe, plus 1 per Conjunction set off this round (this one included), ignoring Block. Exhaust.",
     kw=["Rite", "Exhaust"], world=W, arch="world",
     rite={"on": "conjunction", "fx": [D(1, per="reactions", k=1, pierce=True)], "per_round": 3},
     flavour="The tears in the sky widen, and something leans closer. It likes what it sees.",
     note="The company under a widening tear; an eye the size of a cathedral window looks down on the foes.",
     up={"text": "Rite. Up to 3 times a round, when the company sets off a Conjunction, deal 2 to that foe, plus 1 per Conjunction set off this round (this one included), ignoring Block. Exhaust.",
         "rite": {"on": "conjunction", "fx": [D(2, per="reactions", k=1, pierce=True)], "per_round": 3}})

NEEDS = [
    "rift_leviathan: should surface at a new pair of ranks each round, swapping with the foes there (self-movement for a two-rank foe); written as a Dodge each round. Swallow is postponed (row 14): written as a heavy lunge.",
    "shattered_god: her weakness is open in the role map (toxin has no lore ground); she has none, and her phase 3 Vulnerable stands in for the exposed Tooth.",
]
