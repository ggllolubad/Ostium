"""World XIV: The Blighted Garden (toxin + void, Blight). Role map: docs/design/gate2/world_XIV_blighted_garden.md.
Bible: art/party/bible/world_XIV_blighted_garden.md and RIVAL_RULERS.md. Base numbers at Threat 0."""
from dsl import *
from creatures import *

WARD = W  # the Ward helper; W is the world key below
W = "garden"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

# Blight on a hero (no healing): a Stable Toxin, then a Volatile Erode that sets it off.
def BLIGHT(n=1):
    return [A("toxin", n, attr="stable"), A("void", n, attr="volatile")]

ROT = {"toxin": "resist", "fire": "weak"}

# ================================================================== the Fool's card
card("t_garden_fools_spore", "Fool's Spore", 0, "Curse", "none", [],
     "Unplayable. When drawn, deal 5 to each hero beside you. Temporary.",
     kw=["Unplayable", "Temporary"], on_draw=[D(5, to="adjacent")],
     flavour="The rot thinks he is very funny.",
     note="A hero's arm swings wide in a puff of pale-yellow spore and strikes the companion beside them.")

# ================================================================== rulers
creature("root_horror", "Root Horror", "foe", 40, armor=1, ranks=[1], role="attacker", resist=ROT,
         intents={
             "grasp": I("Root Grasp", "attack", "back", [D(5), ST("anchor", 2)]),
             "maw": I("Ring Mouth", "attack", "front", [D(10)]),
             "ring": I("Thorn Ring", "attack", "front2", [D(5)]),
         },
         ai=[{"use": "grasp", "every": 3}, {"use": "ring", "every": 3, "offset": 1}, {"use": "maw"}],
         lore="The garden's roots grew a mouth.",
         world=W)

creature("antlered_mother", "The Antlered Mother", "ruler", 300, armor=2, span=2, ranks=[3, 4], role="support",
         resist={"toxin": "immune", "void": "resist", "fire": "weak"},
         intents={
             "gore": I("Gore", "attack", "front", [D(14)]),
             "bloom": I("Blight Bloom", "attack", "all_heroes", [D(3), A("toxin", 1, attr="stable"), A("void", 1, attr="stable")]),
             "exhale": I("Spore Exhalation", "debuff", "all_heroes", BLIGHT(1)),
             "renew": I("Renewal", "heal", "all_allies", [H(10)]),
             "gaze": I("Hundred Eyes", "debuff", "all_heroes", [STRESS(8)]),
             "roots": I("Her Roots Rise", "summon", "self", [SUMMON("root_horror", max=2)]),
             "rot": I("The Fungus Blooms", "attack", "all_heroes", [D(4)] + BLIGHT(1) + [A("void", 2, attr="stable")]),
         },
         ai=[{"use": "renew", "if": "hp_pct<80", "every": 3}, {"use": "bloom", "every": 3, "offset": 1},
             {"use": "exhale", "every": 4, "offset": 2}, {"use": "gore"}],
         phases=[
             P(55, "All her eyes open.", might=1,
               ai=[{"use": "roots", "every": 4, "offset": 1}, {"use": "bloom", "every": 3},
                   {"use": "gore", "every": 3, "offset": 1}, {"use": "gaze"}]),
             P(20, "The fungus takes her whole. She stops healing herself.", might=2,
               ai=[{"use": "rot", "every": 2}, {"use": "gore"}]),
         ],
         traits=[T("round_start", "The Garden's Heart", "Round start: above a fifth of her HP she regrows 8, unless she is Burning.",
                   [H(8, if_="!fire&hp_pct>20")])],
         lore="The garden's heart: a great stag grown through with fungus and eyes. She is the garden now.",
         world=W)

creature("flower_strewer", "Flower-Strewer", "foe", 28, ranks=[3, 4], role="support", resist=ROT,
         intents={
             "petals": I("Strew Petals", "buff", "ally_lowest", [ST("regen", 4)]),
             "path": I("Strew the Path", "buff", "all_allies", [ST("regen", 2)]),
             "fling": I("A Flung Handful", "attack", "random", [D(3), A("toxin", 1, attr="stable"), A("void", 1, attr="stable")]),
             "skip": I("Skip Away", "defend", "self", [SELF("dodge", 1)]),
         },
         ai=[{"use": "petals", "if": "total_bleed>=4", "not_twice": True}, {"use": "petals", "if": "ally_hurt", "not_twice": True},
             {"use": "skip", "if": "hp_pct<50", "not_twice": True}, {"use": "path", "every": 4}, {"use": "fling"}],
         lore="She strewed petals for the lady to walk on. The lady has not walked in a long time.",
         world=W)

creature("lady_of_the_bower", "The Lady of the Bower", "ruler", 270, armor=2, span=2, ranks=[3, 4], role="afflicter",
         charge_name="Open Blooms", resist={"toxin": "resist", "void": "resist", "fire": "weak"},
         intents={
             "sigh": I("A Sigh of Pollen", "debuff", "all_heroes", [A("toxin", 1, attr="stable"), A("void", 1, attr="stable"), STRESS(4)]),
             "sleep": I("The Sleeping Spore", "debuff", "back2", [ST("stun", 1)]),
             "canes": I("Rose Canes", "attack", "front", [D(12)]),
             "palm": I("Blown Across the Palm", "attack", "all_heroes", [D(4), A("toxin", 1, attr="stable")]),
             "strewer": I("Call the Strewer", "summon", "self", [SUMMON("flower_strewer", max=2)]),
             "spring": I("Spring Keeps Coming", "buff", "all_allies", [ST("regen", 3)]),
         },
         ai=[{"use": "sleep", "every": 3}, {"use": "sigh", "every": 3, "offset": 1}, {"use": "canes"}],
         phases=[
             P(50, "She rises on her elbow. Spring keeps coming.", might=1,
               ai=[{"use": "strewer", "every": 4}, {"use": "spring", "every": 3, "offset": 1},
                   {"use": "sleep", "every": 3, "offset": 2}, {"use": "palm"}]),
             P(20, "She sits up in the bower, wide awake.", might=1,
               ai=[{"use": "sleep", "every": 2}, {"use": "palm"}]),
         ],
         traits=[T("round_start", "The Bed Blooms", "Round start: a bloom opens on the bed unless she is Burning; fire burns every open bloom away. She gains 1 Regen per open bloom.",
                   [CLR("charge", if_="fire>0"), SELF("charge", 1, if_="!fire"), SELF("regen", 0, per="charge", k=1)])],
         lore="She lay down in her bower to wait for spring. It came, and it has not stopped coming.",
         world=W)

creature("green_lion", "The Green Lion", "ruler", 290, armor=3, span=2, ranks=[1, 2], role="attacker",
         resist={"toxin": "resist", "void": "resist", "fire": "weak"},
         intents={
             "swipe": I("Thorn Claws", "attack", "front2", [D(8)]),
             "mane": I("Smoking Mane", "debuff", "all_heroes", [A("toxin", 2, attr="stable")]),
             "bite": I("Stake Teeth", "attack", "front", [D(15)]),
             "bristle": I("Shed Clippings", "defend", "self", [B(12), SELF("thorns", 3)]),
             "double": I("Swipe and Swipe Again", "attack", "front2", [D(6, times=2)]),
             "roar": I("Spore Roar", "attack", "all_heroes", [D(3)] + BLIGHT(1)),
         },
         ai=[{"use": "bristle", "every": 4, "offset": 3}, {"use": "mane", "every": 2}, {"use": "bite", "every": 4, "offset": 1},
             {"use": "swipe"}],
         phases=[
             P(50, "Clipped through. The holes widen and the shears in its flank show.", fx=[LOSE_ARMOR(3), SELF("vulnerable", 2)],
               ai=[{"use": "double", "every": 2}, {"use": "roar", "every": 3, "offset": 1}, {"use": "bite"}]),
             P(20, "The rot takes the frame. It stops pretending to be a hedge.", might=2,
               ai=[{"use": "roar", "every": 3}, {"use": "double"}]),
         ],
         traits=[T("round_start", "Grown Back", "Round start: it regains 10 HP unless it is Burning.", [H(10, if_="!fire")])],
         lore="Clipped into a lion for her pleasure. The rot gave it a mind. It has kept the shape, and grown the teeth.",
         world=W)

# ================================================================== elites
creature("fungal_husk", "Fungal Husk", "foe", 32, ranks=[1, 2], role="afflicter", personality="mindless",
         resist={"toxin": "immune", "fire": "weak"},
         intents={
             "lurch": I("Lurch", "attack", "front", [D(8)]),
             "burst": I("Spore Burst", "debuff", "all_heroes", [A("toxin", 1, attr="stable")]),
             "cough": I("Spore Cough", "attack", "rank2", [D(4), A("toxin", 2, attr="stable")]),
         },
         ai=[{"use": "burst", "every": 3}, {"use": "cough", "every": 3, "offset": 1}, {"use": "lurch"}],
         traits=[T("death", "Bursts", "On death: it bursts; every hero gains 1 Toxin.", [A("toxin", 1, attr="stable", to="all_enemies")])],
         lore="A gardener the mushrooms grew into.",
         world=W)

creature("the_gardener", "The Gardener", "elite", 115, armor=3, ranks=[2], role="support",
         resist={"toxin": "resist", "void": "resist", "physical": "resist", "fire": "weak"},
         intents={
             "shear": I("Pruning Shears", "attack", "front", [D(11), STEAL()]),
             "tend": I("Tend the Garden", "heal", "all_allies", [H(8)]),
             "sow": I("Sow Blight", "debuff", "all_heroes", [A("toxin", 1, attr="stable"), A("void", 1, attr="stable")]),
             "deadhead": I("Deadhead", "attack", "back", [D(9), ST("vulnerable", 1)]),
         },
         ai=[{"use": "tend", "if": "ally_hurt75", "not_twice": True}, {"use": "sow", "every": 3},
             {"use": "deadhead", "every": 3, "offset": 2}, {"use": "shear"}],
         traits=[T("ally_death", "Sprout", "When an ally falls, its rank sprouts a Fungal Husk (once a fight).",
                   [SUMMON("fungal_husk", max=1)])],
         lore="He keeps the garden. He prunes what grows wrong. You are growing wrong.",
         world=W)

creature("blight_dryad", "Blight Dryad", "elite", 105, armor=2, ranks=[2, 3], role="afflicter",
         resist={"toxin": "immune", "void": "resist", "fire": "weak"},
         intents={
             "roots": I("Roots Burst", "attack", "back", [D(6), ST("anchor", 2), A("toxin", 2, attr="stable")]),
             "claws": I("Bark Claws", "attack", "front", [D(6, times=2)]),
             "heart": I("Hollow Heartwood", "attack", "weakest", [D(5)] + BLIGHT(1)),
             "root": I("Take Root", "defend", "self", [B(12), SELF("regen", 4)]),
         },
         ai=[{"use": "root", "if": "hp_pct<50", "not_twice": True}, {"use": "roots", "every": 3},
             {"use": "heart", "every": 3, "offset": 1}, {"use": "claws"}],
         traits=[T("round_start", "Dead Oak", "Round start: below half HP she gains 3 Regen, unless she is Burning.",
                   [SELF("regen", 3, if_="hp_pct<50&!fire")])],
         lore="She was the spirit of an oak. The oak is dead. She is not.",
         world=W)

creature("ladys_fool", "The Lady's Fool", "elite", 95, armor=2, ranks=[2, 3], role="afflicter", resist=ROT,
         intents={
             "slap": I("Bauble Slap", "attack", "random", [D(6), ADD("t_garden_fools_spore")]),
             "jig": I("Puffball Jig", "debuff", "all_heroes", [A("toxin", 1, attr="stable"), STRESS(5)]),
             "caper": I("Cartwheel Away", "defend", "self", [B(8), SELF("dodge", 1)]),
             "slapstick": I("Slapstick", "attack", "front", [D(11)]),
         },
         ai=[{"use": "caper", "if": "hp_pct<50", "not_twice": True}, {"use": "slap", "every": 2},
             {"use": "jig", "every": 3, "offset": 1}, {"use": "slapstick"}],
         traits=[T("hit", "Puffball Bells", "A hero who strikes him gains 1 Toxin.", [A("toxin", 1, attr="stable")])],
         lore="She kept him to make her laugh. The rot thinks he is very funny.",
         world=W)

creature("truffle_boar", "The Truffle Boar", "elite", 125, armor=3, ranks=[1], role="attacker",
         resist={"toxin": "resist", "physical": "resist", "fire": "weak"},
         intents={
             "charge": I("Tusking Charge", "attack", "front", [D(12), A("toxin", 2, attr="stable")]),
             "plough": I("Snout Plough", "attack", "front", [D(10, pierce=True)]),
             "trample": I("Trample", "attack", "front2", [D(7)]),
             "root": I("Root for Truffles", "buff", "self", [H(10), SELF("might", 1)]),
         },
         ai=[{"use": "root", "if": "hp_pct<50", "not_twice": True}, {"use": "plough", "every": 3},
             {"use": "trample", "every": 3, "offset": 1}, {"use": "charge"}],
         traits=[T("hit", "Fungal Crest", "A hero who strikes it gains 1 Toxin.", [A("toxin", 1, attr="stable")])],
         lore="It was kept to find the truffles. It found all of them. It ate all of them.",
         world=W)

# ================================================================== foes
creature("spore_deer", "Spore Deer", "foe", 36, ranks=[1], role="attacker", resist=ROT,
         intents={
             "antler": I("Antler Rake", "attack", "front", [D(9)]),
             "shake": I("Shake the Spores", "debuff", "all_heroes", [A("toxin", 1, attr="stable"), STRESS(4)]),
             "bolt": I("Bolt", "defend", "self", [B(6), SELF("dodge", 1)]),
         },
         ai=[{"use": "bolt", "if": "hp_pct<50", "not_twice": True}, {"use": "shake", "every": 3}, {"use": "antler"}],
         lore="The fungus grows from its antlers. It is not the deer making the decisions now.",
         world=W)

creature("thorn_knight", "Thorn Knight", "foe", 48, armor=2, ranks=[1], role="defender",
         resist={"toxin": "resist", "physical": "resist", "fire": "weak"},
         intents={
             "briar": I("Briar Guard", "defend", "self", [B(10), SELF("thorns", 2)]),
             "blade": I("Thorn Blade", "attack", "front", [D(8), ST("bleed", 2)]),
             "hedge": I("Hedge Wall", "defend", "all_allies", [B(5)]),
         },
         ai=[{"use": "hedge", "if": "ally_hurt", "not_twice": True}, {"use": "briar", "every": 3}, {"use": "blade"}],
         traits=[T("hit", "Briars", "A hero who strikes it takes 2 from the briars, every hit.", [D(2)])],
         lore="Sworn to guard the garden. The garden grew through his armour.",
         world=W)

creature("moth_witch", "Moth Witch", "foe", 30, ranks=[3, 4], role="afflicter",
         resist={"void": "resist", "physical": "weak"},
         intents={
             "eyes": I("The Eyes Blink", "debuff", "back", [STRESS(10)]),
             "dust": I("Void Dust", "debuff", "all_heroes", [A("void", 1, attr="stable")]),
             "flit": I("Flit", "defend", "self", [SELF("dodge", 1)]),
         },
         ai=[{"use": "flit", "if": "hp_pct<50", "not_twice": True}, {"use": "eyes", "every": 2}, {"use": "dust"}],
         lore="The eyes on her wings are real. They blink.",
         world=W)

creature("scarecrow", "Scarecrow", "foe", 38, ranks=[1, 2], role="afflicter", resist=ROT,
         intents={
             "club": I("Crossbar Club", "attack", "front", [D(8)]),
             "frighten": I("Put Up to Frighten", "debuff", "front", [STRESS(8)]),
             "lurch": I("Lurch on the Pole", "attack", "front2", [D(5)]),
         },
         ai=[{"use": "frighten", "every": 2}, {"use": "lurch", "every": 3, "offset": 1}, {"use": "club"}],
         lore="It was put up to frighten the birds. The rot put something in the straw.",
         world=W)

creature("blight_snails", "Blight Snails", "foe", 34, ranks=[2, 3], role="afflicter",
         resist={"toxin": "resist", "void": "resist", "fire": "weak"},
         intents={
             "slide": I("Slide Over", "attack", "weakest", [D(3)] + BLIGHT(1)),
             "trail": I("Slime Trail", "debuff", "front2", [A("toxin", 1, attr="stable"), A("void", 1, attr="stable")]),
             "withdraw": I("Into the Shell", "defend", "self", [B(9)]),
         },
         ai=[{"use": "withdraw", "if": "hp_pct<50", "not_twice": True}, {"use": "slide", "every": 2}, {"use": "trail"}],
         traits=[T("round_start", "Shells", "Round start: it gains 5 Block; the first blow each round glances off a shell.", [B(5)])],
         lore="Slow. Very slow. They have all the time the garden has.",
         world=W)

creature("mole_catcher", "Mole-Catcher", "foe", 38, ranks=[2], role="attacker", resist=ROT,
         intents={
             "stab": I("Spade Stab", "attack", "front", [D(6), PUSH(1), ST("vulnerable", 1)]),
             "trap": I("Mole Trap", "attack", "rank2", [D(5), ST("anchor", 2)]),
             "tally": I("String of Moles", "attack", "front", [D(9)]),
         },
         ai=[{"use": "stab", "every": 2}, {"use": "trap", "every": 3, "offset": 1}, {"use": "tally"}],
         lore="He was paid a penny a mole. The moles have stopped dying.",
         world=W)

creature("pond_swan", "Pond Swan", "foe", 44, armor=1, ranks=[1], role="defender",
         resist={"toxin": "resist", "void": "resist", "fire": "weak"},
         intents={
             "lunge": I("Lunge and Beat", "attack", "front", [D(7), PUSH(1)]),
             "hiss": I("Hiss", "defend", "self", [B(6), GUARD(to="behind")]),
             "wings": I("Wing Buffet", "attack", "front2", [D(5)]),
         },
         ai=[{"use": "hiss", "if": "ally_hurt", "not_twice": True}, {"use": "lunge", "every": 2}, {"use": "wings"}],
         lore="The swans were the lady's. They still bite anyone who is not.",
         world=W)

creature("orchard_picker", "Orchard Picker", "foe", 36, ranks=[2, 3], role="attacker", resist=ROT,
         intents={
             "fruit": I("Rotten Fruit", "attack", "front2", [D(4), A("toxin", 1, attr="stable")]),
             "pole": I("Picking Hook", "attack", "back", [D(7), PULL(1)]),
             "ladder": I("Ladder Swing", "attack", "front", [D(9)]),
         },
         ai=[{"use": "fruit", "every": 2}, {"use": "pole", "every": 3, "offset": 1}, {"use": "ladder"}],
         lore="The fruit is ripe. It has been ripe for a very long time.",
         world=W)

creature("beekeeper", "Beekeeper", "foe", 36, ranks=[2, 3], role="afflicter", resist=ROT,
         intents={
             "skep": I("Thump the Skep", "debuff", "random", [A("toxin", 2, attr="stable"), A("void", 1, attr="stable")]),
             "smoke": I("Smoking Torch", "buff", "ally_lowest", [ST("dodge", 1)]),
             "knife": I("Honey Knife", "attack", "front", [D(8)]),
         },
         ai=[{"use": "smoke", "if": "ally_hurt", "not_twice": True}, {"use": "skep", "every": 2}, {"use": "knife"}],
         lore="The bees are gone. The skep is still full.",
         world=W)

# ================================================================== encounters
E = lambda *a, **k: encounter(W, *a, **k)
E("garden_f1", "The Overgrown Path", "Husks among the mushrooms, and roots with mouths.", ["root_horror", "fungal_husk", "fungal_husk"],
  "garden_grove", "foe", "Husks burst on death; kill them with Ward up or from the back.")
E("garden_f2", "The Deer Glade", "They graze on the spores. Something watches from the wings.", ["spore_deer", "spore_deer", "moth_witch"],
  "garden_grove", "foe", "Stress from two sides; area damage.")
E("garden_f3", "The Hedge Maze", "A knight guards the turning.", ["thorn_knight", "scarecrow", "moth_witch"],
  "garden_hedge", "foe", "Thorns punish many hits; reach rank 3.")
E("garden_f4", "The Molehills", "The ground is soft here. Too soft.", ["root_horror", "mole_catcher", "blight_snails"],
  "garden_heart", "foe", "Anchored and pushed back, then healing shut off.")
E("garden_f5", "The Lily Pond", "The swans are the lady's.", ["pond_swan", "flower_strewer", "beekeeper"],
  "garden_walk", "foe", "The strewer heals what the swan guards; burn the back.")
E("garden_f6", "The Kitchen Plot", "The fruit is ripe and the skep is full.", ["scarecrow", "orchard_picker", "beekeeper"],
  "garden_grove", "foe", "Spore on clustered heroes; spread the ranks or cleanse.")
E("garden_f7", "The Rotting Bed", "A slow place. Nothing heals here.", ["thorn_knight", "fungal_husk", "blight_snails", "moth_witch"],
  "garden_heart", "foe", "A slow grind with no healing; burst through it.")
E("garden_f8", "The Lady's Walk", "Her household is still at work.", ["pond_swan", "mole_catcher", "orchard_picker", "flower_strewer"],
  "garden_walk", "foe", "Rank chaos: heroes knocked back, dropped a rank and hooked forward.")
E("garden_e1", "The Gardener's Shed", "He is pruning.", ["fungal_husk", "the_gardener", "flower_strewer"],
  "garden_hedge", "elite", "Every fallen ally sprouts a husk; kill the Gardener first.")
E("garden_e2", "The Dead Oak", "Her oak is dead. She is not.", ["spore_deer", "blight_dryad", "moth_witch"],
  "garden_grove", "elite", "Keep fire on the Dryad or she regrows.")
E("garden_e3", "The Fool's Caper", "He has a joke for you.", ["thorn_knight", "ladys_fool", "flower_strewer"],
  "garden_walk", "elite", "His slap puts a spore in your hand that strikes a friend; spread out and plan small.")
E("garden_e4", "The Truffle Oaks", "Something has been rooting here.", ["truffle_boar", "mole_catcher", "beekeeper"],
  "garden_heart", "elite", "The boar ploughs through Block, the ground gives way; strike it and catch spore.")
E("garden_r_antlered_mother", "The Antlered Mother", "The garden's heart, with the Tooth in her antlers.",
  ["thorn_knight", "root_horror", "antlered_mother"], "garden_boss", "ruler",
  "Rank 2 refills with roots; keep her Burning to deny her regrowth.")
E("garden_r_lady_of_the_bower", "The Lady of the Bower", "She has woken enough to want her garden's heart back.",
  ["pond_swan", "flower_strewer", "lady_of_the_bower"], "garden_boss", "ruler",
  "Burn the blooms; keep the back rank awake.", props="lady_of_the_bower")
E("garden_r_green_lion", "The Green Lion", "The hedge at the gate has decided it is a lion in earnest.",
  ["green_lion", "fungal_husk", "scarecrow"], "garden_boss", "ruler",
  "Fire every round or it grows back.", props="green_lion")

# ================================================================== world cards (Blight: glue, each reads or converts state)
card("w_garden_deadhead", "Deadhead", 1, "W", "enemy", [CONS(s="regen"), D(3, per="consumed", k=1)],
     "Remove all Regen from the foe. Deal 3, plus 1 per Regen removed.", world=W, arch="world",
     flavour="He prunes what grows wrong. Learn from him.",
     note="A hero snips a swelling bloom from a foe's shoulder with the Gardener's dropped shears.",
     up={"text": "Remove all Regen from the foe. Deal 4, plus 2 per Regen removed.",
         "fx": [CONS(s="regen"), D(4, per="consumed", k=2)]})
card("w_garden_take_the_rot", "Take the Rot Out", 1, "W", "enemy", [D(3), TRANSFER(frm="ally_most")],
     "Deal 3. Move every ailment from the hero who carries the most onto the foe.", world=W, arch="world",
     flavour="The garden gives. Give it back.",
     note="A hero presses a palm to a foe's bark; spore and black dust crawl off a companion and onto it.",
     up={"text": "Deal 5. Move every ailment from the hero who carries the most onto the foe.",
         "fx": [D(5), TRANSFER(frm="ally_most")]})
card("w_garden_blight_seed", "Blight Seed", 1, "W", "enemy", [D(3), A("void", 2, attr="volatile", if_="t.toxin>0")],
     "Deal 3. If the foe has Toxin, apply 2 Volatile Void.", cat="void", attr="volatile", world=W, arch="world",
     flavour="Where the seed lands, nothing grows back. Not even the rot.",
     note="A hero thumbs a black seed into a spore-swollen wound; the bark around it goes grey and still.",
     up={"text": "Deal 5. If the foe has Toxin, apply 3 Volatile Void.",
         "fx": [D(5), A("void", 3, attr="volatile", if_="t.toxin>0")]})
card("w_garden_nothing_regrows", "Nothing Regrows", 1, "W", "none", [],
     "Rite. Whenever the company sets off a Conjunction, that foe loses all its Block and Regen. Exhaust.",
     kw=["Rite", "Exhaust"], world=W, arch="world",
     rite={"on": "conjunction", "fx": [CONS(s="block"), CONS(s="regen")]},
     flavour="The blooms open, and the eyes turn toward you. Close them.",
     note="The company stands in a ring of grey, dead loam; the hedge around them has stopped growing.",
     up={"text": "Retain. Rite. Whenever the company sets off a Conjunction, that foe loses all its Block and Regen. Exhaust.",
         "kw": ["Rite", "Exhaust", "Retain"]})

NEEDS = [
    "antlered_mother, blight_dryad: a 'blight' quantity for 'regrows unless Blighted'; both are toxin-immune (made of the rot), so the company cannot Blight them anyway. Written as 'unless Burning'.",
    "ladys_fool: the slapped hero's next action should strike an ally (TURN on a hero); written as a Temporary curse that hits the heroes beside the drawer.",
    "the_gardener: 'Pruning Shears' should strip one buff (any helpful status); written as taking the hero's Block.",
    "blight_snails: the first hit each round should glance off (reduced); written as 5 Block at round start.",
    "orchard_picker: 'Rotten Fruit' should burst on the target and its neighbours; written as the two front heroes.",
    "lady_of_the_bower: in phase 2 every open bloom should also give Regen to each foe; written as a separate Regen move.",
    "green_lion: 'regrows unless it took fire damage last round'; written as 'unless Burning'. Its shears weak point is written as 2 rounds of Vulnerable when phase 2 opens.",
]
