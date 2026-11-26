"""World I: The Drowned Kingdom (Water + Void, Drown). Role map: docs/design/gate2/world_I_drowned_kingdom.md.

Foes spread Soak slowly; a few voices (the Siren's lure, the Tidewarden's sweep, the King's decree, the Bell's knell)
land Void to cash it into Drown. The first world most players see: every foe keeps 2 to 4 plain moves."""
from dsl import *
from creatures import *
import dsl
WARD = dsl.W  # the world key below shadows the Ward helper
W = "drowned"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])
WATER = {"water": "resist"}
GW = {"t": "guard_weakest"}

# ================================================================== elites
creature(
    "warden", "Hollow Tidewarden", "elite", 115, armor=3, ranks=[1],
    resist={"physical": "resist", "water": "resist", "lightning": "weak"}, role="defender",
    intents={
        "sweep": I("Halberd Sweep", "attack", "front2", [D(6), A("water", 1, attr="volatile")]),
        "halberd": I("Halberd Cut", "attack", "front", [D(14)]),
        "hold": I("Hold the Door", "defend", "self", [B(12), GW]),
        "visor": I("Shut the Visor", "defend", "self", [WARD(3), B(8)]),
    },
    ai=[{"use": "visor", "if": "el_total>=3", "not_twice": True}, {"use": "hold", "if": "ally_hurt", "not_twice": True},
        {"use": "sweep", "every": 2}, {"use": "halberd"}],
    traits=[T("round_start", "Lodger",
              "Round start: the pale thing in its chest tastes the water and gives the front hero 1 Erode.",
              [A("void", 1, attr="stable", to="front_enemy")])],
    lore="A temple guard grown into the sea. Something lives in the hole in its chest.", world=W)

creature(
    "abbess", "Abbess of Salt", "elite", 100, armor=2, ranks=[2, 3],
    resist={"water": "resist", "void": "weak"}, role="afflicter",
    intents={
        "sermon": I("Silent Sermon", "debuff", "all_heroes", [STRESS(6), A("water", 1, attr="stable")]),
        "salt": I("Salt the Wound", "attack", "front", [D(11), ST("vulnerable", 1)]),
        "rites": I("Last Rites", "heal", "ally_lowest", [H(16), CLEANSE(3)]),
        "seal": I("Seal the Door", "debuff", "most_cards", [ADD("t_drowned_sewn_shut"), STRESS(4)]),
    },
    ai=[{"use": "rites", "if": "ally_hurt75", "not_twice": True}, {"use": "seal", "every": 3},
        {"use": "sermon", "every": 3, "offset": 1}, {"use": "salt"}],
    traits=[T("round_start", "Salt Crust", "Round start: if she has no Ward, she gains 2 Ward, so the first course stacks on her are cancelled.",
              [WARD(2, to="self", if_="ward<1")])],
    lore="Her mouth is sewn shut. She preaches anyway.", world=W)

creature(
    "kraken_arm", "The Grasping Deep", "elite", 125, armor=2, span=2, ranks=[3, 4],
    resist={"water": "resist", "lightning": "weak"}, role="attacker", flags=["immovable"],
    intents={
        "slam": I("Slam", "attack", "front", [D(15)]),
        "grab": I("Grab", "attack", "back", [D(6), PULL(3), ST("anchor", 3), A("water", 1, attr="stable")]),
        "breach": I("Into the Breach", "attack", "front", [D(6), A("void", 1, attr="volatile")]),
        "recoil": I("Recoil", "defend", "self", [B(14)]),
    },
    ai=[{"use": "recoil", "if": "hp_pct<50", "not_twice": True, "every": 3}, {"use": "grab", "every": 3},
        {"use": "breach", "every": 3, "offset": 2}, {"use": "slam"}],
    traits=[T("hit", "Held Fast", "A hero who lands a hit on the arm is no longer Anchored.", [CLR("anchor")])],
    lore="Only one arm reaches up through the floor. Pray it is only one.", world=W)

creature(
    "pearl_diver", "Pearl Diver", "elite", 90, armor=2, ranks=[2, 3],
    resist={"water": "resist", "toxin": "weak"}, role="attacker",
    intents={
        "knife": I("Shucking Knife", "attack", "back", [D(6, times=2), D(5, if_="!t.block")]),
        "leap": I("Leap the Line", "attack", "rank3", [D(10), ST("bleed", 2)]),
        "weight": I("Stone Weight", "attack", "back", [D(4), A("water", 2, attr="stable"), PULL(1)]),
        "sink": I("Sink from Sight", "defend", "self", [B(8), SELF("dodge", 1)]),
    },
    ai=[{"use": "sink", "if": "hp_pct<50", "not_twice": True}, {"use": "weight", "every": 3},
        {"use": "leap", "every": 3, "offset": 1}, {"use": "knife"}],
    traits=[T("hit", "Nacre Crust", "When hit, its pearl crust hardens: it gains 3 Block.", [B(3, to="self")])],
    lore="It goes for the soft ones at the back. It always has.", world=W)

# ================================================================== cards foes put in a hand
card("t_drowned_sewn_shut", "Sewn Shut", 1, "Curse", "none", [STRESS(-2)],
     "Cut the stitches: shed 2 stress. Exhaust. Until it is played it comes back with every reshuffle; removed at fight end.",
     kw=["Temporary", "Curse", "Exhaust"],
     flavour="The order sewed her mouth shut with waxed cord. She has kept the needle.",
     note="The Abbess of Salt drawing a length of waxed cord through a hero's hand like a seam.")

# ================================================================== foes
creature(
    "thrall", "Drowned Thrall", "foe", 40, ranks=[1, 2], resist=WATER, personality="mindless",
    intents={
        "grasp": I("Grasp", "attack", "front", [D(8)]),
        "hook": I("Boat Hook", "attack", "back", [D(5), PULL(1)]),
        "soak": I("Waterlogged", "attack", "front", [D(4), A("water", 2, attr="stable")]),
    },
    ai=[{"use": "hook", "every": 3}, {"use": "soak", "every": 3, "offset": 1}, {"use": "grasp"}],
    lore="Sailors who went down with the fleet. They still haul at anything that floats.", world=W)

creature(
    "siren", "Brine Siren", "foe", 34, ranks=[3, 4], resist={"water": "resist", "lightning": "weak"},
    role="afflicter",
    intents={
        "song": I("Drowning Song", "debuff", "all_heroes", [STRESS(5)]),
        "lure": I("Lure", "attack", "back", [D(4), A("void", 1, attr="volatile")]),
        "spray": I("Brine Spray", "attack", "front2", [D(3), A("water", 1, attr="stable")]),
    },
    ai=[{"use": "lure", "every": 3}, {"use": "song", "every": 3, "offset": 1}, {"use": "spray"}],
    lore="Its song is the last thing the drowned remember. It wants you to remember it too.", world=W)

creature(
    "eelkin", "Eel-kin Biter", "foe", 32, ranks=[1, 2], resist={"water": "resist", "lightning": "weak"},
    intents={
        "bite": I("Latching Bite", "attack", "front", [D(4), ST("bleed", 3)]),
        "lash": I("Tail Lash", "attack", "back", [D(6)]),
        "slither": I("Slither", "defend", "self", [B(6), SELF("dodge", 1)]),
    },
    ai=[{"use": "slither", "if": "hp_pct<40", "not_twice": True}, {"use": "bite", "every": 2}, {"use": "lash"}],
    traits=[T("hit", "Latched", "A hero who hits the Biter shakes it off: that hero's Bleed ends.", [CLR("bleed")])],
    lore="They feed by latching on and not letting go.", world=W)

creature(
    "bellringer", "Drowned Bell-Ringer", "foe", 36, ranks=[2, 3], resist={"water": "resist", "void": "resist"},
    role="afflicter",
    intents={
        "toll": I("Toll", "debuff", "all_heroes", [STRESS(5)]),
        "dirge": I("Dirge", "buff", "all_allies", [ST("might", 1)]),
        "strike": I("Bell Strike", "attack", "front", [D(7)]),
    },
    ai=[{"use": "dirge", "every": 4}, {"use": "toll", "every": 2, "offset": 1}, {"use": "strike"}],
    traits=[T("death", "Knell", "On death it rings once more: every hero gains 4 stress.", [STRESS(4, to="all_enemies")])],
    lore="The bell is rung for the dead. Down here, that is everyone.", world=W)

creature(
    "barnacle_knight", "Barnacle Knight", "foe", 48, armor=2, ranks=[1],
    resist={"physical": "resist", "water": "resist", "lightning": "weak"}, role="defender",
    intents={
        "encrust": I("Encrust", "defend", "self", [B(10), GW]),
        "crush": I("Crushing Blow", "attack", "front", [D(10)]),
        "bash": I("Shield Bash", "attack", "front", [D(6), PUSH(1)]),
    },
    ai=[{"use": "encrust", "if": "ally_hurt", "not_twice": True}, {"use": "bash", "every": 3}, {"use": "crush"}],
    traits=[T("ally_death", "Oathbound", "When an ally falls, it gains 8 Block.", [B(8, to="self")])],
    lore="Oathbound to a drowned order. The sea has kept his armour on for him.", world=W)

creature(
    "lamprey", "Lamprey Swarm", "foe", 28, ranks=[1, 2], resist={"water": "resist", "lightning": "weak"},
    flags=["swarm"],
    intents={
        "latch": I("Latch", "attack", "front", [D(3, lifesteal=100), ST("bleed", 2)]),
        "feed": I("Feeding Knot", "attack", "random", [D(2, times=3)]),
    },
    ai=[{"use": "feed", "every": 2}, {"use": "latch"}],
    lore="A knot of mouths. Where one is, the rest follow.", world=W)

creature(
    "bloated", "Bloated Corpse", "foe", 38, ranks=[1, 2], resist={"water": "resist", "fire": "weak"},
    role="afflicter",
    intents={
        "ooze": I("Ooze", "debuff", "front2", [A("water", 2, attr="stable")]),
        "heave": I("Heave", "attack", "front", [D(8)]),
        "burst": I("Burst", "attack", "all_heroes", [D(5), SELFDMG(999)]),
    },
    ai=[{"use": "burst", "if": "hp_pct<35"}, {"use": "burst", "if": "round>=6"}, {"use": "ooze", "every": 2},
        {"use": "heave"}],
    traits=[T("death", "Burst", "On death, foul water spills: every hero gains 2 Soak.",
              [A("water", 2, attr="stable", to="all_enemies")])],
    lore="Gas swells the dead until the skin will not hold. Do not be close when it fails.", world=W)

creature(
    "hookline", "Hookline Fisher", "foe", 34, ranks=[3, 4], resist=WATER,
    intents={
        "reel": I("Reel In", "attack", "back", [D(5), PULL(2)]),
        "gaff": I("Gaff", "attack", "front", [D(8)]),
        "net": I("Cast Net", "debuff", "all_heroes", [ST("anchor", 1), STRESS(3)]),
    },
    ai=[{"use": "reel", "every": 3}, {"use": "net", "every": 3, "offset": 1}, {"use": "gaff"}],
    lore="Still fishing. The catch has changed.", world=W)

creature(
    "weeping_nun", "Weeping Nun", "foe", 36, ranks=[2, 3], resist={"water": "resist", "void": "weak"}, role="support",
    intents={
        "tears": I("Salt Tears", "heal", "ally_lowest", [H(12), A("water", 2, attr="stable")]),
        "tide": I("Tide of Tears", "heal", "all_allies", [H(4), A("water", 1, attr="stable")]),
        "kiss": I("Brine Kiss", "attack", "front", [D(6), A("water", 1, attr="stable")]),
        "bow": I("Bowed Head", "defend", "self", [B(8)]),
    },
    ai=[{"use": "tears", "if": "ally_hurt75", "not_twice": True}, {"use": "tide", "if": "ally_hurt", "every": 4},
        {"use": "bow", "if": "hp_pct<50", "not_twice": True}, {"use": "kiss"}],
    lore="She weeps for the drowned. Her tears close their wounds.", world=W)

creature(
    "anchor_brute", "Anchor Brute", "foe", 52, armor=1, ranks=[1], resist={"water": "resist", "lightning": "weak"},
    intents={
        "swing": I("Anchor Swing", "attack", "front", [D(11), PUSH(1)]),
        "drag": I("Drag to the Front", "attack", "back", [D(5), PULL(3)]),
    },
    ai=[{"use": "drag", "every": 3}, {"use": "swing"}],
    lore="The anchor chain runs through his arm. He has stopped noticing.", world=W)

creature(
    "crab", "Wreck Crab", "foe", 40, armor=2, ranks=[1], resist={"physical": "resist", "water": "resist", "fire": "weak"},
    role="defender",
    intents={
        "crush": I("Claw Crush", "attack", "front", [D(9)]),
        "shell": I("Hull Shell", "defend", "self", [B(10)]),
        "snip": I("Sidelong Snip", "attack", "rank2", [D(6)]),
    },
    ai=[{"use": "shell", "every": 3}, {"use": "snip", "every": 3, "offset": 1}, {"use": "crush"}],
    lore="It wears what it ate.", world=W)

creature(
    "choirboy", "Drowned Choirboy", "foe", 30, ranks=[3, 4], resist={"water": "resist", "void": "resist"},
    role="support",
    intents={
        "hymn": I("Silent Hymn", "defend", "all_allies", [B(5)]),
        "wail": I("Endless Wail", "debuff", "all_heroes", [STRESS(5)]),
        "note": I("Void Note", "debuff", "back", [A("void", 1, attr="stable"), STRESS(3)]),
        "pray": I("Pray", "heal", "self", [H(6)]),
    },
    ai=[{"use": "pray", "if": "hp_pct<50", "not_twice": True}, {"use": "wail", "every": 3},
        {"use": "note", "every": 3, "offset": 1}, {"use": "hymn"}],
    lore="He has been singing since the water came in. He does not need to breathe to sing.", world=W)

# ================================================================== rulers
creature(
    "drowned_king", "The Drowned King", "ruler", 280, armor=3, span=2, ranks=[3, 4],
    resist={"water": "resist", "void": "resist", "lightning": "weak"}, role="afflicter", flags=["immovable"],
    intents={
        "crown": I("Crown of Tides", "debuff", "all_heroes", [A("water", 2, attr="stable"), STRESS(4)]),
        "backhand": I("Sceptre Backhand", "attack", "front", [D(16)]),
        "decree": I("Drown the Court", "debuff", "all_heroes", [A("void", 1, attr="volatile"), STRESS(3)]),
        "reach": I("Long Backhand", "attack", "front2", [D(10)]),
        "breath": I("Royal Breath", "defend", "self", [B(14)]),
        "gorge": I("Gorge on the Court", "heal", "self", [H(8), H(14, if_="allies>=2"), H(14, if_="allies>=3"), SELF("might", 1, if_="allies>=2")]),
    },
    ai=[{"use": "crown", "every": 3}, {"use": "breath", "every": 3, "offset": 2}, {"use": "backhand"}],
    traits=[T("round_start", "Kept Court",
              "Round start: if fewer than three of his court stand, he calls a Barnacle Knight into the front rank (once a fight).",
              [SUMMON("barnacle_knight", max=1, front=True, if_="allies<3")])],
    phases=[
        P(60, "The King rises from the throne.",
          ai=[{"use": "crown", "every": 3, "offset": 1}, {"use": "decree", "every": 3}, {"use": "reach"}]),
        P(30, "The King gorges on his court.", might=1,
          ai=[{"use": "gorge", "every": 3, "not_twice": True}, {"use": "crown", "every": 3, "offset": 1},
              {"use": "decree", "every": 3}, {"use": "reach"}]),
    ],
    lore="He kept his crown. The sea grew it into him.", world=W)

creature(
    "bell_below", "The Bell Below", "ruler", 300, armor=2, span=2, ranks=[3, 4],
    resist={"physical": "resist", "void": "resist", "frost": "weak"}, role="afflicter", flags=["immovable"],
    charge_name="Toll",
    intents={
        "toll": I("Toll", "debuff", "all_heroes", [STRESS(6), A("water", 1, attr="stable"), CLR("charge")]),
        "reach": I("Reaching Dead", "attack", "back", [D(9), PULL(2)]),
        "swing": I("Swing", "attack", "front", [D(15)]),
        "hum": I("Low Hum", "defend", "self", [B(16)]),
        "knell": I("Knell", "debuff", "all_heroes", [A("void", 1, attr="volatile"), STRESS(3)]),
        "clapper": I("The Clapper Wakes", "attack", "front2", [D(8, times=2)]),
    },
    ai=[{"use": "toll", "if": "charge>=3"}, {"use": "reach", "every": 2}, {"use": "hum", "if": "hp_pct<80", "every": 4},
        {"use": "swing"}],
    traits=[T("hit", "Struck Bronze", "Every hit on the bell rings: every hero gains 1 stress (up to 5 times a round).",
              [STRESS(1, to="all_enemies")]),
            T("round_start", "Count of the Drowned", "Round start: the Toll rises by 1. At 3 it tolls.",
              [SELF("charge", 1)])],
    phases=[
        P(50, "The bell cracks. The ringer bound to its clapper wakes.", might=1,
          ai=[{"use": "toll", "if": "charge>=2"}, {"use": "knell", "every": 2}, {"use": "clapper"}]),
        P(20, "The chain groans. The bell swings low over the company.", might=1,
          ai=[{"use": "toll", "if": "charge>=2"}, {"use": "knell", "every": 3}, {"use": "reach", "every": 3, "offset": 1},
              {"use": "swing"}]),
    ],
    lore="Rung once for every soul that drowned. It has not stopped ringing.", world=W)

creature(
    "mother_of_brine", "Mother of Brine", "ruler", 260, armor=2, span=2, ranks=[3, 4],
    resist={"water": "resist", "lightning": "weak"}, role="summoner", charge_name="Daughters",
    intents={
        "bear": I("Bear a Daughter", "summon", "self", [SUMMON("siren", max=4), SELF("charge", 1)]),
        "lullaby": I("Lullaby", "debuff", "all_heroes", [STRESS(6), A("water", 1, attr="stable")]),
        "embrace": I("Embrace", "attack", "front", [D(13, lifesteal=100), ST("anchor", 1)]),
        "chorus": I("Cradle Song", "debuff", "all_heroes", [A("void", 1, attr="volatile"), STRESS(3)]),
        "devour": I("Devour the Weak", "attack", "weakest", [D(22)]),
        "eat": I("Eat Her Own", "heal", "self", [H(10), H(14, if_="allies>=2"), H(14, if_="allies>=3")]),
    },
    ai=[{"use": "bear", "if": "allies<3&charge<4", "not_twice": True}, {"use": "lullaby", "every": 3}, {"use": "embrace"}],
    traits=[T("ally_death", "Mother's Grief", "When one of her daughters dies, every hero gains 5 stress.",
              [STRESS(5, to="all_enemies")])],
    phases=[
        P(55, "The lullaby turns to a scream.", might=1,
          ai=[{"use": "devour", "if": "hero_dd", "not_twice": True}, {"use": "bear", "if": "allies<3&charge<4", "every": 2},
              {"use": "chorus", "every": 3}, {"use": "lullaby", "every": 3, "offset": 2}, {"use": "embrace"}]),
        P(25, "She devours her own.",
          ai=[{"use": "eat", "not_twice": True, "every": 2}, {"use": "devour", "if": "hero_dd"},
              {"use": "chorus", "every": 2}, {"use": "embrace"}]),
    ],
    lore="Every siren is her daughter. Every drowned child is hers.", world=W)

# ================================================================== encounters
F, E_, R = "foe", "elite", "ruler"
encounter(W, "drowned_f1", "The Flooded Stair", "Two thralls haul at the stair; a fisher casts from the landing.",
          ["thrall", "thrall", "hookline"], "stair", F,
          "The reel drags a back hero forward into two hooks; tests Guard and hands that work from any rank.")
encounter(W, "drowned_f2", "The Eel Pools", "Things that bite, and keep biting.",
          ["eelkin", "lamprey", "eelkin"], "stair", F,
          "Latches Bleed until shaken off: hit the Biters or hit every foe.")
encounter(W, "drowned_f3", "The Barnacle Gate", "Two shells in front of a singer.",
          ["crab", "barnacle_knight", "siren"], "nave", F,
          "Fire cracks the crab, lightning the knight; reach rank 3 or eat the song and the lure.")
encounter(W, "drowned_f4", "The Drowned Belfry", "A brute keeps the door while the choir sings and the ringer tolls.",
          ["anchor_brute", "bellringer", "choirboy"], "belfry", F,
          "Stress race: the brute holds rank 1 behind the choirboy's hymn while the ringer tolls.")
encounter(W, "drowned_f5", "The Ossuary Tide", "A swollen body, a thrall and a sister who heals them both.",
          ["bloated", "thrall", "weeping_nun"], "ossuary", F,
          "Both sides Soak: whoever lands Void first wins. Drown the nun's healed thrall, or the burst Soaks you.")
encounter(W, "drowned_f6", "The Weeping Cloister", "Guard, heal and shield.",
          ["barnacle_knight", "weeping_nun", "choirboy"], "ossuary", F,
          "A sustain wall that punishes low burst: kill the nun or the choirboy first.")
encounter(W, "drowned_f7", "The Anchor Line", "Knocked back, dragged forward, latched.",
          ["anchor_brute", "eelkin", "hookline"], "stair", F,
          "Every rank gets moved: tests formations and hands that work from any rank.")
encounter(W, "drowned_f8", "The Swollen Nave", "Two bombs and the voice that cashes them.",
          ["bloated", "bloated", "siren"], "brine_grotto", F,
          "Kill the Siren before the bursts Soak the company, or Ward the back rank against her lure.")
encounter(W, "drowned_e1", "The Sunken Door", "The Tidewarden keeps the Siren's song.",
          ["warden", "thrall", "siren"], "nave", E_,
          "The lodger Erodes rank 1 and the sweep Soaks it: Drown on the front hero unless Warded or rotated.")
encounter(W, "drowned_e2", "The Silent Chapter", "Salt sermon in a drowned chapter house.",
          ["abbess", "barnacle_knight", "weeping_nun"], "ossuary", E_,
          "She stands in front behind the knight's guard; her seal stitches a hand shut, and sermons and heals keep the chapter up.")
encounter(W, "drowned_e3", "The Breach", "The floor gives way to something enormous.",
          ["kraken_arm", "eelkin", "lamprey"], "stair", E_,
          "The arm fills the front; grabbed heroes are dragged to rank 1 under it, with two latchers behind, and stay held until they strike the arm.")
encounter(W, "drowned_e4", "The Pearl Beds", "The diver goes for the back; the fisher reels the rest forward.",
          ["pearl_diver", "barnacle_knight", "hookline"], "ossuary", E_,
          "The diver's knife hits the rearmost twice: Block the back ranks while the fisher reels heroes out of place.")
encounter(W, "drowned_r_drowned_king", "The Drowned King", "The king on his throne, and his court.",
          ["barnacle_knight", "thrall", "drowned_king"], "throne", R,
          "Kill the court before phase 3 or he eats it; Drown him on a decree turn to blank it.")
encounter(W, "drowned_r_bell_below", "The Bell Below", "The bell that rings for the drowned, and its choir.",
          ["bellringer", "choirboy", "bell_below"], "throne", R,
          "Three voices; the bell punishes many small hits, so big single blows carry this fight.")
encounter(W, "drowned_r_mother_of_brine", "Mother of Brine", "The harbour midwife and her daughters.",
          ["siren", "siren", "mother_of_brine"], "throne", R,
          "Every rank she empties fills with daughters; each kill costs the company stress.")

# ================================================================== world cards (Drown)
card("w_drowned_undertow", "Undertow", 1, "W", "enemy",
     [D(2, per="t.water", k=1), A("void", 1, attr="volatile")],
     "Deal 2, plus 1 per Water on the foe. Apply 1 Volatile Void.",
     cat="void", attr="volatile", world=W, arch="world",
     flavour="The sea does not strike. It waits for you to breathe in.",
     note="A drowned thrall in the nave, a clean black hole opening in the water around its chest.",
     up={"text": "Deal 3, plus 1 per Water on the foe. Apply 2 Volatile Void.",
         "fx": [D(3, per="t.water", k=1), A("void", 2, attr="volatile")]})
card("w_drowned_wring_out", "Wring Out", 1, "W", "ally",
     [CONS(e="water"), B(1, per="consumed", k=2)],
     "Remove all Water from a hero. They gain 1 Block, plus 2 per Water removed.",
     cat="water", world=W, arch="world",
     flavour="Wring out your cloak. Wring out your lungs. Keep moving.",
     note="A hero on the flooded stair twisting seawater out of a sodden cloak.",
     up={"text": "Remove all Water from a hero. They gain 4 Block, plus 2 per Water removed.",
         "fx": [CONS(e="water"), B(4, per="consumed", k=2)]})
card("w_drowned_bells_silent", "The Bells Fall Silent", 1, "W", "all_allies",
     [STRESS(0, per="reactions", k=-3), STRESS(-3, if_="vigour_left>=2")],
     "Every hero sheds 3 stress per Conjunction set off this round. If 2 or more vigour is left unspent this round, "
     "every hero sheds 3 more.",
     world=W, arch="world",
     flavour="For one breath the belfry is quiet. Take it.",
     note="The company in the belfry, the great bell hanging still and silent above them.",
     up={"text": "Every hero sheds 4 stress per Conjunction set off this round. If 2 or more vigour is left unspent "
                 "this round, every hero sheds 4 more.",
         "fx": [STRESS(0, per="reactions", k=-4), STRESS(-4, if_="vigour_left>=2")]})
card("w_drowned_deep_pressure", "Deep Pressure", 1, "W", "enemy",
     [D(3), DBL(e="water")],
     "Deal 3. Double the Water on the foe.",
     cat="water", world=W, arch="world",
     flavour="Every fathom down, the water weighs twice as much.",
     note="A Barnacle Knight pressed to its knees by black water pouring through the nave roof.",
     up={"text": "Deal 5. Double the Water on the foe.", "fx": [D(5), DBL(e="water")]})

NEEDS = [
    "drowned_king Gorge on the Court / mother_of_brine Eat Her Own: should kill a living ally and heal by its HP; "
    "written as a plain heal gated on allies>=2.",
    "abbess Seal the Door: should shut one hero's kit skill for a round; written as a Sewn Shut curse (1 vigour to clear) and stress.",
    "kraken_arm Held Fast: any hero's hit on the arm should free the grabbed hero; written as the hitter's own "
    "Anchor ending.",
    "eelkin Latched: the bitten hero's Bleed should end when any hero hits the Biter or the bitten hero moves; written "
    "as the hitter's own Bleed ending.",
]
