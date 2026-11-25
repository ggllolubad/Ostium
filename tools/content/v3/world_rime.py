"""World VIII: The Sundered Rime (fire + frost, Thermal Shock). Role map: docs/design/gate2/world_VIII_sundered_rime.md.
Bible: art/party/bible/world_VIII_sundered_rime.md. Base numbers at Threat 0.

Several foes land both halves of a Thermal Shock themselves over two turns, shown by a charge counter, so Ward,
Swap and delay answer them. Most bodies resist fire and frost; water, physical and the missing half are the cracks."""
from dsl import *
from creatures import *
WARD = W  # dsl's Ward helper; W below is the world key
W = "rime"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])
FI, F, WA = "fire", "frost", "water"
BOTH = {FI: "resist", F: "resist"}

# ================================================================== world cards (Thermal Shock; any calling)
card("w_rime_fire_setting", "Fire-Setting", 1, "W", "enemy", [D(2), A(FI, 2, attr="stable"), REACT(1, if_="t.frost>0")],
     "Deal 2. Apply 2 Fire. If the target has Frost, Conjoin it.", cat=FI, world=W, arch="world",
     up={"text": "Deal 3. Apply 3 Fire. If the target has Frost, Conjoin it.",
         "fx": [D(3), A(FI, 3, attr="stable"), REACT(1, if_="t.frost>0")]},
     flavour="Stack the fire against the stone, then the cold water. The rock does the rest.",
     note="A hero drives a burning bundle into a rimed Thrall; the ice on its back cracks orange.")
card("w_rime_wedge_and_feather", "Wedge and Feather", 1, "W", "enemy",
     [D(3, per="t.armor", k=1), A(F, 1, attr="stable")],
     "Deal 3, plus 1 per Armor the target has. Apply 1 Frost.", world=W, arch="world",
     up={"text": "Deal 4, plus 2 per Armor the target has. Apply 1 Frost.",
         "fx": [D(4, per="t.armor", k=2), A(F, 1, attr="stable")]},
     flavour="Iron wedges, iron feathers, and a mallet. Every plate has a seam.",
     note="A hero hammers an iron wedge into the seam of a Shieldmaiden's obsidian plate.")
card("w_rime_shield_wall", "Shield Wall", 1, "W", "ally_other", [GUARD(), B(1, per="t.ailments", k=1)],
     "Guard another hero this round. It gains 1 Block, plus 1 per ailment stack on it.", world=W, arch="world",
     up={"text": "Guard another hero this round. It gains 3 Block, plus 1 per ailment stack on it.",
         "fx": [GUARD(), B(3, per="t.ailments", k=1)]},
     flavour="The hold's shieldmaidens stood rim to rim. The glass cut them as well.",
     note="A hero steps in front of a burning companion, shield up against the steam.")
card("w_rime_the_glacier_splits", "The Glacier Splits", 2, "W", "all_enemies",
     [D(1, per="t.armor", k=1), A(F, 1, attr="volatile")],
     "Deal 1 to every foe, plus 1 per Armor it has. Apply 1 Volatile Frost to every foe.", cat=F, world=W,
     arch="world",
     up={"text": "Deal 2 to every foe, plus 1 per Armor it has. Apply 1 Volatile Frost to every foe.",
         "fx": [D(2, per="t.armor", k=1), A(F, 1, attr="volatile")]},
     flavour="The miners dug down and met the fire coming up. The glacier split between.",
     note="A crack runs the length of the glacier floor under the foes, steam bursting through.")

# ================================================================== foes
creature("rime_thrall", "Rimeburnt Thrall", "foe", 36, armor=1, ranks=[1], world=W, role="attacker",
         resist={F: "resist", FI: "weak"},
         intents={"pick": I("Ice Pick", "attack", "front", [D(9)]),
                  "chip": I("Chip Away", "attack", "front", [D(5), ST("vulnerable", 1)]),
                  "shiver": I("Shiver", "debuff", "back", [A(F, 2, attr="stable")])},
         ai=[{"use": "chip", "every": 3}, {"use": "shiver", "every": 3, "offset": 1}, {"use": "pick"}],
         lore="Miners who dug too deep and met the fire coming up. The ice kept what the fire left.")
creature("magma_hound", "Magma Hound", "foe", 34, armor=1, ranks=[1, 2], world=W, role="attacker",
         resist={FI: "immune", F: "weak"},
         intents={"bite": I("Burning Bite", "attack", "front", [D(6), A(FI, 2, attr="stable")]),
                  "lunge": I("Lunge", "attack", "back", [D(8)]),
                  "howl": I("Steam Howl", "debuff", "all_heroes", [STRESS(5)])},
         ai=[{"use": "lunge", "if": "round==1"}, {"use": "howl", "every": 4, "offset": 2}, {"use": "bite"}],
         lore="Its skin is cooling rock. Its insides are not.")
creature("obsidian_maiden", "Obsidian Shieldmaiden", "foe", 44, armor=2, ranks=[1], world=W, role="defender",
         resist={"physical": "resist", FI: "resist", WA: "weak"},
         intents={"wall": I("Shield Wall", "defend", "all_allies", [B(6)]),
                  "cut": I("Glass Edge", "attack", "front", [D(7), ST("bleed", 2)]),
                  "bash": I("Shield Bash", "attack", "front", [D(6), PUSH(1)])},
         ai=[{"use": "wall", "if": "ally_hurt", "not_twice": True}, {"use": "bash", "every": 3}, {"use": "cut"}],
         traits=[T("hit", "Glass Edges", "A hero who hits her is cut by the glass: it takes 2.", [D(2)])],
         lore="Her armour is the volcano's glass. It cuts her as often as it cuts you.")
creature("steam_wraith", "Steam Wraith", "foe", 30, ranks=[2, 3], world=W, role="afflicter",
         resist={FI: "resist", F: "resist", "physical": "resist", "lightning": "weak"},
         intents={"scald": I("Scalding Embrace", "attack", "front", [D(6), A(FI, 2, attr="stable")]),
                  "breath": I("Breath of the Deep Ice", "debuff", "all_heroes", [A(F, 1, attr="stable"), STRESS(4)]),
                  "fade": I("Dissipate", "defend", "self", [me("dodge", 2)])},
         ai=[{"use": "fade", "if": "hp_pct<50", "not_twice": True}, {"use": "breath", "every": 2}, {"use": "scald"}],
         lore="What rises when fire meets ice. It remembers being a man.")
creature("fissure_worm", "Fissure Worm", "foe", 40, armor=1, ranks=[3, 4], world=W, role="attacker",
         resist={F: "resist", "physical": "weak"},
         intents={"burst": I("Burst from the Ice", "attack", "back", [D(12)]),
                  "gnaw": I("Gnaw", "attack", "back2", [D(3, times=2), ST("bleed", 1)]),
                  "burrow": I("Burrow", "defend", "self", [B(10)])},
         ai=[{"use": "burst", "if": "round==1"}, {"use": "burrow", "if": "hp_pct<50", "not_twice": True},
             {"use": "burst", "every": 4}, {"use": "gnaw"}],
         lore="It swims through glacier like water. The ice closes behind it.")
creature("fire_setter", "Fire-Setter", "foe", 34, ranks=[2], world=W, role="afflicter", charge_name="Kindling",
         resist=dict(BOTH, toxin="weak"),
         intents={"bundle": I("The Burning Bundle", "attack", "back", [D(5), A(FI, 3, attr="stable"), SELF("charge", 1)]),
                  "bucket": I("The Bucket Thrown After", "attack", "back",
                              [D(3), A(F, 2, attr="volatile"), CLR("charge")]),
                  "fork": I("Iron Fork", "attack", "front", [D(8)])},
         # two turns, one crack: the rear hero burns, then the bucket follows. Swap or Ward in between.
         ai=[{"use": "bucket", "if": "charge>=1"}, {"use": "bundle", "every": 3}, {"use": "fork"}],
         lore="The miners split rock with fire, then cold water. The mountain learned the trick from them.")
creature("skald", "The Skald", "foe", 32, ranks=[3, 4], world=W, role="afflicter", charge_name="Verse",
         resist=dict(BOTH, void="weak"),
         intents={"verse": I("Another Verse", "debuff", "all_heroes", [STRESS(4), SELF("charge", 1)]),
                  "last": I("The Last Verse", "debuff", "all_heroes", [STRESS(9), CLR("charge")]),
                  "saga": I("The Saga of the Hold", "buff", "all_allies", [ST("might", 1)])},
         ai=[{"use": "last", "if": "charge>=3"}, {"use": "saga", "every": 3, "offset": 1}, {"use": "verse"}],
         lore="He kept the hold's saga in his head. He is adding the last verse.")
creature("mead_bearer", "Mead-Bearer", "foe", 32, ranks=[2, 3], world=W, role="support",
         resist={F: "resist", FI: "weak"},
         intents={"horn": I("The Horn", "heal", "ally_lowest", [H(8), ST("empower", 4)]),
                  "pour": I("Fill the Horns", "heal", "all_allies", [H(4)]),
                  "keys": I("Storeroom Keys", "defend", "ally_front", [B(8)]),
                  "shelter": I("Step Back", "defend", "self", [B(8), me("dodge", 1)])},
         ai=[{"use": "shelter", "if": "hp_pct<50", "not_twice": True}, {"use": "horn", "every": 2},
             {"use": "pour", "every": 3}, {"use": "keys"}],
         lore="She filled the horns at the jarl's table. The mead boils in the horn and freezes on the lip.")
creature("ore_hauler", "Ore-Hauler", "foe", 48, armor=2, ranks=[1], world=W, role="attacker", charge_name="Strain",
         resist={F: "resist", WA: "weak"},
         intents={"lean": I("Lean into the Harness", "charge", "self", [SELF("charge", 1), B(6)]),
                  "swing": I("Heave the Sledge Round", "attack", "front2", [D(6), A(FI, 2, attr="stable"), CLR("charge")]),
                  "barge": I("Shoulder Barge", "attack", "front", [D(8)])},
         ai=[{"use": "swing", "if": "charge>=1"}, {"use": "lean", "every": 3}, {"use": "barge"}],
         traits=[T("death", "The Load Spills", "When he falls, the burning ore spills over the two front heroes: 3 Fire each.",
                   [A(FI, 3, attr="stable", to="front2")])],
         lore="Thralls hauled the ore up from the deep shaft. The last load came up burning.")
creature("snow_hare", "Snow Hare", "foe", 28, ranks=[3, 4], world=W, role="afflicter", charge_name="Listening",
         resist=dict(BOTH, physical="weak"),
         intents={"listen": I("Listen", "charge", "self", [SELF("charge", 1), me("dodge", 1)]),
                  "drum": I("Drum the Ice", "attack", "random", [A(FI, 2, attr="stable"), A(F, 1, attr="volatile"), CLR("charge")]),
                  "kick": I("Hind Kick", "attack", "back", [D(6)])},
         # a Marked hare bolts and listens: Mark setups lose a round on it
         ai=[{"use": "drum", "if": "charge>=1"}, {"use": "listen", "if": "mark>0"}, {"use": "listen", "every": 2},
             {"use": "kick"}],
         lore="It came down off the glacier for the moss the vents had thawed. It was there when the ice broke.")
creature("pit_adder", "Pit Adder", "foe", 30, ranks=[2], world=W, role="attacker", charge_name="Venom",
         resist={FI: "resist", F: "weak"},
         intents={"bite": I("The Bite Burns", "attack", "front", [D(5), ST("bleed", 2), A(FI, 2, attr="stable"), SELF("charge", 1)]),
                  "cold": I("Then Freezes", "attack", "front", [D(4), A(F, 2, attr="volatile"), CLR("charge")]),
                  "coil": I("Coil", "defend", "self", [B(8)])},
         ai=[{"use": "cold", "if": "charge>=1"}, {"use": "coil", "if": "hp_pct<40", "not_twice": True}, {"use": "bite"}],
         traits=[T("hit", "Coiled", "A hero who hits it is struck back: it takes 3.", [D(3)])],
         lore="The jarl threw his enemies to the adders. When the hold split, the pit split with it, and the adders came up warm.")
creature("glacier_wolverine", "Glacier Wolverine", "foe", 36, ranks=[1], world=W, role="attacker",
         resist={F: "resist", WA: "weak"},
         intents={"bite": I("Tearing Bite", "attack", "front", [D(6), ST("bleed", 3)]),
                  "lunge": I("Lunge", "attack", "rank2", [D(9)]),
                  "again": I("Back Again", "heal", "self", [H(16), me("dodge", 1)])},
         ai=[{"use": "again", "if": "hp_pct<35", "once": True}, {"use": "lunge", "every": 3}, {"use": "bite"}],
         lore="It went down the shaft for the dead and found them cooked. It keeps coming back.")

# ================================================================== elites
creature("jotun_thane", "Jötun Thane", "elite", 125, armor=3, span=2, ranks=[1, 2], world=W, role="attacker",
         resist={F: "immune", FI: "weak"},
         intents={"maul": I("Glacier Club", "attack", "front", [D(14)]),
                  "quake": I("Quake", "attack", "all_heroes", [D(5), A(F, 1, attr="stable")]),
                  "roar": I("Roar of the Thane", "debuff", "all_heroes", [STRESS(8)]),
                  # answer: the company holds back to let him melt; he braces and comes on harder
                  "brace": I("Brace", "defend", "self", [B(16), me("might", 1)])},
         ai=[{"use": "brace", "if": "hp_pct>60&round>=3", "not_twice": True}, {"use": "quake", "every": 3},
             {"use": "roar", "every": 4, "offset": 2}, {"use": "maul"}],
         traits=[T("round_start", "Melting", "At round start he loses 4 HP and gains 1 Might.",
                   [SELFDMG(4), SELF("might", 1)])],
         lore="A giant of the old ice. The fire in the deep has driven him mad with heat.")
creature("twin_seeress", "Twinflame Seeress", "elite", 90, armor=2, ranks=[3, 4], world=W, role="afflicter",
         resist=dict(BOTH, void="weak"),
         intents={"flame": I("Flame Face", "attack", "back", [D(6), A(FI, 3, attr="stable")]),
                  "rime": I("Rime Face", "attack", "front", [D(6), A(F, 3, attr="stable")]),
                  "turn": I("The Faces Turn", "debuff", "all_heroes", [A(FI, 1, attr="volatile"), A(F, 1, attr="volatile")]),
                  # answer: the company focuses one foe; she mends it
                  "mend": I("Two Voices", "heal", "ally_lowest", [H(16)])},
         ai=[{"use": "mend", "if": "ally_hurt", "not_twice": True}, {"use": "turn", "every": 3}, {"use": "rime", "every": 2},
             {"use": "flame"}],
         traits=[T("hit", "Two Faces",
                   "A hero who hits her while carrying Fire gains 1 Volatile Frost; one carrying Frost gains 1 Volatile Fire.",
                   [A(F, 1, attr="volatile", if_="t.fire>0"), A(FI, 1, attr="volatile", if_="t.frost>0")])],
         lore="One face burns. The other has frozen solid. Both speak at once.")
creature("berserker", "Berserker", "elite", 120, armor=0, ranks=[1], world=W, role="attacker",
         resist=dict(BOTH, physical="weak"),
         intents={"sweep": I("Spinning Sweep", "attack", "front2", [D(8)]),
                  "charge": I("Charge", "attack", "weakest", [D(12)]),
                  "fire": I("Into the Fire", "buff", "self", [me("might", 2), SELFDMG(6)]),
                  "howl": I("Bear's Howl", "debuff", "all_heroes", [STRESS(6)]),
                  # answer: when the company has hurt him, the wounds drive him through both front heroes
                  "gang": I("Berserkergang", "attack", "front2", [D(6, times=2)])},
         ai=[{"use": "gang", "if": "hp_pct<50", "not_twice": True}, {"use": "fire", "if": "round==2"},
             {"use": "charge", "every": 3}, {"use": "howl", "every": 4, "offset": 2}, {"use": "sweep"}],
         traits=[T("hit", "Wounds Feed Him", "Each hit he takes adds 2 to his next blow.", [SELF("empower", 2)])],
         lore="He walked into the fire on purpose. He walked out again, and kept fighting.")
creature("musk_ox", "Musk Ox", "elite", 110, armor=4, ranks=[1], world=W, role="defender",
         resist={F: "resist", "physical": "resist", FI: "weak"},
         intents={"horn": I("Horn-Boss Charge", "attack", "front", [D(11), PUSH(1)]),
                  # answer: the company's rank plan; the herd scatters it
                  "stampede": I("Stampede", "attack", "front2", [D(7), PUSH(1)]),
                  "herd": I("Close the Herd", "defend", "ally_lowest", [GUARD(), B(8)]),
                  "shake": I("Shake the Ice", "debuff", "all_heroes", [A(F, 1, attr="stable"), STRESS(5)])},
         ai=[{"use": "herd", "if": "ally_hurt", "not_twice": True}, {"use": "stampede", "every": 3},
             {"use": "shake", "every": 4, "offset": 1}, {"use": "horn"}],
         traits=[T("round_start", "Frozen Curtain", "At round start, if it has less than 3 Armor, its coat freezes again: it gains 1 Armor.",
                   [AR(1, if_="armor<3")])],
         lore="The hold yoked them to the ore sledges. The fire came up under the herd.")

# ================================================================== rulers
creature("riven_jarl", "The Riven Jarl", "ruler", 280, armor=3, span=2, ranks=[2, 3], world=W, role="attacker",
         resist={FI: "resist", F: "resist", "physical": "resist", WA: "weak"},
         intents={"cleave": I("Riven Cleave", "attack", "front2", [D(9), A(FI, 1, attr="stable"), A(F, 1, attr="stable")]),
                  "hoar": I("Hoarfrost Crown", "debuff", "all_heroes", [A(F, 2, attr="stable"), STRESS(6)]),
                  "fissure": I("Open the Fissure", "attack", "all_heroes", [D(6), A(FI, 2, attr="stable")]),
                  "shatter": I("Shatter", "attack", "back", [D(13), ST("vulnerable", 1)]),
                  "temper": I("Temper the Edge", "defend", "self", [B(18), me("might", 1)]),
                  "split": I("The Split Runs Through", "attack", "all_heroes",
                             [D(6), A(FI, 1, attr="volatile"), A(F, 1, attr="volatile")]),
                  "crack": I("Burns and Freezes", "attack", "front",
                             [D(12), A(FI, 2, attr="volatile"), A(F, 1, attr="volatile"), SELFDMG(6)])},
         ai=[{"use": "cleave", "if": "round==1"}, {"use": "temper", "if": "hp_pct<75", "once": True},
             {"use": "hoar", "every": 3}, {"use": "fissure", "every": 3, "offset": 1}, {"use": "cleave"}],
         traits=[T("round_start", "Two Halves", "Each round one half leads and turns the first course laid on him: he gains 1 Ward.",
                   [WARD(1, to="self")])],
         phases=[P(66, "The frozen half cracks away. Fire pours out.",
                   ai=[{"use": "split", "every": 4}, {"use": "fissure", "every": 2}, {"use": "shatter"}], might=1),
                 P(25, "He burns and freezes at once.",
                   ai=[{"use": "split", "every": 3}, {"use": "crack"}], might=1)],
         lore="Half his body froze in the fall, half burned. He rules the split between.")
creature("sleeper_under_the_hold", "The Sleeper Under the Hold", "ruler", 300, armor=3, span=2, ranks=[3, 4], world=W,
         role="summoner", flags=["immovable", "unstunnable"], charge_name="Heat",
         resist={F: "immune", FI: "weak"},
         intents={"breath": I("Slow Breath", "debuff", "all_heroes", [A(FI, 1, attr="stable"), A(F, 1, attr="stable")]),
                  "adit": I("The Adit Opens", "summon", "self", [SUMMON("rime_thrall", max=2)]),
                  "settle": I("Settle in the Ice", "defend", "self", [B(20)]),
                  "hand": I("The Hanging Hand", "attack", "front2", [D(12), A(F, 2, attr="stable")]),
                  "gust": I("Burning Gust", "attack", "all_heroes", [D(6), A(FI, 2, attr="volatile"), CLR("charge")]),
                  "deep": I("Breath of the Old Ice", "debuff", "all_heroes", [A(F, 2, attr="stable"), STRESS(5)])},
         # fire laid on her feeds the galleries (trait); at 3 Heat even the sleeper gusts
         ai=[{"use": "gust", "if": "charge>=3"}, {"use": "adit", "if": "allies<3", "not_twice": True},
             {"use": "settle", "if": "hp_pct<85", "once": True}, {"use": "breath"}],
         traits=[T("round_start", "The Galleries", "At round start, if she carries Fire, her adits glow: she gains 1 Heat.",
                   [SELF("charge", 1, if_="fire>0")])],
         phases=[P(66, "She stirs. The hand comes down.",
                   ai=[{"use": "gust", "if": "charge>=2"}, {"use": "adit", "if": "allies<2", "not_twice": True},
                       {"use": "gust", "every": 3}, {"use": "hand"}]),
                 P(33, "She wakes.",
                   ai=[{"use": "gust", "every": 2}, {"use": "deep", "every": 3}, {"use": "hand"}], might=2)],
         lore="The hold was built on the glacier, and the glacier on her. The miners found her ribs first.")
creature("firstbreaker", "The Firstbreaker", "ruler", 270, armor=3, span=2, ranks=[3, 4], world=W, role="attacker",
         flags=["immovable"],
         resist=dict(BOTH, physical="weak"),
         intents={"send": I("Send Them Down", "summon", "self", [SUMMON("rime_thrall", max=2)]),
                  "pick": I("Pick Over the Rim", "attack", "front", [D(14)]),
                  "heat": I("Heat Rolls Up", "debuff", "all_heroes", [A(FI, 2, attr="stable")]),
                  "chain": I("Hoist Chain", "attack", "back", [D(7), PULL(2)]),
                  "haul": I("Haul Higher", "defend", "self", [B(16), me("might", 1)]),
                  "double": I("Frost from the Rim, Fire from Below", "attack", "front2",
                              [D(9), A(F, 1, attr="stable"), A(FI, 1, attr="volatile")]),
                  "rise": I("Out of the Shaft", "attack", "all_heroes", [D(5), A(FI, 2, attr="stable")])},
         ai=[{"use": "send", "if": "allies<3", "not_twice": True}, {"use": "haul", "if": "hp_pct<85", "once": True},
             {"use": "chain", "every": 3}, {"use": "heat", "every": 3, "offset": 1}, {"use": "pick"}],
         traits=[T("phase", "The Rim Line", "Each time he hauls himself into a new phase, the part that comes up cracks: he loses 15 HP.",
                   [SELFDMG(15)])],
         phases=[P(66, "He hauls higher. His chest comes up into the wind.",
                   ai=[{"use": "double", "every": 2}, {"use": "chain", "every": 3}, {"use": "pick"}], might=1),
                 P(25, "He is out of the shaft, and the fire comes with him.",
                   ai=[{"use": "rise", "every": 2}, {"use": "pick"}], might=2)],
         lore="He swung the pick that let the fire in. He has been climbing out ever since.")

# ================================================================== encounters
E = lambda *a, **k: encounter(W, *a, **k)
E("rime_f1", "The Cracked Floe", "Thralls hacking at the ice. Something moves beneath it.",
  ["rime_thrall", "rime_thrall", "fissure_worm"], "rime_glacier", "foe",
  "The thralls make rank 1 Vulnerable while the worm bursts under the rear; cover the back on round 1.")
E("rime_f2", "Vent Hounds", "The hounds nest where the magma breathes. A miner tends the fire.",
  ["magma_hound", "magma_hound", "fire_setter"], "rime_crevasse", "foe",
  "The hounds Burn, the bucket quenches: Thermal Shock on the rear hero. Ward or Swap the burnt hero before the bucket.")
E("rime_f3", "The Glass Gate", "A shieldmaiden holds the hall door. The steam behind her is watching.",
  ["obsidian_maiden", "steam_wraith", "snow_hare"], "rime_hall", "foe",
  "Glass edges cut every hitter and the wraith shrugs physical; soak the maiden (weak to water), and do not Mark the hare.")
E("rime_f4", "The Long Table", "The jarl's table is still laid. The skald is still singing.",
  ["glacier_wolverine", "mead_bearer", "skald"], "rime_hall", "foe",
  "The mead keeps the wolverine coming and the saga builds stress to a last verse; kill the Skald before his third.")
E("rime_f5", "The Shaft Head", "Sledges at the shaft mouth, one still smoking.",
  ["ore_hauler", "fire_setter", "rime_thrall"], "rime_glacier", "foe",
  "Two telegraphed fire turns; Ward and spacing beat raw HP. Kill the Hauler when the front hero can take the spill.")
E("rime_f6", "The Snake Pit", "The jarl's pit has split open. The adders came up warm.",
  ["pit_adder", "pit_adder", "steam_wraith"], "rime_crevasse", "foe",
  "Adders strike back at every hit and freeze what they burned; few heavy blows and ranged courses beat many light ones.")
E("rime_f7", "Scavengers", "Things that came down the shaft for the dead.",
  ["glacier_wolverine", "magma_hound", "snow_hare"], "rime_crevasse", "foe",
  "Fast hitters and a wolverine that heals once at the brink; save a finisher for its second wind.")
E("rime_f8", "Steam and Stone", "Rising heat, falling ice.",
  ["rime_thrall", "steam_wraith", "fissure_worm"], "rime_glacier", "foe",
  "Stress from the wraith, burst from the worm; a balanced test of front and back cover.")
E("rime_e1", "The Thane's Hall", "A giant at the hearth, and his shieldmaiden.",
  ["obsidian_maiden", "jotun_thane"], "rime_hall", "elite",
  "He melts but grows stronger every round, and braces if left alone; burst him through the wall, not halfway.")
E("rime_e2", "Two-Faced Oracle", "She speaks in fire and frost.",
  ["magma_hound", "rime_thrall", "twin_seeress"], "rime_glacier", "elite",
  "She answers a burning hitter with frost and a frozen one with fire; hit her clean, with physical, void or water.")
E("rime_e3", "The Berserker", "Mead, a saga, and a man who walked into the fire.",
  ["berserker", "mead_bearer", "skald"], "rime_hall", "elite",
  "Every hit feeds him Might and the mead and saga feed him more; few heavy hits beat many light ones.")
E("rime_e4", "The Ore Sledges", "The herd is still yoked to the sledges.",
  ["musk_ox", "ore_hauler", "fire_setter"], "rime_crevasse", "elite",
  "The ox Pushes the company out of rank and its coat refreezes its Armor; crack it with Thermal Shock, then the rest.")
E("rime_r_riven_jarl", "The Riven Jarl", "The lord of the split glacier, on his cracked throne.",
  ["obsidian_maiden", "riven_jarl", "fissure_worm"], "rime_boss", "ruler",
  "He wards the first course each round; time courses after it, and Ward the company before The Split Runs Through.")
E("rime_r_sleeper_under_the_hold", "The Sleeper Under the Hold", "The glacier floor breathes. Miners climb out of it.",
  ["rime_thrall", "steam_wraith", "sleeper_under_the_hold"], "rime_boss", "ruler",
  "Fire on her feeds her gusts; she is weak to it, so burn her in bursts and Ward the company after each.",
  props="sleeper_under_the_hold")
E("rime_r_firstbreaker", "The Firstbreaker", "A head and two arms over the rim of the deep shaft.",
  ["rime_thrall", "rime_thrall", "firstbreaker"], "rime_boss", "ruler",
  "Each phase cracks him; push him through phases fast, and keep the rear hero out of reach of the chain.",
  props="firstbreaker")

NEEDS = [
    "riven_jarl: Two Halves should switch which course he resists each turn (shown), and end in phase 2; written as 1 Ward a round.",
    "riven_jarl: Riven Cleave should put Fire on one front hero and Frost on the other; written as 1 of each on both.",
    "glacier_wolverine: Keeps Coming Back should return it once at low HP after it dies; written as one heal at the brink (a death summon of itself would chain).",
]
