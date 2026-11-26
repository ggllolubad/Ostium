"""World X: The Venom Spires (Lightning + Toxin, Neurotoxin). Role map: docs/design/gate2/world_X_venom_spires.md.

The hive stacks Toxin with its stings, then a jolt of Volatile Lightning paralyses a hero's next card (Neurotoxin).
Rider-built decks lose their engine one card at a time; swarms, eggs and healers reward area damage and kill order;
webs, pits and termites fight over whether the company should move or stand."""
import dsl
from dsl import *
from creatures import *

W = "hive"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

# ================================================================== world cards (Neurotoxin)
card("w_hive_paralysing_sting", "Paralysing Sting", 1, "W", "enemy",
     [D(0, per="t.toxin", k=2, max=10), A("lightning", 1, attr="volatile", if_="t.toxin>0")],
     "Deal 2 per Toxin on the target (max 10). If it has Toxin, apply 1 Volatile Lightning.", cat="lightning",
     world=W, arch="world",
     flavour="Their venom stops the heart, then the will.",
     note="A hero drives a lightning-scorched stinger into a swollen, venom-green foe; it locks mid-step.",
     up={"text": "Deal 3, plus 2 per Toxin on the target (max 13). If it has Toxin, apply 1 Volatile Lightning.",
         "fx": [D(3, per="t.toxin", k=2, max=13), A("lightning", 1, attr="volatile", if_="t.toxin>0")]})
card("w_hive_lightning_rod", "Lightning Rod", 1, "W", "enemy",
     [CONS(e="lightning", to="lowest_ally"), A("lightning", 1, per="consumed", k=1, max=3, attr="volatile")],
     "Remove all Lightning from the most wounded hero. Apply 1 Volatile Lightning to the target, plus 1 per Lightning "
     "removed (max 3).",
     cat="lightning", world=W, arch="world",
     flavour="Lightning struck the plain, and the insects built towers to catch it.",
     note="A hero plants an iron rod between a stung companion and a foe; the white-violet fern jumps across.",
     up={"text": "Remove all Lightning from the most wounded hero. Apply 2 Volatile Lightning to the target, plus 1 "
                 "per Lightning removed (max 5).",
         "fx": [CONS(e="lightning", to="lowest_ally"), A("lightning", 2, per="consumed", k=1, max=5, attr="volatile")]})
card("w_hive_take_the_sting", "Take the Sting", 1, "W", "self",
     [B(2, per="ailments", k=2, max=12)],
     "Gain 2 Block, plus 2 per ailment on you (max 12).", world=W, arch="world",
     flavour="Let the cheap card take the paralysis. Then play the one that matters.",
     note="A twitching hero raises a battered pot lid as the wasps come down on him.",
     up={"text": "Gain 4 Block, plus 2 per ailment on you (max 15).", "fx": [B(4, per="ailments", k=2, max=15)]})
card("w_hive_spire_storm", "Spire Storm", 2, "W", "all_enemies",
     [D(0, per="t.toxin", k=1, max=6), A("lightning", 1, attr="volatile"),
      A("lightning", 1, attr="volatile", if_="vigour_spent>=6")],
     "Each foe takes 1 per Toxin on it (max 6), then gains 1 Volatile Lightning, and 1 more if 6 or more vigour was "
     "spent this round.", cat="lightning", world=W,
     arch="world",
     flavour="The storm came, and the hive caught it, and the plain went still.",
     note="Lightning forks down a spire and runs through every swollen body round its foot at once.",
     up={"text": "Each foe takes 2, plus 1 per Toxin on it (max 8), then gains 1 Volatile Lightning, and 1 more if 6 or "
                 "more vigour was spent this round.",
         "fx": [D(2, per="t.toxin", k=1, max=8), A("lightning", 1, attr="volatile"),
                A("lightning", 1, attr="volatile", if_="vigour_spent>=6")]})

# ================================================================== foes
creature("spire_wasps", "Spire Wasps", "foe", 30, ranks=[1, 2], role="afflicter", flags=["swarm"],
         resist={"toxin": "resist", "physical": "resist", "frost": "weak"},
         intents={"sting": I("Cloud of Stings", "attack", "front", [D(2, times=3), A("toxin", 1, attr="stable")]),
                  "swarm": I("The Swarm Rises", "debuff", "all_heroes", [STRESS(5)])},
         ai=[{"use": "swarm", "every": 3}, {"use": "sting"}],
         personality="mindless", lore="A cloud of stings.", world=W)

creature("venom_spider", "Venom Spider", "foe", 34, armor=1, ranks=[3, 4], role="afflicter",
         resist={"toxin": "resist", "fire": "weak"},
         intents={"bite": I("Drop and Bite", "attack", "random", [D(5), A("toxin", 3, attr="stable")]),
                  "web": I("Web the Rear", "debuff", "back", [D(3), ST("anchor", 2)]),
                  "jolt": I("Paralysing Bite", "attack", "back", [D(4), A("lightning", 1, attr="volatile")])},
         ai=[{"use": "web", "every": 3}, {"use": "jolt", "every": 3, "offset": 1}, {"use": "bite"}],
         traits=[T("hit", "On Its Thread", "Struck by a hero who moved this round, it drops onto them: they gain 2 "
                   "Toxin.", [A("toxin", 2, attr="stable", if_="t.moved")])],
         personality="cunning", lore="It weaves between the spires and waits for the lightning to bring it food.",
         world=W)

creature("puppet_host", "Puppet Host", "foe", 40, ranks=[1], role="attacker",
         resist={"toxin": "resist", "fire": "weak"},
         intents={"flail": I("Jerking Staff", "attack", "front", [D(8)]),
                  "spores": I("Spores", "debuff", "all_heroes", [A("toxin", 1, attr="stable"), STRESS(4)]),
                  "lurch": I("Larval Lurch", "attack", "rank2", [D(5), A("toxin", 2, attr="stable")])},
         ai=[{"use": "spores", "every": 3}, {"use": "lurch", "every": 3, "offset": 1}, {"use": "flail"}],
         traits=[T("death", "The Larvae Burst Out", "On death: the two front heroes gain 2 Toxin.",
                   [A("toxin", 2, attr="stable", to="front2")])],
         personality="mindless",
         lore="A traveller the hive has hollowed out and filled with larvae. It moves when they do.", world=W)

creature("galvanic_beetle", "Galvanic Beetle", "foe", 44, armor=2, ranks=[1], role="defender",
         charge_name="Stored Lightning",
         resist={"lightning": "resist", "physical": "resist", "water": "weak"},
         intents={"carapace": I("Carapace", "defend", "self", [B(10)]),
                  "ram": I("Charged Horn", "attack", "front", [D(7), A("lightning", 2, attr="stable")]),
                  "release": I("Release the Charge", "attack", "front",
                               [D(11), A("lightning", 1, attr="volatile"), CLR("charge")])},
         ai=[{"use": "release", "if": "charge>=3"}, {"use": "carapace", "if": "hp_pct<50", "not_twice": True},
             {"use": "ram"}],
         traits=[T("course", "Stores the Strike", "Lightning laid on it is stored in its shell; at 3 its horn releases it as "
                   "a Volatile jolt.", [SELF("charge", 1)], e="lightning")],
         lore="It stores lightning in its shell.", world=W)

creature("hive_drone", "Hive Drone", "foe", 30, ranks=[3, 4], role="support",
         resist={"toxin": "resist", "physical": "weak"},
         intents={"nectar": I("Nectar", "heal", "ally_lowest", [H(10)]),
                  "feed": I("Feed the Hive", "heal", "all_allies", [CLEANSE(2), ST("regen", 2)]),
                  "dust": I("Venom Dust", "attack", "back", [D(3), A("toxin", 2, attr="stable")]),
                  "sting": I("Drone Sting", "attack", "random", [D(6)])},
         ai=[{"use": "feed", "if": "total_hex>=4", "not_twice": True}, {"use": "nectar", "if": "ally_hurt", "not_twice": True},
             {"use": "dust", "every": 2}, {"use": "sting"}],
         lore="It feeds the hive. Everything feeds the hive.", world=W)

creature("dowser", "The Dowser", "foe", 36, ranks=[2, 3], role="afflicter", charge_name="The Rod Dips",
         resist={"lightning": "resist", "water": "weak"},
         intents={"dip": I("The Rod Dips", "charge", "most_stress", [STRESS(4), SELF("charge", 1)]),
                  "snap": I("The Ground Splits", "attack", "most_stress",
                            [D(6), A("toxin", 2, attr="stable"), STRESS(6), CLR("charge")]),
                  "fork": I("Hazel Fork", "attack", "front", [D(6)])},
         ai=[{"use": "snap", "if": "charge>=1"}, {"use": "dip", "every": 2}, {"use": "fork"}],
         traits=[T("hit", "The Fork Still Pulls", "Struck by a hero after a flask was drunk this round, the rod turns to "
                   "the water: that hero gains 4 stress.", [STRESS(4, if_="flasks_used>0")])],
         lore="He walked the plain with a hazel fork and told each village where to dig its well. The fork still pulls.",
         world=W)

creature("struck_shepherd", "Struck Shepherd", "foe", 38, ranks=[2], role="support",
         resist={"lightning": "resist", "toxin": "resist", "fire": "weak"},
         intents={"hook": I("Crook Hook", "attack", "back", [D(5), PULL(1)]),
                  "herd": I("Herd the Flock", "defend", "ally_lowest", [B(10)]),
                  "bell": I("Cracked Bell", "buff", "all_allies", [ST("might", 1)]),
                  "sling": I("Sling Stone", "attack", "random", [D(6), A("lightning", 1, attr="stable")])},
         ai=[{"use": "herd", "if": "ally_hurt", "not_twice": True}, {"use": "hook", "every": 3},
             {"use": "bell", "every": 4, "offset": 2}, {"use": "sling"}],
         lore="The storm killed the flock on the open plain. He herds whatever the hive sends instead.", world=W)

creature("highwayman", "Highwayman", "foe", 34, ranks=[3, 4], role="attacker",
         resist={"lightning": "resist", "physical": "weak"},
         intents={"bolt": I("Crossbow Bolt", "attack", "back", [D(7), D(4, if_="t.neuro>0")]),
                  "twitch": I("Twitching Trigger", "attack", "weakest", [D(5, times=2)]),
                  "span": I("Span the Bow", "buff", "self", [SELF("might", 1), B(4)])},
         ai=[{"use": "twitch", "if": "hero_dd"}, {"use": "span", "every": 4, "offset": 3}, {"use": "twitch", "every": 3},
             {"use": "bolt"}],
         traits=[T("round_start", "Smells the Purse", "Round start: if a hero is at Death's Door, he gains 2 Might "
                   "(once).", [SELF("might", 2, if_="hero_dd&might<2")])],
         lore="He robbed travellers on the plain road. The hive takes a bigger share.", world=W)

creature("tinker", "The Tinker", "foe", 42, armor=2, ranks=[1], role="defender",
         resist={"lightning": "resist", "physical": "resist", "water": "weak"},
         intents={"swing": I("Swing the Load", "attack", "front", [D(6), ST("stun", 1)]),
                  "shell": I("Under the Pots", "defend", "self", [B(10)]),
                  "hammer": I("Tinker's Hammer", "attack", "front", [D(7)])},
         ai=[{"use": "swing", "every": 4, "offset": 2}, {"use": "shell", "if": "hp_pct<50", "not_twice": True},
             {"use": "hammer"}],
         traits=[T("hit", "Wasps in the Kettles", "Each hero who hits him gains 1 Toxin.",
                   [A("toxin", 1, attr="stable")])],
         lore="He carried every pot on the road on his back. The lightning welded them to him.", world=W)

creature("road_warden", "Road-Warden", "foe", 46, armor=2, ranks=[1], role="defender",
         resist={"lightning": "resist", "toxin": "resist", "fire": "weak"},
         intents={"attention": I("Stand to Attention", "defend", "self", [B(8), {"t": "guard_weakest"}]),
                  "thrust": I("Pike Thrust", "attack", "rank2", [D(8)]),
                  "shackle": I("Shackles", "attack", "front", [D(4), ST("anchor", 2)])},
         ai=[{"use": "attention", "every": 3}, {"use": "shackle", "every": 3, "offset": 1}, {"use": "thrust"}],
         lore="He patrolled the plain road with a twelve-foot pike. For miles, he was the tallest thing.", world=W)

creature("spire_termites", "Spire Termites", "foe", 36, armor=1, ranks=[3, 4], role="afflicter",
         resist={"toxin": "resist", "lightning": "resist", "water": "weak"},
         intents={"spray": I("Venom Spray", "attack", "front", [D(3), A("toxin", 2, attr="stable")]),
                  "build": I("Build Round the Still", "debuff", "random", [ST("stun", 1, if_="!t.moved"), STRESS(3)]),
                  "bite": I("Soldier Bite", "attack", "front", [D(6)])},
         ai=[{"use": "build", "every": 3, "offset": 1}, {"use": "spray", "every": 2}, {"use": "bite"}],
         lore="They build a spire around anything iron. Stand still long enough and they will build one around you.",
         world=W)

creature("antlion", "Antlion", "foe", 40, armor=1, ranks=[2, 3], role="afflicter",
         resist={"lightning": "resist", "toxin": "resist", "frost": "weak"},
         intents={"pit": I("Into the Glass Pit", "attack", "back",
                           [D(3), PULL(1), A("toxin", 1, attr="stable"), A("lightning", 1, attr="volatile")]),
                  "jaws": I("Sickle Jaws", "attack", "front", [D(9)]),
                  "rim": I("Glass Rim", "defend", "self", [B(8)])},
         ai=[{"use": "pit", "every": 3}, {"use": "rim", "if": "hp_pct<50", "not_twice": True}, {"use": "jaws"}],
         lore="The lightning turned its pit to glass. Nothing climbs out of glass.", world=W)

# ================================================================== elites
creature("mantis_duelist", "Mantis Duelist", "elite", 100, armor=2, ranks=[1, 2], role="attacker",
         resist={"toxin": "resist", "lightning": "resist", "frost": "weak"},
         intents={"scythe": I("Double Scythe", "attack", "first_actor", [D(6, times=2)]),
                  "lunge": I("Lunge", "attack", "back", [D(9), A("toxin", 2, attr="stable")]),
                  "paralyse": I("Paralysing Strike", "attack", "first_actor",
                                [D(6), A("toxin", 1, attr="stable"), A("lightning", 1, attr="volatile")]),
                  "stance": I("Praying Stance", "defend", "self", [SELF("riposte", 6), B(10)])},
         ai=[{"use": "stance", "if": "mark>0", "not_twice": True}, {"use": "paralyse", "every": 3},
             {"use": "lunge", "every": 3, "offset": 1}, {"use": "scythe"}],
         traits=[T("round_start", "Salute", "Round start: it bows and gains 2 Riposte while it has fewer than 4, so "
                   "many small cuts feed its replies.", [SELF("riposte", 2, if_="riposte<4")])],
         lore="It bows before every duel. It eats the loser.", world=W)

creature("brood_mother", "Brood Mother", "elite", 110, armor=2, ranks=[2, 3], role="summoner",
         resist={"toxin": "resist", "fire": "weak"},
         intents={"bite": I("Brood Bite", "attack", "front", [D(10), A("toxin", 2, attr="stable")]),
                  "web": I("Web the Rear", "debuff", "back", [D(4), ST("anchor", 2), STRESS(6)]),
                  "spawn": I("Spiderlings", "summon", "self", [SUMMON("venom_spider", max=2)]),
                  "hatch": I("Hatch", "buff", "all_allies", [ST("might", 1), ST("regen", 3)])},
         ai=[{"use": "hatch", "if": "allies<2", "not_twice": True}, {"use": "spawn", "every": 3, "if": "allies<4"},
             {"use": "web", "every": 3, "offset": 1}, {"use": "bite"}],
         traits=[T("death", "The Brood Scatters", "On death: up to two Venom Spiders join the fight if ranks are free.",
                   [SUMMON("venom_spider", max=4), SUMMON("venom_spider", max=4)])],
         lore="The spiders' queen. Her back crawls with young.", world=W)

creature("courier", "The Courier", "elite", 105, armor=2, ranks=[1, 2], role="attacker",
         resist={"lightning": "resist", "toxin": "resist", "physical": "weak"},
         intents={"trample": I("Trampling Lunge", "attack", "front2", [D(8)]),
                  "crop": I("Riding Crop", "attack", "back", [D(10), A("toxin", 1, attr="stable")]),
                  "seal": I("The Broken Seal", "summon", "self", [SUMMON("spire_wasps", max=2)]),
                  "spasm": I("Spasm", "attack", "all_heroes", [D(6), A("lightning", 1, attr="volatile")])},
         ai=[{"use": "spasm", "if": "hex>=4", "not_twice": True}, {"use": "seal", "every": 4, "offset": 1, "if": "allies<4"},
             {"use": "crop", "every": 3}, {"use": "trample"}],
         traits=[T("lost_action", "Spasm", "When it is Stunned or loses an action, horse and rider lash out: the two front "
                   "heroes take 6.", [D(6, to="front2")])],
         lore="The storm caught him in the open with a message. The hive has rewritten it.", world=W)

creature("road_centipede", "Road Centipede", "elite", 125, armor=4, span=2, ranks=[1, 2], role="attacker",
         resist={"toxin": "resist", "lightning": "resist", "fire": "weak"},
         intents={"claws": I("Venom Claws", "attack", "random", [D(9), A("toxin", 2, attr="stable")]),
                  "strike": I("Downward Strike", "attack", "back", [D(8), ST("stun", 1)]),
                  "ripple": I("Leg Ripple", "attack", "front2", [D(6)]),
                  "coil": I("Coil", "defend", "self", [B(12), SELF("fortify", 1)])},
         ai=[{"use": "coil", "if": "armor<2", "not_twice": True}, {"use": "strike", "every": 4, "offset": 2},
             {"use": "ripple", "every": 3}, {"use": "claws"}],
         traits=[T("round_start", "Fused Segments", "Round start: if it has less than 4 Armor, the strike-welded middle "
                   "restores 1.", [AR(1, to="self", if_="armor<4")])],
         lore="It lies across the road at night. Carters take it for a fallen beam.", world=W)

# ================================================================== rulers
creature("hive_queen", "The Hive Queen", "ruler", 300, armor=3, span=2, ranks=[3, 4], role="summoner",
         resist={"toxin": "immune", "lightning": "resist", "frost": "weak"},
         intents={"drone": I("Drone of the Hive", "debuff", "all_heroes", [STRESS(8)]),
                  "sting": I("Royal Sting", "attack", "front", [D(14), A("toxin", 3, attr="stable")]),
                  "neuro": I("The Colony Stings", "attack", "all_heroes",
                             [D(5), A("toxin", 2, attr="stable"), A("lightning", 2, attr="volatile")]),
                  "eggs": I("Eggs Hatch", "summon", "self", [SUMMON("spire_wasps", max=3)]),
                  "wing": I("Swarm the Rear", "attack", "back", [D(8, times=2)]),
                  "jelly": I("Royal Jelly", "heal", "self", [H(30)]),
                  "rod": I("The Rod Draws the Strike", "attack", "all_heroes",
                           [D(4), A("lightning", 2, attr="volatile")])},
         ai=[{"use": "drone", "if": "round<2"}, {"use": "eggs", "every": 3, "offset": 1, "if": "allies<3"}, {"use": "neuro", "every": 3},
             {"use": "drone", "every": 4, "offset": 2}, {"use": "sting"}],
         phases=[P(50, "She takes wing. She lays no more eggs, and her swarm comes for the rear.",
                   ai=[{"use": "jelly", "if": "hp_pct<35", "once": True, "not_twice": True}, {"use": "neuro", "every": 3},
                       {"use": "wing", "every": 2}, {"use": "sting"}], might=1),
                 P(20, "The rod in her back draws the spire's strike. Every hero carrying Toxin locks.",
                   ai=[{"use": "rod", "every": 2}, {"use": "sting"}], might=1)],
         traits=[T("round_start", "Royal Guard", "Round start: while any other foe stands, her wasps close round her: "
                   "she gains 8 Block.", [B(8, to="self", if_="allies>1")]),
                 T("hit", "The Rod", "Each hero who strikes her while carrying Toxin gains 1 Volatile Lightning.", [A("lightning", 1, attr="volatile", if_="t.toxin>0")])],
         lore="The heart of the spires. Every sting on the plain is hers.", world=W)

creature("procession", "The Procession", "ruler", 300, armor=3, span=2, ranks=[3, 4], role="defender",
         flags=["immovable", "unstunnable"],
         resist={"lightning": "resist", "toxin": "resist", "void": "weak"},
         intents={"tip": I("The Saint Tips", "attack", "front", [D(16), ST("stun", 1)]),
                  "split": I("Through the Split", "summon", "self", [SUMMON("spire_wasps", max=2)]),
                  "burn": I("The Shared Burn", "attack", "all_heroes", [D(4), A("lightning", 2, attr="stable")]),
                  "swing": I("The Saint Swings", "attack", "front2", [D(10)]),
                  "comb": I("The Comb Spills", "debuff", "front2", [A("toxin", 2, attr="volatile")]),
                  "topple": I("The Saint Falls", "attack", "all_heroes", [D(12)]),
                  "pour": I("The Comb Pours", "debuff", "all_heroes", [A("toxin", 2, attr="volatile"), STRESS(4)])},
         ai=[{"use": "tip", "if": "round<2"}, {"use": "split", "every": 4, "offset": 1, "if": "allies<3"}, {"use": "burn", "every": 2},
             {"use": "tip"}],
         phases=[P(65, "The bearers falter. The float lists, and the saint swings across two ranks.",
                   ai=[{"use": "comb", "every": 2}, {"use": "burn", "every": 3}, {"use": "swing"}]),
                 P(25, "The saint falls, and the comb pours out over the last bearers.",
                   ai=[{"use": "topple", "once": True, "not_twice": True}, {"use": "pour", "every": 2},
                       {"use": "swing"}], might=1)],
         traits=[T("phase", "Twelve Backs", "It cannot be moved or Stunned. Each time a bearer falls (each new phase), "
                   "comb spills: every hero gains 2 Toxin.", [A("toxin", 2, attr="stable", to="all_enemies")])],
         lore="The pilgrims were carrying their saint to the shrine when the storm broke. The hive carries all of them "
              "now.", world=W)

creature("cicada_under_the_road", "The Cicada Under the Road", "ruler", 280, armor=4, span=2, ranks=[2, 3],
         role="afflicter", charge_name="Hum",
         resist={"lightning": "resist", "toxin": "resist", "frost": "weak"},
         intents={"dig": I("Spade Forelegs", "attack", "front", [D(14)]),
                  "heave": I("The Paving Heaves", "attack", "front2", [D(7), A("lightning", 1, attr="stable")]),
                  "creak": I("The Shell Creaks", "defend", "self", [B(14), CLR("charge")]),
                  "song": I("The Song", "debuff", "all_heroes",
                            [STRESS(6), A("toxin", 1, attr="stable"), A("lightning", 1, attr="volatile"), CLR("charge")]),
                  "beak": I("Venom Beak", "attack", "random", [D(12), A("toxin", 2, attr="stable")]),
                  "shrill": I("The Shrill", "attack", "random", [D(8), ST("stun", 1)])},
         ai=[{"use": "creak", "if": "charge>=3", "not_twice": True}, {"use": "heave", "every": 3},
             {"use": "dig"}],
         phases=[P(65, "Its back splits along the lightning scar, and the pale adult pushes out. The shell's Armor is "
                       "gone.", ai=[{"use": "song", "every": 3}, {"use": "beak", "every": 2}, {"use": "dig"}],
                   fx=[LOSE_ARMOR(4, to="self")]),
                 P(25, "The wings unfurl. It sings every other turn, and the road stones jump.",
                   ai=[{"use": "song", "every": 2}, {"use": "shrill"}], might=1)],
         traits=[T("round_start", "The Hum", "Round start: the hum rises 1; every hero gains 2 stress per step of the "
                   "hum (max 6). The shell's creak and the Song reset it.",
                   [SELF("charge", 1), STRESS(0, per="charge", k=2, max=6, to="all_enemies")])],
         lore="It went underground the year the lightning came. It has come up to sing.", world=W)

# ================================================================== encounters
E = encounter
E(W, "hive_f1", "The Outer Spires", "Two flocks and the traveller they came out of.",
  ["puppet_host", "spire_wasps", "spire_wasps"], "hive_spires", "foe",
  "Two flocks and a host that bursts on death; one area hit is worth three single ones.")
E(W, "hive_f2", "The Web Fields", "A beetle humming in the grass, spiders above it.",
  ["galvanic_beetle", "venom_spider", "venom_spider"], "hive_spires", "foe",
  "Webs Anchor the rear and the beetle eats every first hit; use another course on the front and keep its store low.")
E(W, "hive_f3", "The Comb", "Drones feeding a host in the brood comb.",
  ["puppet_host", "hive_drone", "hive_drone"], "hive_comb", "foe",
  "Two healers keep the host up and wash off Hex; Neurotoxin or burst on the drones first.")
E(W, "hive_f4", "The Beetle Gallery", "A beetle, the clay builders, a drone.",
  ["galvanic_beetle", "spire_termites", "hive_drone"], "hive_comb", "foe",
  "A slow wall while the termites build round the still; Swap every other round.")
E(W, "hive_f5", "The Plain Road", "A warden, a shepherd and a robber on the road.",
  ["road_warden", "struck_shepherd", "highwayman"], "hive_spires", "foe",
  "The Warden guards the weakest while bolts fall on the rear and the Shepherd shields the wounded; go round him to "
  "the Shepherd.")
E(W, "hive_f6", "Under the Road", "A host, a pit and a thread in the dark.",
  ["puppet_host", "antlion", "venom_spider"], "hive_brood", "foe",
  "The pit pulls and paralyses; moving costs Toxin from the spider; keep a plain damage card for the turn after.")
E(W, "hive_f7", "The Dry Well", "The tinker, the dowser and the wasps from the well.",
  ["tinker", "dowser", "spire_wasps"], "hive_spires", "foe",
  "The Dowser shows his target a turn ahead; move that hero or Ward it. Hitting the Tinker costs Toxin.")
E(W, "hive_f8", "The Builders", "Clay cones in the road and a warden standing over them.",
  ["road_warden", "antlion", "spire_termites"], "hive_brood", "foe",
  "The Warden stands guard while the termites encase the still and the antlion pulls; move or be built in.")
E(W, "hive_f9", "The Nursery", "Everything the hive raises, all at once.",
  ["puppet_host", "spire_wasps", "venom_spider", "hive_drone"], "hive_comb", "foe",
  "Four small threats: area damage first, then the drone before it heals the host.")
E(W, "hive_e1", "The Duelling Ground", "The mantis bows.",
  ["mantis_duelist", "highwayman", "hive_drone"], "hive_spires", "elite",
  "Riposte punishes many small cuts and a Mark makes it raise its guard; strike it hard and seldom while the others "
  "kill the drone.")
E(W, "hive_e2", "The Brood Chamber", "Something enormous with something small on its back.",
  ["brood_mother", "venom_spider"], "hive_brood", "elite",
  "Each dead spider leaves her alone to Hatch and her death scatters more; kill her with the spiders low, then sweep.")
E(W, "hive_e3", "The Courier", "A horse and rider locked mid-step, a message held out.",
  ["courier", "struck_shepherd", "spire_wasps"], "hive_spires", "elite",
  "Stuns turn into a lash on the front ranks and Hex into a spasm on everyone; damage it plainly instead.")
E(W, "hive_e4", "The Fallen Beam", "A beam across the road, with legs.",
  ["road_centipede", "puppet_host", "hive_drone"], "hive_comb", "elite",
  "Its claws reach any rank and its middle regrows Armor; stripping it makes it coil, so burst it when it does.")
E(W, "hive_r_hive_queen", "The Hive Queen", "The heart of the spires.",
  ["spire_wasps", "spire_wasps", "hive_queen"], "hive_boss", "ruler",
  "Her wasps shield her and hatch again; cleanse Toxin before the rod draws the strike in the last phase.")
E(W, "hive_r_procession", "The Procession", "The pilgrims carry their saint toward the shrine.",
  ["puppet_host", "spire_wasps", "procession"], "hive_boss", "ruler",
  "It cannot be Stunned or moved; its Static meets the spilling comb, so Ward or cleanse before each spill.",
  props="procession")
E(W, "hive_r_cicada_under_the_road", "The Cicada Under the Road", "The road heaves up round a shell.",
  ["antlion", "cicada_under_the_road", "spire_termites"], "hive_boss", "ruler",
  "The hum rises every round until the Song; break the shell before the stress runs away, then race the wings.",
  props="cicada_under_the_road")

NEEDS = [
    "hive_queen Royal Guard: the first hit aimed at her each round should strike a wasp instead (redirect); written as "
    "Block while another foe stands.",
    "mantis_duelist Salute: should riposte only its chosen opponent; it duels the hero who led the last Ordo, and its "
    "Riposte answers anyone.",
    "dowser The Ground Splits: should land on the hero The Rod Dips showed (remembered target); both use the most "
    "stressed hero.",
    "struck_shepherd Herd the Flock: should swap the most wounded foe one rank back (enemy swap); written as Block.",
    "highwayman: should aim at a paralysed hero (intent target 'neuro'); written as a bonus on the bolt.",
    "spire_termites Build Round the Still: should Stun a hero who has not moved for two rounds (quantity "
    "'rounds_still'); written as this round.",
    "procession Twelve Backs: each bearer that falls should also weaken its blows (negative Might on phase).",
    "brood_mother / courier: the bible makes both 2 ranks wide; only Road Centipede takes 2 (row 13).",
    "hive_queen, procession, cicada_under_the_road: 3 ranks in the role map, redesigned to 2 (row 13).",
]
