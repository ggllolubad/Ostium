"""World XII: The White Silence (Frost + Void, Absolute Zero). Role map: docs/design/gate2/world_XII_white_silence.md.

Every defence is thinned here. Erode cuts the Block and Ward a hero gains, and Absolute Zero goes through Block: a
hero carrying stable Frost and Erode is one Volatile touch from losing twice the power in HP. Keep stacks off early,
kill the appliers, carry HP. The heaviest stress world of the act: four foes deal stress. Fire undoes almost
everything; the Frozen Saint, being holy, is weak to void."""
import dsl
from dsl import *
from creatures import *

W = "silence"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

# ================================================================== world cards (Absolute Zero)
card("w_silence_cold_eye", "The Cold Eye", 1, "W", "enemy",
     [A("frost", 1, per="t.void", k=1, max=4, attr="stable"), A("void", 1, attr="volatile")],
     "Apply 1 Frost, plus 1 per Erode on the target (max 4). Apply 1 Volatile Void.", cat="frost", world=W,
     arch="world",
     flavour="The eye opens and warmth drains away.",
     note="A hero meets the black star's stare and turns it on a foe; the foe whitens from the edges in.",
     up={"text": "Apply 2 Frost, plus 1 per Erode on the target (max 5). Apply 1 Volatile Void.",
         "fx": [A("frost", 2, per="t.void", k=1, max=5, attr="stable"), A("void", 1, attr="volatile")]})
card("w_silence_say_it_aloud", "Say It Aloud", 1, "W", "ally",
     [CONS(e="void"), B(0, per="consumed", k=1, max=6), STRESS(-6)],
     "Remove all Erode from a hero. They gain 1 Block per Erode removed (max 6) and shed 6 stress.", world=W,
     arch="world",
     flavour="A black star rose and took all the warmth and all the sound.",
     note="A hero shouts into a companion's face across the snow, and for a moment there is sound.",
     up={"text": "Remove all Erode from a hero. They gain 2 Block, plus 1 per Erode removed (max 8), and shed 8 stress.",
         "fx": [CONS(e="void"), B(2, per="consumed", k=1, max=8), STRESS(-8)]})
card("w_silence_hold_your_breath", "Hold Your Breath", 0, "W", "self",
     [CONS(s="block"), dsl.W(0, per="consumed", k=0.34, max=3)],
     "Lose all your Block. Gain 1 Ward per 3 Block lost (max 3).", world=W, arch="world",
     flavour="Nothing makes a sound here. Make none.",
     note="A hero lowers a rimed shield and goes utterly still under the black sun.",
     up={"text": "Lose all your Block. Gain 1 Ward, plus 1 per 3 Block lost (max 4).",
         "fx": [CONS(s="block"), dsl.W(1, per="consumed", k=0.34, max=4)]})
card("w_silence_star_comes_down", "The Star Comes Down", 2, "W", "all_enemies",
     [D(0, per="t.el_total", k=1, max=3), A("frost", 1, attr="stable"), A("void", 1, attr="volatile")],
     "Each foe takes 1 per course stack on it (max 3). Every foe: apply 1 Frost, then 1 Volatile Void.", cat="void",
     world=W, arch="world",
     flavour="The black star came down to see what was making all the noise.",
     note="The black disc fills the sky over the tundra, and every foe below it goes white.",
     up={"text": "Each foe takes 2, plus 1 per course stack on it (max 5). Every foe: apply 1 Frost, then 1 Volatile Void.",
         "fx": [D(2, per="t.el_total", k=1, max=5), A("frost", 1, attr="stable"), A("void", 1, attr="volatile")]})

# ================================================================== foes
creature("hollow_wanderer", "Hollow Wanderer", "foe", 38, ranks=[1, 2], role="attacker",
         resist={"void": "resist", "frost": "resist", "fire": "weak"},
         intents={"crook": I("Crook Blow", "attack", "back", [D(8)]),
                  "empty": I("Emptiness", "debuff", "front", [A("void", 2, attr="stable"), STRESS(5)]),
                  "sweep": I("Crook Sweep", "attack", "front2", [D(5)])},
         ai=[{"use": "empty", "every": 3}, {"use": "sweep", "every": 3, "offset": 1}, {"use": "crook"}],
         personality="cruel", lore="It walks the tundra looking for its face.", world=W)

creature("silence_stag", "Silence Stag", "foe", 44, armor=1, ranks=[1], role="attacker",
         resist={"frost": "resist", "fire": "weak"},
         intents={"charge": I("Silent Charge", "attack", "front", [D(10)]),
                  "stamp": I("Stamp", "attack", "front", [D(5), ST("stun", 1)]),
                  "sweep": I("Antler Sweep", "attack", "front2", [D(6)])},
         ai=[{"use": "stamp", "every": 4, "offset": 2}, {"use": "sweep", "every": 3}, {"use": "charge"}],
         traits=[T("hit", "No Sound When It Runs", "Struck by a hero who moved this round, it is already gone: it "
                   "dodges the next hit.", [SELF("dodge", 1, if_="t.moved")])],
         lore="It makes no sound when it runs. It makes no sound when it kills.", world=W)

creature("starless_eye", "Starless Eye", "foe", 30, ranks=[3, 4], role="afflicter",
         resist={"void": "immune", "lightning": "weak"},
         intents={"stare": I("Starless Stare", "debuff", "back", [STRESS(8), A("void", 1, attr="stable")]),
                  "blink": I("Blink", "defend", "self", [SELF("dodge", 1)]),
                  "ray": I("Cold Ray", "attack", "random", [D(6), A("frost", 1, attr="stable")])},
         ai=[{"use": "blink", "if": "hp_pct<50", "not_twice": True}, {"use": "stare", "every": 2}, {"use": "ray"}],
         traits=[T("death", "Torn Edge", "On death: its torn void edge spills 2 Erode on the hero who killed it.",
                   [A("void", 2, attr="stable", to="killer")])],
         personality="cruel",
         lore="An eye that fell from the black star. It is still looking for the rest of the face.", world=W)

creature("frozen_saint", "Frozen Saint", "foe", 38, armor=1, ranks=[2, 3], role="support",
         resist={"frost": "resist", "void": "weak"},
         intents={"prayer": I("Silent Prayer", "heal", "all_allies", [H(6)]),
                  "absolve": I("Cold Absolution", "heal", "all_allies", [CLEANSE(2), B(4)]),
                  "blessing": I("Cold Blessing", "debuff", "front2", [A("frost", 2, attr="stable")]),
                  "touch": I("Frozen Touch", "attack", "front", [D(6)])},
         ai=[{"use": "absolve", "if": "total_hex>=4", "not_twice": True}, {"use": "prayer", "if": "ally_hurt", "not_twice": True},
             {"use": "blessing", "every": 3}, {"use": "touch"}],
         lore="It prayed for warmth. The black star answered.", world=W)

creature("rime_shade", "Rime Shade", "foe", 34, armor=1, ranks=[1, 2], role="attacker",
         resist={"void": "immune", "frost": "resist", "physical": "resist", "fire": "weak"},
         intents={"envelop": I("Envelop", "attack", "front", [D(4), A("frost", 1, attr="volatile")]),
                  "reap": I("Peel Off the Snow", "attack", "front", [D(8)]),
                  "creep": I("Long Shadow", "attack", "back", [D(6), A("frost", 1, attr="stable")])},
         ai=[{"use": "envelop", "every": 3, "offset": 2}, {"use": "creep", "every": 3}, {"use": "reap"}],
         personality="mindless", lore="A shadow cast by nothing.", world=W)

creature("ice_fisher", "Ice-Fisher", "foe", 36, ranks=[3, 4], role="afflicter",
         resist={"frost": "resist", "void": "resist", "fire": "weak"},
         intents={"jerk": I("Jerk the Line", "attack", "back", [D(4), PULL(1)]),
                  "hole": I("Toward the Hole", "debuff", "front", [A("void", 2, attr="stable")]),
                  "jig": I("Jigging Stick", "attack", "random", [D(6)])},
         ai=[{"use": "jerk", "every": 2}, {"use": "hole", "every": 3, "offset": 1}, {"use": "jig"}],
         traits=[T("hit", "Something Is Nibbling", "Struck by a hero in rank 1, the line goes taut: that hero gains 1 "
                   "Erode.", [A("void", 1, attr="stable", if_="t.rank<2")])],
         personality="cunning",
         lore="It has been jigging that hole since the star rose. Something is nibbling.", world=W)

creature("hush_child", "Hush-Child", "foe", 30, ranks=[3, 4], role="afflicter",
         resist={"frost": "resist", "void": "resist", "fire": "weak"},
         intents={"cry": I("The Long Cry", "debuff", "all_heroes", [STRESS(5)]),
                  "wail": I("Silent Wail", "debuff", "most_stress", [STRESS(8)]),
                  "cradle": I("Cradleboard", "defend", "self", [B(8)])},
         ai=[{"use": "cradle", "if": "hp_pct<50", "not_twice": True}, {"use": "wail", "every": 3}, {"use": "cry"}],
         traits=[T("death", "The Cry Stops", "On death: every hero sheds 8 stress.", [STRESS(-8, to="all_enemies")])],
         personality="cruel", lore="It cries without stopping. Be grateful you cannot hear it.", world=W)

creature("lemming_drift", "Lemming Drift", "foe", 32, ranks=[1, 2], role="attacker", flags=["swarm"],
         resist={"frost": "resist", "fire": "weak"},
         intents={"gnaw": I("Gnaw", "attack", "front", [D(2, times=4)]),
                  "pour": I("Pour Over", "attack", "front2", [D(3), A("frost", 1, attr="stable")])},
         ai=[{"use": "pour", "every": 3}, {"use": "gnaw"}],
         personality="mindless",
         lore="There were always too many of them. There are fewer now. They have not noticed.", world=W)

creature("lead_dog", "Lead Dog", "foe", 40, armor=1, ranks=[1], role="attacker",
         resist={"frost": "resist", "fire": "weak"},
         intents={"lunge": I("Lunge and Bite", "attack", "front", [D(9)]),
                  "drag": I("Drag", "attack", "rank2", [D(5), PULL(1)]),
                  "lean": I("Lean into the Harness", "defend", "self", [B(8)])},
         ai=[{"use": "drag", "every": 3}, {"use": "lean", "if": "hp_pct<50", "not_twice": True}, {"use": "lunge"}],
         personality="mindless", lore="It still leads the team. The team is behind it somewhere.", world=W)

creature("sledge_hauler", "Sledge Hauler", "foe", 48, armor=2, ranks=[1], role="defender",
         resist={"frost": "resist", "fire": "weak"},
         intents={"strap": I("Lean into the Strap", "defend", "all_allies", [B(6)]),
                  "swing": I("The Sledge Swings", "attack", "front2", [D(8)]),
                  "slip": I("Slip Back", "attack", "front", [D(6), PUSH(1)])},
         ai=[{"use": "strap", "every": 3}, {"use": "swing", "every": 2}, {"use": "slip"}],
         lore="The dogs died first. She took the strap. She has not put it down.", world=W)

creature("silent_singers", "The Silent Singers", "foe", 40, ranks=[2, 3], role="afflicter", charge_name="Verse",
         resist={"frost": "resist", "void": "resist", "fire": "weak"},
         intents={"song": I("A Song No One Hears", "debuff", "all_heroes",
                            [STRESS(3), A("void", 1, attr="stable"), SELF("charge", 1)]),
                  "full": I("Full Voice", "debuff", "all_heroes", [STRESS(9), A("void", 1, attr="stable"), CLR("charge")]),
                  "rock": I("Rocking", "defend", "self", [B(8)])},
         ai=[{"use": "full", "if": "charge>=2"}, {"use": "rock", "if": "hp_pct<50", "not_twice": True}, {"use": "song"}],
         traits=[T("hit", "One Laughs", "The first hit each round breaks their verse: it resets to 0.",
                   [CLR("charge", to="self")])],
         lore="They sang into each other's mouths until one laughed and lost. Neither has lost yet.", world=W)

creature("snow_house_builder", "Snow-House Builder", "foe", 44, armor=1, ranks=[1, 2], role="attacker",
         resist={"frost": "resist", "void": "resist", "fire": "weak"},
         intents={"bury": I("Bury", "attack", "random", [D(6), ST("stun", 1)]),
                  "cut": I("Cut a Block", "defend", "self", [B(10)]),
                  "drop": I("Bring It Down", "attack", "marked", [D(10)])},
         ai=[{"use": "bury", "every": 3, "offset": 1}, {"use": "cut", "if": "hp_pct<50", "not_twice": True},
             {"use": "drop"}],
         traits=[T("hit", "A Very Small House", "Struck by a hero with Taunt, it walls them in: they are Anchored for "
                   "2 rounds.", [ST("anchor", 2, if_="t.taunt>0")])],
         lore="It builds a house for each of you. They are very small houses.", world=W)

# ================================================================== elites
creature("pale_hunter", "The Pale Hunter", "elite", 100, armor=2, ranks=[2, 3], role="attacker",
         resist={"frost": "resist", "void": "resist", "fire": "weak"},
         intents={"arrow": I("Arrow at the Warm", "attack", "healthiest", [D(9), D(4, if_="t.hp_pct>=100")]),
                  "spear": I("Hunting Spear", "attack", "back", [D(9), A("frost", 1, attr="stable")]),
                  "prey": I("Mark the Prey", "debuff", "healthiest", [ST("mark", 1), ST("vulnerable", 1)]),
                  "close": I("Close In", "buff", "self", [SELF("might", 1), B(6)]),
                  "ground": I("Go to Ground", "defend", "self", [B(12), SELF("dodge", 1)])},
         ai=[{"use": "ground", "if": "vulnerable>0", "not_twice": True}, {"use": "prey", "every": 3},
             {"use": "close", "every": 4, "offset": 2}, {"use": "spear", "every": 3, "offset": 1}, {"use": "arrow"}],
         traits=[T("hit", "Into the Snow", "The first hit on it each round: it fades into the snow and dodges the next "
                   "hit.", [SELF("dodge", 1)])],
         lore="It hunts the warm. There are not many left.", world=W)

creature("void_mammoth", "Void Mammoth", "elite", 130, armor=3, span=2, ranks=[1, 2], role="attacker",
         flags=["unstunnable", "immovable"],
         resist={"frost": "resist", "void": "resist", "physical": "resist", "fire": "weak"},
         intents={"trample": I("Trample", "attack", "front2", [D(9)]),
                  "tusk": I("Tusk", "attack", "front", [D(16)]),
                  "trumpet": I("Trumpet of the Void", "debuff", "all_heroes", [STRESS(8), A("void", 1, attr="stable")]),
                  "trunk": I("Trunk Swing", "attack", "back", [D(10)]),
                  "shake": I("Shake It Off", "defend", "self", [B(15)])},
         ai=[{"use": "shake", "if": "armor<3", "not_twice": True}, {"use": "trumpet", "every": 4, "offset": 1},
             {"use": "trample", "every": 3}, {"use": "trunk", "every": 4, "offset": 3}, {"use": "tusk"}],
         traits=[T("hit", "It Did Not Notice", "It cannot be Stunned or moved. The first hit each round: it gains 4 "
                   "Block.", [B(4, to="self")])],
         lore="Its herd died out an age ago. It did not notice.", world=W)

creature("drum_seer", "The Drum-Seer", "elite", 95, armor=2, ranks=[2, 3], role="summoner",
         resist={"frost": "resist", "void": "resist", "fire": "weak"},
         intents={"beat": I("One Hard Beat", "debuff", "front2", [D(4), A("frost", 2, attr="stable")]),
                  "call": I("Call the Herd", "summon", "self", [SUMMON("silence_stag", max=2)]),
                  "dance": I("Spirit Dance", "buff", "all_allies", [ST("might", 1)]),
                  "beater": I("The Beater", "attack", "random", [D(9)]),
                  "dead": I("Beat for the Dead", "heal", "self", [H(15)])},
         ai=[{"use": "dead", "if": "doom>=4", "not_twice": True}, {"use": "call", "every": 3},
             {"use": "beat", "every": 3, "offset": 1}, {"use": "dance", "every": 4, "offset": 3}, {"use": "beater"}],
         traits=[T("death", "The Herds Stop Coming", "On death: the drumming stops, and every hero sheds 6 stress.",
                   [STRESS(-6, to="all_enemies")])],
         lore="He beat the drum to call the herds home. The herds still come. You will not hear them.", world=W)

creature("voiceless_chief", "The Voiceless Chief", "elite", 105, armor=3, ranks=[2], role="support",
         resist={"frost": "resist", "void": "resist", "physical": "resist", "fire": "weak"},
         intents={"point": I("The Baton Points", "debuff", "most_played", [ST("mark", 1), ST("vulnerable", 1)]),
                  "order": I("An Order", "buff", "all_allies", [ST("might", 1)]),
                  "direct": I("Hold the Line", "defend", "all_allies", [B(6)]),
                  "baton": I("Baton Strike", "attack", "marked", [D(10)]),
                  "bind": I("Bind the Wounds", "heal", "all_allies", [H(8)])},
         ai=[{"use": "bind", "if": "total_bleed>=4", "not_twice": True}, {"use": "point", "every": 3},
             {"use": "order", "every": 4, "offset": 2}, {"use": "direct", "if": "ally_hurt", "not_twice": True},
             {"use": "baton"}],
         traits=[T("round_start", "Still Obeyed", "Round start: every foe gains 3 Block.",
                   [B(3, to="all_allies")])],
         lore="He still gives orders. They are still obeyed.", world=W)

# ================================================================== rulers
creature("cold_star", "The Cold Star", "ruler", 290, armor=2, span=2, ranks=[3, 4], role="afflicter",
         resist={"void": "immune", "frost": "resist", "lightning": "weak"},
         intents={"gaze": I("Black Gaze", "debuff", "all_heroes", [STRESS(8)]),
                  "chill": I("Stop the Warmth", "debuff", "all_heroes",
                             [A("frost", 1, attr="stable"), A("void", 1, attr="stable")]),
                  "eye": I("The Eye Opens", "attack", "healthiest", [D(6), A("void", 1, attr="stable"),
                                                                   A("frost", 2, attr="volatile")]),
                  "lance": I("Star Lance", "attack", "back", [D(12), A("void", 1, attr="stable")]),
                  "wide": I("It Opens Wider", "attack", "all_heroes", [D(3), A("void", 1, attr="volatile")]),
                  "collapse": I("Collapse", "attack", "front", [D(20)])},
         ai=[{"use": "eye", "every": 3}, {"use": "chill", "every": 3, "offset": 1}, {"use": "gaze", "every": 4, "offset": 3},
             {"use": "lance"}],
         phases=[P(60, "It opens wider. Every hero carrying Frost is drained at once.",
                   ai=[{"use": "wide", "every": 2}, {"use": "chill", "every": 3}, {"use": "lance"}], might=1),
                 P(25, "It comes down. The disc fills the sky, and the small pale moon passes low enough to strike.",
                   ai=[{"use": "wide", "every": 3}, {"use": "collapse"}], fx=[LOSE_ARMOR(2, to="self")])],
         traits=[T("round_start", "The Warmth Goes", "Round start: the front hero gains 1 Frost.",
                   [A("frost", 1, attr="stable", to="front_enemy")]),
                 T("hit", "Warmth Calls to It", "The first hero to strike it each round while carrying Ward has the "
                   "Ward drawn off as Erode: they gain 2 Erode.", [A("void", 2, attr="stable", if_="t.ward>0")])],
         lore="The black star came down to see what was making all the noise.", world=W)

creature("unspoken_bear", "The Unspoken Bear", "ruler", 310, armor=3, span=2, ranks=[1, 2], role="attacker",
         resist={"frost": "resist", "void": "resist", "fire": "weak"},
         intents={"blow": I("Two-Pawed Blow", "attack", "front2", [D(10)]),
                  "roar": I("The Soundless Roar", "debuff", "all_heroes", [STRESS(7)]),
                  "swipe": I("Swipe", "attack", "front", [D(16)]),
                  "drift": I("A Drift That Stood Up", "defend", "self", [B(16)]),
                  "mouth": I("The Black Mouth", "attack", "front",
                             [D(6), A("frost", 1, attr="stable"), A("void", 2, attr="volatile")]),
                  "takes": I("The Roar Takes", "debuff", "all_heroes", [STRESS(6), A("void", 1, attr="stable")])},
         ai=[{"use": "roar", "every": 3}, {"use": "blow", "every": 2}, {"use": "drift", "if": "hp_pct<70", "not_twice": True},
             {"use": "swipe"}],
         phases=[P(50, "No throat. The black mouth opens, and the roar takes as well as frightens.",
                   ai=[{"use": "mouth", "every": 3}, {"use": "takes", "every": 3, "offset": 1}, {"use": "blow"}]),
                 P(20, "She rears to her full height, and the drift on her flank slides away.",
                   ai=[{"use": "mouth", "every": 2}, {"use": "blow"}], might=2)],
         traits=[T("hit", "The Hunters' Rule", "The first hero to strike her each round gains 3 stress, 6 if they struck "
                   "with 2 or more Momentum.", [STRESS(3), STRESS(3, if_="t.momentum>=2")])],
         lore="The hunters never said her name aloud. Now nothing can be said aloud.", world=W)

creature("hearth_grandmother", "The Hearth Grandmother", "ruler", 280, armor=2, span=2, ranks=[3, 4], role="summoner",
         resist={"frost": "resist", "void": "resist", "fire": "weak"},
         intents={"call": I("Come to Be Fitted", "summon", "self", [SUMMON("hollow_wanderer", max=3)]),
                  "stitch": I("The Stitch", "debuff", "random", [ST("anchor", 2), STRESS(6)]),
                  "needle": I("Long Needle", "attack", "back", [D(12)]),
                  "fit": I("Fit the Mask", "heal", "ally_lowest", [H(12)]),
                  "stitches": I("Two Stitches", "debuff", "front2", [ST("anchor", 2), STRESS(5), A("void", 1, attr="stable")]),
                  "hearth": I("The Cold Hearth", "attack", "all_heroes",
                              [D(4), A("frost", 1, attr="stable"), A("void", 1, attr="volatile")])},
         ai=[{"use": "call", "if": "allies<3"}, {"use": "stitch", "every": 3}, {"use": "fit", "if": "ally_hurt", "not_twice": True},
             {"use": "needle"}],
         phases=[P(50, "None of them fit. She cuts the failed masks loose, and the stitch takes two.",
                   ai=[{"use": "call", "if": "allies<3"}, {"use": "hearth", "every": 3}, {"use": "stitches", "every": 3,
                                                                                         "offset": 1},
                       {"use": "needle"}], might=1),
                 P(20, "Where the hearth burned there is only a round black hole.",
                   ai=[{"use": "hearth", "every": 2}, {"use": "needle"}], might=1)],
         traits=[T("round_start", "Waiting to Be Fitted", "Round start: every other foe gains 4 Block.",
                   [B(4, to="allies_other")]),
                 T("ally_death", "Cut Loose", "Below half HP: each time a foe falls she gains 1 Might.",
                   [SELF("might", 1, if_="hp_pct<50")])],
         lore="She sews new faces for the ones who lost theirs. None of them fit.", world=W)

# ================================================================== encounters
E = encounter
E(W, "silence_f1", "The Open Tundra", "Wanderers in the snow, and a shadow under them.",
  ["rime_shade", "hollow_wanderer", "hollow_wanderer"], "silence_tundra", "foe",
  "Wanderers lay Erode; the shade's Volatile Frost cashes it in. Ward the front.")
E(W, "silence_f2", "The Team", "A dog still in harness, the woman with the strap, a wanderer.",
  ["lead_dog", "sledge_hauler", "hollow_wanderer"], "silence_tundra", "foe",
  "The dog drags heroes forward into the sledge's swing; plan ranks for the drag.")
E(W, "silence_f3", "The Frozen Shrine", "Saints and the eye that watches them.",
  ["frozen_saint", "starless_eye", "frozen_saint"], "silence_shrine", "foe",
  "Heals, cleanses against Hex, and stress; the saints are the one target here weak to void.")
E(W, "silence_f4", "The Rift Edge", "Shades at the edge of the rift.",
  ["rime_shade", "rime_shade", "starless_eye"], "silence_rift", "foe",
  "Void-immune shadows and an eye that spills Erode when it dies; fire or physical only.")
E(W, "silence_f5", "The Quiet Camp", "A builder, two singers and a cradleboard.",
  ["snow_house_builder", "silent_singers", "hush_child"], "silence_camp", "foe",
  "The stress camp: kill the child first, hit the singers every round to break the verse.")
E(W, "silence_f6", "The Ice Holes", "Lemmings pouring past a dog and a fisher.",
  ["lemming_drift", "lead_dog", "ice_fisher"], "silence_camp", "foe",
  "Block is gnawed away while heroes are pulled into rank 1, where the line feeds them Erode.")
E(W, "silence_f7", "The Stag's Path", "It makes no sound.",
  ["silence_stag", "lemming_drift", "starless_eye"], "silence_rift", "foe",
  "Area damage for the drift, single burst for the stag; a hero who moves loses the stag.")
E(W, "silence_f8", "The Vigil", "A wall, a healer and two voices.",
  ["sledge_hauler", "frozen_saint", "silent_singers", "hush_child"], "silence_shrine", "foe",
  "A wall, a healer and two voices: a stress race.")
E(W, "silence_e1", "The Hunt", "It found you first.",
  ["silence_stag", "pale_hunter", "hollow_wanderer"], "silence_tundra", "elite",
  "The front hero is the prey and Vulnerable makes it go to ground; few heavy hits beat many light ones.")
E(W, "silence_e2", "The Last Herd", "The mammoth and the shadows round its feet.",
  ["void_mammoth", "rime_shade", "starless_eye"], "silence_rift", "elite",
  "Stuns and moves do not stop the trample; stripping its Armor only makes it shake. Block and heal through it.")
E(W, "silence_e3", "The Drum", "A dog, the drummer, a cradleboard, and room for the herd.",
  ["lead_dog", "drum_seer", "hush_child"], "silence_camp", "elite",
  "Rank 4 is left for the herd; kill the seer and the stags stop coming, and the camp goes quiet.")
E(W, "silence_e4", "The Chief's Orders", "The chief points, and they obey.",
  ["sledge_hauler", "voiceless_chief", "snow_house_builder", "starless_eye"], "silence_tundra", "elite",
  "His orders Block every foe each round; the builder walls in a Taunting guard.")
E(W, "silence_r_cold_star", "The Cold Star", "The black star comes down.",
  ["frozen_saint", "ice_fisher", "cold_star"], "silence_boss", "ruler",
  "Strip stacks before each open eye; Ward invites Erode, so cleanse instead.")
E(W, "silence_r_unspoken_bear", "The Unspoken Bear", "Do not speak of her on the way.",
  ["unspoken_bear", "lemming_drift", "lemming_drift"], "silence_boss", "ruler",
  "Hit her hard and seldom; clear the drift with area damage.", props="unspoken_bear")
E(W, "silence_r_hearth_grandmother", "The Hearth Grandmother", "The faceless come to be fitted.",
  ["hollow_wanderer", "hollow_wanderer", "hearth_grandmother"], "silence_boss", "ruler",
  "The ranks refill and every fallen mask feeds her; reach the back ranks.", props="hearth_grandmother")

NEEDS = [
    "cold_star The Warmth Goes: should land on the healthiest hero (effect target 'healthiest'); written as the front hero.",
    "snow_house_builder Bury: the buried hero should also be untargetable for a round.",
    "hearth_grandmother The Stitch: should also block kit skills for a round; written as Anchored (no Swap) and stress.",
    "drum_seer The Herds Stop Coming: summoned Stags should flee on his death; written as stress shed.",
    "voiceless_chief The Baton Points: should point at the hero who dealt the most damage last round and override "
    "Taunt for every foe; written as the hero who played most cards, with his and the builder's blows on the Marked.",
    "unspoken_bear The Hunters' Rule and pale_hunter Into the Snow: should trigger on every hit, not once a round.",
    "void_mammoth: span 2 is the world's one large elite (row 13).",
]
