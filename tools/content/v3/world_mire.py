"""World II: The Rotmire (Toxin + Water, Toxic Pool). Role map: docs/design/gate2/world_II_rotmire.md.

Toxic Pool poisons a rank, not a body, so fights here are about where the company stands: foes pool the hero ranks and
pin heroes inside them (glaive, clap-net, knotted cord), the Heron spears whoever moves, and almost everything resists
Toxin and Water. Fire is the common weakness (peat, thatch, moss)."""
from dsl import *
from creatures import *
import dsl
WARD = dsl.W  # the world key below shadows the Ward helper
W = "mire"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])
FEN = {"toxin": "resist", "water": "resist"}
FEN_FIRE = {"toxin": "resist", "water": "resist", "fire": "weak"}

# ================================================================== cards foes put in a hand
card("t_mire_offering", "Hag's Offering", 0, "Curse", "none", [A("toxin", 2, attr="stable")],
     "Unplayable. When drawn: gain 2 Toxin, and draw a replacement. Removed at fight end.",
     use=[], kw=["Temporary", "Unplayable", "Curse"], on_draw=[A("toxin", 2, attr="stable")], cat="toxin",
     flavour="The hags fed her for centuries. She is giving some of it back.",
     note="The Mire Mother's mouth opens and a wet bundle of charms and bones lands at a hero's feet.")

# ================================================================== foes
creature(
    "bog_body", "Bog Body", "foe", 42, ranks=[1], resist=FEN_FIRE, personality="mindless",
    intents={
        "claw": I("Peat Claw", "attack", "front", [D(8)]),
        "drag": I("Drag Under", "attack", "front", [D(4), A("water", 2, attr="stable")]),
        "lunge": I("Stiff Lunge", "attack", "rank2", [D(7)]),
    },
    ai=[{"use": "drag", "every": 3}, {"use": "lunge", "every": 3, "offset": 1}, {"use": "claw"}],
    lore="Tanned by the bog. Leather now, and hungry.", world=W)

creature(
    "fen_hag", "Fen Hag", "foe", 32, ranks=[3, 4], resist=FEN, role="afflicter", personality="cunning",
    intents={
        "mud": I("Foul Mud", "attack", "back", [D(3), A("toxin", 2, attr="stable")]),
        "curse": I("Fen Curse", "debuff", "back", [STRESS(8)]),
        "pool": I("Poison the Water", "debuff", "front", [A("toxin", 1, attr="stable"), A("water", 1, attr="volatile")]),
        "brew": I("Bog Brew", "heal", "ally_lowest", [H(10)]),
    },
    ai=[{"use": "brew", "if": "ally_hurt75", "not_twice": True}, {"use": "pool", "every": 3},
        {"use": "curse", "every": 3, "offset": 1}, {"use": "mud"}],
    lore="She knows the safe path through the fen. She does not share it.", world=W)

creature(
    "mire_toad", "Mire Toad", "foe", 34, ranks=[2, 3], resist={"toxin": "immune", "water": "resist", "frost": "weak"},
    role="afflicter",
    intents={
        "tongue": I("Tongue", "attack", "back", [D(5), PULL(1)]),
        "spit": I("Poison Spit", "attack", "random", [D(3), A("toxin", 2, attr="stable")]),
        "puff": I("Puff Up", "defend", "self", [B(8), SELF("thorns", 2)]),
    },
    ai=[{"use": "puff", "if": "hp_pct<50", "not_twice": True}, {"use": "tongue", "every": 3}, {"use": "spit"}],
    traits=[T("death", "Burst Sacs", "On death its poison sacs burst over the front hero: 2 Toxin.",
              [A("toxin", 2, attr="stable", to="front_enemy")])],
    lore="Fat on the fen's poison.", world=W)

creature(
    "leech_swarm", "Leech Swarm", "foe", 28, ranks=[1, 2], resist={"water": "resist", "fire": "weak"}, flags=["swarm"],
    intents={
        "latch": I("Latch On", "attack", "front", [D(3, lifesteal=100), ST("bleed", 2)]),
        "drain": I("Drain", "attack", "random", [D(2, times=3, lifesteal=100)]),
    },
    ai=[{"use": "drain", "every": 2}, {"use": "latch"}],
    lore="The fen's own. They wait in the warm shallows.", world=W)

creature(
    "fen_lurker", "Fen Lurker", "foe", 44, armor=1, ranks=[1], resist={"physical": "resist", "water": "resist",
                                                                      "lightning": "weak"},
    intents={
        "ambush": I("Ambush", "attack", "back", [D(10)]),
        "roll": I("Death Roll", "attack", "front", [D(8), ST("bleed", 1)]),
        "sink": I("Sink", "defend", "self", [B(8), SELF("dodge", 1)]),
    },
    ai=[{"use": "ambush", "if": "round<=1"}, {"use": "sink", "every": 4, "offset": 2}, {"use": "roll"}],
    lore="A log in the water. Then not.", world=W)

creature(
    "eel_catcher", "Eel-Catcher", "foe", 40, ranks=[1, 2], resist=FEN,
    intents={
        "pin": I("Pin the Foot", "attack", "front", [D(6), ST("anchor", 2)]),
        "stab": I("Glaive Stab", "attack", "front", [D(9)]),
        "jab": I("Low Jab", "attack", "rank2", [D(5), ST("anchor", 1)]),
    },
    ai=[{"use": "pin", "every": 3}, {"use": "jab", "every": 3, "offset": 1}, {"use": "stab"}],
    lore="Every eel in the Rotmire has bitten him once. He has kept the marks.", world=W)

creature(
    "stilt_fowler", "Stilt-Fowler", "foe", 34, ranks=[3, 4], resist=FEN, role="afflicter",
    intents={
        "net": I("Clap-Net", "debuff", "rank2", [D(4), ST("anchor", 2), STRESS(3)]),
        "sling": I("Sling Stone", "attack", "back", [D(7)]),
        "decoy": I("Decoy", "defend", "self", [B(5), SELF("dodge", 1)]),
    },
    ai=[{"use": "net", "every": 3}, {"use": "decoy", "if": "hp_pct<50", "not_twice": True}, {"use": "sling"}],
    lore="He walked the deep fen on stilts to net the wildfowl. He has not come down since.", world=W)

creature(
    "turf_wife", "Turf-Wife", "foe", 46, armor=2, ranks=[1], resist=FEN_FIRE, role="defender",
    intents={
        "spade": I("Turf Spade", "attack", "front", [D(8)]),
        "settle": I("Settle the Load", "defend", "self", [B(10), {"t": "guard_weakest"}]),
        "topple": I("Topple the Stack", "attack", "front2", [D(9), A("toxin", 1, attr="stable")]),
    },
    ai=[{"use": "settle", "if": "ally_hurt", "not_twice": True}, {"use": "topple", "every": 4}, {"use": "spade"}],
    lore="She cut turf for the village fires and carried it home on her back. The load has taken root.", world=W)

creature(
    "frog_catcher", "Frog-Catcher", "foe", 30, ranks=[3, 4], resist=FEN, role="summoner",
    intents={
        "croak": I("Croak", "debuff", "all_heroes", [STRESS(4)]),
        "jab": I("Reed Spear", "attack", "rank2", [D(6)]),
        "sack": I("Empty the Sack", "summon", "self", [SUMMON("mire_toad", max=2)]),
        "gulp": I("Eat a Frog", "heal", "self", [H(8)]),
    },
    ai=[{"use": "sack", "if": "allies<4", "every": 3}, {"use": "gulp", "if": "hp_pct<50", "not_twice": True},
        {"use": "croak", "every": 2}, {"use": "jab"}],
    lore="He caught frogs for his mother's pot. When the pot ran out he ate them as they came.", world=W)

creature(
    "lantern_gnats", "Lantern Gnats", "foe", 28, ranks=[3, 4], resist={"toxin": "resist", "water": "resist", "frost": "weak"},
    role="afflicter", flags=["swarm"],
    intents={
        "pour": I("Pour off the Lantern", "attack", "random", [D(2, times=3), A("toxin", 1, attr="stable")]),
        "blister": I("Blisters", "debuff", "back", [A("toxin", 2, attr="stable"), STRESS(2)]),
    },
    ai=[{"use": "blister", "every": 3}, {"use": "pour"}],
    lore="They come to the hags' lamps after dark. So, in the end, do you.", world=W)

creature(
    "sin_eater", "Sin-Eater", "foe", 40, ranks=[2, 3], resist=FEN, role="support",
    intents={
        "eat": I("Eat the Sin", "buff", "ally_lowest", [CLEANSE(4), SELF("might", 1)]),
        "feast": I("Funeral Feast", "buff", "all_allies", [CLEANSE(2)]),
        "bite": I("Lurching Bite", "attack", "front", [D(8)]),
        "ale": I("Funeral Ale", "heal", "self", [H(8)]),
    },
    ai=[{"use": "eat", "if": "ally_hurt", "every": 2}, {"use": "feast", "every": 4, "offset": 1},
        {"use": "ale", "if": "hp_pct<50", "not_twice": True}, {"use": "bite"}],
    traits=[T("death", "Sins", "On death the sins he ate spill out: every hero gains 1 Toxin and 3 stress.",
              [A("toxin", 1, attr="stable", to="all_enemies"), STRESS(3, to="all_enemies")])],
    lore="Paid a coin to eat the bread off a dead man's chest, and his sins with it. The fen has kept him busy.", world=W)

creature(
    "leech_barber", "Leech-Barber", "foe", 38, ranks=[2], resist=FEN, role="support",
    intents={
        "grab": I("Leech Cure", "attack", "front", [D(4), ST("bleed", 3)]),
        "cup": I("Let Blood", "heal", "ally_lowest", [H(10)]),
        "razor": I("Razor", "attack", "front", [D(7)]),
        "feed": I("Feed the Leeches", "buff", "all_allies", [ST("regen", 2)]),
    },
    ai=[{"use": "cup", "if": "ally_hurt75", "not_twice": True}, {"use": "feed", "every": 4},
        {"use": "grab", "every": 2}, {"use": "razor"}],
    lore="He bled the whole village for its health. The leeches have grown fond of him.", world=W)

# ================================================================== elites
creature(
    "bog_troll", "Bog Troll", "elite", 125, armor=3, ranks=[1], resist=FEN_FIRE, role="defender",
    intents={
        "smash": I("Overhead Smash", "attack", "front", [D(16)]),
        "wade": I("Wading Sweep", "attack", "front2", [D(6), A("water", 1, attr="stable")]),
        "slabs": I("Peat Slabs", "defend", "self", [B(10), AR(1)]),
        "shrug": I("Shrug Off", "defend", "self", [CLEANSE(4), B(6)]),
    },
    ai=[{"use": "shrug", "if": "el_total>=3", "not_twice": True}, {"use": "slabs", "every": 4, "offset": 3},
        {"use": "wade", "every": 3}, {"use": "smash"}],
    traits=[T("round_start", "Moss Knits", "Round start: heals 6, unless it carries Burn.",
              [H(6, if_="!fire")])],
    lore="Moss, mud and muscle. It heals faster than you can cut.", world=W)

creature(
    "coven_mother", "Coven Mother", "elite", 100, armor=2, ranks=[3], resist=FEN, role="afflicter",
    personality="cruel", charge_name="Knots",
    intents={
        "brew": I("Brew the Pool", "debuff", "random", [A("toxin", 2, attr="stable"), A("water", 1, attr="volatile")]),
        "knot": I("Knot the Cord", "debuff", "most_stress", [ST("anchor", 3), STRESS(6), CLR("charge")]),
        "tend": I("Tend the Coven", "heal", "all_allies", [H(6)]),
        "curse": I("Spit a Curse", "attack", "back", [D(7), A("toxin", 2, attr="stable"), STRESS(3)]),
    },
    ai=[{"use": "knot", "if": "charge>=3"}, {"use": "tend", "if": "ally_hurt75", "not_twice": True},
        {"use": "brew", "every": 2}, {"use": "curse"}],
    traits=[T("round_start", "Knotting", "Round start: she ties 1 Knot in her cord. At 3 she binds a hero.",
              [SELF("charge", 1)])],
    lore="She leads the hags of the fen. Her antlers are not hers.", world=W)

creature(
    "tithe_reeve", "The Tithe Reeve", "elite", 105, armor=3, ranks=[2], resist=FEN, role="support",
    intents={
        "tally": I("Tap the Tally", "debuff", "front", [STEAL(), ST("mark", 1)]),
        "pole": I("Eel Pole", "attack", "front", [D(13)]),
        "sweep": I("Pole Sweep", "attack", "front2", [D(7)]),
        "count": I("Count the Notches", "defend", "self", [B(10), H(8)]),
    },
    ai=[{"use": "tally", "every": 3}, {"use": "count", "if": "hp_pct<50", "not_twice": True},
        {"use": "sweep", "every": 3, "offset": 1}, {"use": "pole"}],
    traits=[T("ally_death", "Still Taking", "When a foe falls, he takes its due: gains 8 Block and 1 Might.",
              [B(8, to="self"), SELF("might", 1)])],
    lore="He took one eel in ten for the hall and the fattest for himself. He is still taking.", world=W)

creature(
    "midden_sow", "The Midden Sow", "elite", 130, armor=2, span=2, ranks=[1, 2], resist=FEN, role="attacker",
    intents={
        "charge": I("Charge", "attack", "front", [D(13), PUSH(2), A("toxin", 1, attr="stable")]),
        "trample": I("Trample", "attack", "front2", [D(7), A("toxin", 1, attr="stable")]),
        "gore": I("Gore", "attack", "front", [D(9), ST("bleed", 2)]),
        "wallow": I("Wallow", "defend", "self", [CLEANSE(4), B(10)]),
    },
    ai=[{"use": "wallow", "if": "el_total>=3", "not_twice": True}, {"use": "charge", "every": 3},
        {"use": "trample", "every": 3, "offset": 1}, {"use": "gore"}],
    traits=[T("hit", "Spore Ridge", "Every hit on her puffs spores: the hero who hit her gains 1 Toxin.",
              [A("toxin", 1, attr="stable")])],
    lore="Every house kept a pig under the floor to eat what fell through. In the Rotmire, a great deal fell through.",
    world=W)

# ================================================================== rulers
creature(
    "mire_mother", "The Mire Mother", "ruler", 290, armor=2, span=2, ranks=[3, 4], resist=FEN_FIRE, role="afflicter",
    flags=["immovable"],
    intents={
        "flood": I("Poison Flood", "attack", "all_heroes", [D(3), A("toxin", 1, attr="stable"), A("water", 1, attr="volatile")]),
        "lullaby": I("Bog Lullaby", "debuff", "all_heroes", [STRESS(6)]),
        "gulp": I("Gulp", "attack", "front", [D(17)]),
        "weed": I("Drowning Weed", "attack", "back", [D(7), PULL(3), ST("anchor", 2)]),
        "spit": I("Spit the Offerings", "debuff", "all_heroes", [D(4), ADD("t_mire_offering")]),
        "bubble": I("Sink to the Chin", "defend", "self", [B(16)]),
    },
    ai=[{"use": "flood", "every": 3}, {"use": "lullaby", "every": 3, "offset": 1},
        {"use": "bubble", "if": "allies<3", "every": 4}, {"use": "gulp"}],
    traits=[T("ally_death", "Mother of the Hags", "When a hag falls, she swallows its offering: gains 6 Regen.",
              [SELF("regen", 6)])],
    phases=[
        P(55, "She rises from the fen.", might=1,
          ai=[{"use": "weed", "every": 3}, {"use": "flood", "every": 3, "offset": 1},
              {"use": "lullaby", "every": 3, "offset": 2}, {"use": "gulp"}]),
        P(25, "The mouth opens.",
          ai=[{"use": "spit", "every": 3}, {"use": "flood", "every": 2}, {"use": "gulp"}]),
    ],
    lore="The fen's oldest drowned head, swollen to the size of a house. The hags call her Mother.", world=W)

creature(
    "stilt_hall", "The Stilt Hall", "ruler", 280, armor=3, span=2, ranks=[3, 4], resist=FEN_FIRE, role="summoner",
    intents={
        "stamp": I("Stamp the Pile", "attack", "random", [D(8), A("toxin", 1, attr="stable"), A("water", 1, attr="volatile")]),
        "reach": I("The Household Reaches", "attack", "back", [D(5), PULL(2), ST("anchor", 1)]),
        "creak": I("Shift Weight", "defend", "self", [B(16)]),
        "doors": I("Open the Doors", "summon", "self", [SUMMON("bog_body", max=3)]),
        "inside": I("Pulled Inside", "attack", "weakest", [D(6), ST("anchor", 2), ST("bleed", 3), STRESS(6)]),
        "wade": I("Wade the Mere", "attack", "all_heroes", [D(4), A("toxin", 1, attr="stable"), A("water", 1, attr="volatile")]),
    },
    ai=[{"use": "stamp", "every": 2}, {"use": "reach", "every": 3, "offset": 1}, {"use": "creak", "if": "ally_hurt", "every": 4},
        {"use": "reach"}],
    traits=[T("round_start", "Household in the Walls", "Round start: the household grabs the front hero: 1 Toxin.",
              [A("toxin", 1, attr="stable", to="front_enemy")])],
    phases=[
        P(50, "The doors open.",
          ai=[{"use": "doors", "if": "allies<3", "not_twice": True}, {"use": "inside", "every": 2},
              {"use": "wade", "every": 3}, {"use": "stamp"}]),
        P(20, "The front piles buckle. The hall lurches forward.", might=2,
          ai=[{"use": "wade", "every": 2}, {"use": "inside", "every": 3}, {"use": "stamp"}]),
    ],
    lore="When the water turned, the village climbed into the moot-hall to wait. In the morning the hall had walked off.",
    world=W)

creature(
    "old_heron", "The Old Heron", "ruler", 260, armor=2, span=2, ranks=[3, 4],
    resist={"toxin": "resist", "water": "resist", "lightning": "weak"}, role="attacker", charge_name="Stillness",
    intents={
        "still": I("Stand Still", "charge", "self", [B(12)]),
        "spear": I("The Beak Falls", "attack", "back", [D(22), CLR("charge")]),
        "lift": I("Lift to the Crop", "attack", "weakest", [D(6), ST("anchor", 2), A("toxin", 1, attr="stable")]),
        "gulp": I("Gulp", "attack", "weakest", [D(15), A("toxin", 3, attr="stable")]),
        "spill": I("The Crop Splits", "debuff", "front2", [A("toxin", 2, attr="stable"), A("water", 1, attr="volatile")]),
        "twin": I("Two Strikes", "attack", "random", [D(9, times=2)]),
    },
    ai=[{"use": "spear", "if": "charge>=3"}, {"use": "still"}],
    traits=[T("round_start", "Still Water", "Round start: gains 1 Stillness. At 3 the beak falls on the rearmost hero.",
              [SELF("charge", 1)])],
    phases=[
        P(50, "It begins to feed.",
          ai=[{"use": "spear", "if": "charge>=3"}, {"use": "lift", "every": 2}, {"use": "gulp"}]),
        P(20, "The crop splits.", might=1,
          ai=[{"use": "spill", "every": 3}, {"use": "twin"}]),
    ],
    lore="It fished the fen before there were stilts. It has come to prefer the fishermen.", world=W)

# ================================================================== encounters
F, E_, R = "foe", "elite", "ruler"
encounter(W, "mire_f1", "The Peat Cutting", "The hags' dead cutting turf.",
          ["bog_body", "turf_wife", "bog_body"], "mire_bog", F,
          "The wife's toppled stack hits two ranks while the bodies hold the line.")
encounter(W, "mire_f2", "Pinned in the Pool", "A catcher, a heap of leeches and a hag on the bank.",
          ["eel_catcher", "leech_swarm", "fen_hag"], "mire_bog", F,
          "The glaive Anchors, the hag pools the rank, the leeches feed: Ward or cleanse instead of Swapping.")
encounter(W, "mire_f3", "The Sin-Eater's Porch", "A toad, a hag and the man who eats their curses.",
          ["mire_toad", "sin_eater", "fen_hag"], "mire_hut", F,
          "The Sin-Eater eats every Hex, Mark and course off the toad and the hag; kill him first.")
encounter(W, "mire_f4", "Village Trades", "The barber, the frog boy and the fowler.",
          ["leech_barber", "frog_catcher", "stilt_fowler"], "mire_hut", F,
          "The barber drains the front, the boy croaks and adds toads, the fowler nets from above.")
encounter(W, "mire_f5", "Night Water", "A log in the water, leeches and a lantern.",
          ["fen_lurker", "leech_swarm", "lantern_gnats"], "mire_drown", F,
          "The log ambushes the back on the first round; two swarms want hits on every foe.")
encounter(W, "mire_f6", "The Shallows", "Every hero pinned.",
          ["eel_catcher", "fen_lurker", "stilt_fowler"], "mire_drown", F,
          "Anchored heroes cannot Swap out of pools; Ward or cleanse instead.")
encounter(W, "mire_f7", "The Long Grind", "Armor in front, a drain behind, blisters from the back.",
          ["turf_wife", "leech_barber", "lantern_gnats"], "mire_bog", F,
          "A slow grind: Toxin wears the turf Armor down while the barber heals her.")
encounter(W, "mire_f8", "The Toad Porch", "The boy keeps filling the porch with toads.",
          ["bog_body", "mire_toad", "frog_catcher", "fen_hag"], "mire_hut", F,
          "Kill the Frog-Catcher first or the fight never thins; toads burst Toxin on the front hero.")
encounter(W, "mire_e1", "Under the Bridge", "Something heavy in the mud, and a man who eats what you put on it.",
          ["bog_troll", "sin_eater", "leech_swarm"], "mire_bog", E_,
          "Burn stops the troll's regrowth, and the Sin-Eater eats the Burn off it: kill order is the fight.")
encounter(W, "mire_e2", "The Tithe", "The Reeve has come for his due.",
          ["turf_wife", "tithe_reeve", "eel_catcher"], "mire_hut", E_,
          "The Reeve takes the front hero's Block, the catcher pins, the turf stack guards him.")
encounter(W, "mire_e3", "The Midden", "The sow breaks out of the pen beneath the houses.",
          ["midden_sow", "mire_toad", "fen_hag"], "mire_hut", E_,
          "The charge shoves the front heroes back into ranks the hag has pooled; multi-hits on the ridge cost Toxin.")
encounter(W, "mire_e4", "The Coven", "The hags gather around the eldest.",
          ["fen_hag", "coven_mother", "lantern_gnats"], "mire_drown", E_,
          "Pools under every hero and a cord that binds the most stressed: cleanse and move, or race her down.")
encounter(W, "mire_r_mire_mother", "The Mire Mother", "The fen's mother and her hags.",
          ["fen_hag", "fen_hag", "mire_mother"], "mire_boss", R,
          "Each dead hag feeds the Mother Regen: leave them and take their curses, or kill them and race her.")
encounter(W, "mire_r_stilt_hall", "The Stilt Hall", "The moot-hall wading toward the Mother's mere.",
          ["bog_body", "turf_wife", "stilt_hall"], "mire_boss", R,
          "The household drags the weakest hero in and feeds on it while the rest hold the line against the bodies.",
          props="stilt_hall")
encounter(W, "mire_r_old_heron", "The Old Heron", "The great grey heron in the eel shallows.",
          ["eel_catcher", "leech_swarm", "old_heron"], "mire_boss", R,
          "Pins and pools say move; the Heron's Stillness counts down to a spear at the rearmost hero.",
          props="old_heron")

# ================================================================== world cards (Toxic Pool)
card("w_mire_fen_water", "Fen Water", 1, "W", "enemy",
     [D(3), CONV("water", "toxin"), A("water", 1, attr="volatile")],
     "Deal 3. Turn the foe's Water into Toxin. Apply 1 Volatile Water.",
     cat="water", attr="volatile", world=W, arch="world",
     flavour="The fen keeps everything. It ripens what it keeps.",
     note="A hero's boot breaking the skin of a bile-green pool under a Bog Body's feet.",
     up={"text": "Deal 5. Turn the foe's Water into Toxin. Apply 1 Volatile Water.",
         "fx": [D(5), CONV("water", "toxin"), A("water", 1, attr="volatile")]})
card("w_mire_wade_out", "Wade Out", 1, "W", "ally",
     [CLEANSE(2), B(7, if_="t.moved")],
     "A hero removes 2 ailment stacks. If they moved this round, they gain 7 Block.",
     world=W, arch="world",
     flavour="Walk where the hag walks. Never stand where she stood.",
     note="A hero stepping out of a poisoned rank onto a sunken plank, mud to the knee.",
     up={"text": "A hero removes 3 ailment stacks. If they moved this round, they gain 9 Block.",
         "fx": [CLEANSE(3), B(9, if_="t.moved")]})
card("w_mire_flood_cuttings", "Flood the Cuttings", 1, "W", "all_enemies",
     [D(1), A("water", 1, attr="volatile", if_="t.toxin>0")],
     "Deal 1 to every foe. Apply 1 Volatile Water to every foe with Toxin.",
     cat="water", attr="volatile", world=W, arch="world",
     flavour="Break the dyke and let the fen in. It knows where the poison is.",
     note="Black water pouring through a broken turf dyke into the peat cuttings where the foes stand.",
     up={"text": "Deal 3 to every foe. Apply 1 Volatile Water to every foe with Toxin.",
         "fx": [D(3), A("water", 1, attr="volatile", if_="t.toxin>0")]})
card("w_mire_into_the_pool", "Into the Pool", 1, "W", "enemy",
     [PUSH(1), D(2, per="t.toxin", k=1)],
     "Push the foe back 1. Deal 2, plus 1 per Toxin on it.",
     world=W, arch="world",
     flavour="Every rank of the Rotmire is poisoned. Choose which one they stand in.",
     note="A hero shoving an Eel-Catcher backward off the duckboards into a pool that blisters as he lands.",
     up={"text": "Push the foe back 1. Deal 2, plus 2 per Toxin on it.",
         "fx": [PUSH(1), D(2, per="t.toxin", k=2)]})

NEEDS = [
    "stilt_hall Inside the Hall: a hero pulled inside should leave the line and hit only the hall until it breaks out "
    "(swallow, postponed); Pulled Inside is written as damage, Anchor, Bleed and stress on the weakest hero.",
    "old_heron: Still water should target the hero who moved last round (a 'moved last round' intent target); The Beak "
    "Falls hits the rearmost instead. Swallowing the lifted hero is postponed: Gulp hits the weakest hero. Swollen crop "
    "(a heavy hit disgorges) needs a damage-threshold hit trigger.",
    "mire_mother Spit the Offerings: intent text prints the card id (t_mire_offering); it should print the card name.",
    "coven_mother Curse-seller: her Toxin and stress should ignore Ward (an 'unwardable' flag on an intent).",
    "fen_hag Safe path: should never be poisoned by a Toxic Pool (a hazard-immunity flag).",
    "mire_toad Burst Sacs / sin_eater Sins: should land on the hero who killed it (a 'killer' target on death traits); "
    "written as the front hero and every hero.",
    "sin_eater Eat the Sin: CLEANSE on a foe should strip Hex, Mark and course stacks.",
    "stilt_fowler Teetering (pushed or pulled, it loses its next action) needs a 'moved' trait trigger; Clap-Net's "
    "'cannot be Guarded this round' needs a no-Guard status.",
    "tithe_reeve Tap the Tally: should divert the marked hero's next Block or healing to him; written as taking their "
    "Block now.",
    "fen_lurker Ambush: its first strike should act before the Ordo; written as a round-1 hit on the rearmost hero.",
    "turf_wife Topple the Stack should cost her the turf Armor; no self Armor loss with honest intent text.",
]
