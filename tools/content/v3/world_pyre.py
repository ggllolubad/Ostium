"""World XIII: The Black Pyre (fire + void, Hollow Flame). Role map: docs/design/gate2/world_XIII_black_pyre.md.
Bible: art/party/bible/world_XIII_black_pyre.md and RIVAL_RULERS.md. Base numbers at Threat 0."""
from dsl import *
from creatures import *

WARD = W  # the Ward helper; W is the world key below
W = "pyre"
set_class("world_" + W, [1, 2, 3, 4], [1, 2, 3, 4])

# Hollow Flame on a hero: a Stable Erode, then a Volatile Burn that sets it off (power n + the Erode it consumes).
def HF(n=1, **kw):
    return [A("void", n, attr="stable", **kw), A("fire", n, attr="volatile", **kw)]

FIRE_LIVES = {"fire": "resist", "water": "weak"}

# ================================================================== rulers
creature("saint_unending", "The Saint Unending", "ruler", 285, armor=2, span=2, ranks=[3, 4], role="afflicter",
         resist={"fire": "immune", "void": "resist", "water": "weak"},
         intents={
             "pyre": I("Pyre of the Faithful", "attack", "all_heroes", [D(4), A("fire", 1, attr="stable")]),
             "gaze": I("Martyr's Gaze", "debuff", "all_heroes", [STRESS(10)]),
             "hollow": I("Hollow Flame", "attack", "front", [D(10)] + HF(1)),
             "chains": I("Chains of Devotion", "attack", "back", [D(8), PULL(2), ST("anchor", 1)]),
             "prayer": I("Unending Prayer", "buff", "self", [B(16), SELF("might", 1)]),
             "black": I("The Black Pyre", "attack", "all_heroes", [D(3)] + HF(1)),
         },
         ai=[{"use": "gaze", "every": 3}, {"use": "pyre", "every": 3, "offset": 1}, {"use": "hollow"}],
         phases=[
             P(60, "The flame turns black. Every fire she lays now burns without end.", might=1,
               ai=[{"use": "chains", "every": 3}, {"use": "black", "every": 3, "offset": 1},
                   {"use": "prayer", "every": 4, "offset": 2}, {"use": "hollow"}]),
             P(25, "Nothing is left of her but the fire.", might=1,
               ai=[{"use": "black", "every": 2}, {"use": "gaze", "every": 4, "offset": 1}, {"use": "hollow"}]),
         ],
         traits=[
             T("round_start", "The Fire Does Not Stop", "Round start: every hero who is Burning gains 1 Burn.",
               [A("fire", 1, attr="stable", to="all_enemies", if_="t.fire>0")]),
             T("round_start", "Burning Out", "Below a quarter of her HP the fire eats her too: she loses 8 HP each round.",
               [SELFDMG(8, if_="hp_pct<25")]),
         ],
         lore="She was burned for heresy. She has been burning for nine hundred years, and she has not stopped praying.",
         world=W)

creature("iron_bull", "The Iron Bull", "ruler", 300, armor=3, span=2, ranks=[1, 2], role="afflicter",
         resist={"fire": "resist", "void": "resist", "physical": "resist", "water": "weak"},
         intents={
             "ram": I("Ram", "attack", "front", [D(13)]),
             "horn": I("Snapped Horn", "attack", "front2", [D(6)]),
             "bellow": I("The Bellow", "attack", "all_heroes", [STRESS(6)] + HF(1)),
             "stoke": I("Stoke the Hearth", "buff", "self", [B(12), SELF("might", 1)]),
             "seams": I("The Seams Split", "attack", "all_heroes", [D(3), STRESS(10)] + HF(1)),
             "trample": I("Iron Weight", "attack", "front", [D(18)]),
         },
         ai=[{"use": "bellow", "every": 3}, {"use": "horn", "every": 3, "offset": 1},
             {"use": "stoke", "every": 5, "offset": 2}, {"use": "ram"}],
         phases=[
             P(50, "The seams split. The voices inside are heard all at once.", might=1,
               ai=[{"use": "seams", "every": 2}, {"use": "horn", "every": 4, "offset": 1}, {"use": "ram"}]),
             P(20, "The hearth roars. The bull walks off its bricks.", might=1,
               ai=[{"use": "seams", "every": 2}, {"use": "trample"}]),
         ],
         traits=[
             T("round_start", "The Hearth", "Round start: the hearth heats it (+1 Might). If it is Soaked, the heat goes out instead and it loses all its Might.",
               [CLR("might", if_="water>0"), SELF("might", 1, if_="!water")]),
         ],
         lore="The heretics were put inside to be heard. They are still being heard.",
         world=W)

creature("recanter", "Recanter", "foe", 30, ranks=[2, 3], role="afflicter", resist=FIRE_LIVES,
         intents={
             "tip": I("Tip the Candle", "attack", "random", [D(4)] + HF(1)),
             "drip": I("Black Wax", "debuff", "front2", [A("fire", 2, attr="stable")]),
             "recant": I("Recant", "defend", "self", [B(9)]),
         },
         ai=[{"use": "recant", "if": "hp_pct<50", "not_twice": True}, {"use": "drip", "every": 3}, {"use": "tip"}],
         traits=[T("hit", "Afraid to Arrive", "When hit, it shuffles back one rank.", [RET(1, to="self")])],
         lore="He recanted, and was spared the fire. He must wear the coat until he dies. He has not died.",
         world=W)

creature("confessor", "The Confessor", "ruler", 270, armor=3, span=2, ranks=[3, 4], role="summoner",
         resist={"fire": "resist", "void": "resist", "water": "weak"},
         intents={
             "grille": I("To the Grille", "debuff", "back", [PULL(3), STEAL()] + HF(1)),
             "call": I("Call a Penitent", "summon", "self", [SUMMON("recanter", max=3)]),
             "hand": I("The Charred Hand", "attack", "front", [D(13)]),
             "penance": I("Penance", "attack", "all_heroes", [D(5)]),
             "absolve": I("Absolution", "heal", "all_allies", [H(8)]),
             "burn": I("Then Burn", "attack", "all_heroes", [STRESS(5)] + HF(1)),
             "whisper": I("The Penitents Whisper", "debuff", "all_heroes", [STRESS(10)]),
         },
         ai=[{"use": "call", "every": 3}, {"use": "absolve", "if": "ally_hurt75", "not_twice": True},
             {"use": "grille", "every": 2}, {"use": "hand"}],
         phases=[
             P(50, "Then burn, to be certain.", might=1,
               ai=[{"use": "burn", "every": 2}, {"use": "call", "every": 3, "offset": 1},
                   {"use": "whisper", "every": 4, "offset": 3}, {"use": "penance"}]),
             P(20, "The curtain burns away. There is no more absolution.", might=1,
               ai=[{"use": "burn", "every": 2}, {"use": "grille", "every": 3, "offset": 1}, {"use": "hand"}]),
         ],
         traits=[T("hit", "The Grille", "A hero who strikes it confesses: they lose all their Block and Momentum.",
                   [CONS(s="block"), CONS(s="momentum")])],
         lore="Confess, and be forgiven. Then burn, to be certain.",
         world=W)

# ================================================================== elites
creature("unburnt_inquisitor", "The Unburnt Inquisitor", "elite", 105, armor=2, ranks=[2, 3], role="afflicter",
         personality="cruel", resist={"fire": "immune", "void": "weak"},
         intents={
             "accuse": I("Accuse", "debuff", "most_stress", [STRESS(8), ST("mark", 1)]),
             "sentence": I("The Sentence", "attack", "most_stress", [D(10), A("fire", 2, attr="stable")]),
             "verdict": I("Verdict", "attack", "front", [D(13, pierce=True)]),
             "absolve": I("Absolve", "heal", "all_allies", [H(8)]),
         },
         ai=[{"use": "absolve", "if": "ally_hurt75", "not_twice": True}, {"use": "accuse", "every": 3},
             {"use": "sentence", "every": 3, "offset": 2}, {"use": "verdict"}],
         traits=[T("round_start", "The Accused", "Round start: every Marked hero gains 4 stress.",
                   [STRESS(4, to="all_enemies", if_="t.mark>0")])],
         lore="He burned a thousand saints and never caught alight himself. He wonders why.",
         world=W)

creature("pyre_seraph", "Pyre Seraph", "elite", 120, armor=2, span=2, ranks=[1, 2], role="attacker",
         resist={"fire": "resist", "physical": "resist", "void": "weak"},
         intents={
             "dive": I("Dive of Black Fire", "attack", "front", [D(11)] + HF(1)),
             "wings": I("Ash Wings", "attack", "all_heroes", [D(5), A("fire", 1, attr="stable")]),
             "beat": I("Six Wings Beat", "attack", "back2", [D(7)]),
             "rise": I("Rise Out of Reach", "defend", "self", [B(10), SELF("dodge", 2)]),
         },
         ai=[{"use": "rise", "if": "hp_pct<50", "not_twice": True}, {"use": "wings", "every": 3},
             {"use": "beat", "every": 3, "offset": 2}, {"use": "dive"}],
         traits=[T("death", "Scattered Ash", "On death: its ash scatters; every hero catches 1 Erode and 1 Volatile Burn (Hollow Flame).",
                   HF(1, to="all_enemies"))],
         lore="An angel sent to put out the pyre. It went in to look.",
         world=W)

creature("questioner", "The Questioner", "elite", 110, armor=3, ranks=[1, 2], role="afflicter", charge_name="Irons",
         resist={"fire": "resist", "void": "resist", "water": "weak"},
         intents={
             "iron": I("Put to the Question", "attack", "front", [D(8)] + HF(1)),
             "irons": I("Every Iron in the Fire", "attack", "front2", [D(6), CLR("charge")] + HF(2)),
             "tongs": I("The Tongs", "attack", "back", [D(8), PULL(1)]),
             "turn": I("Turn the Irons", "defend", "self", [B(12), SELF("charge", 1)]),
         },
         ai=[{"use": "irons", "if": "charge>=4"}, {"use": "turn", "if": "hp_pct<50", "not_twice": True},
             {"use": "tongs", "every": 3}, {"use": "iron"}],
         traits=[T("round_start", "The Brazier", "Round start: he heats one more iron.", [SELF("charge", 1)])],
         lore="He asks each question once. He has a great many irons in the fire.",
         world=W)

creature("bellows_sister", "The Bellows Sister", "elite", 100, armor=2, ranks=[2, 3], role="support",
         resist={"fire": "resist", "void": "resist", "water": "weak"},
         intents={
             "pump": I("Hard Pump", "attack", "front2", [D(5)] + HF(1)),
             "feed": I("Feed the Fire", "debuff", "all_heroes", [A("fire", 1, attr="stable")]),
             "poker": I("Fire-Iron", "attack", "front", [D(11)]),
             "tinder": I("Tinder and Charcoal", "buff", "all_allies", [ST("might", 1), B(5)]),
         },
         ai=[{"use": "feed", "every": 3}, {"use": "tinder", "every": 4, "offset": 1}, {"use": "pump", "every": 2},
             {"use": "poker"}],
         traits=[T("death", "The Fire Burns Low", "On death: for the first time in nine hundred years the fire burns low; every hero loses 2 ailment stacks.",
                   [CLEANSE(2, to="all_enemies")])],
         lore="Nine hundred years at the bellows. The fire has not once burned low.",
         world=W)

# ================================================================== foes
creature("ash_penitent", "Ash Penitent", "foe", 38, ranks=[1], role="attacker", resist=FIRE_LIVES,
         intents={
             "flail": I("Chain Flail", "attack", "front", [D(3, times=2)]),
             "penance": I("Penance", "debuff", "back", [STRESS(8), A("void", 1, attr="stable")]),
             "scourge": I("Scourge", "attack", "front2", [D(4)]),
         },
         ai=[{"use": "penance", "every": 3}, {"use": "scourge", "every": 3, "offset": 1}, {"use": "flail"}],
         traits=[T("round_start", "Self-Scourging", "Round start: it whips itself, losing 2 HP and gaining 1 Might.",
                   [SELFDMG(2), SELF("might", 1)])],
         lore="It whips itself with the chain between swings at you. It does not notice the difference.",
         world=W)

creature("cinder_hound", "Cinder Hound", "foe", 34, ranks=[1, 2], role="attacker", personality="mindless",
         resist={"fire": "immune", "void": "resist", "water": "weak"},
         intents={
             "hunt": I("Smell the Dying", "attack", "weakest", [D(8), A("fire", 1, attr="stable")]),
             "ember": I("Ember Bite", "attack", "weakest", [D(4), A("fire", 2, attr="stable")]),
             "maul": I("Cinder Maul", "attack", "front", [D(7)]),
         },
         ai=[{"use": "hunt", "if": "hero_dd"}, {"use": "ember", "every": 3}, {"use": "hunt", "every": 2}, {"use": "maul"}],
         lore="It runs on ash and smells the dying.",
         world=W)

creature("censer_deacon", "Censer Deacon", "foe", 36, ranks=[2, 3], role="support",
         resist={"fire": "resist", "void": "resist", "water": "weak"},
         intents={
             "smoke": I("Black Incense", "debuff", "all_heroes", [A("void", 1, attr="stable"), STRESS(4)]),
             "rite": I("Last Rite", "heal", "ally_lowest", [H(10)]),
             "swing": I("Censer Swing", "attack", "front", [D(6), A("fire", 1, attr="stable")]),
             "cense": I("Cense the Faithful", "defend", "all_allies", [B(5)]),
         },
         ai=[{"use": "rite", "if": "ally_hurt", "not_twice": True}, {"use": "smoke", "every": 2},
             {"use": "cense", "every": 4, "offset": 1}, {"use": "swing"}],
         lore="Its censer burns something that was once a saint.",
         world=W)

creature("candle_wraith", "Candle Wraith", "foe", 28, ranks=[3, 4], role="afflicter",
         resist={"fire": "immune", "physical": "resist", "water": "weak"},
         intents={
             "flare": I("Flare", "attack", "back", [D(4)] + HF(1)),
             "glow": I("Hollow Glow", "debuff", "all_heroes", [A("void", 1, attr="stable")]),
             "gutter": I("Gutter", "attack", "random", [D(6)]),
         },
         ai=[{"use": "glow", "every": 3}, {"use": "flare", "every": 2}, {"use": "gutter"}],
         traits=[T("round_start", "It Lights Again", "Round start: unless it is Soaked, its flame feeds it and it heals 4.",
                   [H(4, if_="!water")])],
         lore="A skull in a black flame. Blow it out and it lights again.",
         world=W)

creature("pyre_knight", "Pyre Knight", "foe", 50, armor=2, ranks=[1], role="defender",
         resist={"fire": "resist", "physical": "resist", "water": "weak"},
         intents={
             "guard": I("Guard the Pyre", "defend", "all_allies", [B(6)]),
             "mace": I("Black Mace", "attack", "front", [D(6)] + HF(1)),
             "bash": I("Shield Torch", "attack", "front", [D(10)]),
         },
         ai=[{"use": "guard", "if": "ally_hurt", "not_twice": True}, {"use": "mace", "every": 2}, {"use": "bash"}],
         lore="He lit the pyre. He stands guard so it is never put out.",
         world=W)

creature("belfry_bats", "Belfry Bats", "foe", 34, ranks=[3, 4], role="attacker", flags=["swarm"],
         resist={"fire": "resist", "void": "resist", "physical": "weak"},
         intents={
             "dive": I("The Swirl Dives", "attack", "back", [D(2, times=2)] + HF(1)),
             "swirl": I("Shrieking Swirl", "attack", "all_heroes", [D(2), A("fire", 1, attr="stable")]),
         },
         ai=[{"use": "swirl", "every": 3}, {"use": "dive"}],
         lore="The bell tower burned. The bats did not leave.",
         world=W)

creature("familiar", "The Familiar", "foe", 32, ranks=[1, 2], role="attacker", resist=FIRE_LIVES,
         intents={
             "butt": I("Rearing Butt", "attack", "front", [D(5), PUSH(1)] + HF(1)),
             "stamp": I("Stamp", "attack", "front", [D(8)]),
             "horns": I("Lowered Horns", "attack", "rank2", [D(7)]),
         },
         ai=[{"use": "butt", "every": 2}, {"use": "horns", "every": 3}, {"use": "stamp"}],
         lore="The court found it guilty of being her familiar. It was burned beside her. It walked out of the ash first.",
         world=W)

creature("faggot_bearer", "Faggot-Bearer", "foe", 48, armor=2, ranks=[1, 2], role="defender", resist=FIRE_LIVES,
         intents={
             "tip": I("Tip the Bundles", "attack", "front", [D(6), A("fire", 2, attr="stable")]),
             "load": I("Shoulder the Load", "defend", "self", [B(6), GUARD(to="behind")]),
             "hatchet": I("Hatchet", "attack", "front", [D(9)]),
         },
         ai=[{"use": "load", "if": "ally_hurt", "not_twice": True}, {"use": "tip", "every": 2}, {"use": "hatchet"}],
         traits=[T("hit", "Burning Load", "A hero who strikes it catches 1 Burn from the load.", [A("fire", 1, attr="stable")])],
         lore="Every pyre needs wood. He has carried enough for nine hundred years of them.",
         world=W)

creature("scold", "The Scold", "foe", 32, ranks=[2], role="afflicter", personality="cruel",
         resist={"fire": "resist", "void": "resist", "water": "weak"},
         intents={
             "cry": I("Choked Cry", "attack", "most_stress", [STRESS(6)] + HF(1)),
             "strain": I("Strain at the Gag", "debuff", "all_heroes", [STRESS(5)]),
             "fiddle": I("Neck-Fiddle", "attack", "front", [D(7)]),
         },
         ai=[{"use": "cry", "every": 2}, {"use": "strain", "every": 3, "offset": 1}, {"use": "fiddle"}],
         traits=[T("death", "He Finally Says It", "On death: he says it at last; every hero sheds 8 stress.",
                   [STRESS(-8, to="all_enemies")])],
         lore="He cried out in the nave that the saint was innocent. They gave him a mask with an iron tongue. He is still trying to say it.",
         world=W)

creature("ash_pardoner", "Ash Pardoner", "foe", 32, ranks=[3, 4], role="support", resist=FIRE_LIVES,
         intents={
             "pardon": I("Sell a Pardon", "buff", "ally_lowest", [CLEANSE(3)]),
             "ash": I("A Pinch of Saint's Ash", "attack", "random", [D(4)] + HF(1)),
             "indulgence": I("Indulgence", "heal", "ally_lowest", [H(8)]),
             "relic": I("Forged Relic", "buff", "all_allies", [ST("might", 1)]),
         },
         ai=[{"use": "pardon", "if": "total_hex>=3", "not_twice": True}, {"use": "pardon", "if": "total_doom>=3", "not_twice": True},
             {"use": "indulgence", "if": "ally_hurt75", "not_twice": True}, {"use": "pardon", "every": 3},
             {"use": "relic", "every": 5, "offset": 2}, {"use": "ash"}],
         lore="A pinch of saint's ash, sealed in lead, for every sin. He has sold her many times over.",
         world=W)

creature("charred_destrier", "Charred Destrier", "foe", 46, armor=1, ranks=[1], role="attacker",
         resist={"fire": "resist", "void": "resist", "water": "weak"},
         intents={
             "hooves": I("Both Forehooves", "attack", "front", [D(4, times=2)]),
             "stake": I("It Knows the Way", "attack", "most_burn", [D(11)]),
             "toss": I("Head Toss", "attack", "front2", [D(5)]),
         },
         ai=[{"use": "stake", "every": 3}, {"use": "toss", "every": 3, "offset": 1}, {"use": "hooves"}],
         lore="It carried the knights to the pyre. It still knows the way.",
         world=W)

# ================================================================== encounters
E = lambda *a, **k: encounter(W, *a, **k)
E("pyre_f1", "The Penitents' Walk", "They flog themselves down the nave.", ["ash_penitent", "ash_penitent", "censer_deacon"],
  "pyre_nave", "foe", "The penitents grow stronger by hurting themselves; kill them before the Might stacks.")
E("pyre_f2", "The Stake Field", "Hounds sniff the ashes of the burned.", ["cinder_hound", "cinder_hound", "ash_penitent"],
  "pyre_stake", "foe", "Hounds hunt the weakest hero; keep no one low.")
E("pyre_f3", "Candle Crypt", "A knight keeps the candles burning.", ["pyre_knight", "candle_wraith", "candle_wraith"],
  "pyre_crypt", "foe", "Wraiths feed on their own flame; Soak them or kill them fast.")
E("pyre_f4", "The Black Choir", "A silenced brother, a censer, and a knight to keep them.", ["pyre_knight", "scold", "censer_deacon"],
  "pyre_nave", "foe", "A guarded stress engine; reach rank 3.")
E("pyre_f5", "The Way to the Stake", "A riderless horse and a goat that walked out of the ash.",
  ["charred_destrier", "familiar", "recanter"], "pyre_stake", "foe",
  "The Familiar knocks a hero back into the Recanter's wax.")
E("pyre_f6", "The Pardoner's Steps", "Pardons for sale, bats in the rafters.", ["faggot_bearer", "ash_pardoner", "belfry_bats"],
  "pyre_crypt", "foe", "The pardoner lifts your Hex and Doom; kill him first.")
E("pyre_f7", "Four Small Fires", "The spared and the silenced.", ["scold", "recanter", "ash_pardoner", "belfry_bats"],
  "pyre_nave", "foe", "Four small fires; cleanse or race.")
E("pyre_f8", "The Woodpile", "He has brought enough for another pyre.", ["faggot_bearer", "cinder_hound", "belfry_bats"],
  "pyre_stake", "foe", "The bearer guards the hound; striking him costs a Burn.")
E("pyre_e1", "The Tribunal", "The inquisitor reads your names aloud.", ["pyre_knight", "unburnt_inquisitor", "scold"],
  "pyre_crypt", "elite", "The tribunal: the accused is Marked and burned; fire does nothing to him.")
E("pyre_e2", "The Fallen Seraph", "It came to put out the fire.", ["pyre_seraph", "candle_wraith"],
  "pyre_stake", "elite", "Kill it with Ward up: its death scatters Hollow Flame.")
E("pyre_e3", "Put to the Question", "The irons are hot. He has time.", ["questioner", "recanter", "ash_pardoner"],
  "pyre_crypt", "elite", "Every round adds an iron; burst him early, and spend your Hex before the pardoner sells it off.")
E("pyre_e4", "The Bellows", "She has not let the fire burn low once.", ["ash_penitent", "bellows_sister", "censer_deacon"],
  "pyre_nave", "elite", "She feeds every flame on the company; kill her and the fire burns low.")
E("pyre_r_saint_unending", "The Saint Unending", "She is still burning, and still praying.",
  ["faggot_bearer", "censer_deacon", "saint_unending"], "pyre_boss", "ruler",
  "Feed the race or cleanse it; the bearer and the deacon keep her burning.")
E("pyre_r_iron_bull", "The Iron Bull", "It has walked out to the burning ground for the Saint's Tooth.",
  ["iron_bull", "familiar", "belfry_bats"], "pyre_boss", "ruler",
  "Water resets its heat; the Familiar disrupts the ranks.", props="iron_bull")
E("pyre_r_confessor", "The Confessor", "The confessional hears your sins from across the nave.",
  ["pyre_knight", "recanter", "confessor"], "pyre_boss", "ruler",
  "Rank 2 refills with Recanters; Block and Momentum are spent, not stored.", props="confessor")

# ================================================================== world cards (Hollow Flame: glue, each reads or converts state)
card("w_pyre_penitent_lash", "Penitent's Lash", 1, "W", "enemy",
     [SELFDMG(3), D(0, per="scars", k=1, max=10, pierce=True)],
     "Lose 3 HP. Deal 1 per Scar you carry, up to 10, ignoring Block.", world=W, arch="world",
     flavour="It whips itself between swings at you. It does not notice the difference.",
     note="A hero lays a chain flail across their own back, then across a Pyre Knight's shield, ash flying.",
     up={"text": "Lose 3 HP. Deal 1 per Scar you carry, up to 14, ignoring Block.",
         "fx": [SELFDMG(3), D(0, per="scars", k=1, max=14, pierce=True)]})
card("w_pyre_saints_ash", "Saint's Ash", 1, "W", "ally", [CONS(e="fire"), WARD(1, per="consumed", k=1)],
     "Remove all Burn from a hero. They gain 1 Ward, plus 1 per Burn removed.", world=W, arch="world",
     flavour="A pinch of her, sealed in lead. Genuine, this time.",
     note="A hero breaks a lead vial over a burning companion; grey ash settles and the black flame gutters out.",
     up={"text": "Remove all Burn from a hero. They gain 2 Ward, plus 1 per Burn removed.",
         "fx": [CONS(e="fire"), WARD(2, per="consumed", k=1)]})
card("w_pyre_fire_unending", "The Fire Unending", 2, "W", "none", [],
     "Rite. At the end of each round, every foe takes 1 per course on it, ignoring Block, and every hero loses 1 HP. Exhaust.",
     kw=["Rite", "Exhaust"], world=W, arch="world",
     rite={"on": "round_end", "fx": [D(0, per="t.spectrum", k=1, pierce=True, to="all_enemies"), SELFDMG(1, to="all_allies")]},
     flavour="It gives no light, and it does not go out. It does not care whose it is.",
     note="A hero touches a black taper to the floor; violet-edged flame runs under foes and company alike.",
     up={"text": "Rite. At the end of each round, every foe takes 1 per course on it, ignoring Block. Exhaust.",
         "rite": {"on": "round_end", "fx": [D(0, per="t.spectrum", k=1, pierce=True, to="all_enemies")]}})
card("w_pyre_black_wax", "Black Wax", 1, "W", "enemy", [A("void", 1), D(2, per="t.ailments", k=1, pierce=True)],
     "Apply 1 Void. Deal 2, plus 1 per ailment on the foe, ignoring Block.", cat="void", attr="stable", world=W, arch="world",
     flavour="Where the black wax lands it leaves clean round holes.",
     note="A hero tips a Recanter's candle over a foe; black wax runs and punches holes where it lands.",
     up={"text": "Apply 2 Void. Deal 3, plus 1 per ailment on the foe, ignoring Block.",
         "fx": [A("void", 2), D(3, per="t.ailments", k=1, pierce=True)]})

NEEDS = [
    "confessor: 'The Grille' should strip one buff (any helpful status) from only the first hero to strike it each round; written as losing all Block and Momentum on every hit.",
    "candle_wraith: on death it should light again once next round at half HP unless Soaked (a self-revive); written as healing 4 each round while not Soaked.",
    "bellows_sister: on death every hero's Burn should halve, and 'Hard Pump' should also heat the company's fire on foes; written as 2 ailment stacks cleansed from every hero.",
    "saint_unending: a quantity for whether a unit carries Hollow Flame, so 'burns hotter' reads only Hollow Flame; written as any hero with Burn.",
    "ash_pardoner: 'Sell a Pardon' should pick the foe carrying the most Hex, Doom or Mark (an intent target); written as the most wounded foe, chosen when the company has laid 3+ Hex or Doom.",
    "faggot_bearer: the 'Burning Load' hit trait should fire only on melee hits; the hit trigger cannot tell melee from ranged.",
]
