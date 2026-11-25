"""World III: The Boiling Baths (Fire + Water, Scald). Role map: docs/design/gate2/world_III_boiling_baths.md.

Fights are a three-beat combo the company can read on the intents: one foe wets a hero, a second lands Burn (Volatile,
so the Scald happens at once), a heavy hitter strikes the now-Vulnerable hero. Ward, kill order, Guard and Swap each
break a beat. Creatures of heat are weak to frost, and Weaken also cuts their hits."""
from dsl import *
from creatures import *
import dsl
WARD = dsl.W  # the world key below shadows the Ward helper
W = "baths"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])
HOT = {"fire": "resist", "water": "resist", "frost": "weak"}
GW = {"t": "guard_weakest"}

# ================================================================== foes
creature(
    "scalded_attendant", "Scalded Attendant", "foe", 36, ranks=[1, 2], resist=HOT,
    intents={
        "towel": I("Wet Towel", "attack", "front", [D(5), A("water", 2, attr="stable")]),
        "hook": I("Towel Hook", "attack", "back", [D(4), PULL(1), A("water", 1, attr="stable")]),
        "scrub": I("Scrub", "attack", "front", [D(8)]),
    },
    ai=[{"use": "towel", "every": 3}, {"use": "hook", "every": 3, "offset": 1}, {"use": "scrub"}],
    lore="It still brings towels. Its skin comes away on them.", world=W)

creature(
    "kettle_crab", "Kettle Crab", "foe", 38, armor=2, ranks=[1],
    resist={"physical": "resist", "fire": "resist", "frost": "weak"}, role="defender",
    intents={
        "pinch": I("Boiled Pinch", "attack", "front", [D(8)]),
        "vent": I("Vent Steam", "debuff", "all_heroes", [A("fire", 1, attr="volatile")]),
        "shell": I("Hard Shell", "defend", "self", [B(10)]),
    },
    ai=[{"use": "shell", "if": "hp_pct<50", "not_twice": True}, {"use": "vent", "every": 3}, {"use": "pinch"}],
    traits=[T("hit", "Steam Spout", "Every hit cracks the shell and it vents: the hero who hit it gains 1 Burn (up to 5 times a round).",
              [A("fire", 1, attr="stable")])],
    lore="Cooked alive in the pools and somehow still walking.", world=W)

creature(
    "boiled_brute", "Boiled Brute", "foe", 50, ranks=[1], resist={"water": "resist", "physical": "weak"},
    intents={
        "club": I("Marble Club", "attack", "front", [D(12)]),
        "dunk": I("Dunk", "attack", "front", [D(5), A("water", 3, attr="stable"), STRESS(6)]),
    },
    ai=[{"use": "dunk", "every": 3}, {"use": "club"}],
    lore="A bath guard who stayed in the water too long. He is very soft now, and very strong.", world=W)

creature(
    "steam_nymph", "Steam Nymph", "foe", 30, ranks=[3, 4], resist={"fire": "immune", "water": "immune", "frost": "weak"},
    role="support",
    intents={
        "veil": I("Veil of Steam", "buff", "all_allies", [ST("dodge", 1)]),
        "sigh": I("Sigh", "debuff", "all_heroes", [STRESS(4)]),
        "breath": I("Scalding Breath", "attack", "back", [D(5), A("fire", 2, attr="stable")]),
        "drift": I("Drift", "defend", "self", [SELF("dodge", 2)]),
    },
    ai=[{"use": "drift", "if": "hp_pct<40", "not_twice": True}, {"use": "veil", "every": 3},
        {"use": "sigh", "every": 3, "offset": 1}, {"use": "breath"}],
    lore="It drifts over the pools and sings to the drowned.", world=W)

creature(
    "bath_leech", "Bath Leech", "foe", 32, ranks=[1, 2], resist=HOT,
    intents={
        "latch": I("Latch", "attack", "front", [D(4, lifesteal=100), ST("bleed", 2)]),
        "drain": I("Drain", "attack", "random", [D(3, times=2, lifesteal=100)]),
        "swell": I("Swell", "defend", "self", [B(6), H(4)]),
    },
    ai=[{"use": "swell", "if": "hp_pct<40", "not_twice": True}, {"use": "drain", "every": 2}, {"use": "latch"}],
    lore="Grown fat on the bathers.", world=W)

creature(
    "hypocaust_stoker", "Hypocaust Stoker", "foe", 38, ranks=[2], resist={"fire": "resist", "frost": "weak"},
    intents={
        "hook": I("Fire-Hook", "attack", "back", [D(5), PULL(2), A("fire", 1, attr="stable")]),
        "rake": I("Rake", "attack", "front", [D(7), A("fire", 1, attr="stable")]),
        "bank": I("Bank the Fire", "buff", "all_allies", [ST("might", 1)]),
    },
    ai=[{"use": "hook", "every": 3}, {"use": "bank", "every": 4, "offset": 2}, {"use": "rake"}],
    lore="He kept the fires under the floors. He has not come up for air in a hundred years.", world=W)

creature(
    "votive_pilgrim", "Votive Pilgrim", "foe", 34, ranks=[2, 3], resist=HOT, role="support",
    intents={
        "crutch": I("Crutch Swing", "attack", "front", [D(7)]),
        "splash": I("Temple Water", "heal", "ally_lowest", [H(10)]),
        "bless": I("Votive Blessing", "heal", "all_allies", [H(4)]),
        "hop": I("Hop Aside", "defend", "self", [B(4), SELF("dodge", 1)]),
    },
    ai=[{"use": "splash", "if": "ally_hurt75", "not_twice": True}, {"use": "bless", "if": "ally_hurt", "every": 3},
        {"use": "hop", "if": "hp_pct<40", "not_twice": True}, {"use": "crutch"}],
    lore="She hung a clay leg at the spring and asked to walk again. She is walking.", world=W)

creature(
    "physic_of_the_waters", "Physic of the Waters", "foe", 32, ranks=[3, 4], resist=HOT, role="support",
    intents={
        "flask": I("Boiling Flask", "attack", "random", [D(4), A("fire", 1, attr="volatile")]),
        "examine": I("Examine", "debuff", "front", [ST("mark", 1), A("water", 1, attr="stable")]),
        "prescribe": I("Prescribe a Soak", "buff", "ally_lowest", [ST("regen", 4)]),
        "sip": I("Take the Waters", "heal", "self", [H(6)]),
    },
    ai=[{"use": "prescribe", "if": "ally_hurt", "every": 3}, {"use": "sip", "if": "hp_pct<50", "not_twice": True},
        {"use": "examine", "every": 3, "offset": 1}, {"use": "flask"}],
    lore="He prescribed the waters for every complaint. He takes them himself now, hourly.", world=W)

creature(
    "lustral_priest", "Lustral Priest", "foe", 36, ranks=[2, 3], resist={"fire": "resist", "water": "resist", "void": "weak"},
    role="afflicter",
    intents={
        "sprinkle": I("Boiling Sprinkle", "attack", "front2", [D(2), A("water", 1, attr="stable"), A("fire", 1, attr="volatile")]),
        "rod": I("Aspergillum", "attack", "front", [D(7)]),
        "bless": I("Bless the Bathers", "defend", "all_allies", [B(4)]),
    },
    ai=[{"use": "sprinkle", "every": 3}, {"use": "bless", "every": 3, "offset": 1}, {"use": "rod"}],
    lore="He blesses every bather with the holy water. It is still holy, and it is boiling.", world=W)

creature(
    "lapdog", "Lapdog", "foe", 28, ranks=[1], resist=HOT,
    intents={
        "bite": I("Ankle Bite", "attack", "front", [D(6), ST("bleed", 1)]),
        "bark": I("Barking Fit", "debuff", "front", [STRESS(7)]),
        "guard": I("Her Dog", "defend", "self", [B(6), GW]),
    },
    ai=[{"use": "guard", "if": "ally_hurt", "not_twice": True}, {"use": "bark", "every": 3}, {"use": "bite"}],
    lore="It came in with a countess. It bites everyone but her.", world=W)

creature(
    "hypocaust_roaches", "Hypocaust Roaches", "foe", 28, ranks=[1, 2], resist=HOT, flags=["swarm"],
    intents={
        "flood": I("Up the Legs", "attack", "front", [D(2, times=3), A("fire", 1, attr="stable")]),
        "scatter": I("Scatter", "attack", "random", [D(3, times=2)]),
    },
    ai=[{"use": "scatter", "every": 3}, {"use": "flood"}],
    lore="They lived in the warm under the floors. It is very warm now.", world=W)

creature(
    "pump_mule", "Pump Mule", "foe", 48, armor=1, ranks=[1], resist={"water": "resist", "frost": "weak"},
    flags=["unstunnable"], personality="mindless",
    intents={
        "kick": I("Double Kick", "attack", "front", [D(12)]),
        "beam": I("Sweep-Beam", "attack", "front2", [D(6)]),
    },
    ai=[{"use": "beam", "every": 2}, {"use": "kick"}],
    lore="It turned the wheel that lifted the water. Nobody told it to stop.", world=W)

# ================================================================== elites
creature(
    "bath_mistress", "The Bath-Mistress", "elite", 100, armor=2, ranks=[2, 3], resist=HOT, role="support",
    intents={
        "ladle": I("Ladleful", "attack", "most_burn", [D(4), A("water", 1, attr="stable"), A("fire", 1, attr="volatile")]),
        "scold": I("Scold", "debuff", "most_stress", [STRESS(6), ST("mark", 1)]),
        "attend": I("Attend", "heal", "ally_lowest", [H(14)]),
        "scrub": I("Scrubbing Brush", "attack", "front", [D(8), STEAL()]),
    },
    ai=[{"use": "attend", "if": "ally_hurt75", "not_twice": True}, {"use": "ladle", "every": 2},
        {"use": "scold", "every": 4, "offset": 1}, {"use": "scrub"}],
    traits=[T("round_start", "Keeps the Water Hot", "Round start: every hero gains 1 Soak, so their Soak never dries.",
              [A("water", 1, attr="stable", to="all_enemies")])],
    lore="She keeps the water hot and the guests clean.", world=W)

creature(
    "cauldron_bearer", "Cauldron Bearer", "elite", 120, armor=3, ranks=[1], resist=HOT, charge_name="Empty",
    intents={
        "pour": I("Empty a Cauldron", "attack", "front2",
                  [D(4), A("water", 1, attr="stable"), A("fire", 2, attr="volatile"), SELF("charge", 1)]),
        "yoke": I("Yoke Swing", "attack", "front", [D(12)]),
        "refill": I("Back to the Furnace", "defend", "self", [B(12), CLR("charge")]),
        "barge": I("Shoulder Barge", "attack", "front", [D(7), PUSH(1)]),
    },
    ai=[{"use": "refill", "if": "charge>=2"}, {"use": "pour", "every": 2}, {"use": "barge", "every": 5},
        {"use": "yoke"}],
    traits=[T("hit", "Slopping Over", "Every hit on it slops water: the hero who hit it gains 1 Soak (up to 5 times a round).",
              [A("water", 1, attr="stable")])],
    lore="It carries the boiling water from the furnace to the pools. It carries other things, too.", world=W)

creature(
    "strigil_master", "The Strigil-Master", "elite", 110, armor=3, ranks=[1], resist=HOT,
    intents={
        "scrape": I("Long Scrape", "attack", "heaviest", [D(6), STEAL(), LOSE_ARMOR(1)]),
        "hands": I("Boiled Hands", "attack", "front", [D(13)]),
        "rake": I("Raking Scrape", "attack", "front2", [D(6), STEAL()]),
        "oil": I("Oil Down", "defend", "self", [B(8), SELF("dodge", 1)]),
    },
    ai=[{"use": "oil", "if": "hp_pct<50", "not_twice": True}, {"use": "scrape", "every": 3},
        {"use": "rake", "every": 3, "offset": 1}, {"use": "hands"}],
    traits=[T("round_start", "Oil and Sweat", "Round start: oil runs off him and takes 2 course stacks with it.",
              [CLEANSE(2)])],
    lore="He scraped the nobility clean with a bronze blade. He has not stopped at the dirt.", world=W)

creature(
    "invalid_countess", "The Invalid Countess", "elite", 120, armor=2, span=2, ranks=[1, 2], resist=HOT,
    role="support", flags=["immovable"], charge_name="Dogs Called",
    intents={
        "ram": I("Ram the Pole", "attack", "front", [D(11), PUSH(1)]),
        "bottle": I("Bottle of Boiling Water", "attack", "random", [D(3), A("water", 1, attr="stable"), A("fire", 1, attr="volatile")]),
        "bell": I("Ring for the Dog", "summon", "self", [SUMMON("lapdog", max=2), SELF("charge", 1)]),
        "dose": I("Medicine", "heal", "self", [H(12)]),
    },
    ai=[{"use": "bell", "if": "allies<3&charge<2", "not_twice": True}, {"use": "dose", "if": "hp_pct<50", "every": 3},
        {"use": "bottle", "every": 2}, {"use": "ram"}],
    traits=[T("round_start", "Never Put Down", "Round start: the front bearer braces under the pole: gains 6 Block.",
              [B(6)])],
    lore="She was carried here to be cured. Her bearers were told not to put her down.", world=W)

# ================================================================== rulers
creature(
    "simmering_matron", "The Simmering Matron", "ruler", 300, armor=2, span=2, ranks=[3, 4], resist=HOT,
    role="afflicter", flags=["immovable"], charge_name="Heat",
    intents={
        "wave": I("Scalding Wave", "attack", "all_heroes", [D(4), A("water", 1, attr="stable")]),
        "hand": I("Hand of the Pool", "attack", "front", [D(16)]),
        "boil": I("Boil Over", "attack", "all_heroes", [A("water", 2, attr="stable"), A("fire", 2, attr="volatile"), CLR("charge")]),
        "taste": I("Taste the Broth", "heal", "self", [H(25)]),
        "sweep": I("Sweep the Rim", "attack", "front2", [D(8), A("fire", 1, attr="stable")]),
        "seethe": I("Seethe", "attack", "all_heroes", [D(3), A("water", 1, attr="stable"), A("fire", 1, attr="volatile")]),
    },
    ai=[{"use": "boil", "if": "charge>=4"}, {"use": "taste", "if": "hp_pct<75", "every": 4, "not_twice": True},
        {"use": "wave", "every": 2}, {"use": "hand"}],
    traits=[T("round_start", "Simmering", "Round start: the pool heats by 1. At 4 it boils over.", [SELF("charge", 1)]),
            T("round_start", "Sloughing", "Below 55% HP: at round start her skin sloughs off with every course stack on her.",
              [CLEANSE(20, if_="hp_pct<55")])],
    phases=[
        P(55, "She rises from the pool, skin sloughing in sheets.", might=1,
          ai=[{"use": "boil", "if": "charge>=4"}, {"use": "taste", "if": "hp_pct<40", "not_twice": True, "every": 4},
              {"use": "sweep", "every": 2}, {"use": "hand"}]),
        P(20, "She boils over.", ai=[{"use": "seethe"}]),
    ],
    lore="The matron of the baths. She has been simmering for a hundred years and is nearly ready.", world=W)

creature(
    "best_families", "The Best Families", "ruler", 270, armor=2, span=2, ranks=[3, 4], resist=HOT, role="summoner",
    charge_name="Bathers Out",
    intents={
        "arms": I("A Dozen Arms", "attack", "back", [D(6), PULL(2), ST("anchor", 1), A("water", 1, attr="stable")]),
        "surge": I("The Heap Surges", "attack", "front2", [D(8)]),
        "complain": I("Complaint", "debuff", "most_played", [STRESS(9)]),
        "fall": I("A Bather Falls Out", "summon", "self", [SUMMON("scalded_attendant", max=3), SELF("charge", 1)]),
        "steam": I("Steam of the Seventh Pool", "attack", "all_heroes", [A("water", 2, attr="stable"), A("fire", 1, attr="volatile")]),
        "settle": I("Settle", "defend", "self", [B(16)]),
    },
    ai=[{"use": "arms", "every": 3}, {"use": "steam", "every": 3, "offset": 1}, {"use": "complain", "every": 4, "offset": 2},
        {"use": "surge"}],
    traits=[T("hit", "Complaint", "Every hero who hits the heap is complained at: 2 stress per hit (up to 5 times a round).", [STRESS(2)])],
    phases=[
        P(50, "The heap parts. Bathers fall out of it.",
          ai=[{"use": "fall", "if": "allies<3&charge<3", "every": 2}, {"use": "steam", "every": 3}, {"use": "arms", "every": 3, "offset": 1},
              {"use": "surge"}]),
        P(20, "The patriarch rises on the heap, shouting.", might=1,
          ai=[{"use": "fall", "if": "allies<3&charge<3", "every": 2}, {"use": "steam", "every": 2}, {"use": "settle", "every": 4},
              {"use": "surge"}]),
    ],
    lore="The seventh pool was kept for the best families. They have climbed out to complain about the water.", world=W)

creature(
    "great_copper", "The Great Copper", "ruler", 290, armor=4, span=2, ranks=[3, 4],
    resist={"fire": "resist", "water": "resist", "physical": "resist", "frost": "weak"}, role="attacker",
    flags=["immovable"], charge_name="Pressure",
    intents={
        "valve": I("The Valve Lifts", "attack", "all_heroes",
                   [D(5), A("water", 1, attr="stable"), A("fire", 1, attr="volatile"), CLR("charge")]),
        "split": I("The Seams Split", "attack", "all_heroes",
                   [D(5), A("water", 1, attr="stable"), A("fire", 1, attr="volatile"), CLR("charge"), SELF("vulnerable", 1)]),
        "rake": I("Rake the Coals", "attack", "front", [D(10), A("fire", 2, attr="stable")]),
        "shovel": I("Shovel", "attack", "front2", [D(6), A("fire", 1, attr="stable")]),
        "bank": I("Bank the Firebox", "defend", "self", [B(14)]),
        "weep": I("Weeping Seams", "attack", "all_heroes", [D(4), A("water", 1, attr="stable")]),
    },
    ai=[{"use": "valve", "if": "charge>=4"}, {"use": "bank", "if": "frost>0", "not_twice": True},
        {"use": "shovel", "every": 3}, {"use": "rake"}],
    traits=[T("round_start", "Pressure Gauge",
              "Round start: gains 1 Pressure unless it carries Weaken (2 below half HP). The valve lifts at 4.",
              [SELF("charge", 1, if_="!frost"), SELF("charge", 1, if_="hp_pct<50&!frost")])],
    phases=[
        P(50, "The seams split and glow.", might=1,
          ai=[{"use": "split", "if": "charge>=4"}, {"use": "shovel", "every": 3}, {"use": "rake"}]),
        P(20, "It bursts. Hot water weeps from every seam.",
          ai=[{"use": "split", "if": "charge>=2"}, {"use": "weep"}]),
    ],
    lore="The boiler that heats every pool in the temple. Its stokers are still on shift.", world=W)

# ================================================================== encounters
F, E_, R = "foe", "elite", "ruler"
encounter(W, "baths_f1", "The Tepidarium", "Attendants with towels, and the physic who prescribes the rest.",
          ["scalded_attendant", "scalded_attendant", "physic_of_the_waters"], "baths_pool", F,
          "The towels wet, the flask burns: kill the Physic or Ward the wet hero.")
encounter(W, "baths_f2", "The Hot Pools", "A crab in the shallows, a brute in the deep end, a nymph above both.",
          ["kettle_crab", "boiled_brute", "steam_nymph"], "baths_pool", F,
          "Shell in front, the brute dunks behind it, the nymph veils both: frost cuts through all three.")
encounter(W, "baths_f3", "Under the Floors", "Roaches pour from the grate; the stoker hooks from the dark.",
          ["hypocaust_roaches", "hypocaust_stoker", "steam_nymph"], "baths_furnace", F,
          "The hook drags a back hero forward into the roaches.")
encounter(W, "baths_f4", "The Pump Room", "The mule still turns the wheel; leeches in the sludge.",
          ["pump_mule", "bath_leech", "bath_leech"], "baths_cistern", F,
          "The mule ignores control; the leeches heal off you: burst it down.")
encounter(W, "baths_f5", "The Lustral Gate", "A priest at the gate, a pilgrim, and a dog that bites everyone.",
          ["lapdog", "lustral_priest", "votive_pilgrim"], "baths_pool", F,
          "The priest scalds the front two ranks, the pilgrim heals, the dog barks: break the sprinkle with Ward.")
encounter(W, "baths_f6", "The Consulting Room", "Two healers behind a soft wall.",
          ["boiled_brute", "votive_pilgrim", "physic_of_the_waters"], "baths_cistern", F,
          "Physical damage melts the brute, then reach rank 3 before the soaks top everyone up.")
encounter(W, "baths_f7", "The Stoke Hole", "Pull, wet, burn, pinch.",
          ["kettle_crab", "hypocaust_stoker", "lustral_priest"], "baths_furnace", F,
          "The full combo from three bodies; every hit on the crab costs the hitter Burn.")
encounter(W, "baths_f8", "The Drained Cistern", "Four small bodies.",
          ["pump_mule", "hypocaust_roaches", "lapdog", "bath_leech"], "baths_cistern", F,
          "Hits on every foe win; control does not.")
encounter(W, "baths_e1", "The Mistress Receives", "While she lives the company stays wet.",
          ["bath_mistress", "scalded_attendant", "steam_nymph"], "baths_pool", E_,
          "Every hero gains Soak each round, so every Burn is a Scald: kill her or Ward the beats.")
encounter(W, "baths_e2", "The Furnace Stair", "The bearer comes up with both cauldrons full.",
          ["cauldron_bearer", "kettle_crab", "hypocaust_stoker"], "baths_furnace", E_,
          "Two cauldrons, two Scalds on the front ranks, then a round to strike back while it refills.")
encounter(W, "baths_e3", "The Strigil Room", "He strips the guests, and the priest and the physic scald them.",
          ["strigil_master", "lustral_priest", "physic_of_the_waters"], "baths_furnace", E_,
          "He scrapes the most armoured hero's Block and Armor and sheds courses; the priest and the Physic scald the stripped hero.")
encounter(W, "baths_e4", "The Countess Is Carried In", "Her bearers, her dog and her pilgrim.",
          ["invalid_countess", "lapdog", "votive_pilgrim"], "baths_pool", E_,
          "She cannot be moved; the dog guards the wounded and her bell calls more of them.")
encounter(W, "baths_r_simmering_matron", "The Simmering Matron", "The matron in her great pool.",
          ["scalded_attendant", "steam_nymph", "simmering_matron"], "baths_boss", R,
          "Land Conjunctions in one round once she sloughs; read the Heat count and Ward the boil-over.")
encounter(W, "baths_r_best_families", "The Best Families", "The seventh pool has come to complain.",
          ["scalded_attendant", "votive_pilgrim", "best_families"], "baths_boss", R,
          "Spread the damage to share the complaints, then clear the bathers that fall out.", props="best_families")
encounter(W, "baths_r_great_copper", "The Great Copper", "The boiler under every pool, and its shift.",
          ["hypocaust_stoker", "kettle_crab", "great_copper"], "baths_boss", R,
          "A damage race against the gauge; Weaken on the boiler stops the Pressure rising.", props="great_copper")

# ================================================================== world cards (Scald)
card("w_baths_ladle", "Ladle", 1, "W", "enemy",
     [A("fire", 1, attr="volatile"), D(2), D(4, if_="t.vulnerable>0")],
     "Apply 1 Volatile Fire. Deal 2, plus 4 more if the foe is Vulnerable.",
     cat="fire", attr="volatile", world=W, arch="world",
     flavour="One ladleful for the guest. One more for anyone who complains.",
     note="A hero swinging a long copper ladle of boiling water at a Scalded Attendant.",
     up={"text": "Apply 1 Volatile Fire. Deal 3, plus 6 more if the foe is Vulnerable.",
         "fx": [A("fire", 1, attr="volatile"), D(3), D(6, if_="t.vulnerable>0")]})
card("w_baths_cold_plunge", "Cold Plunge", 1, "W", "enemy",
     [D(4), CONV("water", "frost")],
     "Deal 4. Turn the foe's Water into Frost.",
     cat="frost", world=W, arch="world",
     flavour="The frigidarium is the one pool that never heated. Nobody goes in.",
     note="A Boiled Brute shoved into the cold pool, steam bursting off him as the water rimes.",
     up={"text": "Deal 6. Turn the foe's Water into Frost.", "fx": [D(6), CONV("water", "frost")]})
card("w_baths_fresh_towel", "Fresh Towel", 1, "W", "ally",
     [CONS(e="fire"), H(2, per="consumed", k=1)],
     "Remove all Fire from a hero. They heal 2, plus 1 per Fire removed.",
     world=W, arch="world",
     flavour="Take it from the bottom of the pile. The top ones have skin on them.",
     note="A hero pressing a clean linen towel to a scalded arm on the marble bench.",
     up={"text": "Remove all Fire from a hero. They heal 4, plus 1 per Fire removed.",
         "fx": [CONS(e="fire"), H(4, per="consumed", k=1)]})
card("w_baths_open_valve", "Open the Valve", 1, "W", "all_enemies",
     [D(1, per="reactions", k=2)],
     "Deal 1 to every foe, plus 2 per Conjunction set off this round.",
     cat="fire", world=W, arch="world",
     flavour="Every pool in the temple boils from one boiler. Turn its wheel the other way.",
     note="A hero hauling on the bronze stopcock wheel as steam rolls out over the foes.",
     up={"text": "Deal 2 to every foe, plus 3 per Conjunction set off this round.",
         "fx": [D(2, per="reactions", k=3)]})

NEEDS = [
    "best_families Complaint: should stress the hero who dealt the heap the most damage last round; written as 2 "
    "stress per hit on the hitter and a Complaint intent at the busiest hero.",
    "simmering_matron Sloughing: written as a round-start CLEANSE gated on hp_pct<55; CLEANSE on a foe must remove "
    "its course stacks.",
    "bath_mistress Keeps the Water Hot: should stop Soak fading on heroes; written as 1 Soak to every hero each round.",
    "invalid_countess Never Put Down: hits that reach only rank 1 should strike the front bearer and deal less; written "
    "as 6 Block each round plus the immovable flag.",
    "lapdog Her Dog: should Guard the Invalid Countess specifically; written as guarding the weakest foe.",
    "strigil_master Long Scrape: should also strip Ward (no enemy Ward-removal effect).",
]
