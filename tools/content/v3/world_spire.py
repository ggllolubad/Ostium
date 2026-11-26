"""World XI: The Stilled Spire (Frost + Lightning, Lockdown). Role map: docs/design/gate2/world_XI_stilled_spire.md.

This world attacks the Ordo, not the HP bar. Foes lay stable Frost (Weaken trims multi-hit) and stable Lightning
(Static hurts many-card turns), then one Volatile touch locks a hero to the end of the plan. Several foes lock without
the Conjunction (the table, the sight, the chain), so Ward alone is not the answer. Brass is undone by water, frozen
flesh by fire."""
import dsl
from dsl import *
from creatures import *

W = "spire"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

LOCK = [A("frost", 1, attr="stable"), A("lightning", 1, attr="volatile")]

# ================================================================== world cards (Lockdown)
card("w_spire_stop_the_watch", "Stop the Watch", 1, "W", "enemy",
     [DELAY(if_="t.attacking"), B(3, to="self", if_="t.attacking")],
     "If the target means to attack, its action waits until next round and you gain 3 Block.", world=W, arch="world",
     flavour="They mostly succeeded. The clocks still tick inside the ice.",
     note="A hero closes a frosted pocket watch, and the foe across from them freezes mid-stride.",
     up={"text": "If the target means to attack, its action waits until next round and you gain 6 Block.",
         "fx": [DELAY(if_="t.attacking"), B(6, to="self", if_="t.attacking")]})
card("w_spire_unwind", "Unwind", 1, "W", "ally",
     [CONS(e="frost"), dsl.W(1, per="consumed", k=1, max=4)],
     "Remove all Frost from a hero. They gain 1 Ward, plus 1 per Frost removed (max 4).", world=W, arch="world",
     flavour="Wind it back far enough and the frost was never there.",
     note="A hero turns a brass key in a companion's back plate; rime falls from their sleeves.",
     up={"text": "Remove all Frost from a hero. They gain 2 Ward, plus 1 per Frost removed (max 5).",
         "fx": [CONS(e="frost"), dsl.W(2, per="consumed", k=1, max=5)]})
card("w_spire_second_hand", "Second Hand", 0, "W", "self",
     [PRIME(1, per="ordo_pos", k=1, max=5)],
     "Prime 1, plus 1 per card in the Ordo so far, this one included (max 5). Exhaust.", kw=["Exhaust"], world=W,
     arch="world",
     flavour="Idle is the second hand ticking and stopping.",
     note="A hero counts beats under their breath beside the stopped orrery, hand raised for the next strike.",
     up={"text": "Prime 2, plus 1 per card in the Ordo so far, this one included (max 6). Exhaust.",
         "fx": [PRIME(2, per="ordo_pos", k=1, max=6)]})
card("w_spire_midnight", "Midnight", 2, "W", "all_enemies",
     [A("frost", 1, attr="stable"), A("lightning", 1, attr="volatile"), D(0, per="reactions", k=2, max=8)],
     "Costs 1 less if 3 or more cards are already in the Ordo. Every foe: apply 1 Frost, then 1 Volatile Lightning. Then deal 2 to every foe per Conjunction set off this round "
     "(max 8).", cat="lightning", world=W, arch="world", cost_less={"per": "ordo", "k": 0.34, "max": 1},
     flavour="When it strikes twelve, the world stops. It is one minute to.",
     note="The great clock's hands meet at twelve, and aurora light locks every foe in the hall in place.",
     up={"text": "Costs 1 less if 3 or more cards are already in the Ordo. Every foe: apply 1 Frost, then 1 Volatile "
                 "Lightning. Then deal 3 to every foe per Conjunction set off "
                 "this round (max 12).",
         "fx": [A("frost", 1, attr="stable"), A("lightning", 1, attr="volatile"), D(0, per="reactions", k=3, max=12)]})

# ================================================================== foes
creature("stopped_pilgrim", "Stopped Pilgrim", "foe", 40, armor=1, ranks=[2, 3], role="afflicter",
         resist={"frost": "resist", "fire": "weak"},
         intents={"still": I("Utterly Still", "defend", "self", [B(10)]),
                  "staff": I("Staff Blow", "attack", "front", [D(8)]),
                  "stare": I("Upward Stare", "debuff", "back", [A("frost", 2, attr="stable"), STRESS(6)])},
         ai=[{"use": "still", "every": 3}, {"use": "stare", "every": 2}, {"use": "staff"}],
         traits=[T("hit", "Has Not Blinked", "Struck by a hero who moved this round, it jerks round to follow: that hero "
                   "gains 3 stress.", [STRESS(3, if_="t.moved")])],
         lore="It came to see the stars stop. It has not blinked since.", world=W)

creature("clock_sentry", "Clock Sentry", "foe", 46, armor=2, ranks=[1], role="defender", flags=["unstunnable"],
         charge_name="Tick",
         resist={"physical": "resist", "lightning": "resist", "water": "weak"},
         intents={"tick": I("Tick", "attack", "front", [D(4), B(6, to="self"), SELF("charge", 1)]),
                  "wind": I("Wind Down", "defend", "self", [B(10), SELF("charge", 1)]),
                  "tock": I("Tock", "attack", "front", [D(11), CLR("charge")])},
         ai=[{"use": "tock", "if": "charge>=1"}, {"use": "wind", "if": "hp_pct<40", "not_twice": True}, {"use": "tick"}],
         lore="Tick, then tock. Always in that order. Plan for it.", world=W)

creature("gear_spider", "Gear Spider", "foe", 32, armor=1, ranks=[3, 4], role="summoner",
         resist={"lightning": "resist", "water": "weak"},
         intents={"rebuild": I("Rebuild", "summon", "self", [SUMMON("clock_sentry", max=1)]),
                  "mend": I("Mend", "heal", "ally_lowest", [H(8)]),
                  "web": I("Copper Web", "debuff", "front", [D(3), ST("anchor", 2)]),
                  "needle": I("Needle Leg", "attack", "back", [D(6), A("lightning", 1, attr="stable")])},
         ai=[{"use": "rebuild", "if": "allies<3", "once": True}, {"use": "mend", "if": "ally_hurt", "not_twice": True},
             {"use": "web", "every": 3}, {"use": "needle"}],
         lore="It repairs the orrery. It considers you a fault.", world=W)

creature("aurora_moth", "Aurora Moth", "foe", 30, ranks=[3, 4], role="afflicter",
         resist={"frost": "resist", "physical": "weak"},
         intents={"dust": I("Aurora Dust", "debuff", "all_heroes",
                            [A("frost", 1, attr="stable"), A("lightning", 1, attr="stable")]),
                  "dazzle": I("Dazzling Beat", "debuff", "most_stress", [STRESS(8)]),
                  "flutter": I("Flutter", "defend", "self", [SELF("dodge", 1)])},
         ai=[{"use": "flutter", "if": "hp_pct<50", "not_twice": True}, {"use": "dust", "every": 2}, {"use": "dazzle"}],
         lore="Drawn to the frozen stars. Its wings carry the northern lights.", world=W)

creature("frozen_halberdier", "Frozen Halberdier", "foe", 44, armor=2, ranks=[2], role="attacker",
         resist={"frost": "resist", "physical": "resist", "fire": "weak"},
         intents={"reach": I("Halberd Reach", "attack", "rank2", [D(8)]),
                  "hook": I("Hook and Haul", "attack", "back", [D(5), PULL(1)]),
                  "sweep": I("Pole Sweep", "attack", "front2", [D(5), A("frost", 1, attr="stable")])},
         ai=[{"use": "hook", "every": 3}, {"use": "sweep", "every": 3, "offset": 1}, {"use": "reach"}],
         lore="A guard frozen mid-patrol. It finishes the patrol now.", world=W)

creature("ephemeris_clerk", "Ephemeris Clerk", "foe", 34, ranks=[3, 4], role="afflicter",
         resist={"frost": "resist", "lightning": "resist", "fire": "weak"},
         intents={"write": I("Write into the Table", "debuff", "random", [ST("lockdown", 1)]),
                  "quill": I("Quill Flick", "attack", "marked", [D(6), A("lightning", 1, attr="stable")]),
                  "sums": I("The Long Sums", "debuff", "all_heroes", [A("frost", 1, attr="stable")])},
         ai=[{"use": "write", "every": 3}, {"use": "sums", "every": 3, "offset": 1}, {"use": "quill"}],
         personality="cunning",
         lore="It worked out where every star would be for the next hundred years. It is still right.", world=W)

creature("college_tortoise", "The College Tortoise", "foe", 50, armor=2, ranks=[1], role="defender",
         resist={"frost": "resist", "fire": "weak"},
         intents={"bite": I("Slow Crushing Bite", "attack", "front", [D(12), A("frost", 1, attr="stable"), ST("lockdown", 1)]),
                  "shell": I("Into the Shell", "defend", "self", [B(12)]),
                  "pause": I("The Long Pause", "defend", "self", [B(6)])},
         ai=[{"use": "bite", "every": 2}, {"use": "shell", "if": "hp_pct<50", "not_twice": True}, {"use": "pause"}],
         traits=[T("hit", "Two Hundred Years", "Struck by a hero who has played 3 or more cards this round, it draws in: "
                   "it gains 6 Block.", [B(6, to="self", if_="t.played>=3")])],
         lore="The college kept it to show each new scholar how long a life can last. It is still making the point.",
         world=W)

creature("patroness", "The Patroness", "foe", 34, ranks=[3, 4], role="support",
         resist={"frost": "resist", "fire": "weak"},
         intents={"spyglass": I("Through the Spyglass", "debuff", "weakest", [ST("mark", 1), ST("vulnerable", 1)]),
                  "household": I("Her Household", "defend", "all_allies", [B(5)]),
                  "sniff": I("A Sniff", "buff", "all_allies", [ST("might", 1)]),
                  "cane": I("Silver Cane", "attack", "front", [D(6)])},
         ai=[{"use": "spyglass", "every": 3}, {"use": "household", "if": "ally_hurt", "not_twice": True},
             {"use": "sniff", "every": 4, "offset": 2}, {"use": "cane"}],
         lore="She paid for the spire so she could watch the stars stop. She is getting her money's worth.", world=W)

creature("patroness_monkey", "The Patroness's Monkey", "foe", 30, ranks=[4], role="afflicter",
         resist={"frost": "resist", "fire": "weak"},
         intents={"steal": I("Leap and Bite", "attack", "marked", [STEAL(), D(5)]),
                  "chatter": I("Chatter", "debuff", "back", [A("frost", 2, attr="stable")]),
                  "scamper": I("Scamper", "defend", "self", [SELF("dodge", 1)])},
         ai=[{"use": "scamper", "if": "hp_pct<50", "not_twice": True}, {"use": "chatter", "every": 3}, {"use": "steal"}],
         traits=[T("hit", "Light Fingers", "Struck by a hero with Momentum, it snatches the pace from them: it gains "
                   "1 Dodge.", [SELF("dodge", 1, if_="t.momentum>0")])],
         lore="It came up the spire on a brass chain for the last night. It stole a star-glass on the way.", world=W)

creature("speculum_bearer", "Speculum Bearer", "foe", 46, armor=1, ranks=[1, 2], role="defender",
         resist={"frost": "resist", "lightning": "resist", "fire": "weak"},
         intents={"wall": I("Mirror Wall", "defend", "self", [B(6), {"t": "guard_weakest"}]),
                  "edge": I("Edge-First", "attack", "front", [D(9)]),
                  "flash": I("The Mirror Flashes", "debuff", "random",
                             [A("frost", 1, attr="stable"), A("lightning", 1, attr="stable")])},
         ai=[{"use": "wall", "if": "ally_hurt", "not_twice": True}, {"use": "flash", "every": 3}, {"use": "edge"}],
         traits=[T("hit", "Face-Out", "Struck by a hero carrying any course, the mirror flashes it back: that hero gains "
                   "1 Static.", [A("lightning", 1, attr="stable", if_="t.spectrum>0")])],
         lore="The great mirror was too heavy for two men. They gave it to one.", world=W)

creature("clock_jack", "Clock Jack", "foe", 40, armor=1, ranks=[2], role="attacker", charge_name="Hours",
         resist={"frost": "resist", "lightning": "resist", "fire": "weak"},
         intents={"strike": I("Strike the Bell", "attack", "front", [D(6), ST("stun", 1), STRESS(10), CLR("charge")]),
                  "jerk": I("Hammer Jerk", "attack", "front", [D(7)]),
                  "hold": I("Hold the Hammer", "defend", "self", [B(8)])},
         ai=[{"use": "strike", "if": "charge>=3"}, {"use": "hold", "if": "hp_pct<50", "not_twice": True},
             {"use": "jerk"}],
         traits=[T("round_start", "Saving Up", "Round start: it saves 1 hour; at 3 it strikes the bell. Soak in its "
                   "works stops the saving.", [SELF("charge", 1, if_="!water")])],
         lore="It struck the hours. There have been none to strike. It has been saving up.", world=W)

creature("gate_mastiff", "Gate Mastiff", "foe", 42, armor=1, ranks=[1], role="attacker",
         resist={"frost": "resist", "fire": "weak"},
         intents={"bite": I("Chain-Length Bite", "attack", "front", [D(7), ST("anchor", 2)]),
                  "lunge": I("Lunge", "attack", "front", [D(10)]),
                  "snap": I("Snap", "attack", "marked", [D(6)])},
         ai=[{"use": "bite", "every": 3}, {"use": "snap", "every": 3, "offset": 1}, {"use": "lunge"}],
         traits=[T("hit", "Barks at Strangers", "Struck by a hero who moved this round, it lunges back: that hero takes "
                   "3.", [D(3, if_="t.moved")])],
         personality="mindless", lore="Chained at the gate to bark at strangers. It has not finished barking.", world=W)

# ================================================================== elites
creature("horologist", "The Horologist", "elite", 95, armor=2, ranks=[2, 3], role="support",
         resist={"frost": "resist", "lightning": "resist", "fire": "weak"},
         intents={"click": I("Click of the Watch", "debuff", "first_actor", [ST("lockdown", 1), A("frost", 1, attr="stable")]),
                  "rewind": I("Rewind", "heal", "all_allies", [H(8)]),
                  "spark": I("Escapement Spark", "attack", "back", [D(9), A("lightning", 2, attr="stable")]),
                  "wind": I("Wind the Watch", "buff", "all_allies", [ST("might", 1)]),
                  "unwind": I("Turn Back the Hands", "heal", "self", [CLEANSE(3), B(10)])},
         ai=[{"use": "unwind", "if": "spectrum>=2", "not_twice": True}, {"use": "rewind", "if": "ally_hurt", "not_twice": True},
             {"use": "click", "every": 3}, {"use": "wind", "every": 4, "offset": 2}, {"use": "spark"}],
         traits=[T("death", "The Hours Move Again", "On death: every hero sheds 2 ailment stacks.",
                   [CLEANSE(2, to="all_enemies")])],
         lore="The last astronomer. He keeps the hours from moving.", world=W)

creature("rime_colossus", "Rime Colossus", "elite", 125, armor=3, span=2, ranks=[1, 2], role="attacker",
         charge_name="Key",
         resist={"frost": "immune", "physical": "resist", "fire": "weak"},
         intents={"fist": I("Crushing Fist", "attack", "front", [D(15)]),
                  "grip": I("Freezing Grip", "attack", "front", [D(8), A("frost", 2, attr="stable")]),
                  "shards": I("Shard Storm", "attack", "all_heroes", [D(5), A("frost", 1, attr="stable")]),
                  "rewind": I("Rewinding", "charge", "self", [CLR("charge")]),
                  "shell": I("Ice Shell", "defend", "self", [B(12)])},
         ai=[{"use": "rewind", "if": "charge>=3"}, {"use": "shell", "if": "mark>0", "not_twice": True},
             {"use": "grip", "every": 3}, {"use": "shards", "every": 3, "offset": 1}, {"use": "fist"}],
         traits=[T("round_start", "The Key", "Round start: the key turns once. On the fourth turn it spends the round "
                   "rewinding and is Vulnerable.", [SELF("charge", 1), SELF("vulnerable", 1, if_="charge>=4")])],
         lore="An ice statue of the founder. Someone wound it up.", world=W)

creature("gin_ox", "The Gin Ox", "elite", 115, armor=3, ranks=[1], role="attacker", flags=["unstunnable"],
         resist={"frost": "resist", "fire": "weak"},
         intents={"shove": I("Head-Down Shove", "attack", "front2", [D(9)]),
                  "trudge": I("Trudge the Circle", "attack", "front", [D(12), PUSH(1)]),
                  "horn": I("Horn Hook", "attack", "rank2", [D(10)]),
                  "walk": I("Keep Walking", "heal", "self", [H(12), B(6)])},
         ai=[{"use": "walk", "if": "doom>=5", "not_twice": True}, {"use": "trudge", "every": 3},
             {"use": "horn", "every": 3, "offset": 1}, {"use": "shove"}],
         traits=[T("hit", "The Dome Has Stopped", "It cannot be Stunned. Each hit on it while it is Anchored or has Weaken "
                   "finds it still walking: it gains 2 Block for each of the two it has.",
                   [B(2, to="self", if_="frost>0"), B(2, to="self", if_="anchor>0")])],
         lore="It walked the dome round for forty years. The dome has stopped. It has not.", world=W)

creature("rodwarden", "The Rodwarden", "elite", 100, armor=2, ranks=[2, 3], role="afflicter",
         charge_name="Stored Strike",
         resist={"lightning": "resist", "frost": "resist", "fire": "weak"},
         intents={"plant": I("Plant the Pole", "attack", "front2", [D(6), A("lightning", 2, attr="stable"), SELF("charge", 1)]),
                  "strike": I("The Strike Comes Down", "attack", "random",
                              [D(14), A("lightning", 1, attr="volatile"), CLR("charge")]),
                  "ground": I("Frozen Ground", "debuff", "all_heroes", [A("frost", 1, attr="stable")]),
                  "mend": I("Mend the Rods", "defend", "self", [B(10)])},
         ai=[{"use": "strike", "if": "charge>=3"}, {"use": "mend", "if": "hp_pct<50", "not_twice": True},
             {"use": "ground", "every": 3}, {"use": "plant"}],
         traits=[T("round_start", "Lightning Rods", "Round start: he draws all Static off every foe into his rods and "
                   "stores 1 Strike per Static drawn.",
                   [CONS(e="lightning", to="all_allies"), SELF("charge", 0, per="consumed", k=1)])],
         lore="He kept the spire's rods so the lightning went into the ground. Then the ground froze.", world=W)

# ================================================================== rulers
creature("last_hour", "The Last Hour", "ruler", 300, armor=3, span=2, ranks=[3, 4], role="afflicter",
         charge_name="Minute Hand",
         resist={"frost": "resist", "lightning": "resist", "physical": "resist", "water": "weak"},
         intents={"strike": I("Strike the Hour", "attack", "front", [D(16)]),
                  "pendulum": I("Pendulum", "attack", "back2", [D(7)]),
                  "chime": I("The Chime", "debuff", "first_actor", [ST("lockdown", 2), STRESS(4)]),
                  "stop": I("Stop All Clocks", "debuff", "all_heroes",
                            [A("frost", 2, attr="stable"), A("lightning", 1, attr="stable"), STRESS(6)]),
                  "wind": I("Wind the Spring", "defend", "self", [B(16), SELF("might", 1)]),
                  "midnight": I("Midnight", "attack", "all_heroes", [D(8)] + LOCK + [CLR("charge")])},
         ai=[{"use": "midnight", "if": "charge>=10"}, {"use": "chime", "every": 3},
             {"use": "pendulum", "every": 3, "offset": 1}, {"use": "strike"}],
         phases=[P(60, "The hands spin backwards. Every plan must be read from its end.",
                   ai=[{"use": "midnight", "if": "charge>=10"}, {"use": "stop", "every": 3},
                       {"use": "chime", "every": 3, "offset": 1}, {"use": "wind", "if": "hp_pct<45", "not_twice": True},
                       {"use": "strike"}]),
                 P(25, "Twelve. The pivot is bare, and the world stops every second round.",
                   ai=[{"use": "midnight", "every": 2}, {"use": "strike"}], fx=[LOSE_ARMOR(3, to="self")])],
         traits=[T("round_start", "The Minute Hand", "Round start: the hand moves one minute toward twelve; at 10 it "
                   "strikes Midnight whatever its phase, and the hand starts again.", [SELF("charge", 1)])],
         lore="The great clock at the top of the spire. When it strikes twelve, the world stops. It is one minute to.",
         world=W)

creature("stilled_college", "The Stilled College", "ruler", 290, armor=3, span=2, ranks=[1, 2], role="afflicter",
         resist={"frost": "resist", "lightning": "resist", "fire": "weak"},
         intents={"vote": I("The Vote", "debuff", "first_actor", [D(6)] + LOCK),
                  "order": I("Point of Order", "debuff", "back", [A("frost", 2, attr="stable"), STRESS(6)]),
                  "arms": I("Forest of Arms", "attack", "front2", [D(9)]),
                  "minutes": I("Enter It in the Minutes", "defend", "self", [B(14)]),
                  "wave": I("The Wave Breaks", "attack", "all_heroes", [D(7), A("frost", 1, attr="stable")]),
                  "carried": I("The Motion Carried", "debuff", "all_heroes", list(LOCK))},
         ai=[{"use": "vote", "every": 2}, {"use": "order", "every": 3}, {"use": "minutes", "if": "hp_pct<70", "not_twice": True},
             {"use": "arms"}],
         phases=[P(50, "The motion carried. The wave breaks forward, and the Vote holds the whole company.",
                   ai=[{"use": "carried", "every": 3}, {"use": "wave", "every": 2}, {"use": "vote"}], might=1),
                 P(20, "Quorum fails. Every arm swings down at once.",
                   ai=[{"use": "carried", "every": 2}, {"use": "wave"}], might=1)],
         traits=[T("round_start", "Aye", "Round start: another vote carries: the motion gains 1 Might, up to 3.",
                   [SELF("might", 1, if_="might<3")]),
                 T("hit", "Out of Order", "Each hero who strikes it with 2 or more Momentum is ruled out of order: they "
                   "gain 1 Frost, then 1 Volatile Lightning.",
                   [A("frost", 1, attr="stable", if_="t.momentum>=2"),
                    A("lightning", 1, attr="volatile", if_="t.momentum>=2")])],
         lore="They voted to stop the hour. The motion carried.", world=W)

creature("great_refractor", "The Great Refractor", "ruler", 280, armor=4, span=2, ranks=[3, 4], role="afflicter",
         flags=["immovable"], charge_name="Drive",
         resist={"frost": "resist", "lightning": "resist", "water": "weak"},
         intents={"sight1": I("Sighted: Rank 1", "debuff", "front", [D(6), ST("stun", 1)]),
                  "sight2": I("Sighted: Rank 2", "debuff", "rank2", [D(6), ST("stun", 1)]),
                  "sight3": I("Sighted: Rank 3", "debuff", "rank3", [D(6), ST("stun", 1)]),
                  "sight4": I("Sighted: Rank 4", "debuff", "back", [D(6), ST("stun", 1), CLR("charge")]),
                  "swing": I("Counterweight", "attack", "front2", [D(10)]),
                  "lensf": I("Cracked Lens: Front", "attack", "front2", [D(6)] + LOCK),
                  "lensb": I("Cracked Lens: Rear", "attack", "back2", [D(6)] + LOCK + [CLR("charge")])},
         ai=[{"use": "sight4", "if": "charge>=4"}, {"use": "sight3", "if": "charge>=3"}, {"use": "sight2", "if": "charge>=2"},
             {"use": "sight1", "if": "charge>=1"}, {"use": "swing"}],
         phases=[P(50, "The lens cracks across. The sight covers two ranks, and the frosted glass locks both.",
                   ai=[{"use": "lensb", "if": "charge>=3"}, {"use": "lensf", "if": "charge>=1"}, {"use": "swing"}]),
                 P(20, "The pier groans. The tube swings as much as it sights.",
                   ai=[{"use": "lensb", "if": "charge>=3"}, {"use": "lensf", "if": "charge>=2"}, {"use": "swing"}],
                   might=2)],
         traits=[T("round_start", "The Drive", "Round start: the drive walks the sight one rank back (shown on its "
                   "intent); after rank 4 it rests a round.", [SELF("charge", 1)])],
         lore="Pointed at the heavens for three hundred years. Someone has turned it round.", world=W)

# ================================================================== encounters
E = encounter
E(W, "spire_f1", "The Orrery", "Brass in front, a pilgrim staring, a moth and its mender behind.",
  ["clock_sentry", "stopped_pilgrim", "aurora_moth", "gear_spider"], "spire_orrery", "foe",
  "The moth fuels locks, the sentry soaks, the spider rebuilds the sentry. Kill the moth, then the spider.")
E(W, "spire_f2", "The Clockwork Stair", "A halberd on the landing, a jack and a clerk above it.",
  ["frozen_halberdier", "clock_jack", "ephemeris_clerk"], "spire_stair", "foe",
  "The clerk writes your striker into the table while the Jack saves up. Kill the Jack before it strikes, or Soak it.")
E(W, "spire_f3", "Aurora Gallery", "Moths round a pilgrim who will not blink.",
  ["stopped_pilgrim", "aurora_moth", "aurora_moth"], "spire_top", "foe",
  "Stress and course fuel from every side; cleanse or burst the moths, and Swap only when it pays.")
E(W, "spire_f4", "The Gear Loft", "A sentry and the spiders that keep it running.",
  ["clock_sentry", "gear_spider", "gear_spider"], "spire_orrery", "foe",
  "Two rebuilds of the sentry. Water and focus fire on the spiders.")
E(W, "spire_f5", "The Gate", "A dog on its chain, a lady with a spyglass, and her monkey.",
  ["gate_mastiff", "patroness", "patroness_monkey"], "spire_dome", "foe",
  "Anchored front, Marked target, and a thief for the Block and Momentum you build.")
E(W, "spire_f6", "The Quadrangle", "The tortoise, a guard and the clerk who times them.",
  ["college_tortoise", "frozen_halberdier", "ephemeris_clerk"], "spire_stair", "foe",
  "An armoured, slow wall that shells up against long turns; Toxin and Armor-break pay off, long sequences do not.")
E(W, "spire_f7", "The Mirror Stair", "A mirror on the stair, a jack behind it, a moth above.",
  ["speculum_bearer", "clock_jack", "aurora_moth"], "spire_top", "foe",
  "The mirror guards the weak and returns courses as Static; use physical damage.")
E(W, "spire_f8", "The Star Tables", "Four small hands, each with its own way to stop you.",
  ["stopped_pilgrim", "ephemeris_clerk", "patroness_monkey", "aurora_moth"], "spire_dome", "foe",
  "Four small locks and thefts: a fight against plans, not HP.")
E(W, "spire_e1", "The Horologist's Study", "He has been waiting for you, for ever.",
  ["horologist", "frozen_halberdier", "ephemeris_clerk"], "spire_stair", "elite",
  "He locks a hero, rewinds wounds and winds back your course setups; his death frees every lock.")
E(W, "spire_e2", "The Founder Stands", "Someone wound up the statue.",
  ["rime_colossus", "aurora_moth", "stopped_pilgrim"], "spire_top", "elite",
  "Hold burst for the round its key runs down; a Mark only makes it shell up.")
E(W, "spire_e3", "The Undercroft", "The ox still walks its circle under the dome.",
  ["gin_ox", "clock_sentry", "gear_spider"], "spire_orrery", "elite",
  "The ox and the sentry shrug off locks and stuns; Block for the beam, damage the sentry first.")
E(W, "spire_e4", "The Rod Gallery", "Rods on the roof, a mirror at the door.",
  ["rodwarden", "speculum_bearer", "aurora_moth"], "spire_dome", "elite",
  "He grounds the company's lightning into his own strike; switch courses or strike physically.")
E(W, "spire_r_last_hour", "The Last Hour", "One minute to midnight.",
  ["clock_sentry", "clock_jack", "last_hour"], "spire_boss", "ruler",
  "Countdown fight: the Jack and the hand share the clock; Ward and cleanse before each Chime.")
E(W, "spire_r_stilled_college", "The Stilled College", "The chapter is in session.",
  ["stilled_college", "ephemeris_clerk", "patroness"], "spire_boss", "ruler",
  "Two kinds of lock plus a Mark, and Momentum is ruled out of order; break the chain before the motion carries.",
  props="stilled_college")
E(W, "spire_r_great_refractor", "The Great Refractor", "The telescope is aimed down the stair.",
  ["speculum_bearer", "gear_spider", "great_refractor"], "spire_boss", "ruler",
  "Read the sight a round ahead and Swap out of it.", props="great_refractor")

NEEDS = [
    "clock_sentry, gin_ox: should also ignore Lockdown (flag 'unlockable'); written as unstunnable.",
    "last_hour Stop All Clocks: the company's Ordo should resolve in reverse for a round; written as frost, Static and "
    "stress. The Minute Hand should also move once more for each hero it locked last round.",
    "stilled_college Aye: should gain Might per locked hero (quantity 'heroes_locked'); written as 1 a round up to 3.",
    "great_refractor: the sight should be a rank resolved when it acts, so a Swap dodges it; the assistant on the "
    "ladder (rank 4 behind the pier) is left out.",
    "gear_spider Rebuild: should rebuild the brass ally that fell (Sentry or Jack); written as a Clock Sentry.",
    "patroness_monkey: should steal the hero's next buff (Prime, Might, Momentum) and jump ranks at round start; "
    "written as stealing Block.",
    "speculum_bearer Face-Out: should return the course laid on it to the hero who laid it (course trait target "
    "'source'); written as a hit trait giving Static.",
]
